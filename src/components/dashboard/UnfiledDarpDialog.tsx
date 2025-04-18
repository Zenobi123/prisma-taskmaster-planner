
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnfiledDarp } from "@/services/unfiledDarpService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

interface UnfiledDarpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UnfiledDarpDialog({ open, onOpenChange }: UnfiledDarpDialogProps) {
  const navigate = useNavigate();
  
  const { data: clients = [] } = useQuery({
    queryKey: ["clients-unfiled-darp"],
    queryFn: getClientsWithUnfiledDarp
  });

  const handleClientClick = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=fiscal`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>DARP non déposées</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-2">
            {clients.map((client) => (
              <Button
                key={client.id}
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-3"
                onClick={() => handleClientClick(client.id)}
              >
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <div className="text-left">
                  <div className="font-medium">
                    {client.type === "physique" ? client.nom : client.raisonsociale}
                  </div>
                  <div className="text-sm text-muted-foreground">NIU: {client.niu}</div>
                </div>
              </Button>
            ))}
            
            {clients.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                Aucune DARP en attente de dépôt
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
