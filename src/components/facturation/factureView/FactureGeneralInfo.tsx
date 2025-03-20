
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Facture } from "@/types/facture";
import { formatMontant, formatDate, getStatusBadge } from "./utils";

interface FactureGeneralInfoProps {
  facture: Facture;
}

export function FactureGeneralInfo({ facture }: FactureGeneralInfoProps) {
  return (
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
  );
}
