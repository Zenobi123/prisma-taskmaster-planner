
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Client } from "@/types/client";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: string;
  clients: Client[];
  generationType?: string;
}

export const PreviewDialog = ({ 
  open, 
  onOpenChange, 
  template, 
  clients,
  generationType = "courrier"
}: PreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aperçu du courrier</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Modèle sélectionné : {template}</h3>
            <p className="text-sm text-muted-foreground">
              {clients.length} client{clients.length > 1 ? 's' : ''} sélectionné{clients.length > 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="border rounded-lg p-6 bg-white">
            <h4 className="font-medium mb-4">Liste des clients :</h4>
            <div className="space-y-2">
              {clients.map((client) => (
                <div key={client.id} className="text-sm border-b pb-2">
                  <div className="font-medium">
                    {client.type === "morale" ? client.raisonsociale : client.nom}
                  </div>
                  <div className="text-muted-foreground">
                    {client.niu} • {client.centrerattachement}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
