
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const NotificationSettings = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [factureNotifications, setFactureNotifications] = useState(true);
  const [paiementNotifications, setPaiementNotifications] = useState(true);
  const [clientNotifications, setClientNotifications] = useState(false);
  const [rappelsNotifications, setRappelsNotifications] = useState(true);
  
  const handleSaveSettings = () => {
    toast({
      title: "Paramètres de notification enregistrés",
      description: "Vos préférences de notification ont été mises à jour."
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de notification</CardTitle>
        <CardDescription>
          Choisissez les notifications que vous souhaitez recevoir
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Canaux de notification</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications" className="text-base">Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications par email
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="appNotifications" className="text-base">Notifications dans l'application</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications dans l'application
              </p>
            </div>
            <Switch
              id="appNotifications"
              checked={appNotifications}
              onCheckedChange={setAppNotifications}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Types de notification</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="factureNotifications" className="text-base">Factures</Label>
              <p className="text-sm text-muted-foreground">
                Nouvelles factures, modifications de statut
              </p>
            </div>
            <Switch
              id="factureNotifications"
              checked={factureNotifications}
              onCheckedChange={setFactureNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="paiementNotifications" className="text-base">Paiements</Label>
              <p className="text-sm text-muted-foreground">
                Nouveaux paiements, échéances
              </p>
            </div>
            <Switch
              id="paiementNotifications"
              checked={paiementNotifications}
              onCheckedChange={setPaiementNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="clientNotifications" className="text-base">Clients</Label>
              <p className="text-sm text-muted-foreground">
                Nouveaux clients, mises à jour des informations clients
              </p>
            </div>
            <Switch
              id="clientNotifications"
              checked={clientNotifications}
              onCheckedChange={setClientNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rappelsNotifications" className="text-base">Rappels</Label>
              <p className="text-sm text-muted-foreground">
                Rappels de tâches et d'échéances
              </p>
            </div>
            <Switch
              id="rappelsNotifications"
              checked={rappelsNotifications}
              onCheckedChange={setRappelsNotifications}
            />
          </div>
        </div>
        
        <Button onClick={handleSaveSettings}>Enregistrer les préférences</Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
