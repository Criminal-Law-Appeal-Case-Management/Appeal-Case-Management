import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { 
  Scale, ArrowLeft, FileText, Clock, Plus, Trash2, 
  Upload, Loader2, ChevronRight, FileUp, AlertCircle,
  MessageSquare, Pin, PinOff, Edit2, User
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { API } from "../App";
import Timeline from "../components/Timeline";

const DOCUMENT_CATEGORIES = [
  { value: "brief", label: "Legal Brief" },
  { value: "case_note", label: "Case Note" },
  { value: "evidence", label: "Evidence" },
  { value: "court_document", label: "Court Document" },
  { value: "public_advertising", label: "Public Record" },
  { value: "other", label: "Other" }
];

const EVENT_TYPES = [
  { value: "arrest", label: "Arrest" },
  { value: "court_hearing", label: "Court Hearing" },
  { value: "evidence_discovery", label: "Evidence Discovery" },
  { value: "appeal_filed", label: "Appeal Filed" },
  { value: "verdict", label: "Verdict" },
  { value: "other", label: "Other" }
];

const NOTE_CATEGORIES = [
  { value: "general", label: "General Note" },
  { value: "legal_opinion", label: "Legal Opinion" },
  { value: "evidence_note", label: "Evidence Note" },
  { value: "strategy", label: "Strategy" },
  { value: "question", label: "Question" },
  { value: "action_item", label: "Action Item" }
];

const CaseDetail = ({ user }) => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [reports, setReports] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("documents");

  // Dialog states
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Form states
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState("other");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_date: "",
    event_type: "other"
  });

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "general"
  });

  useEffect(() => {
    fetchCaseData();
  }, [caseId]);

  const fetchCaseData = async () => {
    try {
      const [caseRes, docsRes, timelineRes, reportsRes, notesRes] = await Promise.all([
        axios.get(`${API}/cases/${caseId}`),
        axios.get(`${API}/cases/${caseId}/documents`),
        axios.get(`${API}/cases/${caseId}/timeline`),
        axios.get(`${API}/cases/${caseId}/reports`),
        axios.get(`${API}/cases/${caseId}/notes`)
      ]);
      setCaseData(caseRes.data);
      setDocuments(docsRes.data);
      setTimeline(timelineRes.data);
      setReports(reportsRes.data);
      setNotes(notesRes.data);
    } catch (error) {
      toast.error("Failed to load case data");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async () => {
    if (!uploadFile) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("category", uploadCategory);
    formData.append("description", uploadDescription);

    try {
      const response = await axios.post(`${API}/cases/${caseId}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setDocuments([response.data, ...documents]);
      setShowUploadDialog(false);
      setUploadFile(null);
      setUploadCategory("other");
      setUploadDescription("");
      toast.success("Document uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm("Delete this document?")) return;
    
    try {
      await axios.delete(`${API}/cases/${caseId}/documents/${docId}`);
      setDocuments(documents.filter(d => d.document_id !== docId));
      toast.success("Document deleted");
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) {
      toast.error("Title and date are required");
      return;
    }

    try {
      const response = await axios.post(`${API}/cases/${caseId}/timeline`, newEvent);
      setTimeline([...timeline, response.data].sort((a, b) => 
        new Date(a.event_date) - new Date(b.event_date)
      ));
      setShowEventDialog(false);
      setNewEvent({ title: "", description: "", event_date: "", event_type: "other" });
      toast.success("Event added to timeline");
    } catch (error) {
      toast.error("Failed to add event");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;
    
    try {
      await axios.delete(`${API}/cases/${caseId}/timeline/${eventId}`);
      setTimeline(timeline.filter(e => e.event_id !== eventId));
      toast.success("Event deleted");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const handleGenerateReport = async (reportType) => {
    setGeneratingReport(true);
    try {
      const response = await axios.post(`${API}/cases/${caseId}/reports/generate`, {
        report_type: reportType
      });
      setReports([response.data, ...reports]);
      setShowReportDialog(false);
      toast.success("Report generated successfully");
      navigate(`/cases/${caseId}/reports/${response.data.report_id}`);
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Delete this report?")) return;
    
    try {
      await axios.delete(`${API}/cases/${caseId}/reports/${reportId}`);
      setReports(reports.filter(r => r.report_id !== reportId));
      toast.success("Report deleted");
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

  // Notes handlers
  const handleCreateNote = async () => {
    if (!newNote.title || !newNote.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const response = await axios.post(`${API}/cases/${caseId}/notes`, newNote);
      setNotes([response.data, ...notes]);
      setShowNoteDialog(false);
      setNewNote({ title: "", content: "", category: "general" });
      toast.success("Note added successfully");
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !newNote.title || !newNote.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const response = await axios.put(`${API}/cases/${caseId}/notes/${editingNote.note_id}`, newNote);
      setNotes(notes.map(n => n.note_id === editingNote.note_id ? response.data : n));
      setShowNoteDialog(false);
      setEditingNote(null);
      setNewNote({ title: "", content: "", category: "general" });
      toast.success("Note updated successfully");
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    
    try {
      await axios.delete(`${API}/cases/${caseId}/notes/${noteId}`);
      setNotes(notes.filter(n => n.note_id !== noteId));
      toast.success("Note deleted");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleTogglePin = async (noteId) => {
    try {
      const response = await axios.patch(`${API}/cases/${caseId}/notes/${noteId}/pin`);
      setNotes(notes.map(n => n.note_id === noteId ? response.data : n)
        .sort((a, b) => {
          if (a.is_pinned === b.is_pinned) {
            return new Date(b.created_at) - new Date(a.created_at);
          }
          return b.is_pinned ? 1 : -1;
        }));
      toast.success(response.data.is_pinned ? "Note pinned" : "Note unpinned");
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const openEditNote = (note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category
    });
    setShowNoteDialog(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      brief: "bg-blue-50 text-blue-700 border-blue-200",
      case_note: "bg-amber-50 text-amber-700 border-amber-200",
      evidence: "bg-emerald-50 text-emerald-700 border-emerald-200",
      court_document: "bg-slate-50 text-slate-700 border-slate-200",
      public_advertising: "bg-purple-50 text-purple-700 border-purple-200",
      other: "bg-slate-50 text-slate-600 border-slate-200"
    };
    return colors[category] || colors.other;
  };

  const getNoteCategoryColor = (category) => {
    const colors = {
      general: "bg-slate-50 text-slate-700 border-slate-200",
      legal_opinion: "bg-blue-50 text-blue-700 border-blue-200",
      evidence_note: "bg-emerald-50 text-emerald-700 border-emerald-200",
      strategy: "bg-purple-50 text-purple-700 border-purple-200",
      question: "bg-amber-50 text-amber-700 border-amber-200",
      action_item: "bg-red-50 text-red-700 border-red-200"
    };
    return colors[category] || colors.general;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-slate-400 mx-auto" />
          <p className="mt-4 text-slate-600">Loading case...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              data-testid="back-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-slate-600" />
              <span className="text-slate-400">/</span>
              <span className="font-medium text-slate-900">{caseData?.title}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Case Info */}
        <div className="mb-8">
          <h1 
            className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
            style={{ fontFamily: 'Crimson Pro, serif' }}
            data-testid="case-title"
          >
            {caseData?.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-slate-600">
            <span className="font-medium">{caseData?.defendant_name}</span>
            {caseData?.case_number && (
              <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                {caseData.case_number}
              </span>
            )}
            {caseData?.court && <span>{caseData.court}</span>}
          </div>
          {caseData?.summary && (
            <p className="mt-4 text-slate-600 max-w-3xl">{caseData.summary}</p>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="documents" data-testid="tab-documents">
                <FileText className="w-4 h-4 mr-2" />
                Documents ({documents.length})
              </TabsTrigger>
              <TabsTrigger value="timeline" data-testid="tab-timeline">
                <Clock className="w-4 h-4 mr-2" />
                Timeline ({timeline.length})
              </TabsTrigger>
              <TabsTrigger value="notes" data-testid="tab-notes">
                <MessageSquare className="w-4 h-4 mr-2" />
                Notes ({notes.length})
              </TabsTrigger>
              <TabsTrigger value="reports" data-testid="tab-reports">
                <Scale className="w-4 h-4 mr-2" />
                Reports ({reports.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              {activeTab === "documents" && (
                <Button 
                  onClick={() => setShowUploadDialog(true)}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                  data-testid="upload-doc-btn"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              )}
              {activeTab === "timeline" && (
                <Button 
                  onClick={() => setShowEventDialog(true)}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                  data-testid="add-event-btn"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              )}
              {activeTab === "notes" && (
                <Button 
                  onClick={() => {
                    setEditingNote(null);
                    setNewNote({ title: "", content: "", category: "general" });
                    setShowNoteDialog(true);
                  }}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                  data-testid="add-note-btn"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              )}
              {activeTab === "reports" && (
                <Button 
                  onClick={() => setShowReportDialog(true)}
                  className="bg-amber-600 text-white hover:bg-amber-700"
                  data-testid="generate-report-btn"
                >
                  <Scale className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              )}
            </div>
          </div>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            {documents.length === 0 ? (
              <Card className="p-12 text-center">
                <FileUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  No documents yet
                </h3>
                <p className="text-slate-600 mb-4">Upload briefs, case notes, and evidence to build your case.</p>
                <Button 
                  onClick={() => setShowUploadDialog(true)}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload First Document
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {documents.map((doc) => (
                  <Card 
                    key={doc.document_id} 
                    className="card-hover group"
                    data-testid={`doc-${doc.document_id}`}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{doc.filename}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={getCategoryColor(doc.category)}>
                              {DOCUMENT_CATEGORIES.find(c => c.value === doc.category)?.label || doc.category}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              Uploaded {formatDate(doc.uploaded_at)}
                            </span>
                          </div>
                          {doc.description && (
                            <p className="text-sm text-slate-600 mt-1">{doc.description}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.document_id)}
                        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50"
                        data-testid={`delete-doc-${doc.document_id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            {timeline.length === 0 ? (
              <Card className="p-12 text-center">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  No events yet
                </h3>
                <p className="text-slate-600 mb-4">Build a chronological timeline of case events.</p>
                <Button 
                  onClick={() => setShowEventDialog(true)}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Event
                </Button>
              </Card>
            ) : (
              <Timeline events={timeline} onDeleteEvent={handleDeleteEvent} />
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            {notes.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  No notes yet
                </h3>
                <p className="text-slate-600 mb-4">Add notes, comments, and legal opinions to the case.</p>
                <Button 
                  onClick={() => {
                    setEditingNote(null);
                    setNewNote({ title: "", content: "", category: "general" });
                    setShowNoteDialog(true);
                  }}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Note
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {notes.map((note) => (
                  <Card 
                    key={note.note_id} 
                    className={`card-hover group ${note.is_pinned ? 'border-amber-300 bg-amber-50/30' : ''}`}
                    data-testid={`note-${note.note_id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {note.is_pinned && (
                              <Pin className="w-4 h-4 text-amber-600" />
                            )}
                            <Badge variant="outline" className={getNoteCategoryColor(note.category)}>
                              {NOTE_CATEGORIES.find(c => c.value === note.category)?.label || note.category}
                            </Badge>
                          </div>
                          <h4 
                            className="font-semibold text-slate-900 text-lg"
                            style={{ fontFamily: 'Crimson Pro, serif' }}
                          >
                            {note.title}
                          </h4>
                          <p className="text-slate-600 mt-2 whitespace-pre-wrap leading-relaxed">
                            {note.content}
                          </p>
                          <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{note.author_name}</span>
                            </div>
                            <span>{formatDateTime(note.created_at)}</span>
                            {note.updated_at !== note.created_at && (
                              <span className="italic">(edited)</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePin(note.note_id)}
                            className="text-slate-600 hover:text-amber-600"
                            data-testid={`pin-note-${note.note_id}`}
                          >
                            {note.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditNote(note)}
                            className="text-slate-600 hover:text-blue-600"
                            data-testid={`edit-note-${note.note_id}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.note_id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            data-testid={`delete-note-${note.note_id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            {reports.length === 0 ? (
              <Card className="p-12 text-center">
                <Scale className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  No reports generated
                </h3>
                <p className="text-slate-600 mb-4">Generate AI-powered legal analysis reports for your case.</p>
                <Button 
                  onClick={() => setShowReportDialog(true)}
                  className="bg-amber-600 text-white hover:bg-amber-700"
                >
                  <Scale className="w-4 h-4 mr-2" />
                  Generate First Report
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {reports.map((report) => (
                  <Card 
                    key={report.report_id} 
                    className="card-hover group cursor-pointer"
                    onClick={() => navigate(`/cases/${caseId}/reports/${report.report_id}`)}
                    data-testid={`report-${report.report_id}`}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          report.report_type === 'quick_summary' ? 'bg-blue-100' :
                          report.report_type === 'full_detailed' ? 'bg-amber-100' :
                          'bg-slate-100'
                        }`}>
                          <Scale className={`w-6 h-6 ${
                            report.report_type === 'quick_summary' ? 'text-blue-600' :
                            report.report_type === 'full_detailed' ? 'text-amber-600' :
                            'text-slate-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{report.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={
                              report.report_type === 'quick_summary' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              report.report_type === 'full_detailed' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-slate-50 text-slate-700 border-slate-200'
                            }>
                              {report.report_type === 'quick_summary' ? 'Quick Summary' :
                               report.report_type === 'full_detailed' ? 'Full Analysis' :
                               'Extensive Log'}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              Generated {formatDate(report.generated_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReport(report.report_id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Upload Document Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Crimson Pro, serif' }} className="text-2xl">
              Upload Document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>File</Label>
              <div className="mt-2 border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  data-testid="file-input"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileUp className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  {uploadFile ? (
                    <p className="text-sm font-medium text-slate-900">{uploadFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-slate-900">Click to select file</p>
                      <p className="text-xs text-slate-500 mt-1">PDF, DOCX, TXT, or images</p>
                    </>
                  )}
                </label>
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger data-testid="category-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Brief description of the document..."
                rows={2}
                data-testid="doc-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUploadDocument}
              className="bg-slate-900 text-white hover:bg-slate-800"
              disabled={uploading}
              data-testid="upload-submit"
            >
              {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Crimson Pro, serif' }} className="text-2xl">
              Add Timeline Event
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Event Title *</Label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g., Initial arrest"
                data-testid="event-title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={newEvent.event_date}
                  onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                  data-testid="event-date"
                />
              </div>
              <div>
                <Label>Event Type</Label>
                <Select 
                  value={newEvent.event_type} 
                  onValueChange={(v) => setNewEvent({ ...newEvent, event_type: v })}
                >
                  <SelectTrigger data-testid="event-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Details about this event..."
                rows={3}
                data-testid="event-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateEvent}
              className="bg-slate-900 text-white hover:bg-slate-800"
              data-testid="event-submit"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={(open) => {
        setShowNoteDialog(open);
        if (!open) {
          setEditingNote(null);
          setNewNote({ title: "", content: "", category: "general" });
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Crimson Pro, serif' }} className="text-2xl">
              {editingNote ? "Edit Note" : "Add Note"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Category</Label>
              <Select 
                value={newNote.category} 
                onValueChange={(v) => setNewNote({ ...newNote, category: v })}
              >
                <SelectTrigger data-testid="note-category-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTE_CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Title *</Label>
              <Input
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Note title..."
                data-testid="note-title"
              />
            </div>
            <div>
              <Label>Content *</Label>
              <Textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Write your note, comment, or legal opinion..."
                rows={6}
                data-testid="note-content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={editingNote ? handleUpdateNote : handleCreateNote}
              className="bg-slate-900 text-white hover:bg-slate-800"
              data-testid="note-submit"
            >
              {editingNote ? (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Update Note
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Crimson Pro, serif' }} className="text-2xl">
              Generate Legal Analysis Report
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-start gap-3 mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">AI-Powered Analysis</p>
                <p className="mt-1">Reports are generated using AI analysis of your uploaded documents and timeline. 
                They reference NSW State and Australian Federal criminal law related to murder appeals.</p>
              </div>
            </div>

            <div className="grid gap-4">
              <Card 
                className="card-hover cursor-pointer border-2 hover:border-blue-400"
                onClick={() => !generatingReport && handleGenerateReport('quick_summary')}
                data-testid="quick-summary-option"
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Scale className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      Quick Summary
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Brief 2-3 paragraph overview of the case, key evidence, and primary appeal considerations.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="card-hover cursor-pointer border-2 hover:border-amber-400"
                onClick={() => !generatingReport && handleGenerateReport('full_detailed')}
                data-testid="full-detailed-option"
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Scale className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      Full Detailed Report
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Comprehensive analysis with grounds of merit, evidence assessment, specific law references, 
                      and strategic recommendations. Suitable for barrister presentation.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="card-hover cursor-pointer border-2 hover:border-slate-400"
                onClick={() => !generatingReport && handleGenerateReport('extensive_log')}
                data-testid="extensive-log-option"
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Scale className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      Extensive Log Report
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Exhaustive documentation covering every aspect: complete chronology, document-by-document 
                      analysis, all possible grounds, procedural review, and detailed legal framework.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {generatingReport && (
              <div className="mt-6 flex items-center justify-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
                <span className="text-slate-600">Generating report with AI analysis...</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseDetail;
