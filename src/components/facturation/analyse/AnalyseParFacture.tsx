
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatMontant } from "@/utils/formatUtils";
import { useFactures } from "@/hooks/facturation/useFactures";
import { useFactureViewActions } from "@/hooks/facturation/factureActions/useFactureViewActions";
import DetailFacture from "./DetailFacture";
import { Skeleton } from "@/components/ui/skeleton";
import { useBillingStats } from "./context/BillingStatsContext";

const AnalyseParFacture = () => {
  const { factures } = useFactures();
  const { handleVoirFacture } = useFactureViewActions();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFacture, setSelectedFacture] = useState<string | null>(null);
  const [filteredFactures, setFilteredFactures] = useState(factures);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the context
  const { filters } = useBillingStats();
  const { period, clientFilter, statusFilter } = filters;

  useEffect(() => {
    // Apply period filter
    const now = new Date();
    const startDate = new Date();
    
    if (period === "month") {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === "quarter") {
      startDate.setMonth(now.getMonth() - 3);
    } else if (period === "year") {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    let filtered = factures.filter(facture => {
      // Convert DD/MM/YYYY to Date object
      const parts = facture.date.split('/');
      const factureDate = new Date(
        parseInt(parts[2]), // year
        parseInt(parts[1]) - 1, // month (0-based)
        parseInt(parts[0]) // day
      );
      
      return factureDate >= startDate && factureDate <= now;
    });
    
    // Apply client filter
    if (clientFilter) {
      filtered = filtered.filter(facture => facture.client_id === clientFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(facture => facture.status_paiement === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(facture => 
        facture.id.toLowerCase().includes(search) || 
        facture.client.nom.toLowerCase().includes(search)
      );
    }
    
    setFilteredFactures(filtered);
    setIsLoading(false);
  }, [factures, period, clientFilter, statusFilter, searchTerm]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-1 border border-gray-200">
        <CardContent className="p-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher une facture..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredFactures.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune facture trouvée
            </div>
          ) : (
            <div className="h-[calc(100vh-350px)] overflow-y-auto pr-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facture</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFactures.map((facture) => (
                    <TableRow 
                      key={facture.id}
                      className={`cursor-pointer ${selectedFacture === facture.id ? 'bg-gray-100' : ''}`}
                      onClick={() => setSelectedFacture(facture.id)}
                    >
                      <TableCell className="font-medium">{facture.id}</TableCell>
                      <TableCell>{formatMontant(facture.montant)}</TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 text-xs rounded-full text-center font-medium ${
                          facture.status_paiement === 'payée' ? 'bg-green-100 text-green-800' :
                          facture.status_paiement === 'partiellement_payée' ? 'bg-orange-100 text-orange-800' :
                          facture.status_paiement === 'en_retard' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {facture.status_paiement === 'non_payée' ? 'Non payée' :
                           facture.status_paiement === 'partiellement_payée' ? 'Partielle' :
                           facture.status_paiement === 'en_retard' ? 'En retard' :
                           'Payée'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2 border border-gray-200">
        <CardContent className="p-4">
          {selectedFacture ? (
            <DetailFacture factureId={selectedFacture} />
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)] text-gray-500">
              <FileText className="w-12 h-12 mb-4 opacity-30" />
              <p>Sélectionnez une facture pour voir son détail</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyseParFacture;
