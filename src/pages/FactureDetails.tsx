
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  CreditCard,
  Edit,
  Trash2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFactureById } from "@/services/facture/facturesQuery";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { StatusBadge } from "@/components/facturation/table/StatusBadge";
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

  // Formatage des valeurs
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

  // Gestionnaire de suppression
  const handleDelete = async () => {
    if (!id) return;
    try {
      await handleDeleteInvoice(id);
      navigate("/facturation");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement des détails de la facture...</p>
        </div>
      </div>
    );
  }

  if (isError || !facture) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-destructive mb-4">Erreur lors du chargement de la facture</p>
          <Button variant="outline" onClick={() => navigate("/facturation")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  // Calcul du reste à payer
  const resteAPayer = facture.montant - (facture.montant_paye || 0);

  return (
    <div className="container mx-auto py-8">
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/facturation")}
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Facture {facture.id}</h1>
          <StatusBadge status={facture.status} />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => printFacturePDF(facture)}
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadFacturePDF(facture)}
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
          
          {facture.status !== "paye" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/facturation/${facture.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsPaiementDialogOpen(true)}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Enregistrer un paiement
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Informations générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de la facture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date d'émission:</span>
              <span>{formatDate(facture.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date d'échéance:</span>
              <span>{formatDate(facture.echeance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mode de règlement:</span>
              <span>{facture.mode_reglement || "Non spécifié"}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom:</span>
              <span>{facture.client_nom}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{facture.client_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Téléphone:</span>
              <span>{facture.client_telephone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Adresse:</span>
              <span>{facture.client_adresse}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Prestations */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prestations facturées</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Description</TableHead>
                <TableHead className="text-right">Montant (FCFA)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facture.prestations.map((prestation, index) => (
                <TableRow key={index}>
                  <TableCell>{prestation.description}</TableCell>
                  <TableCell className="text-right">{prestation.montant.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>{formatMontant(facture.montant)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Montant payé:</span>
              <span>{formatMontant(facture.montant_paye)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Reste à payer:</span>
              <span>{formatMontant(resteAPayer)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Historique des paiements */}
      {facture.paiements && facture.paiements.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Historique des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead className="text-right">Montant (FCFA)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facture.paiements.map((paiement, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(paiement.date)}</TableCell>
                    <TableCell>{paiement.mode}</TableCell>
                    <TableCell>{paiement.reference || "-"}</TableCell>
                    <TableCell className="text-right">{paiement.montant.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Notes */}
      {facture.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{facture.notes}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Dialogue de paiement */}
      <PaiementDialog
        facture={facture}
        isOpen={isPaiementDialogOpen}
        onOpenChange={setIsPaiementDialogOpen}
        onPaiement={handlePaiementPartiel}
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
