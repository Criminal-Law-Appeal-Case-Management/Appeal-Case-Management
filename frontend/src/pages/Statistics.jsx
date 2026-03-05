import { useState, useEffect } from "react";
import { Scale, ArrowLeft, BarChart3, FileText, Users, TrendingUp, MapPin, Gavel, Shield, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";

const Statistics = () => {
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const maxOffenceCount = stats?.cases_by_offence?.[0]?.count || 1;
  const maxStateCount = stats?.cases_by_state?.[0]?.count || 1;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-7 h-7 text-amber-500" />
            <span className="text-lg font-semibold text-white" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Appeal Case Manager
            </span>
          </div>
          <Link to="/">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-slate-900 px-6 py-12 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Case Statistics Dashboard
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Anonymized insights from cases managed through our platform. 
            Understanding patterns can help inform your appeal strategy.
          </p>
        </div>
      </section>

      {/* Stats Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gavel className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats?.overview?.total_cases || 0}</p>
              <p className="text-sm text-slate-600">Total Cases</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats?.overview?.total_documents || 0}</p>
              <p className="text-sm text-slate-600">Documents Uploaded</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats?.overview?.total_reports || 0}</p>
              <p className="text-sm text-slate-600">Reports Generated</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats?.overview?.total_grounds_identified || 0}</p>
              <p className="text-sm text-slate-600">Grounds Identified</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Cases by Offence Type */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Cases by Offence Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.cases_by_offence?.length > 0 ? (
                <div className="space-y-3">
                  {stats.cases_by_offence.slice(0, 8).map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-28 text-sm text-slate-600 truncate">{item.category}</div>
                      <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                        <div 
                          className={`h-full ${getOffenceColor(item.key)} rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                          style={{ width: `${Math.max((item.count / maxOffenceCount) * 100, 15)}%` }}
                        >
                          <span className="text-xs font-medium text-white">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No data available yet</p>
              )}
            </CardContent>
          </Card>

          {/* Cases by State */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Cases by State
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.cases_by_state?.length > 0 ? (
                <div className="space-y-3">
                  {stats.cases_by_state.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-36 text-sm text-slate-600 truncate">{item.state}</div>
                      <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                        <div 
                          className={`h-full ${getStateColor(item.key)} rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                          style={{ width: `${Math.max((item.count / maxStateCount) * 100, 15)}%` }}
                        >
                          <span className="text-xs font-medium text-white">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No data available yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Grounds Analysis */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Grounds by Type */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                Most Common Appeal Grounds
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.grounds_by_type?.length > 0 ? (
                <div className="space-y-2">
                  {stats.grounds_by_type.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">{item.type}</span>
                      <span className="text-sm font-bold text-slate-900 bg-white px-3 py-1 rounded-full border border-slate-200">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No data available yet</p>
              )}
            </CardContent>
          </Card>

          {/* Grounds by Strength */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Ground Strength Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.grounds_by_strength?.length > 0 ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="flex gap-4 mb-6">
                    {stats.grounds_by_strength.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className={`w-20 h-20 ${getStrengthColor(item.strength)} rounded-full flex items-center justify-center mb-2`}>
                          <span className="text-2xl font-bold text-white">{item.count}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-700">{item.strength}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 text-center">
                    Strong grounds have the highest likelihood of success on appeal
                  </p>
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No data available yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Key Insights */}
        {stats?.insights && (stats.overview?.total_cases > 0) && (
          <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-0">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-white mb-6 text-center" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Key Insights
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-amber-400 text-sm font-medium mb-1">Most Common Offence</p>
                  <p className="text-white text-lg font-semibold">{stats.insights.most_common_offence}</p>
                </div>
                <div>
                  <p className="text-amber-400 text-sm font-medium mb-1">Top Appeal Ground</p>
                  <p className="text-white text-lg font-semibold">{stats.insights.most_common_ground}</p>
                </div>
                <div>
                  <p className="text-amber-400 text-sm font-medium mb-1">Busiest State</p>
                  <p className="text-white text-lg font-semibold">{stats.insights.busiest_state}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> These statistics are based on cases managed through this platform and are provided 
            for informational purposes only. They do not represent official court statistics or predict appeal outcomes. 
            Every case is unique and should be assessed on its own merits by qualified legal professionals.
          </p>
        </div>
      </main>

      {/* Footer CTA */}
      <section className="bg-slate-900 px-6 py-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Ready to Analyze Your Case?
          </h2>
          <p className="text-slate-400 mb-6">
            Let our AI help identify potential grounds for appeal in your case.
          </p>
          <Link to="/">
            <Button className="bg-amber-600 text-white hover:bg-amber-700">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Statistics;
