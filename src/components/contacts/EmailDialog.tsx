
import { useState } from "react";
import { Check, Paperclip, Send } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  email: string;
}

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContacts: Contact[];
}

export function EmailDialog({ 
  open, 
  onOpenChange,
  selectedContacts 
}: EmailDialogProps) {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  const handleSendEmail = () => {
    if (!subject || !message) {
      toast({
        title: "Missing fields",
        description: "Please provide both subject and message",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    // Mock sending email
    setTimeout(() => {
      setIsSending(false);
      onOpenChange(false);
      setSubject("");
      setMessage("");
      setScheduleDate("");
      
      toast({
        title: "Email sent successfully",
        description: `Email sent to ${selectedContacts.length} contact(s)`,
        variant: "default"
      });
    }, 1500);
  };

  const handleScheduleEmail = () => {
    if (!subject || !message || !scheduleDate) {
      toast({
        title: "Missing fields",
        description: "Please provide subject, message, and schedule date",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    // Mock scheduling email
    setTimeout(() => {
      setIsSending(false);
      onOpenChange(false);
      setSubject("");
      setMessage("");
      setScheduleDate("");
      
      toast({
        title: "Email scheduled",
        description: `Email scheduled for ${new Date(scheduleDate).toLocaleString()} to ${selectedContacts.length} contact(s)`,
        variant: "default"
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
          <DialogDescription>
            Send an email to {selectedContacts.length} selected contact(s)
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recipients" className="text-right">
              To
            </Label>
            <div className="col-span-3 space-y-1">
              {selectedContacts.map(contact => (
                <div key={contact.id} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm inline-block mr-1 mb-1">
                  {contact.name} &lt;{contact.email}&gt;
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="message" className="text-right pt-2">
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3 min-h-[150px]"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="schedule" className="text-right">
              Schedule
            </Label>
            <Input
              id="schedule"
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" type="button">
            <Paperclip className="mr-2 h-4 w-4" />
            Attach Files
          </Button>
          <div className="space-x-2">
            {scheduleDate ? (
              <Button onClick={handleScheduleEmail} disabled={isSending}>
                {isSending ? (
                  <>Scheduling...</>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Schedule Email
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleSendEmail} disabled={isSending}>
                {isSending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Now
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
