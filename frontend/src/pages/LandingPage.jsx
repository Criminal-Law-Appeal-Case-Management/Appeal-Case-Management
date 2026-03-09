import { Scale, FileText, Clock, Shield, Upload, BarChart3, FileCheck, ChevronRight, AlertTriangle, Presentation, ListChecks, Users, MapPin, Moon, Sun, Menu, X, Briefcase, BookOpen, Heart, MessageCircle, Download, Book, HelpCircle, TrendingUp, PlayCircle, ArrowUp } from "lucide-react";
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
  const [liveStats, setLiveStats] = useState({ cases_analysed: 0, documents_processed: 0, reports_generated: 0 });

  useEffect(() => {
    // Fetch live stats
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/public/stats`);
        setLiveStats(response.data);
      } catch (error) {
        console.log("Stats not available");
      }
    };
    fetchStats();
  }, []);

  const handleAuthSuccess = (userData) => {
    navigate("/dashboard", { state: { user: userData }, replace: true });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="landing-top" className="min-h-screen bg-background" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess}
      />
      
      {/* Header */}
      <header className="bg-slate-900 dark:bg-slate-950 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky-600 flex items-center justify-center">
              <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Appeal Case Manager
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/appeal-statistics" className="text-slate-400 hover:text-white text-sm transition-colors" data-testid="nav-appeal-statistics-link">
              Statistics
            </Link>
            <Link to="/how-it-works" className="text-slate-400 hover:text-white text-sm transition-colors" data-testid="nav-how-it-works-link">
              How It Works
            </Link>
            <Link to="/success-stories" className="text-slate-400 hover:text-white text-sm transition-colors" data-testid="nav-success-stories-link">
              Success Stories
            </Link>
            <Link to="/legal-resources" className="text-slate-400 hover:text-white text-sm transition-colors" data-testid="nav-legal-resources-link">
              Resources
            </Link>
            <Link to="/faq" className="text-slate-400 hover:text-white text-sm transition-colors" data-testid="nav-faq-link">
              FAQ
            </Link>
            <Link to="/about" className="text-slate-400 hover:text-white text-sm transition-colors" data-testid="nav-about-link">
              About
            </Link>
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
              className="bg-sky-600 text-white hover:bg-sky-700 rounded-lg px-4 py-2 text-sm font-medium"
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
        {/* Mobile Menu - Reorganised */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-4 space-y-1">
            <p className="text-slate-500 text-xs uppercase tracking-wider px-2 pt-2 pb-1">Main</p>
            <Link to="/" className="block py-2 px-2 text-white font-medium rounded hover:bg-slate-700" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/appeal-statistics" className="block py-2 px-2 text-slate-300 hover:text-white rounded hover:bg-slate-700" onClick={() => setMobileMenuOpen(false)}>Statistics</Link>
            <Link to="/how-it-works" className="block py-2 px-2 text-slate-300 hover:text-white rounded hover:bg-slate-700" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
            <Link to="/success-stories" className="block py-2 px-2 text-slate-300 hover:text-white rounded hover:bg-slate-700" onClick={() => setMobileMenuOpen(false)}>Success Stories</Link>
            
            <p className="text-slate-500 text-xs uppercase tracking-wider px-2 pt-4 pb-1">Resources</p>
            <Link to="/legal-resources" className="block py-2 px-2 text-slate-300 hover:text-white rounded hover:bg-slate-700" onClick={() => setMobileMenuOpen(false)}>Legal Resources</Link>
            <Link to="/glossary" className="block py-2 px-2 text-slate-300 hover:text-white rounded hover:bg-slate-700" onClick={() => setMobileMenuOpen(false)}>Legal Terms</Link>
            <Link to="/forms" className="block py-2 px-2 text-slate-300 hover:text-white rounded hover:bg-slate-700" onClick={() => setMobileMenuOpen(false)}>Forms</Link>
            <Link to="/legal-framework" className="block py-2 px-2 text-slate-300 hover:text-white rounded hover:bg-slate-700" onClick={() => setMobileMenuOpen(false)}>Legal Framework</Link>
            
            <p className="text-slate-500 text-xs uppercase tracking-wider px-2 pt-4 pb-1">Help</p>
            <Link to="/faq" className="block py-2 px-2 text-slate-300 hover:text-white rounded hover:bg-slate-700" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <Link to="/how-to-use" className="block py-2 px-2 text-slate-300 hover:text-white rounded hover:bg-slate-700" onClick={() => setMobileMenuOpen(false)}>How To Use</Link>
            <Link to="/about" className="block py-2 px-2 text-slate-300 hover:text-white rounded hover:bg-slate-700" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className="block py-2 px-2 text-slate-300 hover:text-white rounded hover:bg-slate-700" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            
            <p className="text-slate-500 text-xs uppercase tracking-wider px-2 pt-4 pb-1">Legal</p>
            <Link to="/terms" className="block py-2 px-2 text-slate-300 hover:text-white rounded hover:bg-slate-700" onClick={() => setMobileMenuOpen(false)}>Terms & Conditions</Link>
            
            <div className="flex items-center gap-3 pt-4 px-2">
              <button onClick={toggleTheme} className="p-2 text-slate-300 hover:text-white rounded hover:bg-slate-700">
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Button onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }} className="bg-sky-600 text-white hover:bg-sky-700 flex-1 font-bold">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Single Clear Disclaimer */}
      <div className="bg-red-700 py-2 sm:py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-white text-center text-xs sm:text-sm md:text-base font-medium leading-snug">
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2 -mt-0.5" />
            <strong>NOT LEGAL ADVICE</strong> — Australian Law Only. Creator is not a lawyer. All results must be verified by a qualified legal professional.
            <Link to="/terms" className="underline ml-1 sm:ml-2 hover:text-sky-200">Read full terms</Link>
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* THE REALITY - Clean, Impactful Statistics */}
      {/* ============================================ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900" data-testid="landing-statistics-section">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Hook - BOLD LEGAL - Mobile Fixed */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 sm:mb-10 leading-tight px-2">
            Could You Be Sitting in Prison With a Valid Appeal?
          </h2>
          
          {/* The Key Stats - Mobile Responsive */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-12">
            <div className="bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700">
              <p className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white">500K+</p>
              <p className="text-slate-400 text-xs sm:text-base mt-1 sm:mt-2 uppercase tracking-wide font-medium">through courts yearly</p>
            </div>
            <div className="bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700">
              <p className="text-3xl sm:text-5xl lg:text-6xl font-bold text-sky-400">0.012%</p>
              <p className="text-slate-400 text-xs sm:text-base mt-1 sm:mt-2 uppercase tracking-wide font-medium">appeal rate</p>
            </div>
            <div className="bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700">
              <p className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white">35%</p>
              <p className="text-slate-400 text-xs sm:text-base mt-1 sm:mt-2 uppercase tracking-wide font-medium">of appeals succeed</p>
            </div>
            <div className="bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700">
              <p className="text-3xl sm:text-5xl lg:text-6xl font-bold text-sky-400">28</p>
              <p className="text-slate-400 text-xs sm:text-base mt-1 sm:mt-2 uppercase tracking-wide font-medium">days to lodge</p>
            </div>
          </div>

          {/* The Scale - Mobile Responsive */}
          <div className="bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700 mb-6 sm:mb-8 max-w-3xl mx-auto">
            <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed">
              <strong className="text-sky-400">In 2003-04 alone:</strong> Over <strong className="text-white">500,000 Australians</strong> went through the criminal court system. 
              Yet the appeal rate remained at just <strong className="text-white">0.012%</strong>. 
              <span className="text-slate-400">This isn't justice — it's a systemic failure of access.</span>
            </p>
          </div>
          
          {/* The Insight - Mobile Responsive */}
          <div className="bg-slate-800 rounded-lg sm:rounded-xl p-5 sm:p-8 border border-sky-600/30 mb-8 sm:mb-10 max-w-4xl mx-auto">
            <p className="text-white text-base sm:text-xl lg:text-2xl leading-relaxed font-medium">
              Only <strong className="text-sky-400">0.012%</strong> of convicted Australians appeal — yet <strong className="text-sky-400">35%</strong> of those who do succeed. 
              That's potentially <strong className="text-sky-400">thousands of people</strong> in prison who could have had their sentence reduced — <em className="text-slate-400">but never knew.</em>
            </p>
          </div>
          
          {/* CTA - Mobile Responsive */}
          <Button
            onClick={() => setShowAuthModal(true)}
            data-testid="stats-cta-btn"
            className="bg-sky-600 text-white hover:bg-sky-500 rounded-lg px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-xl font-bold shadow-lg uppercase tracking-wide w-full sm:w-auto"
          >
            Check Your Case Now
          </Button>
          
          {/* Live Stats Counter */}
          {(liveStats.cases_analysed > 0 || liveStats.documents_processed > 0) && (
            <div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-10">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-sky-400">{liveStats.cases_analysed}</p>
                <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide">Cases Analysed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{liveStats.documents_processed}</p>
                <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide">Documents Processed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-sky-400">{liveStats.reports_generated}</p>
                <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide">Reports Generated</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================ */}
      {/* HERO - What This Tool Is */}
      {/* ============================================ */}
      <section className="relative py-12 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden bg-white dark:bg-slate-950">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://static.prod-images.emergentagent.com/jobs/f60b6a6d-a118-49cd-899d-586e4a8a87a6/images/3f6a0144e6ddce5a8eb6a1e25b25974fca11bfd9515dbad29662cab81313d84b.png" 
            alt="Australian courtroom"
            className="w-full h-full object-cover opacity-10 dark:opacity-10"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-950" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <p className="text-sky-600 dark:text-sky-400 font-bold text-xs sm:text-sm uppercase tracking-widest mb-4 sm:mb-5">
                All Australian Jurisdictions
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-4 sm:mb-6">
                Criminal Appeal Research Tool
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Upload your case documents. Get AI-powered analysis of potential appeal grounds, 
                comparative sentencing data, and barrister-ready reports.
              </p>
              
              {/* State Badges - Mobile Responsive */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                {['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'].map(state => (
                  <span key={state} className="text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded font-semibold border border-slate-200 dark:border-slate-700">{state}</span>
                ))}
              </div>
              
              {/* CTA Buttons - Mobile Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button
                  onClick={() => setShowAuthModal(true)}
                  data-testid="hero-login-btn"
                  className="bg-slate-900 dark:bg-sky-600 text-white hover:bg-slate-800 dark:hover:bg-sky-500 rounded-lg px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold inline-flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  Start Your Case
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
                <Link to="/how-it-works">
                  <Button
                    variant="outline"
                    className="border-2 border-slate-900 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold w-full uppercase tracking-wide"
                  >
                    How It Works
                  </Button>
                </Link>
              </div>
              
              {/* Legal Professionals Link */}
              <div className="mt-4 text-center lg:text-left">
                <Link to="/professional-summary" className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 text-sm font-medium underline underline-offset-2">
                  For Legal Professionals →
                </Link>
              </div>
            </div>
            
            {/* Right - Hero Image */}
            <div className="relative mt-6 lg:mt-0">
              <img 
                src="https://static.prod-images.emergentagent.com/jobs/f60b6a6d-a118-49cd-899d-586e4a8a87a6/images/6fe186d3d7a5b01e3d3c6076c0a6aefc22c07aea5667124e0978d927d9c58335.png" 
                alt="Legal research desk"
                className="rounded-xl shadow-2xl w-full object-cover h-[220px] sm:h-[300px] lg:h-[420px] border border-slate-200 dark:border-slate-700"
                loading="eager"
              />
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-sky-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-bold shadow-lg uppercase tracking-wide">
                AI-Powered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS - 3 Simple Steps */}
      {/* ============================================ */}
      <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Three Simple Steps
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl">
              From documents to actionable insights in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <Upload className="w-8 h-8 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Upload Documents</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                Transcripts, evidence, sentencing remarks — we extract the text automatically.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <BarChart3 className="w-8 h-8 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. AI Analysis</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                Our AI identifies potential grounds for appeal based on Australian law.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <FileCheck className="w-8 h-8 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Get Reports</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                Detailed reports with case law, sentencing comparisons, and next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* COMPLETE APP CAPABILITIES - At A Glance */}
      {/* ============================================ */}
      <section className="py-20 px-6 bg-slate-900 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://static.prod-images.emergentagent.com/jobs/f60b6a6d-a118-49cd-899d-586e4a8a87a6/images/e20c677eb0c9cdb1ef84e9e79a9f3bbd37795a24bfbe29e4d8cfe78da35bf516.png" 
            alt="Court custody scene representing high-stakes criminal appeal review"
            className="w-full h-full object-contain sm:object-cover ios-image-safe image-safe opacity-15"
            loading="lazy"
            decoding="async"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <p className="text-sky-400 font-bold text-sm uppercase tracking-widest mb-4">Everything At Your Fingertips</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
              Complete Criminal Appeal Platform
            </h2>
            <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              From document management to legal research, everything you need to build and understand your appeal — all in one place.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-sky-500 mb-1">8</div>
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
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-sky-600 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Case Management</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                Create unlimited cases, upload documents with OCR, track deadlines with calendar view, and organise everything in one secure place.
              </p>
              <div className="text-sky-500 text-xs font-medium">
                ✓ Unlimited document upload • Deadline tracker • Progress checklist
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-sky-600 transition-all group">
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
            <Link to="/legal-framework" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-sky-600 transition-all group block">
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
            <Link to="/forms" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-sky-600 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Forms & Templates</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                30+ downloadable legal forms including Notice of Appeal, Extension of Time, Transcript Requests, and state-specific templates.
              </p>
              <div className="text-sky-500 text-xs font-medium">
                ✓ Key procedural requirements • Time limits guide • All jurisdictions
              </div>
            </Link>

            {/* Legal Contacts Directory */}
            <Link to="/legal-resources" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-sky-600 transition-all group block">
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
            <Link to="/glossary" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-sky-600 transition-all group block">
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
                ✓ Searchable • Categorised • Plain language explanations
              </div>
            </Link>

            {/* Appeal Statistics */}
            <Link to="/appeal-statistics" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-sky-600 transition-all group block">
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
            <Link to="/success-stories" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-sky-600 transition-all group block">
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
            <Link to="/lawyers" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-sky-600 transition-all group block">
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
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-sky-600 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Reports & Export</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                Generate premium reports with legal citations, comparative sentencing tables, relief options matrices, export to PDF/DOCX, and use Barrister View for conference-ready presentations.
              </p>
              <div className="text-orange-500 text-xs font-medium">
                ✓ Professional formatting • Barrister View • Document bundling
              </div>
            </div>

            {/* How To Use Guide */}
            <Link to="/how-to-use" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-sky-600 transition-all group block">
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
            <Link to="/faq" className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-sky-600 transition-all group block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">FAQ & Support</h3>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                Answers to common questions about using the platform, appeal processes, pricing, legal disclaimers, and technical support.
              </p>
              <div className="text-sky-500 text-xs font-medium">
                ✓ Comprehensive answers • Contact form • Email support
              </div>
            </Link>

          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-sky-500/10 to-orange-500/10 border border-sky-500/30 rounded-2xl p-8">
              <p className="text-white font-bold text-xl mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Create Your Account To Get Started
              </p>
              <p className="text-slate-400 mb-4">
                No credit card required • Pay only for premium reports when you're ready
              </p>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-sky-600 text-white hover:bg-sky-700 rounded-xl px-8 py-3 font-semibold text-lg"
              >
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SectionBackToTop onClick={scrollToTop} testId="landing-back-to-top-after-resources" />

      {/* ============================================ */}
      {/* SECTION 2: SEE IT IN ACTION (with Features merged) */}
      {/* ============================================ */}
      <section className="py-20 px-6 bg-background relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Scale className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sky-600 dark:text-sky-500 font-semibold text-xs uppercase tracking-widest mb-3">See It In Action</p>
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
            <FeatureCard icon={Presentation} title="Barrister View" desc="Conference-ready hearing deck" />
            <FeatureCard icon={ListChecks} title="Progress Tracker" desc="Track appeal process steps" />
            <FeatureCard icon={Shield} title="Secure Storage" desc="Your data, your control" />
          </div>


          {/* Link to How It Works page for detailed steps */}
          <div className="text-center py-8">
            <Link to="/how-it-works" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-800 transition-all shadow-lg shadow-sky-500/30">
              <PlayCircle className="w-6 h-6" />
              <span>See Detailed Steps with Report Samples</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

      <SectionBackToTop onClick={scrollToTop} testId="landing-back-to-top-after-about" />

      {/* ============================================ */}
      {/* SECTION 5: PRICING */}
      {/* ============================================ */}
      <section className="py-16 px-6 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sky-700 dark:text-sky-500 font-semibold text-xs uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Premium Legal Analysis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional-grade reports at a fraction of legal fees. Create your case for free, then unlock detailed analysis when you're ready.
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
            <div className="bg-sky-50 dark:bg-sky-900/20 border-2 border-sky-400 dark:border-sky-600 rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                UNLOCK FULL ANALYSIS
              </div>
              <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>Premium Features</h3>
              
              <ul className="space-y-4 text-sm text-foreground mb-6">
                <li className="flex items-start gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-sky-200 dark:border-sky-700">
                  <svg className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <strong>Grounds of Merit Report</strong>
                      <span className="text-sky-700 dark:text-sky-400 font-bold">$99</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Full analysis of each potential ground with legal citations, case law references, and investigation guidance</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-sky-200 dark:border-sky-700">
                  <svg className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <strong>Full Investigative Report</strong>
                      <span className="text-sky-700 dark:text-sky-400 font-bold">$100</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Comprehensive analysis with recommendations, AustLII case links, legislation references, and strategic guidance</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-sky-200 dark:border-sky-700">
                  <svg className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <strong>Extensive Barrister Report</strong>
                      <span className="text-sky-700 dark:text-sky-400 font-bold">$150</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Complete barrister conference dossier with comparative sentencing tables, 15+ precedent cases with AustLII links, court forms, and full relief options</p>
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
            alt="Court corridor and custody bars symbolising the appeal journey"
            className="w-full h-full object-contain sm:object-cover ios-image-safe image-safe opacity-30"
            loading="lazy"
            decoding="async"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sky-500 text-xs uppercase tracking-widest mb-4">About</p>
          <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Criminal Law Appeal Case Management
          </h3>
          <p className="text-sky-400 text-sm font-medium mb-4">Founded by Debra King</p>
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
            className="bg-sky-600 text-white hover:bg-sky-700 rounded-lg px-8 py-3 font-medium"
          >
            Sign In
          </Button>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-8 px-6 border-t border-border bg-muted/50 dark:bg-muted/20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground text-sm font-semibold">Criminal Law Appeal Case Management</span>
            </div>
            <span className="text-muted-foreground text-xs mt-1">Founded by Debra King</span>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">Explore</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <Link to="/how-it-works" className="hover:text-foreground">How It Works</Link>
              <Link to="/success-stories" className="hover:text-foreground">Success Stories</Link>
              <Link to="/appeal-statistics" className="hover:text-foreground">Appeal Statistics</Link>
              <Link to="/glossary" className="hover:text-foreground">Legal Terms</Link>
              <Link to="/legal-resources" className="hover:text-foreground">Resources & Contacts</Link>
              <Link to="/contact" className="hover:text-foreground">Contact</Link>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">Legal</p>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms & Privacy</Link>
            <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-3">
              Australian Law Only • Not legal advice
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Simple Feature Card Component - Enhanced
const SectionBackToTop = ({ onClick, testId }) => (
  <div className="py-4 text-center border-t border-border/40 bg-background/60" data-testid={testId}>
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
      data-testid={`${testId}-button`}
    >
      <ArrowUp className="w-3.5 h-3.5" />
      Back to top
    </button>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-sky-500/30 hover:-translate-y-1 transition-all duration-300 group">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-600/20 dark:from-sky-500/10 dark:to-sky-600/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-sky-600 dark:text-sky-500" />
    </div>
    <h3 className="font-semibold text-foreground text-base mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>{title}</h3>
    <p className="text-muted-foreground text-sm">{desc}</p>
  </div>
);

export default LandingPage;
