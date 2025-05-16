
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface ObservationsSectionProps {
  observations: string;
  onObservationsChange: (value: string) => void;
}

export const ObservationsSection = ({ 
  observations, 
  onObservationsChange 
}: ObservationsSectionProps) => {
  return (
    <Textarea
      value={observations}
      onChange={(e) => onObservationsChange(e.target.value)}
      placeholder="Ajouter des observations..."
      className="h-24"
    />
  );
};
