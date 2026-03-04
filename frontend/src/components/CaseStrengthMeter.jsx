import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../App";
import { 
  TrendingUp, AlertCircle, FileText, Clock, CheckCircle2,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

const CaseStrengthMeter = ({ caseId }) => {
  const [strength, setStrength] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStrength = async () => {
      try {
        const response = await axios.get(`${API}/cases/${caseId}/strength`);
        setStrength(response.data);
      } catch (error) {
        console.error("Failed to fetch case strength:", error);
      } finally {
        setLoading(false);
      }
    };

    if (caseId) fetchStrength();
  }, [caseId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 bg-slate-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!strength) return null;

  const getColorClass = (color) => {
    switch (color) {
      case "green": return "text-emerald-600 bg-emerald-100";
      case "amber": return "text-amber-600 bg-amber-100";
      case "orange": return "text-orange-600 bg-orange-100";
      case "red": return "text-red-600 bg-red-100";
      default: return "text-slate-600 bg-slate-100";
    }
  };

  const getProgressColor = (score) => {
    if (score >= 75) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    if (score >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card data-testid="case-strength-meter">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-slate-600" />
          Case Strength
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="text-center py-4">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getColorClass(strength.rating_color)}`}>
            <span className="text-3xl font-bold">{strength.overall_score}</span>
          </div>
          <p className={`mt-2 font-semibold ${getColorClass(strength.rating_color).split(' ')[0]}`}>
            {strength.rating}
          </p>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Grounds of Merit</span>
              <span className="font-medium">{strength.breakdown.grounds.score}%</span>
            </div>
            <Progress value={strength.breakdown.grounds.score} className="h-2" />
            <p className="text-xs text-slate-500 mt-1">
              {strength.breakdown.grounds.strong} strong, {strength.breakdown.grounds.moderate} moderate, {strength.breakdown.grounds.weak} weak
            </p>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Documentation</span>
              <span className="font-medium">{strength.breakdown.documentation.score}%</span>
            </div>
            <Progress value={strength.breakdown.documentation.score} className="h-2" />
            <p className="text-xs text-slate-500 mt-1">
              {strength.breakdown.documentation.with_text}/{strength.breakdown.documentation.total_docs} docs with extracted text
            </p>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Timeline</span>
              <span className="font-medium">{strength.breakdown.timeline.score}%</span>
            </div>
            <Progress value={strength.breakdown.timeline.score} className="h-2" />
            <p className="text-xs text-slate-500 mt-1">
              {strength.breakdown.timeline.event_count} events documented
            </p>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Preparation Progress</span>
              <span className="font-medium">{strength.breakdown.preparation.score}%</span>
            </div>
            <Progress value={strength.breakdown.preparation.score} className="h-2" />
            <p className="text-xs text-slate-500 mt-1">
              {strength.breakdown.preparation.completed}/{strength.breakdown.preparation.total} checklist items completed
            </p>
          </div>
        </div>

        {/* Recommendations */}
        {strength.recommendations.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
            <p className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Recommendations
            </p>
            <ul className="text-sm text-amber-700 space-y-1">
              {strength.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CaseStrengthMeter;
