
import { useState } from "react";
import { Calendar, Clock, Bell } from "lucide-react";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
}

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
}

export function ReminderDialog({ 
  open, 
  onOpenChange,
  contact
}: ReminderDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reminderType, setReminderType] = useState("follow-up");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveReminder = () => {
    if (!title || !date || !time) {
      toast({
        title: "Missing fields",
        description: "Please provide title, date and time",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    // Mock saving reminder
    setTimeout(() => {
      setIsSaving(false);
      onOpenChange(false);
      resetForm();
      
      toast({
        title: "Reminder set",
        description: `Reminder "${title}" set for ${date} at ${time}`,
      });
    }, 1000);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setReminderType("follow-up");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Set Reminder</DialogTitle>
          <DialogDescription>
            {contact ? `Set a reminder for ${contact.name}` : "Set a new reminder"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Follow up on proposal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reminderType" className="text-right">
              Type
            </Label>
            <Select value={reminderType} onValueChange={setReminderType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select reminder type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Details about this reminder"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <div className="col-span-3 flex space-x-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="relative flex-1">
                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSaveReminder} disabled={isSaving}>
            {isSaving ? "Saving..." : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                Set Reminder
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
