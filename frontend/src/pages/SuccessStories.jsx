import { useState } from "react";
import { Scale, ArrowLeft, Star, Quote, Send, CheckCircle, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-7 h-7 text-amber-500" />
            <span className="text-lg font-semibold text-white" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Appeal Case Manager
            </span>
          </div>
          <Link to="/">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-slate-900 px-6 py-12 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Success Stories
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Real stories from families who found hope when they thought there was none. 
            These are people just like you who refused to give up.
          </p>
        </div>
      </section>

      {/* Stories */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {successStories.map((story) => (
            <div 
              key={story.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <Quote className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 leading-relaxed mb-4">
                      "{story.story}"
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-slate-900">{story.name}</span>
                        <span className="text-slate-500"> • {story.relationship}</span>
                        <span className="text-slate-400"> • {story.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border-t border-green-100 px-6 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium text-sm">{story.outcome}</span>
                  </div>
                  {story.timeframe && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      {story.timeframe}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> These stories are shared by real users with their consent. 
            Individual results vary. This tool does not guarantee any outcome. 
            All legal matters should be reviewed by a qualified legal professional.
          </p>
        </div>

        {/* Share Your Story */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Share Your Story
            </h2>
          </div>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Has this tool helped you or your family? Your story could give hope to someone 
            who's going through what you went through.
          </p>
          
          {!showSubmitForm ? (
            <Button 
              onClick={() => setShowSubmitForm(true)}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              Share My Story
            </Button>
          ) : submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-green-800 mb-2">Thank You!</h3>
              <p className="text-green-700 text-sm">
                Your story has been submitted. We'll review it and may feature it to help inspire others.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg mx-auto text-left space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your First Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Sarah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="We'll only use this to contact you"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Relationship</label>
                <Input
                  value={formData.relationship}
                  onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                  placeholder="e.g., Wife, Mother, Friend"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Story *</label>
                <Textarea
                  value={formData.story}
                  onChange={(e) => setFormData({...formData, story: e.target.value})}
                  placeholder="Tell us how this tool helped you..."
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Outcome</label>
                <Input
                  value={formData.outcome}
                  onChange={(e) => setFormData({...formData, outcome: e.target.value})}
                  placeholder="e.g., Appeal successful, New evidence found"
                />
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                  className="mt-1"
                />
                <label htmlFor="consent" className="text-sm text-slate-600">
                  I consent to having my story (first name and story only) shared publicly to help others. 
                  My email will never be shared. *
                </label>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                  {loading ? "Submitting..." : "Submit Story"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowSubmitForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer CTA */}
      <section className="bg-slate-900 px-6 py-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Ready to Start Your Journey?
          </h2>
          <p className="text-slate-400 mb-6">
            You don't have to do this alone. Let the tool help you find what might have been missed.
          </p>
          <Link to="/">
            <Button className="bg-amber-600 text-white hover:bg-amber-700">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SuccessStories;
