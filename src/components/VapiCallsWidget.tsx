
import { useEffect, useState } from "react";
import { useVapiService } from "@/components/VapiService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Play, BarChart2, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface VapiCall {
  id: string;
  title: string;
  audioUrl: string;
  transcriptUrl?: string;
  status: "processing" | "completed" | "failed";
  duration?: string;
  date?: string;
  sentiment?: "positive" | "negative" | "neutral";
  keywords?: string[];
}

interface VapiCallsWidgetProps {
  showDetailed?: boolean;
}

export function VapiCallsWidget({ showDetailed = false }: VapiCallsWidgetProps) {
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
        // Add mock data for demonstration
        const enhancedData = data.map(call => ({
          ...call,
          duration: call.id === "vapi-1" ? "4m 32s" : call.id === "vapi-2" ? "12m 18s" : call.id === "vapi-3" ? "2m 05s" : "8m 45s",
          date: call.id === "vapi-1" ? "2023-04-03" : call.id === "vapi-2" ? "2023-04-02" : call.id === "vapi-3" ? "2023-04-01" : "2023-03-30",
          sentiment: call.id === "vapi-1" ? "positive" : call.id === "vapi-2" ? "neutral" : call.id === "vapi-3" ? "negative" : "positive",
          keywords: call.id === "vapi-1" 
            ? ["pricing", "features", "demo"] 
            : call.id === "vapi-2" 
            ? ["integration", "support", "timeline"] 
            : call.id === "vapi-3"
            ? ["issue", "bug", "resolution"]
            : ["onboarding", "training", "setup"]
        }));
        setCalls(enhancedData);
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
        <CardTitle>{showDetailed ? "VAPI Call Analytics" : "Recent VAPI Call Recordings"}</CardTitle>
        <CardDescription>{showDetailed ? "Detailed analysis of your call recordings from VAPI" : "Your most recent call recordings from VAPI"}</CardDescription>
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
                <TableHead className="w-[250px]">Title</TableHead>
                {showDetailed && (
                  <>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Keywords</TableHead>
                  </>
                )}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">{call.title}</TableCell>
                  {showDetailed && (
                    <>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {new Date(call.date || "").toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {call.duration}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            call.sentiment === "positive" 
                              ? "default" 
                              : call.sentiment === "negative"
                              ? "destructive"
                              : "outline"
                          }
                          className={
                            call.sentiment === "positive"
                              ? "bg-green-500"
                              : call.sentiment === "negative"
                              ? "bg-red-500"
                              : ""
                          }
                        >
                          {call.sentiment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {call.keywords?.slice(0, 3).map((keyword, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </>
                  )}
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
        {!showDetailed && (
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
        )}
      </CardContent>
    </Card>
  );
}

export default VapiCallsWidget;
