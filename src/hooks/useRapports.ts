
import { useState, useEffect } from "react";
import { Rapport } from "@/types/rapport";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Fake reports data generator for demonstration
const generateFakeReports = (): Rapport[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  return [
    {
      id: "1",
      titre: "Synthèse fiscale trimestrielle",
      date: `T1 ${currentYear}`,
      type: "fiscal",
      taille: "1.2 MB",
      createdAt: new Date(currentYear, currentMonth - 3, 15)
    },
    {
      id: "2",
      titre: "Rapport de TVA mensuel",
      date: `${new Date(currentYear, currentMonth - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      type: "fiscal",
      taille: "840 KB",
      createdAt: new Date(currentYear, currentMonth - 1, 5)
    },
    {
      id: "3",
      titre: "Bilan financier annuel",
      date: `${currentYear - 1}`,
      type: "financier",
      taille: "3.5 MB",
      createdAt: new Date(currentYear, 0, 31)
    },
    {
      id: "4",
      titre: "Analyse des clients par secteur",
      date: `${new Date(currentYear, currentMonth - 2, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      type: "client",
      taille: "1.8 MB",
      createdAt: new Date(currentYear, currentMonth - 2, 20)
    },
    {
      id: "5",
      titre: "Suivi des obligations fiscales",
      date: `${new Date(currentYear, currentMonth, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      type: "fiscal",
      taille: "2.1 MB",
      createdAt: new Date(currentYear, currentMonth, 5)
    },
    {
      id: "6",
      titre: "Rapport d'activité mensuel",
      date: `${new Date(currentYear, currentMonth - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      type: "activite",
      taille: "1.5 MB",
      createdAt: new Date(currentYear, currentMonth - 1, 28)
    },
    {
      id: "7",
      titre: "État des paiements clients",
      date: `${new Date(currentYear, currentMonth, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      type: "financier",
      taille: "950 KB",
      createdAt: new Date(currentYear, currentMonth, 10)
    },
  ];
};

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
        let filteredRapports = allRapports;
        
        // Filter by type
        if (typeFilter !== "all") {
          filteredRapports = filteredRapports.filter(r => r.type === typeFilter);
        }
        
        // Filter by search term
        if (searchTerm) {
          filteredRapports = filteredRapports.filter(r => 
            r.titre.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Filter by period
        if (periodFilter !== "all") {
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth();
          
          switch (periodFilter) {
            case "this_month":
              filteredRapports = filteredRapports.filter(r => 
                r.createdAt.getMonth() === currentMonth && 
                r.createdAt.getFullYear() === currentYear
              );
              break;
            case "this_year":
              filteredRapports = filteredRapports.filter(r => 
                r.createdAt.getFullYear() === currentYear
              );
              break;
            case "last_year":
              filteredRapports = filteredRapports.filter(r => 
                r.createdAt.getFullYear() === currentYear - 1
              );
              break;
            case "custom":
              if (dateFilter) {
                filteredRapports = filteredRapports.filter(r => {
                  const reportDate = new Date(r.createdAt);
                  return (
                    reportDate.getDate() === dateFilter.getDate() &&
                    reportDate.getMonth() === dateFilter.getMonth() &&
                    reportDate.getFullYear() === dateFilter.getFullYear()
                  );
                });
              }
              break;
          }
        }
        
        // Sort by most recent first
        filteredRapports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
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
  const generateReport = async (type: string, parameters: any) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would communicate with the backend
      // For demo purposes, we'll simulate a report generation
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new fake report
      const newReport: Rapport = {
        id: Math.random().toString(36).substring(2, 9),
        titre: parameters.titre,
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        type: type,
        taille: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
        createdAt: new Date()
      };
      
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
