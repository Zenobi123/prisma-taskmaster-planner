
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

function ClientActions({ client, onView, onEdit, onArchive, onRestore, onDelete }: {
  client: Client;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onArchive: (client: Client) => void;
  onRestore?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 p-0">
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
  );
}

function ClientMobileCard({ client, onView, onEdit, onArchive, onRestore, onDelete }: {
  client: Client;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onArchive: (client: Client) => void;
  onRestore?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}) {
  const clientName = client.type === "physique" ? client.nom : client.raisonsociale;

  return (
    <div
      className={`border rounded-lg p-4 space-y-3 ${client.statut === 'archive' ? 'opacity-60' : ''}`}
      onClick={() => onView(client)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Badge
            variant="outline"
            className={`shrink-0 ${
              client.type === "physique"
                ? "bg-[#D3E4FD] border-[#D3E4FD] text-blue-700"
                : "bg-[#FEC6A1] border-[#FEC6A1] text-orange-700"
            }`}
          >
            {client.type === "physique" ? "PP" : "PM"}
          </Badge>
          <div className="min-w-0">
            <div className="font-medium truncate">{clientName}</div>
            {client.contact?.email && (
              <div className="text-xs text-muted-foreground truncate">{client.contact.email}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Badge
            variant={
              client.statut === "actif" ? "success"
                : client.statut === "archive" ? "destructive"
                : "secondary"
            }
          >
            {client.statut === "archive" ? "Archivé" : client.statut === "actif" ? "Actif" : client.statut}
          </Badge>
          <ClientActions client={client} onView={onView} onEdit={onEdit} onArchive={onArchive} onRestore={onRestore} onDelete={onDelete} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <div>
          <span className="text-muted-foreground text-xs">NIU:</span>{" "}
          <span className="font-mono text-xs">{client.niu}</span>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">CDI:</span>{" "}
          <span className="text-xs">{client.centrerattachement || "-"}</span>
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground text-xs">Ville:</span>{" "}
          <span className="text-xs">
            {client.adresse?.ville}
            {client.adresse?.quartier && ` - ${client.adresse.quartier}`}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex flex-wrap gap-1">
          <ClientFiscalBadges client={client} />
        </div>
        <div className="flex flex-wrap gap-1">
          <ClientImmoBadges client={client} />
        </div>
      </div>
    </div>
  );
}

export function ClientList({ clients, onView, onEdit, onArchive, onRestore, onDelete, isMobile }: ClientListProps) {
  if (isMobile) {
    return (
      <div className="space-y-3">
        {clients.map((client) => (
          <ClientMobileCard
            key={client.id}
            client={client}
            onView={onView}
            onEdit={onEdit}
            onArchive={onArchive}
            onRestore={onRestore}
            onDelete={onDelete}
          />
        ))}
        {clients.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Aucun client trouvé</p>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Nom / Raison sociale</TableHead>
            <TableHead>NIU</TableHead>
            <TableHead className="hidden lg:table-cell">CDI</TableHead>
            <TableHead className="hidden md:table-cell">Ville</TableHead>
            <TableHead className="hidden xl:table-cell">Immo</TableHead>
            <TableHead className="hidden lg:table-cell">Fiscal</TableHead>
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
              <TableCell className="text-sm hidden lg:table-cell">{client.centrerattachement}</TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="text-sm">{client.adresse?.ville}</div>
                {client.adresse?.quartier && (
                  <div className="text-xs text-muted-foreground">{client.adresse.quartier}</div>
                )}
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <ClientImmoBadges client={client} />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
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
                <ClientActions client={client} onView={onView} onEdit={onEdit} onArchive={onArchive} onRestore={onRestore} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
