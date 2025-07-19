
import { useState, useEffect, useCallback } from 'react';
import { updateService } from '@/services/updateService';

interface UpdateInfo {
  hasUpdate: boolean;
  version?: string;
  timestamp?: number;
}

export const useAppUpdates = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({ hasUpdate: false });
  const [isApplyingUpdate, setIsApplyingUpdate] = useState(false);

  useEffect(() => {
    const handleUpdate = (info: UpdateInfo) => {
      setUpdateInfo(info);
    };

    updateService.addUpdateListener(handleUpdate);
    updateService.startUpdateCheck();

    return () => {
      updateService.removeUpdateListener(handleUpdate);
      updateService.stopUpdateCheck();
    };
  }, []);

  const applyUpdate = useCallback(async () => {
    setIsApplyingUpdate(true);
    try {
      await updateService.applyUpdate();
    } catch (error) {
      console.error('Erreur lors de l\'application de la mise à jour:', error);
      setIsApplyingUpdate(false);
    }
  }, []);

  const dismissUpdate = useCallback(() => {
    setUpdateInfo({ hasUpdate: false });
  }, []);

  return {
    updateInfo,
    isApplyingUpdate,
    applyUpdate,
    dismissUpdate
  };
};
