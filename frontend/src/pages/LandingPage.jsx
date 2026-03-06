import { Scale, FileText, Clock, Shield, Upload, BarChart3, FileCheck, ChevronRight, AlertTriangle, Presentation, ListChecks, ChevronDown, Users, MapPin, Moon, Sun, Menu, X, Briefcase, BookOpen, Heart, MessageCircle, Download, Book, HelpCircle, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../App";
import AuthModal from "../components/AuthModal";
import { useTheme } from "../contexts/ThemeContext";
import VisitorCounter from "../components/VisitorCounter";

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showLegalFramework, setShowLegalFramework] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link to="/legal-framework" className="block py-2 text-slate-300 hover:text-white">Legal Framework</Link>
            <Link to="/about" className="block py-2 text-slate-300 hover:text-white">About</Link>
            <Link to="/contact" className="block py-2 text-slate-300 hover:text-white">Contact</Link>
            <Link to="/terms" className="block py-2 text-slate-300 hover:text-white">Terms & Privacy</Link>
            <div className="border-t border-slate-700 pt-3 mt-3">
              <Link to="/how-to-use" className="block py-2 text-amber-400 hover:text-amber-300 font-medium">How To Use The App</Link>
              <Link to="/legal-framework" className="block py-2 text-amber-400 hover:text-amber-300 font-medium">Legal Framework & Legislation</Link>
              <Link to="/caselaw-search" className="block py-2 text-amber-400 hover:text-amber-300 font-medium">Live Caselaw Search</Link>
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
            src="https://static.prod-images.emergentagent.com/jobs/f60b6a6d-a118-49cd-899d-586e4a8a87a6/images/3f6a0144e6ddce5a8eb6a1e25b25974fca11bfd9515dbad29662cab81313d84b.png" 
            alt="Australian Courtroom"
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
            loading="eager"
            onError={(e) => { e.target.style.display = 'none'; }}
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
            <div className="relative mt-8 lg:mt-0">
              <div className="relative max-w-md mx-auto lg:max-w-none">
                <img 
                  src="https://static.prod-images.emergentagent.com/jobs/f60b6a6d-a118-49cd-899d-586e4a8a87a6/images/6fe186d3d7a5b01e3d3c6076c0a6aefc22c07aea5667124e0978d927d9c58335.png" 
                  alt="Gavel and Law Books"
                  className="rounded-3xl shadow-2xl w-full object-cover h-[280px] sm:h-[350px] lg:h-[450px] border-4 border-white/20"
                  loading="eager"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80'; }}
                />
                {/* Floating Card - hidden on small mobile */}
                <div className="hidden sm:block absolute -bottom-6 -left-6 bg-card p-5 rounded-2xl shadow-xl border border-border">
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
                <div className="absolute -top-4 -right-4 bg-amber-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-lg text-xs sm:text-sm font-semibold">
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
              This application helps you organise, analyse, and research criminal appeals across all Australian jurisdictions. 
              Whether you're representing yourself or working with a lawyer, get the tools you need to understand your case.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Organise */}
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Organise Everything
              </h3>
              <p className="text-muted-foreground text-sm">
                Upload all your case documents, create a timeline of events, and keep everything in one secure place. 
                OCR extracts text from scanned documents automatically.
              </p>
            </div>

            {/* Analyse */}
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
      {/* COMPLETE APP CAPABILITIES - At A Glance */}
      {/* ============================================ */}
      <section className="py-16 px-6 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://static.prod-images.emergentagent.com/jobs/f60b6a6d-a118-49cd-899d-586e4a8a87a6/images/e20c677eb0c9cdb1ef84e9e79a9f3bbd37795a24bfbe29e4d8cfe78da35bf516.png" 
            alt="Handcuffs and Justice"
            className="w-full h-full object-cover opacity-10"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">Everything At Your Fingertips</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Complete Criminal Appeal Platform
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              From document management to legal research, everything you need to build and understand your appeal — all in one place.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-amber-500 mb-1">8</div>
              <div className="text-slate-400 text-sm">States & Territories</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-emerald-500 mb-1">30+</div>
              <div className="text-slate-400 text-sm">Legal Form Templates</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-1">84+</div>
              <div className="text-slate-400 text-sm">Legal Terms Explained</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-purple-500 mb-1">100+</div>
              <div className="text-slate-400 text-sm">Legal Contacts Listed</div>
            </div>
          </div>

          {/* Feature Grid - All Pages & Capabilities */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Case Management */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-600 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Case Management</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                Create unlimited cases, upload documents with OCR, track deadlines with calendar view, and organise everything in one secure place.
              </p>
              <div className="text-amber-500 text-xs font-medium">
                ✓ Unlimited document upload • Deadline tracker • Progress checklist
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-600 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">AI-Powered Analysis</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                Automatically identify potential appeal grounds, find contradictions, generate case timelines, and get AI-driven insights based on Australian law.
              </p>
              <div className="text-emerald-500 text-xs font-medium">
                ✓ GPT-4 powered • Australian law trained • Grounds identification
              </div>
            </div>

            {/* Legal Research Hub */}
            <Link to="/legal-framework" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-600 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Legal Research Hub</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                Access legislation for all 8 states, search live court databases, explore legal frameworks, and understand Human Rights laws.
              </p>
              <div className="text-purple-500 text-xs font-medium">
                ✓ All state legislation • Live caselaw search • Framework guides
              </div>
            </Link>

            {/* Forms & Templates */}
            <Link to="/forms" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-600 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Forms & Templates</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                30+ downloadable legal forms including Notice of Appeal, Extension of Time, Transcript Requests, and state-specific templates.
              </p>
              <div className="text-amber-500 text-xs font-medium">
                ✓ Key procedural requirements • Time limits guide • All jurisdictions
              </div>
            </Link>

            {/* Legal Contacts Directory */}
            <Link to="/contacts" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-600 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Contacts Directory</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                100+ legal contacts: Legal Aid offices, Law Societies, Complaints Bodies, Courts, Community Legal Centres, Pro Bono services.
              </p>
              <div className="text-teal-500 text-xs font-medium">
                ✓ All 8 states • Phone numbers • Direct website links
              </div>
            </Link>

            {/* Legal Glossary */}
            <Link to="/glossary" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-600 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Book className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Legal Glossary</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                84+ legal terms explained in plain English including 23 specific Appeal Grounds, evidence law, and sentencing principles.
              </p>
              <div className="text-indigo-500 text-xs font-medium">
                ✓ Searchable • Categorized • Plain language explanations
              </div>
            </Link>

            {/* Appeal Statistics */}
            <Link to="/appeal-statistics" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-600 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Appeal Statistics</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                National and state-by-state data on criminal appeals: success rates, common grounds, timelines, and access to justice analysis.
              </p>
              <div className="text-red-500 text-xs font-medium">
                ✓ 0.012% appeal rate exposed • State comparisons • Justice gap analysis
              </div>
            </Link>

            {/* Success Stories */}
            <Link to="/success-stories" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-600 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Success Stories</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                14 real stories from families who found hope and successfully appealed: convictions quashed, sentences reduced, justice served.
              </p>
              <div className="text-pink-500 text-xs font-medium">
                ✓ Real outcomes • Diverse scenarios • All jurisdictions
              </div>
            </Link>

            {/* Lawyer Directory */}
            <Link to="/lawyers" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-600 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Lawyer Directory</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                Find criminal appeal specialists, barristers, and solicitors organised by state with expertise areas, success rates, and contact info.
              </p>
              <div className="text-cyan-500 text-xs font-medium">
                ✓ Verified specialists • State-specific • Pro bono options
              </div>
            </Link>

            {/* Reports & Export */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-600 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Reports & Export</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                Generate detailed reports with legal citations, export to PDF/DOCX, create appeal bundles, and use Barrister View for presentations.
              </p>
              <div className="text-orange-500 text-xs font-medium">
                ✓ Professional formatting • Barrister View • Document bundling
              </div>
            </div>

            {/* How To Use Guide */}
            <Link to="/how-to-use" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-600 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-lime-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Step-by-Step Guide</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                Complete tutorial with real app screenshots showing exactly how to use every feature from account creation to report generation.
              </p>
              <div className="text-lime-500 text-xs font-medium">
                ✓ 10-step guide • Real screenshots • Beginner-friendly
              </div>
            </Link>

            {/* FAQ */}
            <Link to="/faq" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-600 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">FAQ & Support</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                Answers to common questions about using the platform, appeal processes, costs, legal disclaimers, and technical support.
              </p>
              <div className="text-yellow-500 text-xs font-medium">
                ✓ Comprehensive answers • Contact form • Email support
              </div>
            </Link>

          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-8">
              <p className="text-white font-bold text-xl mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                All This For Free To Get Started
              </p>
              <p className="text-slate-400 mb-4">
                No credit card • No commitment • Pay only for premium AI analysis when you need it
              </p>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-amber-600 text-white hover:bg-amber-700 rounded-xl px-8 py-3 font-semibold text-lg"
              >
                Create Free Account
              </Button>
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
                  Generate AI-Powered Reports
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
                  Our AI generates <strong>barrister-quality legal analysis</strong> with similar cases, legislation links, and complete appeal filing guides. Three report types to match your needs:
                </p>
              </div>

              <div className="space-y-8">
                
                {/* Quick Summary Report - FREE */}
                <div className="bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-slate-900 rounded-xl border border-green-200 dark:border-green-800 overflow-hidden">
                  <div className="bg-green-600 text-white px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <span className="font-semibold">QUICK SUMMARY REPORT</span>
                    </div>
                    <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-bold">FREE</span>
                  </div>
                  <div className="p-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">What You Get:</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6 text-sm">
                        <div>
                          <ul className="text-slate-600 dark:text-slate-400 space-y-2 text-xs">
                            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Case overview with key facts</li>
                            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Grounds preview (count + strongest)</li>
                            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Appeal viability assessment</li>
                            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Immediate action recommendations</li>
                          </ul>
                        </div>
                        <div>
                          <ul className="text-slate-600 dark:text-slate-400 space-y-2 text-xs">
                            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Critical deadline reminders</li>
                            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Key evidence highlights</li>
                            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Teaser of similar cases</li>
                            <li className="flex items-start gap-2"><span className="text-amber-500">★</span> <em className="text-amber-600">Upgrade prompts for full analysis</em></li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 bg-green-50 dark:bg-green-900/20 -mx-5 -mb-5 px-5 py-4 rounded-b-lg">
                        <p className="text-xs text-green-800 dark:text-green-200 font-semibold">
                          Perfect for: Initial case assessment, deciding whether to pursue an appeal, understanding your options.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Detailed Report - $29 */}
                <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900 rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden">
                  <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <span className="font-semibold">FULL DETAILED REPORT</span>
                      <span className="text-blue-200 text-sm">— Barrister-quality analysis</span>
                    </div>
                    <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-bold">$29 AUD</span>
                  </div>
                  <div className="p-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">10 Detailed Sections Including:</h4>
                      </div>
                      
                      <div className="space-y-4 text-sm">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h5 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Similar Cases Analysis</h5>
                            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                              <li>• 4-6 relevant NSW appeal cases</li>
                              <li>• Direct links to AustLII decisions</li>
                              <li>• Success rates and outcomes</li>
                              <li>• Key arguments that worked</li>
                            </ul>
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                            <h5 className="font-bold text-amber-800 dark:text-amber-200 mb-2">Complete Appeal Filing Guide</h5>
                            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                              <li>• Step-by-step for YOUR court level</li>
                              <li>• Required forms with links</li>
                              <li>• Filing fees and locations</li>
                              <li>• Time limits and extensions</li>
                            </ul>
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                          <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Also Includes:</h5>
                          <div className="grid md:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <p>✓ Full ground analysis</p>
                            <p>✓ Legislation references</p>
                            <p>✓ Evidence assessment</p>
                            <p>✓ Strategic recommendations</p>
                            <p>✓ Presentation advice</p>
                            <p>✓ Barrister View export</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extensive Log Report - $39 */}
                <div className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-900 rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden">
                  <div className="bg-purple-600 text-white px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <span className="font-semibold">EXTENSIVE LOG REPORT</span>
                      <span className="text-purple-200 text-sm">— Forensic-level analysis</span>
                    </div>
                    <span className="bg-purple-500 px-3 py-1 rounded-full text-sm font-bold">$39 AUD</span>
                  </div>
                  <div className="p-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">14 Comprehensive Sections — A Barrister's Primary Working Document</h4>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-xs mb-4">
                        <div className="space-y-3">
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                            <p className="font-semibold text-purple-800 dark:text-purple-200">8-12 Similar Cases</p>
                            <p className="text-slate-600 dark:text-slate-400">Full AustLII links to read complete decisions</p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                            <p className="font-semibold text-purple-800 dark:text-purple-200">Witness Credibility Analysis</p>
                            <p className="text-slate-600 dark:text-slate-400">AI assessment of testimony reliability</p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                            <p className="font-semibold text-purple-800 dark:text-purple-200">Sentencing Comparison</p>
                            <p className="text-slate-600 dark:text-slate-400">How does this sentence compare to similar cases?</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                            <p className="font-semibold text-purple-800 dark:text-purple-200">Appeal Strategy</p>
                            <p className="text-slate-600 dark:text-slate-400">Oral & written submission advice</p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                            <p className="font-semibold text-purple-800 dark:text-purple-200">Filing Guide for ALL Courts</p>
                            <p className="text-slate-600 dark:text-slate-400">Local Court → District → Supreme → High Court</p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                            <p className="font-semibold text-purple-800 dark:text-purple-200">Risk Assessment & Costs</p>
                            <p className="text-slate-600 dark:text-slate-400">Estimated legal fees and success probability</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-100 to-amber-100 dark:from-purple-900/30 dark:to-amber-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold text-center">
                          This is the report to hand to your barrister. Comprehensive enough to form the basis of legal submissions.
                        </p>
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

      {/* About Link Section */}
      <section className="py-12 px-6 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://static.prod-images.emergentagent.com/jobs/f60b6a6d-a118-49cd-899d-586e4a8a87a6/images/8b44435fd117a9b64ee15135358c94668930cdd6015f5bad0cab217fd77610b5.png" 
            alt="Prison bars with light"
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
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
