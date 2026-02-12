import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { 
  Scale, ArrowLeft, Download, Printer, Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { API } from "../App";

const BarristerView = ({ user }) => {
  const { caseId, reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [caseId, reportId]);

  const fetchData = async () => {
    try {
      const [reportRes, caseRes] = await Promise.all([
        axios.get(`${API}/cases/${caseId}/reports/${reportId}`),
        axios.get(`${API}/cases/${caseId}`)
      ]);
      setReport(reportRes.data);
      setCaseData(caseRes.data);
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
    
    // Common section patterns in legal analysis
    const sectionPatterns = [
      { pattern: /(?:^|\n)(?:1\.|I\.|CASE OVERVIEW|OVERVIEW)[:\s]*/i, title: "CASE OVERVIEW" },
      { pattern: /(?:^|\n)(?:2\.|II\.|EVIDENCE ANALYSIS|EVIDENCE)[:\s]*/i, title: "EVIDENCE ANALYSIS" },
      { pattern: /(?:^|\n)(?:3\.|III\.|GROUNDS OF MERIT|GROUNDS)[:\s]*/i, title: "GROUNDS OF MERIT" },
      { pattern: /(?:^|\n)(?:4\.|IV\.|LEGAL FRAMEWORK|LEGAL|LAW SECTIONS)[:\s]*/i, title: "LEGAL FRAMEWORK" },
      { pattern: /(?:^|\n)(?:5\.|V\.|STRATEGIC RECOMMENDATIONS|RECOMMENDATIONS|STRATEGY)[:\s]*/i, title: "RECOMMENDATIONS" },
      { pattern: /(?:^|\n)(?:6\.|VI\.|CONCLUSION)[:\s]*/i, title: "CONCLUSION" }
    ];
    
    // Split into sections based on patterns or use the whole text
    let remainingText = analysis;
    let sectionNum = 1;
    
    // If no clear sections, create one main section
    if (!sectionPatterns.some(p => p.pattern.test(analysis))) {
      sections.push({
        number: "1",
        title: "ANALYSIS",
        content: analysis
      });
    } else {
      // Try to extract sections
      const lines = analysis.split('\n');
      let currentSection = null;
      let currentContent = [];
      
      for (const line of lines) {
        let foundSection = false;
        for (const { pattern, title } of sectionPatterns) {
          if (pattern.test(line)) {
            // Save previous section
            if (currentSection) {
              sections.push({
                number: String(sections.length + 1),
                title: currentSection,
                content: currentContent.join('\n').trim()
              });
            }
            currentSection = title;
            currentContent = [line.replace(pattern, '').trim()];
            foundSection = true;
            break;
          }
        }
        if (!foundSection && currentSection) {
          currentContent.push(line);
        } else if (!foundSection && !currentSection) {
          // Content before first section
          if (line.trim()) {
            if (sections.length === 0) {
              sections.push({
                number: "1",
                title: "PRELIMINARY NOTES",
                content: ""
              });
            }
            if (sections[0]) {
              sections[0].content += (sections[0].content ? '\n' : '') + line;
            }
          }
        }
      }
      
      // Don't forget the last section
      if (currentSection) {
        sections.push({
          number: String(sections.length + 1),
          title: currentSection,
          content: currentContent.join('\n').trim()
        });
      }
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
                size="sm"
                onClick={handlePrint}
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

          {/* Sections */}
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
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Legal Notice Footer */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <h3 
              className="text-lg font-semibold text-slate-900 mb-4"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              Legal Reference Notes
            </h3>
            <div className="text-sm text-slate-600 space-y-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
              <p>This analysis references relevant provisions from:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Crimes Act 1900 (NSW)</li>
                <li>Criminal Appeal Act 1912 (NSW)</li>
                <li>Criminal Code Act 1995 (Cth)</li>
                <li>Evidence Act 1995 (NSW & Cth)</li>
                <li>Sentencing Act 1995 (NSW)</li>
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
              <span style={{ fontFamily: 'Crimson Pro, serif' }}>Justitia AI</span>
            </div>
            <p>Criminal Appeal Case Management System</p>
            <p>NSW State & Australian Federal Law Reference</p>
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
