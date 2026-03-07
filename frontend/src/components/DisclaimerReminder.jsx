import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const DisclaimerReminder = () => {
  return (
    <div className="bg-sky-50 border-b border-sky-200 py-2 px-4">
      <p className="text-sky-800 text-xs text-center">
        <AlertTriangle className="w-3 h-3 inline mr-1 -mt-0.5" />
        <strong>Reminder:</strong> This tool does not provide legal advice. All results must be verified by a qualified legal professional.
        <Link to="/terms" className="underline ml-1 hover:text-sky-900">Terms</Link>
      </p>
    </div>
  );
};

export default DisclaimerReminder;
