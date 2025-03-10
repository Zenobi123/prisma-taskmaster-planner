
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { CalendarAlert, FileWarning } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

type ClientInfo = {
  id: string;
  nom?: string;
  raisonsociale?: string;
  niu: string;
};

type FiscalDocumentWithClient = {
  id: string;
  name: string;
  description?: string;
  valid_until: string | null;
  client_id: string;
  client: ClientInfo;
  daysRemaining?: number;
  isExpired?: boolean;
};

async function fetchDocumentsToRenew() {
  // Get the current date
  const today = new Date();
  
  // Fetch documents with clients that are close to expiration or expired
  const { data, error } = await supabase
    .from('fiscal_documents')
    .select(`
      id,
      name,
      description,
      valid_until,
      client_id,
      clients:client_id (
        id,
        nom,
        raisonsociale,
        niu
      )
    `)
    .not('valid_until', 'is', null);

  if (error) {
    console.error("Error fetching fiscal documents:", error);
    throw error;
  }

  // Filter and process the documents
  const processedData = data
    .filter(item => item.valid_until)
    .map(item => {
      const validUntil = new Date(item.valid_until as string);
      const daysRemaining = differenceInDays(validUntil, today);
      const isExpired = daysRemaining < 0;
      
      return {
        ...item,
        daysRemaining,
        isExpired,
        client: item.clients as ClientInfo,
      };
    })
    // Filter to show documents expiring in the next 10 days or already expired
    .filter(item => item.daysRemaining <= 10)
    // Sort by: first the ones expiring soon (but not expired), then the expired ones
    .sort((a, b) => {
      // If both are expired or both are not expired, sort by days remaining
      if ((a.isExpired && b.isExpired) || (!a.isExpired && !b.isExpired)) {
        return a.daysRemaining - b.daysRemaining;
      }
      // Non-expired documents come first
      return a.isExpired ? 1 : -1;
    });

  return processedData;
}

export default function FiscalDocumentsToRenew() {
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["fiscal-documents-to-renew"],
    queryFn: fetchDocumentsToRenew,
  });

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-yellow-500" />
            Documents fiscaux à renouveler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-12 bg-neutral-100 rounded-md mb-2"></div>
            <div className="h-12 bg-neutral-100 rounded-md mb-2"></div>
            <div className="h-12 bg-neutral-100 rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-yellow-500" />
            Documents fiscaux à renouveler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            Aucun document fiscal à renouveler actuellement
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <FileWarning className="h-5 w-5 text-yellow-500" />
          Documents fiscaux à renouveler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>NIU</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>
                    {doc.client.raisonsociale || doc.client.nom || "Client inconnu"}
                  </TableCell>
                  <TableCell>{doc.client.niu}</TableCell>
                  <TableCell>
                    {doc.isExpired ? (
                      <div className="flex flex-col">
                        <Badge variant="destructive" className="w-fit mb-1">
                          Expiré
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarAlert className="h-3 w-3" />
                          Depuis {Math.abs(doc.daysRemaining)} jour{Math.abs(doc.daysRemaining) > 1 ? 's' : ''}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 w-fit mb-1">
                          Expire bientôt
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarAlert className="h-3 w-3" />
                          Dans {doc.daysRemaining} jour{doc.daysRemaining > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
