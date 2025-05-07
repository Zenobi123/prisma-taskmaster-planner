
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
      igs: { assujetti: false, paye: false, montant: 0 },
      patente: { assujetti: false, paye: false, montant: 0 },
      baic: { assujetti: false, paye: false, montant: 0 },
      its: { assujetti: false, paye: false, montant: 0 },
      dsf: { assujetti: false, depose: false, dateDepot: '' },
      darp: { assujetti: false, depose: false, dateDepot: '' },
      licence: { assujetti: false, depose: false, dateDepot: '' },
      iba: { assujetti: false, paye: false },
      ibnc: { assujetti: false, paye: false },
      ircm: { assujetti: false, paye: false },
      irf: { assujetti: false, paye: false },
      precompte: { assujetti: false, paye: false },
      taxeSejour: { assujetti: false, paye: false },
      baillCommercial: { assujetti: false, paye: false }
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
