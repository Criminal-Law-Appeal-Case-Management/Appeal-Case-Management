import { useState, useEffect } from "react";
import { Scale, BarChart3, FileText, Users, TrendingUp, MapPin, Gavel, Shield, AlertTriangle, CheckCircle, Target } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import PageHeader from "../components/PageHeader";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="statistics-page">
      <PageHeader showBackButton={true} backTo="/" />

      {/* Hero - Cleaner, Simpler */}
      <section className="py-12 px-6 bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sky-500 font-bold text-xs uppercase tracking-widest mb-3">Deep Dive</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Appeal Statistics Explained
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A closer look at the numbers behind criminal appeals in Australia.
          </p>
        </div>
      </section>

      {/* Platform Statistics */}
      {stats?.overview?.total_cases > 0 && (
        <section className="py-12 px-6 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Cases Managed Through This Platform
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-xl p-6 text-center border border-border">
                <Gavel className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground mb-1">{stats?.overview?.total_cases || 0}</p>
                <p className="text-sm text-muted-foreground">Total Cases</p>
              </div>
              <div className="bg-card rounded-xl p-6 text-center border border-border">
                <FileText className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground mb-1">{stats?.overview?.total_documents || 0}</p>
                <p className="text-sm text-muted-foreground">Documents Analysed</p>
              </div>
              <div className="bg-card rounded-xl p-6 text-center border border-border">
                <TrendingUp className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground mb-1">{stats?.overview?.total_reports || 0}</p>
                <p className="text-sm text-muted-foreground">Reports Generated</p>
              </div>
              <div className="bg-card rounded-xl p-6 text-center border border-border">
                <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground mb-1">{stats?.overview?.total_grounds_identified || 0}</p>
                <p className="text-sm text-muted-foreground">Grounds Found</p>
              </div>
            </div>

            {/* Ground Strength */}
            {stats?.grounds_by_strength?.length > 0 && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-bold text-foreground mb-4 text-center">Grounds by Strength</h3>
                <div className="flex justify-center gap-8">
                  {stats.grounds_by_strength.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        item.strength === 'Strong' ? 'bg-emerald-500' : 
                        item.strength === 'Moderate' ? 'bg-sky-500' : 'bg-red-500'
                      }`}>
                        <span className="text-xl font-bold text-white">{item.count}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{item.strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Common Appeal Grounds */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Most Common Appeal Grounds
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-5 border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sky-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground">Manifestly Excessive Sentence</h3>
                <p className="text-sm text-muted-foreground">The sentence was too harsh compared to similar cases</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sky-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground">Error of Law</h3>
                <p className="text-sm text-muted-foreground">The judge made a mistake in applying the law</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sky-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground">Inadequate Legal Representation</h3>
                <p className="text-sm text-muted-foreground">Your lawyer failed to properly represent you</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sky-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground">Fresh Evidence</h3>
                <p className="text-sm text-muted-foreground">New evidence has emerged since the trial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-6 bg-sky-50 dark:bg-sky-900/20 border-y border-sky-200 dark:border-sky-800">
        <div className="max-w-3xl mx-auto text-center">
          <AlertTriangle className="w-8 h-8 text-sky-600 mx-auto mb-3" />
          <p className="text-sky-800 dark:text-sky-200 text-sm">
            <strong>Important:</strong> These statistics are for informational purposes only. Every case is unique. 
            Always seek qualified legal advice before making decisions about your appeal.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 bg-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Ready to Find Your Grounds?
          </h2>
          <p className="text-slate-400 mb-6">
            Let our AI help identify potential appeal grounds in your case.
          </p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-sky-600 to-sky-700 text-white hover:from-sky-700 hover:to-sky-800 rounded-xl px-8 py-4 text-lg font-semibold">
              Start Your Case Analysis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Statistics;
