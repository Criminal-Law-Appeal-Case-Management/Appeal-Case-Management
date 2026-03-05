import { Scale, ArrowLeft, Search, BookOpen } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";

const glossaryTerms = [
  {
    term: "Mens Rea",
    simple: "The 'guilty mind' - what you were thinking",
    detailed: "Latin for 'guilty mind'. This refers to the mental state or intention behind committing a crime. For murder, the prosecution must prove you intended to kill or cause serious harm. Without proving mens rea, there's no crime."
  },
  {
    term: "Actus Reus",
    simple: "The 'guilty act' - what you actually did",
    detailed: "Latin for 'guilty act'. This is the physical act of committing the crime. Both actus reus (the act) and mens rea (the intent) must be proven for most serious crimes."
  },
  {
    term: "Manifest Injustice",
    simple: "When the verdict or sentence is clearly wrong or unfair",
    detailed: "A ground for appeal where the outcome is so obviously unjust that it shocks the conscience. Courts can overturn convictions where there has been a serious miscarriage of justice."
  },
  {
    term: "Procedural Fairness",
    simple: "Your right to a fair process",
    detailed: "Also called 'natural justice'. This means you have the right to know the case against you, the right to be heard, and the right to have your case decided by an impartial judge. Denial of procedural fairness is a strong appeal ground."
  },
  {
    term: "Misdirection",
    simple: "When the judge gives the jury wrong instructions",
    detailed: "If the trial judge incorrectly explains the law to the jury, this can be grounds for appeal. Common misdirections include wrong explanations of intent, self-defence, or burden of proof."
  },
  {
    term: "Fresh Evidence",
    simple: "New evidence that wasn't available at trial",
    detailed: "Evidence that has come to light after the trial that could have affected the verdict. To succeed on appeal, you generally need to show the evidence wasn't available at trial, is credible, and would likely have resulted in a different verdict."
  },
  {
    term: "Burden of Proof",
    simple: "The prosecution must prove you're guilty - you don't have to prove you're innocent",
    detailed: "In criminal cases, the prosecution bears the burden of proving guilt 'beyond reasonable doubt'. The accused doesn't have to prove anything. If the jury has reasonable doubt, they must acquit."
  },
  {
    term: "Beyond Reasonable Doubt",
    simple: "The jury must be sure you did it",
    detailed: "The highest standard of proof in law. The jury must be satisfied so they feel sure of guilt. It's not about mathematical certainty, but there shouldn't be any reasonable doubt left."
  },
  {
    term: "Self-Defence",
    simple: "Using force to protect yourself from harm",
    detailed: "Under s.418-420 Crimes Act 1900 (NSW), you're not criminally responsible if you believed your conduct was necessary to defend yourself and the response was reasonable in the circumstances."
  },
  {
    term: "Provocation",
    simple: "Being pushed to act by extreme circumstances",
    detailed: "A partial defence that can reduce murder to manslaughter. It requires the accused to have lost self-control due to conduct of the deceased that would cause an ordinary person to lose control."
  },
  {
    term: "Diminished Responsibility",
    simple: "Mental condition affected your ability to understand or control your actions",
    detailed: "A partial defence under s.23A Crimes Act 1900 (NSW). If you had an abnormality of mind that substantially impaired your capacity to understand, judge right from wrong, or control yourself, murder can be reduced to manslaughter."
  },
  {
    term: "Unsafe and Unsatisfactory Verdict",
    simple: "The jury got it wrong based on the evidence",
    detailed: "An appeal ground where the conviction is considered unsafe because no reasonable jury, properly instructed, could have convicted on the evidence presented. The appellate court asks whether there was reasonable doubt."
  },
  {
    term: "Ineffective Assistance of Counsel",
    simple: "Your lawyer didn't do their job properly",
    detailed: "If your defence lawyer's performance was so deficient that it affected the outcome of your trial, this can be grounds for appeal. Examples include failing to call important witnesses, not challenging key evidence, or not properly preparing."
  },
  {
    term: "Judicial Bias",
    simple: "The judge wasn't fair or neutral",
    detailed: "If the trial judge showed prejudice against the accused, made inappropriate comments to the jury, or appeared to favour the prosecution, this can be grounds for appeal. Judges must be impartial."
  },
  {
    term: "Hearsay Evidence",
    simple: "Secondhand information - 'someone told me that...'",
    detailed: "Evidence of what someone else said, offered to prove the truth of what was said. Generally inadmissible because the original speaker can't be cross-examined. If hearsay was wrongly admitted, it may be grounds for appeal."
  },
  {
    term: "Circumstantial Evidence",
    simple: "Evidence that suggests something happened, but doesn't directly prove it",
    detailed: "Indirect evidence that requires the jury to draw inferences. For example, fingerprints at a scene. The jury must be satisfied beyond reasonable doubt, and the circumstances must exclude any reasonable hypothesis consistent with innocence."
  },
  {
    term: "Notice of Intention to Appeal",
    simple: "Telling the court you want to appeal",
    detailed: "The formal document you must file within 28 days of conviction or sentence to start the appeal process. Filing this preserves your right to appeal even while you prepare your full grounds."
  },
  {
    term: "Court of Criminal Appeal (CCA)",
    simple: "The court that hears criminal appeals in NSW",
    detailed: "The division of the Supreme Court of NSW that hears appeals against conviction and sentence from the District and Supreme Courts. Usually heard by 3 judges."
  },
  {
    term: "Non-Parole Period (NPP)",
    simple: "The minimum time you must serve before you can apply for parole",
    detailed: "The part of your sentence you must serve in prison before being eligible for release on parole. For example, an 18-year sentence with 12-year NPP means earliest parole eligibility at 12 years."
  },
  {
    term: "Sentencing Remarks",
    simple: "The judge's explanation of why they gave you that sentence",
    detailed: "The reasons the judge provides for the sentence imposed. These are important for appeals as they show what the judge considered and may reveal errors in reasoning."
  }
];

const LegalGlossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTerms, setExpandedTerms] = useState({});

  const filteredTerms = glossaryTerms.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.simple.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (term) => {
    setExpandedTerms(prev => ({
      ...prev,
      [term]: !prev[term]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Legal Terms Explained
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Don't know your mens rea from your actus reus? No worries. Here's what all the legal jargon actually means in plain English.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search for a term..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Glossary List */}
        <div className="space-y-3">
          {filteredTerms.map((item) => (
            <div 
              key={item.term}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
            >
              <button
                onClick={() => toggleExpand(item.term)}
                className="w-full text-left p-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
                    {item.term}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">{item.simple}</p>
                </div>
                <span className="text-amber-600 text-sm shrink-0">
                  {expandedTerms[item.term] ? "Less" : "More"}
                </span>
              </button>
              
              {expandedTerms[item.term] && (
                <div className="px-4 pb-4 pt-0">
                  <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-amber-500">
                    <p className="text-slate-700 text-sm leading-relaxed">{item.detailed}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-500">No terms found matching "{searchTerm}"</p>
          </div>
        )}

        <p className="text-center text-xs text-slate-500 mt-8">
          This glossary is for educational purposes only and does not constitute legal advice.
        </p>
      </main>
    </div>
  );
};

export default LegalGlossary;
