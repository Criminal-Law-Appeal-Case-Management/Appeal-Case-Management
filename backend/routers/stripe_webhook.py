"""
Stripe Webhook Handler
"""
from fastapi import APIRouter, Request
from config import db, logger
from datetime import datetime, timezone
import os

router = APIRouter(tags=["webhooks"])

@router.post("/api/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    try:
        body = await request.body()
        signature = request.headers.get("Stripe-Signature", "")
        
        api_key = os.environ.get("STRIPE_API_KEY")
        if not api_key:
            return {"status": "error", "message": "Not configured"}
        
        from emergentintegrations.payments.stripe.checkout import StripeCheckout
        
        host_url = str(request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
        
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            # Update transaction
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {
                    "payment_status": "paid",
                    "status": "complete",
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
            
            # Get transaction details
            transaction = await db.payment_transactions.find_one(
                {"session_id": webhook_response.session_id},
                {"_id": 0}
            )
            
            if transaction:
                # Create payment record for feature unlocking (idempotent)
                existing = await db.payments.find_one({"stripe_session_id": webhook_response.session_id})
                if not existing:
                    await db.payments.insert_one({
                        "user_id": transaction["user_id"],
                        "case_id": transaction["case_id"],
                        "feature_type": transaction["feature_type"],
                        "amount": transaction["amount"],
                        "currency": transaction["currency"],
                        "status": "completed",
                        "stripe_session_id": webhook_response.session_id,
                        "created_at": datetime.now(timezone.utc).isoformat()
                    })
        
        return {"status": "ok"}
        
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error", "message": str(e)}
