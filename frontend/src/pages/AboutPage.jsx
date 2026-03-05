import { useState } from "react";
import { Scale, ArrowLeft, Heart, Users, Shield, Award, Moon, Sun, Menu, X, Quote, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const AboutPage = () => {
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
            <Link to="/success-stories" className="text-slate-400 hover:text-white text-sm transition-colors">Success Stories</Link>
            <Link to="/glossary" className="text-slate-400 hover:text-white text-sm transition-colors">Legal Terms</Link>
            <Link to="/faq" className="text-slate-400 hover:text-white text-sm transition-colors">FAQ</Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
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
            <Link to="/success-stories" className="block py-2 text-slate-300 hover:text-white">Success Stories</Link>
            <Link to="/glossary" className="block py-2 text-slate-300 hover:text-white">Legal Terms</Link>
            <Link to="/faq" className="block py-2 text-slate-300 hover:text-white">FAQ</Link>
            <Link to="/" className="block py-2 text-amber-500 hover:text-amber-400">Back to Home</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920" 
            alt=""
            className="w-full h-full object-cover opacity-5 dark:opacity-[0.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-amber-600 dark:text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            About Appeal Case Manager
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built from lived experience, driven by the belief that everyone deserves to understand their legal rights.
          </p>
        </div>
      </section>

      {/* Business Info */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-8 text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Criminal Law Appeal Case Management
            </h2>
            <p className="text-amber-400 font-medium">Founded by Debra King</p>
            <p className="text-slate-400 text-sm mt-2">Glenmore Park, NSW, Australia</p>
            
            <div className="mt-6 inline-block bg-amber-900/30 border border-amber-700/50 rounded-xl px-6 py-3">
              <p className="text-amber-300 text-sm font-medium">
                <span className="text-amber-400">AUSTRALIAN LAW ONLY</span> — Covers all States & Territories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deb's Story */}
      <section className="py-12 px-6 bg-muted/50 dark:bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Quote className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Why I Built This
            </h2>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              I'm not a lawyer — I'm someone who knows firsthand how isolating and confusing the justice system can be.
              <strong className="text-foreground"> I served a considerable amount of time in prison.</strong> During that time, 
              I accepted my situation, believing I had no options. What I didn't know then was that I had appellant rights 
              — rights that were never properly explained to me.
            </p>
            
            <p>
              Legal Aid failed to help me. Like so many others, I fell through the cracks of an overburdened system 
              that offers little support once you're sentenced. I served my time not knowing what could have been challenged.
            </p>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
              <p className="text-emerald-800 dark:text-emerald-200 font-medium">
                <CheckCircle className="w-5 h-5 inline mr-2 -mt-0.5" />
                <strong>It's now been eight years since I've been free from trouble.</strong>
              </p>
              <p className="text-emerald-700 dark:text-emerald-300 mt-2 text-sm">
                In that time, I've invested years of hard work, research, and determination into building this application. 
                Every hour spent learning criminal law, every late night developing this tool — it was all driven by one goal: 
                to ensure others don't have to go through what I went through.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Josh and Brad's Story */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
              The People Behind This App
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Josh's Card */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400">J</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Josh</h3>
                  <p className="text-sm text-muted-foreground">Best mate for life</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Josh has served 10 years of a 30-year sentence for murder. He was severely let down by the system — 
                and for years, believed he had no options.
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                  Using this very app, we identified his rights to a fair trial and uncovered extensive errors in his case.
                  <strong className="text-amber-600 dark:text-amber-400"> He now has an appeal on all grounds currently being actioned.</strong>
                </p>
              </div>
            </div>

            {/* Brad's Card */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">B</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Brad Fletcher</h3>
                  <p className="text-sm text-muted-foreground">Best mate for life</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Brad has been on remand for over two years, still waiting for his matter to be finalised.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                  Even at this early stage, we've already identified multiple issues with his case. 
                  Once his matter concludes, this app will be there to help him too.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-2xl p-6 text-center">
            <p className="text-foreground font-medium mb-2">
              Josh and Brad inspired me to build this.
            </p>
            <p className="text-muted-foreground text-sm">
              Watching them — and so many others — struggle through a system that offers little help once you're sentenced, 
              I knew something had to change. Best mates for life, and the reason this app exists.
            </p>
          </div>
        </div>
      </section>

      {/* The Reality */}
      <section className="py-12 px-6 bg-muted/50 dark:bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
              The Reality
            </h2>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            The reality is: from manifest injustice to denial of procedural fairness, from critical elements missed 
            at sentencing, to failures by defence counsel, errors by the judge, or simply unsafe verdicts — there are 
            <em> many</em> potential grounds that can arise in criminal matters.
          </p>
          
          <p className="text-muted-foreground leading-relaxed mb-8">
            Unless you're a legal expert or have thousands of dollars for advice, these issues often go unnoticed.
          </p>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-center">
            <Award className="w-12 h-12 text-white mx-auto mb-4" />
            <p className="text-white text-lg font-semibold mb-2">
              "If this tool helps even one person discover grounds they didn't know existed, my goal is accomplished."
            </p>
            <p className="text-amber-100 text-sm">
              People can change. I'm living proof of that — and I created this app to prove it.
            </p>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="w-12 h-12 text-amber-500/30 mx-auto mb-4" />
          <blockquote className="text-xl text-muted-foreground italic leading-relaxed">
            "I just wanted to create something that could possibly assist others without them having to spend years 
            working this out themselves. I'm sure this will help lawyers at all levels too."
          </blockquote>
          <p className="text-foreground font-semibold mt-4">— Debra King</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Ready to Explore Your Options?
          </h2>
          <p className="text-slate-400 mb-8">
            Whether you're helping yourself, a family member, or a client — this tool is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 rounded-xl px-8 py-5 font-semibold shadow-lg shadow-amber-600/20">
                Get Started Free
              </Button>
            </Link>
            <Link to="/success-stories">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 rounded-xl px-8 py-5">
                Read Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 px-6 py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            © 2025 Appeal Case Manager. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Created by Debra King — Glenmore Park, NSW
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
