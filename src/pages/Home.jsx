import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Target, Users } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [stance, setStance] = useState("");

  const handleStartDebate = () => {
    if (!topic.trim()) {
      alert("Please enter a debate topic");
      return;
    }
    if (!stance) {
      alert("Please select your stance");
      return;
    }

    navigate(createPageUrl("Debate"), {
      state: { topic: topic.trim(), stance }
    });
  };

  const exampleTopics = [
    "Should cities ban gas cars by 2035?",
    "Is social media harmful to democracy?",
    "Should college education be free?",
    "Is artificial intelligence a threat to humanity?"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Debate Practice</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Sharpen Your Debate Skills
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Practice debating with an AI opponent that challenges your arguments across three rounds. 
          Get NSDA-style feedback to improve your performance.
        </p>
      </div>

      {/* Main Form Card */}
      <Card className="bg-gray-800 border-gray-700 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Start a New Debate</CardTitle>
          <CardDescription className="text-gray-400">
            Choose your topic and stance to begin a 3-round debate session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-gray-200">Debate Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Should cities ban gas cars by 2035?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
              maxLength={200}
            />
            <p className="text-xs text-gray-500">{topic.length}/200 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stance" className="text-gray-200">Your Stance</Label>
            <Select value={stance} onValueChange={setStance}>
              <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                <SelectValue placeholder="Select your position" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="Pro" className="text-white">Pro (Support)</SelectItem>
                <SelectItem value="Con" className="text-white">Con (Oppose)</SelectItem>
                <SelectItem value="Neutral" className="text-white">Neutral (Balanced)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleStartDebate}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-lg"
          >
            <Target className="w-5 h-5 mr-2" />
            Start Debate
          </Button>
        </CardContent>
      </Card>

      {/* Example Topics */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Popular Debate Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {exampleTopics.map((example, index) => (
              <button
                key={index}
                onClick={() => setTopic(example)}
                className="text-left px-4 py-3 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white"
              >
                {example}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}