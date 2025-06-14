
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileText, Users } from "lucide-react";
import { Client } from "@/types/client";
import { Template, getTemplateContent, replaceVariables } from "@/utils/courrierTemplates";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  templateId: string;
  template: Template;
  customMessage: string;
  generationType: string;
  onConfirmSend: () => void;
}

const PreviewDialog = ({
  open,
  onOpenChange,
  clients,
  templateId,
  template,
  customMessage,
  generationType,
  onConfirmSend
}: PreviewDialogProps) => {
  if (!template || clients.length === 0) return null;

  const templateContent = getTemplateContent(templateId);
  const previewClient = clients[0];
  const previewContent = replaceVariables(templateContent, previewClient);

  const handleDownload = () => {
    console.log("Génération des courriers...");
    onConfirmSend();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] bg-white">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Eye className="w-6 h-6 text-blue-600" />
            Aperçu du courrier
          </DialogTitle>
          <div className="flex gap-3 mt-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Users className="w-3 h-3 mr-1" />
              {clients.length} destinataire{clients.length > 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline" className="border-purple-200 text-purple-700">
              <FileText className="w-3 h-3 mr-1" />
              {generationType === "masse" ? "Publipostage" : "Individuel"}
            </Badge>
            <Badge variant="outline" className="border-green-200 text-green-700">
              {template.title}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="bg-gray-50 rounded-lg p-6 h-full overflow-y-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 mx-auto max-w-2xl">
              <div className="whitespace-pre-line text-sm leading-relaxed text-gray-800">
                {previewContent}
              </div>
              
              {customMessage && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Message personnalisé :
                  </h4>
                  <div className="text-blue-800 text-sm leading-relaxed">{customMessage}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Aperçu basé sur : {previewClient.type === "morale" ? previewClient.raisonsociale : previewClient.nom}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button onClick={handleDownload} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
