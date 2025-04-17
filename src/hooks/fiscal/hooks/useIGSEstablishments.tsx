
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Establishment, IGSData, createDefaultEstablishment } from '../types/igsTypes';
import { calculateIGSClass } from '@/components/gestion/tabs/fiscal/utils/igsCalculations';

interface UseIGSEstablishmentsProps {
  igsData: IGSData | undefined;
  onIGSDataChange: (data: IGSData) => void;
  assujetti: boolean;
}

export const useIGSEstablishments = ({
  igsData,
  onIGSDataChange,
  assujetti
}: UseIGSEstablishmentsProps) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [igsClass, setIgsClass] = useState(1);
  const [igsAmount, setIgsAmount] = useState(20000);
  const [cgaReduction, setCgaReduction] = useState(false);

  // Initialize data from props or create default
  useEffect(() => {
    if (igsData && igsData.establishments) {
      setEstablishments(igsData.establishments);
      setCgaReduction(igsData.cgaReduction);
    } else {
      // Create default establishment if none exists
      setEstablishments([createDefaultEstablishment()]);
    }
  }, [igsData]);

  // Calculate totals and update parent component
  useEffect(() => {
    if (!assujetti) return;
    
    const total = establishments.reduce((sum, est) => sum + (est.revenue || 0), 0);
    setTotalRevenue(total);
    
    const { classNumber, amount } = calculateIGSClass(total);
    setIgsClass(classNumber);
    
    const finalAmount = cgaReduction ? amount * 0.5 : amount;
    setIgsAmount(finalAmount);
    
    // Update parent component with all IGS data
    onIGSDataChange({
      establishments,
      previousYearRevenue: total,
      igsClass: classNumber,
      igsAmount: finalAmount,
      cgaReduction
    });
  }, [establishments, cgaReduction, onIGSDataChange, assujetti]);

  const handleAddEstablishment = () => {
    const newEstablishment: Establishment = {
      id: uuidv4(),
      name: `Établissement ${establishments.length + 1}`,
      activity: "",
      city: "",
      department: "",
      district: "",
      revenue: 0
    };
    setEstablishments([...establishments, newEstablishment]);
  };

  const handleRemoveEstablishment = (id: string) => {
    if (establishments.length <= 1) return;
    setEstablishments(establishments.filter(est => est.id !== id));
  };

  const handleEstablishmentChange = (id: string, field: keyof Establishment, value: string | number) => {
    setEstablishments(establishments.map(est => 
      est.id === id ? { ...est, [field]: value } : est
    ));
  };

  return {
    establishments,
    totalRevenue,
    igsClass,
    igsAmount,
    cgaReduction,
    setCgaReduction,
    handleAddEstablishment,
    handleRemoveEstablishment,
    handleEstablishmentChange,
    isAssujetti: assujetti === true
  };
};
