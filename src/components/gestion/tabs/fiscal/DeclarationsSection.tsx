
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DeclarationProps {
  fiscalYear: string;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DeclarationState {
  activeTab: 'annuelles' | 'mensuelles';
  openedDetails: Record<string, boolean>;
  declarations: Record<string, DeclarationStatus>;
}

interface DeclarationStatus {
  assujetti: boolean;
  soumis: boolean;
  dateLimite?: string;
  dateSoumission?: string;
  regime?: string;
}

export const DeclarationsSection: React.FC<DeclarationProps> = ({ 
  fiscalYear, 
  hasUnsavedChanges, 
  setHasUnsavedChanges 
}) => {
  const [state, setState] = useState<DeclarationState>({
    activeTab: 'annuelles',
    openedDetails: {},
    declarations: {
      dsf: { assujetti: false, soumis: false, regime: '', dateLimite: '', dateSoumission: '' },
      darp: { assujetti: false, soumis: false, dateLimite: '2025-09-30', dateSoumission: '' }
    }
  });

  // Calculate date limite based on regime fiscal
  const calculateDateLimite = (regime: string, year: string) => {
    if (regime === 'igs') {
      // IGS: 15 Mai de l'exercice fiscal en cours
      return `${year}-05-15`;
    } else if (regime === 'reel') {
      // Régime du Réel: 15 Avril de l'exercice en cours
      return `${year}-04-15`;
    }
    return '';
  };

  // Handle assujetti toggle
  const handleAssujettiChange = (declaration: string, checked: boolean) => {
    setState(prev => {
      const newDeclarations = { ...prev.declarations };
      newDeclarations[declaration] = {
        ...newDeclarations[declaration],
        assujetti: checked,
        soumis: checked ? newDeclarations[declaration].soumis : false
      };
      
      setHasUnsavedChanges(true);
      return { ...prev, declarations: newDeclarations };
    });
  };

  // Handle soumis toggle
  const handleSoumisChange = (declaration: string, checked: boolean) => {
    setState(prev => {
      const newDeclarations = { ...prev.declarations };
      newDeclarations[declaration] = {
        ...newDeclarations[declaration],
        soumis: checked
      };
      
      const newOpenedDetails = { ...prev.openedDetails };
      if (checked) {
        newOpenedDetails[declaration] = true;
      }
      
      setHasUnsavedChanges(true);
      return { 
        ...prev, 
        declarations: newDeclarations,
        openedDetails: newOpenedDetails
      };
    });
  };

  // Toggle details visibility
  const toggleDetails = (declaration: string) => {
    setState(prev => ({
      ...prev,
      openedDetails: {
        ...prev.openedDetails,
        [declaration]: !prev.openedDetails[declaration]
      }
    }));
  };

  // Handle regime change
  const handleRegimeChange = (declaration: string, regime: string) => {
    setState(prev => {
      const newDeclarations = { ...prev.declarations };
      
      if ('regime' in newDeclarations[declaration]) {
        (newDeclarations[declaration] as DeclarationStatus & { regime: string }).regime = regime;
        
        // Update date limite based on new regime
        if (declaration === 'dsf') {
          (newDeclarations[declaration] as DeclarationStatus & { dateLimite: string }).dateLimite = calculateDateLimite(regime, fiscalYear);
        }
      }
      
      setHasUnsavedChanges(true);
      return { ...prev, declarations: newDeclarations };
    });
  };

  // Handle tab change
  const handleTabChange = (value: 'annuelles' | 'mensuelles') => {
    setState(prev => ({ ...prev, activeTab: value }));
  };

  // Get display value for a declaration field
  const getDeclarationValue = (declaration: string, field: keyof DeclarationStatus): any => {
    return state.declarations[declaration]?.[field] || '';
  };

  const renderDeclarationItem = (key: string, name: string) => {
    const declaration = state.declarations[key] || { assujetti: false, soumis: false };
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <span className="font-medium text-gray-800">{name}</span>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${key}-assujetti`}
                checked={declaration.assujetti}
                onCheckedChange={(checked) => handleAssujettiChange(key, checked)}
              />
              <Label htmlFor={`${key}-assujetti`}>
                {declaration.assujetti ? "Assujetti" : "Non assujetti"}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id={`${key}-soumis`}
                checked={declaration.soumis}
                onCheckedChange={(checked) => handleSoumisChange(key, checked)}
                disabled={!declaration.assujetti}
              />
              <Label htmlFor={`${key}-soumis`}>
                {declaration.soumis ? "Soumis" : "Non soumis"}
              </Label>
            </div>
            
            {declaration.assujetti && declaration.soumis && !state.openedDetails[key] && (
              <button 
                className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                onClick={() => toggleDetails(key)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Voir détails
              </button>
            )}
          </div>
        </div>
        
        {declaration.assujetti && declaration.soumis && state.openedDetails[key] && (
          <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
            <div className="flex justify-between mb-4">
              <h4 className="font-medium text-sm">Détails de la déclaration</h4>
              <button 
                onClick={() => toggleDetails(key)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {key === 'dsf' && (
              <div className="mb-4">
                <label className="block text-sm mb-2">Régime fiscal</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  value={'regime' in declaration ? declaration.regime : ''}
                  onChange={(e) => handleRegimeChange(key, e.target.value)}
                >
                  <option value="">Sélectionner un régime</option>
                  <option value="igs">Impôt Général Synthétique (IGS)</option>
                  <option value="reel">Régime du Réel</option>
                </select>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-2">Date limite de dépôt</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  value={declaration.dateLimite || ''}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Date de soumission</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  value={declaration.dateSoumission || ''}
                  onChange={(e) => {
                    setState(prev => {
                      const newDeclarations = { ...prev.declarations };
                      newDeclarations[key] = {
                        ...newDeclarations[key],
                        dateSoumission: e.target.value
                      };
                      setHasUnsavedChanges(true);
                      return { ...prev, declarations: newDeclarations };
                    });
                  }}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">Pièces justificatives</h4>
              
              <div className="mb-2">
                <label className="block text-xs text-gray-500 mb-1">Déclaration soumise (PDF)</label>
                <input type="file" className="w-full text-sm" accept=".pdf" />
              </div>
              
              <div className="mb-2">
                <label className="block text-xs text-gray-500 mb-1">Accusé de réception (PDF)</label>
                <input type="file" className="w-full text-sm" accept=".pdf" />
              </div>
              
              <div className="mb-2">
                <label className="block text-xs text-gray-500 mb-1">Solde de déclaration (PDF ou Photo)</label>
                <input type="file" className="w-full text-sm" accept=".pdf,image/*" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Déclarations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={state.activeTab} onValueChange={(v) => handleTabChange(v as 'annuelles' | 'mensuelles')}>
          <TabsList className="mb-4">
            <TabsTrigger value="annuelles">Annuelles</TabsTrigger>
            <TabsTrigger value="mensuelles">Mensuelles</TabsTrigger>
          </TabsList>
          
          {state.activeTab === 'annuelles' && (
            <>
              {renderDeclarationItem('dsf', 'Déclaration Statistique et Fiscale (DSF)')}
              {renderDeclarationItem('darp', 'Déclaration Annuelle des Revenus des Particuliers (DARP)')}
            </>
          )}
          
          {state.activeTab === 'mensuelles' && (
            <>
              {renderDeclarationItem('licence', 'Licence')}
              {renderDeclarationItem('cntps', 'CNTPS')}
              {renderDeclarationItem('precomptes', 'Précomptes')}
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};
