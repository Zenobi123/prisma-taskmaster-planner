
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

const ProfileSettings = () => {
  const { toast } = useToast();
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été mises à jour avec succès."
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil utilisateur</CardTitle>
        <CardDescription>
          Gérez vos informations personnelles et professionnelles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback>
                JP
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Changer la photo</Button>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" defaultValue="Jean" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" defaultValue="Dupont" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="jean.dupont@prisma.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="+33 6 12 34 56 78" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input id="position" defaultValue="Comptable" />
            </div>
            
            <Button type="submit">Enregistrer les modifications</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
