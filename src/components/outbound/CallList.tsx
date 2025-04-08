
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Phone } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  company?: string;
}

interface CallListProps {
  contacts: Contact[];
  onCall: (contact: Contact) => void;
  isCallActive: boolean;
}

export function CallList({ contacts, onCall, isCallActive }: CallListProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No phone numbers loaded. Please upload a file to get started.
      </div>
    );
  }
  
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">
                {contact.name}
              </TableCell>
              <TableCell>{contact.phoneNumber}</TableCell>
              <TableCell>{contact.company || "-"}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCall(contact)}
                  disabled={isCallActive}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
