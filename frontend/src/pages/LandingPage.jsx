import { Scale, FileText, Clock, Shield, Upload, BarChart3, FileCheck, ChevronRight, AlertTriangle, ChevronDown, Moon, Sun, Menu, X, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../App";
import AuthModal from "../components/AuthModal";
import { useTheme } from "../contexts/ThemeContext";

const STATES = [
  { id: "nsw", name: "New South Wales", abbr: "NSW" },
  { id: "vic", name: "Victoria", abbr: "VIC" },
  { id: "qld", name: "Queensland", abbr: "QLD" },
  { id: "sa", name: "South Australia", abbr: "SA" },
  { id: "wa", name: "Western Australia", abbr: "WA" },
  { id: "tas", name: "Tasmania", abbr: "TAS" },
  { id: "nt", name: "Northern Territory", abbr: "NT" },
  { id: "act", name: "Australian Capital Territory", abbr: "ACT" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(null);

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
      
      {/* Header */}
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
          
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/faq" className="text-muted-foreground hover:text-foreground text-sm transition-colors">FAQ</Link>
            <Link to="/lawyers" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Find Lawyers</Link>
            <Link to="/glossary" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Legal Terms</Link>
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

        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border px-6 py-4 space-y-3">
            <Link to="/faq" className="block py-2 text-muted-foreground hover:text-foreground">FAQ</Link>
            <Link to="/lawyers" className="block py-2 text-muted-foreground hover:text-foreground">Find Lawyers</Link>
            <Link to="/glossary" className="block py-2 text-muted-foreground hover:text-foreground">Legal Terms</Link>
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

      {/* Hero Section - State Selection */}
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-6"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Criminal Appeal{" "}
            <span className="text-amber-600 dark:text-amber-500">Research Tool</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload documents, generate timelines, and identify potential appeal grounds — tailored to your state's laws.
          </p>

          {/* State Selection */}
          {!selectedState ? (
            <div className="space-y-6">
              <p className="text-sm font-medium text-foreground">Select your state or territory to get started:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {STATES.map((state) => (
                  <button
                    key={state.id}
                    onClick={() => setSelectedState(state)}
                    className="p-4 rounded-xl border-2 border-border hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all group"
                    data-testid={`state-select-${state.id}`}
                  >
                    <span className="text-2xl font-bold text-foreground group-hover:text-amber-600">{state.abbr}</span>
                    <p className="text-xs text-muted-foreground mt-1">{state.name}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Also covers <strong>Federal</strong> criminal law matters
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected State Confirmation */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                <Check className="w-5 h-5" />
                <span className="font-semibold">{selectedState.name}</span>
                <button 
                  onClick={() => setSelectedState(null)}
                  className="text-xs underline hover:no-underline ml-2"
                >
                  Change
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            </div>
          )}
        </div>
      </section>

      {/* Features Section - Only show after state selection */}
      {selectedState && (
        <>
          {/* What You Can Do */}
          <section className="py-16 px-6 bg-muted/30 border-y border-border">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 
                  className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
                  style={{ fontFamily: 'Crimson Pro, serif' }}
                >
                  What You Can Do
                </h2>
                <p className="text-muted-foreground">
                  Powerful tools for {selectedState.name} criminal appeals
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard 
                  icon={Upload} 
                  title="Upload Documents" 
                  desc="Store transcripts, evidence, and court records with OCR text extraction."
                />
                <FeatureCard 
                  icon={Clock} 
                  title="AI Timeline" 
                  desc="Automatically build chronological timelines from your documents."
                />
                <FeatureCard 
                  icon={BarChart3} 
                  title="Find Appeal Grounds" 
                  desc={`AI identifies potential grounds under ${selectedState.abbr} and Federal law.`}
                />
                <FeatureCard 
                  icon={FileCheck} 
                  title="Generate Reports" 
                  desc="Quick Summary (free), Full Analysis, or Extensive Documentation."
                />
                <FeatureCard 
                  icon={Scale} 
                  title="Case Comparison" 
                  desc="Compare your case against similar successful appeals."
                />
                <FeatureCard 
                  icon={Shield} 
                  title="Secure & Private" 
                  desc="Your documents are encrypted. Your data, your control."
                />
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 
                className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12"
                style={{ fontFamily: 'Crimson Pro, serif' }}
              >
                How It Works
              </h2>

              <div className="space-y-8">
                <Step number="1" title="Create Your Case" desc="Enter case details including the offence type and court." />
                <Step number="2" title="Upload Documents" desc="Add transcripts, evidence, statements — we extract the text automatically." />
                <Step number="3" title="AI Analysis" desc={`Our AI analyzes documents against ${selectedState.abbr} appeal law and identifies potential grounds.`} />
                <Step number="4" title="Get Your Report" desc="Generate structured reports to share with legal professionals." />
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <section className="py-12 px-6 bg-muted/30 border-y border-border">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickLink to="/forms" icon={FileText} label="Forms & Templates" />
                <QuickLink to="/lawyers" icon={Scale} label="Find Lawyers" />
                <QuickLink to="/glossary" icon={FileCheck} label="Legal Glossary" />
                <QuickLink to="/faq" icon={BarChart3} label="FAQ" />
              </div>
            </div>
          </section>

          {/* Legal Help Options */}
          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 
                  className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
                  style={{ fontFamily: 'Crimson Pro, serif' }}
                >
                  Legal Help in {selectedState.name}
                </h2>
                <p className="text-muted-foreground">
                  When you think you have no options, there are options.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <ResourceCard 
                  title="Legal Aid"
                  desc="Government-funded legal assistance for those who qualify"
                  link={`https://www.legalaid.${selectedState.id === 'nsw' ? 'nsw' : selectedState.id === 'vic' ? 'vic' : selectedState.id === 'qld' ? 'qld' : selectedState.id}.gov.au`}
                />
                <ResourceCard 
                  title="Pro Bono Services"
                  desc="Free legal services from private firms and barristers"
                  link="https://www.probonocentre.org.au"
                />
                <ResourceCard 
                  title="Community Legal Centres"
                  desc="Independent non-profit legal advice centres"
                  link="https://clcs.org.au"
                />
                <ResourceCard 
                  title="Search Case Law"
                  desc={`Find ${selectedState.abbr} court decisions on AustLII`}
                  link="https://www.austlii.edu.au"
                />
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-6 bg-muted/30 border-y border-border">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 
                className="text-2xl sm:text-3xl font-bold text-foreground"
                style={{ fontFamily: 'Crimson Pro, serif' }}
              >
                Ready to Start?
              </h2>
              <p className="text-muted-foreground">
                Create a free account to upload documents and identify potential appeal grounds for your {selectedState.name} case.
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
        </>
      )}

      {/* About Section - At the very end */}
      <section className="py-16 px-6 gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 texture-overlay" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">About</p>
            <h2 
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              Built From Experience
            </h2>
            <p className="text-amber-400">Founded by Debra King</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-4 text-sm">
            <p className="text-white/90 leading-relaxed">
              I'm not a lawyer — I'm someone who knows firsthand how isolating the justice system can be. 
              <strong> I served a considerable amount of time in prison.</strong> I had appellant rights 
              that were never properly explained to me.
            </p>
            <p className="text-white/90 leading-relaxed">
              <strong>It's been eight years since I've been free from trouble.</strong> This app exists because of Josh and Brad — 
              using this tool, we identified Josh's rights and uncovered extensive errors in his case. 
              <span className="text-amber-400 font-medium"> He now has an appeal on all grounds being actioned.</span>
            </p>
            <p className="text-amber-300 font-medium italic text-center pt-2">
              "If this tool helps even one person discover grounds they didn't know existed, my goal is accomplished."
            </p>
          </div>

          <div className="text-center mt-6">
            <Link to="/terms" className="text-amber-400 hover:text-amber-300 underline text-sm">
              Read the full story & terms
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-amber flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Appeal Case Manager
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link to="/forms" className="hover:text-foreground transition-colors">Forms</Link>
              <Link to="/lawyers" className="hover:text-foreground transition-colors">Find Lawyers</Link>
              <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
              <Link to="/glossary" className="hover:text-foreground transition-colors">Glossary</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Criminal Law Appeal Case Management. Australian Law Only. Not legal advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card
const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="card-elevated p-6 space-y-3">
    <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
      <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
    </div>
    <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
      {title}
    </h3>
    <p className="text-sm text-muted-foreground">{desc}</p>
  </div>
);

// Step Component
const Step = ({ number, title, desc }) => (
  <div className="flex gap-4 items-start">
    <div className="w-10 h-10 rounded-xl gradient-amber flex items-center justify-center text-white font-bold flex-shrink-0">
      {number}
    </div>
    <div>
      <h3 className="font-semibold text-foreground mb-1" style={{ fontFamily: 'Crimson Pro, serif' }}>
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  </div>
);

// Quick Link
const QuickLink = ({ to, icon: Icon, label }) => (
  <Link 
    to={to}
    className="flex items-center gap-3 p-4 rounded-xl bg-background hover:bg-muted transition-colors group"
  >
    <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
    <span className="font-medium text-sm group-hover:text-amber-600 transition-colors">{label}</span>
  </Link>
);

// Resource Card
const ResourceCard = ({ title, desc, link }) => (
  <a 
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="card-elevated p-5 space-y-2 group"
  >
    <h3 className="font-semibold text-foreground group-hover:text-amber-600 transition-colors" style={{ fontFamily: 'Crimson Pro, serif' }}>
      {title} →
    </h3>
    <p className="text-sm text-muted-foreground">{desc}</p>
  </a>
);

export default LandingPage;
