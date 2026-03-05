import { Lock, Check, Clock, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

const FEATURE_INFO = {
  grounds_of_merit: {
    title: "Unlock Grounds of Merit Details",
    description: "See full descriptions, supporting evidence, and detailed analysis of each potential ground for appeal.",
    price: 50.00,
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
    price: 29.00,
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
    price: 39.00,
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
  featureType, 
  price
}) {
  const featureInfo = FEATURE_INFO[featureType] || { 
    title: "Premium Feature", 
    description: "", 
    price: price || 0,
    benefits: [] 
  };
  
  const displayPrice = price || featureInfo.price;

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
              ${displayPrice?.toFixed(2)} <span className="text-lg font-normal text-muted-foreground">AUD</span>
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

          {/* Coming Soon Notice */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-200">Payment System Coming Soon</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  We're setting up secure payment options. Check back shortly!
                </p>
              </div>
            </div>
          </div>

          {/* Disabled Payment Button */}
          <Button
            disabled
            className="w-full bg-slate-300 text-slate-500 py-6 text-base rounded-xl cursor-not-allowed"
            data-testid="payment-btn-disabled"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Coming Soon
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Contact us at djkingy79@gmail.com for early access to premium features.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
