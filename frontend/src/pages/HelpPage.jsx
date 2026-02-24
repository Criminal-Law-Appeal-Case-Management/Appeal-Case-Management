import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Scale, ArrowLeft, FileText, Clock, Upload, Search, 
  Sparkles, Gavel, MessageSquare, FileDown, Eye,
  CheckCircle, ChevronDown, ChevronUp, HelpCircle
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const HelpPage = ({ user }) => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: "signin",
      title: "Step 1: Sign In",
      icon: <Scale className="w-5 h-5" />,
      content: (
        <ol className="list-decimal list-inside space-y-2 text-slate-700">
          <li>Go to the app URL</li>
          <li>Click <strong>"Sign In with Google"</strong> (top right corner)</li>
          <li>Click <strong>"Continue with Google"</strong></li>
          <li>Select your Google account to sign in</li>
          <li>You'll be taken to your Dashboard</li>
        </ol>
      )
    },
    {
      id: "create-case",
      title: "Step 2: Create a New Case",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <ol className="list-decimal list-inside space-y-2 text-slate-700">
          <li>On the Dashboard, click <strong>"New Case"</strong> button</li>
          <li>Fill in the case details:
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li><strong>Case Title</strong>: Name for your case (e.g., "R v Smith Appeal")</li>
              <li><strong>Defendant Name</strong>: The person's name</li>
              <li><strong>Case Number</strong>: (Optional) Court case reference number</li>
              <li><strong>Court</strong>: (Optional) Which court</li>
              <li><strong>Summary</strong>: Brief description of the case</li>
            </ul>
          </li>
          <li>Click <strong>"Create Case"</strong></li>
          <li>Your new case will appear on the Dashboard</li>
        </ol>
      )
    },
    {
      id: "upload-docs",
      title: "Step 3: Upload Documents",
      icon: <Upload className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-slate-700">
          <ol className="list-decimal list-inside space-y-2">
            <li>Click on your case to open it</li>
            <li>You'll see the <strong>Documents</strong> tab (default view)</li>
            <li>Click <strong>"Upload Document"</strong> button</li>
            <li>Select one or multiple files (PDF, DOCX, TXT, or images)</li>
            <li>Choose a category (Brief of Evidence, Court Transcript, Witness Statement, etc.)</li>
            <li>Add an optional description</li>
            <li>Click <strong>"Upload"</strong></li>
          </ol>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
            <p className="font-medium text-amber-800">Important:</p>
            <ul className="list-disc list-inside text-amber-700 mt-1">
              <li>After uploading, click <strong>"Extract Text"</strong> for PDF/Word documents</li>
              <li>For scanned documents or images, click <strong>"OCR Scan"</strong></li>
              <li>Documents need extracted text for AI features to work</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "search",
      title: "Step 4: Search Documents",
      icon: <Search className="w-5 h-5" />,
      content: (
        <ol className="list-decimal list-inside space-y-2 text-slate-700">
          <li>Use the search bar in the Documents tab</li>
          <li>Type any word or phrase you're looking for</li>
          <li>Results show which documents contain your search term</li>
          <li>Matching text is highlighted with surrounding context</li>
          <li>Click on results to find specific information quickly</li>
        </ol>
      )
    },
    {
      id: "timeline",
      title: "Step 5: Build Your Timeline",
      icon: <Clock className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-slate-700">
          <div>
            <p className="font-medium mb-2">Generate Timeline Automatically:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click the <strong>"Timeline"</strong> tab</li>
              <li>Click <strong>"AI Generate Timeline"</strong> button</li>
              <li>Wait 30-60 seconds while AI analyzes your documents</li>
              <li>The AI will extract all dates and events mentioned</li>
              <li>Events appear in chronological order</li>
            </ol>
          </div>
          <div>
            <p className="font-medium mb-2">Add Events Manually:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click <strong>"Add Event"</strong> button</li>
              <li>Enter title, date, description, and event type</li>
              <li>Click <strong>"Create Event"</strong></li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: "grounds",
      title: "Step 6: Find Grounds of Merit",
      icon: <Gavel className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-slate-700">
          <div>
            <p className="font-medium mb-2">AI Identify Grounds:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click the <strong>"Grounds"</strong> tab</li>
              <li>Click <strong>"AI Identify Grounds"</strong> button</li>
              <li>Wait 30-60 seconds for AI analysis</li>
              <li>The AI will find potential appeal grounds:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Procedural errors</li>
                  <li>Fresh evidence</li>
                  <li>Judicial errors</li>
                  <li>Ineffective counsel</li>
                  <li>And more...</li>
                </ul>
              </li>
            </ol>
          </div>
          <div>
            <p className="font-medium mb-2">Investigate a Ground:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Find a ground you want to explore</li>
              <li>Click the <strong>"Investigate"</strong> button</li>
              <li>Wait for AI deep analysis</li>
              <li>You'll get relevant law sections (NSW & Federal), similar cases, and strategic recommendations</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: "notes",
      title: "Step 7: Add Notes & Comments",
      icon: <MessageSquare className="w-5 h-5" />,
      content: (
        <ol className="list-decimal list-inside space-y-2 text-slate-700">
          <li>Click the <strong>"Notes"</strong> tab</li>
          <li>Click <strong>"Add Note"</strong> button</li>
          <li>Enter:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>Title</strong>: Note heading</li>
              <li><strong>Content</strong>: Your notes</li>
              <li><strong>Category</strong>: General, Legal Opinion, Evidence Note, Strategy, Question, or Action Item</li>
            </ul>
          </li>
          <li>Click <strong>"Create Note"</strong></li>
          <li>Use the pin icon to keep important notes at the top</li>
        </ol>
      )
    },
    {
      id: "reports",
      title: "Step 8: Generate Reports",
      icon: <Sparkles className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-slate-700">
          <ol className="list-decimal list-inside space-y-2">
            <li>Click the <strong>"Reports"</strong> tab</li>
            <li>Click <strong>"Generate Report"</strong> button</li>
            <li>Choose report type:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>Quick Summary</strong>: Brief overview of the case</li>
                <li><strong>Full Detailed</strong>: Complete analysis with law references</li>
                <li><strong>Extensive Log</strong>: Comprehensive documentation</li>
              </ul>
            </li>
            <li>Wait 30-60 seconds for AI to generate</li>
            <li>Click on the report to view it</li>
          </ol>
        </div>
      )
    },
    {
      id: "export",
      title: "Step 9: Export Your Report",
      icon: <FileDown className="w-5 h-5" />,
      content: (
        <ol className="list-decimal list-inside space-y-2 text-slate-700">
          <li>Open any report</li>
          <li>Choose export option:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>"Export PDF"</strong>: Download as PDF file</li>
              <li><strong>"Export Word"</strong>: Download as editable Word document</li>
              <li><strong>"Print"</strong>: Print directly</li>
              <li><strong>"Barrister View"</strong>: Professional presentation format</li>
            </ul>
          </li>
        </ol>
      )
    },
    {
      id: "barrister",
      title: "Step 10: Barrister View",
      icon: <Eye className="w-5 h-5" />,
      content: (
        <ol className="list-decimal list-inside space-y-2 text-slate-700">
          <li>Open any report</li>
          <li>Click <strong>"Barrister View"</strong> button</li>
          <li>This shows a clean, professional A4 format with:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Case information</li>
              <li>All Grounds of Merit prominently displayed</li>
              <li>Law sections and similar cases</li>
              <li>Supporting evidence</li>
            </ul>
          </li>
          <li>Use <strong>"Export PDF"</strong> or <strong>"Print"</strong> from this view</li>
        </ol>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  User Guide
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Introduction */}
        <Card className="mb-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Welcome to Criminal Appeal AI
            </h2>
            <p className="text-slate-300 mb-4">
              This guide will walk you through using all features of the app to build and analyze your criminal appeal case.
            </p>
            <div className="flex items-center gap-2 text-amber-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">Click on any section below to expand the instructions</span>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="space-y-4">
          {sections.map((section) => (
            <Card 
              key={section.id}
              className={`cursor-pointer transition-all ${
                expandedSection === section.id ? 'ring-2 ring-amber-500' : 'hover:shadow-md'
              }`}
            >
              <CardContent className="p-0">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                      {section.icon}
                    </div>
                    <span className="font-semibold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      {section.title}
                    </span>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedSection === section.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                    <div className="pt-4 pl-13">
                      {section.content}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              💡 Tips for Best Results
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <p className="font-medium mb-2">Document Tips:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Upload clear, readable documents</li>
                  <li>Use OCR Scan for scanned documents</li>
                  <li>Extract text before using AI features</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">AI Features Tips:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>More documents = better AI analysis</li>
                  <li>AI may take 30-60 seconds - be patient</li>
                  <li>Review and edit AI-generated content</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Quick Reference
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 font-medium text-slate-600">Feature</th>
                    <th className="text-left py-2 font-medium text-slate-600">Location</th>
                    <th className="text-left py-2 font-medium text-slate-600">Button</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-b border-slate-100"><td className="py-2">Upload Documents</td><td>Documents tab</td><td>"Upload Document"</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2">Extract Text</td><td>Documents tab</td><td>"Extract Text"</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2">OCR Scan</td><td>Documents tab</td><td>"OCR Scan"</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2">Search Documents</td><td>Documents tab</td><td>Search bar</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2">Auto Timeline</td><td>Timeline tab</td><td>"AI Generate Timeline"</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2">Find Grounds</td><td>Grounds tab</td><td>"AI Identify Grounds"</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2">Investigate Ground</td><td>Grounds tab</td><td>"Investigate" button</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2">Add Notes</td><td>Notes tab</td><td>"Add Note"</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2">Generate Report</td><td>Reports tab</td><td>"Generate Report"</td></tr>
                  <tr><td className="py-2">Export PDF/Word</td><td>Report view</td><td>"Export PDF" / "Export Word"</td></tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p className="font-medium">Deb King, Glenmore Park 2745</p>
          <p className="italic">One woman's fight for justice — seeking truth for Joshua Homann, failed by the system</p>
        </div>
      </main>
    </div>
  );
};

export default HelpPage;
