import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/types/client";
import { 
  Employe,
  getEmployes
} from '@/services/rhService';
import {
  Paie,
  getFichesPaie,
  getFichesPaieEmploye,
  addFichePaie,
  updateFichePaie,
  deleteFichePaie,
  calculerPaie
} from '@/services/paieService';

export const usePaie = (client: Client) => {
  const { toast } = useToast();
  
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [fichesPaie, setFichesPaie] = useState<Paie[]>([]);
  const [fichesPaieEmploye, setFichesPaieEmploye] = useState<Paie[]>([]);
  
  const [selectedEmploye, setSelectedEmploye] = useState<Employe | null>(null);
  const [selectedFichePaie, setSelectedFichePaie] = useState<Paie | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFichePaieDialogOpen, setIsFichePaieDialogOpen] = useState(false);
  const [isGeneratingBulletin, setIsGeneratingBulletin] = useState(false);
  
  const [moisFiltre, setMoisFiltre] = useState<number>(new Date().getMonth() + 1);
  const [anneeFiltre, setAnneeFiltre] = useState<number>(new Date().getFullYear());
  
  const [newFichePaie, setNewFichePaie] = useState<Partial<Paie>>({
    mois: new Date().getMonth() + 1,
    annee: new Date().getFullYear(),
    salaire_base: 0,
    heures_sup: 0,
    taux_horaire_sup: 0,
    montant_heures_sup: 0,
    primes: [],
    total_primes: 0,
    salaire_brut: 0,
    cnps_employe: 0,
    cnps_employeur: 0,
    irpp: 0,
    rav: 0,
    total_retenues: 0,
    salaire_net: 0,
    statut: 'En cours'
  });

  const fetchEmployes = async () => {
    try {
      const employesData = await getEmployes(client.id);
      setEmployes(employesData);
    } catch (error) {
      console.error("Erreur lors du chargement des employés:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des employés",
        variant: "destructive"
      });
    }
  };

  const fetchFichesPaie = async () => {
    setIsLoading(true);
    try {
      const fichesPaieData = await getFichesPaie(client.id, { mois: moisFiltre, annee: anneeFiltre });
      setFichesPaie(fichesPaieData);
    } catch (error) {
      console.error("Erreur lors du chargement des fiches de paie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les fiches de paie",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFichesPaieEmploye = async (employeId: string) => {
    try {
      const fichesPaieData = await getFichesPaieEmploye(employeId);
      setFichesPaieEmploye(fichesPaieData);
    } catch (error) {
      console.error("Erreur lors du chargement des fiches de paie de l'employé:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les fiches de paie de l'employé",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (client?.id) {
      fetchEmployes();
      fetchFichesPaie();
    }
  }, [client?.id, moisFiltre, anneeFiltre]);

  useEffect(() => {
    if (selectedEmploye?.id) {
      fetchFichesPaieEmploye(selectedEmploye.id);
      
      if (!newFichePaie.salaire_base || newFichePaie.salaire_base === 0) {
        setNewFichePaie({
          ...newFichePaie,
          employe_id: selectedEmploye.id,
          salaire_base: selectedEmploye.salaire_base
        });
      }
    } else {
      setFichesPaieEmploye([]);
    }
  }, [selectedEmploye?.id]);

  const calculerFichePaie = () => {
    if (!selectedEmploye) {
      toast({
        title: "Employé non sélectionné",
        description: "Veuillez sélectionner un employé",
        variant: "destructive"
      });
      return;
    }

    const heuresSup = Number(newFichePaie.heures_sup) || 0;
    const tauxHoraireSup = Number(newFichePaie.taux_horaire_sup) || 0;
    const primes = Array.isArray(newFichePaie.primes) ? newFichePaie.primes : [];

    const resultat = calculerPaie(selectedEmploye, Number(newFichePaie.mois), Number(newFichePaie.annee), {
      heuresSup,
      tauxHoraireSup,
      primes: primes.map(p => ({ libelle: p.libelle, montant: Number(p.montant) }))
    });

    const montantHeuresSup = heuresSup * tauxHoraireSup;
    const totalPrimes = primes.reduce((sum, prime) => sum + Number(prime.montant || 0), 0);

    setNewFichePaie({
      ...newFichePaie,
      montant_heures_sup: montantHeuresSup,
      total_primes: totalPrimes,
      salaire_brut: resultat.salaireBrut,
      cnps_employe: resultat.cnpsEmploye,
      cnps_employeur: resultat.cnpsEmployeur,
      irpp: resultat.irpp,
      rav: resultat.rav,
      total_retenues: resultat.totalRetenues,
      salaire_net: resultat.salaireNet
    });
  };

  const handleAddPrime = () => {
    setNewFichePaie({
      ...newFichePaie,
      primes: [...(Array.isArray(newFichePaie.primes) ? newFichePaie.primes : []), { libelle: '', montant: 0 }]
    });
  };

  const handleRemovePrime = (index: number) => {
    const newPrimes = [...(Array.isArray(newFichePaie.primes) ? newFichePaie.primes : [])];
    newPrimes.splice(index, 1);
    setNewFichePaie({
      ...newFichePaie,
      primes: newPrimes
    });
  };

  const handleUpdatePrime = (index: number, field: 'libelle' | 'montant', value: string | number) => {
    const newPrimes = [...(Array.isArray(newFichePaie.primes) ? newFichePaie.primes : [])];
    newPrimes[index][field] = value;
    setNewFichePaie({
      ...newFichePaie,
      primes: newPrimes
    });
  };

  const handleAddFichePaie = async () => {
    if (!selectedEmploye || !newFichePaie.mois || !newFichePaie.annee) {
      toast({
        title: "Données manquantes",
        description: "Veuillez compléter toutes les informations requises",
        variant: "destructive"
      });
      return;
    }

    try {
      // S'assurer que tous les calculs sont à jour
      calculerFichePaie();
      
      const ficheToAdd = {
        ...newFichePaie,
        employe_id: selectedEmploye.id,
        mois: Number(newFichePaie.mois),
        annee: Number(newFichePaie.annee),
        salaire_base: Number(newFichePaie.salaire_base),
        heures_sup: Number(newFichePaie.heures_sup || 0),
        taux_horaire_sup: Number(newFichePaie.taux_horaire_sup || 0),
        montant_heures_sup: Number(newFichePaie.montant_heures_sup || 0),
        total_primes: Number(newFichePaie.total_primes || 0),
        salaire_brut: Number(newFichePaie.salaire_brut),
        cnps_employe: Number(newFichePaie.cnps_employe || 0),
        cnps_employeur: Number(newFichePaie.cnps_employeur || 0),
        irpp: Number(newFichePaie.irpp || 0),
        rav: Number(newFichePaie.rav || 0),
        total_retenues: Number(newFichePaie.total_retenues || 0),
        salaire_net: Number(newFichePaie.salaire_net)
      } as Omit<Paie, 'id' | 'created_at' | 'updated_at'>;

      const addedFiche = await addFichePaie(ficheToAdd);
      setFichesPaie([...fichesPaie, addedFiche]);
      setFichesPaieEmploye([...fichesPaieEmploye, addedFiche]);
      
      setIsFichePaieDialogOpen(false);
      resetNewFichePaie();
      
      toast({
        title: "Fiche de paie créée",
        description: `La fiche de paie a été créée avec succès`,
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la fiche de paie:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la fiche de paie",
        variant: "destructive"
      });
    }
  };

  const handleUpdateFichePaieStatut = async (id: string, statut: 'En cours' | 'Payé' | 'Annulé') => {
    try {
      const updatedFiche = await updateFichePaie(id, { statut });
      setFichesPaie(fichesPaie.map(f => f.id === id ? updatedFiche : f));
      setFichesPaieEmploye(fichesPaieEmploye.map(f => f.id === id ? updatedFiche : f));
      
      if (selectedFichePaie && selectedFichePaie.id === id) {
        setSelectedFichePaie(updatedFiche);
      }
      
      toast({
        title: "Statut mis à jour",
        description: `Le statut de la fiche de paie a été mis à jour avec succès`,
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFichePaie = async (id: string) => {
    try {
      await deleteFichePaie(id);
      setFichesPaie(fichesPaie.filter(f => f.id !== id));
      setFichesPaieEmploye(fichesPaieEmploye.filter(f => f.id !== id));
      
      if (selectedFichePaie && selectedFichePaie.id === id) {
        setSelectedFichePaie(null);
      }
      
      toast({
        title: "Fiche de paie supprimée",
        description: "La fiche de paie a été supprimée avec succès",
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la fiche de paie:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la fiche de paie",
        variant: "destructive"
      });
    }
  };

  const resetNewFichePaie = () => {
    setNewFichePaie({
      mois: new Date().getMonth() + 1,
      annee: new Date().getFullYear(),
      salaire_base: selectedEmploye?.salaire_base || 0,
      heures_sup: 0,
      taux_horaire_sup: 0,
      montant_heures_sup: 0,
      primes: [],
      total_primes: 0,
      salaire_brut: 0,
      cnps_employe: 0,
      cnps_employeur: 0,
      irpp: 0,
      rav: 0,
      total_retenues: 0,
      salaire_net: 0,
      statut: 'En cours'
    });
  };

  const formatMontant = (montant?: number) => {
    if (montant === undefined || montant === null) return "-";
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(montant);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getNomMois = (mois: number) => {
    const noms = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    return noms[mois - 1];
  };

  return {
    employes,
    fichesPaie,
    fichesPaieEmploye,
    selectedEmploye,
    setSelectedEmploye,
    selectedFichePaie,
    setSelectedFichePaie,
    isLoading,
    isFichePaieDialogOpen,
    setIsFichePaieDialogOpen,
    isGeneratingBulletin,
    setIsGeneratingBulletin,
    moisFiltre,
    setMoisFiltre,
    anneeFiltre,
    setAnneeFiltre,
    newFichePaie,
    setNewFichePaie,
    calculerFichePaie,
    handleAddPrime,
    handleRemovePrime,
    handleUpdatePrime,
    handleAddFichePaie,
    handleUpdateFichePaieStatut,
    handleDeleteFichePaie,
    formatMontant,
    formatDate,
    getNomMois,
    refreshFichesPaie: fetchFichesPaie,
    refreshFichesPaieEmploye: () => selectedEmploye && fetchFichesPaieEmploye(selectedEmploye.id),
    fetchEmployes: async () => {
      try {
        const employesData = await getEmployes(client.id);
        setEmployes(employesData);
      } catch (error) {
        console.error("Erreur lors du chargement des employés:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données des employés",
          variant: "destructive"
        });
      }
    },
    fetchFichesPaie: async () => {
      setIsLoading(true);
      try {
        const fichesPaieData = await getFichesPaie(client.id, { mois: moisFiltre, annee: anneeFiltre });
        setFichesPaie(fichesPaieData);
      } catch (error) {
        console.error("Erreur lors du chargement des fiches de paie:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les fiches de paie",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    },
    fetchFichesPaieEmploye: async (employeId: string) => {
      try {
        const fichesPaieData = await getFichesPaieEmploye(employeId);
        setFichesPaieEmploye(fichesPaieData);
      } catch (error) {
        console.error("Erreur lors du chargement des fiches de paie de l'employé:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les fiches de paie de l'employé",
          variant: "destructive"
        });
      }
    }
  };
};
