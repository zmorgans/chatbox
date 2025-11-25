import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Award, Lightbulb, ChevronDown, ChevronUp, Download, AlertCircle } from "lucide-react";

export default function Feedback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, stance, messages } = location.state || {};

  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);

  useEffect(() => {
    if (!topic || !stance || !messages) {
      navigate(createPageUrl("Home"));
    }
  }, [topic, stance, messages, navigate]);

  const buildTranscript = () => {
    return messages
      .map(
        (msg) =>
          `[${msg.round.toUpperCase()}] ${msg.role === "user" ? "USER" : "AI"}: ${msg.text}`
      )
      .join("\n\n");
  };

  const judgeTranscript = async () => {
    const transcript = buildTranscript();
    
    const userArguments = messages.filter(m => m.role === "user").map(m => m.text).join("\n\n");
    const aiArguments = messages.filter(m => m.role === "ai").map(m => m.text).join("\n\n");
    
    const prompt = `You are an expert NSDA-aligned debate coach and judge. Analyze the USER's debate performance against the AI opponent.

DEBATE CONTEXT:
- Topic: "${topic}"
- User's Stance: ${stance}

USER'S ARGUMENTS:
${userArguments}

AI OPPONENT'S COUNTER-ARGUMENTS:
${aiArguments}

FULL TRANSCRIPT:
${transcript}

YOUR TASK:
1. Score the USER's performance (1-5) on each criterion:
   - Clarity: How clear, concise, and understandable were their arguments?
   - Logic: How logical, coherent, and well-reasoned were their arguments?
   - Evidence: Did they provide facts, examples, statistics, or credible sources?
   - Structure: Did they follow claim-reason-evidence format? Were arguments organized?

2. Analyze what the USER did well and what they missed when countering the AI's arguments.

3. Provide 4 specific, actionable tips:
   - 2 tips on how to STRENGTHEN their existing arguments
   - 2 tips on how to better COUNTER the AI opponent's points

4. Write a detailed summary analyzing the debate performance.

Be specific! Reference actual quotes or points from the debate in your feedback.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: prompt,
      add_context_from_internet: false,
      response_json_schema: {
        type: "object",
        properties: {
          clarity: { type: "number", description: "Score 1-5" },
          logic: { type: "number", description: "Score 1-5" },
          evidence: { type: "number", description: "Score 1-5" },
          structure: { type: "number", description: "Score 1-5" },
          strengths: { type: "array", items: { type: "string" }, description: "What user did well" },
          weaknesses: { type: "array", items: { type: "string" }, description: "Areas that need improvement" },
          tips: { type: "array", items: { type: "string" }, description: "4 specific actionable tips" },
          counter_analysis: { type: "string", description: "Analysis of how well user countered AI arguments" },
          summary: { type: "string", description: "Overall performance summary" }
        }
      }
    });

    result.score_total = result.clarity + result.logic + result.evidence + result.structure;
    return result;
  };

  const getOppositeStance = (userStance) => {
    if (userStance === "Pro") return "Con";
    if (userStance === "Con") return "Pro";
    return "Balanced Counter-position";
  };

  const handleGetFeedback = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await judgeTranscript();
      setFeedback(result);
      
      // Save debate to database
      await base44.entities.Debate.create({
        topic,
        user_stance: stance,
        ai_stance: getOppositeStance(stance),
        messages,
        feedback: result,
        score_total: result.score_total
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    navigate(createPageUrl("Export"), {
      state: { topic, stance, messages, feedback }
    });
  };

  if (!topic || !stance || !messages) {
    return null;
  }

  const scoreColor = (score) => {
    if (score >= 4) return "text-green-400";
    if (score >= 3) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full text-sm mb-4">
          <Award className="w-4 h-4" />
          <span>NSDA-Style Judging</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Debate Feedback</h2>
        <p className="text-gray-400">
          Topic: <span className="text-white font-medium">{topic}</span>
        </p>
      </div>

      {/* Get Feedback Button */}
      {!feedback && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-gray-300">Ready to receive your performance evaluation?</p>
            <Button
              onClick={handleGetFeedback}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Your Debate...
                </>
              ) : (
                <>
                  <Award className="w-5 h-5 mr-2" />
                  Get Feedback
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={handleGetFeedback} className="ml-4">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Feedback Results */}
      {feedback && (
        <>
          {/* Score Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: "Clarity", score: feedback.clarity },
              { label: "Logic", score: feedback.logic },
              { label: "Evidence", score: feedback.evidence },
              { label: "Structure", score: feedback.structure },
            ].map((item) => (
              <Card key={item.label} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardDescription className="text-gray-400 text-sm">{item.label}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${scoreColor(item.score)}`}>
                      {item.score}
                    </span>
                    <span className="text-gray-500">/5</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Total Score */}
          <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Total Score</p>
                  <p className="text-5xl font-bold text-white">{feedback.score_total}</p>
                </div>
                <Badge className="bg-purple-600 text-white text-lg px-4 py-2">
                  {feedback.score_total >= 16
                    ? "Excellent"
                    : feedback.score_total >= 12
                    ? "Good"
                    : "Needs Work"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {feedback.summary && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">{feedback.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-4">
            {feedback.strengths && feedback.strengths.length > 0 && (
              <Card className="bg-green-900/20 border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-400 text-lg">✓ What You Did Well</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feedback.strengths.map((item, index) => (
                      <li key={index} className="text-gray-300 text-sm flex gap-2">
                        <span className="text-green-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {feedback.weaknesses && feedback.weaknesses.length > 0 && (
              <Card className="bg-red-900/20 border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-400 text-lg">✗ Areas to Improve</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feedback.weaknesses.map((item, index) => (
                      <li key={index} className="text-gray-300 text-sm flex gap-2">
                        <span className="text-red-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Counter Analysis */}
          {feedback.counter_analysis && (
            <Card className="bg-blue-900/20 border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-400 text-lg">⚔️ Counter-Argument Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">{feedback.counter_analysis}</p>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Actionable Tips for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feedback.tips && feedback.tips.map((tip, index) => (
                  <li key={index} className="flex gap-3">
                    <Badge className="bg-yellow-600 text-white flex-shrink-0">{index + 1}</Badge>
                    <p className="text-gray-300">{tip}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Raw JSON */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="flex items-center justify-between w-full text-left"
              >
                <CardTitle className="text-white">Raw JSON Response</CardTitle>
                {showRawJson ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </CardHeader>
            {showRawJson && (
              <CardContent>
                <pre className="bg-gray-900 p-4 rounded-lg text-xs text-gray-300 overflow-x-auto">
                  {JSON.stringify(feedback, null, 2)}
                </pre>
              </CardContent>
            )}
          </Card>

          {/* Export Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Export Full Report
            </Button>
          </div>
        </>
      )}
    </div>
  );
}