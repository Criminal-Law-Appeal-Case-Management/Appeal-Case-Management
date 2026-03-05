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
  },
  // Additional terms for all crime types
  {
    term: "Assault",
    simple: "Intentionally or recklessly causing someone to fear immediate violence",
    detailed: "Under s.61 Crimes Act 1900 (NSW), assault is any act that intentionally or recklessly causes another person to apprehend immediate and unlawful violence. Physical contact is not required - the threat itself is sufficient."
  },
  {
    term: "Grievous Bodily Harm (GBH)",
    simple: "Really serious injury - permanent or life-threatening",
    detailed: "Includes any permanent or serious disfiguring of the person, destruction of a foetus, or any grievous bodily disease. Under s.33 Crimes Act 1900 (NSW), causing GBH with intent carries a maximum 25 years imprisonment."
  },
  {
    term: "Actual Bodily Harm (ABH)",
    simple: "An injury that interferes with health or comfort",
    detailed: "Any hurt or injury that interferes with health or comfort, more than merely transient or trifling. Bruises, scratches, and psychological harm can constitute ABH."
  },
  {
    term: "Sexual Assault",
    simple: "Sexual intercourse without consent",
    detailed: "Under s.61I Crimes Act 1900 (NSW), sexual assault occurs when a person has sexual intercourse with another without their consent, knowing they don't consent. Consent must be freely and voluntarily given."
  },
  {
    term: "Consent",
    simple: "Freely agreeing to something",
    detailed: "A person consents if they freely and voluntarily agree. Consent obtained by force, threat, intimidation, or while intoxicated is not valid consent. The person must have capacity to consent."
  },
  {
    term: "Robbery",
    simple: "Stealing using force or fear",
    detailed: "Theft accompanied by violence or threat of violence. Under s.94 Crimes Act 1900 (NSW), robbery with wounding or armed robbery carry severe penalties up to 25 years imprisonment."
  },
  {
    term: "Larceny (Theft)",
    simple: "Taking someone's property without permission, intending to keep it",
    detailed: "The unlawful taking and carrying away of property belonging to another with intent to permanently deprive them of it. Under s.117 Crimes Act 1900 (NSW), maximum penalty is 5 years imprisonment."
  },
  {
    term: "Break and Enter",
    simple: "Breaking into a building to commit a crime",
    detailed: "Entering a dwelling-house or building with intent to commit a serious indictable offence. Under s.112 Crimes Act 1900 (NSW), aggravated break and enter carries up to 20 years imprisonment."
  },
  {
    term: "Drug Supply",
    simple: "Giving, selling, or distributing drugs",
    detailed: "Under the Drug Misuse and Trafficking Act 1985 (NSW), supply includes selling, giving, distributing, or agreeing to supply. Penalties depend on the type and quantity of drug, ranging from years to life imprisonment for commercial quantities."
  },
  {
    term: "Trafficable Quantity",
    simple: "Enough drugs to suggest you're selling, not just using",
    detailed: "The amount of drugs above which it's presumed you possessed them for supply. Varies by drug type - e.g., 3g for cocaine, 300g for cannabis. Possession of trafficable quantity shifts the burden to prove personal use."
  },
  {
    term: "Fraud",
    simple: "Deceiving someone to get money or property",
    detailed: "Under s.192E Crimes Act 1900 (NSW), fraud involves dishonestly obtaining property or financial advantage by deception. Maximum penalty is 10 years imprisonment."
  },
  {
    term: "Apprehended Violence Order (AVO)",
    simple: "A court order to protect someone from violence or harassment",
    detailed: "An order made by a court prohibiting certain behaviour and contact. Breach of an AVO is a criminal offence under s.14 Crimes (Domestic and Personal Violence) Act 2007 (NSW), carrying up to 2 years imprisonment."
  },
  {
    term: "Domestic Violence",
    simple: "Violence or abuse against a family member or partner",
    detailed: "Includes physical, sexual, emotional, psychological, and economic abuse within a domestic relationship. Domestic violence offences often carry aggravated penalties."
  },
  {
    term: "Coercive Control",
    simple: "A pattern of behaviour used to dominate and control someone",
    detailed: "Behaviour that is abusive and seeks to control a partner through intimidation, isolation, and restrictions. Now a criminal offence in NSW, carrying up to 7 years imprisonment."
  },
  {
    term: "Dangerous Driving",
    simple: "Driving in a way that puts others at risk",
    detailed: "Under s.52A Crimes Act 1900 (NSW), dangerous driving causing death carries up to 10 years imprisonment, or 14 years if aggravated (drunk, speeding, evading police)."
  },
  {
    term: "Double Jeopardy",
    simple: "You can't be tried twice for the same crime",
    detailed: "A fundamental legal principle that protects against being prosecuted multiple times for the same offence. However, there are limited exceptions for fresh and compelling evidence in serious cases."
  },
  {
    term: "Bail",
    simple: "Being released from custody while waiting for your trial",
    detailed: "Under the Bail Act 2013 (NSW), bail allows release from custody with conditions. Courts consider flight risk, danger to community, and offence seriousness. Some offences have 'show cause' requirements."
  },
  {
    term: "Remand",
    simple: "Being held in custody while waiting for trial",
    detailed: "When bail is refused, you're held on remand until your trial. Time on remand is usually counted as time served if convicted."
  },
  {
    term: "Indictment",
    simple: "The formal document setting out the charges against you",
    detailed: "A written accusation charging a person with a serious criminal offence. For serious crimes tried in higher courts, the indictment lists the specific charges and particulars."
  },
  {
    term: "Committal Hearing",
    simple: "A hearing to decide if there's enough evidence for trial",
    detailed: "A preliminary hearing in the Local Court to determine if there's sufficient evidence for a person to stand trial in a higher court. The magistrate decides if a reasonable jury could convict."
  },
  {
    term: "Voir Dire",
    simple: "A 'trial within a trial' to decide if evidence is allowed",
    detailed: "A hearing held in the absence of the jury to determine whether certain evidence should be admitted. Common for confessions, identification evidence, and disputed evidence."
  },
  {
    term: "Exclusionary Rule",
    simple: "Keeping out evidence that was obtained unfairly",
    detailed: "Under s.138 Evidence Act 1995 (NSW), evidence obtained improperly or illegally may be excluded if its admission would be unfair or bring the administration of justice into disrepute."
  },
  {
    term: "Standard Non-Parole Period (SNPP)",
    simple: "The 'starting point' sentence for serious crimes",
    detailed: "A reference point set by parliament for sentencing certain serious offences. Judges must consider the SNPP but can depart from it based on aggravating or mitigating factors."
  },
  {
    term: "Mitigating Factors",
    simple: "Things that might reduce your sentence",
    detailed: "Circumstances that reduce the seriousness of the offence or the offender's culpability. Includes early guilty plea, remorse, good character, mental health issues, and assistance to authorities."
  },
  {
    term: "Aggravating Factors",
    simple: "Things that might increase your sentence",
    detailed: "Circumstances that increase the seriousness of the offence. Includes previous convictions, vulnerability of victim, use of weapons, breach of trust, and offences committed while on bail."
  },
  {
    term: "Intensive Correction Order (ICO)",
    simple: "A sentence served in the community instead of prison",
    detailed: "An alternative to full-time imprisonment where the offender serves their sentence in the community under strict supervision. May include home detention, electronic monitoring, and community service."
  },
  {
    term: "Special Leave",
    simple: "Permission to appeal to the High Court",
    detailed: "To appeal to the High Court of Australia, you must first obtain special leave. The High Court grants leave only for cases involving important questions of law or possible miscarriage of justice."
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
