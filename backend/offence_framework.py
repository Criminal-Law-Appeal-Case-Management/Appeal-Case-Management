# Criminal Offence Types and Legal Framework
# This configuration defines all supported offence categories and their applicable legislation

OFFENCE_CATEGORIES = {
    "homicide": {
        "name": "Homicide",
        "description": "Murder, manslaughter, and related offences",
        "offences": ["Murder", "Manslaughter", "Attempted Murder", "Dangerous Driving Causing Death"],
        "nsw_legislation": {
            "Crimes Act 1900 (NSW)": [
                {"section": "s.18", "title": "Murder and manslaughter defined"},
                {"section": "s.19A", "title": "Punishment for murder"},
                {"section": "s.19B", "title": "Punishment for manslaughter"},
                {"section": "s.23", "title": "Self-defence"},
                {"section": "s.23A", "title": "Excessive self-defence (partial defence)"},
                {"section": "s.24", "title": "Provocation (partial defence)"},
                {"section": "s.25", "title": "Child destruction"},
                {"section": "s.27", "title": "Acts done with intent to murder"},
                {"section": "s.52A", "title": "Dangerous driving occasioning death"},
            ]
        },
        "cth_legislation": {
            "Criminal Code Act 1995 (Cth)": [
                {"section": "Div 5", "title": "Fault elements (mens rea)"},
                {"section": "s.5.1", "title": "Intention"},
                {"section": "s.5.2", "title": "Knowledge"},
                {"section": "s.5.3", "title": "Recklessness"},
                {"section": "s.5.4", "title": "Negligence"},
            ]
        },
        "defences": ["Self-defence", "Provocation", "Diminished responsibility", "Duress", "Necessity", "Mental illness"],
        "key_elements": ["Actus reus (the act)", "Mens rea (intent)", "Causation", "No lawful excuse"]
    },
    
    "assault": {
        "name": "Assault & Violence",
        "description": "Assault, grievous bodily harm, and violent offences",
        "offences": ["Common Assault", "Assault Occasioning ABH", "Assault Occasioning GBH", "Wounding", "Affray", "Intimidation"],
        "nsw_legislation": {
            "Crimes Act 1900 (NSW)": [
                {"section": "s.59", "title": "Assault occasioning actual bodily harm"},
                {"section": "s.60", "title": "Assault of police officers"},
                {"section": "s.61", "title": "Common assault"},
                {"section": "s.33", "title": "Wounding or grievous bodily harm with intent"},
                {"section": "s.35", "title": "Reckless grievous bodily harm or wounding"},
                {"section": "s.37", "title": "Choking, suffocation and strangulation"},
                {"section": "s.93C", "title": "Affray"},
            ]
        },
        "cth_legislation": {
            "Criminal Code Act 1995 (Cth)": [
                {"section": "s.147.1", "title": "Causing harm to a Commonwealth public official"},
            ]
        },
        "defences": ["Self-defence", "Defence of another", "Consent", "Lawful correction", "Duress"],
        "key_elements": ["Application of force", "Without consent", "Intent or recklessness", "Degree of harm caused"]
    },
    
    "sexual_offences": {
        "name": "Sexual Offences",
        "description": "Sexual assault and related offences",
        "offences": ["Sexual Assault", "Aggravated Sexual Assault", "Sexual Touching", "Indecent Assault", "Child Sexual Offences"],
        "nsw_legislation": {
            "Crimes Act 1900 (NSW)": [
                {"section": "s.61I", "title": "Sexual assault"},
                {"section": "s.61J", "title": "Aggravated sexual assault"},
                {"section": "s.61JA", "title": "Aggravated sexual assault in company"},
                {"section": "s.61KC", "title": "Sexual touching"},
                {"section": "s.61KD", "title": "Aggravated sexual touching"},
                {"section": "s.66A", "title": "Sexual intercourse with child under 10"},
                {"section": "s.66C", "title": "Sexual intercourse with child 10-16"},
                {"section": "s.91D-91G", "title": "Child abuse material offences"},
            ]
        },
        "cth_legislation": {
            "Criminal Code Act 1995 (Cth)": [
                {"section": "Div 272", "title": "Child sex offences outside Australia"},
                {"section": "Div 273", "title": "Offences involving child abuse material"},
                {"section": "Div 474.22", "title": "Using carriage service for child abuse material"},
            ]
        },
        "defences": ["Consent (where applicable)", "Honest and reasonable mistake of fact", "Mental illness"],
        "key_elements": ["Sexual intercourse/touching", "Without consent", "Knowledge of no consent", "Age of complainant"]
    },
    
    "robbery_theft": {
        "name": "Robbery & Theft",
        "description": "Robbery, theft, and property offences",
        "offences": ["Armed Robbery", "Robbery", "Theft", "Receiving Stolen Property", "Break and Enter", "Burglary"],
        "nsw_legislation": {
            "Crimes Act 1900 (NSW)": [
                {"section": "s.94", "title": "Robbery or stealing from the person"},
                {"section": "s.95", "title": "Robbery with wounding"},
                {"section": "s.96", "title": "Robbery etc armed with dangerous weapon"},
                {"section": "s.97", "title": "Robbery with arms etc and wounding"},
                {"section": "s.98", "title": "Robbery etc in company"},
                {"section": "s.112", "title": "Breaking etc into any house etc and committing serious indictable offence"},
                {"section": "s.117", "title": "Larceny (theft)"},
                {"section": "s.188", "title": "Receiving stolen property"},
            ]
        },
        "cth_legislation": {},
        "defences": ["Claim of right", "Duress", "Necessity", "Mistake of fact"],
        "key_elements": ["Taking property", "Intent to permanently deprive", "Use or threat of force (robbery)", "Breaking and entering (burglary)"]
    },
    
    "drug_offences": {
        "name": "Drug Offences",
        "description": "Drug possession, supply, and trafficking",
        "offences": ["Drug Possession", "Drug Supply", "Drug Trafficking", "Drug Importation", "Drug Manufacturing"],
        "nsw_legislation": {
            "Drug Misuse and Trafficking Act 1985 (NSW)": [
                {"section": "s.10", "title": "Possession of prohibited drugs"},
                {"section": "s.23", "title": "Manufacture and production of prohibited drugs"},
                {"section": "s.24", "title": "Cultivation of prohibited plants"},
                {"section": "s.25", "title": "Supply of prohibited drugs"},
                {"section": "s.29", "title": "Aiding etc supply of prohibited drugs"},
                {"section": "s.33", "title": "Commercial supply of prohibited drugs"},
                {"section": "s.36", "title": "Ongoing supply of prohibited drugs"},
            ]
        },
        "cth_legislation": {
            "Criminal Code Act 1995 (Cth)": [
                {"section": "Div 302", "title": "Trafficking controlled drugs"},
                {"section": "Div 303", "title": "Commercial manufacture of controlled drugs"},
                {"section": "Div 307", "title": "Import and export of controlled drugs"},
                {"section": "s.308", "title": "Possession of controlled drugs"},
            ]
        },
        "defences": ["Lawful authority", "Lack of knowledge", "Duress"],
        "key_elements": ["Possession/supply/manufacture", "Knowledge of drug", "Quantity (trafficable/commercial)", "Intent"]
    },
    
    "fraud_dishonesty": {
        "name": "Fraud & Dishonesty",
        "description": "Fraud, forgery, and dishonesty offences",
        "offences": ["Fraud", "Forgery", "Identity Theft", "Money Laundering", "Obtaining by Deception"],
        "nsw_legislation": {
            "Crimes Act 1900 (NSW)": [
                {"section": "s.192E", "title": "Fraud"},
                {"section": "s.192F", "title": "Intention to defraud by destroying or concealing records"},
                {"section": "s.192G", "title": "Intention to deceive by false or misleading statement"},
                {"section": "s.253-257", "title": "Forgery offences"},
                {"section": "s.192J", "title": "Dishonestly obtaining financial advantage"},
            ]
        },
        "cth_legislation": {
            "Criminal Code Act 1995 (Cth)": [
                {"section": "s.134.1", "title": "Obtaining property by deception"},
                {"section": "s.134.2", "title": "Obtaining financial advantage by deception"},
                {"section": "s.135.1", "title": "General dishonesty"},
                {"section": "s.137.1", "title": "False or misleading information"},
                {"section": "Div 400", "title": "Money laundering"},
            ]
        },
        "defences": ["Claim of right", "Lack of dishonesty", "Mistake of fact", "No intent to deceive"],
        "key_elements": ["Deception/false representation", "Dishonesty", "Obtaining benefit/causing detriment", "Intent"]
    },
    
    "firearms_weapons": {
        "name": "Firearms & Weapons",
        "description": "Firearms and weapons offences",
        "offences": ["Unauthorised Possession of Firearm", "Use of Weapon", "Prohibited Weapon", "Firearms Trafficking"],
        "nsw_legislation": {
            "Firearms Act 1996 (NSW)": [
                {"section": "s.7", "title": "Unauthorised possession or use of firearms"},
                {"section": "s.7A", "title": "Unauthorised possession of pistol or prohibited firearm"},
                {"section": "s.51", "title": "Supply of firearms"},
                {"section": "s.51B", "title": "Unauthorised manufacture of firearms"},
                {"section": "s.93G", "title": "Organised car or boat rebirthing activities"},
            ],
            "Weapons Prohibition Act 1998 (NSW)": [
                {"section": "s.7", "title": "Unauthorised possession or use of prohibited weapon"},
            ]
        },
        "cth_legislation": {
            "Criminal Code Act 1995 (Cth)": [
                {"section": "Div 360", "title": "Cross-border firearms trafficking"},
                {"section": "Div 361", "title": "Firearms offences"},
            ]
        },
        "defences": ["Lawful authority/licence", "Exemption", "Reasonable excuse"],
        "key_elements": ["Possession/use", "Type of weapon", "Licence status", "Intent"]
    },
    
    "domestic_violence": {
        "name": "Domestic Violence",
        "description": "Domestic violence and related offences",
        "offences": ["Domestic Violence Assault", "Stalking", "Intimidation", "Contravention of AVO"],
        "nsw_legislation": {
            "Crimes (Domestic and Personal Violence) Act 2007 (NSW)": [
                {"section": "s.13", "title": "Stalking or intimidation with intent to cause fear"},
                {"section": "s.14", "title": "Contravention of apprehended violence order"},
            ],
            "Crimes Act 1900 (NSW)": [
                {"section": "s.59", "title": "Assault occasioning actual bodily harm (domestic context)"},
                {"section": "s.60E", "title": "Assault on pregnant woman"},
            ]
        },
        "cth_legislation": {},
        "defences": ["Self-defence", "Lack of intent", "Duress"],
        "key_elements": ["Domestic relationship", "Pattern of behaviour", "Intent to cause fear", "Breach of order"]
    },
    
    "public_order": {
        "name": "Public Order Offences",
        "description": "Public order and nuisance offences",
        "offences": ["Riot", "Affray", "Offensive Conduct", "Resist Arrest", "Hindering Police"],
        "nsw_legislation": {
            "Crimes Act 1900 (NSW)": [
                {"section": "s.93B", "title": "Riot"},
                {"section": "s.93C", "title": "Affray"},
                {"section": "s.546C", "title": "Hindering or resisting police"},
            ],
            "Summary Offences Act 1988 (NSW)": [
                {"section": "s.4", "title": "Offensive conduct"},
                {"section": "s.4A", "title": "Offensive language"},
                {"section": "s.6", "title": "Obstructing traffic"},
            ]
        },
        "cth_legislation": {},
        "defences": ["Reasonable excuse", "Lack of intent", "Lawful activity"],
        "key_elements": ["Public place", "Conduct", "Intent or recklessness", "Effect on public"]
    },
    
    "terrorism": {
        "name": "Terrorism Offences",
        "description": "Terrorism and national security offences",
        "offences": ["Terrorist Act", "Membership of Terrorist Organisation", "Financing Terrorism", "Foreign Incursion"],
        "nsw_legislation": {},
        "cth_legislation": {
            "Criminal Code Act 1995 (Cth)": [
                {"section": "Div 101", "title": "Terrorism"},
                {"section": "s.101.1", "title": "Terrorist acts"},
                {"section": "s.101.2", "title": "Providing or receiving training connected with terrorist acts"},
                {"section": "Div 102", "title": "Terrorist organisations"},
                {"section": "Div 103", "title": "Financing terrorism"},
                {"section": "Div 119", "title": "Foreign incursions and recruitment"},
            ]
        },
        "defences": ["Lack of knowledge", "Humanitarian purpose (limited)"],
        "key_elements": ["Terrorist act definition", "Intent to advance cause", "Membership/support", "Funding"]
    },
    
    "driving_offences": {
        "name": "Driving Offences",
        "description": "Serious driving and traffic offences",
        "offences": ["Dangerous Driving", "Drink Driving", "Drug Driving", "Driving While Disqualified", "Police Pursuit"],
        "nsw_legislation": {
            "Crimes Act 1900 (NSW)": [
                {"section": "s.52A", "title": "Dangerous driving occasioning death"},
                {"section": "s.52B", "title": "Dangerous driving occasioning grievous bodily harm"},
            ],
            "Road Transport Act 2013 (NSW)": [
                {"section": "s.110", "title": "Presence of prescribed concentration of alcohol"},
                {"section": "s.111", "title": "Presence of certain drugs"},
                {"section": "s.112", "title": "Refusing breath analysis"},
                {"section": "s.53", "title": "Driving whilst disqualified or suspended"},
            ]
        },
        "cth_legislation": {},
        "defences": ["Honest and reasonable mistake", "Duress", "Necessity", "Emergency"],
        "key_elements": ["Manner of driving", "Blood alcohol/drug content", "Licence status", "Consequences"]
    }
}

# Common appeal grounds applicable across all offences
COMMON_APPEAL_GROUNDS = [
    {
        "ground": "Unsafe and unsatisfactory verdict",
        "description": "The verdict was unreasonable or cannot be supported by the evidence",
        "applicable_to": "all"
    },
    {
        "ground": "Misdirection by trial judge",
        "description": "The judge gave incorrect or inadequate directions to the jury on the law",
        "applicable_to": "all"
    },
    {
        "ground": "Fresh evidence",
        "description": "New evidence has emerged that was not available at trial and could have affected the verdict",
        "applicable_to": "all"
    },
    {
        "ground": "Procedural unfairness",
        "description": "The trial was conducted unfairly or there was a denial of natural justice",
        "applicable_to": "all"
    },
    {
        "ground": "Ineffective assistance of counsel",
        "description": "Defence counsel's conduct was so deficient that it affected the outcome",
        "applicable_to": "all"
    },
    {
        "ground": "Wrongful admission of evidence",
        "description": "Evidence was admitted that should have been excluded",
        "applicable_to": "all"
    },
    {
        "ground": "Wrongful exclusion of evidence",
        "description": "Evidence was excluded that should have been admitted",
        "applicable_to": "all"
    },
    {
        "ground": "Judicial bias or misconduct",
        "description": "The judge showed bias or behaved inappropriately during the trial",
        "applicable_to": "all"
    },
    {
        "ground": "Jury irregularity",
        "description": "There was misconduct or irregularity in the jury's conduct or deliberations",
        "applicable_to": "all"
    },
    {
        "ground": "Sentence manifestly excessive",
        "description": "The sentence imposed was unreasonably harsh given the circumstances",
        "applicable_to": "all"
    },
    {
        "ground": "Error in sentencing discretion",
        "description": "The judge made an error in exercising sentencing discretion",
        "applicable_to": "all"
    },
    {
        "ground": "Prosecution misconduct",
        "description": "The prosecution acted improperly during the trial",
        "applicable_to": "all"
    }
]

# Human rights framework
HUMAN_RIGHTS_FRAMEWORK = {
    "international": [
        {"name": "ICCPR", "full_name": "International Covenant on Civil and Political Rights", "articles": [
            {"article": "Art 14", "title": "Right to fair trial"},
            {"article": "Art 9", "title": "Right to liberty and security"},
            {"article": "Art 7", "title": "Freedom from torture and cruel treatment"},
            {"article": "Art 26", "title": "Equality before the law"}
        ]},
        {"name": "UDHR", "full_name": "Universal Declaration of Human Rights", "articles": [
            {"article": "Art 10", "title": "Right to fair public hearing"},
            {"article": "Art 11", "title": "Presumption of innocence"}
        ]}
    ],
    "australian": [
        {"name": "Australian Human Rights Commission Act 1986 (Cth)"},
        {"name": "Charter of Human Rights and Responsibilities Act 2006 (Vic)"},
        {"name": "Human Rights Act 2004 (ACT)"},
        {"name": "Human Rights Act 2019 (Qld)"}
    ]
}

# Appeal procedural framework
APPEAL_FRAMEWORK = {
    "nsw": {
        "legislation": "Criminal Appeal Act 1912 (NSW)",
        "court": "Court of Criminal Appeal (NSW)",
        "time_limits": {
            "notice_of_intention": "28 days from conviction/sentence",
            "grounds_of_appeal": "As directed by Registrar"
        },
        "forms": [
            {"form": "Form 74C", "purpose": "Notice of Intention to Appeal"},
            {"form": "Form 74D", "purpose": "Notice of Appeal (Conviction)"},
            {"form": "Form 74E", "purpose": "Notice of Appeal (Sentence)"}
        ]
    },
    "federal": {
        "legislation": "Judiciary Act 1903 (Cth)",
        "court": "Full Federal Court / High Court",
        "special_leave": "Required for High Court appeals"
    }
}
