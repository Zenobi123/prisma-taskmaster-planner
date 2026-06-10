// Aperçu / téléchargement de FACTURE — route désormais vers le rendu fidèle
// unifié (DocumentPreviewProvider) au lieu du PDF jsPDF programmatique.
import { Facture } from '@/types/facture';
import { useDocumentPreview } from '@/components/printable/DocumentPreviewProvider';

export const useInvoicePreview = () => {
  const { previewFacture, downloadFacture } = useDocumentPreview();

  const handleVoirFacture = (facture: Facture) => previewFacture(facture);
  const handleTelechargerFacture = (facture: Facture) => downloadFacture(facture);

  return {
    handleVoirFacture,
    handleTelechargerFacture,
  };
};
