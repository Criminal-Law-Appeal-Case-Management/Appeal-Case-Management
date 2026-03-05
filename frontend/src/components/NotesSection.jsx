import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  MessageSquare, Plus, Pin, PinOff, Edit2, Trash2, Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
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
import { API } from "../App";

const NOTE_CATEGORIES = [
  { value: "general", label: "General Note" },
  { value: "legal_issue", label: "Legal Issue" },
  { value: "evidence", label: "Evidence Note" },
  { value: "witness", label: "Witness Note" },
  { value: "strategy", label: "Strategy" },
  { value: "todo", label: "To Do" }
];

const getCategoryColor = (category) => {
  const colors = {
    general: "bg-slate-100 text-slate-700 border-slate-200",
    legal_issue: "bg-red-50 text-red-700 border-red-200",
    evidence: "bg-amber-50 text-amber-700 border-amber-200",
    witness: "bg-purple-50 text-purple-700 border-purple-200",
    strategy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    todo: "bg-blue-50 text-blue-700 border-blue-200"
  };
  return colors[category] || colors.general;
};

const NotesSection = ({ caseId, notes, setNotes, onNotesChange }) => {
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "general"
  });
  const [saving, setSaving] = useState(false);

  const handleCreateNote = async () => {
    if (!newNote.title || !newNote.content) {
      toast.error("Please fill in title and content");
      return;
    }
    
    setSaving(true);
    try {
      if (editingNote) {
        await axios.put(`${API}/cases/${caseId}/notes/${editingNote.note_id}`, newNote);
        toast.success("Note updated");
      } else {
        await axios.post(`${API}/cases/${caseId}/notes`, newNote);
        toast.success("Note created");
      }
      
      setShowNoteDialog(false);
      setEditingNote(null);
      setNewNote({ title: "", content: "", category: "general" });
      if (onNotesChange) onNotesChange();
    } catch (error) {
      toast.error(editingNote ? "Failed to update note" : "Failed to create note");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Delete this note?")) return;
    
    try {
      await axios.delete(`${API}/cases/${caseId}/notes/${noteId}`);
      setNotes(notes.filter(n => n.note_id !== noteId));
      toast.success("Note deleted");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleTogglePin = async (note) => {
    try {
      await axios.put(`${API}/cases/${caseId}/notes/${note.note_id}`, {
        ...note,
        pinned: !note.pinned
      });
      if (onNotesChange) onNotesChange();
      toast.success(note.pinned ? "Note unpinned" : "Note pinned");
    } catch (error) {
      toast.error("Failed to update note");
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

  const openNewDialog = () => {
    setEditingNote(null);
    setNewNote({ title: "", content: "", category: "general" });
    setShowNoteDialog(true);
  };

  // Sort notes: pinned first, then by date
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <>
      {/* Action Button */}
      <div className="flex justify-end mb-4">
        <Button 
          onClick={openNewDialog}
          className="bg-slate-900 text-white hover:bg-slate-800"
          data-testid="add-note-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
            No notes yet
          </h3>
          <p className="text-slate-600 mb-4">Add notes to track observations and legal issues.</p>
          <Button 
            onClick={openNewDialog}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Note
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedNotes.map((note) => (
            <Card 
              key={note.note_id} 
              className={`hover:shadow-md transition-shadow group ${note.pinned ? 'border-amber-300 bg-amber-50/30' : ''}`}
              data-testid={`note-${note.note_id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {note.pinned && (
                        <Pin className="w-4 h-4 text-amber-500" />
                      )}
                      <h4 className="font-semibold text-slate-900">{note.title}</h4>
                      <Badge variant="outline" className={getCategoryColor(note.category)}>
                        {NOTE_CATEGORIES.find(c => c.value === note.category)?.label || note.category}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-sm whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(note.created_at).toLocaleDateString('en-AU', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTogglePin(note)}
                      className="text-slate-400 hover:text-amber-500"
                    >
                      {note.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(note)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteNote(note.note_id)}
                      className="text-slate-400 hover:text-red-600"
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
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Note title..."
                className="mt-1"
                data-testid="note-title-input"
              />
            </div>
            <div>
              <Label htmlFor="note-category">Category</Label>
              <Select 
                value={newNote.category} 
                onValueChange={(value) => setNewNote({ ...newNote, category: value })}
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
              <Label htmlFor="note-content">Content</Label>
              <Textarea
                id="note-content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Write your note..."
                className="mt-1 min-h-[150px]"
                data-testid="note-content-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateNote} 
              disabled={saving || !newNote.title || !newNote.content}
              className="bg-slate-900 text-white hover:bg-slate-800"
              data-testid="note-submit-btn"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {editingNote ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotesSection;
