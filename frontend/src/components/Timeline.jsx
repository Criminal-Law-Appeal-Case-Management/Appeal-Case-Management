import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const EVENT_TYPE_LABELS = {
  arrest: "Arrest",
  court_hearing: "Court Hearing",
  evidence_discovery: "Evidence Discovery",
  appeal_filed: "Appeal Filed",
  verdict: "Verdict",
  other: "Event"
};

const EVENT_TYPE_COLORS = {
  arrest: "bg-red-50 text-red-700 border-red-200",
  court_hearing: "bg-blue-50 text-blue-700 border-blue-200",
  evidence_discovery: "bg-emerald-50 text-emerald-700 border-emerald-200",
  appeal_filed: "bg-amber-50 text-amber-700 border-amber-200",
  verdict: "bg-purple-50 text-purple-700 border-purple-200",
  other: "bg-slate-50 text-slate-700 border-slate-200"
};

const Timeline = ({ events, onDeleteEvent }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown date";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="relative pl-8 py-4" data-testid="timeline-container">
      {/* Vertical line */}
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-200"></div>

      <div className="space-y-6">
        {events.map((event, index) => (
          <div 
            key={event.event_id} 
            className="relative group"
            data-testid={`timeline-event-${event.event_id}`}
          >
            {/* Dot on the line */}
            <div className={`absolute -left-5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
              event.event_type === 'arrest' ? 'bg-red-500' :
              event.event_type === 'court_hearing' ? 'bg-blue-500' :
              event.event_type === 'evidence_discovery' ? 'bg-emerald-500' :
              event.event_type === 'appeal_filed' ? 'bg-amber-500' :
              event.event_type === 'verdict' ? 'bg-purple-500' :
              'bg-slate-400'
            }`}></div>

            {/* Event card */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 ml-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant="outline" 
                      className={EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.other}
                    >
                      {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
                    </Badge>
                    <span className="text-sm text-slate-500 font-mono">
                      {formatDate(event.event_date)}
                    </span>
                  </div>
                  <h4 
                    className="font-semibold text-slate-900 text-lg"
                    style={{ fontFamily: 'Crimson Pro, serif' }}
                  >
                    {event.title}
                  </h4>
                  {event.description && (
                    <p className="text-slate-600 mt-2 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteEvent(event.event_id)}
                  className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                  data-testid={`delete-event-${event.event_id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
