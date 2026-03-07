import { useState, useEffect } from "react";
import { Scale, ArrowLeft, BarChart3, FileText, Users, TrendingUp, MapPin, Gavel, Shield, AlertTriangle, Moon, Sun, Menu, X, CheckCircle, Target, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { useTheme } from "../contexts/ThemeContext";
import PageHeader from "../components/PageHeader";

const Statistics = () => {
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/statistics/public`);
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getOffenceColor = (key) => {
    const colors = {
      homicide: "bg-red-500",
      assault: "bg-orange-500",
      sexual_offences: "bg-pink-500",
      robbery_theft: "bg-amber-500",
      drug_offences: "bg-green-500",
      fraud_dishonesty: "bg-blue-500",
      firearms_weapons: "bg-slate-500",
      domestic_violence: "bg-purple-500",
      public_order: "bg-cyan-500",
      terrorism: "bg-rose-500",
      driving_offences: "bg-teal-500"
    };
    return colors[key] || "bg-slate-400";
  };

  const getStateColor = (key) => {
    const colors = {
      nsw: "bg-blue-600",
      vic: "bg-purple-600",
      qld: "bg-red-600",
      sa: "bg-amber-600",
      wa: "bg-emerald-600",
      tas: "bg-teal-600",
      nt: "bg-orange-600",
      act: "bg-indigo-600"
    };
    return colors[key] || "bg-slate-400";
  };

  const getStrengthColor = (strength) => {
    const colors = {
      Strong: "bg-emerald-500",
      Moderate: "bg-amber-500",
      Weak: "bg-red-500"
    };
    return colors[strength] || "bg-slate-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const maxOffenceCount = stats?.cases_by_offence?.[0]?.count || 1;
  const maxStateCount = stats?.cases_by_state?.[0]?.count || 1;

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="statistics-page">
      {/* Shared Page Header with Dark Mode */}
      <PageHeader showBackButton={true} backTo="/" />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800" data-testid="stats-hero">
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl shadow-amber-500/30">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }} data-testid="stats-page-title">
            Case Statistics
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Real insights from cases managed through our platform
          </p>
        </div>
      </section>

      {/* Main Stats Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        
        {/* VITAL STATISTICS - Big Numbers Section */}
        <section className="mb-12" data-testid="vital-stats-section">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Platform Overview
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Cases - BIG */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 sm:p-8 text-center shadow-xl" data-testid="stat-total-cases">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gavel className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                {stats?.overview?.total_cases || 0}
              </p>
              <p className="text-blue-200 text-base sm:text-lg font-medium">Total Cases</p>
            </div>
            
            {/* Documents Uploaded - BIG */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 sm:p-8 text-center shadow-xl" data-testid="stat-total-documents">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                {stats?.overview?.total_documents || 0}
              </p>
              <p className="text-emerald-200 text-base sm:text-lg font-medium">Documents</p>
            </div>
            
            {/* Reports Generated - BIG */}
            <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-6 sm:p-8 text-center shadow-xl" data-testid="stat-total-reports">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                {stats?.overview?.total_reports || 0}
              </p>
              <p className="text-amber-200 text-base sm:text-lg font-medium">Reports</p>
            </div>
            
            {/* Grounds Identified - BIG */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 sm:p-8 text-center shadow-xl" data-testid="stat-total-grounds">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                {stats?.overview?.total_grounds_identified || 0}
              </p>
              <p className="text-purple-200 text-base sm:text-lg font-medium">Grounds Found</p>
            </div>
          </div>
        </section>

        {/* KEY INSIGHTS - Prominent Section */}
        {stats?.insights && (stats.overview?.total_cases > 0) && (
          <section className="mb-12" data-testid="key-insights-section">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Key Insights
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-card border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-6 text-center" data-testid="insight-offence">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-amber-600 dark:text-amber-400 text-sm font-semibold uppercase tracking-wide mb-2">Most Common Offence</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  {stats.insights.most_common_offence}
                </p>
              </div>
              
              <div className="bg-card border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-6 text-center" data-testid="insight-ground">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-semibold uppercase tracking-wide mb-2">Top Appeal Ground</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  {stats.insights.most_common_ground}
                </p>
              </div>
              
              <div className="bg-card border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 text-center" data-testid="insight-state">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-wide mb-2">Busiest State</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  {stats.insights.busiest_state}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* GROUND STRENGTH DISTRIBUTION - Visual */}
        <section className="mb-12" data-testid="ground-strength-section">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Ground Strength Distribution
          </h2>
          
          {stats?.grounds_by_strength?.length > 0 ? (
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
                {stats.grounds_by_strength.map((item, index) => (
                  <div key={index} className="text-center" data-testid={`strength-${item.strength.toLowerCase()}`}>
                    <div className={`w-24 h-24 sm:w-28 sm:h-28 ${getStrengthColor(item.strength)} rounded-2xl flex items-center justify-center mb-4 shadow-xl mx-auto`}>
                      <span className="text-3xl sm:text-4xl font-bold text-white">{item.count}</span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-foreground">{item.strength}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.strength === 'Strong' ? 'High success likelihood' : 
                       item.strength === 'Moderate' ? 'Requires strengthening' : 'Needs more evidence'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No ground strength data available yet</p>
            </div>
          )}
        </section>

        {/* BREAKDOWN CHARTS */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Detailed Breakdown
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cases by Offence Type */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="offence-breakdown">
              <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800 px-6 py-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                  Cases by Offence Type
                </h3>
              </div>
              <div className="p-6">
                {stats?.cases_by_offence?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.cases_by_offence.slice(0, 8).map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-32 sm:w-40 text-sm font-medium text-foreground truncate">{item.category}</div>
                        <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                          <div 
                            className={`h-full ${getOffenceColor(item.key)} rounded-full flex items-center justify-end pr-4 transition-all duration-500`}
                            style={{ width: `${Math.max((item.count / maxOffenceCount) * 100, 20)}%` }}
                          >
                            <span className="text-sm font-bold text-white">{item.count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No offence data available yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cases by State */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="state-breakdown">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 px-6 py-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  <MapPin className="w-6 h-6 text-blue-600" />
                  Cases by State
                </h3>
              </div>
              <div className="p-6">
                {stats?.cases_by_state?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.cases_by_state.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-40 text-sm font-medium text-foreground truncate">{item.state}</div>
                        <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                          <div 
                            className={`h-full ${getStateColor(item.key)} rounded-full flex items-center justify-end pr-4 transition-all duration-500`}
                            style={{ width: `${Math.max((item.count / maxStateCount) * 100, 20)}%` }}
                          >
                            <span className="text-sm font-bold text-white">{item.count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No state data available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Most Common Appeal Grounds */}
        <section className="mb-12" data-testid="common-grounds-section">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Most Common Appeal Grounds
          </h2>
          
          {stats?.grounds_by_type?.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.grounds_by_type.slice(0, 6).map((item, index) => (
                <div 
                  key={index} 
                  className="bg-card border border-border rounded-xl p-5 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                  data-testid={`ground-type-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-base font-medium text-foreground">{item.type}</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No grounds data available yet</p>
            </div>
          )}
        </section>

        {/* Disclaimer */}
        <div className="p-5 sm:p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl" data-testid="stats-disclaimer">
          <p className="text-sm sm:text-base text-amber-800 dark:text-amber-200">
            <strong>Important:</strong> These statistics are based on cases managed through this platform and are provided 
            for informational purposes only. They do not represent official court statistics or predict appeal outcomes. 
            Every case is unique and should be assessed on its own merits by qualified legal professionals.
          </p>
        </div>
      </main>

      {/* Footer CTA */}
      <section className="bg-slate-900 dark:bg-slate-950 px-4 sm:px-6 py-12 border-t border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Ready to Analyse Your Case?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Let our AI help identify potential grounds for appeal in your case.
          </p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 rounded-xl px-8 py-5 text-lg font-semibold shadow-lg shadow-amber-600/20">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Statistics;
