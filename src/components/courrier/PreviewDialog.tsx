
import { useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileText, Users } from "lucide-react";
import { Client } from "@/types/client";
import { Template, generateCourrierContent } from "@/utils/courrierTemplates";
import { useCabinetConfig } from "@/lib/spec/cabinetConfig";
import PrintableCourrier, { type CourrierPrintData } from "@/components/printable/PrintableCourrier";

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

// Civilité longue (Madame / Monsieur) — même résolution que le vanilla
// (getCourrierDestinataireCivilite) : civilité du client, sinon nom.
function civiliteLongueFromClient(client: Client, name: string): "" | "Madame" | "Monsieur" {
  const raw = String((client as unknown as { civilite?: string })?.civilite || "").trim().toLowerCase();
  if (["mme", "madame", "f", "femme", "féminin", "feminin"].includes(raw)) return "Madame";
  if (["m.", "m", "mr", "monsieur", "h", "homme", "masculin"].includes(raw)) return "Monsieur";
  const n = String(name || "").trim().toLowerCase();
  if (n.startsWith("madame") || n.startsWith("mme")) return "Madame";
  if (n.startsWith("monsieur") || n.startsWith("m.")) return "Monsieur";
  return "";
}

const PreviewDialog = ({
  open,
  onOpenChange,
  clients,
  template,
  customMessage,
  generationType,
  onConfirmSend
}: PreviewDialogProps) => {
  const [config] = useCabinetConfig();
  const previewClient = clients[0];

  // Construit les données exactement comme le courrier émis (sendCourrierWithStorage) :
  // objet = sujet du modèle (année substituée), corps = contenu généré (message
  // personnalisé inclus), référence au format CORR-XXXX/AAAA/MM.
  const data: CourrierPrintData | null = useMemo(() => {
    if (!template || !previewClient) return null;
    const clientName =
      previewClient.type === "morale"
        ? ((previewClient as unknown as { raisonsociale?: string }).raisonsociale || previewClient.nom || "")
        : (previewClient.nom || "");
    const now = new Date();
    const ref = `CORR-${Date.now().toString(36).toUpperCase().slice(-4)}/${now.getFullYear()}/${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    return {
      ref,
      date: now.toISOString(),
      destinataire: clientName,
      destinataireAdresse: "",
      civiliteDestinataire: civiliteLongueFromClient(previewClient, clientName),
      objet: template.subject.replace(/{{annee}}/g, String(now.getFullYear())),
      corps: generateCourrierContent(previewClient, template, customMessage),
      pj: "",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, previewClient, customMessage, open]);

  if (!template || clients.length === 0 || !data) return null;

  const handleDownload = () => {
    onConfirmSend();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-xl">
            <Eye className="w-5 h-5 text-primary" />
            Aperçu du courrier
          </DialogTitle>
          <DialogDescription>
            Vérifiez le contenu du courrier avant de l'envoyer.
          </DialogDescription>
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
          <div className="bg-gray-100 rounded-lg p-4 max-h-[60vh] overflow-y-auto">
            {/* Rendu fidèle (en-tête PRISMA), identique au courrier émis / imprimé */}
            <div className="bg-white shadow-sm mx-auto" style={{ maxWidth: "56rem" }}>
              <PrintableCourrier data={data} config={config} />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-100 pt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Aperçu basé sur : {data.destinataire}
            {clients.length > 1 ? ` (+${clients.length - 1} autre${clients.length > 2 ? "s" : ""})` : ""}
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
