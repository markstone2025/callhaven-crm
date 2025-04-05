
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Recording } from "@/types/recording";
import { RecordingItem } from "./RecordingItem";
import { RecordingDetails } from "./RecordingDetails";
import { getMockRecordings } from "@/data/mockRecordings";

interface ContactCallRecordingsProps {
  contactId: string;
  contactName: string;
}

export function ContactCallRecordings({ contactId, contactName }: ContactCallRecordingsProps) {
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mockRecordings = getMockRecordings(contactName);
  
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
          <RecordingDetails 
            recording={selectedRecording}
            onBack={() => setSelectedRecording(null)}
          />
        ) : (
          <>
            {mockRecordings.length > 0 ? (
              <div className="space-y-3">
                {mockRecordings.map(recording => (
                  <RecordingItem
                    key={recording.id}
                    recording={recording}
                    onPlay={handlePlayRecording}
                  />
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
