
import React, { useState } from "react";
import { addDays, format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Users, Video } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AvailabilityTimeslots } from "./AvailabilityTimeslots";
import { MeetingTypeSelector } from "./MeetingTypeSelector";

export interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
}

export function MeetingScheduler() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [meetingType, setMeetingType] = useState("discovery");
  const [meetingDuration, setMeetingDuration] = useState("30");
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Mock contacts data
  const contacts: Contact[] = [
    { id: "1", name: "Alice Smith", email: "alice@example.com", company: "Acme Inc." },
    { id: "2", name: "Bob Johnson", email: "bob@example.com", company: "Beta Corp" },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", company: "Charlie Ltd" },
  ];

  const meetingTypes = [
    { id: "discovery", name: "Discovery Call", icon: <User className="h-4 w-4" />, duration: 30 },
    { id: "demo", name: "Product Demo", icon: <Video className="h-4 w-4" />, duration: 45 },
    { id: "consultation", name: "Consultation", icon: <Users className="h-4 w-4" />, duration: 60 },
  ];

  const scheduleMeeting = () => {
    if (!selectedDate || !selectedTimeSlot || !selectedContact) {
      toast({
        title: "Missing information",
        description: "Please select a date, time, and contact to schedule a meeting",
        variant: "destructive",
      });
      return;
    }

    setIsScheduling(true);
    
    // Mock API call for scheduling
    setTimeout(() => {
      setIsScheduling(false);
      
      const contactName = contacts.find(c => c.id === selectedContact)?.name || "contact";
      
      toast({
        title: "Meeting scheduled",
        description: `Your ${meetingTypes.find(m => m.id === meetingType)?.name} with ${contactName} has been scheduled for ${format(selectedDate, "MMMM do, yyyy")} at ${selectedTimeSlot}.`,
      });
      
      // Reset selection
      setSelectedTimeSlot(null);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Schedule a Meeting</CardTitle>
            <CardDescription>
              Select a date, time, and contact to schedule a meeting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Meeting Type</Label>
                <MeetingTypeSelector 
                  meetingTypes={meetingTypes} 
                  selectedType={meetingType}
                  onSelectType={setMeetingType}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={meetingDuration} onValueChange={setMeetingDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>With Contact</Label>
                <Select value={selectedContact || ""} onValueChange={setSelectedContact}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map(contact => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name} - {contact.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Select a Date & Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">Calendar</h3>
                  <div className="flex">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {selectedDate ? format(selectedDate, "MMMM yyyy") : "Select a date"}
                    </span>
                  </div>
                </div>

                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  fromDate={startOfDay(new Date())}
                  toDate={addDays(new Date(), 60)}
                  className="border rounded-md p-2"
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Available Timeslots
                </h3>
                
                {selectedDate ? (
                  <AvailabilityTimeslots 
                    date={selectedDate} 
                    duration={parseInt(meetingDuration)}
                    selectedTimeSlot={selectedTimeSlot}
                    onSelectTimeSlot={setSelectedTimeSlot}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Please select a date to see available timeslots
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={scheduleMeeting} 
              disabled={!selectedDate || !selectedTimeSlot || !selectedContact || isScheduling}
              className="w-full"
            >
              {isScheduling ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
