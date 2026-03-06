import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Scale,
  ArrowLeft,
  Download,
  Printer,
  Eye,
  Loader2,
  FileText,
  ListOrdered,
  Gavel,
  ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { API } from "../App";

const titleFromSnake = (value) => {
  if (!value) return "Not specified";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const extractSentenceSummary = (analysis = "") => {
  const byLabel = analysis.match(/sentence[^\n:]*[:\-]\s*([^\n\.]{6,140})/i);
  if (byLabel?.[1]) return byLabel[1].trim();

  const byDuration = analysis.match(/([0-9]+(?:\.[0-9]+)?\s*(?:year|years|month|months)[^\n\.]{0,90})/i);
  if (byDuration?.[1]) return byDuration[1].trim();

  return "Not clearly stated in report";
};

const parseAnalysisSections = (analysis = "") => {
  const text = analysis.replace(/\r\n/g, "\n").trim();
  if (!text) {
    return [];
  }

  const lines = text.split("\n");
  const sections = [];
  let currentTitle = "Executive Analysis";
  let currentLines = [];

  const pushSection = () => {
    const content = currentLines.join("\n").trim();
    if (!content) return;
    sections.push({
      id: `report-section-${sections.length + 1}`,
      title: currentTitle,
      content,
    });
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    const markdownHeader = trimmed.match(/^#{1,3}\s+(.+)$/);
    const numberedHeader = trimmed.match(/^(?:\d{1,2}|[IVX]{1,5})[.)]\s+(.+)$/i);
    const boldHeader = trimmed.match(/^\*\*([^*]+)\*\*$/);

    if (markdownHeader || numberedHeader || boldHeader) {
      pushSection();
      currentTitle = (markdownHeader?.[1] || numberedHeader?.[1] || boldHeader?.[1] || "Analysis")
        .replace(/[\-:]+$/, "")
        .trim();
      currentLines = [];
      return;
    }

    currentLines.push(line);
  });

  pushSection();

  if (sections.length === 0) {
    return [{ id: "report-section-1", title: "Analysis", content: text }];
  }

  return sections;
};

const ReportView = () => {
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
        axios.get(`${API}/cases/${caseId}/grounds`),
      ]);
      setReport(reportRes.data);
      setCaseData(caseRes.data);
      setGrounds(groundsRes.data?.grounds || []);
    } catch (error) {
      toast.error("Failed to load report");
      navigate(`/cases/${caseId}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const handleExportPDF = async () => {
    try {
      toast.info("Generating PDF...");
      const response = await axios.get(`${API}/cases/${caseId}/reports/${reportId}/export-pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${caseData?.title || "Report"}_${report?.report_type || "report"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to export PDF.");
    }
  };

  const handleExportDOCX = async () => {
    try {
      toast.info("Generating Word document...");
      const response = await axios.get(`${API}/cases/${caseId}/reports/${reportId}/export-docx`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${caseData?.title || "Report"}_${report?.report_type || "report"}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Word document downloaded successfully!");
    } catch (error) {
      toast.error("Failed to export Word document.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const reportTypeConfig = {
    quick_summary: { label: "Quick Summary", cls: "bg-blue-50 text-blue-700 border-blue-200" },
    full_detailed: { label: "Full Detailed Analysis", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    extensive_log: { label: "Extensive Log Report", cls: "bg-purple-50 text-purple-700 border-purple-200" },
  };

  const analysisText = report?.content?.analysis || "";
  const sections = useMemo(() => parseAnalysisSections(analysisText), [analysisText]);

  const documentsCount = report?.content?.document_count || 0;
  const eventsCount = report?.content?.event_count || 0;
  const strongGrounds = grounds.filter((g) => g.strength === "strong").length;
  const moderateGrounds = grounds.filter((g) => g.strength === "moderate").length;
  const caseStrength = Math.min(100, strongGrounds * 30 + moderateGrounds * 18 + Math.min(documentsCount * 2, 20) + Math.min(eventsCount, 10));

  const sentenceSummary = extractSentenceSummary(analysisText);
  const offenceLabel = caseData?.offence_type || titleFromSnake(caseData?.offence_category);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" data-testid="report-view-loading">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-slate-400 mx-auto" />
          <p className="mt-4 text-slate-600">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/cases/${caseId}`)} data-testid="back-btn">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Case
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/cases/${caseId}/reports/${reportId}/barrister`)}
                data-testid="barrister-view-btn"
              >
                <Eye className="w-4 h-4 mr-2" />
                Barrister View
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} data-testid="print-btn">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportDOCX}
                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                data-testid="export-docx-btn"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export Word
              </Button>
              <Button size="sm" onClick={handleExportPDF} className="bg-slate-900 text-white hover:bg-slate-800" data-testid="export-pdf-btn">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-8 md:p-10" data-testid="report-content">
          <div className="text-center mb-10 pb-8 border-b border-slate-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Scale className="w-8 h-8 text-slate-900" />
              <span className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Crimson Pro, serif" }}>
                Appeal Case Manager
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4" style={{ fontFamily: "Crimson Pro, serif" }} data-testid="report-title">
              {report?.title}
            </h1>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="outline" className={reportTypeConfig[report?.report_type]?.cls || reportTypeConfig.quick_summary.cls} data-testid="report-type-badge">
                {reportTypeConfig[report?.report_type]?.label || report?.report_type}
              </Badge>
              <span className="text-sm text-slate-500" data-testid="report-generated-date">
                Generated: {formatDate(report?.generated_at)}
              </span>
            </div>
          </div>

          <section
            className="mb-10 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-amber-50 p-6"
            data-testid="report-top-summary-box"
          >
            <div className="flex items-center gap-2 mb-4">
              <Gavel className="w-5 h-5 text-indigo-700" />
              <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Crimson Pro, serif" }}>
                Case Command Summary
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <SummaryPill label="Accused" value={caseData?.defendant_name || "N/A"} testId="report-summary-accused" />
              <SummaryPill label="Sentence" value={sentenceSummary} testId="report-summary-sentence" />
              <SummaryPill label="Crime / Offence" value={offenceLabel} testId="report-summary-offence" />
              <SummaryPill label="Grounds of Merit" value={String(grounds.length)} testId="report-summary-grounds" />
              <SummaryPill label="Case Strength" value={`${caseStrength}/100`} testId="report-summary-strength" />
              <SummaryPill label="Court & State" value={`${caseData?.court || "Court N/A"} • ${(caseData?.state || "NSW").toUpperCase()}`} testId="report-summary-court-state" />
            </div>
          </section>

          {sections.length > 0 && (
            <section className="mb-10 rounded-2xl border border-slate-200 p-5 bg-slate-50" data-testid="report-table-of-contents">
              <div className="flex items-center gap-2 mb-3">
                <ListOrdered className="w-4 h-4 text-slate-700" />
                <h3 className="font-semibold text-slate-900" style={{ fontFamily: "Crimson Pro, serif" }}>
                  Table of Contents
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="text-left px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-sm text-slate-700 transition-colors"
                    data-testid={`report-toc-item-${idx + 1}`}
                  >
                    <span className="font-semibold text-slate-900 mr-1">{idx + 1}.</span>
                    {section.title}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-6" data-testid="report-full-analysis-section">
            {sections.map((section, idx) => (
              <article key={section.id} id={section.id} className="rounded-xl border border-slate-200 p-5 bg-white">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "Crimson Pro, serif" }} data-testid={`report-section-heading-${idx + 1}`}>
                    {section.title}
                  </h3>
                </div>
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap" data-testid={`report-section-content-${idx + 1}`}>
                  {section.content}
                </div>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="mt-4 inline-flex items-center gap-1 text-xs text-indigo-700 hover:text-indigo-900"
                  data-testid={`report-back-to-top-${idx + 1}`}
                >
                  <ChevronRight className="w-3 h-3 rotate-[-90deg]" />
                  Back to top
                </button>
              </article>
            ))}
          </section>

          <footer className="mt-14 pt-8 border-t border-slate-200 text-center text-sm text-slate-500" data-testid="report-footer">
            <p>This is a full in-browser report view — no PDF download required to read all sections.</p>
            <p className="font-medium">Prepared for: Deb King, Glenmore Park 2745</p>
            <p className="italic">One woman's fight for justice — seeking truth for Joshua Homann, failed by the system</p>
          </footer>
        </div>
      </main>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

const SummaryPill = ({ label, value, testId }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-3" data-testid={testId}>
    <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">{label}</p>
    <p className="text-sm font-semibold text-slate-900 break-words">{value}</p>
  </div>
);

export default ReportView;