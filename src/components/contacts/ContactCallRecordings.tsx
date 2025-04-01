
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Download 
} from "lucide-react";
import { RecordingPlayer } from "@/components/RecordingPlayer";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CallRecording {
  id: string;
  date: string;
  duration: string;
  agentName: string;
  fileUrl: string;
  transcript?: string;
  summary?: {
    sentiment: "positive" | "neutral" | "negative";
    keyPoints: string[];
    actionItems?: string[];
  };
}

interface ContactCallRecordingsProps {
  contactId: string;
  contactName: string;
}

export function ContactCallRecordings({ 
  contactId, 
  contactName 
}: ContactCallRecordingsProps) {
  const [selectedRecording, setSelectedRecording] = useState<CallRecording | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Mock data for call recordings
  const mockRecordings: CallRecording[] = [
    {
      id: "rec-1",
      date: "2023-09-15T14:30:00",
      duration: "12:45",
      agentName: "Sarah Johnson",
      fileUrl: "https://example.com/recordings/call1.mp3",
      transcript: "Agent: Hi, this is Sarah from Acme Corp. How are you today?\n\nCustomer: I'm doing well, thanks for asking.\n\nAgent: Great! I'm calling to follow up on the proposal we sent last week. Have you had a chance to review it?\n\nCustomer: Yes, I have. I had a few questions about pricing.\n\nAgent: I'd be happy to address those questions. Which part of the pricing were you concerned about?",
      summary: {
        sentiment: "positive",
        keyPoints: [
          "Customer has reviewed the proposal",
          "Customer has questions about pricing",
          "Customer expressed interest in moving forward after pricing clarification"
        ],
        actionItems: [
          "Send updated pricing breakdown",
          "Schedule follow-up call next week",
          "Prepare demo for specific features customer mentioned"
        ]
      }
    },
    {
      id: "rec-2",
      date: "2023-08-22T10:15:00",
      duration: "08:20",
      agentName: "Michael Brown",
      fileUrl: "https://example.com/recordings/call2.mp3",
      transcript: "Agent: Hello, this is Michael from Acme Corp. Am I speaking with John?\n\nCustomer: Yes, that's me.\n\nAgent: I'm calling to check in and see how things are going with the current service.\n\nCustomer: It's been working well, but we're experiencing some issues with the reporting feature.\n\nAgent: I'm sorry to hear that. Can you tell me more about the specific problems you're facing?",
      summary: {
        sentiment: "neutral",
        keyPoints: [
          "Customer reported issues with reporting feature",
          "Customer is otherwise satisfied with service",
          "Technical support ticket was created during the call"
        ]
      }
    }
  ];

  const handlePlayRecording = (recording: CallRecording) => {
    setSelectedRecording(recording);
    setShowTranscript(false);
  };
  
  const toggleTranscript = () => {
    setShowTranscript(!showTranscript);
  };

  const renderSummary = (summary: CallRecording['summary']) => {
    if (!summary) return null;
    
    const sentimentColor = {
      positive: "bg-green-100 text-green-800",
      neutral: "bg-blue-100 text-blue-800",
      negative: "bg-red-100 text-red-800"
    };
    
    return (
      <div className="space-y-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Call Sentiment:</span>
          <Badge className={sentimentColor[summary.sentiment]}>
            {summary.sentiment.charAt(0).toUpperCase() + summary.sentiment.slice(1)}
          </Badge>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Key Points:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {summary.keyPoints.map((point, i) => (
              <li key={i} className="text-sm">{point}</li>
            ))}
          </ul>
        </div>
        
        {summary.actionItems && (
          <div>
            <h4 className="text-sm font-medium mb-2">Action Items:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {summary.actionItems.map((item, i) => (
                <li key={i} className="text-sm">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Recordings</CardTitle>
        <CardDescription>
          Recent calls with {contactName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mockRecordings.length > 0 ? (
          <div className="space-y-6">
            {selectedRecording ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      Call with {contactName} - {new Date(selectedRecording.date).toLocaleDateString()}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Agent: {selectedRecording.agentName} • Duration: {selectedRecording.duration}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedRecording(null)}>
                    Back to list
                  </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <RecordingPlayer />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={toggleTranscript}
                    className="gap-1"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    {showTranscript ? "Hide Transcript" : "Show Transcript"}
                    {showTranscript ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <Download className="h-4 w-4 mr-1" />
                    Download Recording
                  </Button>
                </div>
                
                {showTranscript && selectedRecording.transcript && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="transcript">
                      <AccordionTrigger>Transcript</AccordionTrigger>
                      <AccordionContent>
                        <div className="whitespace-pre-line bg-muted p-3 rounded-md text-sm">
                          {selectedRecording.transcript}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="summary">
                      <AccordionTrigger>Call Summary</AccordionTrigger>
                      <AccordionContent>
                        {selectedRecording.summary ? (
                          renderSummary(selectedRecording.summary)
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No summary available for this call.
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {mockRecordings.map((recording) => (
                  <div 
                    key={recording.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium">
                        {new Date(recording.date).toLocaleDateString()} - {new Date(recording.date).toLocaleTimeString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Agent: {recording.agentName} • Duration: {recording.duration}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handlePlayRecording(recording)}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No call recordings found for this contact.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
