import React from "react";
import { User, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TranscriptBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row" : "flex-row-reverse"}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-blue-600" : "bg-purple-600"
        }`}
      >
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      <div className={`flex-1 ${isUser ? "items-start" : "items-end"} flex flex-col gap-1`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${isUser ? "text-blue-400" : "text-purple-400"}`}>
            {isUser ? "You" : "AI Opponent"}
          </span>
          <Badge
            variant="outline"
            className={`text-xs ${
              message.round === "opening"
                ? "border-green-500 text-green-400"
                : message.round === "rebuttal"
                ? "border-yellow-500 text-yellow-400"
                : "border-red-500 text-red-400"
            }`}
          >
            {message.round.toUpperCase()}
          </Badge>
        </div>
        <div
          className={`rounded-lg px-4 py-3 max-w-2xl ${
            isUser ? "bg-gray-700 text-gray-100" : "bg-gray-800 text-gray-100"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    </div>
  );
}