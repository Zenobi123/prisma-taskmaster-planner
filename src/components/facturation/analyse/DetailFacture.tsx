
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  PieChart, 
  Building, 
  UserCheck, 
  Banknote, 
  DollarSign,
  FileText,
  CalendarClock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatMontant } from "@/utils/formatUtils";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { PieChart as RechartsDonut, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface DetailFactureProps {
  factureId: string;
}

type FactureDetail = {
  id: string;
  date: string;
  client: string;
  montant: number;
  montant_paye: number;
  status: string;
  status_paiement: string;
  echeance: string;
  prestations: {
    id: string;
    description: string;
    montant: number;
    type?: string;
  }[];
};

const COLORS = ['#84A98C', '#52796F', '#354F52', '#2F3E46', '#CAD2C5'];

const DetailFacture = ({ factureId }: DetailFactureProps) => {
  const [factureDetail, setFactureDetail] = useState<FactureDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("repartition");

  useEffect(() => {
    const fetchFactureDetail = async () => {
      setIsLoading(true);
      try {
        // Fetch facture
        const { data: factureData, error: factureError } = await supabase
          .from("factures")
          .select(`
            id, date, echeance, montant, montant_paye, status, status_paiement,
            clients:client_id (id, nom, raisonsociale, type)
          `)
          .eq("id", factureId)
          .single();
        
        if (factureError) throw factureError;
        
        // Fetch prestations
        const { data: prestationsData, error: prestationsError } = await supabase
          .from("prestations")
          .select("*")
          .eq("facture_id", factureId);
        
        if (prestationsError) throw prestationsError;
        
        // Map prestations to add a "type" property
        const prestationsWithType = prestationsData.map(prestation => {
          // Check if the description includes these keywords to determine type
          let type = "honoraires";
          
          const descLower = prestation.description.toLowerCase();
          if (
            descLower.includes("patente") || 
            descLower.includes("bail") || 
            descLower.includes("taxe") || 
            descLower.includes("impôt") || 
            descLower.includes("précompte") || 
            descLower.includes("solde ir") || 
            descLower.includes("solde irpp") || 
            descLower.includes("timbre")
          ) {
            type = "impots";
          }
          
          return {
            ...prestation,
            type
          };
        });
        
        // Format client name based on client type
        const clientName = factureData.clients.type === 'physique'
          ? factureData.clients.nom
          : factureData.clients.raisonsociale;
        
        setFactureDetail({
          id: factureData.id,
          date: factureData.date,
          client: clientName,
          montant: factureData.montant,
          montant_paye: factureData.montant_paye || 0,
          status: factureData.status,
          status_paiement: factureData.status_paiement,
          echeance: factureData.echeance,
          prestations: prestationsWithType
        });
      } catch (error) {
        console.error("Error fetching facture details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (factureId) {
      fetchFactureDetail();
    }
  }, [factureId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!factureDetail) {
    return <div>Détails de la facture non disponibles</div>;
  }

  // Calculate totals
  const totalImpots = factureDetail.prestations
    .filter(p => p.type === "impots")
    .reduce((sum, p) => sum + p.montant, 0);
    
  const totalHonoraires = factureDetail.prestations
    .filter(p => p.type === "honoraires")
    .reduce((sum, p) => sum + p.montant, 0);
    
  const montantRestant = factureDetail.montant - factureDetail.montant_paye;
  const pourcentagePaye = (factureDetail.montant_paye / factureDetail.montant) * 100;

  // Prepare chart data
  const chartData = [
    { name: 'Impôts', value: totalImpots },
    { name: 'Honoraires', value: totalHonoraires }
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">{factureDetail.id}</h2>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <UserCheck className="h-4 w-4" />
            <span>{factureDetail.client}</span>
            <CalendarClock className="h-4 w-4 ml-2" />
            <span>Émise le {factureDetail.date}</span>
          </div>
        </div>
        <Badge 
          className={`
            ${factureDetail.status_paiement === 'payée' ? 'bg-green-500' : 
              factureDetail.status_paiement === 'partiellement_payée' ? 'bg-orange-500' : 
              factureDetail.status_paiement === 'en_retard' ? 'bg-red-500' : 
              'bg-gray-500'}
          `}
        >
          {factureDetail.status_paiement === 'non_payée' ? 'Non payée' :
            factureDetail.status_paiement === 'partiellement_payée' ? 'Partiellement payée' :
            factureDetail.status_paiement === 'en_retard' ? 'En retard' :
            'Payée'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center">
            <Banknote className="h-8 w-8 mr-3 text-[#84A98C]" />
            <div>
              <p className="text-sm text-gray-500">Montant total</p>
              <p className="text-xl font-bold">{formatMontant(factureDetail.montant)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center">
            <DollarSign className="h-8 w-8 mr-3 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Montant payé</p>
              <p className="text-xl font-bold">{formatMontant(factureDetail.montant_paye)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center">
            <Building className="h-8 w-8 mr-3 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Reste à payer</p>
              <p className="text-xl font-bold">{formatMontant(montantRestant)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Progression du paiement</span>
          <span className="text-sm font-medium">{pourcentagePaye.toFixed(0)}%</span>
        </div>
        <Progress value={pourcentagePaye} className="h-2" />
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="repartition" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Répartition
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Détails
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="repartition">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Répartition des montants</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ChartContainer
                  config={{
                    impots: { label: "Impôts", color: "#84A98C" },
                    honoraires: { label: "Honoraires", color: "#2F3E46" }
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsDonut>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </RechartsDonut>
                  </ResponsiveContainer>
                </ChartContainer>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Total impôts</p>
                    <p className="text-xl font-bold text-[#84A98C]">{formatMontant(totalImpots)}</p>
                    <p className="text-xs text-gray-500">{((totalImpots / factureDetail.montant) * 100).toFixed(0)}% du total</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Total honoraires</p>
                    <p className="text-xl font-bold text-[#2F3E46]">{formatMontant(totalHonoraires)}</p>
                    <p className="text-xs text-gray-500">{((totalHonoraires / factureDetail.montant) * 100).toFixed(0)}% du total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Détail par catégorie</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Building className="h-4 w-4 mr-2 text-[#84A98C]" />
                      Impôts dus à l'administration fiscale
                    </h3>
                    <div className="space-y-2">
                      {factureDetail.prestations.filter(p => p.type === "impots").length > 0 ? (
                        factureDetail.prestations
                          .filter(p => p.type === "impots")
                          .map(prestation => (
                            <div key={prestation.id} className="flex justify-between px-2 py-1 bg-gray-50 rounded">
                              <span className="text-sm">{prestation.description}</span>
                              <span className="text-sm font-medium">{formatMontant(prestation.montant)}</span>
                            </div>
                          ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">Aucun impôt sur cette facture</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <UserCheck className="h-4 w-4 mr-2 text-[#2F3E46]" />
                      Honoraires du Cabinet
                    </h3>
                    <div className="space-y-2">
                      {factureDetail.prestations.filter(p => p.type === "honoraires").length > 0 ? (
                        factureDetail.prestations
                          .filter(p => p.type === "honoraires")
                          .map(prestation => (
                            <div key={prestation.id} className="flex justify-between px-2 py-1 bg-gray-50 rounded">
                              <span className="text-sm">{prestation.description}</span>
                              <span className="text-sm font-medium">{formatMontant(prestation.montant)}</span>
                            </div>
                          ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">Aucun honoraire sur cette facture</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factureDetail.prestations.map(prestation => (
                    <TableRow key={prestation.id}>
                      <TableCell>{prestation.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          prestation.type === "impots" 
                            ? "bg-[#84A98C]/10 text-[#84A98C] border-[#84A98C]/20" 
                            : "bg-[#2F3E46]/10 text-[#2F3E46] border-[#2F3E46]/20"
                        }>
                          {prestation.type === "impots" ? "Impôts" : "Honoraires"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatMontant(prestation.montant)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailFacture;
