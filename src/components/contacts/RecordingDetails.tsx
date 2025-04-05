
import { Button } from "@/components/ui/button";
import { RecordingPlayer } from "@/components/RecordingPlayer";
import { RecordingTranscript } from "./RecordingTranscript";
import { Calendar, Clock, Phone, User } from "lucide-react";
import { Recording } from "@/types/recording";

interface RecordingDetailsProps {
  recording: Recording;
  onBack: () => void;
}

export function RecordingDetails({ recording, onBack }: RecordingDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
        >
          Back to recordings
        </Button>
        <div className="text-sm text-muted-foreground">
          {new Date(recording.date).toLocaleDateString()} • {recording.duration}
        </div>
      </div>
      
      <h2 className="text-xl font-semibold">{recording.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Caller: {recording.caller}</span>
        </div>
        <div className="flex items-center text-sm">
          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Recipient: {recording.recipient}</span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Date: {new Date(recording.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Duration: {recording.duration}</span>
        </div>
      </div>
      
      <RecordingPlayer 
        src={recording.source}
        title={recording.title}
      />
      
      {recording.transcript && (
        <RecordingTranscript transcript={recording.transcript} />
      )}
    </div>
  );
}
