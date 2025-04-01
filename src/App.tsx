
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import DashboardPage from "./pages/DashboardPage";
import ContactsPage from "./pages/ContactsPage";
import CallRecordingsPage from "./pages/CallRecordingsPage";
import SalesDashboardPage from "./pages/SalesDashboardPage";
import SalesPipelinePage from "./pages/SalesPipelinePage";
import CalendarPage from "./pages/CalendarPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sales-dashboard" element={<SalesDashboardPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/sales-pipeline" element={<SalesPipelinePage />} />
          <Route path="/call-recordings" element={<CallRecordingsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
