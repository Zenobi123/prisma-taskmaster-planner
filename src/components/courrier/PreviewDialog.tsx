
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye } from "lucide-react";
import { Client } from "@/types/client";
import { getTemplateContent, replaceVariables } from "@/utils/courrierTemplates";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: string;
  clients: Client[];
  generationType: string;
}

export const PreviewDialog = ({
  open,
  onOpenChange,
  template,
  clients,
  generationType
}: PreviewDialogProps) => {
  if (!template || clients.length === 0) return null;

  const templateContent = getTemplateContent(template);
  const previewClient = clients[0];
  const previewContent = replaceVariables(templateContent, previewClient);

  const handleDownload = () => {
    // Ici on pourrait implémenter la génération PDF
    console.log("Génération des courriers...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Aperçu du courrier
          </DialogTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {clients.length} destinataire{clients.length > 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline">
              {generationType === "publipostage" ? "Publipostage" : "Individuel"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="border rounded-lg p-6 bg-white overflow-y-auto max-h-96">
          <div className="whitespace-pre-line">{previewContent}</div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Aperçu basé sur : {previewClient.type === "morale" ? previewClient.raisonsociale : previewClient.nom}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
