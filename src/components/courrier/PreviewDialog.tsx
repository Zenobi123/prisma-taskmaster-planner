
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download } from "lucide-react";
import { Client } from "@/types/client";

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: string;
  clients: Client[];
  templates: Array<{ id: string; name: string; type: string; description: string; content: string }>;
}

export function PreviewDialog({ isOpen, onClose, template, clients, templates }: PreviewDialogProps) {
  const selectedTemplate = templates.find(t => t.id === template);
  const previewClient = clients[0]; // Premier client pour l'aperçu

  const generatePreviewContent = () => {
    if (!selectedTemplate || !previewClient) return '';
    
    let content = selectedTemplate.content;
    
    // Remplacer les variables par les données du client
    content = content.replace(/\[NOM_CLIENT\]/g, previewClient.type === 'morale' ? previewClient.raisonsociale || '' : previewClient.nom || '');
    content = content.replace(/\[ADRESSE\]/g, `${previewClient.adresse?.quartier || ''}, ${previewClient.adresse?.ville || ''}`);
    content = content.replace(/\[NIU\]/g, previewClient.niu || '');
    content = content.replace(/\[CENTRE_IMPOTS\]/g, previewClient.centrerattachement || '');
    content = content.replace(/\[SECTEUR_ACTIVITE\]/g, previewClient.secteuractivite || '');
    content = content.replace(/\[DATE\]/g, new Date().toLocaleDateString('fr-FR'));
    
    return content;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Aperçu du Courrier
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {selectedTemplate?.name}
              </Badge>
              <span className="text-sm text-gray-500">
                {clients.length} destinataire{clients.length > 1 ? 's' : ''}
              </span>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter PDF
            </Button>
          </div>

          <ScrollArea className="h-96 border rounded-lg p-4">
            <div className="prose max-w-none">
              <div className="whitespace-pre-line">
                {generatePreviewContent()}
              </div>
            </div>
          </ScrollArea>

          {previewClient && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Aperçu basé sur :</h4>
              <p className="text-sm text-gray-600">
                {previewClient.type === 'morale' ? previewClient.raisonsociale : previewClient.nom} - {previewClient.secteuractivite}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
