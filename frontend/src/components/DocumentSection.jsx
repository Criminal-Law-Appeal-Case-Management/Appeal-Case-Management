import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  FileText, Plus, Trash2, Upload, Loader2, 
  Search, X, ScanLine, HelpCircle, FileUp
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { API } from "../App";

const DOCUMENT_CATEGORIES = [
  { value: "brief", label: "Legal Brief" },
  { value: "case_note", label: "Case Note" },
  { value: "evidence", label: "Evidence" },
  { value: "court_document", label: "Court Document" },
  { value: "public_advertising", label: "Public Record" },
  { value: "other", label: "Other" }
];

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString('en-AU', { 
    day: 'numeric', month: 'short', year: 'numeric' 
  });
};

const getCategoryColor = (category) => {
  const colors = {
    brief: "bg-blue-100 text-blue-800 border-blue-200",
    case_note: "bg-green-100 text-green-800 border-green-200",
    evidence: "bg-purple-100 text-purple-800 border-purple-200",
    court_document: "bg-amber-100 text-amber-800 border-amber-200",
    public_advertising: "bg-slate-100 text-slate-800 border-slate-200",
    other: "bg-gray-100 text-gray-800 border-gray-200"
  };
  return colors[category] || colors.other;
};

export default function DocumentSection({ 
  caseId, 
  documents, 
  setDocuments,
  onRefresh 
}) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadCategory, setUploadCategory] = useState("other");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [extractingText, setExtractingText] = useState(false);
  const [runningOcr, setRunningOcr] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleUploadDocuments = async () => {
    if (uploadFiles.length === 0) {
      toast.error("Please select files to upload");
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
      if (uploadDescription) formData.append("description", uploadDescription);

      try {
        const response = await axios.post(`${API}/cases/${caseId}/documents`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000
        });
        uploadedDocs.push(response.data);
      } catch (error) {
        failedFiles.push(file.name);
      }
    }

    if (uploadedDocs.length > 0) {
      setDocuments([...uploadedDocs, ...documents]);
      toast.success(`Uploaded ${uploadedDocs.length} document${uploadedDocs.length > 1 ? 's' : ''}`);
    }

    if (failedFiles.length > 0) {
      toast.error(`Failed to upload: ${failedFiles.join(', ')}`);
    }

    setShowUploadDialog(false);
    setUploadFiles([]);
    setUploadCategory("other");
    setUploadDescription("");
    setUploading(false);
    setUploadProgress({ current: 0, total: 0 });
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
    setExtractingText(true);
    try {
      const response = await axios.post(`${API}/cases/${caseId}/extract-all-text`);
      const { successful_extractions, total_documents } = response.data;
      toast.success(`Extracted text from ${successful_extractions}/${total_documents} documents`);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to extract text");
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
    try {
      const response = await axios.post(`${API}/cases/${caseId}/ocr-all`, {}, {
        timeout: 300000
      });
      const { successful_extractions, total_documents } = response.data;
      toast.success(`OCR completed: ${successful_extractions}/${total_documents} documents processed`);
      if (onRefresh) onRefresh();
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        toast.info("OCR is taking longer than expected. Check back soon.");
      } else {
        toast.error("OCR processing failed");
      }
    } finally {
      setRunningOcr(false);
    }
  };

  const handleOcrDocument = async (docId) => {
    try {
      const response = await axios.post(`${API}/cases/${caseId}/documents/${docId}/ocr`, {}, {
        timeout: 120000
      });
      if (response.data.success) {
        toast.success(`Extracted ${response.data.content_length} characters`);
        if (onRefresh) onRefresh();
      } else {
        toast.warning(response.data.message || "No text could be extracted");
      }
    } catch (error) {
      toast.error("OCR failed for this document");
    }
  };

  const handleSearchDocuments = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await axios.post(`${API}/cases/${caseId}/documents/search`, {
        query: searchQuery.trim(),
        case_sensitive: false
      });
      setSearchResults(response.data);
      setShowSearchResults(true);
      if (response.data.total_matches === 0) {
        toast.info("No matches found");
      } else {
        toast.success(`Found ${response.data.total_matches} matches in ${response.data.documents_with_matches} documents`);
      }
    } catch (error) {
      toast.error("Search failed");
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

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowUploadDialog(true)}
            className="bg-slate-900 text-white hover:bg-slate-800"
            data-testid="upload-documents-btn"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Documents
          </Button>
          {documents.length > 0 && (
            <>
              <Button 
                variant="outline" 
                onClick={handleExtractAllText}
                disabled={extractingText}
                data-testid="extract-all-text-btn"
              >
                {extractingText ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileUp className="w-4 h-4 mr-2" />}
                Extract All Text
              </Button>
              <Button 
                variant="outline"
                onClick={handleRunOcrAll}
                disabled={runningOcr}
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                data-testid="ocr-all-btn"
              >
                {runningOcr ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ScanLine className="w-4 h-4 mr-2" />}
                OCR Scanned Docs
              </Button>
            </>
          )}
        </div>

        {/* Search */}
        {documents.length > 0 && (
          <form onSubmit={handleSearchDocuments} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
                data-testid="search-documents-input"
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
            <Button type="submit" variant="outline" disabled={searching || !searchQuery.trim()}>
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
            </Button>
          </form>
        )}
      </div>

      {/* Search Results */}
      {showSearchResults && searchResults && (
        <Card className="border-amber-200 bg-amber-50/50 mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">
                Search Results: "{searchResults.query}"
              </h4>
              <Button variant="ghost" size="sm" onClick={clearSearch}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Found {searchResults.total_matches} matches in {searchResults.documents_with_matches} of {searchResults.total_documents_searched} documents
            </p>
            <ScrollArea className="max-h-64">
              <div className="space-y-3">
                {searchResults.results.map((result) => (
                  <div key={result.document_id} className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-sm">{result.filename}</span>
                      <Badge variant="outline" className="text-xs">
                        {result.match_count} {result.match_count === 1 ? 'match' : 'matches'}
                      </Badge>
                    </div>
                    {result.matches.slice(0, 2).map((match, i) => (
                      <p key={i} className="text-xs text-slate-600 bg-slate-50 p-2 rounded mt-1 font-mono">
                        {highlightMatch(match.context, searchResults.query)}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Document List */}
      {documents.length === 0 ? (
        <Card className="p-12 text-center" data-testid="no-documents-message">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
            No documents uploaded
          </h3>
          <p className="text-slate-600 mb-4">Upload case briefs, evidence, and court documents to begin analysis.</p>
          <Button 
            onClick={() => setShowUploadDialog(true)}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload First Document
          </Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {documents.map((doc) => (
            <Card key={doc.document_id} className="card-hover group" data-testid={`document-${doc.document_id}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 truncate">{doc.filename}</h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="outline" className={getCategoryColor(doc.category)}>
                        {DOCUMENT_CATEGORIES.find(c => c.value === doc.category)?.label || doc.category}
                      </Badge>
                      {doc.content_text ? (
                        <>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {doc.content_text.length.toLocaleString()} chars
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

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Crimson Pro, serif' }}>Upload Documents</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Files</Label>
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.heic,image/*,application/pdf"
                onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
                className="mt-1"
                data-testid="file-input"
              />
              {uploadFiles.length > 0 && (
                <p className="text-sm text-slate-500 mt-1">
                  {uploadFiles.length} file{uploadFiles.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>
            <div>
              <Label>Category</Label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger className="mt-1" data-testid="category-select">
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
                placeholder="Brief description of the document(s)"
                className="mt-1"
                data-testid="description-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleUploadDocuments} 
              disabled={uploading || uploadFiles.length === 0}
              className="bg-slate-900 text-white hover:bg-slate-800"
              data-testid="upload-submit-btn"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading {uploadProgress.current}/{uploadProgress.total}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
