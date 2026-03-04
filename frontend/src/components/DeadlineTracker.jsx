import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../App";
import { 
  Clock, AlertTriangle, CheckCircle2, Plus, Trash2, Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "./ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "./ui/select";

const DeadlineTracker = ({ caseId }) => {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newDeadline, setNewDeadline] = useState({
    title: "",
    description: "",
    deadline_type: "other",
    due_date: "",
    priority: "high"
  });

  useEffect(() => {
    fetchDeadlines();
  }, [caseId]);

  const fetchDeadlines = async () => {
    try {
      const response = await axios.get(`${API}/cases/${caseId}/deadlines`);
      setDeadlines(response.data);
    } catch (error) {
      console.error("Failed to fetch deadlines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeadline = async () => {
    if (!newDeadline.title || !newDeadline.due_date) {
      toast.error("Title and due date are required");
      return;
    }

    try {
      const response = await axios.post(`${API}/cases/${caseId}/deadlines`, newDeadline);
      setDeadlines([...deadlines, response.data].sort((a, b) => 
        new Date(a.due_date) - new Date(b.due_date)
      ));
      setShowAddDialog(false);
      setNewDeadline({ title: "", description: "", deadline_type: "other", due_date: "", priority: "high" });
      toast.success("Deadline added");
    } catch (error) {
      toast.error("Failed to add deadline");
    }
  };

  const handleToggleComplete = async (deadlineId, isCompleted) => {
    try {
      await axios.patch(`${API}/cases/${caseId}/deadlines/${deadlineId}`, {
        is_completed: !isCompleted
      });
      setDeadlines(deadlines.map(d => 
        d.deadline_id === deadlineId 
          ? { ...d, is_completed: !isCompleted }
          : d
      ));
      toast.success(isCompleted ? "Deadline reopened" : "Deadline completed");
    } catch (error) {
      toast.error("Failed to update deadline");
    }
  };

  const handleDeleteDeadline = async (deadlineId) => {
    try {
      await axios.delete(`${API}/cases/${caseId}/deadlines/${deadlineId}`);
      setDeadlines(deadlines.filter(d => d.deadline_id !== deadlineId));
      toast.success("Deadline deleted");
    } catch (error) {
      toast.error("Failed to delete deadline");
    }
  };

  const getDaysRemaining = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getPriorityColor = (priority, daysRemaining, isCompleted) => {
    if (isCompleted) return "bg-slate-100 text-slate-500";
    if (daysRemaining < 0) return "bg-red-100 text-red-700 border-red-300";
    if (daysRemaining <= 3) return "bg-red-50 text-red-700 border-red-200";
    if (daysRemaining <= 7) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const DEADLINE_TYPES = [
    { value: "appeal_lodgement", label: "Appeal Lodgement (28 days)" },
    { value: "leave_application", label: "Leave Application" },
    { value: "document_filing", label: "Document Filing" },
    { value: "hearing", label: "Hearing Date" },
    { value: "other", label: "Other" }
  ];

  return (
    <Card data-testid="deadline-tracker">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-600" />
            Deadline Tracker
          </CardTitle>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-16 bg-slate-100 rounded"></div>
            ))}
          </div>
        ) : deadlines.length === 0 ? (
          <div className="text-center py-6 text-slate-500">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No deadlines set</p>
            <p className="text-sm">Add important dates to track</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deadlines.map(deadline => {
              const daysRemaining = getDaysRemaining(deadline.due_date);
              const isOverdue = daysRemaining < 0 && !deadline.is_completed;
              
              return (
                <div 
                  key={deadline.deadline_id}
                  className={`p-3 rounded-lg border ${getPriorityColor(deadline.priority, daysRemaining, deadline.is_completed)} ${deadline.is_completed ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleComplete(deadline.deadline_id, deadline.is_completed)}
                        className={`mt-0.5 ${deadline.is_completed ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'}`}
                      >
                        <CheckCircle2 className={`w-5 h-5 ${deadline.is_completed ? 'fill-emerald-100' : ''}`} />
                      </button>
                      <div>
                        <p className={`font-medium ${deadline.is_completed ? 'line-through' : ''}`}>
                          {deadline.title}
                        </p>
                        {deadline.description && (
                          <p className="text-sm opacity-75">{deadline.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {new Date(deadline.due_date).toLocaleDateString('en-AU', {
                              weekday: 'short', day: 'numeric', month: 'short'
                            })}
                          </Badge>
                          {!deadline.is_completed && (
                            <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : daysRemaining <= 3 ? 'text-red-600' : daysRemaining <= 7 ? 'text-amber-600' : 'text-slate-600'}`}>
                              {isOverdue 
                                ? `${Math.abs(daysRemaining)} days overdue!`
                                : daysRemaining === 0 
                                  ? 'Due today!'
                                  : daysRemaining === 1 
                                    ? 'Due tomorrow'
                                    : `${daysRemaining} days left`
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDeadline(deadline.deadline_id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Deadline Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Deadline</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={newDeadline.title}
                  onChange={(e) => setNewDeadline({ ...newDeadline, title: e.target.value })}
                  placeholder="e.g., Lodge Notice of Appeal"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Due Date *</label>
                <Input
                  type="date"
                  value={newDeadline.due_date}
                  onChange={(e) => setNewDeadline({ ...newDeadline, due_date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select 
                  value={newDeadline.deadline_type}
                  onValueChange={(v) => setNewDeadline({ ...newDeadline, deadline_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEADLINE_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newDeadline.description}
                  onChange={(e) => setNewDeadline({ ...newDeadline, description: e.target.value })}
                  placeholder="Optional notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddDeadline}>Add Deadline</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DeadlineTracker;
