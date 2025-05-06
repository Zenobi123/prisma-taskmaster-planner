
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/types/client";
import { 
  DocumentAdministratif, 
  ProcedureAdministrative, 
  getDocumentsAdministratifs, 
  getProceduresAdministratives,
  addDocumentAdministratif,
  updateDocumentAdministratif,
  deleteDocumentAdministratif,
  addProcedureAdministrative,
  updateProcedureAdministrative,
  deleteProcedureAdministrative
} from '@/services/administrationService';

export const useAdministration = (client: Client) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentAdministratif[]>([]);
  const [procedures, setProcedures] = useState<ProcedureAdministrative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isProcedureDialogOpen, setIsProcedureDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newDocument, setNewDocument] = useState<Partial<DocumentAdministratif>>({
    client_id: client.id,
    type: 'Administratif',
    nom: '',
    date_creation: new Date().toISOString().split('T')[0],
    statut: 'Actif'
  });
  
  const [newProcedure, setNewProcedure] = useState<Partial<ProcedureAdministrative>>({
    client_id: client.id,
    titre: '',
    statut: 'En cours',
    priorite: 'Moyenne',
    date_debut: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [documentsData, proceduresData] = await Promise.all([
        getDocumentsAdministratifs(client.id),
        getProceduresAdministratives(client.id)
      ]);
      setDocuments(documentsData);
      setProcedures(proceduresData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données administratives",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (client?.id) {
      fetchData();
    }
  }, [client?.id]);

  // Filtrer les documents en fonction du terme de recherche
  const filteredDocuments = documents.filter(doc =>
    doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrer les procédures en fonction du terme de recherche
  const filteredProcedures = procedures.filter(proc =>
    proc.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (proc.responsable && proc.responsable.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (proc.description && proc.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Ajouter un document
  const handleAddDocument = async () => {
    if (!newDocument.nom || !newDocument.type) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const documentToAdd = {
        ...newDocument,
        client_id: client.id
      } as Omit<DocumentAdministratif, 'id' | 'created_at' | 'updated_at'>;
      
      const addedDocument = await addDocumentAdministratif(documentToAdd);
      setDocuments([...documents, addedDocument]);
      setIsDocumentDialogOpen(false);
      setNewDocument({
        client_id: client.id,
        type: 'Administratif',
        nom: '',
        date_creation: new Date().toISOString().split('T')[0],
        statut: 'Actif'
      });
      
      toast({
        title: "Document ajouté",
        description: `Le document ${addedDocument.nom} a été ajouté avec succès`,
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du document",
        variant: "destructive"
      });
    }
  };
  
  // Ajouter une procédure
  const handleAddProcedure = async () => {
    if (!newProcedure.titre || !newProcedure.statut) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const procedureToAdd = {
        ...newProcedure,
        client_id: client.id
      } as Omit<ProcedureAdministrative, 'id' | 'created_at' | 'updated_at'>;
      
      const addedProcedure = await addProcedureAdministrative(procedureToAdd);
      setProcedures([...procedures, addedProcedure]);
      setIsProcedureDialogOpen(false);
      setNewProcedure({
        client_id: client.id,
        titre: '',
        statut: 'En cours',
        priorite: 'Moyenne',
        date_debut: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: "Procédure ajoutée",
        description: `La procédure ${addedProcedure.titre} a été ajoutée avec succès`,
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la procédure:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la procédure",
        variant: "destructive"
      });
    }
  };
  
  // Supprimer un document
  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocumentAdministratif(id);
      setDocuments(documents.filter(doc => doc.id !== id));
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès",
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du document",
        variant: "destructive"
      });
    }
  };
  
  // Supprimer une procédure
  const handleDeleteProcedure = async (id: string) => {
    try {
      await deleteProcedureAdministrative(id);
      setProcedures(procedures.filter(proc => proc.id !== id));
      
      toast({
        title: "Procédure supprimée",
        description: "La procédure a été supprimée avec succès",
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la procédure:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la procédure",
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
    documents,
    procedures,
    isLoading,
    searchTerm,
    setSearchTerm,
    isDocumentDialogOpen,
    setIsDocumentDialogOpen,
    isProcedureDialogOpen,
    setIsProcedureDialogOpen,
    newDocument,
    setNewDocument,
    newProcedure,
    setNewProcedure,
    filteredDocuments,
    filteredProcedures,
    handleAddDocument,
    handleAddProcedure,
    handleDeleteDocument,
    handleDeleteProcedure,
    formatDate,
    refreshData: fetchData,
    isUploading,
    setIsUploading
  };
};
