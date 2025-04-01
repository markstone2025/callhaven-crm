
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Calendar, Clock, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeetingScheduler } from "@/components/calendar/MeetingScheduler";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScheduledMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  contactName: string;
  contactEmail: string;
}

export default function CalendarPage() {
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  // Mock data for scheduled meetings
  const scheduledMeetings: ScheduledMeeting[] = [
    {
      id: "m1",
      title: "Discovery Call",
      date: "2023-10-25",
      time: "14:30",
      duration: 30,
      contactName: "Alice Smith",
      contactEmail: "alice@example.com"
    },
    {
      id: "m2",
      title: "Product Demo",
      date: "2023-10-27",
      time: "10:00",
      duration: 45,
      contactName: "Bob Johnson",
      contactEmail: "bob@example.com"
    },
    {
      id: "m3",
      title: "Follow-up Consultation",
      date: "2023-10-29",
      time: "15:00",
      duration: 60,
      contactName: "Charlie Brown", 
      contactEmail: "charlie@example.com"
    }
  ];

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Meeting Calendar</h1>
            <p className="text-muted-foreground">Schedule and manage your meetings with contacts</p>
          </div>
          <Dialog open={isSchedulerOpen} onOpenChange={setIsSchedulerOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px]">
              <DialogHeader>
                <DialogTitle>Schedule a Meeting</DialogTitle>
                <DialogDescription>
                  Select a date, time, and contact to schedule your meeting
                </DialogDescription>
              </DialogHeader>
              <MeetingScheduler />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
            <TabsTrigger value="past">Past Meetings</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {scheduledMeetings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No upcoming meetings</h3>
                <p className="text-muted-foreground mt-2">
                  You don't have any meetings scheduled. Create your first meeting to get started.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSchedulerOpen(true)}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Meeting
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {scheduledMeetings.map((meeting) => (
                  <div 
                    key={meeting.id} 
                    className="p-4 border rounded-lg flex items-start justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{meeting.title}</h3>
                        <div className="text-muted-foreground flex flex-col space-y-1 mt-1">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>
                              {meeting.date.split('-').reverse().join('/')} at {meeting.time} 
                              ({meeting.duration} minutes)
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            <span>
                              {meeting.contactName} ({meeting.contactEmail})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <Button variant="outline" size="sm" className="mr-2">
                        Reschedule
                      </Button>
                      <Button variant="destructive" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No past meetings</h3>
              <p className="text-muted-foreground mt-2">
                Your past meetings will appear here once you've had some scheduled meetings.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
