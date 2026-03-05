import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Scale, Users, Eye, FolderOpen, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { API } from "../App";
import { toast } from "sonner";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/stats/visits`);
        setStats(response.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Admin access required");
          toast.error("You don't have admin access");
        } else if (err.response?.status === 401) {
          setError("Please log in first");
          navigate("/");
        } else {
          setError("Failed to load stats");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-7 h-7 text-amber-500" />
            <span className="text-lg font-semibold text-white" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Admin Statistics
            </span>
          </div>
          <Button 
            onClick={() => navigate("/dashboard")} 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-8" style={{ fontFamily: 'Crimson Pro, serif' }}>
          Site Analytics
        </h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Page Views</p>
                <p className="text-3xl font-bold text-slate-900">{stats?.total_visits?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Registered Users</p>
                <p className="text-3xl font-bold text-slate-900">{stats?.total_users?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Cases Created</p>
                <p className="text-3xl font-bold text-slate-900">{stats?.total_cases?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Stats */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Last 7 Days
            </h2>
          </div>
          
          <div className="space-y-3">
            {stats?.daily_stats?.map((day, index) => (
              <div key={day.date} className="flex items-center gap-4">
                <span className="text-sm text-slate-500 w-24">{day.date}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (day.count / Math.max(...stats.daily_stats.map(d => d.count || 1))) * 100)}%`,
                      minWidth: day.count > 0 ? '20px' : '0'
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-slate-700 w-16 text-right">
                  {day.count} visits
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Stats update in real-time as visitors access the site
        </p>
      </main>
    </div>
  );
};

export default AdminStats;
