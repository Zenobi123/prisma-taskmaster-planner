
import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface IgsCaCgaInputsProps {
  caValue: string;
  isCGA: boolean;
  onCAChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCGAChange: (checked: boolean) => void;
}

export const IgsCaCgaInputs: React.FC<IgsCaCgaInputsProps> = ({
  caValue,
  isCGA,
  onCAChange,
  onCGAChange,
}) => {
  return (
    <>
      <div className="mb-4">
        <label htmlFor="caValueInput" className="block text-sm mb-2">Chiffre d'affaires annuel HT (FCFA)</label>
        <Input
          id="caValueInput"
          type="text"
          className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:border-primary focus:outline-none"
          value={caValue}
          onChange={onCAChange}
          placeholder="0"
        />
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="cga-toggle-input" // Changed ID to avoid conflict if Label's htmlFor is 'cga-toggle'
          checked={isCGA}
          onCheckedChange={onCGAChange}
        />
        <Label htmlFor="cga-toggle-input" className="flex items-center">
          Membre d'un Centre de Gestion Agréé (CGA)
          <span className="ml-1 text-primary font-medium">(-50%)</span>
        </Label>
      </div>
    </>
  );
};

