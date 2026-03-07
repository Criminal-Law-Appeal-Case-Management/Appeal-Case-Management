import { Scale, Heart, Quote, CheckCircle, AlertTriangle, Gavel, Shield, Users, Award, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Shared Page Header with Dark Mode */}
      <PageHeader showBackButton={true} backTo="/" />

      {/* Hero Section - Dramatic Opening */}
      <section className="relative py-16 sm:py-20 px-6 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-background">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.15),transparent_50%)]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-4">The Story Behind This App</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Crimson Pro, serif' }}>
            I Built What I Wish<br />I'd Had
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From prison cell to purpose. One woman's fight to give others what the system denied her.
          </p>
        </div>
      </section>

      {/* The Hook - Intriguing Opening */}
      <section className="py-12 sm:py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 text-center border border-slate-800">
            <div className="w-20 h-20 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-600/30">
              <Gavel className="w-10 h-10 text-white" />
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              "No one told me I could appeal."
            </p>
            <p className="text-slate-400 text-lg">
              Those six words changed my life forever.
            </p>
          </div>
        </div>
      </section>

      {/* My Story - Raw and Real */}
      <section className="py-12 px-6 bg-muted/50 dark:bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Quote className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
              My Story
            </h2>
          </div>

          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p className="text-xl text-foreground font-medium">
              I'm Debra King. I'm not a lawyer. I'm someone who lived through the system — and survived it.
            </p>
            
            <p>
              I served time in prison. Real time. Behind real bars. And for years, I accepted my fate because 
              I didn't know any better. <strong className="text-foreground">I had no idea I had rights. No one 
              explained that I could challenge my conviction.</strong> Legal Aid was overwhelmed. My lawyers 
              moved on. I was just another case file, forgotten.
            </p>

            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-xl">
              <p className="text-red-800 dark:text-red-200 font-medium">
                What I discovered later still haunts me:
              </p>
              <p className="text-red-700 dark:text-red-300 mt-2">
                There were grounds. Real, legitimate grounds that could have changed everything. 
                Procedural errors. Evidence issues. Things that were missed. But by the time I 
                learned this, it was too late.
              </p>
            </div>

            <p>
              That realisation lit a fire in me that hasn't gone out since.
            </p>
          </div>
        </div>
      </section>

      {/* The Transformation */}
      <section className="py-12 sm:py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8 sm:p-10 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-emerald-800 dark:text-emerald-200 font-bold text-xl" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  8 Years Free
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm">And counting</p>
              </div>
            </div>
            
            <p className="text-emerald-900 dark:text-emerald-100 text-lg leading-relaxed">
              Since my release, I've dedicated <strong>thousands of hours</strong> to understanding criminal law. 
              Not because I had to — because I <em>needed</em> to. I studied every Act, every precedent, 
              every successful appeal I could find. I became obsessed with one question:
            </p>
            
            <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mt-6 text-center" style={{ fontFamily: 'Crimson Pro, serif' }}>
              "How can I help others avoid what happened to me?"
            </p>
          </div>
        </div>
      </section>

      {/* Why This App */}
      <section className="py-12 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">The Mission</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Crimson Pro, serif' }}>
            This App Is My Answer
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
            Every feature, every report, every piece of guidance — built from lived experience 
            and years of relentless research.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white font-bold mb-2">Find What Was Missed</h3>
              <p className="text-slate-400 text-sm">AI-powered analysis to identify potential grounds others might overlook</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white font-bold mb-2">For Families Too</h3>
              <p className="text-slate-400 text-sm">Written so anyone can understand — not just lawyers</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white font-bold mb-2">Real Guidance</h3>
              <p className="text-slate-400 text-sm">Step-by-step support through every stage of the appeal process</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-12 sm:py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Who This Is For
          </h2>
          
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-6 border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Families fighting for loved ones</h3>
                <p className="text-muted-foreground text-sm">When you know something isn't right but don't know where to start</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Gavel className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Those let down by the system</h3>
                <p className="text-muted-foreground text-sm">When Legal Aid couldn't help or your lawyers moved on</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Legal professionals seeking efficiency</h3>
                <p className="text-muted-foreground text-sm">AI-assisted analysis to support your case preparation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Disclaimer */}
      <section className="py-12 px-6 bg-amber-50 dark:bg-amber-900/20 border-y border-amber-200 dark:border-amber-800">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Important: This Is Not Legal Advice
              </h3>
              <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                I'm not a lawyer and this tool doesn't replace qualified legal counsel. What it does is help you 
                understand your situation, organise your case materials, and identify potential issues that a 
                lawyer can then properly assess. <strong>Always seek professional legal advice before taking action.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-12 sm:py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/30">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            This Is My Life's Work
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Every person who finds a ground they didn't know existed, every family who finally understands 
            their options — that's why I built this. You deserve to know your rights.
          </p>
          <p className="text-foreground font-medium text-lg mb-2">— Debra King</p>
          <p className="text-muted-foreground text-sm">Glenmore Park, NSW, Australia</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 dark:bg-slate-950 px-6 py-12 border-t border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Ready to Find Out What Was Missed?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Start your case analysis today — it's free to begin.
          </p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 rounded-xl px-10 py-6 text-lg font-semibold shadow-lg shadow-amber-600/20">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
