
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface VoiceHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VoiceHelpDialog = ({ open, onOpenChange }: VoiceHelpDialogProps) => {
  const commands = [
    {
      category: "Recherche et filtrage",
      items: [
        { command: "Rechercher [terme]", description: "Recherche dans les missions" },
        { command: "Filtrer par statut en cours", description: "Filtre les missions en cours" },
        { command: "Filtrer par statut terminé", description: "Filtre les missions terminées" },
        { command: "Filtrer par statut en attente", description: "Filtre les missions en attente" },
        { command: "Effacer filtres", description: "Réinitialise tous les filtres" },
      ]
    },
    {
      category: "Navigation",
      items: [
        { command: "Page suivante", description: "Va à la page suivante" },
        { command: "Page précédente", description: "Va à la page précédente" },
      ]
    },
    {
      category: "Actions",
      items: [
        { command: "Nouvelle mission", description: "Ouvre le dialogue de création" },
        { command: "Aide", description: "Affiche cette aide" },
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Commandes vocales disponibles</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {commands.map((category) => (
            <div key={category.category}>
              <h3 className="font-medium text-lg mb-3">{category.category}</h3>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono text-xs">
                        {item.command}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Conseils d'utilisation :</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Parlez clairement et attendez que le micro s'arrête</li>
            <li>• Utilisez les mots-clés exacts mentionnés ci-dessus</li>
            <li>• Assurez-vous d'avoir autorisé l'accès au microphone</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
