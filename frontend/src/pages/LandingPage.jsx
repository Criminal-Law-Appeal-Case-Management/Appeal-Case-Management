import { Scale, FileText, Clock, Shield, Upload, BarChart3, FileCheck, ChevronRight, AlertTriangle, Moon, Sun, Menu, X, Check, Eye, Sparkles, MessageSquare, Download } from "lucide-react";
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
  const [activePreview, setActivePreview] = useState("documents");

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
      <section className="pt-36 pb-12 px-6">
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

      {/* App Preview Section - Always visible */}
      <section className="py-12 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-amber-600 dark:text-amber-500 font-semibold text-sm uppercase tracking-widest mb-2">See It In Action</p>
            <h2 
              className="text-2xl sm:text-3xl font-bold text-foreground"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              What You'll Get
            </h2>
          </div>

          {/* Preview Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <PreviewTab 
              active={activePreview === "documents"} 
              onClick={() => setActivePreview("documents")}
              icon={Upload}
              label="Documents"
            />
            <PreviewTab 
              active={activePreview === "timeline"} 
              onClick={() => setActivePreview("timeline")}
              icon={Clock}
              label="Timeline"
            />
            <PreviewTab 
              active={activePreview === "grounds"} 
              onClick={() => setActivePreview("grounds")}
              icon={Scale}
              label="Grounds"
            />
            <PreviewTab 
              active={activePreview === "reports"} 
              onClick={() => setActivePreview("reports")}
              icon={FileText}
              label="Reports"
            />
          </div>

          {/* Preview Content */}
          <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
            {activePreview === "documents" && <DocumentsPreview />}
            {activePreview === "timeline" && <TimelinePreview />}
            {activePreview === "grounds" && <GroundsPreview state={selectedState?.abbr || "NSW"} />}
            {activePreview === "reports" && <ReportsPreview />}
          </div>
        </div>
      </section>

      {/* Features Section - Only show after state selection */}
      {selectedState && (
        <>
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

// Preview Tab Button
const PreviewTab = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
      active 
        ? "bg-primary text-primary-foreground shadow-lg" 
        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-amber-500"
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

// Documents Preview Mockup
const DocumentsPreview = () => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
        Case Documents
      </h3>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">12 files</span>
        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Upload className="w-4 h-4 text-amber-600" />
        </div>
      </div>
    </div>
    
    <div className="grid gap-3">
      <DocumentRow name="Trial_Transcript_Day1.pdf" size="2.4 MB" status="OCR Complete" type="Transcript" />
      <DocumentRow name="Police_Statement_Witness1.pdf" size="890 KB" status="OCR Complete" type="Statement" />
      <DocumentRow name="ERISP_Interview.pdf" size="1.2 MB" status="Processing..." type="Evidence" />
      <DocumentRow name="Sentencing_Remarks.docx" size="456 KB" status="Extracted" type="Judgment" />
      <DocumentRow name="Appeal_Grounds_Draft.pdf" size="234 KB" status="Uploaded" type="Appeal" />
    </div>
    
    <div className="mt-6 p-4 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/10 text-center">
      <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
      <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Drag & drop files here</p>
      <p className="text-xs text-amber-600 dark:text-amber-500">PDF, DOCX, TXT, Images supported</p>
    </div>
  </div>
);

const DocumentRow = ({ name, size, status, type }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{size} • {type}</p>
      </div>
    </div>
    <span className={`text-xs px-2 py-1 rounded-lg ${
      status === "OCR Complete" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
      status === "Processing..." ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
      "bg-muted text-muted-foreground"
    }`}>
      {status}
    </span>
  </div>
);

// Timeline Preview Mockup
const TimelinePreview = () => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
        Case Timeline
      </h3>
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium">
        <Sparkles className="w-4 h-4" />
        AI Generate
      </button>
    </div>
    
    <div className="space-y-4">
      <TimelineEvent 
        date="15 Mar 2023" 
        title="Arrest" 
        desc="Defendant arrested at residence"
        category="Pre-Trial"
        significance="critical"
      />
      <TimelineEvent 
        date="16 Mar 2023" 
        title="Charge Laid" 
        desc="Charged with Murder under s18 Crimes Act"
        category="Pre-Trial"
        significance="critical"
      />
      <TimelineEvent 
        date="20 Mar 2023" 
        title="Bail Refused" 
        desc="Bail application refused - flight risk"
        category="Pre-Trial"
        significance="important"
      />
      <TimelineEvent 
        date="12 Jun 2023" 
        title="Committal Hearing" 
        desc="Committed to stand trial in Supreme Court"
        category="Pre-Trial"
        significance="important"
      />
      <TimelineEvent 
        date="4 Sep 2023" 
        title="Trial Commenced" 
        desc="Jury empanelled, opening statements"
        category="Trial"
        significance="critical"
      />
    </div>
  </div>
);

const TimelineEvent = ({ date, title, desc, category, significance }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full ${
        significance === "critical" ? "bg-red-500" :
        significance === "important" ? "bg-amber-500" : "bg-slate-400"
      }`} />
      <div className="w-0.5 h-full bg-border" />
    </div>
    <div className="flex-1 pb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono text-muted-foreground">{date}</span>
        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{category}</span>
      </div>
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  </div>
);

// Grounds Preview Mockup
const GroundsPreview = ({ state }) => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
        Grounds of Appeal
      </h3>
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium">
        <Sparkles className="w-4 h-4" />
        AI Identify Grounds
      </button>
    </div>
    
    <div className="space-y-4">
      <GroundCard 
        title="Miscarriage of Justice - Jury Directions"
        type="Procedural Error"
        strength="Strong"
        law={`Criminal Appeal Act 1912 (${state}) s6(1)`}
        desc="Trial judge failed to adequately direct jury on standard of proof for circumstantial evidence."
      />
      <GroundCard 
        title="Fresh Evidence - Alibi Witness"
        type="Fresh Evidence"
        strength="Moderate"
        law={`Criminal Appeal Act 1912 (${state}) s6(3)`}
        desc="New witness statement provides alibi for critical timeframe not available at trial."
      />
      <GroundCard 
        title="Sentence Manifestly Excessive"
        type="Sentencing Error"
        strength="Moderate"
        law={`Crimes (Sentencing Procedure) Act 1999 (${state})`}
        desc="Non-parole period exceeds comparable sentences for similar offences."
      />
    </div>
  </div>
);

const GroundCard = ({ title, type, strength, law, desc }) => (
  <div className="p-4 rounded-xl border border-border bg-card hover:border-amber-500/50 transition-colors">
    <div className="flex items-start justify-between mb-2">
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
            {type}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded ${
            strength === "Strong" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
            "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
          }`}>
            {strength}
          </span>
        </div>
      </div>
      <Scale className="w-5 h-5 text-amber-500" />
    </div>
    <p className="text-sm text-muted-foreground mb-2">{desc}</p>
    <p className="text-xs font-mono text-blue-600 dark:text-blue-400">{law}</p>
  </div>
);

// Reports Preview Mockup
const ReportsPreview = () => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
        Generate Reports
      </h3>
    </div>
    
    <div className="grid md:grid-cols-3 gap-4">
      <ReportCard 
        title="Quick Summary"
        price="FREE"
        desc="Overview of case, key dates, and identified grounds count."
        features={["Case overview", "Timeline summary", "Grounds count"]}
        highlight={false}
      />
      <ReportCard 
        title="Full Detailed"
        price="$29"
        desc="Comprehensive analysis with legal references and case law."
        features={["Everything in Quick", "Full grounds analysis", "Legal citations", "Similar cases"]}
        highlight={true}
      />
      <ReportCard 
        title="Extensive Log"
        price="$39"
        desc="Complete documentation package for legal professionals."
        features={["Everything in Full", "Document index", "Evidence matrix", "Expert format"]}
        highlight={false}
      />
    </div>
    
    <div className="mt-6 p-4 rounded-xl bg-muted/50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-emerald-600" />
        <div>
          <p className="text-sm font-medium text-foreground">Quick Summary - R v Smith</p>
          <p className="text-xs text-muted-foreground">Generated 2 hours ago</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-muted">
          <Eye className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-lg hover:bg-muted">
          <Download className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  </div>
);

const ReportCard = ({ title, price, desc, features, highlight }) => (
  <div className={`p-5 rounded-xl border-2 ${
    highlight 
      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/10" 
      : "border-border bg-card"
  }`}>
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-semibold text-foreground">{title}</h4>
      <span className={`text-lg font-bold ${highlight ? "text-amber-600" : "text-foreground"}`}>
        {price}
      </span>
    </div>
    <p className="text-sm text-muted-foreground mb-4">{desc}</p>
    <ul className="space-y-2">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-2 text-sm">
          <Check className={`w-4 h-4 ${highlight ? "text-amber-500" : "text-emerald-500"}`} />
          <span className="text-muted-foreground">{f}</span>
        </li>
      ))}
    </ul>
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
