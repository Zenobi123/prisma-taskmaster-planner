
import React, { useState } from 'react';
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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MIN_PASSWORD_LENGTH = 8;

const SecuritySettings = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      toast({
        title: "Mot de passe trop court",
        description: `Le nouveau mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`,
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Mots de passe différents",
        description: "Le nouveau mot de passe et la confirmation ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      // Verify current password by re-authenticating
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer la session utilisateur.",
          variant: "destructive",
        });
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast({
          title: "Mot de passe actuel incorrect",
          description: "Le mot de passe actuel saisi est invalide.",
          variant: "destructive",
        });
        return;
      }

      // Update password via Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le mot de passe. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Changer le mot de passe</CardTitle>
          <CardDescription>
            Mettez à jour votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isUpdating}
                maxLength={128}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isUpdating}
                maxLength={128}
              />
              <p className="text-xs text-muted-foreground">
                Minimum {MIN_PASSWORD_LENGTH} caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isUpdating}
                maxLength={128}
              />
            </div>

            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authentification à deux facteurs</CardTitle>
          <CardDescription>
            Renforcez la sécurité de votre compte avec une vérification supplémentaire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Bientôt disponible</AlertTitle>
            <AlertDescription>
              L'authentification à deux facteurs sera disponible dans une prochaine mise à jour.
              Contactez votre administrateur pour plus d'informations.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
