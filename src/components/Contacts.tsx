import { useState } from "react";
import { Search, Plus, MoreHorizontal, User, Mail, Phone, MapPin, Calendar, Tag, Building, Clock, Bell, Send, Briefcase, CreditCard, DollarSign } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ContactFilters, ContactFilterOptions } from "./contacts/ContactFilters";
import { LeadScoreCard } from "./contacts/LeadScoreCard";
import { EmailDialog } from "./contacts/EmailDialog";
import { ReminderDialog } from "./contacts/ReminderDialog";
import { ContactCallRecordings } from "./contacts/ContactCallRecordings";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

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
  industry?: string;
  revenue?: number;
  country?: string;
  leadScore?: number;
  website?: string;
  nextFollowUp?: string;
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
    industry: "Technology",
    revenue: 1500000,
    country: "USA",
    leadScore: 4.5,
    website: "https://acmeinc.com",
    nextFollowUp: "2023-10-15",
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
    industry: "Healthcare",
    revenue: 750000,
    country: "USA",
    leadScore: 3.0,
    website: "https://globexcorp.com",
    nextFollowUp: "2023-10-20",
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
    industry: "Manufacturing",
    revenue: 350000,
    country: "USA",
    leadScore: 2.5,
    website: "https://initech.com",
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
    industry: "Finance",
    revenue: 900000,
    country: "USA",
    leadScore: 5.0,
    website: "https://massivedynamic.com",
    nextFollowUp: "2023-11-05",
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
    industry: "Technology",
    revenue: 2500000,
    country: "USA",
    leadScore: 3.5,
    website: "https://starkindustries.com",
    nextFollowUp: "2023-10-25",
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
    industry: "Healthcare",
    revenue: 1200000,
    country: "USA",
    leadScore: 4.0,
    website: "https://wayneenterprises.com",
    nextFollowUp: "2023-11-10",
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

const industries = ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Education", "Media", "Consulting"];
const countries = ["USA", "Canada", "UK", "Germany", "France", "Australia", "Japan", "India"];

export function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [selectedView, setSelectedView] = useState<"cards" | "list">("cards");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filters, setFilters] = useState<ContactFilterOptions>({});
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);

  const filteredContacts = contacts.filter(contact => {
    // Search filter
    const matchesSearch = 
      !searchQuery || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply advanced filters
    const matchesIndustry = !filters.industry || filters.industry === "any" || contact.industry === filters.industry;
    const matchesCountry = !filters.country || filters.country === "any" || contact.country === filters.country;
    const matchesCompany = !filters.company || 
      contact.company.toLowerCase().includes(filters.company.toLowerCase());
    const matchesRevenue = !filters.minRevenue || 
      (contact.revenue && contact.revenue >= filters.minRevenue);
    const matchesStatus = !filters.status || filters.status === "any" || contact.status === filters.status;
    const matchesScore = !filters.score || 
      (contact.leadScore && contact.leadScore >= filters.score);
    
    return matchesSearch && matchesIndustry && matchesCountry && 
           matchesCompany && matchesRevenue && matchesStatus && matchesScore;
  });

  // Apply sorting
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (!filters.sortBy) return 0;
    
    switch (filters.sortBy) {
      case "name": return a.name.localeCompare(b.name);
      case "nameDesc": return b.name.localeCompare(a.name);
      case "company": return a.company.localeCompare(b.company);
      case "score": 
        return (b.leadScore || 0) - (a.leadScore || 0);
      case "scoreAsc": 
        return (a.leadScore || 0) - (b.leadScore || 0);
      case "revenueDesc": 
        return (b.revenue || 0) - (a.revenue || 0);
      case "revenueAsc": 
        return (a.revenue || 0) - (b.revenue || 0);
      case "newest":
        return new Date(b.createdDate || "").getTime() - new Date(a.createdDate || "").getTime();
      case "oldest":
        return new Date(a.createdDate || "").getTime() - new Date(b.createdDate || "").getTime();
      default: return 0;
    }
  });

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleCloseDetail = () => {
    setSelectedContact(null);
  };

  const handleSelectContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  const handleSelectAllContacts = () => {
    if (selectedContacts.length === sortedContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(sortedContacts.map(contact => contact.id));
    }
  };

  const getSelectedContactObjects = () => {
    return contacts.filter(contact => selectedContacts.includes(contact.id));
  };

  return (
    <div className="space-y-6">
      {selectedContact ? (
        <ContactDetail 
          contact={selectedContact} 
          onClose={handleCloseDetail} 
          onSetReminder={() => setIsReminderDialogOpen(true)}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
              <p className="text-muted-foreground">Manage your contacts and leads</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedContacts.length > 0 && (
                <>
                  <Button 
                    variant="outline" 
                    className="gap-1"
                    onClick={() => setIsEmailDialogOpen(true)}
                  >
                    <Send className="h-4 w-4" />
                    Email Selected
                  </Button>
                  <Button 
                    variant="outline"
                    className="gap-1"
                    onClick={() => setIsReminderDialogOpen(true)}
                  >
                    <Bell className="h-4 w-4" />
                    Set Reminder
                  </Button>
                </>
              )}
              <Button className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search contacts..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
                <Button
                  variant={selectedView === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView("cards")}
                  className="flex-1 sm:flex-none"
                >
                  Cards
                </Button>
                <Button
                  variant={selectedView === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView("list")}
                  className="flex-1 sm:flex-none"
                >
                  List
                </Button>
              </div>
            </div>

            <ContactFilters 
              filters={filters} 
              setFilters={setFilters} 
              industries={industries}
              countries={countries}
            />
          </div>

          {selectedView === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedContacts.map((contact) => (
                <Card key={contact.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={selectedContacts.includes(contact.id)}
                            onCheckedChange={() => handleSelectContact(contact.id)}
                            aria-label={`Select ${contact.name}`}
                          />
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                            <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </div>
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
                            <DropdownMenuItem onClick={() => {
                              setSelectedContact(contact);
                              setIsReminderDialogOpen(true);
                            }}>Add reminder</DropdownMenuItem>
                            <DropdownMenuItem>Add to deal</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-4">
                        <h3 className="font-semibold text-lg leading-none">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{contact.title ? `${contact.title}, ` : ''}{contact.company}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant="outline" className={statusColors[contact.status]}>
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </Badge>
                        {contact.leadScore && (
                          <LeadScoreCard score={contact.leadScore} />
                        )}
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
                      {contact.industry && (
                        <div className="flex items-center text-sm">
                          <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{contact.industry}</span>
                        </div>
                      )}
                      {contact.revenue && (
                        <div className="flex items-center text-sm">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>${contact.revenue.toLocaleString()}</span>
                        </div>
                      )}
                      {contact.nextFollowUp && (
                        <div className="flex items-center text-sm">
                          <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Follow-up: {new Date(contact.nextFollowUp).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={selectedContacts.length === sortedContacts.length && sortedContacts.length > 0}
                        onCheckedChange={handleSelectAllContacts}
                        aria-label="Select all contacts"
                      />
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="hidden md:table-cell">Company</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead className="hidden xl:table-cell">Industry</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedContacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-muted/30">
                      <TableCell>
                        <Checkbox 
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={() => handleSelectContact(contact.id)}
                          aria-label={`Select ${contact.name}`}
                        />
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{contact.company}</TableCell>
                      <TableCell className="hidden lg:table-cell">{contact.email}</TableCell>
                      <TableCell className="hidden xl:table-cell">{contact.industry || '-'}</TableCell>
                      <TableCell>
                        {contact.leadScore ? (
                          <LeadScoreCard score={contact.leadScore} size="sm" showTooltip={false} />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[contact.status]}>
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
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
                            <DropdownMenuItem onClick={() => {
                              setSelectedContact(contact);
                              setIsReminderDialogOpen(true);
                            }}>Add reminder</DropdownMenuItem>
                            <DropdownMenuItem>Add to deal</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {sortedContacts.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <h3 className="mt-4 text-lg font-semibold">No contacts found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filters, or add a new contact.
              </p>
            </div>
          )}
        </>
      )}

      {/* Email Dialog */}
      <EmailDialog 
        open={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
        selectedContacts={getSelectedContactObjects()}
      />

      {/* Reminder Dialog */}
      <ReminderDialog
        open={isReminderDialogOpen}
        onOpenChange={setIsReminderDialogOpen}
        contact={selectedContact}
      />
    </div>
  );
}

function ContactDetail({ 
  contact, 
  onClose,
  onSetReminder 
}: { 
  contact: Contact; 
  onClose: () => void;
  onSetReminder: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onClose}>
          Back to Contacts
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onSetReminder}>
            <Bell className="h-4 w-4 mr-2" />
            Set Reminder
          </Button>
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
                
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className={statusColors[contact.status]}>
                    {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                  </Badge>
                  
                  {contact.leadScore && (
                    <div className="flex items-center gap-1">
                      <LeadScoreCard score={contact.leadScore} />
                    </div>
                  )}
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
                {contact.website && (
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
                    <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {contact.website.replace(/(^\w+:|^)\/\//, '')}
                    </a>
                  </div>
                )}
                {contact.industry && (
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>{contact.industry}</span>
                  </div>
                )}
                {contact.revenue && (
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>${contact.revenue.toLocaleString()}</span>
                  </div>
                )}
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
                {contact.nextFollowUp && (
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>Follow-up: {new Date(contact.nextFollowUp).toLocaleDateString()}</span>
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
              <TabsTrigger value="recordings" className="flex-1">Call Recordings</TabsTrigger>
              <TabsTrigger value="deals" className="flex-1">Deals</TabsTrigger>
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
                    <Button variant="outline" onClick={onSetReminder}>
                      Set Reminder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recordings" className="mt-4">
              <ContactCallRecordings contactId={contact.id} contactName={contact.name} />
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
