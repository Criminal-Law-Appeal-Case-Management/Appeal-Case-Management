"""
Payment Router for Appeal Case Manager
Supports PayPal and PayID (Australian bank transfer) payment methods
"""
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
from config import db, logger
from auth_utils import get_current_user
import os
import paypalrestsdk

router = APIRouter(prefix="/api/payments", tags=["payments"])

# Fixed pricing - NEVER accept amounts from frontend
FEATURE_PRICES = {
    "full_report": {"price": 29.00, "currency": "AUD", "name": "Full Detailed Report"},
    "extensive_report": {"price": 39.00, "currency": "AUD", "name": "Extensive Log Report"},
    "grounds_of_merit": {"price": 50.00, "currency": "AUD", "name": "Grounds of Merit Analysis"},
}

# PayID Configuration for bank transfers
PAYID_CONFIG = {
    "payid": "djkingy79@gmail.com",
    "payid_type": "email",
    "account_name": "Deb King - Appeal Case Manager",
    "bank_name": "Commonwealth Bank",
    "reference_prefix": "ACM"
}

# PayPal Configuration
PAYPAL_CLIENT_ID = os.environ.get('PAYPAL_CLIENT_ID', '')
PAYPAL_CLIENT_SECRET = os.environ.get('PAYPAL_CLIENT_SECRET', '')
PAYPAL_MODE = os.environ.get('PAYPAL_MODE', 'sandbox')
PAYPAL_CONFIGURED = False

if PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET:
    try:
        paypalrestsdk.configure({
            "mode": PAYPAL_MODE,
            "client_id": PAYPAL_CLIENT_ID,
            "client_secret": PAYPAL_CLIENT_SECRET
        })
        PAYPAL_CONFIGURED = True
        logger.info(f"PayPal configured in {PAYPAL_MODE} mode")
    except Exception as e:
        logger.warning(f"PayPal configuration failed: {e}")


class PayPalOrderRequest(BaseModel):
    feature_type: str
    case_id: str
    return_url: str
    cancel_url: str


class PayIDPaymentRequest(BaseModel):
    feature_type: str
    case_id: str


class VerifyPayIDRequest(BaseModel):
    reference: str
    case_id: str
    feature_type: str


@router.get("/prices")
async def get_prices():
    """Get feature prices"""
    return FEATURE_PRICES


@router.get("/methods")
async def get_payment_methods():
    """Get available payment methods"""
    return {
        "paypal": {
            "enabled": PAYPAL_CONFIGURED,
            "name": "PayPal",
            "description": "Pay securely with PayPal, credit/debit card",
            "supports": ["Credit Card", "Debit Card", "PayPal Balance"]
        },
        "payid": {
            "enabled": True,
            "name": "PayID / Bank Transfer",
            "description": "Instant Australian bank transfer using PayID",
            "supports": ["Australian Bank Accounts", "Instant Transfer"],
            "payid": PAYID_CONFIG["payid"],
            "payid_type": PAYID_CONFIG["payid_type"],
            "account_name": PAYID_CONFIG["account_name"]
        }
    }


# ============ PAYPAL ENDPOINTS ============

@router.post("/paypal/create-order")
async def create_paypal_order(req: PayPalOrderRequest, request: Request):
    """Create a PayPal payment order"""
    user = await get_current_user(request)
    
    if not PAYPAL_CONFIGURED:
        raise HTTPException(status_code=503, detail="PayPal is not configured")
    
    if req.feature_type not in FEATURE_PRICES:
        raise HTTPException(status_code=400, detail="Invalid feature type")
    
    feature = FEATURE_PRICES[req.feature_type]
    
    try:
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": req.return_url,
                "cancel_url": req.cancel_url
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": feature["name"],
                        "sku": req.feature_type,
                        "price": str(feature["price"]),
                        "currency": feature["currency"],
                        "quantity": 1
                    }]
                },
                "amount": {
                    "total": str(feature["price"]),
                    "currency": feature["currency"]
                },
                "description": f"Criminal Appeal AI - {feature['name']} for Case {req.case_id}"
            }]
        })
        
        if payment.create():
            # Store payment record
            await db.payment_transactions.insert_one({
                "payment_id": payment.id,
                "user_id": user.user_id,
                "case_id": req.case_id,
                "feature_type": req.feature_type,
                "amount": feature["price"],
                "currency": feature["currency"],
                "method": "paypal",
                "status": "created",
                "created_at": datetime.now(timezone.utc).isoformat()
            })
            
            # Find approval URL
            approval_url = None
            for link in payment.links:
                if link.rel == "approval_url":
                    approval_url = link.href
                    break
            
            return {
                "payment_id": payment.id,
                "approval_url": approval_url,
                "status": "created"
            }
        else:
            logger.error(f"PayPal payment creation failed: {payment.error}")
            raise HTTPException(status_code=500, detail=f"Payment creation failed: {payment.error}")
            
    except Exception as e:
        logger.error(f"PayPal error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/paypal/execute")
async def execute_paypal_payment(payment_id: str, payer_id: str, request: Request):
    """Execute an approved PayPal payment"""
    await get_current_user(request)  # Verify user is authenticated
    
    if not PAYPAL_CONFIGURED:
        raise HTTPException(status_code=503, detail="PayPal is not configured")
    
    try:
        payment = paypalrestsdk.Payment.find(payment_id)
        
        if payment.execute({"payer_id": payer_id}):
            # Update transaction record
            transaction = await db.payment_transactions.find_one(
                {"payment_id": payment_id},
                {"_id": 0}
            )
            
            if transaction:
                # Mark as completed
                await db.payment_transactions.update_one(
                    {"payment_id": payment_id},
                    {"$set": {
                        "status": "completed",
                        "payer_id": payer_id,
                        "completed_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
                
                # Create payment record for feature unlocking
                await db.payments.insert_one({
                    "user_id": transaction["user_id"],
                    "case_id": transaction["case_id"],
                    "feature_type": transaction["feature_type"],
                    "amount": transaction["amount"],
                    "currency": transaction["currency"],
                    "method": "paypal",
                    "paypal_payment_id": payment_id,
                    "status": "completed",
                    "created_at": datetime.now(timezone.utc).isoformat()
                })
            
            return {
                "status": "success",
                "payment_id": payment_id,
                "message": "Payment completed successfully"
            }
        else:
            logger.error(f"PayPal execution failed: {payment.error}")
            raise HTTPException(status_code=400, detail=f"Payment execution failed: {payment.error}")
            
    except Exception as e:
        logger.error(f"PayPal execution error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/paypal/status/{payment_id}")
async def get_paypal_status(payment_id: str, request: Request):
    """Get PayPal payment status"""
    user = await get_current_user(request)
    
    transaction = await db.payment_transactions.find_one(
        {"payment_id": payment_id, "user_id": user.user_id},
        {"_id": 0}
    )
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    return {
        "payment_id": payment_id,
        "status": transaction.get("status", "unknown"),
        "feature_type": transaction.get("feature_type"),
        "amount": transaction.get("amount"),
        "created_at": transaction.get("created_at")
    }


# ============ PAYID ENDPOINTS ============

@router.post("/payid/create-reference")
async def create_payid_reference(req: PayIDPaymentRequest, request: Request):
    """Create a unique reference for PayID bank transfer"""
    user = await get_current_user(request)
    
    if req.feature_type not in FEATURE_PRICES:
        raise HTTPException(status_code=400, detail="Invalid feature type")
    
    feature = FEATURE_PRICES[req.feature_type]
    
    # Generate unique reference (ACM-XXXX-XXXX format)
    import uuid
    reference_code = uuid.uuid4().hex[:8].upper()
    reference = f"{PAYID_CONFIG['reference_prefix']}-{reference_code}"
    
    # Store pending payment
    await db.payment_transactions.insert_one({
        "reference": reference,
        "user_id": user.user_id,
        "case_id": req.case_id,
        "feature_type": req.feature_type,
        "amount": feature["price"],
        "currency": feature["currency"],
        "method": "payid",
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": datetime.now(timezone.utc).isoformat()  # 7 days
    })
    
    return {
        "reference": reference,
        "payid": PAYID_CONFIG["payid"],
        "payid_type": PAYID_CONFIG["payid_type"],
        "account_name": PAYID_CONFIG["account_name"],
        "amount": feature["price"],
        "currency": feature["currency"],
        "feature_name": feature["name"],
        "instructions": [
            "1. Open your banking app and select 'Pay Anyone' or 'Transfer'",
            "2. Choose 'PayID' as the payment method",
            f"3. Enter the PayID: {PAYID_CONFIG['payid']}",
            f"4. Verify the account name shows: {PAYID_CONFIG['account_name']}",
            f"5. Enter the amount: ${feature['price']:.2f} AUD",
            f"6. In the description/reference field, enter: {reference}",
            "7. Complete the transfer",
            "8. Return here and click 'I've made the payment' to verify"
        ]
    }


@router.post("/payid/verify")
async def verify_payid_payment(req: VerifyPayIDRequest, request: Request):
    """Verify a PayID payment (manual verification by admin)"""
    await get_current_user(request)  # Verify user is authenticated
    
    # Find the pending payment
    transaction = await db.payment_transactions.find_one(
        {"reference": req.reference, "case_id": req.case_id, "method": "payid"},
        {"_id": 0}
    )
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Payment reference not found")
    
    if transaction["status"] == "completed":
        return {
            "status": "already_verified",
            "message": "This payment has already been verified and the feature is unlocked"
        }
    
    # Mark as pending verification
    await db.payment_transactions.update_one(
        {"reference": req.reference},
        {"$set": {
            "status": "pending_verification",
            "verification_requested_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {
        "status": "pending_verification",
        "reference": req.reference,
        "message": "Your payment is being verified. This usually takes a few minutes during business hours. You'll receive access as soon as it's confirmed."
    }


@router.post("/payid/admin-confirm/{reference}")
async def admin_confirm_payid(reference: str, request: Request):
    """Admin endpoint to confirm PayID payment receipt"""
    user = await get_current_user(request)
    
    # Check if admin
    admin_emails = os.environ.get("ADMIN_EMAILS", "djkingy79@gmail.com").split(",")
    if user.email not in admin_emails:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    transaction = await db.payment_transactions.find_one(
        {"reference": reference, "method": "payid"},
        {"_id": 0}
    )
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Payment reference not found")
    
    # Mark as completed
    await db.payment_transactions.update_one(
        {"reference": reference},
        {"$set": {
            "status": "completed",
            "verified_by": user.email,
            "completed_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Create payment record for feature unlocking
    await db.payments.insert_one({
        "user_id": transaction["user_id"],
        "case_id": transaction["case_id"],
        "feature_type": transaction["feature_type"],
        "amount": transaction["amount"],
        "currency": transaction["currency"],
        "method": "payid",
        "reference": reference,
        "status": "completed",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {
        "status": "confirmed",
        "reference": reference,
        "message": "Payment confirmed and feature unlocked for user"
    }


@router.get("/payid/pending")
async def get_pending_payid_payments(request: Request):
    """Admin endpoint to get all pending PayID payments"""
    user = await get_current_user(request)
    
    # Check if admin
    admin_emails = os.environ.get("ADMIN_EMAILS", "djkingy79@gmail.com").split(",")
    if user.email not in admin_emails:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    pending = await db.payment_transactions.find(
        {"method": "payid", "status": {"$in": ["pending", "pending_verification"]}},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {"pending_payments": pending}
