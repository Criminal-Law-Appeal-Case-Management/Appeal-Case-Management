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

      {/* See It In Action - Sample Screenshots */}
      <section className="py-16 px-6 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-700 font-semibold text-xs uppercase tracking-widest mb-3">See It In Action</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              How The Process Works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Here's what you can expect when using the tool — from uploading documents to generating reports.
            </p>
          </div>

          <div className="space-y-16">
            
            {/* Sample 1: Case Dashboard with Documents */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-amber-600 font-semibold text-xs uppercase tracking-wider">Step 1</span>
                <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Upload Your Case Documents
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Create a case and upload all relevant documents — transcripts, evidence, court records, witness statements. 
                  The system automatically extracts text using OCR and organises everything in one place. You can categorise 
                  documents by type for easy reference.
                </p>
              </div>
              <div className="bg-slate-100 rounded-lg p-4 border border-slate-200">
                <div className="bg-white rounded border border-slate-200 shadow-sm">
                  <div className="bg-slate-800 text-white px-4 py-2 rounded-t text-sm font-medium">Case: R v Smith [2024]</div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded text-sm">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="flex-1">Trial_Transcript_Day1.pdf</span>
                      <span className="text-xs text-slate-500">Transcript</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded text-sm">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="flex-1">Witness_Statement_Jones.pdf</span>
                      <span className="text-xs text-slate-500">Evidence</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded text-sm">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span className="flex-1">Sentencing_Remarks.pdf</span>
                      <span className="text-xs text-slate-500">Court Document</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded text-sm">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span className="flex-1">Defence_Closing_Submission.pdf</span>
                      <span className="text-xs text-slate-500">Brief</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample 2: Timeline of Events */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 bg-slate-100 rounded-lg p-4 border border-slate-200">
                <div className="bg-white rounded border border-slate-200 shadow-sm p-4">
                  <div className="text-sm font-semibold text-slate-800 mb-4">Timeline of Events</div>
                  <div className="relative pl-6 border-l-2 border-amber-500 space-y-4">
                    <div className="relative">
                      <div className="absolute -left-8 w-4 h-4 bg-amber-500 rounded-full border-2 border-white"></div>
                      <div className="text-xs text-amber-600 font-medium">15 March 2023</div>
                      <div className="text-sm font-medium text-slate-900">Incident Occurred</div>
                      <div className="text-xs text-slate-500">Altercation at residence, 42 Smith St</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-8 w-4 h-4 bg-amber-500 rounded-full border-2 border-white"></div>
                      <div className="text-xs text-amber-600 font-medium">16 March 2023</div>
                      <div className="text-sm font-medium text-slate-900">Arrest Made</div>
                      <div className="text-xs text-slate-500">Defendant taken into custody</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-8 w-4 h-4 bg-amber-500 rounded-full border-2 border-white"></div>
                      <div className="text-xs text-amber-600 font-medium">22 August 2023</div>
                      <div className="text-sm font-medium text-slate-900">Trial Commenced</div>
                      <div className="text-xs text-slate-500">NSW Supreme Court, Justice Williams</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-8 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                      <div className="text-xs text-red-600 font-medium">5 September 2023</div>
                      <div className="text-sm font-medium text-slate-900">Verdict & Sentencing</div>
                      <div className="text-xs text-slate-500">Guilty — 18 years imprisonment</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <span className="text-amber-600 font-semibold text-xs uppercase tracking-wider">Step 2</span>
                <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  AI-Generated Timeline
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The system analyses your documents and automatically builds a chronological timeline of key events. 
                  This helps visualise the sequence of what happened — from the incident through arrest, trial, and sentencing. 
                  You can also add events manually and link them to specific documents.
                </p>
              </div>
            </div>

            {/* Sample 3: Grounds of Merit Identified */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-amber-600 font-semibold text-xs uppercase tracking-wider">Step 3</span>
                <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Potential Grounds Identified
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The AI analyses your case documents against known appeal grounds under NSW and Federal law. 
                  It flags potential issues such as procedural errors, misdirections to the jury, or elements 
                  that may not have been properly established. Each ground shows its strength and relevant legal sections.
                  Click "Investigate" to see detailed analysis.
                </p>
              </div>
              <div className="bg-slate-100 rounded-lg p-4 border border-slate-200">
                <div className="bg-white rounded border border-slate-200 shadow-sm p-4 space-y-3">
                  <div className="text-sm font-semibold text-slate-800 mb-2">Potential Grounds of Merit (3 Found)</div>
                  
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

            {/* Sample 4: Reports */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 bg-slate-100 rounded-lg p-4 border border-slate-200">
                <div className="space-y-3">
                  {/* Quick Summary Report */}
                  <div className="bg-white rounded border border-slate-200 shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-slate-800">QUICK SUMMARY REPORT</span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p><strong>Case:</strong> R v Smith [2024]</p>
                      <p><strong>Grounds Identified:</strong> 3 potential grounds</p>
                      <p><strong>Strongest Ground:</strong> Misdirection on mens rea</p>
                      <p><strong>Recommendation:</strong> Seek legal review of jury directions</p>
                    </div>
                  </div>
                  
                  {/* Full Report Preview */}
                  <div className="bg-white rounded border border-slate-200 shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-slate-800">FULL DETAILED REPORT</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      <p>Comprehensive analysis including case summary, all identified grounds with legal citations, 
                      relevant case law, and detailed recommendations for each potential appeal point...</p>
                    </div>
                  </div>
                  
                  {/* Extensive Log Preview */}
                  <div className="bg-white rounded border border-slate-200 shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-slate-800">EXTENSIVE LOG REPORT</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      <p>Complete audit trail with document analysis, timeline events, all grounds with full legal framework, 
                      similar cases, and step-by-step appeal process guidance...</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <span className="text-amber-600 font-semibold text-xs uppercase tracking-wider">Step 4</span>
                <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Generate Reports
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Generate three types of reports to suit your needs:
                </p>
                <ul className="text-slate-600 text-sm space-y-2">
                  <li><strong className="text-slate-900">Quick Summary:</strong> A brief overview of the case and key findings — perfect for initial assessment.</li>
                  <li><strong className="text-slate-900">Full Detailed:</strong> Comprehensive analysis with legal citations, case law references, and detailed ground-by-ground breakdown.</li>
                  <li><strong className="text-slate-900">Extensive Log:</strong> Complete documentation including all analysis, timeline, documents reviewed, and step-by-step appeal guidance.</li>
                </ul>
              </div>
            </div>

            {/* Sample 5: Appeal Progress Tracker */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-amber-600 font-semibold text-xs uppercase tracking-wider">Step 5</span>
                <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Track Your Appeal Progress
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The appeal checklist helps you track what's been done and what comes next. 
                  Each step in the appeal process is laid out clearly — from filing a Notice of Intention 
                  to preparing submissions. Check off completed items and always know your next action.
                </p>
              </div>
              <div className="bg-slate-100 rounded-lg p-4 border border-slate-200">
                <div className="bg-white rounded border border-slate-200 shadow-sm p-4">
                  <div className="text-sm font-semibold text-slate-800 mb-3">Appeal Progress Checklist</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded">
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-green-800">File Notice of Intention to Appeal</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded">
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-green-800">Obtain Trial Transcripts</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-amber-50 border border-amber-200 rounded">
                      <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <span className="text-sm text-amber-800 font-medium">Identify Grounds of Appeal ← Current Step</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded">
                      <div className="w-5 h-5 bg-slate-300 rounded"></div>
                      <span className="text-sm text-slate-500">Draft Appeal Submissions</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded">
                      <div className="w-5 h-5 bg-slate-300 rounded"></div>
                      <span className="text-sm text-slate-500">File Appeal with Court of Criminal Appeal</span>
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
                <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Barrister Presentation View
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
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
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 text-xs uppercase tracking-widest mb-4 text-center">About</p>
          <p className="text-white text-lg leading-relaxed mb-6 text-center">
            Created by <strong>Debra King</strong> — not a lawyer, but someone who spent years 
            researching criminal law after seeing mates failed by a system that offers little support 
            once sentenced.
          </p>
          
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              <strong className="text-white">The reality is:</strong> from manifest injustice to denial of procedural fairness, 
              from critical elements missed or incorrectly applied at sentencing, to failures by defence counsel, 
              errors by the judge, or simply unsafe and unsatisfactory verdicts — there are <em>many</em> potential 
              grounds that can arise in criminal matters.
            </p>
            
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Consider just a few examples: <span className="text-white">judicial bias or errors in directions to the jury</span>, 
              <span className="text-white">failure to properly apply community standards</span>, 
              <span className="text-white">prejudicial media coverage influencing jurors</span>, 
              <span className="text-white">fresh evidence not available at trial</span>, 
              <span className="text-white">ineffective assistance of counsel</span>, or 
              <span className="text-white">misapplication of legal principles</span>. 
              Every person has a fundamental right to a fair trial — and that right extends to appeals.
            </p>

            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Unless you're a legal expert or have thousands of dollars to seek advice from lawyers and barristers, 
              these issues often go unnoticed. And even legal professionals — usually overcommitted with heavy 
              caseloads — don't always have the time or capacity for the kind of outside-the-box thinking needed 
              to catch every potential issue.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-amber-400">That's where this tool comes in.</strong> It provides a fast, 
              potential overview of issues that may warrant further investigation — giving families, support networks, 
              and even legal professionals a starting point they might not otherwise have.
            </p>
          </div>

          <p className="text-slate-400 text-sm italic text-center">
            "I just wanted to create something that could help others without them spending years working it out themselves."
          </p>
          <div className="text-center">
            <Link to="/terms" className="inline-block mt-6 text-amber-500 hover:text-amber-400 text-sm underline">
              Read the full story & terms
            </Link>
          </div>
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
