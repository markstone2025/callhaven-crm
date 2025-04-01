
import { useState } from "react";
import { Search, Phone, User, Clock, Calendar, MessageSquare, MoreHorizontal, Download, ExternalLink } from "lucide-react";
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

// Mock data for call recordings
interface Recording {
  id: string;
  title: string;
  contact: {
    name: string;
    avatar?: string;
    company?: string;
  };
  date: string;
  duration: string;
  direction: "inbound" | "outbound";
  status: "completed" | "missed" | "abandoned";
  audioUrl: string;
  transcriptAvailable: boolean;
  tags: string[];
}

const mockRecordings: Recording[] = [
  {
    id: "1",
    title: "Product Demo Call",
    contact: {
      name: "Mark Johnson",
      company: "Acme Inc.",
    },
    date: "2023-09-15T14:30:00",
    duration: "23:45",
    direction: "outbound",
    status: "completed",
    audioUrl: "https://ia800107.us.archive.org/15/items/LoveAndMarriage_124/LoveAndMarriage.mp3",
    transcriptAvailable: true,
    tags: ["demo", "product", "follow-up"]
  },
  {
    id: "2",
    title: "Support Call",
    contact: {
      name: "Sarah Williams",
      company: "Globex Corp",
    },
    date: "2023-09-14T10:15:00",
    duration: "12:18",
    direction: "inbound",
    status: "completed",
    audioUrl: "https://ia801309.us.archive.org/34/items/PaulWhitemanwithMildredBailey/PaulWhitemanWithMildredBaileyTheOldManOfTheMountain.mp3",
    transcriptAvailable: true,
    tags: ["support", "bug", "resolved"]
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

// Direction and status color mappings
const directionIcons = {
  inbound: <Phone className="h-4 w-4 rotate-180" />,
  outbound: <Phone className="h-4 w-4" />
};

const statusColors = {
  completed: "bg-green-100 text-green-800",
  missed: "bg-red-100 text-red-800",
  abandoned: "bg-yellow-100 text-yellow-800"
};

export function CallRecordings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>(mockRecordings);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Call Recordings</h1>
        <p className="text-muted-foreground">Review and analyze your call recordings</p>
      </div>

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Calls</TabsTrigger>
                <TabsTrigger value="inbound">Inbound</TabsTrigger>
                <TabsTrigger value="outbound">Outbound</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-4">
              {filteredRecordings.map((recording) => (
                <Card 
                  key={recording.id} 
                  className={`${selectedRecording?.id === recording.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedRecording(recording)}
                >
                  <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={recording.contact.avatar} alt={recording.contact.name} />
                        <AvatarFallback>{recording.contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-sm">{recording.title}</h3>
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
                        <DropdownMenuItem>
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
              
              {filteredRecordings.length === 0 && (
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
              {filteredRecordings.filter(r => r.direction === 'inbound').map((recording) => (
                // Similar card component as above, filtered for inbound calls
                <Card 
                  key={recording.id} 
                  className={`${selectedRecording?.id === recording.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedRecording(recording)}
                >
                  {/* Same content as above */}
                  <CardHeader className="p-4 pb-2">
                    {/* ... */}
                    <h3 className="font-semibold text-sm">{recording.title}</h3>
                  </CardHeader>
                  {/* ... remaining card content */}
                </Card>
              ))}
              
              {filteredRecordings.filter(r => r.direction === 'inbound').length === 0 && (
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
              {filteredRecordings.filter(r => r.direction === 'outbound').map((recording) => (
                // Similar card component as above, filtered for outbound calls
                <Card 
                  key={recording.id} 
                  className={`${selectedRecording?.id === recording.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedRecording(recording)}
                >
                  {/* Same content as above */}
                  <CardHeader className="p-4 pb-2">
                    {/* ... */}
                    <h3 className="font-semibold text-sm">{recording.title}</h3>
                  </CardHeader>
                  {/* ... remaining card content */}
                </Card>
              ))}
              
              {filteredRecordings.filter(r => r.direction === 'outbound').length === 0 && (
                <div className="text-center py-12">
                  <Phone className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                  <h3 className="mt-4 text-lg font-semibold">No outbound recordings found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </TabsContent>
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
                  </div>
                </CardContent>
              </Card>
              
              <RecordingPlayer
                src={selectedRecording.audioUrl}
                title={`${selectedRecording.title} - ${selectedRecording.contact.name}`}
              />
              
              {selectedRecording.transcriptAvailable && (
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <h3 className="font-semibold">Transcript</h3>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      The transcript for this call is available. Click below to view the full transcript.
                    </p>
                    <Button variant="outline" className="mt-4 w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      View Transcript
                    </Button>
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
                  <Button className="mt-4 w-full">
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
    </div>
  );
}

export default CallRecordings;
