
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { exportAppDataToHTML, exportAppDataToCSS, exportAppDataToJS } from "@/utils/exports";

const AppSettings = () => {
  const { toast } = useToast();
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataRefreshRate, setDataRefreshRate] = useState("5");
  
  const handleSaveSettings = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Les paramètres de l'application ont été mis à jour."
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de l'application</CardTitle>
          <CardDescription>
            Personnalisez le comportement et l'apparence de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Interface</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="darkMode" className="text-base">Mode sombre</Label>
                <p className="text-sm text-muted-foreground">
                  Activer le thème sombre pour l'application
                </p>
              </div>
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Comportement</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoSave" className="text-base">Sauvegarde automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Sauvegarder automatiquement les formulaires lors de la saisie
                </p>
              </div>
              <Switch
                id="autoSave"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataRefreshRate">Fréquence de rafraîchissement des données</Label>
                <Select
                  value={dataRefreshRate}
                  onValueChange={setDataRefreshRate}
                >
                  <SelectTrigger id="dataRefreshRate">
                    <SelectValue placeholder="Sélectionner une fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button onClick={handleSaveSettings}>Enregistrer les paramètres</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sauvegarde des données</CardTitle>
          <CardDescription>
            Exportez toutes les données de l'application pour les sauvegarder
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Créez une sauvegarde de toutes les données de votre application.
            Choisissez le format qui convient à vos besoins.
          </p>
          
          <div className="bg-muted/50 p-4 rounded-md border border-muted">
            <h4 className="font-medium mb-2">Notes importantes:</h4>
            <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
              <li>Les sauvegardes contiennent toutes les données stockées localement.</li>
              <li>Pour restaurer une sauvegarde, utilisez l'option d'importation.</li>
              <li>Les fichiers HTML sont lisibles directement dans un navigateur.</li>
              <li>Les fichiers JS peuvent être utilisés pour une restauration automatisée.</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-col sm:flex-row sm:justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exporter les données
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={exportAppDataToHTML}>
                  Exporter en HTML
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAppDataToCSS}>
                  Exporter en CSS
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAppDataToJS}>
                  Exporter en JavaScript
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppSettings;
