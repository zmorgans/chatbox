import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Lightbulb } from "lucide-react";
import TranscriptBubble from "../components/TranscriptBubble";
import moment from "moment";

export default function DebateView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { debate } = location.state || {};

  React.useEffect(() => {
    if (!debate) navigate(createPageUrl("History"));
  }, [debate, navigate]);

  if (!debate) return null;

  const scoreColor = (score) => {
    if (score >= 4) return "text-green-400";
    if (score >= 3) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(createPageUrl("History"))} className="text-gray-400 hover:text-white">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to History
      </Button>

      {/* Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold text-white mb-3">{debate.topic}</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge className="bg-blue-600 text-white">You: {debate.user_stance}</Badge>
            <Badge className="bg-purple-600 text-white">AI: {debate.ai_stance}</Badge>
          </div>
          <p className="text-sm text-gray-500">{moment(debate.created_date).format("MMMM D, YYYY h:mm A")}</p>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      {debate.feedback && (
        <>
          <div className="grid md:grid-cols-4 gap-4">
            {["clarity", "logic", "evidence", "structure"].map((key) => (
              <Card key={key} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <p className="text-gray-400 text-sm capitalize">{key}</p>
                </CardHeader>
                <CardContent>
                  <span className={`text-3xl font-bold ${scoreColor(debate.feedback[key])}`}>
                    {debate.feedback[key]}
                  </span>
                  <span className="text-gray-500">/5</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-700">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Score</p>
                <p className="text-4xl font-bold text-white">{debate.score_total}/20</p>
              </div>
              <Award className="w-12 h-12 text-purple-400" />
            </CardContent>
          </Card>

          {debate.feedback.summary && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader><CardTitle className="text-white">Summary</CardTitle></CardHeader>
              <CardContent><p className="text-gray-300">{debate.feedback.summary}</p></CardContent>
            </Card>
          )}

          {debate.feedback.tips && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Lightbulb className="w-5 h-5 text-yellow-400" /> Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {debate.feedback.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-gray-300">
                      <Badge className="bg-yellow-600">{i + 1}</Badge> {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Transcript */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader><CardTitle className="text-white">Full Transcript</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {debate.messages.map((msg, i) => (
              <TranscriptBubble key={i} message={msg} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}