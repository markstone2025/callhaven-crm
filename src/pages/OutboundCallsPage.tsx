
import { Layout } from "@/components/Layout";
import { OutboundCalls } from "@/components/outbound/OutboundCalls";

const OutboundCallsPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Outbound Calls</h1>
          <p className="text-muted-foreground">Upload contacts and make outbound calls</p>
        </div>
        <OutboundCalls />
      </div>
    </Layout>
  );
};

export default OutboundCallsPage;
