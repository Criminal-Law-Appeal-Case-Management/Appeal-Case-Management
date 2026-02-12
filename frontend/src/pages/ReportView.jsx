import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { 
  Scale, ArrowLeft, Download, Printer, Eye, Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { API } from "../App";

const ReportView = ({ user }) => {
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

  const handleExportPDF = async () => {
    try {
      toast.info("Generating PDF...");
      const response = await axios.get(
        `${API}/cases/${caseId}/reports/${reportId}/export-pdf`,
        { responseType: 'blob' }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${caseData?.title || 'Report'}_${report?.report_type || 'report'}.pdf`);
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getReportTypeBadge = (type) => {
    const styles = {
      quick_summary: "bg-blue-50 text-blue-700 border-blue-200",
      full_detailed: "bg-amber-50 text-amber-700 border-amber-200",
      extensive_log: "bg-slate-50 text-slate-700 border-slate-200"
    };
    const labels = {
      quick_summary: "Quick Summary",
      full_detailed: "Full Detailed Analysis",
      extensive_log: "Extensive Log Report"
    };
    return (
      <Badge variant="outline" className={styles[type] || styles.quick_summary}>
        {labels[type] || type}
      </Badge>
    );
  };

  // Format the analysis content with proper sections
  const formatAnalysis = (content) => {
    if (!content) return null;
    
    const analysis = content.analysis || "";
    
    // Split by common section headers
    const sections = analysis.split(/(?=\d+\.\s+[A-Z]|\n##\s+|\n\*\*[A-Z])/g);
    
    return sections.map((section, idx) => {
      // Check if this is a section header
      const headerMatch = section.match(/^(\d+\.\s+[A-Z][^:\n]+|##\s+[^\n]+|\*\*[A-Z][^*]+\*\*)/);
      
      if (headerMatch) {
        const header = headerMatch[0].replace(/^##\s+/, '').replace(/\*\*/g, '').trim();
        const body = section.substring(headerMatch[0].length).trim();
        
        return (
          <div key={idx} className="mb-8">
            <h3 
              className="text-xl font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-2"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              {header}
            </h3>
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {body}
            </div>
          </div>
        );
      }
      
      return (
        <div key={idx} className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">
          {section}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-slate-400 mx-auto" />
          <p className="mt-4 text-slate-600">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header - hidden when printing */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(`/cases/${caseId}`)}
                data-testid="back-btn"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Case
              </Button>
            </div>
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
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                data-testid="print-btn"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button
                size="sm"
                onClick={handleExportPDF}
                className="bg-slate-900 text-white hover:bg-slate-800"
                data-testid="export-pdf-btn"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Report Paper */}
        <div className="report-paper" data-testid="report-content">
          {/* Header */}
          <div className="text-center mb-12 pb-8 border-b border-slate-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Scale className="w-8 h-8 text-slate-900" />
              <span 
                className="text-2xl font-bold text-slate-900"
                style={{ fontFamily: 'Crimson Pro, serif' }}
              >
                Justitia AI
              </span>
            </div>
            <h1 
              className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              {report?.title}
            </h1>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {getReportTypeBadge(report?.report_type)}
              <span className="text-sm text-slate-500">
                Generated: {formatDate(report?.generated_at)}
              </span>
            </div>
          </div>

          {/* Case Info */}
          <div className="mb-10 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <h2 
              className="text-lg font-semibold text-slate-900 mb-4"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              Case Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Case Title:</span>
                <p className="font-medium text-slate-900">{caseData?.title}</p>
              </div>
              <div>
                <span className="text-slate-500">Defendant:</span>
                <p className="font-medium text-slate-900">{caseData?.defendant_name}</p>
              </div>
              {caseData?.case_number && (
                <div>
                  <span className="text-slate-500">Case Number:</span>
                  <p className="font-medium text-slate-900 font-mono">{caseData.case_number}</p>
                </div>
              )}
              {caseData?.court && (
                <div>
                  <span className="text-slate-500">Court:</span>
                  <p className="font-medium text-slate-900">{caseData.court}</p>
                </div>
              )}
              <div>
                <span className="text-slate-500">Documents Analyzed:</span>
                <p className="font-medium text-slate-900">{report?.content?.document_count || 0}</p>
              </div>
              <div>
                <span className="text-slate-500">Timeline Events:</span>
                <p className="font-medium text-slate-900">{report?.content?.event_count || 0}</p>
              </div>
            </div>
          </div>

          {/* Analysis Content */}
          <div className="prose prose-slate max-w-none">
            {formatAnalysis(report?.content)}
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
            <p>This report was generated by Justitia AI</p>
            <p className="mt-1">Criminal Appeal Case Management System</p>
            <p className="mt-1">NSW State & Australian Federal Law Reference</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportView;
