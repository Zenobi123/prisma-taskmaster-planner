import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getFactures } from "@/services/factureService";
import { useClientDetails } from "../client-details-context";

interface DerivedPrestationsTabProps {
  /** "impot" → Dossier fiscal annuel ; "honoraire" → Honoraires cabinet. */
  type: "impot" | "honoraire";
}

const fmt = (n: number) => `${Math.round(n || 0).toLocaleString("fr-FR")} F CFA`;

const STATUT_LABEL: Record<string, { label: string; variant: "secondary" | "destructive" | "outline" }> = {
  payée: { label: "Payée", variant: "secondary" },
  partiellement_payée: { label: "Partielle", variant: "outline" },
  non_payée: { label: "Non payée", variant: "destructive" },
  en_retard: { label: "En retard", variant: "destructive" },
};

/**
 * Onglet en lecture seule dérivé des factures du client : liste les prestations
 * facturées d'un type donné (impôts → dossier fiscal annuel, honoraires →
 * honoraires cabinet), avec le statut de paiement de la facture porteuse.
 */
const DerivedPrestationsTab = ({ type }: DerivedPrestationsTabProps) => {
  const { clientDetails } = useClientDetails();
  const clientId = clientDetails?.id || clientDetails?.client?.id;

  const { data: factures = [], isLoading } = useQuery({
    queryKey: ["situation-client-factures", clientId],
    queryFn: async () => {
      const all = await getFactures();
      return all.filter((f) => f.client_id === clientId);
    },
    enabled: !!clientId,
  });

  const rows = useMemo(() => {
    const result: {
      key: string;
      numero: string;
      date: string;
      designation: string;
      montant: number;
      statutPaiement: string;
    }[] = [];
    factures.forEach((f) => {
      (f.prestations || [])
        .filter((p) => p.type === type)
        .forEach((p, i) => {
          result.push({
            key: `${f.id}-${i}`,
            numero: f.numero || "—",
            date: f.date,
            designation: p.description,
            montant: p.montant,
            statutPaiement: f.status_paiement,
          });
        });
    });
    return result;
  }, [factures, type]);

  const total = rows.reduce((s, r) => s + (r.montant || 0), 0);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground py-4">Chargement…</p>;
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6 border rounded-md">
        {type === "impot"
          ? "Aucun impôt facturé pour ce client."
          : "Aucun honoraire facturé pour ce client."}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Facture</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Désignation</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => {
            const st = STATUT_LABEL[r.statutPaiement] || { label: r.statutPaiement, variant: "outline" as const };
            return (
              <TableRow key={r.key}>
                <TableCell className="font-medium">{r.numero}</TableCell>
                <TableCell>{r.date ? new Date(r.date).toLocaleDateString("fr-FR") : "—"}</TableCell>
                <TableCell>{r.designation}</TableCell>
                <TableCell className="text-right">{fmt(r.montant)}</TableCell>
                <TableCell>
                  <Badge variant={st.variant}>{st.label}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell colSpan={3} className="font-semibold text-right">
              Total
            </TableCell>
            <TableCell className="text-right font-semibold">{fmt(total)}</TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default DerivedPrestationsTab;
