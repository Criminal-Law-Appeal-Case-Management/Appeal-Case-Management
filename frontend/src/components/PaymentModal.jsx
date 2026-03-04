import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Lock, Check, Loader2, ExternalLink } from "lucide-react";
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
  },
  full_report: {
    title: "Full Detailed Report",
    description: "Comprehensive legal analysis with all grounds, evidence citations, and recommendations.",
  },
  extensive_report: {
    title: "Extensive Log Report",
    description: "Complete case documentation including all evidence, timeline analysis, and full legal references.",
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
  const [loading, setLoading] = useState(false);
  const [paypalConfigured, setPaypalConfigured] = useState(false);
  const [checkingConfig, setCheckingConfig] = useState(true);

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const response = await axios.get(`${API}/payments/prices`);
        setPaypalConfigured(response.data.paypal_configured || false);
      } catch (error) {
        console.error("Failed to check payment config:", error);
        setPaypalConfigured(false);
      } finally {
        setCheckingConfig(false);
      }
    };
    if (isOpen) {
      checkConfig();
    }
  }, [isOpen]);

  const featureInfo = FEATURE_INFO[featureType] || { title: "Premium Feature", description: "" };

  const handlePayWithPayPal = async () => {
    if (!caseId || !featureType) {
      toast.error("Missing payment information");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/cases/${caseId}/payments/create-order`, {
        feature_type: featureType
      });
      
      if (response.data.approval_url) {
        // Redirect to PayPal for payment
        toast.info("Redirecting to PayPal...");
        window.location.href = response.data.approval_url;
      } else {
        toast.error("Failed to get PayPal payment URL");
      }
    } catch (error) {
      console.error("Payment error:", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.detail || "Payment error");
      } else if (error.response?.status === 503) {
        toast.error("Payment service not available");
      } else {
        toast.error("Failed to initiate payment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingConfig) {
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
          {paypalConfigured ? (
            <Button
              onClick={handlePayWithPayPal}
              disabled={loading}
              className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white py-6 text-lg"
              data-testid="paypal-pay-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Pay with PayPal
                </>
              )}
            </Button>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-amber-600 mb-4">
                Payment service is currently being configured. Please try again later.
              </p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}

          <p className="text-xs text-slate-500 text-center">
            You will be redirected to PayPal to complete your payment securely.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
