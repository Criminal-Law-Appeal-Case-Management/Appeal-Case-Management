import { useState } from "react";
import { Scale, ArrowLeft, Download, FileText, Search, Filter, ChevronDown, ChevronRight, Building2, Gavel, Shield, Users, Heart, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const STATES = [
  { code: "nsw", name: "New South Wales", color: "bg-blue-600" },
  { code: "vic", name: "Victoria", color: "bg-purple-600" },
  { code: "qld", name: "Queensland", color: "bg-red-600" },
  { code: "sa", name: "South Australia", color: "bg-amber-600" },
  { code: "wa", name: "Western Australia", color: "bg-emerald-600" },
  { code: "tas", name: "Tasmania", color: "bg-teal-600" },
  { code: "nt", name: "Northern Territory", color: "bg-orange-600" },
  { code: "act", name: "Australian Capital Territory", color: "bg-indigo-600" },
];

const FORM_CATEGORIES = [
  {
    id: "appeal",
    name: "Appeal Documents",
    icon: Gavel,
    color: "text-amber-600",
    forms: [
      { id: "notice-of-appeal", name: "Notice of Appeal", description: "Formal document to lodge an appeal against conviction or sentence" },
      { id: "appeal-grounds", name: "Grounds of Appeal", description: "Document setting out the legal grounds for your appeal" },
      { id: "leave-to-appeal", name: "Application for Leave to Appeal", description: "Request permission to appeal to a higher court" },
      { id: "extension-of-time", name: "Extension of Time Application", description: "Request to extend the deadline for lodging an appeal" },
      { id: "appeal-book-index", name: "Appeal Book Index", description: "Index template for organizing appeal documents" },
    ]
  },
  {
    id: "authority",
    name: "Authority to Act",
    icon: Users,
    color: "text-blue-600",
    forms: [
      { id: "authority-lawyer", name: "Authority to Act - Legal Representative", description: "Authorize a lawyer or solicitor to act on your behalf" },
      { id: "authority-police", name: "Authority to Release - Police Records", description: "Request release of police records and evidence" },
      { id: "authority-medical", name: "Authority to Release - Medical Records", description: "Authorize release of medical and health records" },
      { id: "authority-corrective", name: "Authority to Act - Corrective Services", description: "Authorize access to prison/corrections records" },
      { id: "authority-court", name: "Authority to Obtain - Court Documents", description: "Request copies of court transcripts and documents" },
      { id: "authority-general", name: "General Authority to Act", description: "Broad authority for a person to act on another's behalf" },
    ]
  },
  {
    id: "affidavit",
    name: "Affidavits",
    icon: FileText,
    color: "text-emerald-600",
    forms: [
      { id: "affidavit-general", name: "General Affidavit", description: "Standard sworn statement template" },
      { id: "affidavit-support", name: "Affidavit in Support of Appeal", description: "Sworn statement supporting grounds of appeal" },
      { id: "affidavit-fresh-evidence", name: "Affidavit - Fresh Evidence", description: "Introduce new evidence not available at trial" },
      { id: "affidavit-character", name: "Character Reference Affidavit", description: "Sworn character reference for sentencing appeals" },
      { id: "affidavit-service", name: "Affidavit of Service", description: "Confirm documents were properly served" },
      { id: "affidavit-incapacity", name: "Affidavit of Incapacity", description: "Statement regarding legal capacity issues" },
    ]
  },
  {
    id: "bail",
    name: "Bail Applications",
    icon: Lock,
    color: "text-purple-600",
    forms: [
      { id: "bail-application", name: "Bail Application", description: "Application for bail pending appeal" },
      { id: "bail-variation", name: "Bail Variation Application", description: "Request to change bail conditions" },
      { id: "bail-surety", name: "Surety Declaration", description: "Declaration by person offering bail surety" },
    ]
  },
  {
    id: "other",
    name: "Other Legal Forms",
    icon: Shield,
    color: "text-slate-600",
    forms: [
      { id: "power-of-attorney", name: "Power of Attorney", description: "Grant legal authority to another person" },
      { id: "statutory-declaration", name: "Statutory Declaration", description: "Formal declaration made under law" },
      { id: "subpoena-request", name: "Subpoena Request", description: "Request to compel witness attendance or documents" },
      { id: "freedom-of-info", name: "Freedom of Information Request", description: "Request government-held information" },
      { id: "legal-aid-application", name: "Legal Aid Application Checklist", description: "Checklist for Legal Aid applications" },
      { id: "complaint-form", name: "Legal Profession Complaint", description: "Template for complaints about legal representation" },
    ]
  },
];

const FormTemplates = () => {
  const [selectedState, setSelectedState] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(["appeal", "authority"]);

  const handleDownload = (formId, stateName) => {
    // Generate and download the form template
    const form = FORM_CATEGORIES.flatMap(c => c.forms).find(f => f.id === formId);
    if (!form) return;
    
    // Create a simple template document
    const content = generateFormTemplate(form, stateName);
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formId}-${stateName.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateFormTemplate = (form, stateName) => {
    const today = new Date().toLocaleDateString('en-AU');
    
    return `
<!DOCTYPE html>
<html>
<head>
  <title>${form.name} - ${stateName}</title>
  <style>
    body { font-family: 'Times New Roman', serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
    h2 { margin-top: 30px; }
    .header { text-align: center; margin-bottom: 30px; }
    .field { border-bottom: 1px solid #000; min-width: 200px; display: inline-block; margin: 5px 0; }
    .field-long { width: 100%; }
    .section { margin: 20px 0; padding: 15px; border: 1px solid #ccc; }
    .signature-block { margin-top: 50px; }
    .signature-line { border-top: 1px solid #000; width: 300px; margin-top: 50px; }
    .instructions { background: #f5f5f5; padding: 15px; margin: 20px 0; font-size: 12px; }
    .court-header { text-align: center; font-weight: bold; margin-bottom: 20px; }
    @media print { .instructions { display: none; } }
  </style>
</head>
<body>
  <div class="instructions">
    <strong>INSTRUCTIONS:</strong> This is a template only. Please consult with a legal professional before submitting any legal documents. 
    Fill in all fields marked with underlines. Remove this instruction box before printing.
    <br><br>
    <strong>Form:</strong> ${form.name}<br>
    <strong>State:</strong> ${stateName}<br>
    <strong>Generated:</strong> ${today}
  </div>

  <div class="court-header">
    IN THE ${getCourtName(stateName)}
  </div>

  <h1>${form.name.toUpperCase()}</h1>
  
  <div class="header">
    <p><strong>State/Territory:</strong> ${stateName}</p>
  </div>

  ${getFormContent(form.id, stateName)}

  <div class="signature-block">
    <p><strong>Signed:</strong></p>
    <div class="signature-line"></div>
    <p>Name: <span class="field">________________________</span></p>
    <p>Date: <span class="field">____/____/________</span></p>
  </div>

  <div class="instructions" style="margin-top: 40px;">
    <strong>IMPORTANT NOTES:</strong>
    <ul>
      <li>This template is provided for informational purposes only</li>
      <li>Legal requirements vary by jurisdiction - verify current requirements</li>
      <li>Consider seeking legal advice before lodging any documents</li>
      <li>Keep copies of all documents for your records</li>
    </ul>
  </div>
</body>
</html>`;
  };

  const getCourtName = (stateName) => {
    const courts = {
      "New South Wales": "SUPREME COURT OF NEW SOUTH WALES\nCOURT OF CRIMINAL APPEAL",
      "Victoria": "SUPREME COURT OF VICTORIA\nCOURT OF APPEAL",
      "Queensland": "COURT OF APPEAL OF QUEENSLAND",
      "South Australia": "SUPREME COURT OF SOUTH AUSTRALIA",
      "Western Australia": "SUPREME COURT OF WESTERN AUSTRALIA\nCOURT OF APPEAL",
      "Tasmania": "SUPREME COURT OF TASMANIA",
      "Northern Territory": "SUPREME COURT OF THE NORTHERN TERRITORY",
      "Australian Capital Territory": "SUPREME COURT OF THE AUSTRALIAN CAPITAL TERRITORY",
    };
    return courts[stateName] || "SUPREME COURT";
  };

  const getFormContent = (formId, stateName) => {
    const templates = {
      "notice-of-appeal": `
        <div class="section">
          <h2>BETWEEN:</h2>
          <p><strong>Appellant:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Respondent:</strong> The Crown / Director of Public Prosecutions</p>
        </div>
        
        <div class="section">
          <h2>DETAILS OF CONVICTION</h2>
          <p><strong>Court of Trial:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Date of Conviction:</strong> <span class="field">____/____/________</span></p>
          <p><strong>Date of Sentence:</strong> <span class="field">____/____/________</span></p>
          <p><strong>Offence(s):</strong></p>
          <p><span class="field field-long">________________________________</span></p>
          <p><strong>Sentence Imposed:</strong></p>
          <p><span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>NATURE OF APPEAL</h2>
          <p>The Appellant appeals against: (tick applicable)</p>
          <p>☐ Conviction only</p>
          <p>☐ Sentence only</p>
          <p>☐ Both conviction and sentence</p>
        </div>
        
        <div class="section">
          <h2>GROUNDS OF APPEAL</h2>
          <p>1. <span class="field field-long">________________________________</span></p>
          <p>2. <span class="field field-long">________________________________</span></p>
          <p>3. <span class="field field-long">________________________________</span></p>
          <p>(Attach additional pages if required)</p>
        </div>
      `,
      "authority-lawyer": `
        <div class="section">
          <h2>PERSON GRANTING AUTHORITY</h2>
          <p><strong>Full Name:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Date of Birth:</strong> <span class="field">____/____/________</span></p>
          <p><strong>Address:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Current Location (if in custody):</strong> <span class="field field-long">________________</span></p>
          <p><strong>MIN/CRN (if applicable):</strong> <span class="field">________________</span></p>
        </div>
        
        <div class="section">
          <h2>AUTHORISED REPRESENTATIVE</h2>
          <p><strong>Name:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Firm/Organisation:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Address:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Phone:</strong> <span class="field">________________</span></p>
          <p><strong>Email:</strong> <span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>SCOPE OF AUTHORITY</h2>
          <p>I hereby authorise the above-named person to:</p>
          <p>☐ Act as my legal representative in all matters relating to my criminal appeal</p>
          <p>☐ Obtain documents and records on my behalf</p>
          <p>☐ Communicate with courts, prosecutors, and other parties</p>
          <p>☐ Make applications and file documents on my behalf</p>
          <p>☐ Other: <span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>DURATION</h2>
          <p>This authority is valid from: <span class="field">____/____/________</span></p>
          <p>Until: ☐ Revoked in writing ☐ Completion of appeal ☐ Date: <span class="field">____/____/____</span></p>
        </div>
      `,
      "authority-police": `
        <div class="section">
          <h2>TO: ${stateName} Police Force</h2>
          <p>Police Records Section</p>
        </div>
        
        <div class="section">
          <h2>PERSON AUTHORISING RELEASE</h2>
          <p><strong>Full Name:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Date of Birth:</strong> <span class="field">____/____/________</span></p>
          <p><strong>Address:</strong> <span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>MATTER DETAILS</h2>
          <p><strong>Police Reference/Event Number:</strong> <span class="field">________________</span></p>
          <p><strong>Court Case Number:</strong> <span class="field">________________</span></p>
          <p><strong>Date of Incident:</strong> <span class="field">____/____/________</span></p>
        </div>
        
        <div class="section">
          <h2>RECORDS REQUESTED</h2>
          <p>☐ Police facts sheet / Brief of evidence</p>
          <p>☐ Witness statements</p>
          <p>☐ CCTV/Video evidence</p>
          <p>☐ Photographs</p>
          <p>☐ Forensic reports</p>
          <p>☐ Interview recordings</p>
          <p>☐ Custody records</p>
          <p>☐ Criminal history</p>
          <p>☐ Other: <span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>RELEASE TO</h2>
          <p><strong>Name:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Address:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Relationship:</strong> <span class="field">________________</span></p>
        </div>
      `,
      "authority-medical": `
        <div class="section">
          <h2>TO: Medical Records Department</h2>
          <p>Hospital/Medical Practice: <span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>PATIENT DETAILS</h2>
          <p><strong>Full Name:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Date of Birth:</strong> <span class="field">____/____/________</span></p>
          <p><strong>Address:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Medicare Number:</strong> <span class="field">________________</span></p>
        </div>
        
        <div class="section">
          <h2>RECORDS REQUESTED</h2>
          <p><strong>Date Range:</strong> From <span class="field">____/____/____</span> To <span class="field">____/____/____</span></p>
          <p>☐ All medical records for the above period</p>
          <p>☐ Hospital admission/discharge summaries</p>
          <p>☐ Specialist reports</p>
          <p>☐ Pathology results</p>
          <p>☐ Imaging reports (X-ray, CT, MRI)</p>
          <p>☐ Mental health records</p>
          <p>☐ Medication history</p>
          <p>☐ Other: <span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>PURPOSE</h2>
          <p>These records are required for: <span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>SEND RECORDS TO</h2>
          <p><strong>Name:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Address:</strong> <span class="field field-long">________________________________</span></p>
        </div>
      `,
      "authority-corrective": `
        <div class="section">
          <h2>TO: ${stateName} Corrective Services</h2>
        </div>
        
        <div class="section">
          <h2>INMATE DETAILS</h2>
          <p><strong>Full Name:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Date of Birth:</strong> <span class="field">____/____/________</span></p>
          <p><strong>MIN (Master Index Number):</strong> <span class="field">________________</span></p>
          <p><strong>Current Facility:</strong> <span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>AUTHORITY GRANTED TO</h2>
          <p><strong>Name:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Relationship:</strong> <span class="field">________________</span></p>
          <p><strong>Contact:</strong> <span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>AUTHORISATION</h2>
          <p>I authorise the above person to:</p>
          <p>☐ Receive information about my custody status</p>
          <p>☐ Access my correctional records</p>
          <p>☐ Act on my behalf in legal matters</p>
          <p>☐ Arrange legal visits</p>
          <p>☐ Communicate with case managers</p>
          <p>☐ Other: <span class="field field-long">________________________________</span></p>
        </div>
      `,
      "affidavit-general": `
        <div class="section">
          <h2>AFFIDAVIT</h2>
          <p>I, <span class="field field-long">________________________________</span> (full name)</p>
          <p>of <span class="field field-long">________________________________</span> (address)</p>
          <p>Occupation: <span class="field">________________________________</span></p>
          <p>make oath and say as follows:</p>
        </div>
        
        <div class="section">
          <p>1. <span class="field field-long">________________________________</span></p>
          <p><span class="field field-long">________________________________</span></p>
          <p><span class="field field-long">________________________________</span></p>
          <br>
          <p>2. <span class="field field-long">________________________________</span></p>
          <p><span class="field field-long">________________________________</span></p>
          <p><span class="field field-long">________________________________</span></p>
          <br>
          <p>3. <span class="field field-long">________________________________</span></p>
          <p><span class="field field-long">________________________________</span></p>
          <p><span class="field field-long">________________________________</span></p>
          <br>
          <p>(Continue on additional pages as required)</p>
        </div>
        
        <div class="section">
          <p>SWORN at <span class="field">________________</span></p>
          <p>in the State of ${stateName}</p>
          <p>this <span class="field">____</span> day of <span class="field">____________</span> 20<span class="field">____</span></p>
          <br>
          <p>Before me:</p>
          <br><br>
          <p>___________________________________</p>
          <p>Justice of the Peace / Solicitor / Other Authorised Person</p>
        </div>
      `,
      "extension-of-time": `
        <div class="section">
          <h2>APPLICATION FOR EXTENSION OF TIME</h2>
          <p><strong>Applicant:</strong> <span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>DETAILS OF CONVICTION</h2>
          <p><strong>Date of Conviction:</strong> <span class="field">____/____/________</span></p>
          <p><strong>Date of Sentence:</strong> <span class="field">____/____/________</span></p>
          <p><strong>Time limit expired on:</strong> <span class="field">____/____/________</span></p>
          <p><strong>Days/months out of time:</strong> <span class="field">________________</span></p>
        </div>
        
        <div class="section">
          <h2>REASONS FOR DELAY</h2>
          <p>The Applicant seeks an extension of time for the following reasons:</p>
          <p><span class="field field-long">________________________________</span></p>
          <p><span class="field field-long">________________________________</span></p>
          <p><span class="field field-long">________________________________</span></p>
          <p><span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>PROPOSED GROUNDS OF APPEAL</h2>
          <p>If granted, the Applicant intends to appeal on the following grounds:</p>
          <p>1. <span class="field field-long">________________________________</span></p>
          <p>2. <span class="field field-long">________________________________</span></p>
          <p>3. <span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>ORDER SOUGHT</h2>
          <p>The Applicant seeks an order that time for lodging a Notice of Appeal be extended to <span class="field">____/____/________</span></p>
        </div>
      `,
      "bail-application": `
        <div class="section">
          <h2>APPLICATION FOR BAIL PENDING APPEAL</h2>
        </div>
        
        <div class="section">
          <h2>APPLICANT DETAILS</h2>
          <p><strong>Full Name:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Date of Birth:</strong> <span class="field">____/____/________</span></p>
          <p><strong>Current Location:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>MIN:</strong> <span class="field">________________</span></p>
        </div>
        
        <div class="section">
          <h2>CONVICTION DETAILS</h2>
          <p><strong>Offence(s):</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Sentence:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Appeal lodged on:</strong> <span class="field">____/____/________</span></p>
        </div>
        
        <div class="section">
          <h2>GROUNDS FOR BAIL</h2>
          <p>The Applicant seeks bail on the following grounds:</p>
          <p>☐ Strong prospects of success on appeal</p>
          <p>☐ Will have served significant portion of sentence before appeal heard</p>
          <p>☐ No risk of flight</p>
          <p>☐ No risk to community safety</p>
          <p>☐ Other: <span class="field field-long">________________________________</span></p>
        </div>
        
        <div class="section">
          <h2>PROPOSED CONDITIONS</h2>
          <p><strong>Proposed Address:</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Surety (if any):</strong> <span class="field field-long">________________________________</span></p>
          <p><strong>Amount:</strong> $<span class="field">________________</span></p>
          <p>The Applicant agrees to comply with any conditions the Court sees fit to impose.</p>
        </div>
      `,
    };
    
    // Return specific template or default
    return templates[formId] || `
      <div class="section">
        <h2>DETAILS</h2>
        <p><strong>Full Name:</strong> <span class="field field-long">________________________________</span></p>
        <p><strong>Date of Birth:</strong> <span class="field">____/____/________</span></p>
        <p><strong>Address:</strong> <span class="field field-long">________________________________</span></p>
        <p><strong>Contact Number:</strong> <span class="field">________________</span></p>
        <p><strong>Email:</strong> <span class="field field-long">________________________________</span></p>
      </div>
      
      <div class="section">
        <h2>MATTER DETAILS</h2>
        <p><span class="field field-long">________________________________</span></p>
        <p><span class="field field-long">________________________________</span></p>
        <p><span class="field field-long">________________________________</span></p>
      </div>
    `;
  };

  const filteredCategories = FORM_CATEGORIES.map(category => ({
    ...category,
    forms: category.forms.filter(form =>
      searchQuery === "" ||
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.forms.length > 0);

  const displayStates = selectedState === "all" ? STATES : STATES.filter(s => s.code === selectedState);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-slate-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
          <FileText className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Legal Form Templates
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Download legal form templates for criminal appeals. Select your state for jurisdiction-specific forms.
          </p>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {STATES.map(state => (
                  <SelectItem key={state.code} value={state.code}>{state.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Disclaimer */}
        <Card className="mb-8 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Gavel className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Important:</strong> These templates are provided for general guidance only. 
                Legal requirements vary by jurisdiction and may change. Always verify current requirements 
                with the relevant court and consider seeking legal advice before lodging any documents.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* State Selection Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedState("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedState === "all" 
                ? "bg-amber-600 text-white" 
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All States
          </button>
          {STATES.map(state => (
            <button
              key={state.code}
              onClick={() => setSelectedState(state.code)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedState === state.code
                  ? `${state.color} text-white`
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {state.code.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Form Categories */}
        {filteredCategories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">No forms found matching your search.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredCategories.map(category => (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedCategories(prev => 
                    prev.includes(category.id) 
                      ? prev.filter(c => c !== category.id)
                      : [...prev, category.id]
                  )}
                >
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <category.icon className={`w-5 h-5 ${category.color}`} />
                      <span>{category.name}</span>
                      <Badge variant="outline" className="ml-2">{category.forms.length} forms</Badge>
                    </div>
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </CardTitle>
                </CardHeader>
                
                {expandedCategories.includes(category.id) && (
                  <CardContent className="pt-0">
                    <div className="divide-y divide-slate-100">
                      {category.forms.map(form => (
                        <div key={form.id} className="py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{form.name}</h4>
                              <p className="text-sm text-slate-500 mt-1">{form.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {displayStates.map(state => (
                                <Button
                                  key={state.code}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownload(form.id, state.name)}
                                  className="text-xs"
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  {state.code.toUpperCase()}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-10 bg-gradient-to-r from-slate-900 to-slate-800 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Need Help With Your Forms?
            </h3>
            <p className="text-slate-400 mb-4">
              Our FAQ section has guides on filling out these forms, and our Lawyer Directory 
              can help you find legal assistance in your state.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/faq">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  View FAQ
                </Button>
              </Link>
              <Link to="/lawyers">
                <Button className="bg-amber-600 text-white hover:bg-amber-700">
                  Find a Lawyer
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FormTemplates;
