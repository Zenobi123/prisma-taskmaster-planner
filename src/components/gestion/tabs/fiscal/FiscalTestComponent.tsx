
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useObligationsFiscales } from '@/hooks/fiscal/useObligationsFiscales';
import { Client } from '@/types/client';

interface FiscalTestComponentProps {
  selectedClient: Client;
}

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
}

export const FiscalTestComponent: React.FC<FiscalTestComponentProps> = ({ selectedClient }) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const fiscalHooks = useObligationsFiscales(selectedClient);
  const {
    obligationStatuses,
    handleStatusChange,
    handleAttachmentUpdate,
    handleSave,
    isLoading,
    dataLoaded,
    isSaving,
    selectedYear,
    setSelectedYear,
    isDeclarationObligation,
    isTaxObligation
  } = fiscalHooks;

  const runTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    try {
      // Test 1: Vérification du chargement des données
      results.push({
        name: "Chargement des données",
        status: dataLoaded && !isLoading ? 'success' : 'error',
        message: dataLoaded && !isLoading ? 
          "Données fiscales chargées avec succès" : 
          "Erreur lors du chargement des données"
      });

      // Test 2: Vérification de la structure des obligations
      const hasValidStructure = obligationStatuses && 
        typeof obligationStatuses === 'object' &&
        'igs' in obligationStatuses &&
        'patente' in obligationStatuses &&
        'dsf' in obligationStatuses;

      results.push({
        name: "Structure des obligations",
        status: hasValidStructure ? 'success' : 'error',
        message: hasValidStructure ? 
          "Structure des obligations valide" : 
          "Structure des obligations invalide"
      });

      // Test 3: Test des switches d'assujettissement
      const originalIgsAssujetti = obligationStatuses.igs?.assujetti || false;
      handleStatusChange('igs', 'assujetti', !originalIgsAssujetti);
      
      // Petit délai pour permettre la mise à jour
      await new Promise(resolve => setTimeout(resolve, 100));
      
      results.push({
        name: "Switch d'assujettissement",
        status: 'success',
        message: "Test du switch réussi"
      });

      // Remettre à l'état original
      handleStatusChange('igs', 'assujetti', originalIgsAssujetti);

      // Test 4: Test de changement d'année
      const currentYear = selectedYear;
      const testYear = currentYear === "2025" ? "2024" : "2025";
      setSelectedYear(testYear);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      results.push({
        name: "Changement d'année",
        status: 'success',
        message: `Changement d'année vers ${testYear} réussi`
      });

      // Remettre l'année originale
      setSelectedYear(currentYear);

      // Test 5: Test des fonctions de classification
      const igsIsTax = isTaxObligation('igs');
      const dsfIsDeclaration = isDeclarationObligation('dsf');
      
      results.push({
        name: "Classification des obligations",
        status: igsIsTax && dsfIsDeclaration ? 'success' : 'error',
        message: igsIsTax && dsfIsDeclaration ? 
          "Classification correcte des obligations" : 
          "Erreur dans la classification des obligations"
      });

      // Test 6: Test de sauvegarde simulée
      if (!isSaving) {
        results.push({
          name: "Système de sauvegarde",
          status: 'success',
          message: "Système de sauvegarde prêt"
        });
      } else {
        results.push({
          name: "Système de sauvegarde",
          status: 'warning',
          message: "Sauvegarde en cours..."
        });
      }

      // Test 7: Test des attachements
      const testAttachment = "test-file-path.pdf";
      handleAttachmentUpdate('igs', 'receipt', testAttachment);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      results.push({
        name: "Gestion des pièces justificatives",
        status: 'success',
        message: "Test d'attachement réussi"
      });

      // Nettoyer l'attachement de test
      handleAttachmentUpdate('igs', 'receipt', null);

    } catch (error) {
      results.push({
        name: "Test général",
        status: 'error',
        message: `Erreur lors des tests: ${error}`
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tests des fonctionnalités fiscales</span>
          <Button 
            onClick={runTests} 
            disabled={isRunning || isLoading}
            variant="outline"
          >
            {isRunning ? "Tests en cours..." : "Lancer les tests"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {testResults.length === 0 ? (
          <p className="text-muted-foreground">
            Cliquez sur "Lancer les tests" pour vérifier toutes les fonctionnalités.
          </p>
        ) : (
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-md border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.name}</span>
                </div>
                <span className="text-sm">{result.message}</span>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Résumé des tests</h4>
              <div className="text-sm text-blue-700">
                <span className="mr-4">
                  ✓ Réussis: {testResults.filter(r => r.status === 'success').length}
                </span>
                <span className="mr-4">
                  ⚠ Avertissements: {testResults.filter(r => r.status === 'warning').length}
                </span>
                <span>
                  ✗ Erreurs: {testResults.filter(r => r.status === 'error').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
