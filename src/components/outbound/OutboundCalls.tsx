
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Phone } from "lucide-react";
import { FileUploader } from "./FileUploader";
import { CallList } from "./CallList";
import { CurrentCallStatus } from "./CurrentCallStatus";
import { useVapiService } from "@/components/VapiService";

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  company?: string;
}

export function OutboundCalls() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCall, setCurrentCall] = useState<Contact | null>(null);
  const { toast } = useToast();
  const { isConnected } = useVapiService();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (phoneNumbers: string[]) => {
    setIsLoading(true);
    
    // In a real implementation, this would fetch data from an API
    // For demo purposes, we're creating mock data
    const mappedContacts = phoneNumbers.map((phoneNumber, index) => {
      // Randomly decide if this is a known contact (with a name) or just a phone number
      const isKnownContact = Math.random() > 0.4;
      
      return {
        id: `contact-${index}`,
        name: isKnownContact ? getMockName(index) : "Unknown",
        phoneNumber: formatPhoneNumber(phoneNumber),
        company: isKnownContact ? getMockCompany(index) : undefined
      };
    });
    
    setContacts(mappedContacts);
    setIsLoading(false);
    
    toast({
      title: "File Processed",
      description: `Successfully imported ${phoneNumbers.length} phone numbers`,
    });
  };
  
  const handleCall = (contact: Contact) => {
    if (!isConnected()) {
      toast({
        title: "VAPI Not Connected",
        description: "Please connect your VAPI account to make outbound calls",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentCall(contact);
    
    // Simulate an API call to initiate the call
    setTimeout(() => {
      toast({
        title: "Call Initiated",
        description: `Calling ${contact.name} at ${contact.phoneNumber}`,
      });
      
      // Simulate call ending after some time
      setTimeout(() => {
        setCurrentCall(null);
        toast({
          title: "Call Ended",
          description: `Call with ${contact.name} has ended`,
        });
      }, 5000 + Math.random() * 5000); // Random call duration between 5-10 seconds
    }, 1500);
  };
  
  // Helper function to format phone numbers consistently
  const formatPhoneNumber = (phoneNumber: string): string => {
    // Strip everything except digits
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (digits.length === 10) {
      return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
    }
    
    // Return as-is if can't format
    return phoneNumber;
  };
  
  // Mock data generators
  const getMockName = (index: number): string => {
    const names = [
      "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", 
      "David Wilson", "Jennifer Moore", "Robert Taylor", "Lisa Anderson", 
      "James Thomas", "Jessica White", "William Harris", "Amanda Martin"
    ];
    return names[index % names.length];
  };
  
  const getMockCompany = (index: number): string => {
    const companies = [
      "Acme Corp", "Tech Solutions", "Global Industries", "Innovative Systems",
      "Premier Services", "Strategic Partners", "Leading Edge Technologies",
      "Excellence Enterprises", "Quality Products", "Superior Solutions"
    ];
    return companies[index % companies.length];
  };
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Phone Numbers
            </CardTitle>
            <CardDescription>
              Upload a CSV or TXT file with phone numbers to start making calls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader onUploadComplete={handleFileUpload} isLoading={isLoading} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Current Call
            </CardTitle>
            <CardDescription>
              View details about your current active call
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrentCallStatus currentCall={currentCall} />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Call List</CardTitle>
          <CardDescription>
            {contacts.length > 0 
              ? `${contacts.length} numbers ready to dial`
              : "Upload a file to load phone numbers"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CallList 
            contacts={contacts} 
            onCall={handleCall} 
            isCallActive={currentCall !== null}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default OutboundCalls;
