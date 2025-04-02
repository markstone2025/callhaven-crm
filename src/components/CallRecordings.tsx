import { useState, useEffect } from "react";
import { Search, Phone, User, Clock, Calendar, MessageSquare, MoreHorizontal, Download, ExternalLink, Mail, FileText, CheckCircle, Slack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RecordingPlayer } from "./RecordingPlayer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useVapiService } from "./VapiService";

interface Recording {
  id: string;
  title: string;
  contact: {
    name: string;
    email?: string;
    avatar?: string;
    company?: string;
  };
  date: string;
  duration: string;
  direction: "inbound" | "outbound";
  status: "completed" | "missed" | "abandoned" | "processing" | "failed";
  audioUrl: string;
  transcriptAvailable: boolean;
  tags: string[];
  vapiIntegration?: boolean;
  transcript?: {
    text: string;
    highlights?: { time: string; text: string }[];
  };
  summary?: string;
}

const mockRecordings: Recording[] = [
  {
    id: "1",
    title: "Product Demo Call",
    contact: {
      name: "Mark Johnson",
      email: "mark@acmeinc.com",
      company: "Acme Inc.",
    },
    date: "2023-09-15T14:30:00",
    duration: "23:45",
    direction: "outbound",
    status: "completed",
    audioUrl: "https://ia800107.us.archive.org/15/items/LoveAndMarriage_124/LoveAndMarriage.mp3",
    transcriptAvailable: true,
    tags: ["demo", "product", "follow-up"],
    transcript: {
      text: "Sales Rep: Hi Mark, thanks for joining the call today. I wanted to walk you through our product features as we discussed last week.\n\nMark: Hi, yes, I've been looking forward to this. I'm particularly interested in the reporting capabilities.\n\nSales Rep: Great! Let me share my screen and show you the dashboard. As you can see, our analytics provide real-time metrics on all your sales activities.\n\nMark: That looks impressive. Can multiple team members access these reports?\n\nSales Rep: Absolutely! You can set different permission levels for your team. Let me show you how that works...\n\nMark: Perfect. And what about integration with our current CRM?\n\nSales Rep: We have a seamless integration process. I can arrange a call with our implementation team to discuss the specifics of your setup.\n\nMark: That would be helpful. I think this solution could work well for us.",
      highlights: [
        { time: "02:15", text: "Client interested in reporting capabilities" },
        { time: "05:30", text: "Discussed team permission levels" },
        { time: "12:45", text: "Client impressed with dashboard" },
        { time: "18:20", text: "Integration with current CRM is important" }
      ]
    },
    summary: "Mark from Acme Inc. showed strong interest in our product, particularly the reporting features and team permission controls. He was impressed with the dashboard and asked about CRM integration. A follow-up with the implementation team is needed to discuss integration specifics. Overall positive reception with potential for closing soon."
  },
  {
    id: "2",
    title: "Support Call",
    contact: {
      name: "Sarah Williams",
      email: "sarah@globexcorp.com",
      company: "Globex Corp",
    },
    date: "2023-09-14T10:15:00",
    duration: "12:18",
    direction: "inbound",
    status: "completed",
    audioUrl: "https://ia801309.us.archive.org/34/items/PaulWhitemanwithMildredBailey/PaulWhitemanWithMildredBaileyTheOldManOfTheMountain.mp3",
    transcriptAvailable: true,
    tags: ["support", "bug", "resolved"],
    transcript: {
      text: "Support: Thank you for calling support. How can I help you today?\n\nSarah: I'm having an issue with the reporting module. It seems to be showing incorrect data for the last month.\n\nSupport: I'm sorry to hear that. Let me take a look. Can you tell me which specific reports are affected?\n\nSarah: It's mainly the sales forecast report. The numbers don't match our actual sales records.\n\nSupport: I see the issue now. There appears to be a calculation error in the latest update. Let me apply a quick fix.\n\nSarah: That would be great. We need these reports for a meeting tomorrow.\n\nSupport: I've applied the fix. Can you refresh your browser and check if the data looks correct now?\n\nSarah: Yes, it's working correctly now. Thank you for the quick resolution.\n\nSupport: You're welcome. Is there anything else I can help you with today?",
      highlights: [
        { time: "01:20", text: "Issue with reporting module showing incorrect data" },
        { time: "03:45", text: "Sales forecast report numbers don't match actual records" },
        { time: "06:30", text: "Identified calculation error in latest update" },
        { time: "08:15", text: "Applied fix and verified working" }
      ]
    },
    summary: "Sarah from Globex Corp reported issues with the sales forecast report showing incorrect data. The problem was identified as a calculation error in the latest update. A fix was applied during the call and Sarah confirmed the problem was resolved. The quick resolution was appreciated as they needed the reports for a meeting the next day."
  },
  {
    id: "3",
    title: "Sales Follow-up",
    contact: {
      name: "Robert Wilson",
      company: "Initech",
    },
    date: "2023-09-13T16:45:00",
    duration: "18:22",
    direction: "outbound",
    status: "completed",
    audioUrl: "https://ia600607.us.archive.org/16/items/MoonRiverByPapaBoarGroove/PapaBoarGroove-MoonRiver.mp3",
    transcriptAvailable: false,
    tags: ["sales", "proposal", "negotiation"]
  },
  {
    id: "4",
    title: "Initial Consultation",
    contact: {
      name: "Emily Davis",
      company: "Wayne Enterprises",
    },
    date: "2023-09-12T11:00:00",
    duration: "31:07",
    direction: "outbound",
    status: "completed",
    audioUrl: "https://ia800209.us.archive.org/19/items/TupacChangesOfficialMusicVideo/Tupac%20-%20Changes%20-%20Official%20Music%20Video.mp3",
    transcriptAvailable: true,
    tags: ["consultation", "new client"]
  },
  {
    id: "5",
    title: "Technical Discussion",
    contact: {
      name: "Michael Brown",
      company: "Stark Industries",
    },
    date: "2023-09-11T13:30:00",
    duration: "42:15",
    direction: "inbound",
    status: "completed",
    audioUrl: "https://ia801307.us.archive.org/26/items/LetItBe_386/LetItBe.mp3",
    transcriptAvailable: true,
    tags: ["technical", "integration", "api"]
  },
];

const directionIcons = {
  inbound: <Phone className="h-4 w-4 rotate-180" />,
  outbound: <Phone className="h-4 w-4" />
};

const statusColors = {
  completed: "bg-green-100 text-green-800",
  missed: "bg-red-100 text-red-800",
  abandoned: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  failed: "bg-red-100 text-red-800"
};

export function CallRecordings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [slackDialogOpen, setSlackDialogOpen] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [slackMessage, setSlackMessage] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showVapiRecordings, setShowVapiRecordings] = useState(false);
  const { toast } = useToast();
  const vapiService = useVapiService();

  useEffect(() => {
    const mockRecordingsData = getMockRecordings();
    setRecordings(mockRecordingsData);
    
    if (vapiService.isConnected()) {
      loadVapiRecordings();
    }
  }, []);
  
  const loadVapiRecordings = async () => {
    try {
      const vapiCalls = await vapiService.fetchVapiCalls();
      if (vapiCalls.length) {
        const vapiRecordings = vapiCalls.map(call => ({
          id: call.id,
          title: call.title,
          contact: {
            name: "VAPI Contact",
            company: "VAPI",
          },
          date: new Date().toISOString(),
          duration: "00:00",
          direction: "inbound" as "inbound" | "outbound",
          status: call.status as any,
          audioUrl: call.audioUrl,
          transcriptAvailable: Boolean(call.transcriptUrl),
          tags: ["vapi", "ai-analysis"],
          vapiIntegration: true
        }));
        
        setRecordings(prev => [...prev, ...vapiRecordings]);
      }
    } catch (error) {
      console.error("Error loading VAPI recordings:", error);
    }
  };

  const filteredRecordings = recordings.filter(recording =>
    recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recording.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (recording.contact.company && recording.contact.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    recording.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const handleSendEmail = () => {
    if (!selectedRecording || !emailSubject || !emailContent) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all fields to send the email",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Email Sent",
      description: `Email sent to ${selectedRecording.contact.name}`,
    });

    setEmailDialogOpen(false);
    setEmailContent("");
    setEmailSubject("");
  };

  const handleSendSlackMessage = () => {
    if (!selectedRecording || !slackMessage) {
      toast({
        title: "Incomplete Form",
        description: "Please enter a message to send",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Slack Message Sent",
      description: `Message sent to ${selectedRecording.contact.name} via Slack`,
    });

    setSlackDialogOpen(false);
    setSlackMessage("");
  };

  const openEmailDialog = () => {
    if (selectedRecording) {
      setEmailSubject(`Follow-up: ${selectedRecording.title}`);
      setEmailDialogOpen(true);
    }
  };

  const openSlackDialog = () => {
    if (selectedRecording) {
      setSlackDialogOpen(true);
    }
  };

  const openInVapi = (recording: Recording) => {
    if (recording.vapiIntegration && recording.id) {
      vapiService.openInVapi(recording.id);
    } else {
      toast({
        title: "Not Available",
        description: "This recording is not available in VAPI",
        variant: "destructive"
      });
    }
  };

  const getFilteredRecordings = () => {
    if (activeTab === "all") return filteredRecordings;
    if (activeTab === "inbound") return filteredRecordings.filter(r => r.direction === "inbound");
    if (activeTab === "outbound") return filteredRecordings.filter(r => r.direction === "outbound");
    if (activeTab === "vapi") return filteredRecordings.filter(r => r.vapiIntegration);
    return filteredRecordings;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search recordings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {vapiService.isConnected() && (
          <Button 
            variant="outline" 
            onClick={() => setShowVapiRecordings(!showVapiRecordings)}
          >
            {showVapiRecordings ? "Hide VAPI Recordings" : "Show VAPI Recordings"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Calls</TabsTrigger>
                <TabsTrigger value="inbound">Inbound</TabsTrigger>
                <TabsTrigger value="outbound">Outbound</TabsTrigger>
                {vapiService.isConnected() && (
                  <TabsTrigger value="vapi">VAPI</TabsTrigger>
                )}
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-4">
              {getFilteredRecordings().map((recording) => (
                <Card 
                  key={recording.id} 
                  className={`${selectedRecording?.id === recording.id ? 'ring-2 ring-primary' : ''} ${recording.vapiIntegration ? 'border-primary/20 bg-primary/5' : ''}`}
                  onClick={() => setSelectedRecording(recording)}
                >
                  <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={recording.contact.avatar} alt={recording.contact.name} />
                        <AvatarFallback>{recording.contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-sm">
                          {recording.title}
                          {recording.vapiIntegration && (
                            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">VAPI</Badge>
                          )}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
                          <User className="h-3 w-3" />
                          <span>{recording.contact.name}</span>
                          {recording.contact.company && (
                            <>
                              <span>•</span>
                              <span>{recording.contact.company}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          openEmailDialog();
                        }}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          openSlackDialog();
                        }}>
                          <Slack className="h-4 w-4 mr-2" />
                          Send Slack Message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download recording
                        </DropdownMenuItem>
                        {recording.transcriptAvailable && (
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View transcript
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          openInVapi(recording);
                        }}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in VAPI
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className={statusColors[recording.status]}>
                        {recording.status.charAt(0).toUpperCase() + recording.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {directionIcons[recording.direction]}
                        {recording.direction.charAt(0).toUpperCase() + recording.direction.slice(1)}
                      </Badge>
                      {recording.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(recording.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {recording.duration}
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              {getFilteredRecordings().length === 0 && (
                <div className="text-center py-12">
                  <Phone className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                  <h3 className="mt-4 text-lg font-semibold">No recordings found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="inbound" className="space-y-4">
              {getFilteredRecordings().filter(r => r.direction === 'inbound').map((recording) => (
                <Card 
                  key={recording.id} 
                  className={`${selectedRecording?.id === recording.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedRecording(recording)}
                >
                  <CardHeader className="p-4 pb-2">
                    <h3 className="font-semibold text-sm">{recording.title}</h3>
                  </CardHeader>
                </Card>
              ))}
              
              {getFilteredRecordings().filter(r => r.direction === 'inbound').length === 0 && (
                <div className="text-center py-12">
                  <Phone className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                  <h3 className="mt-4 text-lg font-semibold">No inbound recordings found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="outbound" className="space-y-4">
              {getFilteredRecordings().filter(r => r.direction === 'outbound').map((recording) => (
                <Card 
                  key={recording.id} 
                  className={`${selectedRecording?.id === recording.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedRecording(recording)}
                >
                  <CardHeader className="p-4 pb-2">
                    <h3 className="font-semibold text-sm">{recording.title}</h3>
                  </CardHeader>
                </Card>
              ))}
              
              {getFilteredRecordings().filter(r => r.direction === 'outbound').length === 0 && (
                <div className="text-center py-12">
                  <Phone className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                  <h3 className="mt-4 text-lg font-semibold">No outbound recordings found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </TabsContent>
            
            {vapiService.isConnected() && (
              <TabsContent value="vapi" className="space-y-4">
                {filteredRecordings.filter(r => r.vapiIntegration).map((recording) => (
                  <Card 
                    key={recording.id} 
                    className={`${selectedRecording?.id === recording.id ? 'ring-2 ring-primary' : ''} border-primary/20 bg-primary/5`}
                    onClick={() => setSelectedRecording(recording)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <h3 className="font-semibold text-sm">
                        {recording.title}
                        <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">VAPI</Badge>
                      </h3>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className={statusColors[recording.status]}>
                          {recording.status.charAt(0).toUpperCase() + recording.status.slice(1)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredRecordings.filter(r => r.vapiIntegration).length === 0 && (
                  <div className="text-center py-12">
                    <ExternalLink className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                    <h3 className="mt-4 text-lg font-semibold">No VAPI recordings found</h3>
                    <p className="text-muted-foreground mt-2">
                      Connect your VAPI account to see AI-analyzed call recordings.
                    </p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <div>
          {selectedRecording ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <h3 className="font-semibold">Recording Details</h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Title</p>
                      <p className="text-sm text-muted-foreground">{selectedRecording.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Contact</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedRecording.contact.name}
                        {selectedRecording.contact.company && ` (${selectedRecording.contact.company})`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Date & Time</p>
                      <p className="text-sm text-muted-foreground">{formatDate(selectedRecording.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{selectedRecording.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <Badge variant="outline" className={statusColors[selectedRecording.status]}>
                        {selectedRecording.status.charAt(0).toUpperCase() + selectedRecording.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Direction</p>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {directionIcons[selectedRecording.direction]}
                        {selectedRecording.direction.charAt(0).toUpperCase() + selectedRecording.direction.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tags</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedRecording.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={openEmailDialog}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email Contact
                      </Button>
                      <Button variant="outline" size="sm" onClick={openSlackDialog}>
                        <Slack className="mr-2 h-4 w-4" />
                        Slack Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <RecordingPlayer
                src={selectedRecording.audioUrl}
                title={`${selectedRecording.title} - ${selectedRecording.contact.name}`}
              />
              
              {selectedRecording.transcriptAvailable && selectedRecording.transcript && (
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <h3 className="font-semibold">Transcript</h3>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Tabs defaultValue="transcript">
                      <TabsList>
                        <TabsTrigger value="transcript">Full Transcript</TabsTrigger>
                        <TabsTrigger value="highlights">Key Highlights</TabsTrigger>
                        {selectedRecording.summary && (
                          <TabsTrigger value="summary">Summary</TabsTrigger>
                        )}
                      </TabsList>
                      
                      <TabsContent value="transcript" className="mt-4">
                        <div className="p-4 border rounded-md bg-muted/30">
                          <pre className="whitespace-pre-wrap text-sm font-sans">
                            {selectedRecording.transcript.text}
                          </pre>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="highlights" className="mt-4">
                        <div className="space-y-3">
                          {selectedRecording.transcript.highlights?.map((highlight, index) => (
                            <div key={index} className="border-l-2 border-primary pl-3 py-1">
                              <div className="text-xs text-muted-foreground mb-1">
                                {highlight.time}
                              </div>
                              <p className="text-sm">{highlight.text}</p>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      {selectedRecording.summary && (
                        <TabsContent value="summary" className="mt-4">
                          <div className="p-4 border rounded-md bg-primary/5">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="h-5 w-5 text-primary" />
                              <h4 className="font-medium">Call Summary</h4>
                            </div>
                            <p className="text-sm">
                              {selectedRecording.summary}
                            </p>
                          </div>
                        </TabsContent>
                      )}
                    </Tabs>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <h3 className="font-semibold">Integration</h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    View this recording in VAPI for advanced analytics and AI-powered insights.
                  </p>
                  <Button 
                    className="mt-4 w-full"
                    onClick={() => openInVapi(selectedRecording)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in VAPI
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                <h3 className="mt-4 text-lg font-semibold">No recording selected</h3>
                <p className="text-muted-foreground mt-2">
                  Select a recording from the list to view details and play it.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send an email to {selectedRecording?.contact.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email-to" className="text-right text-sm font-medium">
                To
              </label>
              <Input
                id="email-to"
                value={selectedRecording?.contact.email || ""}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email-subject" className="text-right text-sm font-medium">
                Subject
              </label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="email-content" className="text-right text-sm font-medium pt-2">
                Message
              </label>
              <Textarea
                id="email-content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="col-span-3 min-h-[150px]"
                placeholder="Write your message here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={slackDialogOpen} onOpenChange={setSlackDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Slack Message</DialogTitle>
            <DialogDescription>
              Send a Slack message to {selectedRecording?.contact.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="slack-to" className="text-right text-sm font-medium">
                To
              </label>
              <Input
                id="slack-to"
                value={selectedRecording?.contact.name || ""}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="slack-message" className="text-right text-sm font-medium pt-2">
                Message
              </label>
              <Textarea
                id="slack-message"
                value={slackMessage}
                onChange={(e) => setSlackMessage(e.target.value)}
                className="col-span-3 min-h-[150px]"
                placeholder="Write your message here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSlackDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendSlackMessage}>
              <Slack className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getMockRecordings() {
  return [
    {
      id: "1",
      title: "Product Demo Call",
      contact: {
        name: "Mark Johnson",
        email: "mark@acmeinc.com",
        company: "Acme Inc.",
      },
      date: "2023-09-15T14:30:00",
      duration: "23:45",
      direction: "outbound",
      status: "completed",
      audioUrl: "https://ia800107.us.archive.org/15/items/LoveAndMarriage_124/LoveAndMarriage.mp3",
      transcriptAvailable: true,
      tags: ["demo", "product", "follow-up"],
      transcript: {
        text: "Sales Rep: Hi Mark, thanks for joining the call today. I wanted to walk you through our product features as we discussed last week.\n\nMark: Hi, yes, I've been looking forward to this. I'm particularly interested in the reporting capabilities.\n\nSales Rep: Great! Let me share my screen and show you the dashboard. As you can see, our analytics provide real-time metrics on all your sales activities.\n\nMark: That looks impressive. Can multiple team members access these reports?\n\nSales Rep: Absolutely! You can set different permission levels for your team. Let me show you how that works...\n\nMark: Perfect. And what about integration with our current CRM?\n\nSales Rep: We have a seamless integration process. I can arrange a call with our implementation team to discuss the specifics of your setup.\n\nMark: That would be helpful. I think this solution could work well for us.",
        highlights: [
          { time: "02:15", text: "Client interested in reporting capabilities" },
          { time: "05:30", text: "Discussed team permission levels" },
          { time: "12:45", text: "Client impressed with dashboard" },
          { time: "18:20", text: "Integration with current CRM is important" }
        ]
      },
      summary: "Mark from Acme Inc. showed strong interest in our product, particularly the reporting features and team permission controls. He was impressed with the dashboard and asked about CRM integration. A follow-up with the implementation team is needed to discuss integration specifics. Overall positive reception with potential for closing soon."
    },
    {
      id: "2",
      title: "Support Call",
      contact: {
        name: "Sarah Williams",
        email: "sarah@globexcorp.com",
        company: "Globex Corp",
      },
      date: "2023-09-14T10:15:00",
      duration: "12:18",
      direction: "inbound",
      status: "completed",
      audioUrl: "https://ia801309.us.archive.org/34/items/PaulWhitemanwithMildredBailey/PaulWhitemanWithMildredBaileyTheOldManOfTheMountain.mp3",
      transcriptAvailable: true,
      tags: ["support", "bug", "resolved"],
      transcript: {
        text: "Support: Thank you for calling support. How can I help you today?\n\nSarah: I'm having an issue with the reporting module. It seems to be showing incorrect data for the last month.\n\nSupport: I'm sorry to hear that. Let me take a look. Can you tell me which specific reports are affected?\n\nSarah: It's mainly the sales forecast report. The numbers don't match our actual sales records.\n\nSupport: I see the issue now. There appears to be a calculation error in the latest update. Let me apply a quick fix.\n\nSarah: That would be great. We need these reports for a meeting tomorrow.\n\nSupport: I've applied the fix. Can you refresh your browser and check if the data looks correct now?\n\nSarah: Yes, it's working correctly now. Thank you for the quick resolution.\n\nSupport: You're welcome. Is there anything else I can help you with today?",
        highlights: [
          { time: "01:20", text: "Issue with reporting module showing incorrect data" },
          { time: "03:45", text: "Sales forecast report numbers don't match actual records" },
          { time: "06:30", text: "Identified calculation error in latest update" },
          { time: "08:15", text: "Applied fix and verified working" }
        ]
      },
      summary: "Sarah from Globex Corp reported issues with the sales forecast report showing incorrect data. The problem was identified as a calculation error in the latest update. A fix was applied during the call and Sarah confirmed the problem was resolved. The quick resolution was appreciated as they needed the reports for a meeting the next day."
    },
    {
      id: "3",
      title: "Sales Follow-up",
      contact: {
        name: "Robert Wilson",
        company: "Initech",
      },
      date: "2023-09-13T16:45:00",
      duration: "18:22",
      direction: "outbound",
      status: "completed",
      audioUrl: "https://ia600607.us.archive.org/16/items/MoonRiverByPapaBoarGroove/PapaBoarGroove-MoonRiver.mp3",
      transcriptAvailable: false,
      tags: ["sales", "proposal", "negotiation"]
    },
    {
      id: "4",
      title: "Initial Consultation",
      contact: {
        name: "Emily Davis",
        company: "Wayne Enterprises",
      },
      date: "2023-09-12T11:00:00",
      duration: "31:07",
      direction: "outbound",
      status: "completed",
      audioUrl: "https://ia800209.us.archive.org/19/items/TupacChangesOfficialMusicVideo/Tupac%20-%20Changes%20-%20Official%20Music%20Video.mp3",
      transcriptAvailable: true,
      tags: ["consultation", "new client"]
    },
    {
      id: "5",
      title: "Technical Discussion",
      contact: {
        name: "Michael Brown",
        company: "Stark Industries",
      },
      date: "2023-09-11T13:30:00",
      duration: "42:15",
      direction: "inbound",
      status: "completed",
      audioUrl: "https://ia801307.us.archive.org/26/items/LetItBe_386/LetItBe.mp3",
      transcriptAvailable: true,
      tags: ["technical", "integration", "api"]
    },
  ];
}

export default CallRecordings;
