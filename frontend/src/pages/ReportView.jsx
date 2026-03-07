import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  ChevronRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  Target,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { API } from "../App";

const titleFromSnake = (value) => {
  if (!value) return "Not specified";
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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
  if (!text) return [];

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
  return sections.length > 0 ? sections : [{ id: "report-section-1", title: "Analysis", content: text }];
};

const getReadiness = (score) => {
  if (score >= 75) {
    return { label: "Filing-Ready", tone: "text-emerald-600", bar: "bg-emerald-500", note: "Strong appellate pathway with actionable grounds." };
  }
  if (score >= 50) {
    return { label: "Evidence Gap", tone: "text-amber-600", bar: "bg-amber-500", note: "Promising grounds present, but supporting material should be strengthened." };
  }
  return { label: "Urgent Build", tone: "text-rose-600", bar: "bg-rose-500", note: "Substantial preparation required before filing strategy is finalised." };
};

const MarkdownBlock = ({ text, testId }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ children }) => <h1 className="text-xl font-bold mt-6 mb-3 text-slate-900 dark:text-white" style={{ fontFamily: "Crimson Pro, serif" }}>{children}</h1>,
      h2: ({ children }) => <h2 className="text-lg font-bold mt-5 mb-3 text-slate-900 dark:text-white" style={{ fontFamily: "Crimson Pro, serif" }}>{children}</h2>,
      h3: ({ children }) => <h3 className="text-base font-semibold mt-4 mb-2 text-slate-900 dark:text-white">{children}</h3>,
      p: ({ children }) => <p className="text-slate-700 dark:text-slate-300 leading-7 mb-3">{children}</p>,
      ul: ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1 text-slate-700 dark:text-slate-300">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1 text-slate-700 dark:text-slate-300">{children}</ol>,
      li: ({ children }) => <li className="leading-7">{children}</li>,
      blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-300 pl-4 italic text-slate-700 dark:text-slate-300 my-3">{children}</blockquote>,
      table: ({ children }) => (
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 my-4" data-testid={`${testId}-table-wrapper`}>
          <table className="min-w-full text-sm">{children}</table>
        </div>
      ),
      thead: ({ children }) => <thead className="bg-slate-100 dark:bg-slate-800">{children}</thead>,
      th: ({ children }) => <th className="px-3 py-2 text-left font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">{children}</th>,
      td: ({ children }) => <td className="px-3 py-2 align-top text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">{children}</td>,
      code: ({ children }) => <code className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">{children}</code>,
    }}
  >
    {text}
  </ReactMarkdown>
);

// Report type configurations matching landing page design
const reportTypeConfig = {
  quick_summary: { 
    label: "Quick Summary", 
    headerBg: "bg-green-600",
    headerText: "text-white",
    accentBg: "bg-green-100 dark:bg-green-900/30",
    accentText: "text-green-800 dark:text-green-200",
    accentBorder: "border-green-200 dark:border-green-700",
    badgeBg: "bg-green-500",
    price: "FREE"
  },
  full_detailed: { 
    label: "Full Detailed Report", 
    headerBg: "bg-gradient-to-r from-slate-900 to-blue-900",
    headerText: "text-white",
    accentBg: "bg-blue-100 dark:bg-blue-900/30",
    accentText: "text-blue-800 dark:text-blue-200",
    accentBorder: "border-blue-200 dark:border-blue-700",
    badgeBg: "bg-blue-500",
    price: "$29 AUD"
  },
  extensive_log: { 
    label: "Extensive Log Report", 
    headerBg: "bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-900",
    headerText: "text-white",
    accentBg: "bg-purple-100 dark:bg-purple-900/30",
    accentText: "text-purple-800 dark:text-purple-200",
    accentBorder: "border-purple-200 dark:border-purple-700",
    badgeBg: "bg-purple-500",
    price: "$39 AUD"
  },
};

const ReportView = () => {
  const { caseId, reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [caseData, setCaseData] = useState(null);
  const [grounds, setGrounds] = useState([]);
  const [legacyReports, setLegacyReports] = useState([]);
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

      try {
        const legacyRes = await axios.get(`${API}/reports/embedded-legacy`);
        setLegacyReports(legacyRes.data?.reports || []);
      } catch (legacyError) {
        setLegacyReports([]);
      }
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
    });
  };

  const analysisText = report?.content?.analysis || "";
  const sections = useMemo(() => parseAnalysisSections(analysisText), [analysisText]);

  const documentsCount = report?.content?.document_count || 0;
  const eventsCount = report?.content?.event_count || 0;
  const strongGrounds = grounds.filter((g) => g.strength === "strong").length;
  const moderateGrounds = grounds.filter((g) => g.strength === "moderate").length;
  const caseStrength = Math.min(100, strongGrounds * 30 + moderateGrounds * 18 + Math.min(documentsCount * 2, 20) + Math.min(eventsCount, 10));
  const readiness = getReadiness(caseStrength);

  const sentenceSummary = extractSentenceSummary(analysisText);
  const offenceLabel = caseData?.offence_type || titleFromSnake(caseData?.offence_category);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const config = reportTypeConfig[report?.report_type] || reportTypeConfig.quick_summary;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900" data-testid="report-view-loading">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-slate-400 mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Fixed Action Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 no-print" data-testid="report-header">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/cases/${caseId}`)} data-testid="back-btn">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Case
            </Button>
            <div className="flex items-center gap-2 flex-wrap">
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
                className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                data-testid="export-docx-btn"
              >
                <FileText className="w-4 h-4 mr-2" />
                Word
              </Button>
              <Button size="sm" onClick={handleExportPDF} className="bg-slate-900 text-white hover:bg-slate-800" data-testid="export-pdf-btn">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Main Report Card - Matches Landing Page Design */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden" data-testid="report-content">
          
          {/* Coloured Header Band - Like Landing Page Mockups */}
          <div className={`${config.headerBg} ${config.headerText} p-5 sm:p-6`} data-testid="report-header-band">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <p className="text-xs uppercase tracking-wider opacity-80">{config.label}</p>
                  {report?.content?.aggressive_mode && (
                    <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">Aggressive Mode</span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "Crimson Pro, serif" }} data-testid="report-title">
                  {report?.title || caseData?.title || "Appeal Report"}
                </h1>
                <p className="text-sm opacity-80 mt-1">
                  {caseData?.court || "Court"} • {(caseData?.state || "NSW").toUpperCase()}
                </p>
              </div>
              
              {/* Case Strength Circle - Like Landing Page */}
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs opacity-70">Case Strength</p>
                  <p className="text-sm font-medium">{readiness.label}</p>
                </div>
                <div className="w-20 h-20 rounded-full bg-white/10 border-4 border-white/30 flex items-center justify-center" data-testid="case-strength-circle">
                  <span className="text-2xl font-bold">{caseStrength}</span>
                </div>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="flex flex-wrap gap-3 mt-4 text-xs">
              <span className="bg-white/20 px-3 py-1.5 rounded-lg">{sections.length} Sections</span>
              <span className="bg-white/20 px-3 py-1.5 rounded-lg">{documentsCount} Documents</span>
              <span className="bg-white/20 px-3 py-1.5 rounded-lg">{grounds.length} Grounds</span>
              <span className="bg-white/20 px-3 py-1.5 rounded-lg">{eventsCount} Timeline Events</span>
            </div>
          </div>

          {/* Table of Contents - Like Landing Page */}
          {sections.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 border-b border-slate-200 dark:border-slate-600" data-testid="report-table-of-contents">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Contents ({sections.length} Sections)
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
                {sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="hover:text-slate-900 dark:hover:text-white hover:underline"
                    data-testid={`report-toc-item-${idx + 1}`}
                  >
                    {idx + 1}. {section.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Report Body */}
          <div className="p-5 sm:p-6 space-y-6" style={{ fontFamily: "Crimson Pro, serif" }}>
            
            {/* Case Overview Box - Like Landing Page */}
            <div className={`rounded-xl border ${config.accentBorder} ${config.accentBg} p-5`} data-testid="report-case-overview">
              <h2 className={`font-bold ${config.accentText} text-sm border-b border-slate-200 dark:border-slate-600 pb-2 mb-3`}>
                CASE OVERVIEW
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Defendant</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{caseData?.defendant_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Offence</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{offenceLabel}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Sentence</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{sentenceSummary}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Court</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{caseData?.court || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">State</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{(caseData?.state || "NSW").toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Generated</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{formatDate(report?.generated_at)}</p>
                </div>
              </div>
            </div>

            {/* Grounds Preview Box */}
            {grounds.length > 0 && (
              <div className="rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-5" data-testid="report-grounds-preview">
                <h2 className="font-bold text-amber-800 dark:text-amber-200 text-sm mb-3">
                  GROUNDS IDENTIFIED: {grounds.length}
                </h2>
                <div className="space-y-2">
                  {grounds.slice(0, 3).map((ground, idx) => (
                    <div key={ground.ground_id || idx} className="flex items-center gap-2 text-sm">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        ground.strength === 'strong' ? 'bg-green-500' : 
                        ground.strength === 'moderate' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}></span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {ground.strength === 'strong' ? 'Strong' : ground.strength === 'moderate' ? 'Moderate' : 'Potential'}:
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">{ground.title}</span>
                    </div>
                  ))}
                  {grounds.length > 3 && (
                    <p className="text-xs text-slate-500 italic">+ {grounds.length - 3} more grounds in full analysis...</p>
                  )}
                </div>
              </div>
            )}

            {/* Appeal Viability Gauge */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5" data-testid="appeal-readiness-gauge">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
                APPEAL VIABILITY
              </h2>
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  caseStrength >= 75 ? 'bg-gradient-to-br from-green-400 to-emerald-600' :
                  caseStrength >= 50 ? 'bg-gradient-to-br from-amber-400 to-orange-600' :
                  'bg-gradient-to-br from-rose-400 to-red-600'
                }`} data-testid="viability-score-circle">
                  <span className="text-white font-bold text-xl">{caseStrength}%</span>
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${readiness.tone}`}>{readiness.label.toUpperCase()} PROSPECTS</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{readiness.note}</p>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full ${readiness.bar} transition-all duration-700`} style={{ width: `${caseStrength}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deadline Warning */}
            <div className="rounded-xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4" data-testid="deadline-warning">
              <p className="text-sm text-red-800 dark:text-red-200 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                DEADLINE: Notice of Appeal must be filed within 28 days of sentence
              </p>
            </div>

            {/* Full Analysis Sections */}
            <div className="space-y-6" data-testid="report-full-analysis-section">
              {sections.map((section, idx) => (
                <article 
                  key={section.id} 
                  id={section.id} 
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden"
                >
                  <div className={`${config.headerBg} px-5 py-3`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      <h3 className="text-white font-semibold" data-testid={`report-section-heading-${idx + 1}`}>
                        {section.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5" data-testid={`report-section-content-${idx + 1}`}>
                    <MarkdownBlock text={section.content} testId={`report-section-md-${idx + 1}`} />
                  </div>
                </article>
              ))}
            </div>

            {/* Premium Features Box */}
            <div className="rounded-xl border border-slate-700 bg-slate-900 text-white p-5" data-testid="premium-value-architecture-section">
              <p className="text-[11px] uppercase tracking-widest text-blue-300 font-semibold mb-2">Premium Report Architecture</p>
              <h2 className="text-lg font-bold mb-4">Built for strategic legal action — not just plain text</h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
                <div className="rounded-lg border border-blue-800/60 bg-blue-950/40 p-3">
                  <p className="text-xs font-semibold text-blue-200 mb-1">Comparative Sentencing</p>
                  <p className="text-[11px] text-slate-300">Before/after reduction pathways with practical appeal outcomes.</p>
                </div>
                <div className="rounded-lg border border-yellow-700/60 bg-yellow-900/30 p-3">
                  <p className="text-xs font-semibold text-yellow-100 mb-1">Similar Case Search</p>
                  <p className="text-[11px] text-slate-300">AustLII-ready query packs and jurisdiction filters.</p>
                </div>
                <div className="rounded-lg border border-emerald-700/60 bg-emerald-900/30 p-3">
                  <p className="text-xs font-semibold text-emerald-100 mb-1">How to Argue Grounds</p>
                  <p className="text-[11px] text-slate-300">Lead propositions and rebuttal directions.</p>
                </div>
                <div className="rounded-lg border border-purple-700/60 bg-purple-900/30 p-3">
                  <p className="text-xs font-semibold text-purple-100 mb-1">Next Steps Playbook</p>
                  <p className="text-[11px] text-slate-300">72-hour, 7-day, and 28-day execution plan.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legacy Reports Section */}
          {legacyReports.length > 0 && (
            <div className="border-t border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10 p-5 sm:p-6" data-testid="embedded-legacy-reports-section">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold mb-1">Recovered Reports</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: "Crimson Pro, serif" }}>
                  Embedded High-Detail Reports From Your History
                </h3>
              </div>
              <div className="space-y-4" data-testid="embedded-legacy-reports-list">
                {legacyReports.map((legacy, idx) => (
                  <article key={`${legacy.report_id}-${idx}`} className="rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-slate-800 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{legacy.title || "Recovered Report"}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Generated: {formatDate(legacy.generated_at)}</p>
                      </div>
                      {legacy.case_id && legacy.report_id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/cases/${legacy.case_id}/reports/${legacy.report_id}`)}
                          data-testid={`open-embedded-legacy-${legacy.report_id}`}
                        >
                          Open Original
                        </Button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto pr-2 border-t border-slate-100 dark:border-slate-700 pt-3" data-testid={`embedded-legacy-content-${legacy.report_id}`}>
                      <MarkdownBlock text={legacy.analysis || ""} testId={`embedded-legacy-md-${legacy.report_id}`} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 p-5 text-center" data-testid="report-footer">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Appeal Case Manager</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Full in-browser report — no PDF download required. Prepared for legal review support.
            </p>
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

export default ReportView;
