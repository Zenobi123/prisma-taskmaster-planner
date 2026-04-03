
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Archive, RotateCcw, Trash2 } from "lucide-react";
import { Client } from "@/types/client";
import { useMemo } from "react";
import { calculateAllTaxes, formatMoney, FiscalInput } from "@/utils/fiscalCalculations";

interface ClientListProps {
  clients: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onArchive: (client: Client) => void;
  onRestore?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  isMobile?: boolean;
}

function ClientFiscalBadges({ client }: { client: Client }) {
  const input: FiscalInput = useMemo(() => ({
    regimeFiscal: client.regimefiscal,
    chiffreAffaires: client.chiffreaffaires || 0,
    isCGA: client.iscga || false,
    isVendeurBoissons: client.isvendeurboissons || false,
    modePaiementIGS: client.modepaiementigs || "annuel",
    situationImmobiliere: client.situationimmobiliere
      ? {
          type: client.situationimmobiliere.type,
          loyerMensuel: client.situationimmobiliere.loyer,
          valeurBien: client.situationimmobiliere.valeur,
        }
      : undefined,
    modePaiementPSL: client.modepaiementpsl || "annuel",
  }), [client]);

  const result = useMemo(() => calculateAllTaxes(input), [input]);

  if (!client.chiffreaffaires && client.regimefiscal !== "non_professionnel" && client.regimefiscal !== "obnl") {
    return <span className="text-muted-foreground text-xs">-</span>;
  }

  const badges: { label: string; amount: number; color: string }[] = [];

  if (client.regimefiscal === "non_professionnel") {
    badges.push({ label: "NonPro", amount: 0, color: "bg-gray-100 text-gray-700" });
  } else if (client.regimefiscal === "obnl") {
    badges.push({ label: "OBNL", amount: 0, color: "bg-gray-100 text-gray-700" });
  } else {
    if (result.igs > 0) badges.push({ label: "IGS", amount: result.igs, color: "bg-blue-100 text-blue-700" });
    if (result.patente > 0) badges.push({ label: "Patente", amount: result.patente, color: "bg-indigo-100 text-indigo-700" });
    if (result.tdl > 0) badges.push({ label: "TDL", amount: result.tdl, color: "bg-purple-100 text-purple-700" });
    if (result.soldeIR > 0) {
      const label = client.type === "morale" ? "Solde IS" : "Solde IR";
      badges.push({ label, amount: result.soldeIR, color: "bg-orange-100 text-orange-700" });
    }
    if (result.licence > 0) badges.push({ label: "Licence", amount: result.licence, color: "bg-amber-100 text-amber-700" });
  }

  if (badges.length === 0) return <span className="text-muted-foreground text-xs">-</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((b) => (
        <Badge
          key={b.label}
          variant="outline"
          className={`text-[10px] leading-tight px-1.5 py-0.5 ${b.color}`}
          title={b.amount > 0 ? formatMoney(b.amount) : ""}
        >
          {b.label}
          {b.amount > 0 && <span className="ml-1 font-normal">{formatMoney(b.amount)}</span>}
        </Badge>
      ))}
    </div>
  );
}

function ClientImmoBadges({ client }: { client: Client }) {
  const input: FiscalInput = useMemo(() => ({
    regimeFiscal: client.regimefiscal,
    chiffreAffaires: client.chiffreaffaires || 0,
    isCGA: client.iscga || false,
    isVendeurBoissons: client.isvendeurboissons || false,
    modePaiementIGS: client.modepaiementigs || "annuel",
    situationImmobiliere: client.situationimmobiliere
      ? {
          type: client.situationimmobiliere.type,
          loyerMensuel: client.situationimmobiliere.loyer,
          valeurBien: client.situationimmobiliere.valeur,
        }
      : undefined,
    modePaiementPSL: client.modepaiementpsl || "annuel",
  }), [client]);

  const result = useMemo(() => calculateAllTaxes(input), [input]);

  const badges: { label: string; amount: number; color: string }[] = [];

  if (result.psl > 0) badges.push({ label: "PSL", amount: result.psl, color: "bg-teal-100 text-teal-700" });
  if (result.bail > 0) badges.push({ label: "Bail", amount: result.bail, color: "bg-rose-100 text-rose-700" });
  if (result.tf > 0) badges.push({ label: "TF", amount: result.tf, color: "bg-green-100 text-green-700" });

  if (badges.length === 0) return <span className="text-muted-foreground text-xs">-</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((b) => (
        <Badge
          key={b.label}
          variant="outline"
          className={`text-[10px] leading-tight px-1.5 py-0.5 ${b.color}`}
          title={formatMoney(b.amount)}
        >
          {b.label}
          <span className="ml-1 font-normal">{formatMoney(b.amount)}</span>
        </Badge>
      ))}
    </div>
  );
}

export function ClientList({ clients, onView, onEdit, onArchive, onRestore, onDelete, isMobile }: ClientListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Nom / Raison sociale</TableHead>
          <TableHead>NIU</TableHead>
          <TableHead>CDI</TableHead>
          <TableHead>Ville</TableHead>
          <TableHead>Immo</TableHead>
          <TableHead>Fiscal</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id} className={client.statut === 'archive' ? 'opacity-60' : ''}>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  client.type === "physique"
                    ? "bg-[#D3E4FD] border-[#D3E4FD] text-blue-700"
                    : "bg-[#FEC6A1] border-[#FEC6A1] text-orange-700"
                }
              >
                {client.type === "physique" ? "PP" : "PM"}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">
              <div>
                {client.type === "physique" ? client.nom : client.raisonsociale}
              </div>
              {client.contact?.email && (
                <div className="text-xs text-muted-foreground">{client.contact.email}</div>
              )}
            </TableCell>
            <TableCell className="text-sm">{client.niu}</TableCell>
            <TableCell className="text-sm">{client.centrerattachement}</TableCell>
            <TableCell>
              <div className="text-sm">{client.adresse?.ville}</div>
              {client.adresse?.quartier && (
                <div className="text-xs text-muted-foreground">{client.adresse.quartier}</div>
              )}
            </TableCell>
            <TableCell>
              <ClientImmoBadges client={client} />
            </TableCell>
            <TableCell>
              <ClientFiscalBadges client={client} />
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  client.statut === "actif"
                    ? "success"
                    : client.statut === "archive"
                      ? "destructive"
                      : "secondary"
                }
              >
                {client.statut === "archive" ? "Archivé" : client.statut === "actif" ? "Actif" : client.statut}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Ouvrir le menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(client)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Voir le profil
                  </DropdownMenuItem>

                  {client.statut !== "archive" && (
                    <>
                      <DropdownMenuItem onClick={() => onEdit(client)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onArchive(client)}>
                        <Archive className="mr-2 h-4 w-4" />
                        Archiver
                      </DropdownMenuItem>
                    </>
                  )}

                  {client.statut === "archive" && onRestore && (
                    <DropdownMenuItem onClick={() => onRestore(client)}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restaurer
                    </DropdownMenuItem>
                  )}

                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(client)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
