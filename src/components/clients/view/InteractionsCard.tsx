
import { Client } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

interface InteractionsCardProps {
  client: Client;
}

export function InteractionsCard({ client }: InteractionsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold">Historique des interactions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {client.interactions && client.interactions.length > 0 ? (
          <div className="space-y-4">
            {client.interactions.map((interaction, index) => (
              <div key={index} className="border rounded-lg p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">
                  {new Date(interaction.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-sm">{interaction.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">Aucune interaction enregistrée</p>
        )}
      </CardContent>
    </Card>
  );
}
