
import React from "react";
import { Button } from "@/components/ui/button";
import { UserRound, FileText, Link } from "lucide-react";
import { FiscalContact } from "./types";
import { toast } from "@/hooks/use-toast";

interface ContactsSectionProps {
  contacts: FiscalContact[];
}

export const ContactsSection: React.FC<ContactsSectionProps> = ({ contacts }) => {
  const handleItemClick = (contact: FiscalContact) => {
    console.log("Contact clicked:", contact);
    toast({
      title: "Contact sélectionné",
      description: `Vous avez sélectionné: ${contact.name}`,
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
        <UserRound size={20} className="text-primary" />
        Contacts principaux
      </h3>
      <div className="space-y-3">
        {contacts.map((contact) => (
          <Button 
            key={contact.id}
            variant="ghost" 
            className="flex w-full items-start justify-start gap-3 p-3 bg-muted/40 rounded-md hover:bg-muted h-auto"
            onClick={() => handleItemClick(contact)}
          >
            <FileText size={20} className="text-primary mt-0.5" />
            <div className="text-left">
              <div className="font-medium flex items-center gap-1">
                {contact.name}
                <Link size={14} className="text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{contact.description}</p>
              <p className="text-sm text-muted-foreground">{contact.phone}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
