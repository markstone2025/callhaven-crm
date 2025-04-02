
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";

export function VapiIntegration() {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("vapi_api_key") || "";
  });
  
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("vapi_api_key"));
  });
  
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid VAPI API key",
        variant: "destructive"
      });
      return;
    }

    // Save API key to localStorage
    localStorage.setItem("vapi_api_key", apiKey);
    setIsConnected(true);
    
    toast({
      title: "Success",
      description: "VAPI API key saved successfully",
    });
  };

  const handleDisconnect = () => {
    localStorage.removeItem("vapi_api_key");
    setApiKey("");
    setIsConnected(false);
    
    toast({
      title: "Disconnected",
      description: "VAPI API integration has been disconnected",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          VAPI Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your VAPI integration is active. You can view and listen to call recordings with advanced AI analysis.
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
              <Button
                variant="default"
                onClick={() => window.open("https://vapi.ai/dashboard", "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open VAPI Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect to VAPI to enhance your call recordings with advanced transcription, analytics, and AI-powered insights.
            </p>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your VAPI API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can find your API key in your <a href="https://vapi.ai/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">VAPI dashboard</a>
              </p>
            </div>
            <Button onClick={handleSaveApiKey}>Connect to VAPI</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default VapiIntegration;
