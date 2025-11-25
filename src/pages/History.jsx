import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, History as HistoryIcon, Eye, Trash2 } from "lucide-react";
import moment from "moment";

export default function History() {
  const navigate = useNavigate();

  const { data: debates, isLoading, refetch } = useQuery({
    queryKey: ["debates"],
    queryFn: () => base44.entities.Debate.list("-created_date", 50),
    initialData: [],
  });

  const handleView = (debate) => {
    navigate(createPageUrl("DebateView"), { state: { debate } });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this debate?")) {
      await base44.entities.Debate.delete(id);
      refetch();
    }
  };

  const scoreColor = (score) => {
    if (score >= 16) return "bg-green-600";
    if (score >= 12) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm mb-4">
          <HistoryIcon className="w-4 h-4" />
          <span>Debate History</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Past Debates</h2>
        <p className="text-gray-400">Review your previous debates and feedback</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : debates.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6 text-center py-12">
            <HistoryIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No debates yet. Start your first debate!</p>
            <Button onClick={() => navigate(createPageUrl("Home"))} className="bg-blue-600 hover:bg-blue-700">
              Start Debate
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {debates.map((debate) => (
            <Card key={debate.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate mb-2">{debate.topic}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className="bg-blue-600 text-white">You: {debate.user_stance}</Badge>
                      <Badge className="bg-purple-600 text-white">AI: {debate.ai_stance}</Badge>
                      {debate.score_total && (
                        <Badge className={`${scoreColor(debate.score_total)} text-white`}>
                          Score: {debate.score_total}/20
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {moment(debate.created_date).format("MMM D, YYYY h:mm A")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleView(debate)} className="bg-blue-600 hover:bg-blue-700">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(debate.id)} className="border-red-600 text-red-400 hover:bg-red-600/20">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}