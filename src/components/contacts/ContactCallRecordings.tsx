
// Import statements and interfaces
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecordingPlayer } from "@/components/RecordingPlayer";
import { Play, Calendar, Clock, Phone, User, FileText } from "lucide-react";

interface Recording {
  id: string;
  title: string;
  date: string;
  duration: string;
  caller: string;
  recipient: string;
  source: string;
  transcript?: {
    text: string;
    highlights?: { time: string; text: string }[];
  };
}

interface ContactCallRecordingsProps {
  contactId: string;
  contactName: string;
}

export function ContactCallRecordings({ contactId, contactName }: ContactCallRecordingsProps) {
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mockRecordings: Recording[] = [
    {
      id: "rec1",
      title: "Initial Discovery Call",
      date: "2023-06-10",
      duration: "28:45",
      caller: "Sarah Johnson",
      recipient: contactName,
      source: "/static/recording1.mp3",
      transcript: {
        text: "Hello, this is Sarah from Acme Corp. I'm calling about our enterprise solution. We discussed upgrading your plan last quarter.\n\nYes, I remember. We've been evaluating several options.\n\nGreat. I'd like to schedule a demo with our technical team to show you the new features.\n\nThat sounds good. Can we do it next week?\n\nAbsolutely. How about Tuesday at 2 PM?\n\nTuesday works. I'll have my team join as well.\n\nPerfect. I'll send a calendar invite with all the details.",
        highlights: [
          { time: "02:15", text: "Discussed upgrading plan from last quarter" },
          { time: "05:30", text: "Client evaluating multiple vendor options" },
          { time: "12:45", text: "Scheduled technical demo for next Tuesday" },
          { time: "18:20", text: "Client team will join the demo call" }
        ]
      }
    },
    {
      id: "rec2",
      title: "Product Demo Follow-up",
      date: "2023-07-15",
      duration: "35:12",
      caller: contactName,
      recipient: "Mark Wilson",
      source: "/static/recording2.mp3",
      transcript: {
        text: "Hi Mark, this is [Client Name]. I wanted to follow up on the demo we had last week.\n\nHi there! Thanks for calling. What did you think of the demo?\n\nIt was impressive. My team had a few questions about the implementation timeline.\n\nOf course. Typically, our implementation takes about 4-6 weeks depending on the complexity.\n\nThat works for our timeline. We're also concerned about data migration.\n\nWe have a dedicated migration team that handles that. They can create a custom plan for your specific needs.\n\nExcellent. I think we're ready to move forward. Can you send over the proposal with the pricing we discussed?\n\nAbsolutely. I'll have that to you by end of day tomorrow. Is there anything specific you'd like me to include?\n\nPlease include the implementation timeline and support details.\n\nWill do. Thanks for your time today!",
        highlights: [
          { time: "01:30", text: "Client impressed with product demo" },
          { time: "04:15", text: "Implementation timeline: 4-6 weeks" },
          { time: "10:20", text: "Data migration concerns addressed" },
          { time: "15:45", text: "Client ready to move forward" },
          { time: "18:30", text: "Proposal with pricing to be sent" }
        ]
      }
    },
    {
      id: "rec3",
      title: "Contract Discussion",
      date: "2023-08-05",
      duration: "22:18",
      caller: "Emily Chen",
      recipient: contactName,
      source: "/static/recording3.mp3"
    },
  ];
  
  const handlePlayRecording = (recording: Recording) => {
    setSelectedRecording(recording);
    setIsPlaying(true);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Call Recordings</h3>
        </div>
        
        {selectedRecording ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedRecording(null)}
              >
                Back to recordings
              </Button>
              <div className="text-sm text-muted-foreground">
                {new Date(selectedRecording.date).toLocaleDateString()} • {selectedRecording.duration}
              </div>
            </div>
            
            <h2 className="text-xl font-semibold">{selectedRecording.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Caller: {selectedRecording.caller}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Recipient: {selectedRecording.recipient}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Date: {new Date(selectedRecording.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Duration: {selectedRecording.duration}</span>
              </div>
            </div>
            
            <RecordingPlayer 
              src={selectedRecording.source}
              title={selectedRecording.title}
            />
            
            {selectedRecording.transcript && (
              <div className="mt-6">
                <Tabs defaultValue="transcript">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="transcript">Full Transcript</TabsTrigger>
                    <TabsTrigger value="highlights">Key Highlights</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="transcript" className="mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2 mb-4">
                          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <h4 className="font-medium">Call Transcript</h4>
                        </div>
                        <p className="whitespace-pre-line text-sm">
                          {selectedRecording.transcript.text}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="highlights" className="mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2 mb-4">
                          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <h4 className="font-medium">Key Highlights</h4>
                        </div>
                        {selectedRecording.transcript.highlights ? (
                          <div className="space-y-3">
                            {selectedRecording.transcript.highlights.map((highlight, index) => (
                              <div key={index} className="border-l-2 border-primary pl-3 py-1">
                                <div className="text-xs text-muted-foreground mb-1">
                                  {highlight.time}
                                </div>
                                <p className="text-sm">{highlight.text}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No highlights available for this call.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        ) : (
          <>
            {mockRecordings.length > 0 ? (
              <div className="space-y-3">
                {mockRecordings.map(recording => (
                  <div 
                    key={recording.id} 
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{recording.title}</h4>
                      <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 mt-1">
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {new Date(recording.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {recording.duration}
                        </span>
                        <span className="flex items-center">
                          <User className="h-3.5 w-3.5 mr-1" />
                          {recording.caller}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-4 gap-1"
                      onClick={() => handlePlayRecording(recording)}
                    >
                      <Play className="h-3.5 w-3.5" />
                      Listen
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No call recordings available for this contact.</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
