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
  BookOpen,
  Users,
  MapPin,
  Calendar,
  FileCheck,
  ExternalLink,
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
    return { label: "Evidence Gap", tone: "text-sky-600", bar: "bg-sky-500", note: "Promising grounds present, but supporting material should be strengthened." };
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
      p: ({ children }) => <p className="text-slate-700 dark:text-slate-300 leading-7 mb-3 text-sm">{children}</p>,
      ul: ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1 text-slate-700 dark:text-slate-300 text-sm">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1 text-slate-700 dark:text-slate-300 text-sm">{children}</ol>,
      li: ({ children }) => <li className="leading-6">{children}</li>,
      blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-300 pl-4 italic text-slate-700 dark:text-slate-300 my-3 text-sm">{children}</blockquote>,
      table: ({ children }) => (
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 my-4" data-testid={`${testId}-table-wrapper`}>
          <table className="min-w-full text-sm table-auto">{children}</table>
        </div>
      ),
      thead: ({ children }) => <thead className="bg-slate-100 dark:bg-slate-800">{children}</thead>,
      th: ({ children }) => <th className="px-4 py-3 text-left font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">{children}</th>,
      td: ({ children }) => <td className="px-4 py-3 align-top text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 break-words max-w-xs">{children}</td>,
      code: ({ children }) => <code className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">{children}</code>,
      a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{children}</a>,
    }}
  >
    {text}
  </ReactMarkdown>
);

// Report type configurations matching landing page design EXACTLY
const reportTypeConfig = {
  quick_summary: { 
    label: "Grounds of Merit Report", 
    headerBg: "bg-green-600",
    headerText: "text-white",
    accentBg: "bg-green-50 dark:bg-green-900/20",
    accentText: "text-green-800 dark:text-green-200",
    accentBorder: "border-green-200 dark:border-green-700",
    badgeBg: "bg-green-500",
    sectionBorder: "border-green-500",
    price: "$99 AUD",
    sectionsTarget: 6,
  },
  full_detailed: { 
    label: "Full Investigative Report", 
    headerBg: "bg-gradient-to-r from-slate-900 to-blue-900",
    headerText: "text-white",
    accentBg: "bg-blue-50 dark:bg-blue-900/20",
    accentText: "text-blue-800 dark:text-blue-200",
    accentBorder: "border-blue-200 dark:border-blue-700",
    badgeBg: "bg-blue-500",
    sectionBorder: "border-blue-500",
    price: "$100 AUD",
    sectionsTarget: 10,
  },
  extensive_log: { 
    label: "Extensive Barrister Report", 
    headerBg: "bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-900",
    headerText: "text-white",
    accentBg: "bg-purple-50 dark:bg-purple-900/20",
    accentText: "text-purple-800 dark:text-purple-200",
    accentBorder: "border-purple-200 dark:border-purple-700",
    badgeBg: "bg-purple-500",
    sectionBorder: "border-purple-500",
    price: "$150 AUD",
    sectionsTarget: 14,
  },
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900" style={{ fontFamily: "Crimson Pro, serif" }}>
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
                className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
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
                className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
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
        {/* Main Report Card - EXACTLY Like Landing Page */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden" data-testid="report-content">
          
          {/* Report Header - Matching Landing Page Style */}
          <div className={`${config.headerBg} ${config.headerText} p-5 sm:p-6`} data-testid="report-header-band">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <p className="text-xs uppercase tracking-wider font-semibold">{config.label}</p>
                  <span className="opacity-70 text-sm">— Your Report</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold mb-1" data-testid="report-title">
                  {caseData?.title || "Appeal Report"}
                </h1>
                <p className="text-sm opacity-80">
                  {caseData?.court || "Court"} • {(caseData?.state || "NSW").toUpperCase()}
                </p>
              </div>
              
              {/* Case Strength Score - Like Landing Page */}
              <div className="text-right">
                <div className="bg-white/10 rounded-lg p-3 inline-block">
                  <p className="text-3xl font-bold">{caseStrength}</p>
                  <p className="text-xs opacity-70">Case Strength</p>
                </div>
              </div>
            </div>
            
            {/* Stats Row - Like Landing Page Extensive Report */}
            <div className="flex flex-wrap gap-3 mt-4 text-xs">
              <span className="bg-white/20 px-3 py-1.5 rounded">{sections.length} Sections</span>
              <span className="bg-white/20 px-3 py-1.5 rounded">{documentsCount} Documents</span>
              <span className="bg-white/20 px-3 py-1.5 rounded">{grounds.length} Grounds</span>
              <span className="bg-white/20 px-3 py-1.5 rounded">{eventsCount} Timeline Events</span>
            </div>
          </div>

          {/* Table of Contents - Like Landing Page */}
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 border-b border-slate-200 dark:border-slate-600" data-testid="report-table-of-contents">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
              {report?.report_type === 'extensive_log' ? 'COMPLETE TABLE OF CONTENTS' : `CONTENTS (${sections.length} Sections)`}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1 text-xs text-slate-600 dark:text-slate-400">
              {sections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-left hover:text-slate-900 dark:hover:text-white hover:underline truncate"
                  data-testid={`report-toc-item-${idx + 1}`}
                >
                  {idx + 1}. {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Report Body */}
          <div className="p-5 sm:p-6 space-y-6">
            
            {/* Case Overview - Like Landing Page Sample */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="bg-slate-900 text-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{config.label}</p>
                    <h4 className="text-lg font-bold">{caseData?.title || "Case Analysis"}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Generated</p>
                    <p className="text-sm">{formatDate(report?.generated_at)}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                <div className={`inline-flex items-center gap-2 ${config.accentBg} ${config.accentText} text-xs px-3 py-1 rounded-full font-semibold`}>
                  Appeal Analysis Report
                </div>
                
                {/* Case Details Grid */}
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">CASE OVERVIEW</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <p><span className="text-slate-500">Defendant:</span> <strong className="text-slate-900 dark:text-white">{caseData?.defendant_name || "N/A"}</strong></p>
                    <p><span className="text-slate-500">Offence:</span> <strong className="text-slate-900 dark:text-white">{offenceLabel}</strong></p>
                    <p><span className="text-slate-500">Sentence:</span> <strong className="text-slate-900 dark:text-white">{sentenceSummary}</strong></p>
                    <p><span className="text-slate-500">Court:</span> <strong className="text-slate-900 dark:text-white">{caseData?.court || "N/A"}</strong></p>
                    <p><span className="text-slate-500">State:</span> <strong className="text-slate-900 dark:text-white">{(caseData?.state || "NSW").toUpperCase()}</strong></p>
                    <p><span className="text-slate-500">Documents:</span> <strong className="text-slate-900 dark:text-white">{documentsCount} files analysed</strong></p>
                  </div>
                </div>

                {/* Grounds Identified - Like Landing Page */}
                {grounds.length > 0 && (
                  <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-4 border border-sky-200 dark:border-sky-700">
                    <h5 className="font-bold text-sky-800 dark:text-sky-200 text-sm mb-3">GROUNDS IDENTIFIED: {grounds.length}</h5>
                    <div className="space-y-2 text-xs">
                      {grounds.map((ground, idx) => (
                        <p key={ground.ground_id || idx} className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            ground.strength === 'strong' ? 'bg-green-500' : 
                            ground.strength === 'moderate' ? 'bg-sky-500' : 'bg-slate-400'
                          }`}></span>
                          <strong className={
                            ground.strength === 'strong' ? 'text-green-700 dark:text-green-400' : 
                            ground.strength === 'moderate' ? 'text-sky-700 dark:text-sky-400' : 'text-slate-600'
                          }>
                            {ground.strength === 'strong' ? 'Strong:' : ground.strength === 'moderate' ? 'Moderate:' : 'Potential:'}
                          </strong>
                          <span className="text-slate-700 dark:text-slate-300">{ground.title}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appeal Viability - Like Landing Page */}
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">APPEAL VIABILITY</h5>
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      caseStrength >= 75 ? 'bg-gradient-to-br from-green-400 to-emerald-600' :
                      caseStrength >= 50 ? 'bg-gradient-to-br from-sky-400 to-orange-600' :
                      'bg-gradient-to-br from-rose-400 to-red-600'
                    }`}>
                      <span className="text-white font-bold text-xl">{caseStrength}%</span>
                    </div>
                    <div className="text-xs">
                      <p className={`font-semibold ${readiness.tone}`}>{readiness.label.toUpperCase()} PROSPECTS</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{readiness.note}</p>
                    </div>
                  </div>
                </div>

                {/* Deadline Warning - Like Landing Page */}
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-700">
                  <p className="text-xs text-red-800 dark:text-red-200 font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    DEADLINE: Notice of Appeal must be filed within 28 days of sentence
                  </p>
                </div>
              </div>
            </div>

            {/* Full Analysis Sections - Like Landing Page with Proper Formatting */}
            <div className="space-y-6" data-testid="report-full-analysis-section">
              {sections.map((section, idx) => (
                <article 
                  key={section.id} 
                  id={section.id} 
                  className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
                >
                  <div className={`border-b-2 ${config.sectionBorder} px-5 py-3 bg-slate-50 dark:bg-slate-700/50`}>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2" data-testid={`report-section-heading-${idx + 1}`}>
                      <span className={`w-6 h-6 rounded ${config.badgeBg} text-white text-xs flex items-center justify-center font-bold`}>
                        {idx + 1}
                      </span>
                      {section.title}
                    </h3>
                  </div>
                  <div className="p-5" data-testid={`report-section-content-${idx + 1}`}>
                    <MarkdownBlock text={section.content} testId={`report-section-md-${idx + 1}`} />
                  </div>
                </article>
              ))}
            </div>

            {/* Upgrade Prompt for Quick Summary */}
            {report?.report_type === 'quick_summary' && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-5 text-white text-center">
                <p className="font-semibold text-lg mb-2">Want the full analysis?</p>
                <p className="text-sm opacity-90 mb-4">
                  Upgrade to see all grounds in detail, similar successful appeals, legislation references, 
                  sentencing comparisons, and step-by-step appeal filing guide
                </p>
                <div className="flex justify-center gap-3">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50">
                    Full Investigative Report — $100 AUD
                  </Button>
                  <Button className="bg-purple-700 text-white hover:bg-purple-800">
                    Extensive Barrister Report — $150 AUD
                  </Button>
                </div>
              </div>
            )}

            {/* Premium Features for Paid Reports */}
            {(report?.report_type === 'full_detailed' || report?.report_type === 'extensive_log') && (
              <div className="bg-slate-900 rounded-xl p-5 text-white">
                <p className="text-xs uppercase tracking-widest text-blue-300 font-semibold mb-2">
                  {report?.report_type === 'extensive_log' ? 'Premium Barrister-Ready Document' : 'Premium Report Features'}
                </p>
                <h2 className="text-lg font-bold mb-4">Built for strategic legal action — not just plain text</h2>
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
                  <div className="rounded-lg border border-blue-800/60 bg-blue-950/40 p-3">
                    <BookOpen className="w-5 h-5 text-blue-300 mb-2" />
                    <p className="text-xs font-semibold text-blue-200 mb-1">Similar Cases Analysis</p>
                    <p className="text-[11px] text-slate-300">AustLII references with outcome summaries and applicable principles.</p>
                  </div>
                  <div className="rounded-lg border border-sky-700/60 bg-sky-900/30 p-3">
                    <Scale className="w-5 h-5 text-sky-300 mb-2" />
                    <p className="text-xs font-semibold text-sky-100 mb-1">Legislation Links</p>
                    <p className="text-[11px] text-slate-300">Direct references to applicable Acts and sections for your state.</p>
                  </div>
                  <div className="rounded-lg border border-emerald-700/60 bg-emerald-900/30 p-3">
                    <FileCheck className="w-5 h-5 text-emerald-300 mb-2" />
                    <p className="text-xs font-semibold text-emerald-100 mb-1">Filing Guide</p>
                    <p className="text-[11px] text-slate-300">Step-by-step instructions for lodging your appeal correctly.</p>
                  </div>
                  <div className="rounded-lg border border-purple-700/60 bg-purple-900/30 p-3">
                    <TrendingUp className="w-5 h-5 text-purple-300 mb-2" />
                    <p className="text-xs font-semibold text-purple-100 mb-1">Sentencing Comparison</p>
                    <p className="text-[11px] text-slate-300">Statistical analysis against comparable cases in your jurisdiction.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Risk Assessment for Extensive Report */}
            {report?.report_type === 'extensive_log' && (
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg p-5 border border-purple-200 dark:border-purple-700">
                <h5 className="font-bold text-purple-900 dark:text-purple-200 text-sm mb-4">RISK ASSESSMENT & STRATEGY SUMMARY</h5>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-3xl font-bold text-green-600">{caseStrength >= 70 ? '65-75%' : caseStrength >= 50 ? '45-55%' : '25-35%'}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Estimated Success Probability</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-sky-600">Ground {strongGrounds > 0 ? '1' : '2'}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Primary Argument to Lead</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-purple-600">4-6 mo</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Estimated Timeline to Hearing</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 p-5 text-center" data-testid="report-footer">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Appeal Case Manager</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {report?.report_type === 'extensive_log' 
                ? 'This is a complete barrister\'s working document ready to hand to legal counsel'
                : 'Full in-browser report — no PDF download required. Prepared for legal review support.'}
            </p>
          </footer>
        </div>
      </main>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          * {
            box-shadow: none !important;
          }
          .bg-white, .bg-slate-50, .bg-slate-100 {
            background-color: white !important;
          }
          table {
            page-break-inside: auto;
            border-collapse: collapse;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
          }
          p, li {
            orphans: 3;
            widows: 3;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportView;
