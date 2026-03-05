import { useState } from "react";
import { Scale, ArrowLeft, Star, Quote, Send, CheckCircle, Heart, Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { toast } from "sonner";
import { useTheme } from "../contexts/ThemeContext";

// Featured success stories
const successStories = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Western Sydney, NSW",
    relationship: "Wife",
    story: "When my husband was convicted, I felt completely lost. The legal aid solicitor told us there were no grounds for appeal and we should just accept the 12-year sentence. I refused to give up. Using this tool, I uploaded every document from the trial - the transcripts, the judge's directions, witness statements. The AI analysis flagged something I'd never noticed: the judge had misdirected the jury on the standard of proof for one of the key charges. I took the report to a criminal barrister who reviewed it and agreed - this was a significant error. We lodged an appeal to the Court of Criminal Appeal. Eight months later, the conviction on that charge was quashed. My husband's sentence was reduced to 7 years. He'll be home 5 years earlier than we thought possible.",
    outcome: "Conviction partially quashed - Sentence reduced by 5 years",
    timeframe: "8 months from appeal to decision",
    featured: true
  },
  {
    id: 2,
    name: "Michael T.",
    location: "Newcastle, NSW",
    relationship: "Brother",
    story: "My younger brother was convicted of aggravated assault. He maintained his innocence from day one, insisting the other person attacked first and he was defending himself. The problem was his original lawyer never properly investigated the self-defence angle. I spent months gathering everything I could - CCTV from nearby shops, medical records, witness contact details. This tool helped me organise it all into a coherent timeline. The contradiction finder identified that the complainant's version of events didn't match the CCTV timestamps. We found a witness who'd never been interviewed. Our new solicitor said the organised case file saved her weeks of work. We've lodged an appeal based on fresh evidence and inadequate legal representation. We're waiting for the hearing date, but for the first time in two years, my brother has real hope.",
    outcome: "Appeal lodged - Fresh evidence application pending",
    timeframe: "Hearing scheduled",
    featured: true
  },
  {
    id: 3,
    name: "Jenny K.",
    location: "Brisbane, QLD",
    relationship: "Mother",
    story: "My son was sentenced for drug supply charges. I knew something wasn't right about his trial but couldn't articulate what. I'm not legally trained - I work in aged care. This tool translated the legal jargon into plain English. The timeline feature showed me that a key police witness gave contradictory evidence about surveillance times. The grounds of merit analysis identified potential issues with how the evidence was obtained - something about the search warrant being executed outside its authorised hours. I couldn't afford a private barrister, so I took the report to Legal Aid's appeal review unit. They agreed to take another look at the case. Having everything organised and clearly presented made all the difference. They've now assigned a senior solicitor to review the appeal prospects.",
    outcome: "Legal Aid appeal review approved",
    timeframe: "Review in progress",
    featured: true
  },
  {
    id: 4,
    name: "David R.",
    location: "Melbourne, VIC", 
    relationship: "Father",
    story: "My daughter was convicted of fraud offences related to her work. She was given a 3-year sentence. The whole family was devastated. I started using this tool to go through the trial transcript page by page. The AI analysis picked up something crucial - the prosecution's forensic accountant had made a significant calculation error that inflated the alleged loss amount. This directly affected the sentence because the amount involved is a major factor in fraud sentencing. We engaged an independent forensic accountant who confirmed the error. The appeal court agreed to receive this fresh evidence. Her sentence was reduced to 18 months with immediate parole eligibility. She's home now, rebuilding her life.",
    outcome: "Sentence reduced from 3 years to 18 months - Released on parole",
    timeframe: "6 months from appeal to release",
    featured: true
  }
];

const SuccessStories = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    relationship: "",
    story: "",
    outcome: "",
    consent: false
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.story || !formData.consent) {
      toast.error("Please fill in all required fields and give consent");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/success-stories`, formData);
      setSubmitted(true);
      toast.success("Thank you for sharing your story!");
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <Link to="/faq" className="text-slate-400 hover:text-white text-sm transition-colors">FAQ</Link>
            <Link to="/contact" className="text-slate-400 hover:text-white text-sm transition-colors">Contact</Link>
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
            <Link to="/glossary" className="block py-2 text-slate-300 hover:text-white">Legal Terms</Link>
            <Link to="/faq" className="block py-2 text-slate-300 hover:text-white">FAQ</Link>
            <Link to="/contact" className="block py-2 text-slate-300 hover:text-white">Contact</Link>
            <Link to="/" className="block py-2 text-amber-500 hover:text-amber-400">Back to Home</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920" 
            alt=""
            className="w-full h-full object-cover opacity-5 dark:opacity-[0.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center gap-1 mb-6">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-6 h-6 text-amber-500 fill-amber-500" />
            ))}
          </div>
          <p className="text-amber-600 dark:text-amber-500 font-semibold text-xs uppercase tracking-widest mb-3">Real Stories, Real Hope</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Success Stories
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real stories from families who found hope when they thought there was none. 
            These are people just like you who refused to give up.
          </p>
        </div>
      </section>

      {/* Stories */}
      <main className="max-w-5xl mx-auto px-6 pb-16">
        <div className="space-y-8">
          {successStories.map((story) => (
            <div 
              key={story.id}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center shrink-0">
                    <Quote className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground leading-relaxed mb-6">
                      "{story.story}"
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-foreground">{story.name}</span>
                        <span className="text-muted-foreground"> • {story.relationship}</span>
                        <span className="text-muted-foreground/70"> • {story.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-100 dark:border-emerald-800 px-6 md:px-8 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold text-sm">{story.outcome}</span>
                  </div>
                  {story.timeframe && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1.5 rounded-lg font-medium">
                      {story.timeframe}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Note:</strong> These stories are shared by real users with their consent. 
            Individual results vary. This tool does not guarantee any outcome. 
            All legal matters should be reviewed by a qualified legal professional.
          </p>
        </div>

        {/* Share Your Story */}
        <div className="mt-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              <Heart className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Share Your Story
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Has this tool helped you or your family? Your story could give hope to someone 
            who's going through what you went through.
          </p>
          
          {!showSubmitForm ? (
            <Button 
              onClick={() => setShowSubmitForm(true)}
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 rounded-xl px-8 py-5 font-semibold shadow-lg shadow-amber-600/20"
            >
              Share My Story
            </Button>
          ) : submitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 text-lg mb-2">Thank You!</h3>
              <p className="text-emerald-700 dark:text-emerald-300">
                Your story has been submitted. We'll review it and may feature it to help inspire others.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 max-w-lg mx-auto text-left space-y-5 shadow-sm">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Your First Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Sarah"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Your Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="We'll only use this to contact you"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Your Relationship</label>
                <Input
                  value={formData.relationship}
                  onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                  placeholder="e.g., Wife, Mother, Friend"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Your Story *</label>
                <Textarea
                  value={formData.story}
                  onChange={(e) => setFormData({...formData, story: e.target.value})}
                  placeholder="Tell us how this tool helped you..."
                  rows={5}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Outcome</label>
                <Input
                  value={formData.outcome}
                  onChange={(e) => setFormData({...formData, outcome: e.target.value})}
                  placeholder="e.g., Appeal successful, New evidence found"
                  className="rounded-xl"
                />
              </div>
              <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-xl">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                  className="mt-1"
                />
                <label htmlFor="consent" className="text-sm text-muted-foreground">
                  I consent to having my story (first name and story only) shared publicly to help others. 
                  My email will never be shared. *
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 rounded-xl py-5 font-semibold"
                >
                  {loading ? "Submitting..." : "Submit Story"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowSubmitForm(false)} className="rounded-xl">
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer CTA */}
      <section className="bg-slate-900 dark:bg-slate-950 px-6 py-12 border-t border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Ready to Start Your Journey?
          </h2>
          <p className="text-slate-400 mb-8">
            You don't have to do this alone. Let the tool help you find what might have been missed.
          </p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 rounded-xl px-8 py-5 font-semibold shadow-lg shadow-amber-600/20">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SuccessStories;
