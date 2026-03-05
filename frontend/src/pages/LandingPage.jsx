import { Scale, FileText, Clock, Shield, Upload, BarChart3, FileCheck, ChevronRight, AlertTriangle, Presentation, ListChecks, ChevronDown, Users, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../App";
import AuthModal from "../components/AuthModal";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showLegalFramework, setShowLegalFramework] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess}
      />
      
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
            <Link to="/success-stories" className="hidden md:block text-slate-400 hover:text-white text-sm transition-colors">
              Success Stories
            </Link>
            <Link to="/glossary" className="hidden md:block text-slate-400 hover:text-white text-sm transition-colors">
              Legal Terms
            </Link>
            <Link to="/contact" className="hidden md:block text-slate-400 hover:text-white text-sm transition-colors">
              Contact
            </Link>
            <Link to="/terms" className="hidden md:block text-slate-400 hover:text-white text-sm transition-colors">
              Terms
            </Link>
            <Button 
              onClick={() => setShowAuthModal(true)}
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
            <strong>NOT LEGAL ADVICE</strong> — Australian Law Only. Creator is not a lawyer. All results must be verified by a qualified legal professional.
            <Link to="/terms" className="underline ml-2 hover:text-amber-200">Read full terms</Link>
          </p>
        </div>
      </div>

      {/* Hero - Clean & Direct */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-700 font-semibold text-xs uppercase tracking-widest mb-4">
            All Australian States & Territories • All Criminal Offences
          </p>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Criminal Appeal Research Tool
          </h1>
          <p className="text-lg text-slate-600 mb-4 max-w-2xl mx-auto">
            Organise case documents, generate timelines, and identify potential appeal issues across all Australian jurisdictions.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">NSW</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">VIC</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">QLD</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">SA</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">WA</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">TAS</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">NT</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">ACT</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">Federal</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">Homicide</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">Assault</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">Sexual Offences</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">Drug Offences</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">Robbery</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">Fraud</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">Firearms</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">DV</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">Driving</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">+ More</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setShowAuthModal(true)}
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

            {/* Sample 4: Reports - Detailed */}
            <div>
              <div className="text-center mb-8">
                <span className="text-amber-600 font-semibold text-xs uppercase tracking-wider">Step 4</span>
                <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Generate Reports
                </h3>
                <p className="text-slate-600 text-sm max-w-2xl mx-auto">
                  Generate three types of reports to suit your needs. Here's what each report looks like:
                </p>
              </div>

              <div className="space-y-8">
                
                {/* Quick Summary Report - Detailed */}
                <div className="bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-200 overflow-hidden">
                  <div className="bg-green-600 text-white px-6 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span className="font-semibold">QUICK SUMMARY REPORT</span>
                    <span className="text-green-200 text-sm ml-2">— Perfect for initial assessment</span>
                  </div>
                  <div className="p-6">
                    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      <div className="border-b border-slate-200 pb-4 mb-4">
                        <h4 className="text-lg font-bold text-slate-900">CASE SUMMARY REPORT</h4>
                        <p className="text-sm text-slate-600">R v Smith [2024] NSWSC 142</p>
                        <p className="text-xs text-slate-500 mt-1">Generated: 5 March 2025</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6 text-sm">
                        <div>
                          <h5 className="font-semibold text-slate-800 mb-2">Case Overview</h5>
                          <ul className="text-slate-600 space-y-1 text-xs">
                            <li><strong>Offence:</strong> Murder (s.18(1)(a) Crimes Act 1900)</li>
                            <li><strong>Verdict:</strong> Guilty</li>
                            <li><strong>Sentence:</strong> 18 years imprisonment (NPP 12 years)</li>
                            <li><strong>Trial Judge:</strong> Justice Williams</li>
                            <li><strong>Documents Analysed:</strong> 12 files</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-800 mb-2">Key Findings</h5>
                          <ul className="text-slate-600 space-y-1 text-xs">
                            <li><strong>Grounds Identified:</strong> 3 potential grounds</li>
                            <li><strong>Strongest Ground:</strong> Misdirection on mens rea</li>
                            <li><strong>Strength Assessment:</strong> Moderate-Strong</li>
                            <li><strong>Appeal Deadline:</strong> 28 days from sentencing</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <h5 className="font-semibold text-slate-800 mb-2 text-sm">Recommendation</h5>
                        <p className="text-xs text-slate-600">
                          Based on initial analysis, this case presents viable grounds for appeal. The primary ground 
                          relates to the trial judge's direction on intent (mens rea). Recommend seeking urgent legal 
                          review of jury directions from qualified counsel.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Detailed Report */}
                <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-200 overflow-hidden">
                  <div className="bg-blue-600 text-white px-6 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span className="font-semibold">FULL DETAILED REPORT</span>
                    <span className="text-blue-200 text-sm ml-2">— Comprehensive analysis with citations</span>
                  </div>
                  <div className="p-6">
                    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      <div className="border-b border-slate-200 pb-4 mb-4">
                        <h4 className="text-lg font-bold text-slate-900">DETAILED APPEAL ANALYSIS</h4>
                        <p className="text-sm text-slate-600">R v Smith [2024] NSWSC 142</p>
                      </div>
                      
                      <div className="space-y-4 text-sm">
                        <div>
                          <h5 className="font-bold text-slate-900 text-base mb-2">1. GROUND ONE: Misdirection on Mens Rea</h5>
                          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-3">
                            <p className="text-xs text-amber-800"><strong>Strength:</strong> STRONG — High likelihood of success</p>
                          </div>
                          <div className="text-xs text-slate-600 space-y-2">
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
                          <h5 className="font-bold text-slate-900 text-base mb-2">2. GROUND TWO: Procedural Fairness</h5>
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
                            <p className="text-xs text-blue-800"><strong>Strength:</strong> MODERATE — Requires further evidence</p>
                          </div>
                          <div className="text-xs text-slate-600">
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
                <div className="bg-gradient-to-r from-purple-50 to-white rounded-xl border border-purple-200 overflow-hidden">
                  <div className="bg-purple-600 text-white px-6 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span className="font-semibold">EXTENSIVE LOG REPORT</span>
                    <span className="text-purple-200 text-sm ml-2">— Complete documentation & guidance</span>
                  </div>
                  <div className="p-6">
                    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      <div className="border-b border-slate-200 pb-4 mb-4">
                        <h4 className="text-lg font-bold text-slate-900">COMPREHENSIVE APPEAL DOCUMENTATION</h4>
                        <p className="text-sm text-slate-600">R v Smith [2024] NSWSC 142 — Complete Record</p>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-xs mb-4">
                        <div className="bg-slate-50 rounded p-3">
                          <p className="font-semibold text-slate-800 mb-1">Documents Analysed</p>
                          <p className="text-slate-600">12 files • 847 pages</p>
                        </div>
                        <div className="bg-slate-50 rounded p-3">
                          <p className="font-semibold text-slate-800 mb-1">Timeline Events</p>
                          <p className="text-slate-600">23 key events identified</p>
                        </div>
                        <div className="bg-slate-50 rounded p-3">
                          <p className="font-semibold text-slate-800 mb-1">Analysis Duration</p>
                          <p className="text-slate-600">Generated in 4m 32s</p>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="border border-slate-200 rounded p-3">
                          <p className="font-semibold text-slate-800">TABLE OF CONTENTS</p>
                          <div className="mt-2 text-slate-600 grid md:grid-cols-2 gap-1">
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

                        <div className="border border-slate-200 rounded p-3">
                          <p className="font-semibold text-slate-800 mb-2">SAMPLE: APPEAL PROCESS GUIDANCE (Section 11)</p>
                          <div className="text-slate-600 space-y-2">
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
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <h4 className="text-amber-500 font-semibold text-xs uppercase tracking-wider mb-3">Homicide & Violence</h4>
                  <ul className="text-slate-400 space-y-1 text-xs">
                    <li className="text-white font-medium">Crimes Act 1900 (NSW)</li>
                    <li>s.18 — Murder & manslaughter</li>
                    <li>s.33-35 — GBH offences</li>
                    <li>s.59-61 — Assault offences</li>
                    <li>s.94-98 — Robbery offences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-amber-500 font-semibold text-xs uppercase tracking-wider mb-3">Drugs & Weapons</h4>
                  <ul className="text-slate-400 space-y-1 text-xs">
                    <li className="text-white font-medium">Drug Misuse & Trafficking Act 1985</li>
                    <li>s.25 — Supply</li>
                    <li>s.33 — Commercial supply</li>
                    <li className="text-white font-medium mt-2">Firearms Act 1996</li>
                    <li>s.7 — Unauthorised possession</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-amber-500 font-semibold text-xs uppercase tracking-wider mb-3">Federal Offences</h4>
                  <ul className="text-slate-400 space-y-1 text-xs">
                    <li className="text-white font-medium">Criminal Code Act 1995 (Cth)</li>
                    <li>Div 5 — Fault elements</li>
                    <li>Div 302-308 — Drug trafficking</li>
                    <li>Div 400 — Money laundering</li>
                    <li>Div 101-103 — Terrorism</li>
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
              <p className="text-slate-500 text-xs text-center mt-4">
                Full framework includes: Sexual offences, Fraud, DV, Driving offences, Public order & more
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About - Brief */}
      <section className="py-16 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 text-xs uppercase tracking-widest mb-4 text-center">About</p>
          
          {/* Business Name & Creator */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Criminal Law Appeal Case Management
            </h3>
            <p className="text-amber-400 text-sm font-medium">Founded by Debra King</p>
          </div>

          {/* Australian Law Only Notice */}
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4 mb-8">
            <p className="text-amber-300 text-sm text-center font-medium">
              <span className="text-amber-400">AUSTRALIAN LAW ONLY</span> — This tool is designed exclusively for 
              Australian Federal and State law matters. All legislation, case law references, and appeal procedures 
              relate to Australian jurisdictions (NSW, VIC, QLD, SA, WA, TAS, NT, ACT).
            </p>
          </div>

          {/* Personal Story */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h4 className="text-white font-semibold mb-4">Why I Built This</h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              I'm not a lawyer — I'm someone who knows firsthand how isolating and confusing the justice system can be. 
              <strong className="text-white"> I served a considerable amount of time in prison.</strong> During that time, 
              I accepted my situation, believing I had no options. What I didn't know then was that I had appellant rights 
              — rights that were never properly explained to me.
            </p>
            
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Legal Aid failed to help me. Like so many others, I fell through the cracks of an overburdened system 
              that offers little support once you're sentenced. I served my time not knowing what could have been challenged.
            </p>

            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              <strong className="text-white">It's now been eight years since I've been free from trouble.</strong> In that time, 
              I've invested years of hard work, research, and determination into building this application. Every hour spent 
              learning criminal law, every late night developing this tool — it was all driven by one goal: to ensure others 
              don't have to go through what I went through.
            </p>

            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              <strong className="text-white">This app exists because of Josh and Brad.</strong> Josh has served 10 years 
              of a 30-year sentence for murder. He was severely let down by the system — and for years, believed he had 
              no options. Using this very app, we identified his rights to a fair trial and uncovered extensive errors 
              in his case. <strong className="text-amber-400">He now has an appeal on all grounds currently being actioned.</strong>
            </p>

            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Brad Fletcher has been on remand for over two years, still waiting for his matter to be finalised. 
              Even at this early stage, we've already identified multiple issues with his case. Once his matter concludes, 
              this app will be there to help him too.
            </p>

            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              <strong className="text-white">Josh and Brad inspired me to build this.</strong> Watching them — and so many 
              others — struggle through a system that offers little help once you're sentenced, I knew something had to change. 
              Best mates for life, and the reason this app exists.
            </p>

            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              The reality is: from manifest injustice to denial of procedural fairness, from critical elements missed 
              at sentencing, to failures by defence counsel, errors by the judge, or simply unsafe verdicts — there are 
              <em> many</em> potential grounds that can arise in criminal matters. Unless you're a legal expert or have 
              thousands of dollars for advice, these issues often go unnoticed.
            </p>

            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-amber-400">If this tool helps even one person discover grounds they didn't know existed, 
              my goal is accomplished.</strong> People can change. I'm living proof of that — and I created this app to prove it.
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

      {/* Legal Options Section */}
      <section className="py-16 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-700 font-semibold text-xs uppercase tracking-widest mb-3">You Have Options</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Legal Help You May Not Know About
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              For most people, Legal Aid is the only affordable option — but private firms are often out of reach. 
              What many don't realise is that there are other avenues for help. <strong>When you think you have no options, 
              there definitely are options.</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Legal Aid */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>Legal Aid</h3>
              <p className="text-slate-600 text-sm mb-3">
                Government-funded legal assistance available in every state. While overburdened, they can provide 
                representation for serious criminal matters and appeals if you meet the eligibility criteria.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• <a href="https://www.legalaid.nsw.gov.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Legal Aid NSW</a></li>
                <li>• <a href="https://www.legalaid.vic.gov.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Victoria Legal Aid</a></li>
                <li>• <a href="https://www.legalaid.qld.gov.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Legal Aid Queensland</a></li>
                <li>• Search "Legal Aid" + your state for other jurisdictions</li>
              </ul>
            </div>

            {/* Pro Bono */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>Pro Bono Legal Services</h3>
              <p className="text-slate-600 text-sm mb-3">
                Many law firms and barristers provide free legal services (pro bono) for those who cannot afford representation. 
                This is not widely advertised but is a genuine option.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• <a href="https://www.probonocentre.org.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Australian Pro Bono Centre</a></li>
                <li>• <a href="https://www.justiceconnect.org.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Justice Connect</a></li>
                <li>• Contact your state's Law Society for pro bono referrals</li>
                <li>• Many barristers accept pro bono criminal appeal cases</li>
              </ul>
            </div>

            {/* Community Legal Centres */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>Community Legal Centres</h3>
              <p className="text-slate-600 text-sm mb-3">
                Independent, non-profit organisations providing free legal advice and assistance. They often help with 
                matters Legal Aid cannot cover and can refer you to specialist services.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• <a href="https://clcs.org.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Community Legal Centres Australia</a></li>
                <li>• <a href="https://www.clcnsw.org.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CLC NSW</a></li>
                <li>• Aboriginal Legal Services in every state</li>
                <li>• Specialist centres for women, youth, and prisoners</li>
              </ul>
            </div>

            {/* Grants & Funding */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>Grants & Special Funding</h3>
              <p className="text-slate-600 text-sm mb-3">
                Various grants and funding programs exist specifically to support criminal appeals and wrongful conviction cases. 
                These are rarely advertised but can cover legal costs.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• <a href="https://www.lawfoundation.net.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Law Foundation grants</a></li>
                <li>• Public Purpose Fund (managed by Law Societies)</li>
                <li>• Innocence projects at universities</li>
                <li>• Crowdfunding for legal defence (GoFundMe, etc.)</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm text-center">
              <strong>Don't give up.</strong> Even if you've been knocked back before, circumstances change and new options emerge. 
              This tool can help you identify potential grounds — then use these resources to find someone to review your case.
            </p>
          </div>
        </div>
      </section>

      {/* Case Law Research Section */}
      <section className="py-16 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">Research</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Search Real Court Decisions
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Access official court databases to find cases similar to yours. These free resources contain real judgments 
              that may support your appeal grounds.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <a 
              href="https://www.caselaw.nsw.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                NSW
              </div>
              <span className="text-white text-sm font-medium">NSW Caselaw</span>
              <span className="text-slate-400 text-xs">caselaw.nsw.gov.au</span>
            </a>

            <a 
              href="https://www.austlii.edu.au/cgi-bin/viewdb/au/cases/vic/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                VIC
              </div>
              <span className="text-white text-sm font-medium">Victorian Cases</span>
              <span className="text-slate-400 text-xs">AustLII Victoria</span>
            </a>

            <a 
              href="https://www.sclqld.org.au/caselaw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                QLD
              </div>
              <span className="text-white text-sm font-medium">QLD Caselaw</span>
              <span className="text-slate-400 text-xs">sclqld.org.au</span>
            </a>

            <a 
              href="https://www.courts.sa.gov.au/judgments"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center text-white font-bold">
                SA
              </div>
              <span className="text-white text-sm font-medium">SA Judgments</span>
              <span className="text-slate-400 text-xs">courts.sa.gov.au</span>
            </a>

            <a 
              href="https://ecourts.justice.wa.gov.au/eCourtsPortal/Decisions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                WA
              </div>
              <span className="text-white text-sm font-medium">WA eCourts</span>
              <span className="text-slate-400 text-xs">ecourts.justice.wa.gov.au</span>
            </a>

            <a 
              href="https://www.austlii.edu.au/cgi-bin/viewdb/au/cases/tas/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                TAS
              </div>
              <span className="text-white text-sm font-medium">Tasmanian Cases</span>
              <span className="text-slate-400 text-xs">AustLII Tasmania</span>
            </a>

            <a 
              href="https://www.austlii.edu.au/cgi-bin/viewdb/au/cases/nt/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                NT
              </div>
              <span className="text-white text-sm font-medium">NT Cases</span>
              <span className="text-slate-400 text-xs">AustLII NT</span>
            </a>

            <a 
              href="https://www.courts.act.gov.au/supreme/judgments"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                ACT
              </div>
              <span className="text-white text-sm font-medium">ACT Judgments</span>
              <span className="text-slate-400 text-xs">courts.act.gov.au</span>
            </a>
          </div>

          {/* Federal Courts & AustLII */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a 
              href="https://www.hcourt.gov.au/cases/cases-heard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-3 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Scale className="w-5 h-5 text-amber-500" />
              <span className="text-white font-medium">High Court of Australia</span>
            </a>
            <a 
              href="https://www.fedcourt.gov.au/judgments"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-3 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Scale className="w-5 h-5 text-amber-500" />
              <span className="text-white font-medium">Federal Court</span>
            </a>
            <a 
              href="https://www.austlii.edu.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Search All on AustLII</span>
            </a>
          </div>

          <p className="text-slate-500 text-xs text-center mt-6">
            All resources are free and publicly accessible. AustLII is the Australasian Legal Information Institute.
          </p>
        </div>
      </section>

      {/* Criminal Legislation Section */}
      <section className="py-16 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-blue-700 font-semibold text-xs uppercase tracking-widest mb-3">Legislation</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Criminal Law by State
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Direct links to the primary criminal legislation for each Australian jurisdiction. 
              Know your rights and understand the law that applies to your case.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* NSW */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  NSW
                </div>
                <h3 className="font-bold text-slate-900">New South Wales</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li><a href="https://legislation.nsw.gov.au/view/html/inforce/current/act-1900-040" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Crimes Act 1900</a></li>
                <li><a href="https://legislation.nsw.gov.au/view/html/inforce/current/act-1912-016" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Criminal Appeal Act 1912</a></li>
                <li><a href="https://legislation.nsw.gov.au/view/html/inforce/current/act-1995-025" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Evidence Act 1995</a></li>
                <li><a href="https://legislation.nsw.gov.au/view/html/inforce/current/act-1986-209" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Drug Misuse and Trafficking Act 1985</a></li>
                <li><a href="https://legislation.nsw.gov.au/view/html/inforce/current/act-2007-080" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Crimes (Domestic Violence) Act 2007</a></li>
              </ul>
            </div>

            {/* Victoria */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  VIC
                </div>
                <h3 className="font-bold text-slate-900">Victoria</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.legislation.vic.gov.au/in-force/acts/crimes-act-1958" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Crimes Act 1958</a></li>
                <li><a href="https://www.legislation.vic.gov.au/in-force/acts/criminal-procedure-act-2009" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Criminal Procedure Act 2009</a></li>
                <li><a href="https://www.legislation.vic.gov.au/in-force/acts/evidence-act-2008" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Evidence Act 2008</a></li>
                <li><a href="https://www.legislation.vic.gov.au/in-force/acts/drugs-poisons-and-controlled-substances-act-1981" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Drugs, Poisons Act 1981</a></li>
                <li><a href="https://www.legislation.vic.gov.au/in-force/acts/family-violence-protection-act-2008" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Family Violence Protection Act 2008</a></li>
              </ul>
            </div>

            {/* Queensland */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  QLD
                </div>
                <h3 className="font-bold text-slate-900">Queensland</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.legislation.qld.gov.au/view/html/inforce/current/act-1899-009" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Criminal Code Act 1899</a></li>
                <li><a href="https://www.legislation.qld.gov.au/view/html/inforce/current/act-1977-026" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Criminal Practice Rules 1999</a></li>
                <li><a href="https://www.legislation.qld.gov.au/view/html/inforce/current/act-1977-047" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Evidence Act 1977</a></li>
                <li><a href="https://www.legislation.qld.gov.au/view/html/inforce/current/act-1986-023" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Drugs Misuse Act 1986</a></li>
                <li><a href="https://www.legislation.qld.gov.au/view/html/inforce/current/act-2012-005" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Domestic Violence Act 2012</a></li>
              </ul>
            </div>

            {/* South Australia */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  SA
                </div>
                <h3 className="font-bold text-slate-900">South Australia</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.legislation.sa.gov.au/lz?path=/c/a/criminal%20law%20consolidation%20act%201935" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Criminal Law Consolidation Act 1935</a></li>
                <li><a href="https://www.legislation.sa.gov.au/lz?path=/c/a/evidence%20act%201929" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Evidence Act 1929</a></li>
                <li><a href="https://www.legislation.sa.gov.au/lz?path=/c/a/controlled%20substances%20act%201984" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Controlled Substances Act 1984</a></li>
                <li><a href="https://www.legislation.sa.gov.au/lz?path=/c/a/intervention%20orders%20(prevention%20of%20abuse)%20act%202009" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Intervention Orders Act 2009</a></li>
              </ul>
            </div>

            {/* Western Australia */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  WA
                </div>
                <h3 className="font-bold text-slate-900">Western Australia</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_218_homepage.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Criminal Code Act 1913</a></li>
                <li><a href="https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_221_homepage.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Criminal Appeals Act 2004</a></li>
                <li><a href="https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_327_homepage.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Evidence Act 1906</a></li>
                <li><a href="https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_599_homepage.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Misuse of Drugs Act 1981</a></li>
              </ul>
            </div>

            {/* Commonwealth */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  CTH
                </div>
                <h3 className="font-bold text-slate-900">Commonwealth</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.legislation.gov.au/C2004A04868/latest/text" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Criminal Code Act 1995</a></li>
                <li><a href="https://www.legislation.gov.au/C2004A04858/latest/text" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Evidence Act 1995</a></li>
                <li><a href="https://www.legislation.gov.au/C2004A01586/latest/text" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Judiciary Act 1903</a></li>
                <li><a href="https://www.legislation.gov.au/C2004A03712/latest/text" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Crimes Act 1914</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Human Rights & Fair Trial Section */}
      <section className="py-16 px-6 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-emerald-700 font-semibold text-xs uppercase tracking-widest mb-3">Your Rights</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Human Rights & Fair Trial Laws
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Every person has fundamental rights in criminal proceedings. These laws protect your right to a fair trial, 
              proper legal representation, and humane treatment. <strong>Know your rights.</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* International Human Rights */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">International Human Rights</h3>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                Australia has signed international treaties that protect your rights. While not always directly enforceable, 
                courts must consider these when interpreting Australian law.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <a href="https://www.ohchr.org/en/instruments-mechanisms/instruments/international-covenant-civil-and-political-rights" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline font-medium">
                    International Covenant on Civil and Political Rights (ICCPR)
                  </a>
                </li>
                <li className="pl-4 text-slate-600">
                  • Art 14: Right to fair and public hearing<br/>
                  • Art 14(2): Presumption of innocence<br/>
                  • Art 14(3): Right to legal assistance<br/>
                  • Art 9: Right to liberty and security<br/>
                  • Art 7: Freedom from torture/cruel treatment
                </li>
                <li className="flex items-start gap-2">
                  <a href="https://www.un.org/en/about-us/universal-declaration-of-human-rights" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline font-medium">
                    Universal Declaration of Human Rights (UDHR)
                  </a>
                </li>
                <li className="pl-4 text-slate-600">
                  • Art 10: Right to fair public hearing<br/>
                  • Art 11: Presumption of innocence
                </li>
                <li className="flex items-start gap-2">
                  <a href="https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-against-torture-and-other-cruel-inhuman-or-degrading" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline font-medium">
                    Convention Against Torture (CAT)
                  </a>
                </li>
              </ul>
            </div>

            {/* Australian Human Rights Acts */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-8 h-8 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-lg">Australian Human Rights Laws</h3>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                Some Australian states have enacted Human Rights Acts. These provide direct legal protection 
                and can be used to challenge unfair treatment in criminal proceedings.
              </p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="https://www.legislation.vic.gov.au/in-force/acts/charter-human-rights-and-responsibilities-act-2006" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">
                    Charter of Human Rights (Victoria)
                  </a>
                  <p className="text-slate-600 pl-2 mt-1">Right to fair hearing (s24), presumption of innocence (s25), right not to be tried twice (s26)</p>
                </li>
                <li>
                  <a href="https://www.legislation.act.gov.au/a/2004-5" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">
                    Human Rights Act 2004 (ACT)
                  </a>
                  <p className="text-slate-600 pl-2 mt-1">Fair trial rights (s21), presumption of innocence (s22)</p>
                </li>
                <li>
                  <a href="https://www.legislation.qld.gov.au/view/html/inforce/current/act-2019-005" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">
                    Human Rights Act 2019 (Queensland)
                  </a>
                  <p className="text-slate-600 pl-2 mt-1">Fair hearing (s31), rights in criminal proceedings (s32)</p>
                </li>
                <li>
                  <a href="https://www.legislation.gov.au/C2004A03366/latest/text" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">
                    Australian Human Rights Commission Act 1986 (Cth)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Fair Trial Principles */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              Your Fair Trial Rights
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Before & During Trial</h4>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>• <strong>Presumption of innocence</strong> - guilty must be proven</li>
                  <li>• <strong>Right to silence</strong> - cannot be forced to incriminate yourself</li>
                  <li>• <strong>Right to legal representation</strong> - access to a lawyer</li>
                  <li>• <strong>Disclosure</strong> - prosecution must reveal all evidence</li>
                  <li>• <strong>Adequate time</strong> - to prepare your defence</li>
                  <li>• <strong>Interpreter</strong> - if you don't speak English</li>
                  <li>• <strong>Examine witnesses</strong> - cross-examine prosecution witnesses</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">After Conviction</h4>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>• <strong>Right to appeal</strong> - challenge conviction or sentence</li>
                  <li>• <strong>Not punished twice</strong> - double jeopardy protection</li>
                  <li>• <strong>Proportionate sentence</strong> - punishment must fit the crime</li>
                  <li>• <strong>Humane treatment</strong> - in custody</li>
                  <li>• <strong>Access to courts</strong> - to challenge conditions</li>
                  <li>• <strong>Fresh evidence</strong> - new evidence can reopen case</li>
                  <li>• <strong>Pardon/mercy</strong> - right to seek clemency</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Fairness Resources */}
          <div className="grid md:grid-cols-3 gap-4">
            <a 
              href="https://humanrights.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-4 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Shield className="w-5 h-5 text-slate-600" />
              <span className="font-medium text-slate-900">Human Rights Commission</span>
            </a>
            <a 
              href="https://www.ombudsman.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-4 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Scale className="w-5 h-5 text-slate-600" />
              <span className="font-medium text-slate-900">Commonwealth Ombudsman</span>
            </a>
            <a 
              href="https://www.alrc.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-4 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <FileText className="w-5 h-5 text-slate-600" />
              <span className="font-medium text-slate-900">Law Reform Commission</span>
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-700 font-semibold text-xs uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Simple, Affordable Access
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Basic features are free. Pay only for detailed analysis when you need it — a fraction of what lawyers charge.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Tier */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>Free</h3>
                <span className="text-2xl font-bold text-slate-900">$0</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mb-6">
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
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Get Started Free
              </Button>
            </div>

            {/* Paid Features */}
            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                UNLOCK FULL ANALYSIS
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>Premium Features</h3>
              
              <ul className="space-y-4 text-sm text-slate-700 mb-6">
                <li className="flex items-start gap-2 p-3 bg-white rounded-lg border border-amber-200">
                  <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <strong>Unlock Grounds of Merit</strong>
                      <span className="text-amber-700 font-bold">$50</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">See full details of each potential ground, investigate further with legal citations and case law</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 p-3 bg-white rounded-lg border border-amber-200">
                  <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <strong>Full Detailed Report</strong>
                      <span className="text-amber-700 font-bold">$29</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Comprehensive analysis with recommendations and case law references</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 p-3 bg-white rounded-lg border border-amber-200">
                  <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <strong>Extensive Log Report</strong>
                      <span className="text-amber-700 font-bold">$39</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Complete documentation with step-by-step appeal guidance</p>
                  </div>
                </li>
              </ul>
              <div className="bg-white rounded-lg p-3 text-center text-sm text-slate-600 mb-4">
                <p><strong className="text-slate-900">Compare:</strong> A junior lawyer charges $1,000+ just to review a case</p>
                <p className="text-xs text-slate-500 mt-1">Barristers charge triple that. A full legal report? Thousands.</p>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Secure payment via PayPal
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            * Premium features are per-case. Pay once, access that analysis forever.
          </p>
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
            onClick={() => setShowAuthModal(true)}
            data-testid="cta-login-btn"
            className="bg-amber-600 text-white hover:bg-amber-700 rounded px-8 py-3 font-medium"
          >
            Sign In
          </Button>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-8 px-6 border-t border-slate-200 bg-slate-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-slate-400" />
              <span className="text-slate-900 text-sm font-semibold">Criminal Law Appeal Case Management</span>
            </div>
            <span className="text-slate-500 text-xs mt-1">Founded by Debra King</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/success-stories" className="hover:text-slate-900">Success Stories</Link>
            <Link to="/glossary" className="hover:text-slate-900">Legal Terms</Link>
            <Link to="/contact" className="hover:text-slate-900">Contact</Link>
            <Link to="/terms" className="hover:text-slate-900">Terms & Privacy</Link>
          </div>
          <p className="text-xs text-red-600 font-medium text-center md:text-right">
            Australian Law Only • Not legal advice
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
