import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  MessageSquare, Pin, PinOff, Edit2, User, Plus, Trash2
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
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { API } from "../App";

const NOTE_CATEGORIES = [
  { value: "general", label: "General Note" },
  { value: "legal_opinion", label: "Legal Opinion" },
  { value: "evidence_note", label: "Evidence Note" },
  { value: "strategy", label: "Strategy" },
  { value: "question", label: "Question" },
  { value: "action_item", label: "Action Item" }
];

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString('en-AU', { 
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const getNoteCategoryColor = (category) => {
  const colors = {
    general: "bg-slate-100 text-slate-800 border-slate-200",
    legal_opinion: "bg-blue-100 text-blue-800 border-blue-200",
    evidence_note: "bg-purple-100 text-purple-800 border-purple-200",
    strategy: "bg-green-100 text-green-800 border-green-200",
    question: "bg-amber-100 text-amber-800 border-amber-200",
    action_item: "bg-red-100 text-red-800 border-red-200"
  };
  return colors[category] || colors.general;
};

export default function NotesSection({ 
  caseId, 
  notes, 
  setNotes,
  onRefresh 
}) {
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "general"
  });

  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingNote) {
        await axios.put(`${API}/cases/${caseId}/notes/${editingNote.note_id}`, newNote);
        toast.success("Note updated");
      } else {
        const response = await axios.post(`${API}/cases/${caseId}/notes`, newNote);
        setNotes([response.data, ...notes]);
        toast.success("Note created");
      }
      setShowNoteDialog(false);
      setEditingNote(null);
      setNewNote({ title: "", content: "", category: "general" });
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error(editingNote ? "Failed to update note" : "Failed to create note");
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
      await axios.patch(`${API}/cases/${caseId}/notes/${noteId}/pin`);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to toggle pin");
    }
  };

  const openEditDialog = (note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category
    });
    setShowNoteDialog(true);
  };

  const openNewNoteDialog = () => {
    setEditingNote(null);
    setNewNote({ title: "", content: "", category: "general" });
    setShowNoteDialog(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button 
          onClick={openNewNoteDialog}
          className="bg-slate-900 text-white hover:bg-slate-800"
          data-testid="add-note-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <Card className="p-12 text-center" data-testid="no-notes-message">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
            No notes yet
          </h3>
          <p className="text-slate-600 mb-4">Add notes, comments, and legal opinions to the case.</p>
          <Button 
            onClick={openNewNoteDialog}
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
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      data-testid={`pin-note-${note.note_id}`}
                    >
                      {note.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(note)}
                      className="text-slate-600 hover:text-slate-700 hover:bg-slate-50"
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

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
              {editingNote ? 'Edit Note' : 'Add Note'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category</Label>
              <Select 
                value={newNote.category} 
                onValueChange={(value) => setNewNote({...newNote, category: value})}
              >
                <SelectTrigger className="mt-1" data-testid="note-category-select">
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
              <Label>Title</Label>
              <Input
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                placeholder="Note title"
                className="mt-1"
                data-testid="note-title-input"
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                placeholder="Write your note here..."
                rows={6}
                className="mt-1"
                data-testid="note-content-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateNote}
              className="bg-slate-900 text-white hover:bg-slate-800"
              data-testid="save-note-btn"
            >
              {editingNote ? 'Save Changes' : 'Add Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
