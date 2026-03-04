import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  FileText, Plus, Trash2, Loader2, Download, Eye, ChevronRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { API } from "../App";

const REPORT_TYPES = [
  { value: "quick_summary", label: "Quick Summary", description: "2-3 paragraph overview" },
  { value: "full_detailed", label: "Full Detailed", description: "Comprehensive legal analysis" },
  { value: "extensive_log", label: "Extensive Log", description: "Complete documentation with all evidence" }
];

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString('en-AU', { 
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const getReportTypeColor = (type) => {
  const colors = {
    quick_summary: "bg-green-100 text-green-800 border-green-200",
    full_detailed: "bg-blue-100 text-blue-800 border-blue-200",
    extensive_log: "bg-purple-100 text-purple-800 border-purple-200"
  };
  return colors[type] || "bg-slate-100 text-slate-800 border-slate-200";
};

export default function ReportsSection({ 
  caseId, 
  reports, 
  setReports,
  onRefresh 
}) {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportType, setReportType] = useState("quick_summary");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [exportingPdf, setExportingPdf] = useState(null);
  const [exportingDocx, setExportingDocx] = useState(null);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const response = await axios.post(`${API}/cases/${caseId}/reports/generate`, {
        report_type: reportType
      }, { timeout: 180000 });
      
      setReports([response.data, ...reports]);
      toast.success("Report generated successfully");
      setShowReportDialog(false);
      setSelectedReport(response.data);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        toast.error("Report generation timed out. Please try again.");
      } else {
        toast.error("Failed to generate report");
      }
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await axios.delete(`${API}/cases/${caseId}/reports/${reportId}`);
      setReports(reports.filter(r => r.report_id !== reportId));
      if (selectedReport?.report_id === reportId) {
        setSelectedReport(null);
      }
      toast.success("Report deleted");
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

  const handleExportPDF = async (reportId) => {
    setExportingPdf(reportId);
    try {
      const response = await axios.get(`${API}/cases/${caseId}/reports/${reportId}/export-pdf`, {
        responseType: 'blob',
        timeout: 60000
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded");
    } catch (error) {
      toast.error("Failed to export PDF");
    } finally {
      setExportingPdf(null);
    }
  };

  const handleExportDOCX = async (reportId) => {
    setExportingDocx(reportId);
    try {
      const response = await axios.get(`${API}/cases/${caseId}/reports/${reportId}/export-docx`, {
        responseType: 'blob',
        timeout: 60000
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Word document downloaded");
    } catch (error) {
      toast.error("Failed to export DOCX");
    } finally {
      setExportingDocx(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button 
          onClick={() => setShowReportDialog(true)}
          className="bg-slate-900 text-white hover:bg-slate-800"
          data-testid="generate-report-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Reports Grid */}
      {reports.length === 0 ? (
        <Card className="p-12 text-center" data-testid="no-reports-message">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
            No reports generated
          </h3>
          <p className="text-slate-600 mb-4">Generate AI-powered reports analyzing your case documents.</p>
          <Button 
            onClick={() => setShowReportDialog(true)}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate First Report
          </Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Report List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Generated Reports ({reports.length})
            </h3>
            {reports.map((report) => (
              <Card 
                key={report.report_id} 
                className={`card-hover cursor-pointer group ${selectedReport?.report_id === report.report_id ? 'border-slate-900 bg-slate-50' : ''}`}
                onClick={() => setSelectedReport(report)}
                data-testid={`report-${report.report_id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={getReportTypeColor(report.report_type)}>
                          {REPORT_TYPES.find(t => t.value === report.report_type)?.label || report.report_type}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-slate-900">{report.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Generated {formatDateTime(report.generated_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportPDF(report.report_id);
                        }}
                        disabled={exportingPdf === report.report_id}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        data-testid={`export-pdf-${report.report_id}`}
                      >
                        {exportingPdf === report.report_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(report.report_id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50"
                        data-testid={`delete-report-${report.report_id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Report Preview */}
          {selectedReport && (
            <Card className="h-fit sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge variant="outline" className={getReportTypeColor(selectedReport.report_type)}>
                      {REPORT_TYPES.find(t => t.value === selectedReport.report_type)?.label}
                    </Badge>
                    <h3 className="font-semibold text-slate-900 mt-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      {selectedReport.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {formatDateTime(selectedReport.generated_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF(selectedReport.report_id)}
                      disabled={exportingPdf === selectedReport.report_id}
                      data-testid="export-selected-pdf"
                    >
                      {exportingPdf === selectedReport.report_id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-1" />
                      )}
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportDOCX(selectedReport.report_id)}
                      disabled={exportingDocx === selectedReport.report_id}
                      data-testid="export-selected-docx"
                    >
                      {exportingDocx === selectedReport.report_id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-1" />
                      )}
                      Word
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-96">
                  <div className="prose prose-slate prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedReport.content?.analysis || "No content available"}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Generate Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Crimson Pro, serif' }}>Generate Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="mt-1" data-testid="report-type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <span className="font-medium">{type.label}</span>
                        <p className="text-xs text-slate-500">{type.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-slate-600">
              AI will analyze all uploaded documents and generate a comprehensive report based on the selected type.
              This may take 1-2 minutes.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleGenerateReport}
              disabled={generatingReport}
              className="bg-slate-900 text-white hover:bg-slate-800"
              data-testid="generate-report-submit"
            >
              {generatingReport ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
