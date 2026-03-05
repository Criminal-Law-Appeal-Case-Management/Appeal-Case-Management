import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  Lock, Check, Loader2, CreditCard, Building2, Copy, CheckCircle,
  ArrowRight, Shield, Clock, AlertCircle, X
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
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
      "4-6 similar cases with AustLII decision links",
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
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [payidReference, setPayidReference] = useState(null);
  const [payidDetails, setPayidDetails] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState("");

  const featureInfo = FEATURE_INFO[featureType] || { 
    title: "Premium Feature", 
    description: "", 
    benefits: [] 
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPayidReference(null);
      setPayidDetails(null);
      setVerifying(false);
      setCopied("");
    }
  }, [isOpen]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
    toast.success("Copied to clipboard!");
  };

  // PayPal Payment
  const handlePayPal = async () => {
    if (!caseId || !featureType) {
      toast.error("Missing payment information");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/payments/paypal/create-order`, {
        feature_type: featureType,
        case_id: caseId,
        return_url: `${window.location.origin}/cases/${caseId}?payment=success&method=paypal`,
        cancel_url: `${window.location.origin}/cases/${caseId}?payment=cancelled`
      });
      
      if (response.data.approval_url) {
        toast.info("Redirecting to PayPal...");
        window.location.href = response.data.approval_url;
      } else {
        toast.error("Failed to create PayPal order");
      }
    } catch (error) {
      console.error("PayPal error:", error);
      toast.error(error.response?.data?.detail || "Failed to initiate PayPal payment");
    } finally {
      setLoading(false);
    }
  };

  // PayID - Get Reference
  const handlePayIDStart = async () => {
    if (!caseId || !featureType) {
      toast.error("Missing payment information");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/payments/payid/create-reference`, {
        feature_type: featureType,
        case_id: caseId
      });
      
      setPayidReference(response.data.reference);
      setPayidDetails(response.data);
    } catch (error) {
      console.error("PayID error:", error);
      toast.error(error.response?.data?.detail || "Failed to generate payment reference");
    } finally {
      setLoading(false);
    }
  };

  // PayID - Verify Payment
  const handlePayIDVerify = async () => {
    if (!payidReference) return;

    setVerifying(true);
    try {
      const response = await axios.post(`${API}/payments/payid/verify`, {
        reference: payidReference,
        case_id: caseId,
        feature_type: featureType
      });
      
      if (response.data.status === "already_verified") {
        toast.success("Payment verified! Feature unlocked.");
        onPaymentSuccess?.();
        onClose();
      } else {
        toast.info(response.data.message);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(error.response?.data?.detail || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" data-testid="payment-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
            <Lock className="w-5 h-5 text-amber-500" />
            {featureInfo.title}
          </DialogTitle>
          <DialogDescription>
            {featureInfo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Price Display */}
          <div className="bg-gradient-to-r from-slate-50 to-amber-50 dark:from-slate-800 dark:to-amber-900/20 rounded-xl p-4 text-center border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-muted-foreground mb-1">One-time payment</p>
            <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
              ${price?.toFixed(2)} <span className="text-lg font-normal text-muted-foreground">AUD</span>
            </p>
          </div>

          {/* What you get */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">What you get:</p>
            <ul className="space-y-1">
              {featureInfo.benefits.slice(0, 5).map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Method Tabs */}
          <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paypal" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                PayPal / Card
              </TabsTrigger>
              <TabsTrigger value="payid" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                PayID / Bank
              </TabsTrigger>
            </TabsList>

            {/* PayPal Tab */}
            <TabsContent value="paypal" className="space-y-4 mt-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-800 dark:text-blue-200">Secure Payment</p>
                    <p className="text-blue-700 dark:text-blue-300 text-xs">
                      Pay with PayPal, credit card, or debit card. Your payment details are never stored on our servers.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePayPal}
                disabled={loading}
                className="w-full bg-[#0070ba] hover:bg-[#003087] text-white py-6 text-base rounded-xl"
                data-testid="paypal-pay-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Connecting to PayPal...
                  </>
                ) : (
                  <>
                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" 
                         alt="PayPal" className="h-5 mr-2 rounded" />
                    Pay with PayPal
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>Credit Card</span>
                <span>•</span>
                <span>Debit Card</span>
                <span>•</span>
                <span>PayPal Balance</span>
              </div>
            </TabsContent>

            {/* PayID Tab */}
            <TabsContent value="payid" className="space-y-4 mt-4">
              {!payidDetails ? (
                <>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-emerald-800 dark:text-emerald-200">Instant Australian Bank Transfer</p>
                        <p className="text-emerald-700 dark:text-emerald-300 text-xs">
                          Use PayID for instant transfer from any Australian bank account. Available 24/7.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePayIDStart}
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-base rounded-xl"
                    data-testid="payid-start-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Reference...
                      </>
                    ) : (
                      <>
                        <Building2 className="w-5 h-5 mr-2" />
                        Pay with PayID
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  {/* PayID Details */}
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                      Bank Transfer Details
                    </h4>
                    
                    <div className="space-y-3">
                      {/* PayID */}
                      <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">PayID (Email)</p>
                          <p className="font-mono font-semibold text-foreground">{payidDetails.payid}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => copyToClipboard(payidDetails.payid, "payid")}
                          className="shrink-0"
                        >
                          {copied === "payid" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>

                      {/* Account Name */}
                      <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">Account Name</p>
                          <p className="font-semibold text-foreground">{payidDetails.account_name}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => copyToClipboard(payidDetails.account_name, "name")}
                          className="shrink-0"
                        >
                          {copied === "name" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>

                      {/* Amount */}
                      <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div>
                          <p className="text-xs text-amber-700 dark:text-amber-300">Amount</p>
                          <p className="font-bold text-amber-800 dark:text-amber-200 text-lg">${payidDetails.amount.toFixed(2)} AUD</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => copyToClipboard(payidDetails.amount.toFixed(2), "amount")}
                          className="shrink-0"
                        >
                          {copied === "amount" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>

                      {/* Reference */}
                      <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div>
                          <p className="text-xs text-red-700 dark:text-red-300">Reference (IMPORTANT)</p>
                          <p className="font-mono font-bold text-red-800 dark:text-red-200">{payidDetails.reference}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => copyToClipboard(payidDetails.reference, "ref")}
                          className="shrink-0"
                        >
                          {copied === "ref" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground mb-2">Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Open your banking app</li>
                      <li>Select "Pay Anyone" or "Transfer"</li>
                      <li>Choose PayID and enter: <strong>{payidDetails.payid}</strong></li>
                      <li>Enter amount: <strong>${payidDetails.amount.toFixed(2)}</strong></li>
                      <li>Add reference: <strong>{payidDetails.reference}</strong></li>
                      <li>Complete the transfer</li>
                    </ol>
                  </div>

                  {/* Alert */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <p className="text-xs text-amber-800 dark:text-amber-200">
                        <strong>Include the reference</strong> in your transfer description so we can match your payment.
                      </p>
                    </div>
                  </div>

                  {/* Verify Button */}
                  <Button
                    onClick={handlePayIDVerify}
                    disabled={verifying}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-xl"
                    data-testid="payid-verify-btn"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Verifying Payment...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        I've Made the Payment
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setPayidDetails(null);
                      setPayidReference(null);
                    }}
                    className="w-full text-sm"
                  >
                    <X className="w-4 h-4 mr-1" /> Cancel and choose different method
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Questions? Contact <a href="mailto:djkingy79@gmail.com" className="text-amber-600 hover:underline">djkingy79@gmail.com</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
