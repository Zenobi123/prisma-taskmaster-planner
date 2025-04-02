import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { CollaborateurPermissions } from "@/types/collaborateur";
import { UserFormData } from '../UserForm';

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: CollaborateurPermissions[];
};

export const useUserManagement = () => {
  const { toast } = useToast();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Principal Admin", email: "admin@example.com", role: "admin", permissions: [] },
    { id: 2, name: "Joel Hervé TCHOMKAM", email: "joelhervetckomkam@gmail.com", role: "comptable", permissions: [] },
    { id: 3, name: "Fransnelle FANKAM FOSSO", email: "fankam.prisma@gmail.com", role: "assistant", permissions: [] }
  ]);

  const [newUser, setNewUser] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "comptable",
    permissions: []
  });

  const roles = [
    { value: "admin", label: "Administrateur" },
    { value: "comptable", label: "Comptable" },
    { value: "assistant", label: "Assistant" },
    { value: "fiscaliste", label: "Fiscaliste" },
    { value: "gestionnaire", label: "Gestionnaire" },
    { value: "expert-comptable", label: "Expert-Comptable" }
  ];

  const handleAddUser = () => {
    setUsers([...users, { id: Date.now(), ...newUser }]);
    toast({
      title: "Utilisateur ajouté",
      description: `${newUser.name} a été ajouté avec le rôle ${newUser.role}.`
    });
    setIsAddUserOpen(false);
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "comptable",
      permissions: []
    });
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setUsers(users.filter(user => user.id !== id));
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès."
      });
    }
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    
    setUsers(users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    ));
    
    toast({
      title: "Utilisateur modifié",
      description: `Les informations de ${selectedUser.name} ont été mises à jour.`
    });
    
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleUserChange = (field: string, value: any) => {
    if (selectedUser) {
      setSelectedUser({...selectedUser, [field]: value});
    } else {
      setNewUser({...newUser, [field]: value});
    }
  };

  return {
    users,
    roles,
    newUser,
    selectedUser,
    isAddUserOpen,
    isEditUserOpen,
    setIsAddUserOpen,
    setIsEditUserOpen,
    handleAddUser,
    handleDeleteUser,
    handleEditUser,
    openEditModal,
    handleUserChange,
  };
};
