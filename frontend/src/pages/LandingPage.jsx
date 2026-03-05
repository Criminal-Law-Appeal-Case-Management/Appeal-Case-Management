import { Scale, FileText, Clock, Shield, AlertTriangle, Heart, Users, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

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
              Appeal Case Manager
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/professional-summary">
              <Button variant="outline" className="hidden md:inline-flex">
                <FileText className="w-4 h-4 mr-2" />
                For Legal Professionals
              </Button>
            </Link>
            <Button 
              onClick={handleLogin}
              data-testid="login-btn"
              className="bg-slate-900 text-white hover:bg-slate-800 rounded-md px-6 py-2.5 font-medium transition-all shadow-sm hover:shadow-md"
            >
              Sign In with Google
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Appeal Case Management Tool
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A document-analysis and case-organisation tool designed to assist with identifying 
            potential appeal issues in homicide cases under NSW State and Australian Federal law.
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

      {/* Why This App Exists - The Problem */}
      <section className="py-16 px-6 bg-gradient-to-b from-slate-100 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              Why This App Exists
            </h2>
            <p className="text-lg text-slate-600">
              Breaking down the barriers that prevent justice
            </p>
          </div>

          {/* The Problem Statement */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  The Problem
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Too many people are sitting in prison with legitimate grounds for appeal but have 
                  <strong> no idea how to identify them</strong>. The legal system is complex, expensive, 
                  and filled with barriers that prevent ordinary people from getting straightforward 
                  answers about their rights.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <Lock className="w-8 h-8 text-slate-400 mb-3" />
                <h4 className="font-semibold text-slate-900 mb-2">Complex Legal Language</h4>
                <p className="text-sm text-slate-600">
                  Legal documents are written in language that's nearly impossible for non-lawyers to understand.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <Users className="w-8 h-8 text-slate-400 mb-3" />
                <h4 className="font-semibold text-slate-900 mb-2">Limited Access to Help</h4>
                <p className="text-sm text-slate-600">
                  Support services are stretched thin. Many inmates can't afford private lawyers to review their case.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <Clock className="w-8 h-8 text-slate-400 mb-3" />
                <h4 className="font-semibold text-slate-900 mb-2">Time-Limited Appeals</h4>
                <p className="text-sm text-slate-600">
                  Appeal deadlines are strict. Without help, valid grounds are missed and time runs out.
                </p>
              </div>
            </div>
          </div>

          {/* The Reality */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <p className="text-amber-900 text-lg leading-relaxed">
              <strong>The reality is this:</strong> Many inmates have strong grounds for appeal — procedural errors, 
              fresh evidence, judicial mistakes, ineffective legal representation — but they don't know it. 
              They don't know what questions to ask or where to look. <strong>They're failed by a system 
              that's supposed to protect them.</strong>
            </p>
          </div>

          {/* The Solution */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  How This Tool Helps
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  This is a <strong>document-analysis and case-organisation tool</strong> designed to assist 
                  with identifying potential appeal issues in homicide cases. It helps with:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <span><strong>Organising trial transcripts</strong> — Upload and categorise all your case documents in one place</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <span><strong>Extracting chronologies</strong> — Automatically build timelines of events from your documents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <span><strong>Identifying timeline inconsistencies</strong> — Detect contradictions and discrepancies in witness statements and evidence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <span><strong>Procedural irregularities</strong> — Flag potential issues with trial procedure that may warrant further review</span>
                  </li>
                </ul>
                
                <p className="text-slate-700 leading-relaxed mt-6 mb-4">
                  The tool can also help analyse complex legal issues including:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span><strong>Jury directions on intent</strong> — Review whether the jury was properly directed on the elements of murder, including intent to kill or cause grievous bodily harm</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span><strong>Reckless indifference</strong> — Analyse whether reckless indifference to human life was properly explained to the jury</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span><strong>Fresh evidence issues</strong> — Identify potential fresh evidence that was not available at trial and may support an appeal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span><strong>Mens rea analysis</strong> — Examine issues relating to mental state, intention, knowledge, and foreseeability in murder convictions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* My Story */}
          <div className="bg-slate-900 rounded-2xl shadow-lg p-8 mt-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Why I Created This App — Debra King
                </h3>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    I created this app because I have <strong className="text-white">two best mates who are locked up</strong>, 
                    and I refuse to stand by while the system fails them.
                  </p>
                  <p>
                    <strong className="text-amber-400">Josh Homann</strong> has been incarcerated for over 10 years of a 
                    30-year sentence. Straight after sentencing, he was told he had no grounds for an appeal. I knew I had 
                    to step up and do something. I've become so knowledgeable on criminal law — NSW and Federal level — on 
                    murder, manslaughter, and mens rea, that I could represent him in this appeal myself.
                  </p>
                  <p>
                    <strong className="text-amber-400">Brad Fletcher</strong> has been on remand for over 2 years, 
                    still awaiting trial.
                  </p>
                  <p className="text-white font-medium">
                    This app exists because too many people are failed by a system that's supposed to protect them. 
                    If I can help identify grounds for appeal that might otherwise be missed, then maybe I can help 
                    others like Josh and Brad.
                  </p>
                </div>
              </div>
            </div>
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
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200" data-testid="feature-documents">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                1. Upload Documents
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Upload court transcripts, evidence briefs, witness statements, and any case documents. The AI reads and analyzes them.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200" data-testid="feature-timeline">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                2. Build Timeline
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Create a chronological timeline of events. AI automatically extracts dates and identifies gaps or inconsistencies.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200" data-testid="feature-analysis">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                3. Find Grounds
              </h3>
              <p className="text-slate-600 leading-relaxed">
                AI identifies potential grounds of merit — procedural errors, fresh evidence, judicial mistakes — with relevant law sections.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200" data-testid="feature-reports">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                4. Generate Reports
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Create professional reports ready to share with barristers, solicitors, or support services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-16 px-6 bg-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl font-semibold text-slate-900 mb-8"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Who Is This For?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Inmates & Their Families</h4>
              <p className="text-sm text-slate-600">
                Understand your case better. Identify potential grounds for appeal. Prepare documents to show legal representatives.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Advocacy Groups</h4>
              <p className="text-sm text-slate-600">
                Help those who can't help themselves. Organize case materials and identify miscarriages of justice.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Legal Professionals</h4>
              <p className="text-sm text-slate-600">
                Streamline appeal preparation. AI-assisted analysis to supplement your legal expertise.
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
            Everyone Deserves a Fair Chance
          </h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Don't let complexity and barriers stand in the way of justice. 
            Start analyzing your case today.
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

      {/* Important Notice */}
      <section className="py-10 px-6 bg-amber-50 border-t border-amber-200">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-amber-900 mb-4 text-center" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Important Notice
          </h3>
          <div className="space-y-4 text-sm text-amber-800">
            <p>
              This application provides AI-assisted document analysis and research support intended to help 
              identify potential issues that may warrant further legal review.
            </p>
            <p>
              The information generated by this tool <strong>does not constitute legal advice</strong> and 
              should not be relied upon as a substitute for advice from a qualified Australian legal practitioner.
            </p>
            <p>
              Users should obtain independent legal advice before making any decision or taking any action 
              in relation to an appeal or criminal proceeding.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Scale className="w-6 h-6 text-amber-400" />
            <span className="text-xl text-white font-medium" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Appeal Case Manager
            </span>
          </div>
          
          {/* Mobile link to Professional Summary */}
          <div className="mb-6 md:hidden">
            <Link to="/professional-summary">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <FileText className="w-4 h-4 mr-2" />
                For Legal Professionals
              </Button>
            </Link>
          </div>
          
          <p className="text-base font-medium text-slate-200 mb-4">
            Created by Debra King — Glenmore Park, NSW
          </p>
          <div className="space-y-3 text-sm text-slate-400 max-w-2xl mx-auto">
            <p>
              Developed to assist prisoners and families in organising case material and identifying 
              potential appeal issues in serious criminal matters, including murder and manslaughter.
            </p>
            <p className="italic">
              This project was inspired by the cases of Joshua Scott Homann and Brad Fletcher, and by 
              the belief that access to justice should not depend solely on a person's ability to 
              navigate complex legal processes.
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-6">
            NSW State &amp; Australian Federal Law Reference
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
