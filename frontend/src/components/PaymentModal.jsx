import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Lock, Check, Loader2, CreditCard, Smartphone } from "lucide-react";
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
    benefits: [
      "Full descriptions of all grounds identified",
      "Supporting evidence from your documents",
      "Relevant law sections and citations",
      "Deep investigation feature unlocked"
    ]
  },
  full_report: {
    title: "Full Detailed Report",
    description: "Comprehensive legal analysis with similar cases, legislation links, and appeal filing guide.",
    benefits: [
      "Detailed legal analysis with legislation references",
      "Similar cases with links to read their decisions",
      "Step-by-step appeal filing guide for your court",
      "Strategic recommendations for presenting your case",
      "PDF and Word export + Barrister View"
    ]
  },
  extensive_report: {
    title: "Extensive Log Report",
    description: "The ultimate forensic-level analysis — a barrister's primary working document.",
    benefits: [
      "Everything in the Full Report, plus:",
      "8-12 similar cases with full AustLII decision links",
      "Complete appeal filing guide for ALL court levels",
      "Witness credibility analysis",
      "Sentencing comparison with similar cases",
      "Complete appeal strategy with oral & written submission advice",
      "Risk assessment and cost estimates"
    ]
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

  const featureInfo = FEATURE_INFO[featureType] || { title: "Premium Feature", description: "", benefits: [] };

  const handlePayWithStripe = async () => {
    if (!caseId || !featureType) {
      toast.error("Missing payment information");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/payments/checkout`, {
        feature_type: featureType,
        case_id: caseId,
        origin_url: window.location.origin
      });
      
      if (response.data.url) {
        toast.info("Redirecting to secure checkout...");
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.detail || "Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="payment-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
            <Lock className="w-5 h-5 text-amber-500" />
            {featureInfo.title}
          </DialogTitle>
          <DialogDescription>
            {featureInfo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Price Display */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-muted-foreground mb-1">One-time payment</p>
            <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
              ${price?.toFixed(2)} <span className="text-lg font-normal text-muted-foreground">AUD</span>
            </p>
          </div>

          {/* What you get */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">What you get:</p>
            <ul className="space-y-1.5">
              {featureInfo.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Pay Button - Stripe supports Apple Pay, Google Pay, and Cards */}
          <Button
            onClick={handlePayWithStripe}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-6 text-base rounded-xl shadow-lg shadow-amber-600/20"
            data-testid="stripe-pay-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Setting up checkout...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Pay ${price?.toFixed(2)} AUD
              </>
            )}
          </Button>

          {/* Payment methods info */}
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Apple Pay</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Card</span>
            </div>
            <span>|</span>
            <span>Google Pay</span>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Secure checkout powered by Stripe. Your payment details are never stored on our servers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
