
import { Layout } from "@/components/Layout";
import { SalesDashboard } from "@/components/SalesDashboard";
import { VapiCallsWidget } from "@/components/VapiCallsWidget";

const SalesDashboardPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <SalesDashboard />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">VAPI Call Analytics</h2>
          <VapiCallsWidget showDetailed={true} />
        </div>
      </div>
    </Layout>
  );
};

export default SalesDashboardPage;
