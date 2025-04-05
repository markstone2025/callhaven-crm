
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Play, User } from "lucide-react";
import { Recording } from "@/types/recording";

interface RecordingItemProps {
  recording: Recording;
  onPlay: (recording: Recording) => void;
}

export function RecordingItem({ recording, onPlay }: RecordingItemProps) {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-0">
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
        onClick={() => onPlay(recording)}
      >
        <Play className="h-3.5 w-3.5" />
        Listen
      </Button>
    </div>
  );
}
