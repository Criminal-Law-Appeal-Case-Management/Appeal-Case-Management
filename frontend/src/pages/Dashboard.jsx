import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { 
  Scale, Plus, FileText, Clock, MoreVertical, 
  LogOut, FolderOpen, Search, User, HelpCircle, Users, BookOpen
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { API } from "../App";
import DisclaimerReminder from "../components/DisclaimerReminder";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewCaseDialog, setShowNewCaseDialog] = useState(false);
  const [offenceCategories, setOffenceCategories] = useState([]);
  const [australianStates, setAustralianStates] = useState([]);
  const [newCase, setNewCase] = useState({
    title: "",
    defendant_name: "",
    case_number: "",
    court: "",
    judge: "",
    state: "nsw",
    offence_category: "homicide",
    offence_type: "",
    summary: ""
  });

  useEffect(() => {
    fetchCases();
    fetchOffenceCategories();
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${API}/states`);
      setAustralianStates(response.data.states);
    } catch (error) {
      console.error("Failed to load states");
    }
  };

  const fetchOffenceCategories = async () => {
    try {
      const response = await axios.get(`${API}/offence-categories`);
      setOffenceCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to load offence categories");
    }
  };

  const fetchCases = async () => {
    try {
      const response = await axios.get(`${API}/cases`);
      setCases(response.data);
    } catch (error) {
      toast.error("Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async () => {
    if (!newCase.title || !newCase.defendant_name) {
      toast.error("Title and defendant name are required");
      return;
    }

    try {
      const response = await axios.post(`${API}/cases`, newCase);
      setCases([response.data, ...cases]);
      setShowNewCaseDialog(false);
      setNewCase({ title: "", defendant_name: "", case_number: "", court: "", judge: "", offence_category: "homicide", offence_type: "", summary: "" });
      toast.success("Case created successfully");
    } catch (error) {
      toast.error("Failed to create case");
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (!window.confirm("Are you sure you want to delete this case and all its data?")) return;
    
    try {
      await axios.delete(`${API}/cases/${caseId}`);
      setCases(cases.filter(c => c.case_id !== caseId));
      toast.success("Case deleted");
    } catch (error) {
      toast.error("Failed to delete case");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
      navigate("/", { replace: true });
    } catch (error) {
      navigate("/", { replace: true });
    }
  };

  const filteredCases = cases.filter(c => 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.defendant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.case_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Disclaimer Reminder */}
      <DisclaimerReminder />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-8 bottom-0 w-64 bg-white border-r border-slate-200 p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-10">
          <Scale className="w-8 h-8 text-slate-900" />
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Criminal Appeal AI
          </span>
        </div>

        <nav className="space-y-2">
          <div className="sidebar-item active" data-testid="nav-cases">
            <FolderOpen className="w-5 h-5" />
            <span className="font-medium">All Cases</span>
          </div>
          <div 
            className="sidebar-item cursor-pointer" 
            onClick={() => navigate('/resources')}
            data-testid="nav-resources"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Resources</span>
          </div>
          <div 
            className="sidebar-item cursor-pointer" 
            onClick={() => navigate('/help')}
            data-testid="nav-help"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Help & Glossary</span>
          </div>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full mt-3 text-slate-600 hover:text-slate-900"
            data-testid="logout-btn"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 md:p-8">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-slate-900" />
            <span className="text-lg font-bold" style={{ fontFamily: 'Crimson Pro, serif' }}>Criminal Appeal AI</span>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="sm" data-testid="mobile-logout-btn">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 
              className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              Your Cases
            </h1>
            <p className="text-slate-600 mt-1">{cases.length} case{cases.length !== 1 ? 's' : ''} total</p>
          </div>
          <Button
            onClick={() => setShowNewCaseDialog(true)}
            className="bg-slate-900 text-white hover:bg-slate-800 btn-hover"
            data-testid="new-case-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>

        {/* Purpose Statement */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <p className="text-slate-700 text-sm leading-relaxed">
            Designed for analysing appeal issues across <strong>all criminal offences</strong> in Australian courts, 
            including questions relating to <strong>mens rea</strong>, <strong>procedural error</strong>, 
            <strong>fresh evidence</strong>, and <strong>sentencing</strong>.
          </p>
        </div>

        {/* Privacy Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>Privacy Warning:</strong> Users should ensure they have lawful authority to upload 
            or share any court documents or personal information through this platform.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="search-input"
          />
        </div>

        {/* Cases Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
              {searchQuery ? "No cases found" : "No cases yet"}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchQuery ? "Try a different search term" : "Create your first case to get started"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowNewCaseDialog(true)}
                className="bg-slate-900 text-white hover:bg-slate-800"
                data-testid="empty-new-case-btn"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Case
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((caseItem) => (
              <Card 
                key={caseItem.case_id} 
                className="card-hover group"
                data-testid={`case-card-${caseItem.case_id}`}
              >
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/cases/${caseItem.case_id}`)}
                  >
                    <CardTitle 
                      className="text-lg font-semibold text-slate-900 group-hover:text-amber-700 transition-colors"
                      style={{ fontFamily: 'Crimson Pro, serif' }}
                    >
                      {caseItem.title}
                    </CardTitle>
                    <p className="text-sm text-slate-600 mt-1">{caseItem.defendant_name}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/cases/${caseItem.case_id}`)}>
                        View Case
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCase(caseItem.case_id)}
                        className="text-red-600"
                      >
                        Delete Case
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent onClick={() => navigate(`/cases/${caseItem.case_id}`)} className="cursor-pointer">
                  {caseItem.case_number && (
                    <p className="text-xs text-slate-500 mb-3 font-mono">{caseItem.case_number}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{caseItem.document_count || 0} docs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{caseItem.event_count || 0} events</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                      Updated {formatDate(caseItem.updated_at)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* New Case Dialog */}
      <Dialog open={showNewCaseDialog} onOpenChange={setShowNewCaseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Crimson Pro, serif' }} className="text-2xl">
              Create New Case
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Case Title *</Label>
              <Input
                id="title"
                value={newCase.title}
                onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                placeholder="e.g., R v Smith - Murder Appeal"
                data-testid="new-case-title"
              />
            </div>
            <div>
              <Label htmlFor="defendant">Defendant Name *</Label>
              <Input
                id="defendant"
                value={newCase.defendant_name}
                onChange={(e) => setNewCase({ ...newCase, defendant_name: e.target.value })}
                placeholder="Full legal name"
                data-testid="new-case-defendant"
              />
            </div>
            <div>
              <Label htmlFor="offence_category">Offence Category *</Label>
              <select
                id="offence_category"
                value={newCase.offence_category}
                onChange={(e) => setNewCase({ ...newCase, offence_category: e.target.value, offence_type: "" })}
                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                data-testid="new-case-offence-category"
              >
                {offenceCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                {offenceCategories.find(c => c.id === newCase.offence_category)?.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="offence_type">Specific Offence</Label>
                <select
                  id="offence_type"
                  value={newCase.offence_type}
                  onChange={(e) => setNewCase({ ...newCase, offence_type: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  data-testid="new-case-offence-type"
                >
                  <option value="">Select specific offence...</option>
                  {offenceCategories.find(c => c.id === newCase.offence_category)?.offences.map(off => (
                    <option key={off} value={off}>{off}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="state">State/Territory *</Label>
                <select
                  id="state"
                  value={newCase.state}
                  onChange={(e) => setNewCase({ ...newCase, state: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  data-testid="new-case-state"
                >
                  {australianStates.map(state => (
                    <option key={state.id} value={state.id}>{state.name} ({state.abbreviation})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="case_number">Case Number</Label>
                <Input
                  id="case_number"
                  value={newCase.case_number}
                  onChange={(e) => setNewCase({ ...newCase, case_number: e.target.value })}
                  placeholder="e.g., 2024/00123"
                  data-testid="new-case-number"
                />
              </div>
              <div>
                <Label htmlFor="court">Court</Label>
                <Input
                  id="court"
                  value={newCase.court}
                  onChange={(e) => setNewCase({ ...newCase, court: e.target.value })}
                  placeholder="e.g., NSW Supreme Court"
                  data-testid="new-case-court"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="judge">Presiding Judge</Label>
              <Input
                id="judge"
                value={newCase.judge}
                onChange={(e) => setNewCase({ ...newCase, judge: e.target.value })}
                placeholder="Judge name"
                data-testid="new-case-judge"
              />
            </div>
            <div>
              <Label htmlFor="summary">Case Summary</Label>
              <Textarea
                id="summary"
                value={newCase.summary}
                onChange={(e) => setNewCase({ ...newCase, summary: e.target.value })}
                placeholder="Brief overview of the case..."
                rows={3}
                data-testid="new-case-summary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCaseDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCase}
              className="bg-slate-900 text-white hover:bg-slate-800"
              data-testid="create-case-submit"
            >
              Create Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
