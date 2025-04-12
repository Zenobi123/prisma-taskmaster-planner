
import { useState, useEffect } from "react";
import { Rapport, ReportParameters } from "@/types/rapport";
import { useToast } from "@/components/ui/use-toast";
import { generateFakeReports } from "@/services/rapportsService";
import { filterRapports } from "@/utils/rapportsFilterUtils";
import { generateNewReport } from "@/services/reportGeneratorService";

export function useRapports(
  typeFilter: string,
  searchTerm: string,
  periodFilter: string,
  dateFilter?: Date
) {
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch reports on mount and when filters change
  useEffect(() => {
    const fetchRapports = async () => {
      setIsLoading(true);
      
      try {
        // In a real application, this would be a database call
        // For demo purposes, we'll use our fake data generator
        const allRapports = generateFakeReports();
        
        // Apply filters
        const filteredRapports = filterRapports(
          allRapports,
          typeFilter,
          searchTerm,
          periodFilter,
          dateFilter
        );
        
        setRapports(filteredRapports);
      } catch (error) {
        console.error("Erreur lors du chargement des rapports:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les rapports. Veuillez réessayer.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRapports();
  }, [typeFilter, searchTerm, periodFilter, dateFilter, toast]);
  
  // Function to generate a new report
  const generateReport = async (type: string, parameters: ReportParameters) => {
    setIsLoading(true);
    
    try {
      // Generate a new report
      const newReport = await generateNewReport(type, parameters);
      
      // Add to the list
      setRapports(prev => [newReport, ...prev]);
      
      toast({
        title: "Rapport généré",
        description: `Le rapport "${parameters.titre}" a été généré avec succès.`
      });
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    rapports,
    isLoading,
    generateReport
  };
}
