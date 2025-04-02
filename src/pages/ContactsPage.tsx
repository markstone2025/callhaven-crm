
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Contacts } from "@/components/Contacts";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddContactForm } from "@/components/contacts/AddContactForm";

const ContactsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(
    location.hash === "#add-contact"
  );

  const handleOpenChange = (open: boolean) => {
    setIsAddContactDialogOpen(open);
    if (open) {
      navigate("#add-contact", { replace: true });
    } else {
      navigate("", { replace: true });
    }
  };

  const handleAddContact = (contact: any) => {
    // The contact will be added through the AddContactForm component
    // which passes the contact to the Contacts component
    setIsAddContactDialogOpen(false);
    navigate("", { replace: true });
  };

  return (
    <Layout>
      <Contacts />
      
      {/* Standalone Add Contact Form (triggered by URL hash) */}
      <AddContactForm 
        open={isAddContactDialogOpen}
        onOpenChange={handleOpenChange}
        onAddContact={handleAddContact}
      />
      
      {/* Add a floating action button for quick access */}
      <div className="fixed bottom-8 right-8">
        <Button 
          size="lg" 
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => handleOpenChange(true)}
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Contact</span>
        </Button>
      </div>
    </Layout>
  );
};

export default ContactsPage;
