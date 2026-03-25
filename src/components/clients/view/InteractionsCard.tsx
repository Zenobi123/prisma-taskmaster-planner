
import { Client } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MessageSquare } from "lucide-react";

interface InteractionsCardProps {
  client: Client;
}

export function InteractionsCard({ client }: InteractionsCardProps) {
  const interactionCount = client.interactions?.length || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">Historique des interactions</CardTitle>
          </div>
          {interactionCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {interactionCount} interaction{interactionCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {interactionCount > 0 ? (
          <div className="space-y-3">
            {client.interactions.map((interaction, index) => (
              <div key={interaction.id || index} className="flex gap-3 border rounded-lg p-4 bg-muted/30">
                <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    {new Date(interaction.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm mt-1">{interaction.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">Aucune interaction enregistrée</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
