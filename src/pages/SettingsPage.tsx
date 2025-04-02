
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VapiIntegration } from "@/components/VapiIntegration";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { 
  Users, 
  Mail, 
  BarChart3, 
  Link, 
  Upload, 
  Download,
  Settings as SettingsIcon,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer } from "@/components/ui/chart";
import { format } from "date-fns";

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoTranscriptEnabled, setAutoTranscriptEnabled] = useState(true);
  const { toast } = useToast();
  
  // Report state
  const [editingReport, setEditingReport] = useState<null | {
    id: string;
    name: string;
    description: string;
    type: string;
    frequency: string;
    filters: { 
      month: string;
      metric: string;
    };
  }>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
  const currentMonth = format(new Date(), 'MMMM yyyy');
  const previousMonth = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'MMMM yyyy');
  
  const reportForm = useForm({
    defaultValues: {
      name: "",
      description: "",
      type: "performance",
      frequency: "weekly",
      filterMonth: currentMonth,
      filterMetric: "all"
    }
  });
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully",
    });
  };

  const userRoleForm = useForm({
    defaultValues: {
      newUserEmail: "",
      newUserRole: "viewer",
    }
  });

  const emailIntegrationForm = useForm({
    defaultValues: {
      emailProvider: "gmail",
      emailAddress: "",
    }
  });

  const handleInviteUser = (values: any) => {
    toast({
      title: "User invited",
      description: `Invitation sent to ${values.newUserEmail} as ${values.newUserRole}`,
    });
    userRoleForm.reset();
  };

  const handleConnectEmail = (values: any) => {
    toast({
      title: "Email connected",
      description: `Connected to ${values.emailAddress} via ${values.emailProvider}`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data export initiated",
      description: "Your data export has been started. You'll receive an email when it's ready.",
    });
  };
  
  const handleEditReport = (report: any) => {
    setEditingReport(report);
    reportForm.reset({
      name: report.name,
      description: report.description,
      type: report.type,
      frequency: report.frequency,
      filterMonth: report.filters.month,
      filterMetric: report.filters.metric
    });
    setIsReportDialogOpen(true);
  };
  
  const handleCreateReport = () => {
    setEditingReport(null);
    reportForm.reset({
      name: "",
      description: "",
      type: "performance",
      frequency: "weekly",
      filterMonth: currentMonth,
      filterMetric: "all"
    });
    setIsReportDialogOpen(true);
  };
  
  const handleSaveReport = (values: any) => {
    const reportData = {
      id: editingReport?.id || `report-${Date.now()}`,
      name: values.name,
      description: values.description,
      type: values.type,
      frequency: values.frequency,
      filters: {
        month: values.filterMonth,
        metric: values.filterMetric
      }
    };
    
    toast({
      title: editingReport ? "Report updated" : "Report created",
      description: `${reportData.name} has been ${editingReport ? "updated" : "created"} successfully.`,
    });
    
    setIsReportDialogOpen(false);
  };

  const handleRunReport = (report: any) => {
    toast({
      title: "Report generated",
      description: `${report.name} report has been generated for ${report.filters.month}.`,
    });
  };
  
  // Sample reports data
  const sampleReports = [
    {
      id: "report-1",
      name: "Sales Performance",
      description: "Track sales team performance with key metrics",
      type: "performance",
      frequency: "weekly",
      filters: {
        month: currentMonth,
        metric: "sales"
      }
    },
    {
      id: "report-2",
      name: "Call Volume Analysis",
      description: "Analyze call patterns and peak times",
      type: "analysis",
      frequency: "monthly",
      filters: {
        month: previousMonth,
        metric: "calls"
      }
    }
  ];
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your app settings and integrations</p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Users & Roles</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              <span>Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Data</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="auto-transcript">
                    Automatically generate transcripts for calls
                  </Label>
                  <Switch
                    id="auto-transcript"
                    checked={autoTranscriptEnabled}
                    onCheckedChange={setAutoTranscriptEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="notifications">
                    Enable email notifications
                  </Label>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Changes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User & Role Management</CardTitle>
                <CardDescription>
                  Manage team members and their access permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...userRoleForm}>
                  <form onSubmit={userRoleForm.handleSubmit(handleInviteUser)} className="space-y-4">
                    <FormField
                      control={userRoleForm.control}
                      name="newUserEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="colleague@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the email address of the user you want to invite
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userRoleForm.control}
                      name="newUserRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="sales">Sales Representative</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Set the permission level for this user
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Invite User</Button>
                  </form>
                </Form>

                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Current Team Members</h3>
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-4 border-b">
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-muted-foreground">john@example.com</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">Admin</span>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">Jane Smith</p>
                        <p className="text-sm text-muted-foreground">jane@example.com</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">Sales</span>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Integration</CardTitle>
                <CardDescription>
                  Connect your email accounts to sync communications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...emailIntegrationForm}>
                  <form onSubmit={emailIntegrationForm.handleSubmit(handleConnectEmail)} className="space-y-4">
                    <FormField
                      control={emailIntegrationForm.control}
                      name="emailProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Provider</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an email provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gmail">Gmail</SelectItem>
                              <SelectItem value="outlook">Outlook</SelectItem>
                              <SelectItem value="yahoo">Yahoo</SelectItem>
                              <SelectItem value="custom">Custom SMTP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose your email service provider
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailIntegrationForm.control}
                      name="emailAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            The email address you want to connect
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Connect Email Account</Button>
                  </form>
                </Form>

                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Connected Accounts</h3>
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">sales@company.com</p>
                          <p className="text-sm text-muted-foreground">Gmail · Connected 2 days ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Custom Reports Builder</CardTitle>
                  <CardDescription>
                    Create and schedule custom reports
                  </CardDescription>
                </div>
                <Button onClick={handleCreateReport}>Create New Report</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Time Period</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.name}</TableCell>
                            <TableCell>{report.description}</TableCell>
                            <TableCell>{report.filters.month}</TableCell>
                            <TableCell className="capitalize">{report.frequency}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEditReport(report)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleRunReport(report)}
                                >
                                  Run Now
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Sample report preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Sales Performance Preview</span>
                      </CardTitle>
                      <CardDescription>Monthly sales performance data for {currentMonth}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ChartContainer
                          config={{
                            sales: { color: "#0ea5e9" },
                            calls: { color: "#8b5cf6" },
                            meetings: { color: "#10b981" }
                          }}
                        >
                          {/* This is a placeholder for a chart visualization */}
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            Chart visualization would appear here based on selected filters
                          </div>
                        </ChartContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            {/* Report Edit Dialog */}
            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>{editingReport ? "Edit Report" : "Create New Report"}</DialogTitle>
                  <DialogDescription>
                    {editingReport ? "Modify your report details and settings" : "Set up a new custom report"}
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...reportForm}>
                  <form onSubmit={reportForm.handleSubmit(handleSaveReport)} className="space-y-4">
                    <FormField
                      control={reportForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Report Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Sales Performance Summary" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={reportForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Description of what this report tracks" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={reportForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Report Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select report type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="performance">Performance</SelectItem>
                                <SelectItem value="analysis">Analysis</SelectItem>
                                <SelectItem value="forecast">Forecast</SelectItem>
                                <SelectItem value="summary">Summary</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={reportForm.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    <h3 className="text-base font-medium">Report Filters</h3>
                    
                    <FormField
                      control={reportForm.control}
                      name="filterMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Month</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select month" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={format(new Date(), 'MMMM yyyy')}>
                                {format(new Date(), 'MMMM yyyy')} (Current)
                              </SelectItem>
                              <SelectItem value={format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'MMMM yyyy')}>
                                {format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'MMMM yyyy')}
                              </SelectItem>
                              <SelectItem value={format(new Date(new Date().setMonth(new Date().getMonth() - 2)), 'MMMM yyyy')}>
                                {format(new Date(new Date().setMonth(new Date().getMonth() - 2)), 'MMMM yyyy')}
                              </SelectItem>
                              <SelectItem value={format(new Date(new Date().setMonth(new Date().getMonth() - 3)), 'MMMM yyyy')}>
                                {format(new Date(new Date().setMonth(new Date().getMonth() - 3)), 'MMMM yyyy')}
                              </SelectItem>
                              <SelectItem value="custom">Custom Range...</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the month for which you want to generate the report
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={reportForm.control}
                      name="filterMetric"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Metrics to Include</FormLabel>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="all" />
                              </FormControl>
                              <FormLabel className="font-normal">All Metrics</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="sales" />
                              </FormControl>
                              <FormLabel className="font-normal">Sales Only</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="calls" />
                              </FormControl>
                              <FormLabel className="font-normal">Calls Only</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="meetings" />
                              </FormControl>
                              <FormLabel className="font-normal">Meetings Only</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingReport ? "Update Report" : "Create Report"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4 mt-4">
            <VapiIntegration />
            
            <Card>
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
                <CardDescription>
                  Manage your API keys and third-party integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input id="api-key" value="sk_*****************************" readOnly className="font-mono" />
                    <Button variant="outline">Regenerate</Button>
                    <Button variant="outline">Copy</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Use this key to authenticate API requests</p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Connected Services</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <SettingsIcon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Zapier</p>
                            <p className="text-sm text-muted-foreground">Automate workflows</p>
                          </div>
                        </div>
                        <Switch checked={true} />
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <SettingsIcon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Slack</p>
                            <p className="text-sm text-muted-foreground">Team notifications</p>
                          </div>
                        </div>
                        <Switch checked={false} />
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline">Connect New Service</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Import/Export Tools</CardTitle>
                <CardDescription>
                  Import data from other systems or export your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Import Data</h3>
                  <div className="border rounded-md p-6 border-dashed flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Drag and drop your CSV file here, or click to browse</p>
                    <Button variant="outline" size="sm">Select File</Button>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="contacts">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contacts">Contacts</SelectItem>
                        <SelectItem value="deals">Deals</SelectItem>
                        <SelectItem value="calls">Call Records</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>Import</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Export Data</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-4">
                      <Download className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Export All Data</p>
                        <p className="text-sm text-muted-foreground">Get a complete backup of your data</p>
                      </div>
                      <Button variant="outline" onClick={handleExportData}>Export</Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Download className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Export Contacts</p>
                        <p className="text-sm text-muted-foreground">Export only contact information</p>
                      </div>
                      <Button variant="outline" onClick={handleExportData}>Export</Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Download className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Export Call Records</p>
                        <p className="text-sm text-muted-foreground">Export call recording data</p>
                      </div>
                      <Button variant="outline" onClick={handleExportData}>Export</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
