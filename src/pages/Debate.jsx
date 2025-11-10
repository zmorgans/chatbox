import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Send, ChevronRight, Flag, AlertCircle } from "lucide-react";
import RoundTimer from "../components/RoundTimer";
import TranscriptBubble from "../components/TranscriptBubble";

const ROUNDS = ["opening", "rebuttal", "closing"];

export default function Debate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, stance } = location.state || {};

  const [roundIndex, setRoundIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!topic || !stance) {
      navigate(createPageUrl("Home"));
    }
  }, [topic, stance, navigate]);

  const getOppositeStance = (userStance) => {
    if (userStance === "Pro") return "Con";
    if (userStance === "Con") return "Pro";
    return "Balanced Counter-position";
  };

  const generateOpponentTurn = async (userText, round) => {
    const aiStance = getOppositeStance(stance);
    
    const prompt = `You are an expert competitive debater. Always argue the opposite stance from the user. The user is taking the ${stance} position, so you MUST take the ${aiStance} position on the topic: "${topic}".

Structure your response as follows:
1. Claim: State your position clearly
2. Reasons: Provide 2-3 strong reasons
3. Evidence: Include brief supporting evidence
4. Mini-conclusion: Wrap up your argument

Keep your response between 120-180 words. Use a respectful, professional tone. This is the ${round} round.

Topic: ${topic}
User's stance: ${stance}
Your stance: ${aiStance}
Round: ${round}

User's argument:
${userText}

Provide your counter-argument following the required structure.`;

    const aiText = await base44.integrations.Core.InvokeLLM({
      prompt: prompt,
      add_context_from_internet: false
    });

    return aiText;
  };

  const handleSendArgument = async () => {
    if (!userInput.trim()) {
      return;
    }

    const currentRound = ROUNDS[roundIndex];
    const userMessage = {
      role: "user",
      round: currentRound,
      text: userInput.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsGenerating(true);
    setError(null);

    try {
      const aiText = await generateOpponentTurn(userInput.trim(), currentRound);
      
      const aiMessage = {
        role: "ai",
        round: currentRound,
        text: aiText
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextRound = () => {
    if (roundIndex < ROUNDS.length - 1) {
      setRoundIndex(roundIndex + 1);
    }
  };

  const handleFinish = () => {
    navigate(createPageUrl("Feedback"), {
      state: { topic, stance, messages }
    });
  };

  const canProceed = messages.filter((m) => m.round === ROUNDS[roundIndex]).length >= 2;
  const isLastRound = roundIndex === ROUNDS.length - 1;

  if (!topic || !stance) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Bar */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <div>
              <p className="text-xs text-gray-400 mb-1">Topic</p>
              <p className="text-sm font-medium text-white">{topic}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Your Stance</p>
              <Badge className="bg-blue-600 text-white">{stance}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Round</p>
                <Badge
                  className={`${
                    roundIndex === 0
                      ? "bg-green-600"
                      : roundIndex === 1
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  } text-white uppercase`}
                >
                  {ROUNDS[roundIndex]}
                </Badge>
              </div>
              <RoundTimer initialSeconds={120} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setError(null)}
              className="ml-4"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Debate Area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: User Input */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Your Argument</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`Enter your ${ROUNDS[roundIndex]} argument...`}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="bg-gray-900 border-gray-600 text-white min-h-[200px] resize-none"
              disabled={isGenerating}
            />
            <Button
              onClick={handleSendArgument}
              disabled={!userInput.trim() || isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating AI Response...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Argument
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right: AI Response */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">AI Opponent Response</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[200px] flex items-center justify-center">
            {isGenerating ? (
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto" />
                <p className="text-sm text-gray-400">AI is crafting a counter-argument...</p>
              </div>
            ) : messages.filter((m) => m.role === "ai" && m.round === ROUNDS[roundIndex]).length >
              0 ? (
              <div className="w-full bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">
                  {
                    messages.filter((m) => m.role === "ai" && m.round === ROUNDS[roundIndex])[0]
                      .text
                  }
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">AI response will appear here after you send your argument</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transcript Panel */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Full Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No messages yet. Start the debate by sending your opening argument.
            </p>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {messages.map((message, index) => (
                <TranscriptBubble key={index} message={message} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        {!isLastRound && (
          <Button
            onClick={handleNextRound}
            disabled={!canProceed || isGenerating}
            variant="outline"
            className="bg-gray-700 border-gray-600 hover:bg-gray-600"
          >
            Next Round
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
        {isLastRound && canProceed && (
          <Button
            onClick={handleFinish}
            disabled={isGenerating}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Flag className="w-4 h-4 mr-2" />
            Finish & Get Feedback
          </Button>
        )}
      </div>
    </div>
  );
}