import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { 
  Scale, ArrowLeft, Download, Printer, Loader2,
  BookOpen, Gavel, FileText, CheckCircle, AlertTriangle, XCircle
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { API } from "../App";

const GROUND_TYPE_LABELS = {
  procedural_error: "Procedural Error",
  fresh_evidence: "Fresh Evidence",
  miscarriage_of_justice: "Miscarriage of Justice",
  sentencing_error: "Sentencing Error",
  judicial_error: "Judicial Error",
  ineffective_counsel: "Ineffective Counsel",
  prosecution_misconduct: "Prosecution Misconduct",
  jury_irregularity: "Jury Irregularity",
  constitutional_violation: "Constitutional Violation",
  other: "Other Ground"
};

const STRENGTH_CONFIG = {
  strong: { icon: CheckCircle, color: "text-emerald-700", label: "Strong" },
  moderate: { icon: AlertTriangle, color: "text-amber-700", label: "Moderate" },
  weak: { icon: XCircle, color: "text-red-700", label: "Weak" }
};

const BarristerView = ({ user }) => {
  const { caseId, reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [caseData, setCaseData] = useState(null);
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [caseId, reportId]);

  const fetchData = async () => {
    try {
      const [reportRes, caseRes, groundsRes] = await Promise.all([
        axios.get(`${API}/cases/${caseId}/reports/${reportId}`),
        axios.get(`${API}/cases/${caseId}`),
        axios.get(`${API}/cases/${caseId}/grounds`)
      ]);
      setReport(reportRes.data);
      setCaseData(caseRes.data);
      setGrounds(groundsRes.data || []);
    } catch (error) {
      toast.error("Failed to load report");
      navigate(`/cases/${caseId}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    try {
      toast.info("Generating PDF...");
      const response = await axios.get(
        `${API}/cases/${caseId}/reports/${reportId}/export-pdf`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${caseData?.title || 'Report'}_barrister_brief.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF. Using print fallback.");
      window.print();
    }
  };

  const handleExportDOCX = async () => {
    try {
      toast.info("Generating Word document...");
      const response = await axios.get(
        `${API}/cases/${caseId}/reports/${reportId}/export-docx`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${caseData?.title || 'Report'}_barrister_brief.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Word document downloaded successfully!");
    } catch (error) {
      console.error("DOCX export error:", error);
      toast.error("Failed to export Word document.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // Parse and structure the analysis for legal brief format
  const parseAnalysis = (content) => {
    if (!content?.analysis) return { sections: [] };
    
    const analysis = content.analysis;
    const sections = [];
    
    const lines = analysis.split('\n');
    let currentSection = null;
    let currentContent = [];
    
    const sectionPatterns = [
      { pattern: /^(?:\d+\.|I\.|II\.|III\.|IV\.|V\.|VI\.)\s*(CASE OVERVIEW|OVERVIEW)/i, title: "CASE OVERVIEW" },
      { pattern: /^(?:\d+\.|I\.|II\.|III\.|IV\.|V\.|VI\.)\s*(EVIDENCE|DOCUMENT)/i, title: "EVIDENCE ANALYSIS" },
      { pattern: /^(?:\d+\.|I\.|II\.|III\.|IV\.|V\.|VI\.)\s*(GROUNDS|MERIT)/i, title: "GROUNDS OF MERIT" },
      { pattern: /^(?:\d+\.|I\.|II\.|III\.|IV\.|V\.|VI\.)\s*(LEGAL|LAW|FRAMEWORK)/i, title: "LEGAL FRAMEWORK" },
      { pattern: /^(?:\d+\.|I\.|II\.|III\.|IV\.|V\.|VI\.)\s*(STRATEGIC|RECOMMEND|STRATEGY)/i, title: "RECOMMENDATIONS" },
      { pattern: /^(?:\d+\.|I\.|II\.|III\.|IV\.|V\.|VI\.)\s*(CONCLUSION)/i, title: "CONCLUSION" },
      { pattern: /^\*\*([A-Z][A-Z\s]+)\*\*/i, title: null } // Capture markdown headers
    ];
    
    for (const line of lines) {
      let foundSection = false;
      
      for (const { pattern, title } of sectionPatterns) {
        if (pattern.test(line)) {
          if (currentSection) {
            sections.push({
              number: String(sections.length + 1),
              title: currentSection,
              content: currentContent.join('\n').trim()
            });
          }
          
          if (title) {
            currentSection = title;
          } else {
            // Extract title from markdown header
            const match = line.match(/\*\*([A-Z][A-Z\s]+)\*\*/i);
            currentSection = match ? match[1].trim() : "ANALYSIS";
          }
          currentContent = [];
          foundSection = true;
          break;
        }
      }
      
      if (!foundSection && currentSection) {
        currentContent.push(line);
      } else if (!foundSection && !currentSection && line.trim()) {
        // Content before first section
        if (!currentSection) {
          currentSection = "PRELIMINARY ANALYSIS";
          currentContent = [line];
        }
      }
    }
    
    // Add last section
    if (currentSection && currentContent.length > 0) {
      sections.push({
        number: String(sections.length + 1),
        title: currentSection,
        content: currentContent.join('\n').trim()
      });
    }
    
    // If no sections found, create one with all content
    if (sections.length === 0) {
      sections.push({
        number: "1",
        title: "ANALYSIS",
        content: analysis
      });
    }
    
    return { sections };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-slate-400 mx-auto" />
          <p className="mt-4 text-slate-600">Loading report...</p>
        </div>
      </div>
    );
  }

  const parsedContent = parseAnalysis(report?.content);

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      {/* Header - hidden when printing */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 no-print">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(`/cases/${caseId}/reports/${reportId}`)}
                className="text-white hover:bg-slate-800"
                data-testid="back-btn"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Standard View
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="border-white text-white hover:bg-slate-800"
                data-testid="print-btn"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportDOCX}
                className="border-blue-300 text-blue-100 hover:bg-slate-800"
                data-testid="export-docx-btn"
              >
                <FileText className="w-4 h-4 mr-2" />
                Word
              </Button>
              <Button
                size="sm"
                onClick={handleExportPDF}
                className="bg-white text-slate-900 hover:bg-slate-100"
                data-testid="export-btn"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8 print:py-0">
        {/* A4 Paper Format */}
        <div 
          className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none border border-slate-200 print:border-none"
          style={{ minHeight: '297mm', padding: '25mm 20mm' }}
          data-testid="barrister-report"
        >
          {/* Title Page Header */}
          <div className="text-center border-b-2 border-slate-900 pb-8 mb-8">
            <p className="text-sm uppercase tracking-widest text-slate-500 mb-2">
              Criminal Appeal Case Analysis
            </p>
            <h1 
              className="text-3xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              {caseData?.title}
            </h1>
            <div className="text-slate-700 space-y-1">
              <p><strong>Defendant:</strong> {caseData?.defendant_name}</p>
              {caseData?.case_number && (
                <p><strong>Case No:</strong> <span className="font-mono">{caseData.case_number}</span></p>
              )}
              {caseData?.court && (
                <p><strong>Court:</strong> {caseData.court}</p>
              )}
            </div>
          </div>

          {/* Report Metadata */}
          <div className="mb-8 text-sm text-slate-600 border-l-4 border-amber-500 pl-4">
            <p><strong>Report Type:</strong> {
              report?.report_type === 'quick_summary' ? 'Quick Summary' :
              report?.report_type === 'full_detailed' ? 'Full Detailed Analysis' :
              'Extensive Log Report'
            }</p>
            <p><strong>Generated:</strong> {formatDate(report?.generated_at)}</p>
            <p><strong>Documents Reviewed:</strong> {report?.content?.document_count || 0}</p>
            <p><strong>Timeline Events:</strong> {report?.content?.event_count || 0}</p>
          </div>

          {/* GROUNDS OF MERIT SECTION - Prominent Display */}
          {grounds.length > 0 && (
            <div className="mb-10 page-break-inside-avoid">
              <h2 
                className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 border-b-2 border-amber-500 pb-3"
                style={{ fontFamily: 'Crimson Pro, serif' }}
              >
                <Gavel className="w-6 h-6 text-amber-600" />
                GROUNDS OF MERIT
              </h2>
              
              <div className="space-y-6">
                {grounds.map((ground, idx) => {
                  const strengthConfig = STRENGTH_CONFIG[ground.strength] || STRENGTH_CONFIG.moderate;
                  const StrengthIcon = strengthConfig.icon;
                  
                  return (
                    <div key={ground.ground_id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      {/* Ground Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-amber-600 font-bold text-lg">{idx + 1}.</span>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              {GROUND_TYPE_LABELS[ground.ground_type] || ground.ground_type}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <StrengthIcon className={`w-4 h-4 ${strengthConfig.color}`} />
                              <span className={`text-sm font-medium ${strengthConfig.color}`}>
                                {strengthConfig.label}
                              </span>
                            </div>
                          </div>
                          <h3 
                            className="text-lg font-bold text-slate-900"
                            style={{ fontFamily: 'Crimson Pro, serif' }}
                          >
                            {ground.title}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-slate-700 mb-4" style={{ fontFamily: 'Crimson Pro, serif', lineHeight: '1.7' }}>
                        {ground.description}
                      </p>
                      
                      {/* Legal References */}
                      {ground.law_sections && ground.law_sections.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4" />
                            Relevant Law Sections
                          </h4>
                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <ul className="space-y-1">
                              {ground.law_sections.map((section, sidx) => (
                                <li key={sidx} className="text-sm text-blue-900 font-mono">
                                  • s.{section.section} {section.act} ({section.jurisdiction || 'NSW'})
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      {/* Similar Cases */}
                      {ground.similar_cases && ground.similar_cases.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-2">
                            <Scale className="w-4 h-4" />
                            Similar Cases
                          </h4>
                          <div className="bg-amber-50 border border-amber-200 rounded p-3">
                            <ul className="space-y-1">
                              {ground.similar_cases.map((caseRef, cidx) => (
                                <li key={cidx} className="text-sm text-amber-900">
                                  • <strong>{caseRef.case_name}</strong> {caseRef.citation && `(${caseRef.citation})`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      {/* Supporting Evidence */}
                      {ground.supporting_evidence && ground.supporting_evidence.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4" />
                            Supporting Evidence
                          </h4>
                          <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                            <ul className="space-y-1">
                              {ground.supporting_evidence.map((evidence, eidx) => (
                                <li key={eidx} className="text-sm text-emerald-900">
                                  • {evidence}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Analysis Sections */}
          <div className="space-y-8">
            {parsedContent.sections.map((section, idx) => (
              <div key={idx} className="page-break-inside-avoid">
                <h2 
                  className="text-xl font-bold text-slate-900 mb-4 flex items-baseline gap-3"
                  style={{ fontFamily: 'Crimson Pro, serif' }}
                >
                  <span className="text-amber-600">{section.number}.</span>
                  {section.title}
                </h2>
                <div 
                  className="text-slate-700 leading-relaxed whitespace-pre-wrap pl-6"
                  style={{ fontFamily: 'Crimson Pro, serif', fontSize: '11pt', lineHeight: '1.8' }}
                >
                  {section.content.replace(/\*\*/g, '')}
                </div>
              </div>
            ))}
          </div>

          {/* Legal Reference Notes */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <h3 
              className="text-lg font-semibold text-slate-900 mb-4"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              Legal Reference Framework
            </h3>
            <div className="text-sm text-slate-600 space-y-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
              <p>This analysis references relevant provisions from:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Crimes Act 1900 (NSW)</strong> - Primary criminal law for New South Wales</li>
                <li><strong>Criminal Appeal Act 1912 (NSW)</strong> - Governs criminal appeals in NSW</li>
                <li><strong>Criminal Code Act 1995 (Cth)</strong> - Federal criminal law</li>
                <li><strong>Evidence Act 1995 (NSW & Cth)</strong> - Rules on evidence admissibility</li>
                <li><strong>Sentencing Act 1995 (NSW)</strong> - Sentencing guidelines and procedures</li>
              </ul>
              <p className="mt-4 italic">
                This document is prepared as an analytical aid and should be reviewed by qualified 
                legal counsel before being relied upon in legal proceedings.
              </p>
            </div>
          </div>

          {/* Document Footer */}
          <div className="mt-12 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Scale className="w-4 h-4" />
              <span style={{ fontFamily: 'Crimson Pro, serif' }}>Criminal Appeal AI</span>
            </div>
            <p className="font-medium">Prepared for: Deb King, Glenmore Park 2745</p>
            <p className="italic">One woman's fight for justice — seeking truth for Joshua Homann, failed by the system</p>
            <p className="mt-2">NSW State & Australian Federal Law Reference</p>
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
          
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BarristerView;
