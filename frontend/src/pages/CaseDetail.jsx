import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { 
  Scale, ArrowLeft, FileText, Clock, Plus, Trash2, 
  Upload, Loader2, ChevronRight, FileUp, AlertCircle,
  MessageSquare, Pin, PinOff, Edit2, User, Sparkles, Gavel,
  Search, X, ScanLine, HelpCircle
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
import { ScrollArea } from "../components/ui/scroll-area";
import { API } from "../App";
import Timeline from "../components/TimelineEnhanced";
import TimelineAnalysis from "../components/TimelineAnalysis";
import GroundsOfMerit from "../components/GroundsOfMerit";

const DOCUMENT_CATEGORIES = [
  { value: "brief", label: "Legal Brief" },
  { value: "case_note", label: "Case Note" },
  { value: "evidence", label: "Evidence" },
  { value: "court_document", label: "Court Document" },
  { value: "public_advertising", label: "Public Record" },
  { value: "other", label: "Other" }
];

const EVENT_TYPES = [
  // Pre-trial
  { value: "arrest", label: "Arrest", category: "pre_trial" },
  { value: "charge", label: "Charge", category: "pre_trial" },
  { value: "bail_hearing", label: "Bail Hearing", category: "pre_trial" },
  { value: "committal", label: "Committal", category: "pre_trial" },
  { value: "indictment", label: "Indictment", category: "pre_trial" },
  // Trial
  { value: "jury_selection", label: "Jury Selection", category: "trial" },
  { value: "opening_statements", label: "Opening Statements", category: "trial" },
  { value: "witness_testimony", label: "Witness Testimony", category: "trial" },
  { value: "cross_examination", label: "Cross Examination", category: "trial" },
  { value: "closing_arguments", label: "Closing Arguments", category: "trial" },
  { value: "jury_deliberation", label: "Jury Deliberation", category: "trial" },
  { value: "verdict", label: "Verdict", category: "trial" },
  // Evidence
  { value: "evidence_discovery", label: "Evidence Discovery", category: "evidence" },
  { value: "forensic_report", label: "Forensic Report", category: "evidence" },
  { value: "expert_opinion", label: "Expert Opinion", category: "evidence" },
  { value: "disclosure", label: "Disclosure", category: "evidence" },
  // Post-conviction
  { value: "sentencing", label: "Sentencing", category: "post_conviction" },
  { value: "appeal_lodged", label: "Appeal Lodged", category: "post_conviction" },
  { value: "leave_application", label: "Leave Application", category: "post_conviction" },
  { value: "appeal_hearing", label: "Appeal Hearing", category: "post_conviction" },
  // Investigation
  { value: "police_interview", label: "Police Interview", category: "investigation" },
  { value: "erisp_recording", label: "ERISP Recording", category: "investigation" },
  { value: "crime_scene", label: "Crime Scene", category: "investigation" },
  { value: "search_warrant", label: "Search Warrant", category: "investigation" },
  // General
  { value: "court_hearing", label: "Court Hearing", category: "general" },
  { value: "other", label: "Other Event", category: "general" }
];

const EVENT_CATEGORIES = [
  { value: "pre_trial", label: "Pre-Trial" },
  { value: "trial", label: "Trial" },
  { value: "evidence", label: "Evidence" },
  { value: "post_conviction", label: "Post-Conviction" },
  { value: "investigation", label: "Investigation" },
  { value: "general", label: "General" }
];

const SIGNIFICANCE_LEVELS = [
  { value: "critical", label: "Critical - Key to appeal" },
  { value: "important", label: "Important - Significant event" },
  { value: "normal", label: "Normal - Standard event" },
  { value: "minor", label: "Minor - Background context" }
];

const PERSPECTIVES = [
  { value: "neutral", label: "Neutral" },
  { value: "prosecution", label: "Favors Prosecution" },
  { value: "defence", label: "Favors Defence" }
];

const NOTE_CATEGORIES = [
  { value: "general", label: "General Note" },
  { value: "legal_opinion", label: "Legal Opinion" },
  { value: "evidence_note", label: "Evidence Note" },
  { value: "strategy", label: "Strategy" },
  { value: "question", label: "Question" },
  { value: "action_item", label: "Action Item" }
];

const GROUND_TYPES = [
  { value: "procedural_error", label: "Procedural Error" },
  { value: "fresh_evidence", label: "Fresh Evidence" },
  { value: "miscarriage_of_justice", label: "Miscarriage of Justice" },
  { value: "sentencing_error", label: "Sentencing Error" },
  { value: "judicial_error", label: "Judicial Error" },
  { value: "ineffective_counsel", label: "Ineffective Counsel" },
  { value: "prosecution_misconduct", label: "Prosecution Misconduct" },
  { value: "jury_irregularity", label: "Jury Irregularity" },
  { value: "constitutional_violation", label: "Constitutional Violation" },
  { value: "other", label: "Other Ground" }
];

const CaseDetail = ({ user }) => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [reports, setReports] = useState([]);
  const [notes, setNotes] = useState([]);
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activeTab, setActiveTab] = useState("documents");

  // Dialog states
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showGroundDialog, setShowGroundDialog] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [investigatingGround, setInvestigatingGround] = useState(null);
  const [autoIdentifying, setAutoIdentifying] = useState(false);
  const [selectedGround, setSelectedGround] = useState(null);
  const [extractingText, setExtractingText] = useState(false);
  const [runningOcr, setRunningOcr] = useState(false);
  const [generatingTimeline, setGeneratingTimeline] = useState(false);
  const [analyzingTimeline, setAnalyzingTimeline] = useState(false);
  const [timelineAnalysis, setTimelineAnalysis] = useState(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Form states
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadCategory, setUploadCategory] = useState("other");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_date: "",
    event_type: "other",
    event_category: "general",
    significance: "normal",
    perspective: "neutral",
    source_citation: "",
    is_contested: false,
    contested_details: "",
    linked_documents: [],
    participants: [],
    related_grounds: [],
    inconsistency_notes: ""
  });

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "general"
  });

  const [newGround, setNewGround] = useState({
    title: "",
    description: "",
    ground_type: "other",
    strength: "moderate",
    supporting_evidence: []
  });

  useEffect(() => {
    fetchCaseData();
  }, [caseId]);

  const fetchCaseData = async () => {
    setLoadError(null);
    setLoading(true);
    try {
      // Fetch case data first to verify access
      const caseRes = await axios.get(`${API}/cases/${caseId}`);
      setCaseData(caseRes.data);
      
      // Then fetch related data - use Promise.allSettled for resilience
      const [docsRes, timelineRes, reportsRes, notesRes, groundsRes] = await Promise.allSettled([
        axios.get(`${API}/cases/${caseId}/documents`),
        axios.get(`${API}/cases/${caseId}/timeline`),
        axios.get(`${API}/cases/${caseId}/reports`),
        axios.get(`${API}/cases/${caseId}/notes`),
        axios.get(`${API}/cases/${caseId}/grounds`)
      ]);
      
      // Set data from successful responses, empty arrays for failed ones
      setDocuments(docsRes.status === 'fulfilled' ? docsRes.value.data : []);
      setTimeline(timelineRes.status === 'fulfilled' ? timelineRes.value.data : []);
      setReports(reportsRes.status === 'fulfilled' ? reportsRes.value.data : []);
      setNotes(notesRes.status === 'fulfilled' ? notesRes.value.data : []);
      setGrounds(groundsRes.status === 'fulfilled' ? groundsRes.value.data : []);
      
    } catch (error) {
      console.error("Failed to load case:", error);
      if (error.response?.status === 401) {
        setLoadError("Session expired. Please log in again.");
        setTimeout(() => navigate("/"), 2000);
      } else if (error.response?.status === 404) {
        setLoadError("Case not found");
      } else if (error.code === 'ECONNABORTED') {
        setLoadError("Request timed out. Please try again.");
      } else {
        setLoadError("Failed to load case data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocuments = async () => {
    if (uploadFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: uploadFiles.length });
    
    const uploadedDocs = [];
    const failedFiles = [];

    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      setUploadProgress({ current: i + 1, total: uploadFiles.length });
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", uploadCategory);
      formData.append("description", uploadDescription);

      try {
        const response = await axios.post(`${API}/cases/${caseId}/documents`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        uploadedDocs.push(response.data);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        failedFiles.push(file.name);
      }
    }

    if (uploadedDocs.length > 0) {
      setDocuments([...uploadedDocs, ...documents]);
    }

    setShowUploadDialog(false);
    setUploadFiles([]);
    setUploadCategory("other");
    setUploadDescription("");
    setUploadProgress({ current: 0, total: 0 });

    if (failedFiles.length === 0) {
      toast.success(`Successfully uploaded ${uploadedDocs.length} document${uploadedDocs.length > 1 ? 's' : ''}`);
    } else if (uploadedDocs.length > 0) {
      toast.warning(`Uploaded ${uploadedDocs.length} files. Failed: ${failedFiles.join(', ')}`);
    } else {
      toast.error("Failed to upload documents");
    }

    setUploading(false);
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

  const handleExtractAllText = async () => {
    if (documents.length === 0) {
      toast.error("No documents to extract text from");
      return;
    }
    
    setExtractingText(true);
    try {
      const response = await axios.post(`${API}/cases/${caseId}/extract-all-text`);
      const { successful_extractions, total_documents, results } = response.data;
      
      // Refresh documents to get updated content_text
      const docsRes = await axios.get(`${API}/cases/${caseId}/documents`);
      setDocuments(docsRes.data);
      
      toast.success(`Extracted text from ${successful_extractions}/${total_documents} documents`);
    } catch (error) {
      toast.error("Failed to extract text from documents");
    } finally {
      setExtractingText(false);
    }
  };

  const handleRunOcrAll = async () => {
    const docsWithoutText = documents.filter(d => !d.content_text || d.content_text.length < 100);
    if (docsWithoutText.length === 0) {
      toast.info("All documents already have extracted text");
      return;
    }
    
    setRunningOcr(true);
    toast.info(`Running OCR on ${docsWithoutText.length} document(s)... This may take a while.`);
    
    try {
      const response = await axios.post(`${API}/cases/${caseId}/ocr-all`, {}, {
        timeout: 300000 // 5 minute timeout for OCR
      });
      const { successful_extractions, total_documents, results } = response.data;
      
      // Refresh documents to get updated content_text
      const docsRes = await axios.get(`${API}/cases/${caseId}/documents`);
      setDocuments(docsRes.data);
      
      if (successful_extractions > 0) {
        toast.success(`OCR complete! Extracted text from ${successful_extractions} document(s)`);
      } else {
        toast.info("OCR complete. No additional text could be extracted.");
      }
    } catch (error) {
      console.error("OCR error:", error);
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error("OCR timed out. Try running OCR on individual documents.");
      } else {
        toast.error("Failed to run OCR on documents");
      }
    } finally {
      setRunningOcr(false);
    }
  };

  const handleOcrDocument = async (docId) => {
    toast.info("Running OCR... This may take a moment.");
    
    try {
      const response = await axios.post(`${API}/cases/${caseId}/documents/${docId}/ocr`, {}, {
        timeout: 120000 // 2 minute timeout
      });
      
      if (response.data.success) {
        // Refresh documents
        const docsRes = await axios.get(`${API}/cases/${caseId}/documents`);
        setDocuments(docsRes.data);
        toast.success(`OCR complete! Extracted ${response.data.content_length} characters`);
      } else {
        toast.warning(response.data.message || "Could not extract text from this document");
      }
    } catch (error) {
      console.error("OCR error:", error);
      toast.error("Failed to run OCR on document");
    }
  };

  const handleSearchDocuments = async (e) => {
    e?.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    if (searchQuery.trim().length < 2) {
      toast.error("Search term must be at least 2 characters");
      return;
    }
    
    setSearching(true);
    try {
      const response = await axios.post(`${API}/cases/${caseId}/documents/search`, {
        query: searchQuery.trim(),
        case_sensitive: false
      });
      setSearchResults(response.data);
      setShowSearchResults(true);
      
      if (response.data.total_matches === 0) {
        toast.info("No matches found in documents");
      } else {
        toast.success(`Found ${response.data.total_matches} matches in ${response.data.documents_with_matches} documents`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search documents");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setShowSearchResults(false);
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="bg-amber-200 px-0.5 rounded">{part}</mark>
        : part
    );
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
      setNewEvent({ 
        title: "", 
        description: "", 
        event_date: "", 
        event_type: "other",
        event_category: "general",
        significance: "normal",
        perspective: "neutral",
        source_citation: "",
        is_contested: false,
        contested_details: "",
        linked_documents: [],
        participants: [],
        related_grounds: [],
        inconsistency_notes: ""
      });
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

  const handleGenerateTimeline = async () => {
    if (documents.filter(d => d.content_text).length === 0) {
      toast.error("No documents with extracted text. Please upload documents and extract text first.");
      return;
    }
    
    setGeneratingTimeline(true);
    toast.info("Analyzing documents to generate timeline... This may take 30-60 seconds.");
    
    try {
      const response = await axios.post(`${API}/cases/${caseId}/timeline/auto-generate`, {}, {
        timeout: 180000 // 3 minute timeout
      });
      
      // Refresh timeline
      const timelineRes = await axios.get(`${API}/cases/${caseId}/timeline`);
      setTimeline(timelineRes.data);
      
      toast.success(`Generated ${response.data.events_created} timeline events from documents!`);
    } catch (error) {
      console.error("Timeline generation error:", error);
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error("Timeline generation timed out. Please try again.");
      } else if (error.response?.data?.detail) {
        toast.error(`Failed: ${error.response.data.detail}`);
      } else {
        toast.error("Failed to generate timeline. Please try again.");
      }
    } finally {
      setGeneratingTimeline(false);
    }
  };

  const handleAnalyzeTimeline = async () => {
    if (timeline.length < 2) {
      toast.error("Need at least 2 timeline events for analysis");
      return;
    }
    
    setAnalyzingTimeline(true);
    toast.info("Analyzing timeline for gaps, inconsistencies, and insights...");
    
    try {
      const response = await axios.post(`${API}/cases/${caseId}/timeline/analyze`, {}, {
        timeout: 120000
      });
      setTimelineAnalysis(response.data.analysis);
      toast.success("Timeline analysis complete!");
    } catch (error) {
      console.error("Timeline analysis error:", error);
      toast.error("Failed to analyze timeline. Please try again.");
    } finally {
      setAnalyzingTimeline(false);
    }
  };

  const handleExportTimelinePDF = async () => {
    try {
      const response = await axios.get(`${API}/cases/${caseId}/timeline/export-pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `timeline_${caseData?.title?.replace(/\s+/g, '_') || 'case'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Timeline PDF exported!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export timeline PDF");
    }
  };

  const handleGenerateReport = async (reportType) => {
    setGeneratingReport(true);
    toast.info("Generating report... This may take 30-60 seconds.");
    try {
      const response = await axios.post(`${API}/cases/${caseId}/reports/generate`, {
        report_type: reportType
      }, {
        timeout: 180000 // 3 minute timeout for report generation
      });
      setReports([response.data, ...reports]);
      setShowReportDialog(false);
      toast.success("Report generated successfully!");
      navigate(`/cases/${caseId}/reports/${response.data.report_id}`);
    } catch (error) {
      console.error("Report generation error:", error);
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error("Report generation timed out. Please try again.");
      } else if (error.response?.data?.detail) {
        toast.error(`Failed: ${error.response.data.detail}`);
      } else {
        toast.error("Failed to generate report. Please try again.");
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

  // Grounds of Merit handlers
  const handleCreateGround = async () => {
    if (!newGround.title || !newGround.description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      const response = await axios.post(`${API}/cases/${caseId}/grounds`, newGround);
      setGrounds([response.data, ...grounds]);
      setShowGroundDialog(false);
      setNewGround({ title: "", description: "", ground_type: "other", strength: "moderate", supporting_evidence: [] });
      toast.success("Ground of merit added");
    } catch (error) {
      toast.error("Failed to add ground of merit");
    }
  };

  const handleInvestigateGround = async (groundId) => {
    setInvestigatingGround(groundId);
    try {
      const response = await axios.post(`${API}/cases/${caseId}/grounds/${groundId}/investigate`, {}, {
        timeout: 120000 // 2 minute timeout for AI analysis
      });
      setGrounds(grounds.map(g => g.ground_id === groundId ? response.data : g));
      toast.success("Deep investigation complete!");
    } catch (error) {
      console.error("Investigate error:", error);
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error("Investigation is taking too long. Please try again.");
      } else {
        toast.error("Failed to investigate ground. Please try again.");
      }
    } finally {
      setInvestigatingGround(null);
    }
  };

  const handleDeleteGround = async (groundId) => {
    if (!window.confirm("Delete this ground of merit?")) return;
    
    try {
      await axios.delete(`${API}/cases/${caseId}/grounds/${groundId}`);
      setGrounds(grounds.filter(g => g.ground_id !== groundId));
      toast.success("Ground of merit deleted");
    } catch (error) {
      toast.error("Failed to delete ground");
    }
  };

  const handleAutoIdentifyGrounds = async () => {
    setAutoIdentifying(true);
    try {
      const response = await axios.post(`${API}/cases/${caseId}/grounds/auto-identify`, {}, {
        timeout: 120000 // 2 minute timeout for AI analysis
      });
      if (response.data.grounds && response.data.grounds.length > 0) {
        setGrounds([...response.data.grounds, ...grounds]);
        toast.success(`Identified ${response.data.identified_count} potential ground(s) of merit!`);
      } else {
        toast.info("No new grounds identified. Try adding more case documents.");
      }
    } catch (error) {
      console.error("Auto-identify error:", error);
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error("Analysis is taking too long. Please try again.");
      } else {
        toast.error("Failed to auto-identify grounds. Please try again.");
      }
    } finally {
      setAutoIdentifying(false);
    }
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

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Error Loading Case</h2>
          <p className="mt-2 text-slate-600">{loadError}</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
              data-testid="back-to-dashboard-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button 
              onClick={fetchCaseData}
              data-testid="retry-load-btn"
            >
              Try Again
            </Button>
          </div>
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
            <div className="flex items-center gap-2 flex-1">
              <Scale className="w-5 h-5 text-slate-600" />
              <span className="text-slate-400">/</span>
              <span className="font-medium text-slate-900">{caseData?.title}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/help")}
              className="text-slate-600 hover:text-slate-900"
              data-testid="help-btn"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              Help
            </Button>
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
              <TabsTrigger value="grounds" data-testid="tab-grounds">
                <Gavel className="w-4 h-4 mr-2" />
                Grounds ({grounds.length})
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
                <>
                  {documents.length > 0 && (
                    <>
                      <Button 
                        onClick={handleExtractAllText}
                        disabled={extractingText || runningOcr}
                        variant="outline"
                        data-testid="extract-text-btn"
                      >
                        {extractingText ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4 mr-2" />
                        )}
                        Extract Text
                      </Button>
                      <Button 
                        onClick={handleRunOcrAll}
                        disabled={runningOcr || extractingText}
                        variant="outline"
                        className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                        data-testid="ocr-all-btn"
                      >
                        {runningOcr ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <ScanLine className="w-4 h-4 mr-2" />
                        )}
                        OCR Scan
                      </Button>
                    </>
                  )}
                  <Button 
                    onClick={() => setShowUploadDialog(true)}
                    className="bg-slate-900 text-white hover:bg-slate-800"
                    data-testid="upload-doc-btn"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </>
              )}
              {activeTab === "timeline" && (
                <>
                  <Button 
                    onClick={handleGenerateTimeline}
                    disabled={generatingTimeline}
                    variant="outline"
                    className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                    data-testid="generate-timeline-btn"
                  >
                    {generatingTimeline ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    AI Generate Timeline
                  </Button>
                  <Button 
                    onClick={() => setShowEventDialog(true)}
                    className="bg-slate-900 text-white hover:bg-slate-800"
                    data-testid="add-event-btn"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </>
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
              {activeTab === "grounds" && (
                <>
                  <Button 
                    onClick={handleAutoIdentifyGrounds}
                    disabled={autoIdentifying}
                    className="bg-amber-600 text-white hover:bg-amber-700"
                    data-testid="auto-identify-btn"
                  >
                    {autoIdentifying ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    AI Identify Grounds
                  </Button>
                  <Button 
                    onClick={() => {
                      setNewGround({ title: "", description: "", ground_type: "other", strength: "moderate", supporting_evidence: [] });
                      setShowGroundDialog(true);
                    }}
                    className="bg-slate-900 text-white hover:bg-slate-800"
                    data-testid="add-ground-btn"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Ground
                  </Button>
                </>
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
            {/* Search Bar */}
            {documents.length > 0 && (
              <Card className="p-4">
                <form onSubmit={handleSearchDocuments} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search within all documents..."
                      className="pl-10 pr-10"
                      data-testid="doc-search-input"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    disabled={searching || !searchQuery.trim()}
                    className="bg-slate-900 text-white hover:bg-slate-800"
                    data-testid="doc-search-btn"
                  >
                    {searching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </form>
                
                {/* Search Results */}
                {showSearchResults && searchResults && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">
                        Search Results for "{searchResults.query}"
                      </h4>
                      <span className="text-sm text-slate-500">
                        {searchResults.total_matches} match{searchResults.total_matches !== 1 ? 'es' : ''} in {searchResults.documents_with_matches} document{searchResults.documents_with_matches !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {searchResults.results.length === 0 ? (
                      <p className="text-slate-600 text-center py-4">No matches found in any documents.</p>
                    ) : (
                      <ScrollArea className="max-h-80">
                        <div className="space-y-3">
                          {searchResults.results.map((result) => (
                            <div key={result.document_id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-slate-600" />
                                <span className="font-medium text-slate-900">{result.filename}</span>
                                <Badge variant="outline" className={getCategoryColor(result.category)}>
                                  {DOCUMENT_CATEGORIES.find(c => c.value === result.category)?.label || result.category}
                                </Badge>
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                  {result.match_count} match{result.match_count !== 1 ? 'es' : ''}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                {result.matches.slice(0, 3).map((match, idx) => (
                                  <div key={idx} className="text-sm text-slate-700 bg-white p-2 rounded border border-slate-100">
                                    <p className="line-clamp-2">
                                      {highlightMatch(match.context, searchResults.query)}
                                    </p>
                                  </div>
                                ))}
                                {result.matches.length > 3 && (
                                  <p className="text-xs text-slate-500">
                                    +{result.matches.length - 3} more matches in this document
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                )}
              </Card>
            )}
            
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
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${doc.content_text ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                          <FileText className={`w-6 h-6 ${doc.content_text ? 'text-emerald-600' : 'text-slate-600'}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{doc.filename}</h4>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className={getCategoryColor(doc.category)}>
                              {DOCUMENT_CATEGORIES.find(c => c.value === doc.category)?.label || doc.category}
                            </Badge>
                            {doc.content_text ? (
                              <>
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                  Text Extracted ({Math.round(doc.content_text.length / 1000)}k chars)
                                </Badge>
                                {doc.ocr_extracted && (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                    <ScanLine className="w-3 h-3 mr-1" />
                                    OCR
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                No Text
                              </Badge>
                            )}
                            <span className="text-xs text-slate-500">
                              Uploaded {formatDate(doc.uploaded_at)}
                            </span>
                          </div>
                          {doc.description && (
                            <p className="text-sm text-slate-600 mt-1">{doc.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!doc.content_text && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOcrDocument(doc.document_id)}
                            className="text-purple-700 border-purple-200 hover:bg-purple-50"
                            data-testid={`ocr-doc-${doc.document_id}`}
                          >
                            <ScanLine className="w-4 h-4 mr-1" />
                            OCR
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.document_id)}
                          className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`delete-doc-${doc.document_id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
              <div className="space-y-4">
                {timelineAnalysis && (
                  <TimelineAnalysis 
                    analysis={timelineAnalysis} 
                    onClose={() => setTimelineAnalysis(null)} 
                  />
                )}
                <Timeline 
                  events={timeline} 
                  documents={documents}
                  grounds={grounds}
                  onDeleteEvent={handleDeleteEvent}
                  onExportPDF={handleExportTimelinePDF}
                  onAnalyze={handleAnalyzeTimeline}
                  analyzing={analyzingTimeline}
                />
              </div>
            )}
          </TabsContent>

          {/* Grounds of Merit Tab */}
          <TabsContent value="grounds" className="space-y-4">
            {grounds.length === 0 ? (
              <Card className="p-12 text-center">
                <Gavel className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  No grounds of merit identified
                </h3>
                <p className="text-slate-600 mb-4 max-w-md mx-auto">
                  Use AI to automatically analyze your case materials and identify potential grounds for appeal, 
                  or add grounds manually.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={handleAutoIdentifyGrounds}
                    disabled={autoIdentifying}
                    className="bg-amber-600 text-white hover:bg-amber-700"
                  >
                    {autoIdentifying ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    AI Identify Grounds
                  </Button>
                  <Button 
                    onClick={() => {
                      setNewGround({ title: "", description: "", ground_type: "other", strength: "moderate", supporting_evidence: [] });
                      setShowGroundDialog(true);
                    }}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Manually
                  </Button>
                </div>
              </Card>
            ) : (
              <GroundsOfMerit 
                grounds={grounds}
                onInvestigate={handleInvestigateGround}
                onDelete={handleDeleteGround}
                investigating={investigatingGround}
                selectedGround={selectedGround}
                setSelectedGround={setSelectedGround}
              />
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
      <Dialog open={showUploadDialog} onOpenChange={(open) => {
        setShowUploadDialog(open);
        if (!open) {
          setUploadFiles([]);
          setUploadCategory("other");
          setUploadDescription("");
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Crimson Pro, serif' }} className="text-2xl">
              Upload Documents
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Files (select multiple)</Label>
              <div className="mt-2 border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <input
                  type="file"
                  onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  multiple
                  data-testid="file-input"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileUp className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  {uploadFiles.length > 0 ? (
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {uploadFiles.length} file{uploadFiles.length > 1 ? 's' : ''} selected
                      </p>
                      <div className="mt-2 max-h-24 overflow-y-auto text-xs text-slate-600">
                        {uploadFiles.map((f, i) => (
                          <div key={i} className="truncate">{f.name}</div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-slate-900">Click to select files</p>
                      <p className="text-xs text-slate-500 mt-1">PDF, DOCX, TXT, or images • Select multiple files</p>
                    </>
                  )}
                </label>
              </div>
            </div>
            <div>
              <Label>Category (applies to all files)</Label>
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
              <Label>Description (optional, applies to all)</Label>
              <Textarea
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Brief description of the documents..."
                rows={2}
                data-testid="doc-description"
              />
            </div>
            {uploading && uploadProgress.total > 0 && (
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600">Uploading...</span>
                  <span className="font-medium">{uploadProgress.current} / {uploadProgress.total}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-slate-900 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUploadDocuments}
              className="bg-slate-900 text-white hover:bg-slate-800"
              disabled={uploading || uploadFiles.length === 0}
              data-testid="upload-submit"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading {uploadProgress.current}/{uploadProgress.total}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload {uploadFiles.length > 0 ? `${uploadFiles.length} File${uploadFiles.length > 1 ? 's' : ''}` : ''}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Crimson Pro, serif' }} className="text-2xl">
              Add Timeline Event
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Basic Info */}
            <div>
              <Label>Event Title *</Label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g., Police interview with accused"
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
                <Label>Category</Label>
                <Select 
                  value={newEvent.event_category} 
                  onValueChange={(v) => {
                    setNewEvent({ ...newEvent, event_category: v });
                  }}
                >
                  <SelectTrigger data-testid="event-category-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event Type</Label>
                <Select 
                  value={newEvent.event_type} 
                  onValueChange={(v) => {
                    const eventType = EVENT_TYPES.find(t => t.value === v);
                    setNewEvent({ 
                      ...newEvent, 
                      event_type: v,
                      event_category: eventType?.category || newEvent.event_category
                    });
                  }}
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
              <div>
                <Label>Significance</Label>
                <Select 
                  value={newEvent.significance} 
                  onValueChange={(v) => setNewEvent({ ...newEvent, significance: v })}
                >
                  <SelectTrigger data-testid="event-significance-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SIGNIFICANCE_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
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
                placeholder="Detailed description of this event..."
                rows={3}
                data-testid="event-description"
              />
            </div>

            {/* Source & Perspective */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Source Citation</Label>
                <Input
                  value={newEvent.source_citation}
                  onChange={(e) => setNewEvent({ ...newEvent, source_citation: e.target.value })}
                  placeholder="e.g., Exhibit A, page 23"
                  data-testid="event-source"
                />
              </div>
              <div>
                <Label>Perspective</Label>
                <Select 
                  value={newEvent.perspective} 
                  onValueChange={(v) => setNewEvent({ ...newEvent, perspective: v })}
                >
                  <SelectTrigger data-testid="event-perspective-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PERSPECTIVES.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Link Documents */}
            {documents.length > 0 && (
              <div>
                <Label>Link to Documents</Label>
                <div className="flex flex-wrap gap-2 mt-2 p-3 bg-slate-50 rounded-lg max-h-32 overflow-y-auto">
                  {documents.map(doc => (
                    <label 
                      key={doc.document_id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
                        newEvent.linked_documents.includes(doc.document_id)
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={newEvent.linked_documents.includes(doc.document_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewEvent({ 
                              ...newEvent, 
                              linked_documents: [...newEvent.linked_documents, doc.document_id] 
                            });
                          } else {
                            setNewEvent({ 
                              ...newEvent, 
                              linked_documents: newEvent.linked_documents.filter(id => id !== doc.document_id) 
                            });
                          }
                        }}
                      />
                      <FileText className="w-3 h-3" />
                      {doc.filename.length > 25 ? doc.filename.substring(0, 25) + '...' : doc.filename}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Link Grounds */}
            {grounds.length > 0 && (
              <div>
                <Label>Link to Grounds of Appeal</Label>
                <div className="flex flex-wrap gap-2 mt-2 p-3 bg-slate-50 rounded-lg max-h-32 overflow-y-auto">
                  {grounds.map(ground => (
                    <label 
                      key={ground.ground_id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
                        newEvent.related_grounds.includes(ground.ground_id)
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={newEvent.related_grounds.includes(ground.ground_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewEvent({ 
                              ...newEvent, 
                              related_grounds: [...newEvent.related_grounds, ground.ground_id] 
                            });
                          } else {
                            setNewEvent({ 
                              ...newEvent, 
                              related_grounds: newEvent.related_grounds.filter(id => id !== ground.ground_id) 
                            });
                          }
                        }}
                      />
                      <Scale className="w-3 h-3" />
                      {ground.title.length > 30 ? ground.title.substring(0, 30) + '...' : ground.title}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Contested Fact */}
            <div className="border border-amber-200 rounded-lg p-4 bg-amber-50/50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newEvent.is_contested}
                  onChange={(e) => setNewEvent({ ...newEvent, is_contested: e.target.checked })}
                  className="w-4 h-4 rounded border-amber-300"
                />
                <span className="font-medium text-amber-800">This is a contested fact</span>
              </label>
              {newEvent.is_contested && (
                <div className="mt-3">
                  <Label className="text-amber-700">What is contested?</Label>
                  <Textarea
                    value={newEvent.contested_details}
                    onChange={(e) => setNewEvent({ ...newEvent, contested_details: e.target.value })}
                    placeholder="Explain what is disputed about this event..."
                    rows={2}
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            {/* Inconsistency Notes */}
            <div>
              <Label>Inconsistency Notes (optional)</Label>
              <Textarea
                value={newEvent.inconsistency_notes}
                onChange={(e) => setNewEvent({ ...newEvent, inconsistency_notes: e.target.value })}
                placeholder="Note any inconsistencies with other evidence or testimony..."
                rows={2}
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
                className={`card-hover cursor-pointer border-2 transition-all ${generatingReport ? 'opacity-50 pointer-events-none' : 'hover:border-blue-400 hover:shadow-md'}`}
                onClick={() => {
                  if (!generatingReport) {
                    handleGenerateReport('quick_summary');
                  }
                }}
                data-testid="quick-summary-option"
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Scale className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      Quick Summary
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Brief 2-3 paragraph overview of the case, key evidence, and primary appeal considerations.
                    </p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Generate
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className={`card-hover cursor-pointer border-2 transition-all ${generatingReport ? 'opacity-50 pointer-events-none' : 'hover:border-amber-400 hover:shadow-md'}`}
                onClick={() => {
                  if (!generatingReport) {
                    handleGenerateReport('full_detailed');
                  }
                }}
                data-testid="full-detailed-option"
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Scale className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      Full Detailed Report
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Comprehensive analysis with grounds of merit, evidence assessment, specific law references, 
                      and strategic recommendations. Suitable for barrister presentation.
                    </p>
                  </div>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    Generate
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className={`card-hover cursor-pointer border-2 transition-all ${generatingReport ? 'opacity-50 pointer-events-none' : 'hover:border-slate-400 hover:shadow-md'}`}
                onClick={() => {
                  if (!generatingReport) {
                    handleGenerateReport('extensive_log');
                  }
                }}
                data-testid="extensive-log-option"
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Scale className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      Extensive Log Report
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Exhaustive documentation covering every aspect: complete chronology, document-by-document 
                      analysis, all possible grounds, procedural review, and detailed legal framework.
                    </p>
                  </div>
                  <Button size="sm" className="bg-slate-700 hover:bg-slate-800 text-white">
                    Generate
                  </Button>
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

      {/* Add Ground of Merit Dialog */}
      <Dialog open={showGroundDialog} onOpenChange={setShowGroundDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Crimson Pro, serif' }} className="text-2xl">
              Add Ground of Merit
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Ground Type</Label>
              <Select 
                value={newGround.ground_type} 
                onValueChange={(v) => setNewGround({ ...newGround, ground_type: v })}
              >
                <SelectTrigger data-testid="ground-type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GROUND_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Title *</Label>
              <Input
                value={newGround.title}
                onChange={(e) => setNewGround({ ...newGround, title: e.target.value })}
                placeholder="e.g., Inadequate Legal Representation at Trial"
                data-testid="ground-title"
              />
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={newGround.description}
                onChange={(e) => setNewGround({ ...newGround, description: e.target.value })}
                placeholder="Describe the ground of merit in detail..."
                rows={4}
                data-testid="ground-description"
              />
            </div>
            <div>
              <Label>Strength Assessment</Label>
              <Select 
                value={newGround.strength} 
                onValueChange={(v) => setNewGround({ ...newGround, strength: v })}
              >
                <SelectTrigger data-testid="ground-strength-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strong">Strong</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="weak">Weak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Supporting Evidence (comma-separated)</Label>
              <Input
                value={newGround.supporting_evidence.join(", ")}
                onChange={(e) => setNewGround({ 
                  ...newGround, 
                  supporting_evidence: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                })}
                placeholder="e.g., Trial transcript pg 45, Witness statement from John"
                data-testid="ground-evidence"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGroundDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateGround}
              className="bg-slate-900 text-white hover:bg-slate-800"
              data-testid="ground-submit"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Ground
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseDetail;
