
import { CallRecordings } from "@/components/CallRecordings";
import { Layout } from "@/components/Layout";
import { VapiIntegration } from "@/components/VapiIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CallRecordingsPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Call Recordings</h1>
          <p className="text-muted-foreground">Review and analyze your call recordings</p>
        </div>
        
        <Tabs defaultValue="recordings">
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
