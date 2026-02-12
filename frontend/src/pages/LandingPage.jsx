import { Scale, FileText, Clock, Shield } from "lucide-react";
import { Button } from "../components/ui/button";

const LandingPage = () => {
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const handleLogin = () => {
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="glass-header fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-slate-900" />
            <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Justitia AI
            </span>
          </div>
          <Button 
            onClick={handleLogin}
            data-testid="login-btn"
            className="bg-slate-900 text-white hover:bg-slate-800 rounded-md px-6 py-2.5 font-medium transition-all shadow-sm hover:shadow-md"
          >
            Sign In with Google
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Criminal Appeal Case Management
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Organize documents, build timelines, and generate AI-powered legal analysis 
            for murder appeal cases under NSW State and Australian Federal law.
          </p>
          <div className="mt-10">
            <Button
              onClick={handleLogin}
              data-testid="hero-login-btn"
              className="bg-slate-900 text-white hover:bg-slate-800 rounded-md px-8 py-3 text-lg font-medium transition-all shadow-sm hover:shadow-lg btn-hover"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-semibold text-slate-900 text-center mb-16"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Built for Legal Professionals
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200" data-testid="feature-documents">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Document Management
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Upload and organize briefs, case notes, evidence, and court documents in one secure location.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200" data-testid="feature-timeline">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Timeline Builder
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Create chronological timelines of events that update automatically as you add new information.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200" data-testid="feature-analysis">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                AI Legal Analysis
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Identify grounds of merit and relevant law sections with AI-powered analysis specific to murder appeals.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200" data-testid="feature-reports">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Barrister Reports
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Generate professional reports ready for presentation, with clear grounds of merit and legal references.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl font-semibold text-white mb-6"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Start Building Your Case Today
          </h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Streamline your criminal appeal preparation with AI-assisted analysis and professional documentation.
          </p>
          <Button
            onClick={handleLogin}
            data-testid="cta-login-btn"
            className="bg-white text-slate-900 hover:bg-slate-100 rounded-md px-8 py-3 text-lg font-medium transition-all shadow-sm hover:shadow-lg"
          >
            Sign In with Google
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-slate-600" />
            <span className="text-slate-600 font-medium" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Justitia AI
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Criminal Appeal Case Management for NSW State &amp; Australian Federal Law
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
