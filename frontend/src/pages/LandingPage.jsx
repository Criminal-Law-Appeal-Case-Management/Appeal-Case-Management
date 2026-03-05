import { Scale, FileText, Clock, Shield, Upload, BarChart3, FileCheck, ChevronRight, AlertTriangle, Gavel, BookOpen, Users, HelpCircle, Moon, Sun, Menu, X, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../App";
import AuthModal from "../components/AuthModal";
import { useTheme } from "../contexts/ThemeContext";

// Legal-themed SVG icons
const GavelIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14.5 4.5L19.5 9.5M4.5 19.5L9.5 14.5M3 21L3 21M12 12L21 3" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2" y="17" width="6" height="4" rx="1" fill="currentColor" opacity="0.2"/>
    <path d="M9 15L15 9" strokeLinecap="round"/>
  </svg>
);

const AustraliaIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L13.09 8.26L19.5 8.27L14.55 12.14L16.18 18.5L12 14.77L7.82 18.5L9.45 12.14L4.5 8.27L10.91 8.26L12 2Z" opacity="0.8"/>
  </svg>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await axios.post(`${API}/track/visit`);
      } catch (e) {}
    };
    trackVisit();
  }, []);

  const handleAuthSuccess = (userData) => {
    navigate("/dashboard", { state: { user: userData }, replace: true });
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess}
      />
      
      {/* Header - Glass effect */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-amber flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight hidden sm:block" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Appeal Case Manager
            </span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/faq" className="text-muted-foreground hover:text-foreground text-sm transition-colors">FAQ</Link>
            <Link to="/lawyers" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Find Lawyers</Link>
            <Link to="/glossary" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Legal Terms</Link>
            <Link to="/statistics" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Stats</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              data-testid="theme-toggle"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Button 
              onClick={() => setShowAuthModal(true)}
              data-testid="header-login-btn"
              className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 py-2 font-medium shadow-lg shadow-primary/20"
            >
              Sign In
            </Button>
            <button 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border px-6 py-4 space-y-3">
            <Link to="/faq" className="block py-2 text-muted-foreground hover:text-foreground">FAQ</Link>
            <Link to="/lawyers" className="block py-2 text-muted-foreground hover:text-foreground">Find Lawyers</Link>
            <Link to="/glossary" className="block py-2 text-muted-foreground hover:text-foreground">Legal Terms</Link>
            <Link to="/statistics" className="block py-2 text-muted-foreground hover:text-foreground">Statistics</Link>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-primary text-primary-foreground mt-4"
            >
              Sign In
            </Button>
          </div>
        )}
      </header>

      {/* Disclaimer Banner */}
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-red-700 dark:bg-red-900 py-2">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-white text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span><strong>NOT LEGAL ADVICE</strong> — Australian Law Only. Creator is not a lawyer.</span>
            <Link to="/terms" className="underline hover:text-amber-200 ml-1 hidden sm:inline">Full terms</Link>
          </p>
        </div>
      </div>

      {/* Hero Section - Asymmetric, High Impact */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-950/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium">
                <AustraliaIcon className="w-4 h-4" />
                All Australian States & Territories
              </div>
              
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1]"
                style={{ fontFamily: 'Crimson Pro, serif' }}
              >
                Your Criminal Appeal,{" "}
                <span className="text-amber-600 dark:text-amber-500">Organised</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Upload case documents, generate timelines, and identify potential appeal grounds across all Australian jurisdictions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setShowAuthModal(true)}
                  data-testid="hero-get-started-btn"
                  className="btn-hover bg-primary text-primary-foreground rounded-xl px-8 py-6 text-base font-medium inline-flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  Get Started Free
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Link to="/professional-summary">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto rounded-xl px-8 py-6 text-base font-medium border-2"
                  >
                    For Legal Professionals
                  </Button>
                </Link>
              </div>

              {/* State badges */}
              <div className="flex flex-wrap gap-2 pt-4">
                {["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT", "Federal"].map((state) => (
                  <span 
                    key={state}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                      state === "Federal" 
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>

            {/* Right - Hero Image/Visual */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1589578527966-fdac0f44566c?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=800"
                  alt="Lady Justice statue"
                  className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
                />
                {/* Overlay card */}
                <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-xl border border-border max-w-xs">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-foreground">Active Appeal</span>
                  </div>
                  <p className="text-sm text-muted-foreground">3 grounds identified with supporting case law</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Bar */}
      <section className="py-8 px-6 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              to="/forms"
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-background transition-colors group"
              data-testid="quick-link-forms"
            >
              <FileText className="w-5 h-5 text-amber-600" />
              <span className="font-medium group-hover:text-amber-600 transition-colors">Forms & Templates</span>
            </Link>
            <Link 
              to="/success-stories"
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-background transition-colors group"
              data-testid="quick-link-stories"
            >
              <Users className="w-5 h-5 text-amber-600" />
              <span className="font-medium group-hover:text-amber-600 transition-colors">Success Stories</span>
            </Link>
            <Link 
              to="/glossary"
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-background transition-colors group"
              data-testid="quick-link-glossary"
            >
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span className="font-medium group-hover:text-amber-600 transition-colors">Legal Glossary</span>
            </Link>
            <Link 
              to="/faq"
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-background transition-colors group"
              data-testid="quick-link-faq"
            >
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span className="font-medium group-hover:text-amber-600 transition-colors">FAQ</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-amber-600 dark:text-amber-500 font-semibold text-sm uppercase tracking-widest">Features</p>
            <h2 
              className="text-3xl sm:text-4xl font-bold text-foreground"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to organize your case, identify appeal grounds, and track your progress.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Upload} 
              title="Document Upload" 
              desc="Upload and organize all case files with OCR text extraction from scanned documents."
              color="blue"
            />
            <FeatureCard 
              icon={Clock} 
              title="AI Timeline" 
              desc="Automatically generate chronological timelines from your case documents."
              color="amber"
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Appeal Grounds" 
              desc="AI identifies potential grounds for appeal based on your jurisdiction."
              color="emerald"
            />
            <FeatureCard 
              icon={FileCheck} 
              title="Reports" 
              desc="Generate Quick Summaries (free), Full Analysis, or Extensive Documentation."
              color="purple"
            />
            <FeatureCard 
              icon={Scale} 
              title="Case Comparison" 
              desc="Compare your case against similar successful appeals."
              color="rose"
            />
            <FeatureCard 
              icon={Shield} 
              title="Secure Storage" 
              desc="Your documents are encrypted and stored securely. Your data, your control."
              color="slate"
            />
          </div>
        </div>
      </section>

      {/* How It Works - Step by Step */}
      <section className="py-20 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-amber-600 dark:text-amber-500 font-semibold text-sm uppercase tracking-widest">How It Works</p>
            <h2 
              className="text-3xl sm:text-4xl font-bold text-foreground"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              Simple Process
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <StepCard 
              number="1" 
              title="Create Case" 
              desc="Enter your case details including offence type and jurisdiction"
            />
            <StepCard 
              number="2" 
              title="Upload Documents" 
              desc="Add transcripts, evidence, court records, and statements"
            />
            <StepCard 
              number="3" 
              title="AI Analysis" 
              desc="Our AI analyzes documents and identifies potential grounds"
            />
            <StepCard 
              number="4" 
              title="Generate Report" 
              desc="Get structured reports to share with legal professionals"
            />
          </div>
        </div>
      </section>

      {/* About Section - Compact */}
      <section className="py-20 px-6 gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 texture-overlay" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4">About</p>
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              Built From Experience
            </h2>
            <p className="text-amber-400 font-medium">Founded by Debra King</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <p className="text-white/90 leading-relaxed mb-6">
              I'm not a lawyer — I'm someone who knows firsthand how isolating and confusing the justice system can be. 
              <strong> I served a considerable amount of time in prison.</strong> During that time, I accepted my situation, 
              believing I had no options. What I didn't know then was that I had appellant rights — rights that were never properly explained to me.
            </p>
            <p className="text-white/90 leading-relaxed mb-6">
              <strong>It's now been eight years since I've been free from trouble.</strong> This app exists because of Josh and Brad. 
              Using this very app, we identified Josh's rights to a fair trial and uncovered extensive errors in his case. 
              <span className="text-amber-400 font-medium"> He now has an appeal on all grounds currently being actioned.</span>
            </p>
            <p className="text-amber-300 font-medium italic text-center">
              "If this tool helps even one person discover grounds they didn't know existed, my goal is accomplished."
            </p>
          </div>

          <div className="text-center mt-8">
            <Link to="/terms" className="text-amber-400 hover:text-amber-300 underline text-sm">
              Read the full story & terms
            </Link>
          </div>
        </div>
      </section>

      {/* Legal Resources Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-amber-600 dark:text-amber-500 font-semibold text-sm uppercase tracking-widest">Resources</p>
            <h2 
              className="text-3xl sm:text-4xl font-bold text-foreground"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              Legal Help Options
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              When you think you have no options, there definitely are options.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ResourceCard 
              icon={Scale}
              title="Legal Aid"
              desc="Government-funded legal assistance in every state"
              links={[
                { name: "Legal Aid NSW", url: "https://www.legalaid.nsw.gov.au" },
                { name: "Victoria Legal Aid", url: "https://www.legalaid.vic.gov.au" }
              ]}
            />
            <ResourceCard 
              icon={Users}
              title="Pro Bono"
              desc="Free legal services from private firms and barristers"
              links={[
                { name: "Pro Bono Centre", url: "https://www.probonocentre.org.au" },
                { name: "Justice Connect", url: "https://www.justiceconnect.org.au" }
              ]}
            />
            <ResourceCard 
              icon={MapPin}
              title="Community Legal"
              desc="Independent non-profit legal centres near you"
              links={[
                { name: "Find a CLC", url: "https://clcs.org.au" },
                { name: "CLC NSW", url: "https://www.clcnsw.org.au" }
              ]}
            />
            <ResourceCard 
              icon={FileText}
              title="Case Research"
              desc="Search real court decisions and judgments"
              links={[
                { name: "AustLII", url: "https://www.austlii.edu.au" },
                { name: "NSW Caselaw", url: "https://www.caselaw.nsw.gov.au" }
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-foreground"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Ready to Organise Your Appeal?
          </h2>
          <p className="text-lg text-muted-foreground">
            Create a free account to start uploading documents and identifying potential appeal grounds.
          </p>
          <Button
            onClick={() => setShowAuthModal(true)}
            data-testid="cta-get-started-btn"
            className="btn-hover bg-primary text-primary-foreground rounded-xl px-10 py-6 text-lg font-medium shadow-lg shadow-primary/20"
          >
            Get Started Free
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-amber flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Appeal Case Manager
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Criminal appeal research tool for all Australian jurisdictions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/forms" className="hover:text-foreground transition-colors">Forms & Templates</Link></li>
                <li><Link to="/glossary" className="hover:text-foreground transition-colors">Legal Glossary</Link></li>
                <li><Link to="/success-stories" className="hover:text-foreground transition-colors">Success Stories</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/lawyers" className="hover:text-foreground transition-colors">Find Lawyers</Link></li>
                <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link to="/professional-summary" className="hover:text-foreground transition-colors">For Professionals</Link></li>
                <li><Link to="/statistics" className="hover:text-foreground transition-colors">Statistics</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Criminal Law Appeal Case Management. Australian Law Only.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                Not legal advice. Always consult a qualified lawyer.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, desc, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    rose: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
    slate: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
  };

  return (
    <div className="card-elevated p-6 space-y-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
};

// Step Card Component
const StepCard = ({ number, title, desc }) => (
  <div className="text-center space-y-4">
    <div className="w-14 h-14 rounded-2xl gradient-amber flex items-center justify-center mx-auto text-white font-bold text-xl shadow-lg">
      {number}
    </div>
    <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
      {title}
    </h3>
    <p className="text-sm text-muted-foreground">{desc}</p>
  </div>
);

// Resource Card Component
const ResourceCard = ({ icon: Icon, title, desc, links }) => (
  <div className="card-elevated p-6 space-y-4">
    <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
      <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
    </div>
    <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
      {title}
    </h3>
    <p className="text-sm text-muted-foreground">{desc}</p>
    <ul className="space-y-2">
      {links.map((link, i) => (
        <li key={i}>
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
          >
            {link.name} →
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default LandingPage;
