import { Scale, FileText, Clock, Shield, Upload, BarChart3, FileCheck, ChevronRight, AlertTriangle, Presentation, ListChecks, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const LandingPage = () => {
  const [showLegalFramework, setShowLegalFramework] = useState(false);

  const handleLogin = () => {
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Header */}
      <header className="bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-7 h-7 text-amber-500" />
            <span className="text-lg font-semibold text-white tracking-tight" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Appeal Case Manager
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/terms" className="hidden md:block text-slate-400 hover:text-white text-sm transition-colors">
              Terms
            </Link>
            <Button 
              onClick={handleLogin}
              data-testid="login-btn"
              className="bg-amber-600 text-white hover:bg-amber-700 rounded px-4 py-2 text-sm font-medium"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Single Clear Disclaimer */}
      <div className="bg-red-700 py-3">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-white text-center text-sm md:text-base font-medium">
            <AlertTriangle className="w-4 h-4 inline mr-2 -mt-0.5" />
            <strong>NOT LEGAL ADVICE</strong> — Creator is not a lawyer. All results must be verified by a qualified legal professional.
            <Link to="/terms" className="underline ml-2 hover:text-amber-200">Read full terms</Link>
          </p>
        </div>
      </div>

      {/* Hero - Clean & Direct */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-700 font-semibold text-xs uppercase tracking-widest mb-4">
            Murder • Manslaughter • Mens Rea
          </p>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Appeal Research Tool
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Organise case documents, generate timelines, and identify potential appeal issues under NSW and Australian Federal law.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleLogin}
              data-testid="hero-login-btn"
              className="bg-slate-900 text-white hover:bg-slate-800 rounded px-8 py-3 text-base font-medium inline-flex items-center justify-center gap-2"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Link to="/professional-summary">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-600 hover:bg-slate-50 rounded px-8 py-3 text-base font-medium"
              >
                For Legal Professionals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features - Grid */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12" style={{ fontFamily: 'Crimson Pro, serif' }}>
            What You Can Do
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard icon={Upload} title="Upload Documents" desc="Organise case files in one place" />
            <FeatureCard icon={Clock} title="Build Timelines" desc="AI-generated event chronology" />
            <FeatureCard icon={BarChart3} title="Find Issues" desc="Flag potential appeal grounds" />
            <FeatureCard icon={FileCheck} title="Generate Reports" desc="Structured case summaries" />
            <FeatureCard icon={FileText} title="OCR Extraction" desc="Text from scanned documents" />
            <FeatureCard icon={Presentation} title="Barrister View" desc="Professional presentation mode" />
            <FeatureCard icon={ListChecks} title="Progress Tracker" desc="Track appeal process steps" />
            <FeatureCard icon={Shield} title="Secure Storage" desc="Your data, your control" />
          </div>
        </div>
      </section>

      {/* Legal Framework - Collapsible */}
      <section className="py-12 px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setShowLegalFramework(!showLegalFramework)}
            className="w-full flex items-center justify-between p-4 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-slate-600" />
              <span className="font-semibold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Applicable Legal Framework
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                NSW Crimes Act 1900 • Criminal Code Act 1995 (Cth) • Human Rights
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${showLegalFramework ? 'rotate-180' : ''}`} />
          </button>
          
          {showLegalFramework && (
            <div className="mt-4 p-6 bg-slate-900 rounded-lg text-sm">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-amber-500 font-semibold text-xs uppercase tracking-wider mb-3">NSW State</h4>
                  <p className="text-white font-medium mb-2">Crimes Act 1900</p>
                  <ul className="text-slate-400 space-y-1 text-xs">
                    <li>s.18 — Murder & manslaughter</li>
                    <li>s.19A/19B — Punishment</li>
                    <li>s.23/23A — Self-defence</li>
                    <li>s.24-27 — Provocation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-amber-500 font-semibold text-xs uppercase tracking-wider mb-3">Federal</h4>
                  <p className="text-white font-medium mb-2">Criminal Code Act 1995</p>
                  <ul className="text-slate-400 space-y-1 text-xs">
                    <li>Div 5 — Fault elements (mens rea)</li>
                    <li>s.5.1-5.4 — Intention, knowledge, recklessness, negligence</li>
                    <li>Div 7 — Mistake/ignorance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-amber-500 font-semibold text-xs uppercase tracking-wider mb-3">Appeals & Rights</h4>
                  <ul className="text-slate-400 space-y-1 text-xs">
                    <li>Criminal Appeal Act 1912 (NSW)</li>
                    <li>Crimes (Appeal & Review) Act 2001</li>
                    <li>Human Rights Commission Act 1986</li>
                    <li>ICCPR • Evidence Act 1995</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About - Brief */}
      <section className="py-16 px-6 bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-500 text-xs uppercase tracking-widest mb-4">About</p>
          <p className="text-white text-lg leading-relaxed mb-4">
            Created by <strong>Debra King</strong> — not a lawyer, but someone who spent years 
            researching criminal law after seeing mates failed by a system that offers little support 
            once sentenced.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            From inadequate legal aid to poor communication of appeal rights, too many people face 
            unjust handling at every stage of the appellate process. This tool exists to help 
            identify potential grounds that might otherwise go unnoticed.
          </p>
          <p className="text-slate-400 text-sm italic">
            "I just wanted to create something that could help others without them spending years working it out themselves."
          </p>
          <Link to="/terms" className="inline-block mt-6 text-amber-500 hover:text-amber-400 text-sm underline">
            Read the full story & terms
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Ready to Start?
          </h2>
          <p className="text-slate-600 mb-6">
            Sign in to organise your case and identify potential appeal issues.
          </p>
          <Button
            onClick={handleLogin}
            data-testid="cta-login-btn"
            className="bg-amber-600 text-white hover:bg-amber-700 rounded px-8 py-3 font-medium"
          >
            Sign In with Google
          </Button>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-8 px-6 border-t border-slate-200 bg-slate-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-slate-400" />
            <span className="text-slate-600 text-sm">Appeal Case Manager</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/terms" className="hover:text-slate-900">Terms & Privacy</Link>
            <Link to="/professional-summary" className="hover:text-slate-900">For Lawyers</Link>
          </div>
          <p className="text-xs text-red-600 font-medium">
            Not legal advice • Creator not a lawyer
          </p>
        </div>
      </footer>
    </div>
  );
};

// Simple Feature Card Component
const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
    <Icon className="w-5 h-5 text-amber-600 mb-2" />
    <h3 className="font-semibold text-slate-900 text-sm mb-1">{title}</h3>
    <p className="text-slate-500 text-xs">{desc}</p>
  </div>
);

export default LandingPage;
