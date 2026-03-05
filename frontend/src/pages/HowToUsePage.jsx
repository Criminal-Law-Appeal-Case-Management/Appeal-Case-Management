import { useState } from "react";
import { Scale, ArrowLeft, Moon, Sun, Menu, X, Upload, FileText, Clock, BarChart3, CheckCircle, ChevronRight, Search, FileCheck, Presentation, Download, AlertTriangle, Users, Lightbulb, Gavel } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const HowToUsePage = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Header */}
      <header className="bg-slate-900 dark:bg-slate-950 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight hidden sm:block" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Appeal Case Manager
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/glossary" className="text-slate-400 hover:text-white text-sm transition-colors">Legal Terms</Link>
            <Link to="/legal-resources" className="text-slate-400 hover:text-white text-sm transition-colors">Resources</Link>
            <Link to="/faq" className="text-slate-400 hover:text-white text-sm transition-colors">FAQ</Link>
            <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 px-6 py-4 space-y-3">
            <Link to="/glossary" className="block py-2 text-slate-300 hover:text-white">Legal Terms</Link>
            <Link to="/legal-resources" className="block py-2 text-slate-300 hover:text-white">Resources</Link>
            <Link to="/faq" className="block py-2 text-slate-300 hover:text-white">FAQ</Link>
            <Link to="/" className="block py-2 text-amber-500 hover:text-amber-400">Back to Home</Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="py-12 px-6 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
            How to Use the App
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A step-by-step guide to help you get the most out of Appeal Case Manager. 
            Follow these steps to organise your case and identify potential appeal grounds.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-8 px-6 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-foreground mb-2">Before You Start</h2>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Gather your documents</strong> — transcripts, evidence, court records, witness statements</li>
                <li>• <strong>Note key dates</strong> — incident date, arrest, trial, sentencing</li>
                <li>• <strong>Know your deadline</strong> — you usually have 28 days from sentencing to file an appeal</li>
                <li>• <strong>This is NOT legal advice</strong> — always consult a qualified lawyer</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-16">
          
          {/* STEP 1: Create Account */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">STEP 1</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Create Your Account
              </h3>
              <p className="text-muted-foreground mb-4">Sign up for free using your email or Google account. Your data is secure and private.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Click 'Sign In' or 'Get Started Free' on the homepage</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Choose to sign up with Google or create an account with email/password</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Verify your email address if using email signup</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> You'll be taken to your personal dashboard</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                <strong>Tip:</strong> Use the same account across devices to keep your cases synced.
              </div>
            </div>
            {/* Screenshot mockup */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-8 text-center">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                    <Scale className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-white font-bold text-lg">Welcome Back</h4>
                  <p className="text-white/80 text-sm">Sign in to manage your cases</p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Email Address</label>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400">your@email.com</div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Password</label>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400">••••••••</div>
                  </div>
                  <div className="bg-amber-500 text-white text-center py-2.5 rounded-lg font-medium text-sm">Sign In</div>
                  <p className="text-center text-xs text-slate-500">Don't have an account? <span className="text-amber-600">Sign up</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Create Case */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="order-2 md:order-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-5">
                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Create New Case
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Case Name</label>
                    <div className="border border-border rounded-lg px-3 py-2 text-sm">R v Smith [2024] NSWSC 142</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Jurisdiction</label>
                      <div className="border border-border rounded-lg px-3 py-2 text-sm flex items-center justify-between">
                        <span>NSW</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Offence Type</label>
                      <div className="border border-border rounded-lg px-3 py-2 text-sm flex items-center justify-between">
                        <span>Murder</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Court</label>
                    <div className="border border-border rounded-lg px-3 py-2 text-sm">Supreme Court of NSW</div>
                  </div>
                  <div className="bg-amber-500 text-white text-center py-2.5 rounded-lg font-medium text-sm mt-4">Create Case</div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">STEP 2</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Create a New Case
              </h3>
              <p className="text-muted-foreground mb-4">Set up your case with basic information about the matter.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> From your Dashboard, click 'Create New Case'</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Enter the case name (e.g., 'R v Smith [2024]')</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Select your State/Territory jurisdiction</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Choose the offence type (Murder, Assault, Drug Supply, etc.)</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Add the court name and any relevant dates</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Click 'Create Case' to save</li>
              </ul>
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-sm text-emerald-800 dark:text-emerald-200">
                <strong>Tip:</strong> Include the citation if you have it — this helps organise your cases.
              </div>
            </div>
          </div>

          {/* STEP 3: Upload Documents */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">STEP 3</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Upload Your Documents
              </h3>
              <p className="text-muted-foreground mb-4">Upload all relevant case documents — transcripts, evidence, statements, court records.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Open your case and go to the 'Documents' tab</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Drag and drop files or click to browse</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Supported formats: PDF, DOCX, images (JPG, PNG)</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> The system automatically extracts text using OCR</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Categorise each document (Transcript, Evidence, Brief, etc.)</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Upload as many documents as you need — there's no limit</li>
              </ul>
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm text-amber-800 dark:text-amber-200">
                <strong>Tip:</strong> Upload everything you have. The more documents, the better the AI analysis will be.
              </div>
            </div>
            {/* Document list mockup */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="bg-slate-800 dark:bg-slate-950 text-white px-4 py-3 rounded-t-xl text-sm font-medium flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-500" />
                  Case: R v Smith [2024]
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl text-sm hover:bg-muted transition-colors">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="flex-1 font-medium text-foreground">Trial_Transcript_Day1.pdf</span>
                    <span className="text-xs text-muted-foreground bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Transcript</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl text-sm hover:bg-muted transition-colors">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="flex-1 font-medium text-foreground">Witness_Statement_Jones.pdf</span>
                    <span className="text-xs text-muted-foreground bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Evidence</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl text-sm hover:bg-muted transition-colors">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <span className="flex-1 font-medium text-foreground">Sentencing_Remarks.pdf</span>
                    <span className="text-xs text-muted-foreground bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">Court Doc</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl text-sm hover:bg-muted transition-colors">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span className="flex-1 font-medium text-foreground">Defence_Closing.pdf</span>
                    <span className="text-xs text-muted-foreground bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">Brief</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: Timeline */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="order-2 md:order-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <div className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Timeline of Events
                </div>
                <div className="relative pl-8 border-l-2 border-amber-500 space-y-5">
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow"></div>
                    <div className="text-xs text-amber-600 font-semibold">15 March 2023</div>
                    <div className="text-sm font-semibold text-foreground">Incident Occurred</div>
                    <div className="text-xs text-muted-foreground">Altercation at residence, 42 Smith St</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow"></div>
                    <div className="text-xs text-amber-600 font-semibold">16 March 2023</div>
                    <div className="text-sm font-semibold text-foreground">Arrest Made</div>
                    <div className="text-xs text-muted-foreground">Defendant taken into custody</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow"></div>
                    <div className="text-xs text-amber-600 font-semibold">22 August 2023</div>
                    <div className="text-sm font-semibold text-foreground">Trial Commenced</div>
                    <div className="text-xs text-muted-foreground">NSW Supreme Court, Justice Williams</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow"></div>
                    <div className="text-xs text-red-600 font-semibold">5 September 2023</div>
                    <div className="text-sm font-semibold text-foreground">Verdict & Sentencing</div>
                    <div className="text-xs text-muted-foreground">Guilty — 18 years imprisonment</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">STEP 4</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Review the AI Timeline
              </h3>
              <p className="text-muted-foreground mb-4">The system automatically creates a chronological timeline of key events.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Go to the 'Timeline' tab in your case</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> The AI analyses your documents and extracts dates and events</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Events are shown in chronological order</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Click on any event to see the source document</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> You can manually add, edit, or remove events</li>
              </ul>
              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm text-purple-800 dark:text-purple-200">
                <strong>Tip:</strong> A clear timeline helps identify gaps in the narrative and potential inconsistencies.
              </div>
            </div>
          </div>

          {/* STEP 5: Analysis */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">STEP 5</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Analyse Potential Grounds
              </h3>
              <p className="text-muted-foreground mb-4">The AI identifies potential grounds of appeal based on your documents.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Go to the 'Analysis' tab in your case</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Click 'Run Analysis' to start the AI review</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> The system checks for: misdirections, procedural fairness issues, evidence problems, sentencing errors</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Each ground shows its strength (Strong/Moderate/Potential)</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Click 'Investigate' on any ground for detailed analysis</li>
              </ul>
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-800 dark:text-red-200">
                <strong>Tip:</strong> The free tier shows how many grounds were found. Upgrade to see full details.
              </div>
            </div>
            {/* Grounds mockup */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
                <div className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  Potential Grounds of Merit (3 Found)
                </div>
                
                <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-800 px-2 py-0.5 rounded">STRONG</span>
                      <h4 className="font-semibold text-foreground text-sm mt-1">Misdirection on Mens Rea</h4>
                      <p className="text-xs text-muted-foreground mt-1">Judge's direction on intent may have been inadequate</p>
                    </div>
                    <button className="text-xs bg-slate-900 text-white px-3 py-1 rounded">Investigate</button>
                  </div>
                </div>
                
                <div className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded">MODERATE</span>
                      <h4 className="font-semibold text-foreground text-sm mt-1">Procedural Fairness Issue</h4>
                      <p className="text-xs text-muted-foreground mt-1">Defence counsel may not have had adequate time</p>
                    </div>
                    <button className="text-xs bg-slate-900 text-white px-3 py-1 rounded">Investigate</button>
                  </div>
                </div>
                
                <div className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">POTENTIAL</span>
                      <h4 className="font-semibold text-foreground text-sm mt-1">Fresh Evidence Available</h4>
                      <p className="text-xs text-muted-foreground mt-1">New witness statement may impact findings</p>
                    </div>
                    <button className="text-xs bg-slate-900 text-white px-3 py-1 rounded">Investigate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 6: Contradictions */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="order-2 md:order-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <div className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-orange-600" />
                  Contradictions Found (2)
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h4 className="font-semibold text-foreground text-sm">Witness Timeline Conflict</h4>
                    <p className="text-xs text-muted-foreground mt-1">Witness A states event at 9pm, Witness B says 11pm</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">Statement_A.pdf p.12</span>
                      <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">Statement_B.pdf p.5</span>
                    </div>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h4 className="font-semibold text-foreground text-sm">Evidence Description Mismatch</h4>
                    <p className="text-xs text-muted-foreground mt-1">Weapon described differently by prosecution and police report</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">Transcript p.84</span>
                      <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">Police_Report.pdf p.3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Search className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">STEP 6</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Find Contradictions
              </h3>
              <p className="text-muted-foreground mb-4">Use the Contradiction Finder to identify inconsistencies across documents.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Go to the 'Contradictions' tab</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> The AI compares statements across all your documents</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Identifies where witnesses contradict each other</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Highlights timeline inconsistencies</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Each contradiction links to the source documents</li>
              </ul>
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-sm text-orange-800 dark:text-orange-200">
                <strong>Tip:</strong> Contradictions can be powerful evidence of unreliable testimony.
              </div>
            </div>
          </div>

          {/* STEP 7: Progress Tracker */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">STEP 7</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Track Your Progress
              </h3>
              <p className="text-muted-foreground mb-4">Use the Appeal Checklist to track what's been done and what's next.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Go to the 'Progress' tab</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> See the standard appeal process steps</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Check off completed items</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Track important deadlines</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Know your next action at all times</li>
              </ul>
              <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-sm text-teal-800 dark:text-teal-200">
                <strong>Tip:</strong> Appeals have strict deadlines — usually 28 days to file Notice of Intention.
              </div>
            </div>
            {/* Progress mockup */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <div className="text-base font-semibold text-foreground mb-4">Appeal Progress Checklist</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                    <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-green-800 dark:text-green-200">File Notice of Intention to Appeal</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                    <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-green-800 dark:text-green-200">Obtain Trial Transcripts</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                    <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <span className="text-sm text-amber-800 dark:text-amber-200 font-medium">Identify Grounds of Appeal ← Current</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
                    <div className="w-5 h-5 bg-slate-300 dark:bg-slate-600 rounded"></div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Draft Appeal Submissions</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
                    <div className="w-5 h-5 bg-slate-300 dark:bg-slate-600 rounded"></div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">File Appeal with Court</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 8: Reports */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="order-2 md:order-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground text-sm">Quick Summary</span>
                    <span className="text-green-600 font-bold text-sm">FREE</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Overview of case and ground count</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground text-sm">Full Detailed Report</span>
                    <span className="text-blue-600 font-bold text-sm">$29</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Complete analysis with citations</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground text-sm">Extensive Log Report</span>
                    <span className="text-purple-600 font-bold text-sm">$39</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Everything plus step-by-step guidance</p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">STEP 8</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Generate Reports
              </h3>
              <p className="text-muted-foreground mb-4">Create professional reports summarising your case and findings.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Go to the 'Reports' tab</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Choose your report type: Quick Summary (Free), Full Detailed ($29), or Extensive Log ($39)</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Reports are generated as PDF documents</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Download and share with your lawyer</li>
              </ul>
              <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm text-indigo-800 dark:text-indigo-200">
                <strong>Tip:</strong> The Full Report is ideal to take to a lawyer for review.
              </div>
            </div>
          </div>

          {/* STEP 9: Barrister View */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <Presentation className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">STEP 9</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Use Barrister View
              </h3>
              <p className="text-muted-foreground mb-4">Present your case professionally with the clean Barrister View.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Click 'Barrister View' from your case</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Opens a clean, professional presentation format</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Perfect for meetings with lawyers or counsel</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Shows case summary, grounds, and recommendations</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Can be printed or exported to PDF</li>
              </ul>
              <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                <strong>Tip:</strong> Use this when discussing your case with legal professionals.
              </div>
            </div>
            {/* Barrister view mockup */}
            <div className="bg-slate-900 rounded-2xl p-4">
              <div className="bg-white rounded-xl shadow-lg p-6" style={{ fontFamily: 'Crimson Pro, serif' }}>
                <div className="text-center border-b border-slate-200 pb-4 mb-4">
                  <h4 className="text-lg font-bold text-slate-900">APPEAL CASE SUMMARY</h4>
                  <p className="text-sm text-slate-600">R v Smith [2024] NSWSC 142</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <h5 className="font-semibold text-slate-800">1. PRIMARY GROUND</h5>
                    <p className="text-slate-600 text-xs mt-1">Misdirection on mens rea — The trial judge's direction on intent was inadequate...</p>
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
          </div>

          {/* STEP 10: Export */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="order-2 md:order-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <div className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-pink-600" />
                  Quick Export
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Your ZIP file will contain:</p>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                    <p>📁 All uploaded documents</p>
                    <p>📄 Timeline.docx (editable)</p>
                    <p>📄 Case_Summary.docx (editable)</p>
                    <p>📄 Analysis_Results.pdf</p>
                    <p>📄 Grounds_Report.pdf</p>
                  </div>
                </div>
                <div className="mt-4 bg-pink-500 text-white text-center py-2.5 rounded-lg font-medium text-sm">Download ZIP</div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                  <Download className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">STEP 10</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Export & Share
              </h3>
              <p className="text-muted-foreground mb-4">Export your case data for use outside the app.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Use 'Quick Export' to download everything</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Creates a ZIP file with all documents and reports</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Timeline and summary as editable DOCX files</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Use 'Bundle Documents' to merge PDFs into one file</li>
                <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Share with lawyers, barristers, or Legal Aid</li>
              </ul>
              <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-sm text-pink-800 dark:text-pink-200">
                <strong>Tip:</strong> Editable DOCX files can be customised before submitting to court.
              </div>
            </div>
          </div>

        </div>

        {/* What's Next */}
        <div className="mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-800">
          <h2 className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            What Happens Next?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-foreground mb-2">If Grounds Are Found</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Review the detailed analysis for each ground</li>
                <li>• Generate a Full Report to share with a lawyer</li>
                <li>• Seek legal advice on the strength of your appeal</li>
                <li>• File Notice of Intention to Appeal within deadline</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Getting Legal Help</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Apply to <Link to="/legal-resources" className="text-blue-600 hover:underline">Legal Aid</Link> in your state</li>
                <li>• Contact <Link to="/legal-resources" className="text-blue-600 hover:underline">Pro Bono services</Link></li>
                <li>• Find a lawyer via your <Link to="/legal-resources" className="text-blue-600 hover:underline">Law Society</Link></li>
                <li>• Use the Barrister View when meeting with counsel</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 rounded-xl px-8 py-5 font-semibold shadow-lg shadow-amber-600/20">
              Get Started Now
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 px-6 py-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            Need more help? Check our <Link to="/faq" className="text-amber-500 hover:underline">FAQ</Link> or <Link to="/contact" className="text-amber-500 hover:underline">Contact Us</Link>
          </p>
          <p className="text-red-400 text-xs mt-2 font-medium">
            This guide is for informational purposes only. Always seek professional legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HowToUsePage;
