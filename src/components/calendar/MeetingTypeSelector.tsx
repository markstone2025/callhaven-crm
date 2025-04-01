
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeetingType {
  id: string;
  name: string;
  icon: React.ReactNode;
  duration: number;
}

interface MeetingTypeSelectorProps {
  meetingTypes: MeetingType[];
  selectedType: string;
  onSelectType: (type: string) => void;
}

export function MeetingTypeSelector({ 
  meetingTypes, 
  selectedType, 
  onSelectType 
}: MeetingTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {meetingTypes.map((type) => (
        <button
          key={type.id}
          type="button"
          className={cn(
            "flex items-center space-x-3 p-2 rounded-md border transition-all",
            selectedType === type.id 
              ? "border-primary bg-primary/5" 
              : "border-input hover:bg-accent"
          )}
          onClick={() => onSelectType(type.id)}
        >
          <div className={cn(
            "flex-shrink-0 rounded-full p-1.5",
            selectedType === type.id 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted"
          )}>
            {type.icon}
          </div>
          <div className="flex-grow text-left">
            <div className="font-medium text-sm">{type.name}</div>
            <div className="text-xs text-muted-foreground">{type.duration} min</div>
          </div>
          {selectedType === type.id && (
            <div className="text-primary">
              <Check className="h-4 w-4" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
