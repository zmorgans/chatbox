import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function RoundTimer({ initialSeconds = 120 }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const percentage = (seconds / initialSeconds) * 100;
  const isLowTime = seconds <= 30 && seconds > 0;
  const isTimeUp = seconds === 0;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-700"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - percentage / 100)}`}
            className={`transition-all ${
              isTimeUp ? "text-red-500" : isLowTime ? "text-yellow-500" : "text-blue-500"
            }`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-sm font-bold ${
              isTimeUp ? "text-red-400" : isLowTime ? "text-yellow-400" : "text-gray-200"
            }`}
          >
            {formatTime(seconds)}
          </span>
        </div>
      </div>

      <div className="flex gap-1">
        <Button
          size="icon"
          variant="outline"
          onClick={handleStartPause}
          className="bg-gray-700 border-gray-600 hover:bg-gray-600"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={handleReset}
          className="bg-gray-700 border-gray-600 hover:bg-gray-600"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}