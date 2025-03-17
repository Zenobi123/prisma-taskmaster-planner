
import { FileWarning, AlertTriangle, XCircle, FileClock, CalendarClock, Calendar, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { FiscalAttestation } from "@/hooks/useExpiringFiscalAttestations";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";

interface ExpiringFiscalAttestationsProps {
  attestations: FiscalAttestation[];
  isLoading: boolean;
}

const ExpiringFiscalAttestations = ({ attestations, isLoading }: ExpiringFiscalAttestationsProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const handleNavigateToFiscal = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=obligations-fiscales`);
  };
  
  const handleManualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
  };
  
  const getStatusBadge = (daysRemaining: number) => {
    if (daysRemaining < 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1 whitespace-nowrap">
          <XCircle className="h-3.5 w-3.5" />
          <span>Expirée depuis {Math.abs(daysRemaining)} jours</span>
        </Badge>
      );
    } else if (daysRemaining <= 30) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200 whitespace-nowrap">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Expire dans {daysRemaining} jours</span>
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 whitespace-nowrap">
          <Calendar className="h-3.5 w-3.5" />
          <span>Valide pour {daysRemaining} jours</span>
        </Badge>
      );
    }
  };
  
  if (isLoading) {
    return (
      <Card className="mb-6 border-orange-300 animate-pulse">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <FileClock className="h-5 w-5 mr-2 text-orange-500" />
            Attestations de Conformité Fiscale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-100 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-6 border-orange-300">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <FileClock className="h-5 w-5 mr-2 text-orange-500" />
          Attestations de Conformité Fiscale
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleManualRefresh}
          className="ml-auto h-8 w-8 p-0"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Actualiser</span>
        </Button>
      </CardHeader>
      <CardContent>
        {attestations && attestations.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Date de création</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <CalendarClock className="h-4 w-4" />
                      <span>Date d'expiration</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attestations.map((attestation, index) => (
                  <TableRow key={index} className={attestation.daysRemaining < 0 ? "bg-red-50" : ""}>
                    <TableCell className="font-medium">{attestation.name}</TableCell>
                    <TableCell>
                      {getStatusBadge(attestation.daysRemaining)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {attestation.creationDate}
                    </TableCell>
                    <TableCell className="text-sm">
                      {attestation.expiryDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleNavigateToFiscal(attestation.id)}
                      >
                        Gérer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center border rounded-md bg-gray-50">
            <FileWarning className="h-12 w-12 mx-auto text-orange-500 mb-3" />
            <p className="text-gray-700 font-medium text-lg mb-2">
              Aucune attestation fiscale à renouveler
            </p>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Les attestations de conformité fiscale doivent être configurées dans l'onglet "Obligations fiscales" de chaque client.
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate('/gestion')}
              className="bg-white hover:bg-gray-100"
            >
              Configurer les attestations fiscales
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiringFiscalAttestations;
