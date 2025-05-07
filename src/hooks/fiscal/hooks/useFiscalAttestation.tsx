
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getClientFiscalData } from '../services';

export const useFiscalAttestation = (clientId: string) => {
  const [creationDate, setCreationDate] = useState<string>('');
  const [validityEndDate, setValidityEndDate] = useState<string>('');
  const [showInAlert, setShowInAlert] = useState(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (clientId) {
      loadAttestationData();
    }
  }, [clientId]);

  const loadAttestationData = async () => {
    if (!clientId) return;

    try {
      const data = await getClientFiscalData(clientId);
      
      if (data?.attestation) {
        setCreationDate(data.attestation.creationDate || '');
        setValidityEndDate(data.attestation.validityEndDate || '');
        setShowInAlert(data.attestation.showInAlert !== false);
      } else {
        resetAttestationData();
      }

      setHiddenFromDashboard(data?.hiddenFromDashboard === true);
    } catch (error) {
      console.error('Erreur lors du chargement des données d\'attestation:', error);
      resetAttestationData();
    }
  };

  const resetAttestationData = () => {
    setCreationDate('');
    setValidityEndDate('');
    setShowInAlert(true);
    setHiddenFromDashboard(false);
  };

  const handleToggleAlert = useCallback(() => {
    setShowInAlert(!showInAlert);
  }, [showInAlert]);

  const handleToggleDashboardVisibility = useCallback(() => {
    setHiddenFromDashboard(!hiddenFromDashboard);
  }, [hiddenFromDashboard]);

  return {
    creationDate,
    setCreationDate,
    validityEndDate,
    setValidityEndDate,
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility
  };
};
