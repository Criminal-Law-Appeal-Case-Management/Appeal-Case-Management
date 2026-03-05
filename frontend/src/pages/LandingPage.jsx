import { Scale, FileText, Clock, Shield, Upload, BarChart3, FileCheck, ChevronRight, AlertTriangle, Presentation, ListChecks, ChevronDown, Users, MapPin, Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../App";
import AuthModal from "../components/AuthModal";
import { useTheme } from "../contexts/ThemeContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showLegalFramework, setShowLegalFramework] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track visit on page load
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await axios.post(`${API}/track/visit`);
      } catch (e) {
        // Silent fail - don't affect user experience
      }
    };
    trackVisit();
  }, []);

  const handleAuthSuccess = (userData) => {
    navigate("/dashboard", { state: { user: userData }, replace: true });
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess}
      />
      
      {/* Header */}
      <header className="bg-slate-900 dark:bg-slate-950 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight hidden sm:block" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Appeal Case Manager
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1">
                Resources
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/legal-resources" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm rounded-t-lg">
                  Legal Resources
                </Link>
                <Link to="/contacts" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm">
                  Contacts Directory
                </Link>
                <Link to="/legal-framework" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm">
                  Legal Frameworks
                </Link>
                <Link to="/caselaw-search" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm">
                  Caselaw Search
                </Link>
                <Link to="/lawyers" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm">
                  Lawyer Directory
                </Link>
                <Link to="/forms" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm rounded-b-lg">
                  Forms & Templates
                </Link>
              </div>
            </div>

            {/* Learn Dropdown */}
            <div className="relative group">
              <button className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1">
                Learn
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/how-to-use" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm rounded-t-lg">
                  How To Use
                </Link>
                <Link to="/glossary" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm">
                  Legal Glossary
                </Link>
                <Link to="/faq" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm">
                  FAQ
                </Link>
                <Link to="/appeal-statistics" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm">
                  Appeal Statistics
                </Link>
                <Link to="/success-stories" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm rounded-b-lg">
                  Success Stories
                </Link>
              </div>
            </div>

            {/* About Dropdown */}
            <div className="relative group">
              <button className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1">
                About
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/about" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm rounded-t-lg">
                  Our Story
                </Link>
                <Link to="/contact" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm">
                  Contact Us
                </Link>
                <Link to="/professional-summary" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm">
                  For Legal Professionals
                </Link>
                <Link to="/terms" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white text-sm rounded-b-lg">
                  Terms & Privacy
                </Link>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              data-testid="theme-toggle"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Button 
              onClick={() => setShowAuthModal(true)}
              data-testid="login-btn"
              className="bg-amber-600 text-white hover:bg-amber-700 rounded-lg px-4 py-2 text-sm font-medium"
            >
              Sign In
            </Button>
          </div>
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 px-6 py-4 space-y-3">
            <Link to="/appeal-statistics" className="block py-2 text-slate-300 hover:text-white">Statistics</Link>
            <Link to="/success-stories" className="block py-2 text-slate-300 hover:text-white">Success Stories</Link>
            <Link to="/glossary" className="block py-2 text-slate-300 hover:text-white">Legal Terms</Link>
            <Link to="/legal-resources" className="block py-2 text-slate-300 hover:text-white">Legal Resources</Link>
            <Link to="/contacts" className="block py-2 text-slate-300 hover:text-white">Contacts Directory</Link>
            <Link to="/forms" className="block py-2 text-slate-300 hover:text-white">Forms</Link>
            <Link to="/faq" className="block py-2 text-slate-300 hover:text-white">FAQ</Link>
            <Link to="/about" className="block py-2 text-slate-300 hover:text-white">About</Link>
            <Link to="/contact" className="block py-2 text-slate-300 hover:text-white">Contact</Link>
            <Link to="/terms" className="block py-2 text-slate-300 hover:text-white">Terms & Privacy</Link>
            <div className="border-t border-slate-700 pt-3 mt-3">
              <Link to="/how-to-use" className="block py-2 text-amber-400 hover:text-amber-300 font-medium">How To Use The App</Link>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={toggleTheme} className="p-2 text-slate-300 hover:text-white">
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Button onClick={() => setShowAuthModal(true)} className="bg-amber-600 text-white hover:bg-amber-700 flex-1">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Single Clear Disclaimer */}
      <div className="bg-red-700 py-3">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-white text-center text-sm md:text-base font-medium">
            <AlertTriangle className="w-4 h-4 inline mr-2 -mt-0.5" />
            <strong>NOT LEGAL ADVICE</strong> — Australian Law Only. Creator is not a lawyer. All results must be verified by a qualified legal professional.
            <Link to="/terms" className="underline ml-2 hover:text-amber-200">Read full terms</Link>
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECTION 1: HERO */}
      {/* ============================================ */}
      <section className="relative py-20 md:py-28 px-6 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1589578527966-fdac0f44566c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920" 
            alt="Lady Justice"
            className="w-full h-full object-cover opacity-10 dark:opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <p className="text-amber-600 dark:text-amber-500 font-semibold text-xs uppercase tracking-widest mb-4">
                All Australian States & Territories • All Criminal Offences
              </p>
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6"
                style={{ fontFamily: 'Crimson Pro, serif' }}
              >
                Criminal Appeal Research Tool
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-xl">
                Organise case documents, generate timelines, and identify potential appeal issues across all Australian jurisdictions.
              </p>
              
              {/* State Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-semibold">NSW</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-semibold">VIC</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-semibold">QLD</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-semibold">SA</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-semibold">WA</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-semibold">TAS</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-semibold">NT</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-semibold">ACT</span>
                <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg font-semibold">Federal</span>
              </div>
              
              {/* Offence Types */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">Homicide</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">Assault</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">Sexual Offences</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">Drug Offences</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">Robbery</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">Fraud</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">+ More</span>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={() => setShowAuthModal(true)}
                  data-testid="hero-login-btn"
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 rounded-xl px-8 py-4 text-base font-semibold inline-flex items-center justify-center gap-2 shadow-xl shadow-amber-600/30 transition-all hover:scale-105"
                >
                  Get Started Free
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Link to="/professional-summary">
                  <Button
                    variant="outline"
                    className="border-2 border-slate-300 dark:border-slate-600 text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl px-8 py-4 text-base font-medium w-full sm:w-auto"
                  >
                    For Legal Professionals
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right - Hero Image */}
            <div className="hidden lg:block relative">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1772096168169-1b69984d2cfc?crop=entropy&cs=srgb&fm=jpg&q=85&w=600" 
                  alt="Lady Justice with Gavel"
                  className="rounded-3xl shadow-2xl w-full object-cover h-[450px] border-4 border-white/20"
                />
                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 bg-card p-5 rounded-2xl shadow-xl border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">3 Grounds Found</p>
                      <p className="text-xs text-muted-foreground">Strong appeal potential</p>
                    </div>
                  </div>
                </div>
                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-amber-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-semibold">
                  AI-Powered
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* APP OVERVIEW - What This Tool Does */}
      {/* ============================================ */}
      <section className="py-16 px-6 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-widest mb-3">What This Tool Does</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Your Complete Appeal Research Companion
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              This application helps you organize, analyze, and research criminal appeals across all Australian jurisdictions. 
              Whether you're representing yourself or working with a lawyer, get the tools you need to understand your case.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Organize */}
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Organize Everything
              </h3>
              <p className="text-muted-foreground text-sm">
                Upload all your case documents, create a timeline of events, and keep everything in one secure place. 
                OCR extracts text from scanned documents automatically.
              </p>
            </div>

            {/* Analyze */}
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                AI-Powered Analysis
              </h3>
              <p className="text-muted-foreground text-sm">
                Automatically identify potential grounds for appeal based on Australian law. 
                The AI scans your case for procedural errors, misdirections, and legal issues.
              </p>
            </div>

            {/* Generate Reports */}
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Generate Reports
              </h3>
              <p className="text-muted-foreground text-sm">
                Create detailed reports with legal citations, case law references, and structured analysis. 
                Export to PDF or present in Barrister View for legal meetings.
              </p>
            </div>
          </div>

          {/* Key Features Highlight */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>Built for Australian Law</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>All 8 states & territories + Commonwealth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>Covers all criminal offence types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>Direct links to legislation & case law</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>Progress tracker for appeal process</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>Free to Get Started</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>No credit card required to begin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>Upload unlimited documents for free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>Pay only for detailed AI analysis reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>A fraction of what lawyers charge</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: SEE IT IN ACTION (with Features merged) */}
      {/* ============================================ */}
      <section className="py-20 px-6 bg-background relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Scale className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-amber-600 dark:text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">See It In Action</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              How The Process Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here's what you can expect when using the tool — from uploading documents to generating reports.
            </p>
          </div>

          {/* Feature Grid - merged from Features section */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <FeatureCard icon={Upload} title="Upload Documents" desc="Organise case files in one place" />
            <FeatureCard icon={Clock} title="Build Timelines" desc="AI-generated event chronology" />
            <FeatureCard icon={BarChart3} title="Find Issues" desc="Flag potential appeal grounds" />
            <FeatureCard icon={FileCheck} title="Generate Reports" desc="Structured case summaries" />
            <FeatureCard icon={FileText} title="OCR Extraction" desc="Text from scanned documents" />
            <FeatureCard icon={Presentation} title="Barrister View" desc="Professional presentation mode" />
            <FeatureCard icon={ListChecks} title="Progress Tracker" desc="Track appeal process steps" />
            <FeatureCard icon={Shield} title="Secure Storage" desc="Your data, your control" />
          </div>

          <div className="space-y-20">
            
            {/* Sample 1: Case Dashboard with Documents */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-amber-600 dark:text-amber-500 font-bold text-sm uppercase tracking-wider">Step 1</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mt-2 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Upload Your Case Documents
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create a case and upload all relevant documents — transcripts, evidence, court records, witness statements. 
                  The system automatically extracts text using OCR and organises everything in one place. You can categorise 
                  documents by type for easy reference.
                </p>
                {/* Small gavel image */}
                <div className="mt-6 flex items-center gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1589307904488-7d60ff29c975?crop=entropy&cs=srgb&fm=jpg&q=85&w=100&h=100&fit=crop" 
                    alt="Gavel"
                    className="w-16 h-16 rounded-xl object-cover shadow-md"
                  />
                  <p className="text-sm text-muted-foreground italic">Supports PDF, DOCX, images & scanned documents</p>
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border shadow-xl">
                <div className="bg-card rounded-xl border border-border shadow-sm">
                  <div className="bg-slate-800 dark:bg-slate-900 text-white px-4 py-3 rounded-t-xl text-sm font-medium flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-500" />
                    Case: R v Smith [2024]
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl text-sm hover:bg-muted transition-colors">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="flex-1 font-medium">Trial_Transcript_Day1.pdf</span>
                      <span className="text-xs text-muted-foreground bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Transcript</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl text-sm hover:bg-muted transition-colors">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="flex-1 font-medium">Witness_Statement_Jones.pdf</span>
                      <span className="text-xs text-muted-foreground bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Evidence</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl text-sm hover:bg-muted transition-colors">
                      <FileText className="w-5 h-5 text-amber-600" />
                      <span className="flex-1 font-medium">Sentencing_Remarks.pdf</span>
                      <span className="text-xs text-muted-foreground bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">Court Document</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl text-sm hover:bg-muted transition-colors">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span className="flex-1 font-medium">Defence_Closing_Submission.pdf</span>
                      <span className="text-xs text-muted-foreground bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">Brief</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample 2: Timeline of Events */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-card rounded-2xl p-6 border border-border shadow-xl">
                <div className="bg-card rounded-xl border border-border shadow-sm p-5">
                  <div className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    Timeline of Events
                  </div>
                  <div className="relative pl-8 border-l-3 border-amber-500 space-y-5">
                    <div className="relative">
                      <div className="absolute -left-10 w-5 h-5 bg-amber-500 rounded-full border-3 border-white shadow"></div>
                      <div className="text-xs text-amber-600 dark:text-amber-500 font-semibold">15 March 2023</div>
                      <div className="text-sm font-semibold text-foreground">Incident Occurred</div>
                      <div className="text-xs text-muted-foreground">Altercation at residence, 42 Smith St</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-10 w-5 h-5 bg-amber-500 rounded-full border-3 border-white shadow"></div>
                      <div className="text-xs text-amber-600 dark:text-amber-500 font-semibold">16 March 2023</div>
                      <div className="text-sm font-semibold text-foreground">Arrest Made</div>
                      <div className="text-xs text-muted-foreground">Defendant taken into custody</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-10 w-5 h-5 bg-amber-500 rounded-full border-3 border-white shadow"></div>
                      <div className="text-xs text-amber-600 dark:text-amber-500 font-semibold">22 August 2023</div>
                      <div className="text-sm font-semibold text-foreground">Trial Commenced</div>
                      <div className="text-xs text-muted-foreground">NSW Supreme Court, Justice Williams</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-10 w-5 h-5 bg-red-500 rounded-full border-3 border-white shadow"></div>
                      <div className="text-xs text-red-600 dark:text-red-400 font-semibold">5 September 2023</div>
                      <div className="text-sm font-semibold text-foreground">Verdict & Sentencing</div>
                      <div className="text-xs text-muted-foreground">Guilty — 18 years imprisonment</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-amber-600 dark:text-amber-500 font-bold text-sm uppercase tracking-wider">Step 2</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mt-2 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  AI-Generated Timeline
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  The system analyses your documents and automatically builds a chronological timeline of key events. 
                  This helps visualise the sequence of what happened — from the incident through arrest, trial, and sentencing. 
                  You can also add events manually and link them to specific documents.
                </p>
                {/* Courthouse image */}
                <div className="mt-6">
                  <img 
                    src="https://images.unsplash.com/photo-1662516201865-8633915e668a?crop=entropy&cs=srgb&fm=jpg&q=85&w=400&h=200&fit=crop" 
                    alt="Courthouse"
                    className="w-full h-32 rounded-xl object-cover shadow-lg border border-border"
                  />
                </div>
              </div>
            </div>

            {/* Sample 3: Grounds of Merit Identified */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-amber-600 dark:text-amber-500 font-bold text-sm uppercase tracking-wider">Step 3</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mt-2 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Potential Grounds Identified
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  The AI analyses your case documents against known appeal grounds under NSW and Federal law. 
                  It flags potential issues such as procedural errors, misdirections to the jury, or elements 
                  that may not have been properly established. Each ground shows its strength and relevant legal sections.
                  Click "Investigate" to see detailed analysis.
                </p>
                {/* Scales image */}
                <div className="mt-6 flex items-center gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1764113697577-b5899b9a339d?crop=entropy&cs=srgb&fm=jpg&q=85&w=100&h=100&fit=crop" 
                    alt="Lady Justice"
                    className="w-20 h-20 rounded-xl object-cover shadow-md"
                  />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">AI-Powered Analysis</p>
                    <p>Identifies potential grounds based on your jurisdiction's law</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border shadow-xl">
                <div className="bg-card rounded-xl border border-border shadow-sm p-5 space-y-4">
                  <div className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    Potential Grounds of Merit (3 Found)
                  </div>
                  
                  <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded">STRONG</span>
                        <h4 className="font-semibold text-slate-900 text-sm mt-1">Misdirection on Mens Rea</h4>
                        <p className="text-xs text-slate-600 mt-1">Judge's direction on intent may have been inadequate — s.18(1)(a)</p>
                      </div>
                      <button className="text-xs bg-slate-900 text-white px-3 py-1 rounded hover:bg-slate-800">Investigate</button>
                    </div>
                  </div>
                  
                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded">MODERATE</span>
                        <h4 className="font-semibold text-slate-900 text-sm mt-1">Procedural Fairness Issue</h4>
                        <p className="text-xs text-slate-600 mt-1">Defence counsel may not have been given adequate time to prepare</p>
                      </div>
                      <button className="text-xs bg-slate-900 text-white px-3 py-1 rounded hover:bg-slate-800">Investigate</button>
                    </div>
                  </div>
                  
                  <div className="border border-slate-200 bg-slate-50 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-medium text-slate-600 bg-slate-200 px-2 py-0.5 rounded">POTENTIAL</span>
                        <h4 className="font-semibold text-slate-900 text-sm mt-1">Fresh Evidence Available</h4>
                        <p className="text-xs text-slate-600 mt-1">New witness statement may impact original findings</p>
                      </div>
                      <button className="text-xs bg-slate-900 text-white px-3 py-1 rounded hover:bg-slate-800">Investigate</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample 4: Reports - Detailed */}
            <div>
              <div className="text-center mb-8">
                <span className="text-amber-600 font-semibold text-xs uppercase tracking-wider">Step 4</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Generate Reports
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
                  Generate three types of reports to suit your needs. Here's what each report looks like:
                </p>
              </div>

              <div className="space-y-8">
                
                {/* Quick Summary Report - Detailed */}
                <div className="bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-slate-900 rounded-xl border border-green-200 dark:border-green-800 overflow-hidden">
                  <div className="bg-green-600 text-white px-6 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span className="font-semibold">QUICK SUMMARY REPORT</span>
                    <span className="text-green-200 text-sm ml-2">— Perfect for initial assessment</span>
                  </div>
                  <div className="p-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">CASE SUMMARY REPORT</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">R v Smith [2024] NSWSC 142</p>
                        <p className="text-xs text-slate-500 mt-1">Generated: 5 March 2025</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6 text-sm">
                        <div>
                          <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Case Overview</h5>
                          <ul className="text-slate-600 dark:text-slate-400 space-y-1 text-xs">
                            <li><strong>Offence:</strong> Murder (s.18(1)(a) Crimes Act 1900)</li>
                            <li><strong>Verdict:</strong> Guilty</li>
                            <li><strong>Sentence:</strong> 18 years imprisonment (NPP 12 years)</li>
                            <li><strong>Trial Judge:</strong> Justice Williams</li>
                            <li><strong>Documents Analysed:</strong> 12 files</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Key Findings</h5>
                          <ul className="text-slate-600 dark:text-slate-400 space-y-1 text-xs">
                            <li><strong>Grounds Identified:</strong> 3 potential grounds</li>
                            <li><strong>Strongest Ground:</strong> Misdirection on mens rea</li>
                            <li><strong>Strength Assessment:</strong> Moderate-Strong</li>
                            <li><strong>Appeal Deadline:</strong> 28 days from sentencing</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 text-sm">Recommendation</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Based on initial analysis, this case presents viable grounds for appeal. The primary ground 
                          relates to the trial judge's direction on intent (mens rea). Recommend seeking urgent legal 
                          review of jury directions from qualified counsel.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Detailed Report */}
                <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900 rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden">
                  <div className="bg-blue-600 text-white px-6 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span className="font-semibold">FULL DETAILED REPORT</span>
                    <span className="text-blue-200 text-sm ml-2">— Comprehensive analysis with citations</span>
                  </div>
                  <div className="p-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">DETAILED APPEAL ANALYSIS</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">R v Smith [2024] NSWSC 142</p>
                      </div>
                      
                      <div className="space-y-4 text-sm">
                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-white text-base mb-2">1. GROUND ONE: Misdirection on Mens Rea</h5>
                          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-3 mb-3">
                            <p className="text-xs text-amber-800 dark:text-amber-200"><strong>Strength:</strong> STRONG — High likelihood of success</p>
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                            <p><strong>Issue:</strong> The trial judge's direction to the jury on the element of intent under 
                            s.18(1)(a) Crimes Act 1900 (NSW) was inadequate. The direction failed to properly explain the 
                            distinction between intent to kill and intent to cause grievous bodily harm.</p>
                            <p><strong>Legal Framework:</strong></p>
                            <ul className="list-disc list-inside ml-2 space-y-1">
                              <li>s.18(1)(a) Crimes Act 1900 (NSW) — Murder where act done with intent to kill or cause GBH</li>
                              <li>s.5.1 Criminal Code Act 1995 (Cth) — Definition of intention</li>
                              <li>Woolmington v DPP [1935] AC 462 — Burden of proof</li>
                            </ul>
                            <p><strong>Supporting Case Law:</strong></p>
                            <ul className="list-disc list-inside ml-2 space-y-1">
                              <li>R v Lavender (2005) 222 CLR 67 — Requirement for proper mens rea direction</li>
                              <li>Royall v The Queen (1991) 172 CLR 378 — Adequacy of jury directions</li>
                              <li>Alister v The Queen (1984) 154 CLR 404 — Miscarriage from inadequate direction</li>
                            </ul>
                            <p><strong>Analysis:</strong> At page 142 of the trial transcript, the judge directed: "You must be 
                            satisfied the accused intended to cause serious harm." This direction conflates GBH with "serious harm" 
                            and fails to address the specific mental element required. Compare with the approved direction in 
                            R v Lavender at [45].</p>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-white text-base mb-2">2. GROUND TWO: Procedural Fairness</h5>
                          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 mb-3">
                            <p className="text-xs text-blue-800 dark:text-blue-200"><strong>Strength:</strong> MODERATE — Requires further evidence</p>
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            <p><strong>Issue:</strong> Defence counsel was granted insufficient time to prepare following late 
                            disclosure of forensic evidence. The additional material was provided 48 hours before trial...</p>
                            <p className="mt-2 text-slate-400 italic">[Report continues with full analysis of each ground...]</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extensive Log Report */}
                <div className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-900 rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden">
                  <div className="bg-purple-600 text-white px-6 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span className="font-semibold">EXTENSIVE LOG REPORT</span>
                    <span className="text-purple-200 text-sm ml-2">— Complete documentation & guidance</span>
                  </div>
                  <div className="p-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">COMPREHENSIVE APPEAL DOCUMENTATION</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">R v Smith [2024] NSWSC 142 — Complete Record</p>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-xs mb-4">
                        <div className="bg-slate-50 dark:bg-slate-700 rounded p-3">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Documents Analysed</p>
                          <p className="text-slate-600 dark:text-slate-400">12 files • 847 pages</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700 rounded p-3">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Timeline Events</p>
                          <p className="text-slate-600 dark:text-slate-400">23 key events identified</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700 rounded p-3">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Analysis Duration</p>
                          <p className="text-slate-600 dark:text-slate-400">Generated in 4m 32s</p>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="border border-slate-200 dark:border-slate-700 rounded p-3">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">TABLE OF CONTENTS</p>
                          <div className="mt-2 text-slate-600 dark:text-slate-400 grid md:grid-cols-2 gap-1">
                            <p>1. Executive Summary ..................... p.1</p>
                            <p>2. Case Background ........................ p.3</p>
                            <p>3. Complete Timeline ...................... p.8</p>
                            <p>4. Document Analysis Log .................. p.15</p>
                            <p>5. Ground 1: Full Analysis ................ p.24</p>
                            <p>6. Ground 2: Full Analysis ................ p.38</p>
                            <p>7. Ground 3: Full Analysis ................ p.49</p>
                            <p>8. Relevant Case Law Summaries ............ p.58</p>
                            <p>9. Legislative Framework .................. p.72</p>
                            <p>10. Similar Successful Appeals ............ p.81</p>
                            <p>11. Appeal Process Step-by-Step ........... p.89</p>
                            <p>12. Deadlines & Requirements .............. p.95</p>
                            <p>13. Recommended Actions ................... p.98</p>
                            <p>14. Appendices & Source Documents ......... p.102</p>
                          </div>
                        </div>

                        <div className="border border-slate-200 dark:border-slate-700 rounded p-3">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">SAMPLE: APPEAL PROCESS GUIDANCE (Section 11)</p>
                          <div className="text-slate-600 dark:text-slate-400 space-y-2">
                            <p><strong>Step 1: Notice of Intention to Appeal</strong></p>
                            <p className="ml-3">File Form 74C with the Court of Criminal Appeal Registry within 28 days of conviction/sentence. 
                            Include: appellant details, conviction date, sentence imposed, brief grounds...</p>
                            <p><strong>Step 2: Obtain Transcripts</strong></p>
                            <p className="ml-3">Request from Reporting Services Branch. Cost: approximately $7.50/page. 
                            Priority processing available for custody matters...</p>
                            <p className="text-slate-400 italic">[Full step-by-step guide continues for 12 pages...]</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Sample 5: Appeal Progress Tracker */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-amber-600 font-semibold text-xs uppercase tracking-wider">Step 5</span>
                <h3 className="text-xl font-bold text-foreground mt-2 mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Track Your Appeal Progress
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The appeal checklist helps you track what's been done and what comes next. 
                  Each step in the appeal process is laid out clearly — from filing a Notice of Intention 
                  to preparing submissions. Check off completed items and always know your next action.
                </p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 shadow-sm p-4">
                  <div className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Appeal Progress Checklist</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-green-800 dark:text-green-200">File Notice of Intention to Appeal</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-green-800 dark:text-green-200">Obtain Trial Transcripts</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                      <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <span className="text-sm text-amber-800 dark:text-amber-200 font-medium">Identify Grounds of Appeal ← Current Step</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
                      <div className="w-5 h-5 bg-slate-300 dark:bg-slate-500 rounded"></div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Draft Appeal Submissions</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
                      <div className="w-5 h-5 bg-slate-300 dark:bg-slate-500 rounded"></div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">File Appeal with Court of Criminal Appeal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample 6: Barrister Presentation View */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 bg-slate-900 rounded-lg p-4">
                <div className="bg-white rounded shadow-lg p-6" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  <div className="text-center border-b border-slate-200 pb-4 mb-4">
                    <h4 className="text-lg font-bold text-slate-900">APPEAL CASE SUMMARY</h4>
                    <p className="text-sm text-slate-600">R v Smith [2024] NSWSC 142</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h5 className="font-semibold text-slate-800">1. PRIMARY GROUND</h5>
                      <p className="text-slate-600 text-xs mt-1">Misdirection on mens rea — The trial judge's direction on the element of intent under s.18(1)(a) Crimes Act 1900 was inadequate...</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-800">2. SUPPORTING CASE LAW</h5>
                      <p className="text-slate-600 text-xs mt-1">R v Lavender (2005) 222 CLR 67; Royall v The Queen (1991) 172 CLR 378...</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-800">3. RECOMMENDATION</h5>
                      <p className="text-slate-600 text-xs mt-1">Strong basis for appeal on Ground 1. Seek senior counsel opinion...</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <span className="text-amber-600 font-semibold text-xs uppercase tracking-wider">For Legal Professionals</span>
                <h3 className="text-xl font-bold text-foreground mt-2 mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Barrister Presentation View
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  A clean, professional presentation mode designed for legal counsel. 
                  Present case information in court or client meetings with a formatted view 
                  that looks like a proper legal brief — numbered sections, case citations, 
                  and clear recommendations. Export to PDF for filing or sharing.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3: LEGAL RESOURCES & RESEARCH */}
      {/* ============================================ */}
      <section className="py-16 px-6 bg-muted/50 dark:bg-muted/20 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-blue-700 dark:text-blue-400 font-semibold text-xs uppercase tracking-widest mb-3">Legal Resources & Research</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Everything You Need to Research Your Appeal
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access legislation, case law, legal frameworks, and help resources all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Legal Frameworks Card */}
            <Link to="/legal-framework" className="group">
              <div className="bg-card border-2 border-border hover:border-blue-600 dark:hover:border-blue-400 rounded-xl p-8 h-full transition-all hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Scale className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
                    Legal Frameworks
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Complete overview of Australian criminal law by state — Crimes Acts, Criminal Codes, Evidence Acts, 
                  Human Rights legislation, and the specific legal framework that applies to your case.
                </p>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                  <span>View Legal Frameworks</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Live Caselaw Search Card */}
            <Link to="/caselaw-search" className="group">
              <div className="bg-card border-2 border-border hover:border-amber-600 dark:hover:border-amber-400 rounded-xl p-8 h-full transition-all hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
                    Live Caselaw Search
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Direct access to official court databases across all Australian jurisdictions. Search real judgments 
                  from the High Court, Federal Court, and every state and territory Supreme Court.
                </p>
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
                  <span>Search Case Law</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 5: PRICING */}
      {/* ============================================ */}
      <section className="py-16 px-6 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-700 dark:text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Simple, Affordable Access
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Basic features are free. Pay only for detailed analysis when you need it — a fraction of what lawyers charge.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Tier */}
            <div className="bg-muted/50 dark:bg-muted/20 border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>Free</h3>
                <span className="text-2xl font-bold text-foreground">$0</span>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create and manage cases</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Upload unlimited documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AI-generated timeline of events</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Appeal progress checklist</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>See number of potential grounds identified</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Quick Summary Report</span>
                </li>
              </ul>
              <Button
                onClick={() => setShowAuthModal(true)}
                variant="outline"
                className="w-full border-border text-foreground hover:bg-muted"
              >
                Get Started Free
              </Button>
            </div>

            {/* Paid Features */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 dark:border-amber-600 rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                UNLOCK FULL ANALYSIS
              </div>
              <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>Premium Features</h3>
              
              <ul className="space-y-4 text-sm text-foreground mb-6">
                <li className="flex items-start gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-amber-200 dark:border-amber-700">
                  <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <strong>Unlock Grounds of Merit</strong>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">$50</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">See full details of each potential ground, investigate further with legal citations and case law</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-amber-200 dark:border-amber-700">
                  <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <strong>Full Detailed Report</strong>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">$29</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Comprehensive analysis with recommendations and case law references</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-amber-200 dark:border-amber-700">
                  <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <strong>Extensive Log Report</strong>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">$39</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Complete documentation with step-by-step appeal guidance</p>
                  </div>
                </li>
              </ul>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center text-sm text-muted-foreground mb-4">
                <p><strong className="text-foreground">Compare:</strong> A junior lawyer charges $1,000+ just to review a case</p>
                <p className="text-xs text-muted-foreground mt-1">Barristers charge triple that. A full legal report? Thousands.</p>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Secure payment via PayPal
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            * Premium features are per-case. Pay once, access that analysis forever.
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 6: YOU HAVE OPTIONS (moved to bottom) */}
      {/* ============================================ */}
      <section className="py-16 px-6 bg-muted/50 dark:bg-muted/20 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-700 dark:text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">You Have Options</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Legal Help You May Not Know About
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              For most people, Legal Aid is the only affordable option — but private firms are often out of reach. 
              What many don't realise is that there are other avenues for help. <strong className="text-foreground">When you think you have no options, 
              there definitely are options.</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Legal Aid */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>Legal Aid</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Government-funded legal assistance available in every state. While overburdened, they can provide 
                representation for serious criminal matters and appeals if you meet the eligibility criteria.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <a href="https://www.legalaid.nsw.gov.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Legal Aid NSW</a></li>
                <li>• <a href="https://www.legalaid.vic.gov.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Victoria Legal Aid</a></li>
                <li>• <a href="https://www.legalaid.qld.gov.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Legal Aid Queensland</a></li>
                <li>• Search "Legal Aid" + your state for other jurisdictions</li>
              </ul>
            </div>

            {/* Pro Bono */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>Pro Bono Legal Services</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Many law firms and barristers provide free legal services (pro bono) for those who cannot afford representation. 
                This is not widely advertised but is a genuine option.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <a href="https://www.probonocentre.org.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Australian Pro Bono Centre</a></li>
                <li>• <a href="https://www.justiceconnect.org.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Justice Connect</a></li>
                <li>• Contact your state's Law Society for pro bono referrals</li>
                <li>• Many barristers accept pro bono criminal appeal cases</li>
              </ul>
            </div>

            {/* Community Legal Centres */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>Community Legal Centres</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Independent, non-profit organisations providing free legal advice and assistance. They often help with 
                matters Legal Aid cannot cover and can refer you to specialist services.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <a href="https://clcs.org.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Community Legal Centres Australia</a></li>
                <li>• <a href="https://www.clcnsw.org.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">CLC NSW</a></li>
                <li>• Aboriginal Legal Services in every state</li>
                <li>• Specialist centres for women, youth, and prisoners</li>
              </ul>
            </div>

            {/* Grants & Funding */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>Grants & Special Funding</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Various grants and funding programs exist specifically to support criminal appeals and wrongful conviction cases. 
                These are rarely advertised but can cover legal costs.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <a href="https://www.lawfoundation.net.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Law Foundation Grants</a></li>
                <li>• State-based legal assistance funding</li>
                <li>• Innocence projects (for wrongful convictions)</li>
                <li>• University law clinics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Link Section */}
      <section className="py-12 px-6 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-500 text-xs uppercase tracking-widest mb-4">About</p>
          <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Criminal Law Appeal Case Management
          </h3>
          <p className="text-amber-400 text-sm font-medium mb-4">Founded by Debra King</p>
          <p className="text-slate-400 text-sm mb-6 max-w-2xl mx-auto">
            Built from lived experience, driven by the belief that everyone deserves to understand their legal rights. 
            If this tool helps even one person discover grounds they didn't know existed, my goal is accomplished.
          </p>
          <Link to="/about">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg">
              Read My Full Story
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Ready to Start?
          </h2>
          <p className="text-muted-foreground mb-6">
            Sign in to organise your case and identify potential appeal issues.
          </p>
          <Button
            onClick={() => setShowAuthModal(true)}
            data-testid="cta-login-btn"
            className="bg-amber-600 text-white hover:bg-amber-700 rounded-lg px-8 py-3 font-medium"
          >
            Sign In
          </Button>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-8 px-6 border-t border-border bg-muted/50 dark:bg-muted/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground text-sm font-semibold">Criminal Law Appeal Case Management</span>
            </div>
            <span className="text-muted-foreground text-xs mt-1">Founded by Debra King</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/success-stories" className="hover:text-foreground">Success Stories</Link>
            <Link to="/glossary" className="hover:text-foreground">Legal Terms</Link>
            <Link to="/legal-resources" className="hover:text-foreground">Resources</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
            <Link to="/terms" className="hover:text-foreground">Terms & Privacy</Link>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center md:text-right">
            Australian Law Only • Not legal advice
          </p>
        </div>
      </footer>
    </div>
  );
};

// Simple Feature Card Component - Enhanced
const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300 group">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 dark:from-amber-500/10 dark:to-amber-600/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-amber-600 dark:text-amber-500" />
    </div>
    <h3 className="font-semibold text-foreground text-base mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>{title}</h3>
    <p className="text-muted-foreground text-sm">{desc}</p>
  </div>
);

export default LandingPage;
