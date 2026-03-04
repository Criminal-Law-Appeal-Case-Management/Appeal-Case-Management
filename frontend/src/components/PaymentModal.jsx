import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { toast } from "sonner";
import { Lock, CreditCard, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { API } from "../App";

const FEATURE_INFO = {
  grounds_of_merit: {
    title: "Unlock Grounds of Merit Details",
    description: "See full descriptions, supporting evidence, and detailed analysis of each potential ground for appeal.",
    icon: "🔓"
  },
  full_report: {
    title: "Full Detailed Report",
    description: "Comprehensive legal analysis with all grounds, evidence citations, and recommendations.",
    icon: "📋"
  },
  extensive_report: {
    title: "Extensive Log Report",
    description: "Complete case documentation including all evidence, timeline analysis, and full legal references.",
    icon: "📚"
  }
};

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  caseId, 
  featureType, 
  price,
  onPaymentSuccess 
}) {
  const [paypalClientId, setPaypalClientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(`${API}/payments/prices`);
        setPaypalClientId(response.data.paypal_client_id);
      } catch (error) {
        console.error("Failed to fetch payment config:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  const featureInfo = FEATURE_INFO[featureType] || {};

  const createOrder = async () => {
    try {
      const response = await axios.post(`${API}/cases/${caseId}/payments/create-order`, {
        feature_type: featureType
      });
      
      // For PayPal redirect flow, open the approval URL
      if (response.data.approval_url) {
        window.location.href = response.data.approval_url;
        return response.data.paypal_order_id;
      }
      
      return response.data.paypal_order_id;
    } catch (error) {
      toast.error("Failed to create payment order");
      throw error;
    }
  };

  const onApprove = async (data) => {
    setProcessingPayment(true);
    try {
      const response = await axios.post(`${API}/cases/${caseId}/payments/capture`, {
        paypal_payment_id: data.paymentID || data.orderID,
        payer_id: data.payerID
      });
      
      if (response.data.success) {
        toast.success("Payment successful! Feature unlocked.");
        onPaymentSuccess && onPaymentSuccess(featureType);
        onClose();
      }
    } catch (error) {
      toast.error("Payment capture failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    toast.error("Payment failed. Please try again.");
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
            <Lock className="w-5 h-5 text-amber-500" />
            {featureInfo.title}
          </DialogTitle>
          <DialogDescription>
            {featureInfo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Price Display */}
          <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">One-time payment</p>
            <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
              ${price?.toFixed(2)} <span className="text-lg font-normal text-slate-500">AUD</span>
            </p>
          </div>

          {/* What you get */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">What you get:</p>
            <ul className="space-y-1">
              {featureType === "grounds_of_merit" && (
                <>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    Full descriptions of all grounds identified
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    Supporting evidence from your documents
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    Relevant law sections and citations
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    Deep investigation feature unlocked
                  </li>
                </>
              )}
              {featureType === "full_report" && (
                <>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    Comprehensive legal analysis
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    PDF and Word export
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    Evidence citations included
                  </li>
                </>
              )}
              {featureType === "extensive_report" && (
                <>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    Complete case documentation
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    Full timeline analysis
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    All legal references
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    Ready for legal review
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* PayPal Button */}
          {paypalClientId ? (
            <PayPalScriptProvider options={{ 
              clientId: paypalClientId,
              currency: "AUD"
            }}>
              <PayPalButtons
                style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
                disabled={processingPayment}
              />
            </PayPalScriptProvider>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-amber-600 mb-4">
                PayPal is not configured. Please contact support.
              </p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}

          {processingPayment && (
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing payment...
            </div>
          )}

          <p className="text-xs text-slate-500 text-center">
            Secure payment via PayPal. Your payment information is never stored on our servers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
