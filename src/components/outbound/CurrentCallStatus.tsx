
import { Phone, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  company?: string;
}

interface CurrentCallStatusProps {
  currentCall: Contact | null;
}

export function CurrentCallStatus({ currentCall }: CurrentCallStatusProps) {
  const [callDuration, setCallDuration] = useState(0);
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (currentCall) {
      setCallDuration(0);
      interval = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [currentCall]);
  
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!currentCall) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Phone className="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p>No active call</p>
        <p className="text-sm">Click "Call" on any contact to start an outbound call</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center py-4">
        <div className="text-lg font-medium">{currentCall.name}</div>
        <div className="text-muted-foreground">{currentCall.phoneNumber}</div>
        {currentCall.company && (
          <div className="text-sm text-muted-foreground">{currentCall.company}</div>
        )}
      </div>
      
      <div className="flex items-center justify-center gap-2 text-lg font-medium">
        <Clock className="h-5 w-5 text-green-500 animate-pulse" />
        <span>{formatDuration(callDuration)}</span>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        Call in progress...
      </div>
      
      <div className="text-center pt-2">
        <div className="inline-flex h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
      </div>
    </div>
  );
}
