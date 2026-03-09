import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useTheme } from "../contexts/ThemeContext";
import PageHeader from "../components/PageHeader";
import {
  Scale,
  ArrowLeft,
  Moon,
  Sun,
  Menu,
  X,
  Upload,
  Search,
  FileCheck,
  Presentation,
  PlayCircle,
  Sparkles,
  ChevronRight,
  Clock,
  BarChart3,
  FileText,
  ListChecks,
  Shield,
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow text-center">
    <div className="w-10 h-10 mx-auto rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mb-3">
      <Icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
    </div>
    <h3 className="font-semibold text-sm text-foreground mb-1">{title}</h3>
    <p className="text-xs text-muted-foreground">{desc}</p>
  </div>
);

const HowItWorksPage = () => {
  const flowSteps = [
    {
      icon: Upload,
      title: "1. Upload your case material",
      desc: "Add transcripts, exhibits, sentencing remarks, briefs, and timeline records.",
    },
    {
      icon: Search,
      title: "2. Analyse grounds and legal issues",
      desc: "AI highlights potential grounds, legal pressure points, and strategic pathways.",
    },
    {
      icon: FileCheck,
      title: "3. Generate premium reports",
      desc: "Create report tiers with structure, precedents, and court-ready planning detail.",
    },
    {
      icon: Presentation,
      title: "4. Present in Barrister View",
      desc: "Use hearing-focused layouts, strategy summaries, and printable legal briefing format.",
    },
  ];

  const reportPricing = [
    {
      title: "Quick Summary",
      price: "$99 AUD",
      note: "Fast overview, early issue spotting, immediate next actions.",
      tone: "border-green-200 bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Full Detailed Report",
      price: "$100 AUD",
      note: "Premium legal analysis with strategic framing and filing guidance.",
      tone: "border-blue-300 bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Extensive Log Report",
      price: "$150 AUD",
      note: "Barrister-level depth with comparative sentencing and options matrix.",
      tone: "border-purple-300 bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Manrope, sans-serif" }}>
      {/* Shared Page Header with Dark Mode */}
      <PageHeader showBackButton={true} backTo="/" />

      <section className="py-14 px-6 bg-gradient-to-b from-black via-slate-950 to-blue-950 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
              <PlayCircle className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "Crimson Pro, serif" }}>
            How It Works — See It In Action
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto text-base md:text-lg" data-testid="how-it-works-hero-description">
            Watch the full process from document upload to barrister-ready output, then choose the report tier that fits your case.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        <section className="text-center" data-testid="how-it-works-flow-heading">
          <p className="text-xs uppercase tracking-widest text-sky-600 dark:text-sky-500 font-semibold mb-1">Process Flow</p>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Crimson Pro, serif" }}>
            Follow the exact steps from upload to hearing-ready output
          </h2>
        </section>

        <section className="grid md:grid-cols-2 gap-6" data-testid="how-it-works-flow-grid">
          {flowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "Crimson Pro, serif" }}>{step.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            );
          })}
        </section>

        {/* Feature Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard icon={Upload} title="Upload Documents" desc="Organise case files in one place" />
          <FeatureCard icon={Clock} title="Build Timelines" desc="AI-generated event chronology" />
          <FeatureCard icon={BarChart3} title="Find Issues" desc="Flag potential appeal grounds" />
          <FeatureCard icon={FileCheck} title="Generate Reports" desc="Structured case summaries" />
          <FeatureCard icon={FileText} title="OCR Extraction" desc="Text from scanned documents" />
          <FeatureCard icon={Presentation} title="Barrister View" desc="Conference-ready hearing deck" />
          <FeatureCard icon={ListChecks} title="Progress Tracker" desc="Track appeal process steps" />
          <FeatureCard icon={Shield} title="Secure Storage" desc="Your data, your control" />
        </section>

        {/* DETAILED STEP-BY-STEP WITH VISUALS */}
        <section className="space-y-16">
          
          {/* Step 1: Upload Documents */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <span className="text-sky-600 dark:text-sky-500 font-bold text-sm uppercase tracking-wider">Step 1</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mt-2 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Upload Your Case Documents
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Create a case and upload all relevant documents — transcripts, evidence, court records, witness statements. 
                The system automatically extracts text using OCR and organises everything in one place.
              </p>
              <div className="mt-4 flex items-center gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1589307904488-7d60ff29c975?crop=entropy&cs=srgb&fm=jpg&q=85&w=80&h=80&fit=crop" 
                  alt="Legal documents"
                  className="w-14 h-14 rounded-xl object-cover shadow-md"
                />
                <p className="text-sm text-muted-foreground italic">Supports PDF, DOCX, images, and scanned exhibits</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-5 border border-border shadow-lg">
              <div className="bg-slate-800 text-white px-4 py-3 rounded-t-xl text-sm font-medium flex items-center gap-2">
                <Scale className="w-4 h-4 text-sky-500" />
                Case: R v Smith [2024]
              </div>
              <div className="p-4 space-y-2 bg-card rounded-b-xl">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-sm">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="flex-1 font-medium">Trial_Transcript_Day1.pdf</span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Transcript</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-sm">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="flex-1 font-medium">Witness_Statement.pdf</span>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Evidence</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-sm">
                  <FileText className="w-5 h-5 text-sky-600" />
                  <span className="flex-1 font-medium">Sentencing_Remarks.pdf</span>
                  <span className="text-xs bg-sky-100 dark:bg-sky-900/30 px-2 py-1 rounded">Court Doc</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: AI Timeline */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 bg-card rounded-2xl p-5 border border-border shadow-lg">
              <div className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-600" />
                Timeline of Events
              </div>
              <div className="relative pl-6 border-l-2 border-sky-500 space-y-4">
                <div className="relative">
                  <div className="absolute -left-8 w-4 h-4 bg-sky-500 rounded-full border-2 border-white"></div>
                  <div className="text-xs text-sky-600 font-semibold">15 March 2023</div>
                  <div className="text-sm font-semibold text-foreground">Incident Occurred</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-8 w-4 h-4 bg-sky-500 rounded-full border-2 border-white"></div>
                  <div className="text-xs text-sky-600 font-semibold">16 March 2023</div>
                  <div className="text-sm font-semibold text-foreground">Arrest Made</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-8 w-4 h-4 bg-sky-500 rounded-full border-2 border-white"></div>
                  <div className="text-xs text-sky-600 font-semibold">22 August 2023</div>
                  <div className="text-sm font-semibold text-foreground">Trial Commenced</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-8 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                  <div className="text-xs text-red-600 font-semibold">5 September 2023</div>
                  <div className="text-sm font-semibold text-foreground">Verdict & Sentencing</div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-sky-600 dark:text-sky-500 font-bold text-sm uppercase tracking-wider">Step 2</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mt-2 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
                AI-Generated Timeline
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                The system analyses your documents and automatically builds a chronological timeline of key events. 
                This helps visualise the sequence from incident through arrest, trial, and sentencing.
              </p>
            </div>
          </div>

          {/* Step 3: Grounds Identified */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <span className="text-sky-600 dark:text-sky-500 font-bold text-sm uppercase tracking-wider">Step 3</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mt-2 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Potential Grounds Identified
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                The AI analyses your case documents against known appeal grounds. It flags potential issues such as 
                procedural errors, misdirections to the jury, or elements that may not have been properly established.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-5 border border-border shadow-lg space-y-3">
              <div className="text-base font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Potential Grounds (3 Found)
              </div>
              <div className="border border-sky-200 bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3">
                <span className="text-xs font-medium text-sky-700 bg-sky-100 px-2 py-0.5 rounded">STRONG</span>
                <h4 className="font-semibold text-foreground text-sm mt-1">Misdirection on Mens Rea</h4>
                <p className="text-xs text-muted-foreground">Judge's direction on intent may have been inadequate</p>
              </div>
              <div className="border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded">MODERATE</span>
                <h4 className="font-semibold text-foreground text-sm mt-1">Procedural Fairness Issue</h4>
                <p className="text-xs text-muted-foreground">Defence may not have had adequate time to prepare</p>
              </div>
              <div className="border border-slate-200 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                <span className="text-xs font-medium text-slate-600 bg-slate-200 px-2 py-0.5 rounded">POTENTIAL</span>
                <h4 className="font-semibold text-foreground text-sm mt-1">Fresh Evidence Available</h4>
                <p className="text-xs text-muted-foreground">New witness statement may impact findings</p>
              </div>
            </div>
          </div>

          {/* Step 4: Generate Reports */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-sky-600 dark:text-sky-500 font-bold text-sm uppercase tracking-wider">Step 4</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Generate AI-Powered Reports
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Our AI generates barrister-quality legal analysis with similar cases, legislation links, and complete appeal filing guides. Here's exactly what each report looks like:
            </p>
          </div>

          {/* REPORT SAMPLES */}
          <div className="space-y-8">
            
            {/* QUICK SUMMARY REPORT $99 */}
            <div className="bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-slate-900 rounded-xl border border-green-200 dark:border-green-800 overflow-hidden">
              <div className="bg-green-600 text-white px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <span className="font-semibold">QUICK SUMMARY REPORT</span>
                  <span className="text-green-200 text-sm">— Sample Preview</span>
                </div>
                <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-bold">$99 AUD</span>
              </div>
              <div className="p-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  <div className="bg-slate-900 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Quick Summary Report</p>
                        <h4 className="text-lg font-bold">R v Thompson [2024] NSWDC 847</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Generated</p>
                        <p className="text-sm">5 March 2026</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-200 pb-2 mb-2">CASE OVERVIEW</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <p><span className="text-slate-500">Defendant:</span> <strong>Michael Thompson</strong></p>
                        <p><span className="text-slate-500">Offence:</span> <strong>Aggravated Assault</strong></p>
                        <p><span className="text-slate-500">Verdict:</span> <strong className="text-red-600">Guilty</strong></p>
                        <p><span className="text-slate-500">Sentence:</span> <strong>4 years (NPP 2.5 years)</strong></p>
                      </div>
                    </div>
                    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3 border border-sky-200 dark:border-sky-700">
                      <h5 className="font-bold text-sky-800 dark:text-sky-200 text-sm mb-2">GROUNDS IDENTIFIED: 3</h5>
                      <div className="space-y-1 text-xs">
                        <p className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span><strong>Strongest:</strong> Inadequate jury direction</p>
                        <p className="flex items-center gap-2 text-slate-500"><span className="w-2 h-2 bg-sky-500 rounded-full"></span>Ground 2: Unlock full report</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                        <span className="text-white font-bold">72%</span>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-green-700 dark:text-green-400">MODERATE-STRONG PROSPECTS</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FULL DETAILED REPORT $100 */}
            <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900 rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden">
              <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <span className="font-semibold">FULL DETAILED REPORT</span>
                  <span className="text-blue-200 text-sm">— Sample Preview</span>
                </div>
                <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-bold">$100 AUD</span>
              </div>
              <div className="p-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-blue-300 uppercase tracking-wider">Full Detailed Report</p>
                        <h4 className="text-lg font-bold">R v Thompson [2024] NSWDC 847</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-300">72/100</p>
                        <p className="text-xs text-slate-400">Case Strength</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-3 border-b border-slate-200 dark:border-slate-600">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">CONTENTS (10 Sections)</p>
                    <div className="grid grid-cols-5 gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <span>1. Overview</span><span>2. Grounds</span><span>3. Evidence</span><span>4. Cases</span><span>5. Law</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm border-b-2 border-blue-500 pb-2 mb-3">
                        GROUND 1: INADEQUATE JURY DIRECTION — <span className="text-green-600">STRONG</span>
                      </h5>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        The trial judge's direction on self-defence under s.418 Crimes Act 1900 (NSW) was materially inadequate...
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                        <p className="text-xs font-bold text-blue-800 dark:text-blue-200 mb-1">RELEVANT LEGISLATION</p>
                        <p className="text-xs text-slate-600">• s.418 Crimes Act (Self-defence)</p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded p-3">
                        <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200 mb-1">SIMILAR CASES</p>
                        <p className="text-xs text-slate-600">• R v Katarzynski [2002]</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EXTENSIVE LOG REPORT $150 */}
            <div className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-900 rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-900 text-white px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span className="font-semibold">EXTENSIVE LOG REPORT</span>
                  <span className="text-purple-300 text-sm">— Premium Sample</span>
                </div>
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 rounded-full text-sm font-bold">$150 AUD</span>
              </div>
              <div className="p-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-900 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded font-bold">PREMIUM</span>
                          <p className="text-xs text-purple-300 uppercase tracking-wider">Extensive Log Report</p>
                        </div>
                        <h4 className="text-lg font-bold">R v Thompson [2024] NSWDC 847</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-400">72/100</p>
                        <p className="text-xs text-slate-400">Case Strength</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 border-b">
                    <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 mb-2">MASTER CONTENTS (16 Sections)</p>
                    <div className="grid grid-cols-4 gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <span>1. Overview</span><span>2. Grounds</span><span>3. Evidence</span><span>4. Cases</span>
                      <span>5. Sentencing</span><span>6. Law</span><span>7. Strategy</span><span>8. Timeline</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200">
                      <h5 className="font-bold text-amber-800 dark:text-amber-200 text-sm mb-2">COMPARATIVE SENTENCING TABLE</h5>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-slate-100 dark:bg-slate-700">
                            <tr><th className="p-2 text-left">Case</th><th className="p-2">Offence</th><th className="p-2">Sentence</th></tr>
                          </thead>
                          <tbody>
                            <tr className="border-b"><td className="p-2">R v Smith</td><td className="p-2">Assault</td><td className="p-2">3 yrs</td></tr>
                            <tr><td className="p-2">R v Jones</td><td className="p-2">Assault</td><td className="p-2">3.5 yrs</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Barrister View */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-amber-400" />
                <span className="text-amber-400 font-semibold">BARRISTER VIEW</span>
              </div>
              <h4 className="text-lg font-bold mb-2">R v Thompson [2024]</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>• Case Strength: 78%</p>
                <p>• Primary Ground: Misdirection</p>
                <p>• Filing Deadline: 14 days</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
                  <Presentation className="w-6 h-6 text-white" />
                </div>
                <span className="text-sky-600 dark:text-sky-500 font-bold text-sm uppercase tracking-wider">Step 5</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mt-2 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Present in Barrister View
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Use the stunning Barrister View to present your case analysis in conference-ready format. 
                Perfect for legal consultations and court preparation.
              </p>
            </div>
          </div>

        </section>

        {/* FOR LEGAL PROFESSIONALS - Barrister View Section */}
        <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">
          <p className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-2">FOR LEGAL PROFESSIONALS</p>
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Barrister View Built for Conference and Hearing
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            Not just a pretty printout. Barrister View turns your report into a courtroom briefing deck: lead grounds, 
            statutory map, comparative sentencing pathways, relief options, chronology pressure points, and an oral 
            submissions sequence your counsel can use immediately.
          </p>
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold text-lg mb-1">Dual-audience format</h3>
              <p className="text-slate-300 text-sm">Technical legal framing + plain-English notes for family and clients.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold text-lg mb-1">Third Paid Report Tier</h3>
              <p className="text-slate-300 text-sm">Extensive Log now includes expanded case law modelling and hearing script.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold text-lg mb-1">Print-Ready Output</h3>
              <p className="text-slate-300 text-sm">PDF and Word exports formatted for court submission.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 text-center" data-testid="how-it-works-demo-section">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Crimson Pro, serif" }}>
              See It In Action
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Use this page as your quick walkthrough before starting. You can still access the full detailed tutorial from the How To Use page.
          </p>
          <Link to="/how-to-use" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700" data-testid="how-it-works-full-tutorial-link">
            Open full step-by-step tutorial
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 text-center" data-testid="how-it-works-pricing-section">
          <h2 className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: "Crimson Pro, serif" }}>
            Report Prices
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {reportPricing.map((tier) => (
              <div key={tier.title} className={`rounded-xl border p-4 ${tier.tone}`} data-testid={`how-it-works-pricing-${tier.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <p className="text-sm font-semibold text-foreground">{tier.title}</p>
                <p className="text-2xl font-black text-foreground mt-1" style={{ fontFamily: "Crimson Pro, serif" }}>{tier.price}</p>
                <p className="text-xs text-muted-foreground mt-2">{tier.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border-2 border-sky-300 bg-sky-50 dark:bg-sky-900/20 p-6 text-center" data-testid="how-it-works-start-case-section">
          <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "Crimson Pro, serif" }}>
            Ready to begin?
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Start your case now and move through the exact workflow above.
          </p>
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-xl px-10 py-6 text-lg font-semibold shadow-lg shadow-sky-600/20" data-testid="how-it-works-start-case-btn">
              Start Your Case Now
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default HowItWorksPage;