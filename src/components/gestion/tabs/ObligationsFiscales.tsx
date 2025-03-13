
// Add this to the existing useEffect for creation date
useEffect(() => {
  if (creationDate) {
    try {
      const parsedDate = parse(creationDate, 'dd/MM/yy', new Date());
      if (isValid(parsedDate)) {
        // Save to localStorage for dashboard alerts
        localStorage.setItem('fiscalAttestationCreationDate', creationDate);
        
        // Add 3 months
        const endDate = addMonths(parsedDate, 3);
        
        // Format end date as DD/MM/YY
        setValidityEndDate(format(endDate, 'dd/MM/yy'));
        
        // Check for approaching expiration
        const today = new Date();
        const daysUntilExpiration = differenceInDays(endDate, today);
        
        if (daysUntilExpiration <= 5 && daysUntilExpiration >= 0) {
          // Show alert for approaching expiration
          toast({
            title: "Attention",
            description: `L'Attestation de Conformité Fiscale expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}.`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error calculating validity end date:", error);
    }
  }
}, [creationDate]);

// Modify the handleStatusChange function
const handleStatusChange = (
  obligationType: keyof ObligationStatuses, 
  statusType: "assujetti" | "paye" | "depose", 
  value: boolean
) => {
  setObligationStatuses(prev => {
    const newState = {
      ...prev,
      [obligationType]: {
        ...prev[obligationType],
        [statusType]: value
      }
    };
    
    // Save to localStorage for dashboard alerts
    localStorage.setItem(`fiscal${obligationType.charAt(0).toUpperCase() + obligationType.slice(1)}${statusType.charAt(0).toUpperCase() + statusType.slice(1)}`, value.toString());
    
    return newState;
  });
};

// Load initial state from localStorage
useEffect(() => {
  const savedObligations: Partial<ObligationStatuses> = {};
  
  // Try to load each obligation state from localStorage
  Object.keys(obligationStatuses).forEach((key) => {
    const obligationType = key as keyof ObligationStatuses;
    const obligation = obligationStatuses[obligationType];
    
    const savedAssujetti = localStorage.getItem(`fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Assujetti`);
    
    if (savedAssujetti !== null) {
      if ('paye' in obligation) {
        const savedPaye = localStorage.getItem(`fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Paye`);
        savedObligations[obligationType] = {
          assujetti: savedAssujetti === 'true',
          paye: savedPaye === 'true'
        } as any;
      } else if ('depose' in obligation) {
        const savedDepose = localStorage.getItem(`fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Depose`);
        savedObligations[obligationType] = {
          assujetti: savedAssujetti === 'true',
          depose: savedDepose === 'true'
        } as any;
      }
    }
  });
  
  // Update state if we found saved data
  if (Object.keys(savedObligations).length > 0) {
    setObligationStatuses(prev => ({
      ...prev,
      ...savedObligations
    }));
  }
  
  // Load saved creation date
  const savedCreationDate = localStorage.getItem('fiscalAttestationCreationDate');
  if (savedCreationDate) {
    setCreationDate(savedCreationDate);
  }
}, []);
