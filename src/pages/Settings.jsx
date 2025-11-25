import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings as SettingsIcon, Key, Check, Eye, EyeOff, Lock } from "lucide-react";

const ACCESS_PASSWORD = "debate123";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("GEMINI_API_KEY") || "";
    setApiKey(storedKey);
  }, []);

  const handleUnlock = () => {
    if (password === ACCESS_PASSWORD) {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleSave = () => {
    localStorage.setItem("GEMINI_API_KEY", apiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    localStorage.removeItem("GEMINI_API_KEY");
    setApiKey("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gray-500/10 text-gray-400 px-4 py-2 rounded-full text-sm mb-4">
          <SettingsIcon className="w-4 h-4" />
          <span>Settings</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">API Configuration</h2>
        <p className="text-gray-400">Configure your Gemini API key for AI debates</p>
      </div>

      {!isUnlocked ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lock className="w-5 h-5" />
              Password Required
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter the access password to view and edit API settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-200">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                placeholder="Enter password"
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
            {passwordError && (
              <Alert className="bg-red-900/20 border-red-800">
                <AlertDescription className="text-red-300">Incorrect password</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleUnlock} className="bg-blue-600 hover:bg-blue-700 w-full">
              Unlock Settings
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Key className="w-5 h-5" />
              Gemini API Key
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your Google Gemini API key. Get one free at{" "}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Google AI Studio
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-200">API Key</Label>
              <div className="relative">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="bg-gray-900 border-gray-600 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                {saved ? <><Check className="w-4 h-4 mr-2" /> Saved!</> : "Save Key"}
              </Button>
              <Button onClick={handleClear} variant="outline" className="border-gray-600 hover:bg-gray-700">
                Clear
              </Button>
            </div>

            {saved && (
              <Alert className="bg-green-900/20 border-green-800">
                <AlertDescription className="text-green-300">API key saved successfully!</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-900/20 border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-200">
            💡 <strong>Note:</strong> Your API key is stored locally in your browser and never sent to our servers. 
            If no key is set, the app uses the built-in Base44 AI.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}