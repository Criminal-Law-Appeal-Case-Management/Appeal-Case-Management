import { useState } from "react";
import { Scale, ArrowLeft, Moon, Sun, Menu, X, Upload, FileText, Clock, BarChart3, CheckCircle, ChevronRight, Search, FileCheck, Presentation, Download, AlertTriangle, Users, Lightbulb } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const HowToUsePage = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const steps = [
    {
      number: 1,
      title: "Create Your Account",
      icon: Users,
      color: "blue",
      description: "Sign up for free using your email or Google account. Your data is secure and private.",
      details: [
        "Click 'Sign In' or 'Get Started Free' on the homepage",
        "Choose to sign up with Google or create an account with email/password",
        "Verify your email address if using email signup",
        "You'll be taken to your personal dashboard"
      ],
      tip: "Use the same account across devices to keep your cases synced."
    },
    {
      number: 2,
      title: "Create a New Case",
      icon: FileText,
      color: "emerald",
      description: "Set up your case with basic information about the matter.",
      details: [
        "From your Dashboard, click 'Create New Case'",
        "Enter the case name (e.g., 'R v Smith [2024]')",
        "Select your State/Territory jurisdiction",
        "Choose the offence type (Murder, Assault, Drug Supply, etc.)",
        "Add the court name and any relevant dates",
        "Click 'Create Case' to save"
      ],
      tip: "Include the citation if you have it - this helps organise your cases."
    },
    {
      number: 3,
      title: "Upload Your Documents",
      icon: Upload,
      color: "amber",
      description: "Upload all relevant case documents - transcripts, evidence, statements, court records.",
      details: [
        "Open your case and go to the 'Documents' tab",
        "Drag and drop files or click to browse",
        "Supported formats: PDF, DOCX, images (JPG, PNG)",
        "The system automatically extracts text using OCR",
        "Categorise each document (Transcript, Evidence, Brief, etc.)",
        "Upload as many documents as you need - there's no limit"
      ],
      tip: "Upload everything you have. The more documents, the better the AI analysis will be."
    },
    {
      number: 4,
      title: "Review the AI Timeline",
      icon: Clock,
      color: "purple",
      description: "The system automatically creates a chronological timeline of key events.",
      details: [
        "Go to the 'Timeline' tab in your case",
        "The AI analyses your documents and extracts dates and events",
        "Events are shown in chronological order",
        "Click on any event to see the source document",
        "You can manually add, edit, or remove events",
        "Link events to specific page numbers in documents"
      ],
      tip: "A clear timeline helps identify gaps in the narrative and potential inconsistencies."
    },
    {
      number: 5,
      title: "Analyse Potential Grounds",
      icon: BarChart3,
      color: "red",
      description: "The AI identifies potential grounds of appeal based on your documents.",
      details: [
        "Go to the 'Analysis' tab in your case",
        "Click 'Run Analysis' to start the AI review",
        "The system checks for common appeal grounds:",
        "  - Misdirections to the jury",
        "  - Procedural fairness issues",
        "  - Evidence problems",
        "  - Sentencing errors",
        "Each ground shows its strength (Strong/Moderate/Potential)",
        "Click 'Investigate' on any ground for detailed analysis"
      ],
      tip: "The free tier shows how many grounds were found. Upgrade to see full details."
    },
    {
      number: 6,
      title: "Find Contradictions",
      icon: Search,
      color: "orange",
      description: "Use the Contradiction Finder to identify inconsistencies across documents.",
      details: [
        "Go to the 'Contradictions' tab",
        "The AI compares statements across all your documents",
        "Identifies where witnesses contradict each other",
        "Highlights timeline inconsistencies",
        "Shows where evidence conflicts with testimony",
        "Each contradiction links to the source documents"
      ],
      tip: "Contradictions can be powerful evidence of unreliable testimony."
    },
    {
      number: 7,
      title: "Track Your Progress",
      icon: CheckCircle,
      color: "teal",
      description: "Use the Appeal Checklist to track what's been done and what's next.",
      details: [
        "Go to the 'Progress' tab",
        "See the standard appeal process steps",
        "Check off completed items (Notice filed, Transcripts obtained, etc.)",
        "Track important deadlines",
        "Know your next action at all times",
        "Add custom notes to each step"
      ],
      tip: "Appeals have strict deadlines - usually 28 days to file Notice of Intention."
    },
    {
      number: 8,
      title: "Generate Reports",
      icon: FileCheck,
      color: "indigo",
      description: "Create professional reports summarising your case and findings.",
      details: [
        "Go to the 'Reports' tab",
        "Choose your report type:",
        "  - Quick Summary (Free) - Overview of case and ground count",
        "  - Full Detailed Report ($29) - Complete analysis with citations",
        "  - Extensive Log ($39) - Everything plus step-by-step guidance",
        "Reports are generated as PDF documents",
        "Download and share with your lawyer"
      ],
      tip: "The Full Report is ideal to take to a lawyer for review."
    },
    {
      number: 9,
      title: "Use Barrister View",
      icon: Presentation,
      color: "slate",
      description: "Present your case professionally with the clean Barrister View.",
      details: [
        "Click 'Barrister View' from your case",
        "Opens a clean, professional presentation format",
        "Perfect for meetings with lawyers or counsel",
        "Shows case summary, grounds, and recommendations",
        "No clutter - just the essential information",
        "Can be printed or exported to PDF"
      ],
      tip: "Use this when discussing your case with legal professionals."
    },
    {
      number: 10,
      title: "Export & Share",
      icon: Download,
      color: "pink",
      description: "Export your case data for use outside the app.",
      details: [
        "Use 'Quick Export' to download everything",
        "Creates a ZIP file with:",
        "  - All your documents",
        "  - Timeline as editable DOCX",
        "  - Case summary as editable DOCX",
        "  - Analysis results",
        "Use 'Bundle Documents' to merge PDFs",
        "Share with lawyers, barristers, or Legal Aid"
      ],
      tip: "Editable DOCX files can be customised before submitting to court."
    }
  ];

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Header */}
      <header className="bg-slate-900 dark:bg-slate-950 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight hidden sm:block" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Appeal Case Manager
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/glossary" className="text-slate-400 hover:text-white text-sm transition-colors">Legal Terms</Link>
            <Link to="/legal-resources" className="text-slate-400 hover:text-white text-sm transition-colors">Resources</Link>
            <Link to="/faq" className="text-slate-400 hover:text-white text-sm transition-colors">FAQ</Link>
            <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 px-6 py-4 space-y-3">
            <Link to="/glossary" className="block py-2 text-slate-300 hover:text-white">Legal Terms</Link>
            <Link to="/legal-resources" className="block py-2 text-slate-300 hover:text-white">Resources</Link>
            <Link to="/faq" className="block py-2 text-slate-300 hover:text-white">FAQ</Link>
            <Link to="/" className="block py-2 text-amber-500 hover:text-amber-400">Back to Home</Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="py-12 px-6 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
            How to Use the App
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A step-by-step guide to help you get the most out of Appeal Case Manager. 
            Follow these steps to organise your case and identify potential appeal grounds.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-8 px-6 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-foreground mb-2">Before You Start</h2>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Gather your documents</strong> — transcripts, evidence, court records, witness statements</li>
                <li>• <strong>Note key dates</strong> — incident date, arrest, trial, sentencing</li>
                <li>• <strong>Know your deadline</strong> — you usually have 28 days from sentencing to file an appeal</li>
                <li>• <strong>This is NOT legal advice</strong> — always consult a qualified lawyer</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} isLast={index === steps.length - 1} />
          ))}
        </div>

        {/* What's Next */}
        <div className="mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-800">
          <h2 className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            What Happens Next?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-foreground mb-2">If Grounds Are Found</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Review the detailed analysis for each ground</li>
                <li>• Generate a Full Report to share with a lawyer</li>
                <li>• Seek legal advice on the strength of your appeal</li>
                <li>• File Notice of Intention to Appeal within deadline</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Getting Legal Help</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Apply to <Link to="/legal-resources" className="text-blue-600 hover:underline">Legal Aid</Link> in your state</li>
                <li>• Contact <Link to="/legal-resources" className="text-blue-600 hover:underline">Pro Bono services</Link></li>
                <li>• Find a lawyer via your <Link to="/legal-resources" className="text-blue-600 hover:underline">Law Society</Link></li>
                <li>• Use the Barrister View when meeting with counsel</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 rounded-xl px-8 py-5 font-semibold shadow-lg shadow-amber-600/20">
              Get Started Now
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 px-6 py-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            Need more help? Check our <Link to="/faq" className="text-amber-500 hover:underline">FAQ</Link> or <Link to="/contact" className="text-amber-500 hover:underline">Contact Us</Link>
          </p>
          <p className="text-red-400 text-xs mt-2 font-medium">
            This guide is for informational purposes only. Always seek professional legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Step Card Component
const StepCard = ({ step, isLast }) => {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    teal: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    slate: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
    pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  };

  const borderColors = {
    blue: "border-blue-200 dark:border-blue-800",
    emerald: "border-emerald-200 dark:border-emerald-800",
    amber: "border-amber-200 dark:border-amber-800",
    purple: "border-purple-200 dark:border-purple-800",
    red: "border-red-200 dark:border-red-800",
    orange: "border-orange-200 dark:border-orange-800",
    teal: "border-teal-200 dark:border-teal-800",
    indigo: "border-indigo-200 dark:border-indigo-800",
    slate: "border-slate-200 dark:border-slate-700",
    pink: "border-pink-200 dark:border-pink-800",
  };

  return (
    <div className="relative">
      {/* Connector Line */}
      {!isLast && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 -mb-8" />
      )}
      
      <div className={`bg-card border ${borderColors[step.color]} rounded-2xl p-6 relative`}>
        <div className="flex items-start gap-4">
          {/* Step Number & Icon */}
          <div className={`w-12 h-12 rounded-xl ${colorClasses[step.color]} flex items-center justify-center shrink-0`}>
            <step.icon className="w-6 h-6" />
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                STEP {step.number}
              </span>
              <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
                {step.title}
              </h3>
            </div>
            
            <p className="text-muted-foreground mb-4">{step.description}</p>
            
            {/* Details */}
            <ul className="space-y-2 mb-4">
              {step.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
            
            {/* Tip */}
            {step.tip && (
              <div className={`${colorClasses[step.color]} rounded-lg p-3 text-sm`}>
                <strong>Tip:</strong> {step.tip}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUsePage;
