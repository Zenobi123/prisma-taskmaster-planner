
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/types/client";
import { 
  Employe, 
  Conge,
  ContratEmploye,
  getEmployes, 
  getConges,
  getContratsEmploye,
  addEmploye,
  updateEmploye,
  deleteEmploye,
  addConge,
  updateConge,
  addContratEmploye,
  updateContratEmploye
} from '@/services/rhService';

export const useRessourcesHumaines = (client: Client) => {
  const { toast } = useToast();
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [conges, setConges] = useState<Conge[]>([]);
  const [contrats, setContrats] = useState<ContratEmploye[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isEmployeDialogOpen, setIsEmployeDialogOpen] = useState(false);
  const [isCongeDialogOpen, setIsCongeDialogOpen] = useState(false);
  const [isContratDialogOpen, setIsContratDialogOpen] = useState(false);
  
  const [selectedEmploye, setSelectedEmploye] = useState<Employe | null>(null);
  
  const [newEmploye, setNewEmploye] = useState<Partial<Employe>>({
    client_id: client.id,
    nom: '',
    prenom: '',
    poste: '',
    date_embauche: new Date().toISOString().split('T')[0],
    salaire_base: 0,
    statut: 'Actif'
  });
  
  const [newConge, setNewConge] = useState<Partial<Conge>>({
    type: 'Congés payés',
    date_debut: new Date().toISOString().split('T')[0],
    date_fin: new Date().toISOString().split('T')[0],
    duree_jours: 1,
    statut: 'En attente'
  });
  
  const [newContrat, setNewContrat] = useState<Partial<ContratEmploye>>({
    type: 'CDI',
    date_debut: new Date().toISOString().split('T')[0],
    statut: 'Actif'
  });

  const fetchEmployes = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchConges = async (employeId: string) => {
    try {
      const congesData = await getConges(employeId);
      setConges(congesData);
    } catch (error) {
      console.error("Erreur lors du chargement des congés:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des congés",
        variant: "destructive"
      });
    }
  };
  
  const fetchContrats = async (employeId: string) => {
    try {
      const contratsData = await getContratsEmploye(employeId);
      setContrats(contratsData);
    } catch (error) {
      console.error("Erreur lors du chargement des contrats:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des contrats",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (client?.id) {
      fetchEmployes();
    }
  }, [client?.id]);
  
  useEffect(() => {
    if (selectedEmploye?.id) {
      fetchConges(selectedEmploye.id);
      fetchContrats(selectedEmploye.id);
    } else {
      setConges([]);
      setContrats([]);
    }
  }, [selectedEmploye?.id]);

  // Filtrer les employés en fonction du terme de recherche
  const filteredEmployes = employes.filter(emp =>
    emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Ajouter un employé
  const handleAddEmploye = async () => {
    if (!newEmploye.nom || !newEmploye.prenom || !newEmploye.poste || !newEmploye.date_embauche) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const employeToAdd = {
        ...newEmploye,
        client_id: client.id,
        salaire_base: Number(newEmploye.salaire_base) || 0
      } as Omit<Employe, 'id' | 'created_at' | 'updated_at'>;
      
      const addedEmploye = await addEmploye(employeToAdd);
      setEmployes([...employes, addedEmploye]);
      setIsEmployeDialogOpen(false);
      setNewEmploye({
        client_id: client.id,
        nom: '',
        prenom: '',
        poste: '',
        date_embauche: new Date().toISOString().split('T')[0],
        salaire_base: 0,
        statut: 'Actif'
      });
      
      toast({
        title: "Employé ajouté",
        description: `${addedEmploye.prenom} ${addedEmploye.nom} a été ajouté avec succès`,
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'employé:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'employé",
        variant: "destructive"
      });
    }
  };
  
  // Ajouter un congé
  const handleAddConge = async () => {
    if (!selectedEmploye || !newConge.type || !newConge.date_debut || !newConge.date_fin || !newConge.duree_jours) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const congeToAdd = {
        ...newConge,
        employe_id: selectedEmploye.id,
        duree_jours: Number(newConge.duree_jours)
      } as Omit<Conge, 'id' | 'created_at' | 'updated_at'>;
      
      const addedConge = await addConge(congeToAdd);
      setConges([...conges, addedConge]);
      setIsCongeDialogOpen(false);
      setNewConge({
        type: 'Congés payés',
        date_debut: new Date().toISOString().split('T')[0],
        date_fin: new Date().toISOString().split('T')[0],
        duree_jours: 1,
        statut: 'En attente'
      });
      
      toast({
        title: "Congé ajouté",
        description: `Le congé a été ajouté avec succès`,
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du congé:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du congé",
        variant: "destructive"
      });
    }
  };
  
  // Ajouter un contrat
  const handleAddContrat = async () => {
    if (!selectedEmploye || !newContrat.type || !newContrat.date_debut) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const contratToAdd = {
        ...newContrat,
        employe_id: selectedEmploye.id
      } as Omit<ContratEmploye, 'id' | 'created_at' | 'updated_at'>;
      
      const addedContrat = await addContratEmploye(contratToAdd);
      setContrats([...contrats, addedContrat]);
      setIsContratDialogOpen(false);
      setNewContrat({
        type: 'CDI',
        date_debut: new Date().toISOString().split('T')[0],
        statut: 'Actif'
      });
      
      toast({
        title: "Contrat ajouté",
        description: `Le contrat a été ajouté avec succès`,
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du contrat:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du contrat",
        variant: "destructive"
      });
    }
  };
  
  // Supprimer un employé
  const handleDeleteEmploye = async (id: string) => {
    try {
      await deleteEmploye(id);
      setEmployes(employes.filter(emp => emp.id !== id));
      
      if (selectedEmploye && selectedEmploye.id === id) {
        setSelectedEmploye(null);
      }
      
      toast({
        title: "Employé supprimé",
        description: "L'employé a été supprimé avec succès",
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'employé:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'employé",
        variant: "destructive"
      });
    }
  };
  
  // Mettre à jour le statut d'un employé
  const handleUpdateEmployeStatut = async (id: string, statut: 'Actif' | 'Congé' | 'Arrêt maladie' | 'Inactif') => {
    try {
      const updatedEmploye = await updateEmploye(id, { statut });
      setEmployes(employes.map(emp => emp.id === id ? updatedEmploye : emp));
      
      if (selectedEmploye && selectedEmploye.id === id) {
        setSelectedEmploye(updatedEmploye);
      }
      
      toast({
        title: "Statut mis à jour",
        description: `Le statut de l'employé a été mis à jour avec succès`,
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
  
  // Mettre à jour le statut d'un congé
  const handleUpdateCongeStatut = async (id: string, statut: 'En attente' | 'Approuvé' | 'Refusé' | 'Annulé') => {
    try {
      const updatedConge = await updateConge(id, { statut });
      setConges(conges.map(c => c.id === id ? updatedConge : c));
      
      toast({
        title: "Statut mis à jour",
        description: `Le statut du congé a été mis à jour avec succès`,
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du congé:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut",
        variant: "destructive"
      });
    }
  };
  
  // Formatter une date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  
  return {
    employes,
    conges,
    contrats,
    isLoading,
    searchTerm,
    setSearchTerm,
    isEmployeDialogOpen,
    setIsEmployeDialogOpen,
    isCongeDialogOpen,
    setIsCongeDialogOpen,
    isContratDialogOpen,
    setIsContratDialogOpen,
    selectedEmploye,
    setSelectedEmploye,
    newEmploye,
    setNewEmploye,
    newConge,
    setNewConge,
    newContrat,
    setNewContrat,
    filteredEmployes,
    handleAddEmploye,
    handleAddConge,
    handleAddContrat,
    handleDeleteEmploye,
    handleUpdateEmployeStatut,
    handleUpdateCongeStatut,
    formatDate,
    refreshEmployes: fetchEmployes,
    refreshConges: () => selectedEmploye && fetchConges(selectedEmploye.id),
    refreshContrats: () => selectedEmploye && fetchContrats(selectedEmploye.id)
  };
};
