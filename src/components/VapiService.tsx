
import { useToast } from "@/hooks/use-toast";

interface VapiCall {
  id: string;
  title: string;
  audioUrl: string;
  transcriptUrl?: string;
  status: "processing" | "completed" | "failed";
}

export function useVapiService() {
  const { toast } = useToast();
  
  const getApiKey = (): string | null => {
    return localStorage.getItem("vapi_api_key");
  };
  
  const isConnected = (): boolean => {
    return Boolean(getApiKey());
  };
  
  const fetchVapiCalls = async (): Promise<VapiCall[]> => {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      toast({
        title: "Not Connected",
        description: "Please connect your VAPI account to view call recordings",
        variant: "destructive"
      });
      return [];
    }
    
    try {
      // In a real implementation, this would make an actual API call to VAPI
      // For demo purposes, we're returning mock data
      return [
        {
          id: "vapi-1",
          title: "VAPI Demo Call",
          audioUrl: "https://ia800107.us.archive.org/15/items/LoveAndMarriage_124/LoveAndMarriage.mp3",
          transcriptUrl: "https://vapi.ai/transcript/vapi-1",
          status: "completed"
        },
        {
          id: "vapi-2",
          title: "VAPI Product Discussion",
          audioUrl: "https://ia800209.us.archive.org/19/items/TupacChangesOfficialMusicVideo/Tupac%20-%20Changes%20-%20Official%20Music%20Video.mp3",
          transcriptUrl: "https://vapi.ai/transcript/vapi-2",
          status: "completed"
        },
        {
          id: "vapi-3",
          title: "VAPI Customer Call",
          audioUrl: "https://ia801307.us.archive.org/26/items/LetItBe_386/LetItBe.mp3",
          status: "processing"
        },
        {
          id: "vapi-4",
          title: "Enterprise Client Onboarding",
          audioUrl: "https://example.com/audio4.mp3",
          status: "completed",
          transcriptUrl: "https://vapi.ai/transcript/vapi-4"
        },
        {
          id: "vapi-5",
          title: "Support Call - Technical Issue",
          audioUrl: "https://example.com/audio5.mp3",
          status: "completed",
          transcriptUrl: "https://vapi.ai/transcript/vapi-5"
        }
      ];
    } catch (error) {
      console.error("Error fetching VAPI calls:", error);
      toast({
        title: "Error",
        description: "Failed to fetch VAPI call recordings",
        variant: "destructive"
      });
      return [];
    }
  };
  
  const openInVapi = (callId: string) => {
    window.open(`https://vapi.ai/dashboard/calls/${callId}`, "_blank");
  };
  
  return {
    isConnected,
    fetchVapiCalls,
    openInVapi
  };
}
