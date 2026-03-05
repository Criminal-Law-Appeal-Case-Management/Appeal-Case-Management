import { Scale, FileText, Clock, Shield, Upload, BarChart3, FileCheck, ChevronRight, AlertTriangle, Presentation, ListChecks, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../App";

const LandingPage = () => {
  const [showLegalFramework, setShowLegalFramework] = useState(false);

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
              Consider just a few examples: judicial bias or errors in directions to the jury, failure to properly 
              apply community standards, prejudicial media coverage influencing jurors, fresh evidence not available 
              at trial, ineffective assistance of counsel, or misapplication of legal principles. Every person has 
              a fundamental right to a fair trial — and that right extends to appeals.
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
                onClick={handleLogin}
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
            <Link to="/glossary" className="hover:text-slate-900">Legal Terms</Link>
            <Link to="/contact" className="hover:text-slate-900">Contact</Link>
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
