
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, CreditCard, Printer } from "lucide-react";
import { Facture } from "@/types/facture";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { generatePDF } from "@/utils/pdfUtils";

interface FactureViewProps {
  facture: Facture;
  onAddPayment?: () => void;
}

export function FactureView({ facture, onAddPayment }: FactureViewProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Formater le montant
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  // Obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "payée":
        return <Badge className="bg-green-500">Payée</Badge>;
      case "en_attente":
        return <Badge variant="outline">En attente</Badge>;
      case "partiellement_payée":
        return <Badge className="bg-amber-500">Partiellement payée</Badge>;
      case "envoyée":
        return <Badge className="bg-blue-500">Envoyée</Badge>;
      case "annulée":
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Générer et télécharger la facture en PDF
  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await generatePDF(facture);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Facture #{facture.id.substring(0, 8)}</h2>
          <p className="text-gray-500">
            Créée le {formatDate(facture.created_at || facture.date)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Télécharger
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          {(facture.status === "en_attente" || facture.status === "partiellement_payée") && (
            <Button onClick={onAddPayment}>
              <CreditCard className="mr-2 h-4 w-4" />
              Ajouter un paiement
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                <p className="mt-1">{getStatusBadge(facture.status)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date de facture</p>
                <p className="mt-1">{formatDate(facture.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date d'échéance</p>
                <p className="mt-1">{formatDate(facture.echeance)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Montant total</p>
                <p className="mt-1 font-bold">{formatMontant(facture.montant)}</p>
              </div>
              {facture.montant_paye !== undefined && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Montant payé</p>
                    <p className="mt-1">{formatMontant(facture.montant_paye)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Solde restant</p>
                    <p className="mt-1">{formatMontant(facture.montant - facture.montant_paye)}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informations client */}
        <Card>
          <CardHeader>
            <CardTitle>Informations client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Client</p>
              <p className="mt-1 font-medium">{facture.client.nom}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Adresse</p>
              <p className="mt-1">{facture.client.adresse}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="mt-1">{facture.client.telephone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-1">{facture.client.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prestations */}
      <Card>
        <CardHeader>
          <CardTitle>Prestations</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-right">Quantité</th>
                <th className="py-2 px-4 text-right">Prix unitaire</th>
                <th className="py-2 px-4 text-right">Taux</th>
                <th className="py-2 px-4 text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {facture.prestations.map((prestation, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{prestation.description}</td>
                  <td className="py-2 px-4 text-right">{prestation.quantite}</td>
                  <td className="py-2 px-4 text-right">{formatMontant(prestation.montant)}</td>
                  <td className="py-2 px-4 text-right">{prestation.taux ? `${prestation.taux}%` : "-"}</td>
                  <td className="py-2 px-4 text-right">
                    {formatMontant(prestation.montant * (prestation.quantite || 1))}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} className="py-2 px-4 text-right font-bold">Total</td>
                <td className="py-2 px-4 text-right font-bold">{formatMontant(facture.montant)}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Paiements */}
      {facture.paiements && facture.paiements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Mode</th>
                  <th className="py-2 px-4 text-right">Montant</th>
                  <th className="py-2 px-4 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {facture.paiements.map((paiement) => (
                  <tr key={paiement.id} className="border-b">
                    <td className="py-2 px-4">{formatDate(paiement.date)}</td>
                    <td className="py-2 px-4 capitalize">{paiement.mode}</td>
                    <td className="py-2 px-4 text-right">{formatMontant(paiement.montant)}</td>
                    <td className="py-2 px-4">{paiement.notes || "-"}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={2} className="py-2 px-4 text-right font-bold">Total payé</td>
                  <td className="py-2 px-4 text-right font-bold">{formatMontant(facture.montant_paye || 0)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
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
            <p className="whitespace-pre-wrap">{facture.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
