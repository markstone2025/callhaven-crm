
import { useEffect } from "react";
import { CallRecordings } from "@/components/CallRecordings";
import { Layout } from "@/components/Layout";
import { VapiIntegration } from "@/components/VapiIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";

const CallRecordingsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const callId = queryParams.get("callId");
  const defaultTab = location.hash === "#integration" ? "integration" : "recordings";
  
  // Focus on specific call if callId is provided
  useEffect(() => {
    if (callId) {
      // In a real implementation, you would scroll to the specific call
      // or open it in a modal/player
      console.log(`Should focus on call with ID: ${callId}`);
    }
  }, [callId]);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Call Recordings</h1>
          <p className="text-muted-foreground">Review and analyze your call recordings</p>
          {callId && (
            <div className="mt-2">
              <p className="text-sm text-primary">
                Viewing selected recording (ID: {callId})
              </p>
            </div>
          )}
        </div>
        
        <Tabs defaultValue={defaultTab}>
          <TabsList>
            <TabsTrigger value="recordings">Recordings</TabsTrigger>
            <TabsTrigger value="integration">VAPI Integration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recordings">
            <CallRecordings />
          </TabsContent>
          
          <TabsContent value="integration">
            <VapiIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CallRecordingsPage;
