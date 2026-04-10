
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
        <label htmlFor="caValueInput" className="block text-xs sm:text-sm mb-1.5 sm:mb-2">Chiffre d'affaires annuel HT (F CFA)</label>
        <Input
          id="caValueInput"
          type="text"
          className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:border-primary focus:outline-none text-sm"
          value={caValue}
          onChange={onCAChange}
          placeholder="0"
        />
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="cga-toggle-input"
          checked={isCGA}
          onCheckedChange={onCGAChange}
          className="shrink-0"
        />
        <Label htmlFor="cga-toggle-input" className="flex items-center flex-wrap text-xs sm:text-sm">
          <span>Membre d'un CGA</span>
          <span className="ml-1 text-primary font-medium">(-50%)</span>
        </Label>
      </div>
    </>
  );
};

