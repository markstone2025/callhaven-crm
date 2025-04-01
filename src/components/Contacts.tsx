import { useState } from "react";
import { Search, Plus, MoreHorizontal, User, Mail, Phone, MapPin, Calendar, Tag, Building, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Interaction {
  id: string;
  type: "email" | "call" | "meeting" | "note";
  date: string;
  description: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  status: "lead" | "customer" | "prospect";
  avatar?: string;
  tags?: string[];
  lastInteraction?: string;
  interactions?: Interaction[];
  title?: string;
  assignedTo?: string;
  createdDate?: string;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    company: "Acme Inc.",
    location: "New York, NY",
    status: "customer",
    avatar: "",
    tags: ["Enterprise", "Tech"],
    title: "CTO",
    assignedTo: "Sarah Johnson",
    createdDate: "2023-01-15",
    lastInteraction: "2023-06-10",
    interactions: [
      {
        id: "int1",
        type: "call",
        date: "2023-06-10",
        description: "Discussed upcoming contract renewal"
      },
      {
        id: "int2",
        type: "email",
        date: "2023-06-05",
        description: "Sent follow-up about new features"
      }
    ]
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    company: "Globex Corp",
    location: "San Francisco, CA",
    status: "lead",
    avatar: "",
    tags: ["Mid-Market", "Healthcare"],
    title: "VP of Operations",
    assignedTo: "Mark Wilson",
    createdDate: "2023-02-20",
    lastInteraction: "2023-05-28",
    interactions: [
      {
        id: "int3",
        type: "meeting",
        date: "2023-05-28",
        description: "Initial discovery call"
      }
    ]
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(555) 456-7890",
    company: "Initech",
    location: "Austin, TX",
    status: "prospect",
    avatar: "",
    tags: ["SMB", "Manufacturing"],
    title: "CEO",
    assignedTo: "Emily Chen",
    createdDate: "2023-03-10",
    lastInteraction: "2023-06-15",
    interactions: [
      {
        id: "int4",
        type: "email",
        date: "2023-06-15",
        description: "Sent pricing proposal"
      }
    ]
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "(555) 234-5678",
    company: "Massive Dynamic",
    location: "Chicago, IL",
    status: "customer",
    avatar: "",
    tags: ["Small Business", "Finance"],
    title: "CFO",
    assignedTo: "John Doe",
    createdDate: "2023-04-10",
    lastInteraction: "2023-07-10",
    interactions: [
      {
        id: "int5",
        type: "call",
        date: "2023-07-10",
        description: "Reviewed financial statements"
      }
    ]
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "(555) 345-6789",
    company: "Stark Industries",
    location: "Los Angeles, CA",
    status: "lead",
    avatar: "",
    tags: ["Enterprise", "Tech"],
    title: "CTO",
    assignedTo: "Jane Smith",
    createdDate: "2023-05-10",
    lastInteraction: "2023-08-10",
    interactions: [
      {
        id: "int6",
        type: "meeting",
        date: "2023-08-10",
        description: "Met with investors"
      }
    ]
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "(555) 567-8901",
    company: "Wayne Enterprises",
    location: "Boston, MA",
    status: "prospect",
    avatar: "",
    tags: ["Mid-Market", "Healthcare"],
    title: "VP of Operations",
    assignedTo: "Robert Johnson",
    createdDate: "2023-06-10",
    lastInteraction: "2023-09-10",
    interactions: [
      {
        id: "int7",
        type: "email",
        date: "2023-09-10",
        description: "Sent follow-up about new features"
      }
    ]
  },
];

const statusColors = {
  lead: "bg-yellow-100 text-yellow-800",
  customer: "bg-green-100 text-green-800",
  prospect: "bg-blue-100 text-blue-800",
};

const interactionIcons = {
  email: <Mail className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  meeting: <Calendar className="h-4 w-4" />,
  note: <Clock className="h-4 w-4" />,
};

export function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [selectedView, setSelectedView] = useState<"cards" | "list">("cards");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleCloseDetail = () => {
    setSelectedContact(null);
  };

  return (
    <div className="space-y-6">
      {selectedContact ? (
        <ContactDetail contact={selectedContact} onClose={handleCloseDetail} />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
              <p className="text-muted-foreground">Manage your contacts and leads</p>
            </div>
            <Button className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search contacts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={selectedView === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("cards")}
              >
                Cards
              </Button>
              <Button
                variant={selectedView === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("list")}
              >
                List
              </Button>
            </div>
          </div>

          {selectedView === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map((contact) => (
                <Card key={contact.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewContact(contact)}>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View calls</DropdownMenuItem>
                            <DropdownMenuItem>Add task</DropdownMenuItem>
                            <DropdownMenuItem>Add to deal</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-4">
                        <h3 className="font-semibold text-lg leading-none">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{contact.title ? `${contact.title}, ` : ''}{contact.company}</p>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline" className={statusColors[contact.status]}>
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </Badge>
                      </div>
                      {contact.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {contact.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="border-t px-6 py-4 gap-4 grid grid-cols-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{contact.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{contact.location}</span>
                      </div>
                      {contact.lastInteraction && (
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Last activity: {contact.lastInteraction}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">Name</th>
                    <th className="py-3 px-4 text-left font-medium hidden md:table-cell">Company</th>
                    <th className="py-3 px-4 text-left font-medium hidden lg:table-cell">Email</th>
                    <th className="py-3 px-4 text-left font-medium hidden xl:table-cell">Phone</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                            <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">{contact.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">{contact.company}</td>
                      <td className="py-3 px-4 hidden lg:table-cell">{contact.email}</td>
                      <td className="py-3 px-4 hidden xl:table-cell">{contact.phone}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={statusColors[contact.status]}>
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewContact(contact)}>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View calls</DropdownMenuItem>
                            <DropdownMenuItem>Add task</DropdownMenuItem>
                            <DropdownMenuItem>Add to deal</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <h3 className="mt-4 text-lg font-semibold">No contacts found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or add a new contact.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ContactDetail({ contact, onClose }: { contact: Contact, onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onClose}>
          Back to Contacts
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline">
            Edit Contact
          </Button>
          <Button>
            Add to Deal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback className="text-2xl">{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{contact.name}</h2>
                <p className="text-muted-foreground">{contact.title}</p>
                <p className="font-medium">{contact.company}</p>
                <div className="mt-2">
                  <Badge variant="outline" className={statusColors[contact.status]}>
                    {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{contact.location}</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{contact.company}</span>
                </div>
                {contact.assignedTo && (
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>Assigned to: {contact.assignedTo}</span>
                  </div>
                )}
                {contact.createdDate && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>Created: {contact.createdDate}</span>
                  </div>
                )}
              </div>

              {contact.tags && contact.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-sm mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="activity">
            <TabsList className="w-full">
              <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
              <TabsTrigger value="deals" className="flex-1">Deals</TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
              <TabsTrigger value="emails" className="flex-1">Emails</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="mt-4 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                  
                  {contact.interactions && contact.interactions.length > 0 ? (
                    <div className="space-y-4">
                      {contact.interactions.map(interaction => (
                        <div key={interaction.id} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {interactionIcons[interaction.type]}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium">{interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}</p>
                              <p className="text-sm text-muted-foreground">{interaction.date}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{interaction.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No recent activity recorded.</p>
                  )}
                  
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline">
                      Add Note
                    </Button>
                    <Button variant="outline">
                      Log Call
                    </Button>
                    <Button variant="outline">
                      Schedule Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="deals" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Associated Deals</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Deal
                    </Button>
                  </div>
                  <p className="text-muted-foreground">No deals associated with this contact yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Notes</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Note
                    </Button>
                  </div>
                  <p className="text-muted-foreground">No notes for this contact yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="emails" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Email History</h3>
                    <Button size="sm">
                      <Mail className="h-4 w-4 mr-1" />
                      Send Email
                    </Button>
                  </div>
                  <p className="text-muted-foreground">No email history available.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
