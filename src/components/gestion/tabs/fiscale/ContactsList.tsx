
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Link } from "lucide-react";

// Mock contacts
const fiscalContacts = [
  {
    id: "dgi",
    name: "Direction Générale des Impôts",
    description: "Yaoundé - Quartier Administratif",
    phone: "+237 222 23 11 11",
  },
  {
    id: "cime",
    name: "Centre des Impôts de Rattachement",
    description: "CIME Yaoundé I",
    phone: "+237 222 20 55 55",
  },
  {
    id: "control",
    name: "Service de Contrôle Fiscal",
    description: "Service des grandes entreprises",
    phone: "+237 222 20 40 40",
  }
];

interface ContactsListProps {
  onItemClick: (item: any) => void;
}

export function ContactsList({ onItemClick }: ContactsListProps) {
  return (
    <div className="space-y-3">
      {fiscalContacts.map((contact) => (
        <Button 
          key={contact.id}
          variant="ghost" 
          className="flex w-full items-start justify-start gap-3 p-3 bg-muted/40 rounded-md hover:bg-muted h-auto"
          onClick={() => onItemClick(contact)}
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
  );
}
