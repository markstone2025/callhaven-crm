
import { useEffect, useState } from "react";
import { useVapiService } from "@/components/VapiService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface VapiCall {
  id: string;
  title: string;
  audioUrl: string;
  transcriptUrl?: string;
  status: "processing" | "completed" | "failed";
}

export function VapiCallsWidget() {
  const [calls, setCalls] = useState<VapiCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchVapiCalls, openInVapi, isConnected } = useVapiService();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadCalls = async () => {
      setIsLoading(true);
      try {
        const data = await fetchVapiCalls();
        setCalls(data);
      } catch (error) {
        console.error("Failed to fetch VAPI calls:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCalls();
  }, [fetchVapiCalls]);

  const handlePlayRecording = (call: VapiCall) => {
    if (call.status === "processing") {
      toast({
        title: "Call still processing",
        description: "This recording is still being processed and is not available for playback yet.",
        variant: "default"
      });
      return;
    }
    
    // Navigate to Call Recordings page and focus on this call
    navigate(`/call-recordings?callId=${call.id}`);
  };

  if (!isConnected()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>VAPI Call Recordings</CardTitle>
          <CardDescription>Connect your VAPI account to view call recordings</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => navigate("/call-recordings#integration")}
          >
            Configure VAPI Integration
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent VAPI Call Recordings</CardTitle>
        <CardDescription>Your most recent call recordings from VAPI</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading VAPI calls...</div>
        ) : calls.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No VAPI call recordings found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">{call.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        call.status === "completed" 
                          ? "default" 
                          : call.status === "processing" 
                          ? "outline" 
                          : "destructive"
                      }
                    >
                      {call.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlayRecording(call)}
                        disabled={call.status !== "completed"}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openInVapi(call.id)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        VAPI
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="mt-4 text-right">
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate("/call-recordings")}
            className="text-xs"
          >
            View all recordings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default VapiCallsWidget;
