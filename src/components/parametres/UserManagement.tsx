
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Shield, PlusCircle, Edit, Trash } from "lucide-react";
import { PermissionsFields } from "@/components/collaborateurs/form/PermissionsFields";
import { CollaborateurPermissions } from "@/types/collaborateur";

const UserManagement = () => {
  const { toast } = useToast();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Liste mise à jour des utilisateurs avec des données réelles correspondant à l'application
  const [users, setUsers] = useState([
    { id: 1, name: "Principal Admin", email: "admin@example.com", role: "admin" },
    { id: 2, name: "Joel Hervé TCHOMKAM", email: "joelhervetckomkam@gmail.com", role: "comptable" },
    { id: 3, name: "Fransnelle FANKAM FOSSO", email: "fankam.prisma@gmail.com", role: "assistant" }
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "comptable",
    permissions: [] as CollaborateurPermissions[]
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
    // Ici, on simulerait l'ajout réel à la base de données
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
    // Confirmation avant suppression
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

  const openEditModal = (user: any) => {
    setSelectedUser({ ...user, permissions: user.permissions || [] });
    setIsEditUserOpen(true);
  };

  const handlePermissionChange = (field: string, value: CollaborateurPermissions[]) => {
    if (selectedUser) {
      setSelectedUser({...selectedUser, permissions: value});
    } else {
      setNewUser({...newUser, permissions: value});
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Gestion des utilisateurs
            </CardTitle>
            <CardDescription>
              Créez et gérez les comptes utilisateurs et leurs privilèges d'accès
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddUserOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvel utilisateur
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="capitalize">{
                      roles.find(r => r.value === user.role)?.label || user.role
                    }</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(user)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog d'ajout d'utilisateur */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input 
                id="name" 
                value={newUser.name} 
                onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={newUser.email} 
                onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe initial</Label>
              <Input 
                id="password" 
                type="password" 
                value={newUser.password} 
                onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Champs de permissions */}
            <PermissionsFields 
              permissions={newUser.permissions} 
              onChange={handlePermissionChange} 
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Annuler</Button>
            <Button onClick={handleAddUser}>Ajouter l'utilisateur</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification d'utilisateur */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom complet</Label>
                <Input 
                  id="edit-name" 
                  value={selectedUser.name} 
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={selectedUser.email} 
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Rôle</Label>
                <Select 
                  value={selectedUser.role} 
                  onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-password">Réinitialiser le mot de passe</Label>
                <Input 
                  id="reset-password" 
                  type="password" 
                  placeholder="Laisser vide pour ne pas modifier" 
                  value={selectedUser.password || ""} 
                  onChange={(e) => setSelectedUser({...selectedUser, password: e.target.value})} 
                />
              </div>
              
              {/* Champs de permissions */}
              <PermissionsFields 
                permissions={selectedUser.permissions || []} 
                onChange={handlePermissionChange} 
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Annuler</Button>
            <Button onClick={handleEditUser}>Enregistrer les modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
