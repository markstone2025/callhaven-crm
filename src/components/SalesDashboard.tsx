
import { useState } from "react";
import { BarChart, PieChart, LineChart } from "recharts";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, Cell, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, Download, Users, TrendingUp, DollarSign, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from "@/components/metrics/MetricCard";

// Mock data for sales performance
const salesPerformance = [
  { month: "Jan", revenue: 45000, deals: 12, target: 50000 },
  { month: "Feb", revenue: 52000, deals: 15, target: 50000 },
  { month: "Mar", revenue: 48000, deals: 13, target: 50000 },
  { month: "Apr", revenue: 61000, deals: 18, target: 55000 },
  { month: "May", revenue: 55000, deals: 16, target: 55000 },
  { month: "Jun", revenue: 67000, deals: 22, target: 55000 },
  { month: "Jul", revenue: 72000, deals: 24, target: 60000 },
  { month: "Aug", revenue: 78000, deals: 26, target: 60000 },
  { month: "Sep", revenue: 81000, deals: 28, target: 60000 },
  { month: "Oct", revenue: 85000, deals: 30, target: 65000 },
  { month: "Nov", revenue: 91000, deals: 32, target: 65000 },
  { month: "Dec", revenue: 99000, deals: 36, target: 65000 },
];

// Deal stages data for pie chart
const dealStagesData = [
  { name: "Lead", value: 35, color: "#f4b63f" },
  { name: "Qualified", value: 25, color: "#3f9cf4" },
  { name: "Proposal", value: 20, color: "#7963d2" },
  { name: "Negotiation", value: 15, color: "#9c3ff4" },
  { name: "Closed Won", value: 5, color: "#4CAF50" },
];

// Sales by source data for pie chart
const salesBySourceData = [
  { name: "Website", value: 30, color: "#00A3E0" },
  { name: "Referral", value: 25, color: "#FFB81C" },
  { name: "Direct", value: 20, color: "#7A3B69" },
  { name: "Email Campaign", value: 15, color: "#009A44" },
  { name: "Social Media", value: 10, color: "#FF585D" },
];

// Top salespeople
const topSalespeople = [
  { id: 1, name: "Sarah Johnson", deals: 28, revenue: 245000, conversion: 68 },
  { id: 2, name: "Michael Chen", deals: 24, revenue: 210000, conversion: 65 },
  { id: 3, name: "Jessica Martinez", deals: 22, revenue: 195000, conversion: 62 },
  { id: 4, name: "David Wilson", deals: 20, revenue: 175000, conversion: 58 },
  { id: 5, name: "Amanda Lee", deals: 18, revenue: 155000, conversion: 55 },
];

export function SalesDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("year");
  const currentYearData = salesPerformance;
  
  // Calculate total metrics for current timeframe
  const totalRevenue = currentYearData.reduce((sum, item) => sum + item.revenue, 0);
  const totalDeals = currentYearData.reduce((sum, item) => sum + item.deals, 0);
  const averageDealSize = totalRevenue / totalDeals;
  
  // Calculate percentage change (mock data)
  const revenueGrowth = 12.5;
  const dealGrowth = 8.3;
  const conversionRate = 32;
  const conversionChange = 4.2;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your sales performance and revenue forecasts
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000).toFixed(1)}k`}
          icon={DollarSign}
          trend={{ value: revenueGrowth, positive: true }}
          description="vs previous period"
        />
        <MetricCard
          title="Deals Closed"
          value={totalDeals.toString()}
          icon={TrendingUp}
          trend={{ value: dealGrowth, positive: true }}
          description="vs previous period"
        />
        <MetricCard
          title="Avg. Deal Size"
          value={`$${(averageDealSize / 1000).toFixed(1)}k`}
          icon={BarChart3}
          description="Per closed deal"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={PieChartIcon}
          trend={{ value: conversionChange, positive: true }}
          description="Deals won/total opportunities"
        />
      </div>
      
      <Tabs defaultValue="performance">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="salespeople">Team Performance</TabsTrigger>
          <TabsTrigger value="forecast">Revenue Forecast</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Revenue vs Target</CardTitle>
              <CardDescription>Monthly revenue compared to targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full mt-4">
                <ChartContainer 
                  config={{
                    revenue: { label: 'Revenue', color: '#2563eb' },
                    target: { label: 'Target', color: '#9ca3af' }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentYearData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis 
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="font-medium">{payload[0].payload.month}</div>
                                {payload.map((entry, index) => (
                                  <div
                                    key={`item-${index}`}
                                    className="flex items-center justify-between gap-2"
                                  >
                                    <div className="flex items-center">
                                      <div
                                        className="mr-1 h-2 w-2 rounded"
                                        style={{ backgroundColor: entry.color }}
                                      />
                                      <span>{entry.name}:</span>
                                    </div>
                                    <span className="font-medium">
                                      ${Number(entry.value).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="revenue" 
                        fill="rgba(37, 99, 235, 0.8)" 
                        name="Revenue" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="target" 
                        fill="rgba(156, 163, 175, 0.6)" 
                        name="Target"
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Deal Stages</CardTitle>
                <CardDescription>Active deals by stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dealStagesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dealStagesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} deals`, 'Count']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales by Source</CardTitle>
                <CardDescription>Revenue by lead source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesBySourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {salesBySourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline Health</CardTitle>
              <CardDescription>Distribution of deals across stages with expected revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Visit the Sales Pipeline page for a detailed view and management of your deals.
              </p>
              <Button variant="outline">
                Go to Pipeline
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="salespeople" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Sales Representatives</CardTitle>
              <CardDescription>Performance metrics for your top sellers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium">Sales Rep</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Deals Closed</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Revenue</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSalespeople.map(person => (
                      <tr key={person.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{person.name}</td>
                        <td className="p-4 align-middle">{person.deals}</td>
                        <td className="p-4 align-middle">${person.revenue.toLocaleString()}</td>
                        <td className="p-4 align-middle">{person.conversion}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecast</CardTitle>
              <CardDescription>Projected revenue based on pipeline and historical data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full mt-4">
                <ChartContainer 
                  config={{
                    revenue: { label: 'Actual Revenue', color: '#2563eb' },
                    forecast: { label: 'Forecast', color: '#f59e0b' }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesPerformance}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis 
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#2563eb" 
                        name="Actual Revenue"
                        strokeWidth={2} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#f59e0b" 
                        name="Forecast"
                        strokeWidth={2}
                        strokeDasharray="5 5" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SalesDashboard;
