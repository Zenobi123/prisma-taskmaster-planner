
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
      <DialogContent className="max-w-4xl max-h-[85vh] bg-white border border-gray-200">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl text-gray-900">
            <Eye className="w-5 h-5 text-[#84A98C]" />
            Aperçu du courrier
          </DialogTitle>
          <div className="flex gap-3 mt-3">
            <Badge variant="secondary" className="bg-[#84A98C] text-white">
              <Users className="w-3 h-3 mr-1" />
              {clients.length} destinataire{clients.length > 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline" className="border-gray-300 text-gray-700">
              <FileText className="w-3 h-3 mr-1" />
              {generationType === "masse" ? "Publipostage" : "Individuel"}
            </Badge>
            <Badge variant="outline" className="border-[#84A98C] text-[#84A98C]">
              {template.title}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="bg-gray-50 rounded-lg p-4 h-full overflow-y-auto">
            <div className="bg-white rounded border border-gray-200 p-6 mx-auto max-w-2xl">
              <div className="whitespace-pre-line text-sm leading-relaxed text-gray-800">
                {previewContent}
              </div>
              
              {customMessage && (
                <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-[#84A98C]">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Message personnalisé :
                  </h4>
                  <div className="text-gray-800 text-sm leading-relaxed">{customMessage}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-100 pt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Aperçu basé sur : {previewClient.type === "morale" ? previewClient.raisonsociale : previewClient.nom}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Fermer
            </Button>
            <Button onClick={handleDownload} className="bg-[#84A98C] hover:bg-[#6B8E74] text-white">
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
