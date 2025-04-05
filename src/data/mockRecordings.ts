
import { Recording } from "@/types/recording";

export function getMockRecordings(contactName: string): Recording[] {
  return [
    {
      id: "rec1",
      title: "Initial Discovery Call",
      date: "2023-06-10",
      duration: "28:45",
      caller: "Sarah Johnson",
      recipient: contactName,
      source: "/static/recording1.mp3",
      transcript: {
        text: "Hello, this is Sarah from Acme Corp. I'm calling about our enterprise solution. We discussed upgrading your plan last quarter.\n\nYes, I remember. We've been evaluating several options.\n\nGreat. I'd like to schedule a demo with our technical team to show you the new features.\n\nThat sounds good. Can we do it next week?\n\nAbsolutely. How about Tuesday at 2 PM?\n\nTuesday works. I'll have my team join as well.\n\nPerfect. I'll send a calendar invite with all the details.",
        highlights: [
          { time: "02:15", text: "Discussed upgrading plan from last quarter" },
          { time: "05:30", text: "Client evaluating multiple vendor options" },
          { time: "12:45", text: "Scheduled technical demo for next Tuesday" },
          { time: "18:20", text: "Client team will join the demo call" }
        ]
      }
    },
    {
      id: "rec2",
      title: "Product Demo Follow-up",
      date: "2023-07-15",
      duration: "35:12",
      caller: contactName,
      recipient: "Mark Wilson",
      source: "/static/recording2.mp3",
      transcript: {
        text: "Hi Mark, this is [Client Name]. I wanted to follow up on the demo we had last week.\n\nHi there! Thanks for calling. What did you think of the demo?\n\nIt was impressive. My team had a few questions about the implementation timeline.\n\nOf course. Typically, our implementation takes about 4-6 weeks depending on the complexity.\n\nThat works for our timeline. We're also concerned about data migration.\n\nWe have a dedicated migration team that handles that. They can create a custom plan for your specific needs.\n\nExcellent. I think we're ready to move forward. Can you send over the proposal with the pricing we discussed?\n\nAbsolutely. I'll have that to you by end of day tomorrow. Is there anything specific you'd like me to include?\n\nPlease include the implementation timeline and support details.\n\nWill do. Thanks for your time today!",
        highlights: [
          { time: "01:30", text: "Client impressed with product demo" },
          { time: "04:15", text: "Implementation timeline: 4-6 weeks" },
          { time: "10:20", text: "Data migration concerns addressed" },
          { time: "15:45", text: "Client ready to move forward" },
          { time: "18:30", text: "Proposal with pricing to be sent" }
        ]
      }
    },
    {
      id: "rec3",
      title: "Contract Discussion",
      date: "2023-08-05",
      duration: "22:18",
      caller: "Emily Chen",
      recipient: contactName,
      source: "/static/recording3.mp3"
    },
  ];
}
