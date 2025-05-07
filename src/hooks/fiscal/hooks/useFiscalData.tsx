
import { useState, useEffect, useCallback } from 'react';
import { getClientFiscalData } from '../services/fetchService';
import { ObligationStatuses } from '../types';

export const useFiscalData = (clientId: string) => {
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState(false);

  const loadFiscalData = useCallback(async (force: boolean = false) => {
    if (!clientId) return;

    setIsLoading(true);
    try {
      const data = await getClientFiscalData(clientId);
      
      if (data?.obligations) {
        setObligationStatuses(data.obligations);
      } else {
        resetObligationStatuses();
      }

      setHiddenFromDashboard(data?.hiddenFromDashboard === true);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error loading fiscal data:', error);
      resetObligationStatuses();
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  const resetObligationStatuses = () => {
    setObligationStatuses({
      igs: { paid: false, amount: 0 },
      patente: { paid: false, amount: 0 },
      baic: { paid: false, amount: 0 },
      its: { paid: false, amount: 0 },
      dsf: { filed: false, date: '' },
      darp: { filed: false, date: '' },
      licence: { filed: false, date: '' }
    });
  };

  useEffect(() => {
    if (clientId) {
      loadFiscalData();
    }
  }, [clientId, loadFiscalData]);

  const handleToggleDashboardVisibility = useCallback(() => {
    setHiddenFromDashboard(!hiddenFromDashboard);
  }, [hiddenFromDashboard]);

  return {
    obligationStatuses,
    setObligationStatuses,
    resetObligationStatuses,
    isLoading,
    dataLoaded,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    loadFiscalData
  };
};
