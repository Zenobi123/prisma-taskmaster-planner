
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, X } from 'lucide-react';

interface DeclarationsSectionProps {
  fiscalYear: string;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

export const DeclarationsSection: React.FC<DeclarationsSectionProps> = ({ 
  fiscalYear, 
  hasUnsavedChanges,
  setHasUnsavedChanges
}) => {
  const [activeTab, setActiveTab] = useState<string>("annual");
  
  // Declaration status states
  const [declarations, setDeclarations] = useState({
    dsf: { assujetti: false, soumis: false, regime: "", dateLimite: "", dateSoumission: "" },
    darp: { assujetti: false, soumis: false, dateLimite: `${fiscalYear}-09-30`, dateSoumission: "" }
  });
  
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({
    dsf: false,
    darp: false
  });

  // Calculate date limite based on regime fiscal
  const calculateDateLimite = (regime: string, year: string): string => {
    if (regime === 'igs') {
      // IGS: 15 Mai de l'exercice fiscal en cours
      return `${year}-05-15`;
    } else if (regime === 'reel') {
      // Régime du Réel: 15 Avril de l'exercice en cours
      return `${year}-04-15`;
    }
    return '';
  };

  // Handle regime change
  const handleRegimeChange = (declarationType: string, regime: string) => {
    setDeclarations(prev => {
      const dateLimite = calculateDateLimite(regime, fiscalYear);
      return {
        ...prev,
        [declarationType]: {
          ...prev[declarationType as keyof typeof prev],
          regime,
          dateLimite
        }
      };
    });
    
    setHasUnsavedChanges(true);
  };

  // Handle status change for declaration (assujetti, soumis)
  const handleStatusChange = (declarationType: string, field: string, value: boolean) => {
    setDeclarations(prev => ({
      ...prev,
      [declarationType]: {
        ...prev[declarationType as keyof typeof prev],
        [field]: value
      }
    }));
    
    // If unassujetti, also make sure soumis is false
    if (field === 'assujetti' && !value) {
      setDeclarations(prev => ({
        ...prev,
        [declarationType]: {
          ...prev[declarationType as keyof typeof prev],
          soumis: false
        }
      }));
      
      // Also close details
      setExpandedDetails(prev => ({
        ...prev,
        [declarationType]: false
      }));
    }
    
    // If soumis becomes true, show details
    if (field === 'soumis' && value) {
      setExpandedDetails(prev => ({
        ...prev,
        [declarationType]: true
      }));
    }
    
    setHasUnsavedChanges(true);
  };

  // Handle date submission change
  const handleDateChange = (declarationType: string, date: string) => {
    setDeclarations(prev => ({
      ...prev,
      [declarationType]: {
        ...prev[declarationType as keyof typeof prev],
        dateSoumission: date
      }
    }));
    
    setHasUnsavedChanges(true);
  };

  // Toggle details visibility
  const toggleDetails = (declarationType: string, show: boolean) => {
    setExpandedDetails(prev => ({
      ...prev,
      [declarationType]: show
    }));
  };

  // Render declaration details
  const renderDeclarationDetails = (declarationType: string) => {
    const declaration = declarations[declarationType as keyof typeof declarations];
    
    return (
      <div className="mt-4 pl-6 space-y-3 pt-4 border-t border-dashed border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium">Détails de la déclaration</h4>
          <button 
            onClick={() => toggleDetails(declarationType, false)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        
        {declarationType === 'dsf' && (
          <div className="space-y-3 mb-3">
            <div>
              <Label htmlFor={`${declarationType}-regime`} className="text-sm">Régime fiscal</Label>
              <select
                id={`${declarationType}-regime`}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={declaration.regime}
                onChange={(e) => handleRegimeChange(declarationType, e.target.value)}
              >
                <option value="">Sélectionner un régime</option>
                <option value="igs">Impôt Général Synthétique (IGS)</option>
                <option value="reel">Régime du Réel</option>
              </select>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <div>
            <Label htmlFor={`${declarationType}-date-limite`} className="text-sm">Date limite de dépôt</Label>
            <input 
              type="date" 
              id={`${declarationType}-date-limite`}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              value={declaration.dateLimite}
              readOnly
            />
          </div>
          
          <div>
            <Label htmlFor={`${declarationType}-date-soumission`} className="text-sm">Date de soumission</Label>
            <input 
              type="date" 
              id={`${declarationType}-date-soumission`}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={declaration.dateSoumission}
              onChange={(e) => handleDateChange(declarationType, e.target.value)}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Pièces justificatives</h4>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor={`${declarationType}-declaration-file`} className="text-xs text-gray-600">
                Déclaration soumise (PDF)
              </Label>
              <input 
                id={`${declarationType}-declaration-file`}
                type="file" 
                accept=".pdf"
                className="w-full mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
              />
            </div>
            
            <div>
              <Label htmlFor={`${declarationType}-receipt-file`} className="text-xs text-gray-600">
                Accusé de réception (PDF)
              </Label>
              <input 
                id={`${declarationType}-receipt-file`}
                type="file" 
                accept=".pdf"
                className="w-full mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
              />
            </div>
            
            <div>
              <Label htmlFor={`${declarationType}-balance-file`} className="text-xs text-gray-600">
                Solde de déclaration (PDF ou Photo)
              </Label>
              <input 
                id={`${declarationType}-balance-file`}
                type="file" 
                accept=".pdf,image/*"
                className="w-full mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render a declaration item
  const renderDeclarationItem = (declarationType: string, title: string) => {
    const declaration = declarations[declarationType as keyof typeof declarations];
    
    return (
      <div key={declarationType} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <span className="font-medium text-gray-800">{title}</span>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${declarationType}-assujetti`}
                checked={declaration.assujetti}
                onCheckedChange={(checked) => handleStatusChange(declarationType, 'assujetti', checked)}
              />
              <Label htmlFor={`${declarationType}-assujetti`}>
                {declaration.assujetti ? "Assujetti" : "Non assujetti"}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${declarationType}-soumis`}
                checked={declaration.soumis}
                onCheckedChange={(checked) => handleStatusChange(declarationType, 'soumis', checked)}
                disabled={!declaration.assujetti}
              />
              <Label htmlFor={`${declarationType}-soumis`}>
                {declaration.soumis ? "Soumis" : "Non soumis"}
              </Label>
            </div>
            
            {declaration.assujetti && declaration.soumis && !expandedDetails[declarationType] && (
              <button 
                className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                onClick={() => toggleDetails(declarationType, true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Voir détails
              </button>
            )}
          </div>
        </div>
        
        {expandedDetails[declarationType] && renderDeclarationDetails(declarationType)}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Déclarations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="annual">Annuelles</TabsTrigger>
            <TabsTrigger value="monthly">Mensuelles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="annual" className="space-y-4">
            {renderDeclarationItem("dsf", "Déclaration Statistique et Fiscale (DSF)")}
            {renderDeclarationItem("darp", "Déclaration Annuelle des Revenus des Particuliers (DARP)")}
          </TabsContent>
          
          <TabsContent value="monthly" className="space-y-4">
            <p className="text-sm text-gray-500">Les déclarations mensuelles seront bientôt disponibles.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
