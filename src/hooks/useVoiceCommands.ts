
import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseVoiceCommandsProps {
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onNewMission: () => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onClearFilters: () => void;
  currentPage: number;
  totalPages: number;
}

export const useVoiceCommands = ({
  onSearchChange,
  onStatusFilterChange,
  onNewMission,
  onNextPage,
  onPrevPage,
  onClearFilters,
  currentPage,
  totalPages
}: UseVoiceCommandsProps) => {
  const [showHelp, setShowHelp] = useState(false);
  const { toast } = useToast();

  const handleVoiceCommand = useCallback((command: string, transcript: string) => {
    console.log('Voice command received:', command, transcript);

    switch (command) {
      case 'search':
        onSearchChange(transcript);
        toast({
          title: "Recherche effectuée",
          description: `Recherche pour: "${transcript}"`,
        });
        break;

      case 'filter-status':
        onStatusFilterChange(transcript);
        toast({
          title: "Filtre appliqué",
          description: `Filtrage par statut: ${transcript}`,
        });
        break;

      case 'new-mission':
        onNewMission();
        toast({
          title: "Nouvelle mission",
          description: "Ouverture du dialogue de création",
        });
        break;

      case 'next-page':
        if (currentPage < totalPages) {
          onNextPage();
          toast({
            title: "Navigation",
            description: `Page ${currentPage + 1}`,
          });
        } else {
          toast({
            title: "Dernière page",
            description: "Vous êtes déjà sur la dernière page",
            variant: "destructive",
          });
        }
        break;

      case 'prev-page':
        if (currentPage > 1) {
          onPrevPage();
          toast({
            title: "Navigation",
            description: `Page ${currentPage - 1}`,
          });
        } else {
          toast({
            title: "Première page",
            description: "Vous êtes déjà sur la première page",
            variant: "destructive",
          });
        }
        break;

      case 'clear-filters':
        onClearFilters();
        toast({
          title: "Filtres effacés",
          description: "Tous les filtres ont été réinitialisés",
        });
        break;

      case 'help':
        setShowHelp(true);
        break;

      default:
        toast({
          title: "Commande non reconnue",
          description: `"${transcript}" - Dites "aide" pour voir les commandes disponibles`,
          variant: "destructive",
        });
    }
  }, [
    onSearchChange,
    onStatusFilterChange,
    onNewMission,
    onNextPage,
    onPrevPage,
    onClearFilters,
    currentPage,
    totalPages,
    toast
  ]);

  return {
    handleVoiceCommand,
    showHelp,
    setShowHelp
  };
};
