"""
Stripe Payment Router for Appeal Case Manager
Handles checkout sessions, webhooks, and payment status
"""
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
from config import db, logger
from auth_utils import get_current_user
import os

router = APIRouter(prefix="/api/payments", tags=["payments"])

# Fixed pricing - NEVER accept amounts from frontend
FEATURE_PRICES = {
    "full_report": {"price": 29.00, "currency": "aud", "name": "Full Detailed Report"},
    "extensive_report": {"price": 39.00, "currency": "aud", "name": "Extensive Log Report"},
    "grounds_of_merit": {"price": 50.00, "currency": "aud", "name": "Grounds of Merit Analysis"},
}

class CheckoutRequest(BaseModel):
    feature_type: str
    case_id: str
    origin_url: str

@router.post("/checkout")
async def create_checkout(req: CheckoutRequest, http_request: Request):
    """Create a Stripe checkout session"""
    user = await get_current_user(http_request)
    
    if req.feature_type not in FEATURE_PRICES:
        raise HTTPException(status_code=400, detail="Invalid feature type")
    
    feature = FEATURE_PRICES[req.feature_type]
    
    api_key = os.environ.get("STRIPE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Payment system not configured")
    
    try:
        from emergentintegrations.payments.stripe.checkout import (
            StripeCheckout, CheckoutSessionRequest, CheckoutSessionResponse
        )
        
        host_url = str(http_request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
        
        success_url = f"{req.origin_url}/cases/{req.case_id}?payment=success&session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{req.origin_url}/cases/{req.case_id}?payment=cancelled"
        
        checkout_req = CheckoutSessionRequest(
            amount=feature["price"],
            currency=feature["currency"],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "user_id": user.user_id,
                "case_id": req.case_id,
                "feature_type": req.feature_type,
                "feature_name": feature["name"]
            },
            payment_methods=["card"]
        )
        
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_req)
        
        # Create payment transaction record
        await db.payment_transactions.insert_one({
            "session_id": session.session_id,
            "user_id": user.user_id,
            "case_id": req.case_id,
            "feature_type": req.feature_type,
            "amount": feature["price"],
            "currency": feature["currency"],
            "payment_status": "pending",
            "status": "initiated",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        })
        
        return {"url": session.url, "session_id": session.session_id}
        
    except ImportError:
        raise HTTPException(status_code=500, detail="Payment library not available")
    except Exception as e:
        logger.error(f"Stripe checkout error: {e}")
        raise HTTPException(status_code=500, detail=f"Payment error: {str(e)}")


@router.get("/status/{session_id}")
async def get_payment_status(session_id: str, http_request: Request):
    """Check payment status and update records"""
    user = await get_current_user(http_request)
    
    # Find the transaction
    transaction = await db.payment_transactions.find_one(
        {"session_id": session_id, "user_id": user.user_id},
        {"_id": 0}
    )
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # If already processed, return cached status
    if transaction.get("payment_status") == "paid":
        return {
            "status": "complete",
            "payment_status": "paid",
            "feature_type": transaction["feature_type"],
            "case_id": transaction["case_id"]
        }
    
    # Poll Stripe for current status
    api_key = os.environ.get("STRIPE_API_KEY")
    try:
        from emergentintegrations.payments.stripe.checkout import StripeCheckout
        
        host_url = str(http_request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
        
        status = await stripe_checkout.get_checkout_status(session_id)
        
        # Update transaction
        update_data = {
            "payment_status": status.payment_status,
            "status": status.status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": update_data}
        )
        
        # If paid, also create a record in the payments collection for feature unlocking
        if status.payment_status == "paid":
            existing_payment = await db.payments.find_one({
                "stripe_session_id": session_id
            })
            
            if not existing_payment:
                await db.payments.insert_one({
                    "user_id": transaction["user_id"],
                    "case_id": transaction["case_id"],
                    "feature_type": transaction["feature_type"],
                    "amount": transaction["amount"],
                    "currency": transaction["currency"],
                    "status": "completed",
                    "stripe_session_id": session_id,
                    "created_at": datetime.now(timezone.utc).isoformat()
                })
        
        return {
            "status": status.status,
            "payment_status": status.payment_status,
            "feature_type": transaction["feature_type"],
            "case_id": transaction["case_id"]
        }
        
    except Exception as e:
        logger.error(f"Payment status check error: {e}")
        return {
            "status": transaction.get("status", "unknown"),
            "payment_status": transaction.get("payment_status", "unknown"),
            "feature_type": transaction["feature_type"],
            "case_id": transaction["case_id"]
        }


@router.get("/prices")
async def get_prices():
    """Get feature prices"""
    return FEATURE_PRICES
