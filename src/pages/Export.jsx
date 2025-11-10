import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Home, FileJson } from "lucide-react";

export default function Export() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, stance, messages, feedback } = location.state || {};

  React.useEffect(() => {
    if (!topic || !stance || !messages) {
      navigate(createPageUrl("Home"));
    }
  }, [topic, stance, messages, navigate]);

  const exportData = {
    topic,
    stance_user: stance,
    transcript: messages,
    feedback: feedback || null,
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `debate_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleStartNew = () => {
    navigate(createPageUrl("Home"));
  };

  if (!topic || !stance || !messages) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm mb-4">
          <FileJson className="w-4 h-4" />
          <span>Export Ready</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Export Debate Report</h2>
        <p className="text-gray-400">Download your complete debate transcript and feedback</p>
      </div>

      {/* Summary Card */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Debate Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Topic</p>
              <p className="text-white font-medium">{topic}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Your Stance</p>
              <p className="text-white font-medium">{stance}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Messages</p>
              <p className="text-white font-medium">{messages.length} exchanges</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Rounds Completed</p>
              <p className="text-white font-medium">3 (Opening, Rebuttal, Closing)</p>
            </div>
          </div>
          {feedback && (
            <div className="pt-3 border-t border-gray-700">
              <p className="text-sm text-gray-400">Final Score</p>
              <p className="text-3xl font-bold text-purple-400">{feedback.score_total}/20</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* JSON Preview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">JSON Preview</CardTitle>
          <CardDescription className="text-gray-400">
            Read-only preview of the export data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 rounded-lg p-4 max-h-[400px] overflow-y-auto">
            <pre className="text-xs text-gray-300 font-mono">
              {JSON.stringify(exportData, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleDownload}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Download JSON
        </Button>
        <Button
          onClick={handleStartNew}
          variant="outline"
          className="bg-gray-700 border-gray-600 hover:bg-gray-600"
          size="lg"
        >
          <Home className="w-5 h-5 mr-2" />
          Start New Debate
        </Button>
      </div>

      {/* Info Box */}
      <Card className="bg-blue-900/20 border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-200">
            💡 <strong>Tip:</strong> You can use this JSON file to review your debate performance,
            share with teachers, or import into other debate analysis tools.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}