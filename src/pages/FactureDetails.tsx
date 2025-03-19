import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchFactureById } from "@/services/facture/facturesQuery";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { downloadFacturePDF, printFacturePDF } from "@/utils/pdfUtils";
import { PaiementDialog } from "@/components/facturation/PaiementDialog";
import { useFactures } from "@/hooks/useFactures";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FactureDetailsPageHeader } from "@/components/facturation/factureDetails/FactureDetailsPageHeader";
import { FactureInfoCards } from "@/components/facturation/factureDetails/FactureInfoCards";
import { PrestationsTable } from "@/components/facturation/factureDetails/PrestationsTable";
import { PaymentHistoryTable } from "@/components/facturation/factureDetails/PaymentHistoryTable";
import { InvoiceNotes } from "@/components/facturation/factureDetails/InvoiceNotes";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const FactureDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPaiementDialogOpen, setIsPaiementDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { data: facture, isLoading, isError } = useQuery({
    queryKey: ['facture', id],
    queryFn: () => id ? fetchFactureById(id) : Promise.reject("ID manquant"),
    enabled: !!id
  });
  
  const { handlePaiementPartiel, handleDeleteInvoice } = useFactures();

  // Helper functions
  const formatMontant = (montant?: number) => {
    if (montant === undefined) return "0 FCFA";
    return montant.toLocaleString('fr-FR') + " FCFA";
  };
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      if (dateStr.includes('T')) {
        return format(parseISO(dateStr), 'dd MMMM yyyy', { locale: fr });
      }
      return format(parseISO(dateStr), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateStr;
    }
  };

  // Event handlers
  const handleBack = () => navigate("/facturation");
  
  const handleEdit = (id: string) => navigate(`/facturation/${id}/edit`);
  
  const handleDelete = async () => {
    if (!id) return;
    try {
      await handleDeleteInvoice(id);
      navigate("/facturation");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };
  
  const handlePaymentClick = () => setIsPaiementDialogOpen(true);
  
  const handleDeleteClick = () => setIsDeleteDialogOpen(true);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement des détails de la facture...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !facture) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-destructive mb-4">Erreur lors du chargement de la facture</p>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <FactureDetailsPageHeader 
        facture={facture}
        onBack={handleBack}
        onPrint={printFacturePDF}
        onDownload={downloadFacturePDF}
        onEdit={handleEdit}
        onPaymentClick={handlePaymentClick}
        onDeleteClick={handleDeleteClick}
      />
      
      <FactureInfoCards 
        invoiceDate={formatDate(facture.date)}
        dueDate={formatDate(facture.echeance)}
        paymentMethod={facture.mode_reglement}
        clientName={facture.client_nom}
        clientEmail={facture.client_email}
        clientPhone={facture.client_telephone}
        clientAddress={facture.client_adresse}
      />
      
      <PrestationsTable 
        prestations={facture.prestations}
        totalAmount={facture.montant}
        paidAmount={facture.montant_paye}
        formatAmount={formatMontant}
      />
      
      <PaymentHistoryTable 
        payments={facture.paiements}
        formatDate={formatDate}
      />
      
      <InvoiceNotes notes={facture.notes} />
      
      {/* Dialogue de paiement */}
      <PaiementDialog
        facture={facture}
        isOpen={isPaiementDialogOpen}
        onOpenChange={setIsPaiementDialogOpen}
        onPaiement={(id, paiement) => {
          return handlePaiementPartiel(id, paiement);
        }}
      />
      
      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FactureDetails;
