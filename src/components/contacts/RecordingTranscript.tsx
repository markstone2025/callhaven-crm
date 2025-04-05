
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TranscriptProps {
  transcript: {
    text: string;
    highlights?: { time: string; text: string }[];
  };
}

export function RecordingTranscript({ transcript }: TranscriptProps) {
  return (
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
                {transcript.text}
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
              {transcript.highlights ? (
                <div className="space-y-3">
                  {transcript.highlights.map((highlight, index) => (
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
  );
}
