
import { Client } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneIcon, MailIcon } from "lucide-react";

interface ContactCardProps {
  client: Client;
}

export function ContactCard({ client }: ContactCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <PhoneIcon className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold">Contact</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <PhoneIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium">{client.contact?.telephone || "-"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MailIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{client.contact?.email || "-"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
