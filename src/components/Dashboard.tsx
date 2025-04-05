
import { Calendar, Phone, User, Clock } from "lucide-react";
import { MetricCard } from "@/components/metrics/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VapiCallsWidget } from "@/components/VapiCallsWidget";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your CallHaven CRM!</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Contacts"
          value="1,234"
          icon={User}
          trend={{ value: 12, positive: true }}
        />
        <MetricCard
          title="Calls This Month"
          value="287"
          icon={Phone}
          trend={{ value: 8.2, positive: true }}
        />
        <MetricCard
          title="Recording Time"
          value="157 hrs"
          icon={Clock}
          description="Total recording time in hours"
        />
        <MetricCard
          title="Upcoming Calls"
          value="8"
          icon={Calendar}
          description="Scheduled for next 7 days"
        />
      </div>

      {/* Add VAPI Calls Widget */}
      <div className="mb-6">
        <VapiCallsWidget />
      </div>

      <Tabs defaultValue="recent">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold mr-4">Activity</h2>
          <TabsList>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your most recent calls and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="p-2 rounded-full bg-primary/10">
                      <activity.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Activity</CardTitle>
              <CardDescription>
                Your scheduled calls and meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="p-2 rounded-full bg-primary/10">
                      <activity.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const recentActivity = [
  {
    icon: Phone,
    title: "Call with Mark Johnson",
    description: "Discussed new product features and pricing",
    time: "2 hours ago"
  },
  {
    icon: User,
    title: "Added Sarah Williams",
    description: "New contact added to your CRM",
    time: "Yesterday"
  },
  {
    icon: Phone,
    title: "Call with Technovate Inc.",
    description: "Quarterly review meeting",
    time: "2 days ago"
  },
  {
    icon: Phone,
    title: "Call with David Lee",
    description: "Support call regarding account setup",
    time: "3 days ago"
  }
];

const upcomingActivity = [
  {
    icon: Calendar,
    title: "Demo Call with Acme Corp",
    description: "Product demonstration for potential client",
    time: "Tomorrow, 2:00 PM"
  },
  {
    icon: Calendar,
    title: "Follow-up with Robert Smith",
    description: "Discuss contract terms",
    time: "Wednesday, 10:30 AM"
  },
  {
    icon: Calendar,
    title: "Sales Team Weekly Call",
    description: "Review pipeline and forecasts",
    time: "Friday, 9:00 AM"
  }
];

export default Dashboard;
