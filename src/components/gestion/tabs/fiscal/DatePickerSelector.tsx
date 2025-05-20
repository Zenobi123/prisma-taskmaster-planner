
import React from 'react';
import { Input } from '@/components/ui/input';

interface DatePickerSelectorProps {
  date: string | null;
  onDateSelect: (date: string | null) => void;
  placeholder?: string;
}

const DatePickerSelector: React.FC<DatePickerSelectorProps> = ({ 
  date, 
  onDateSelect,
  placeholder = "Sélectionner une date"
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateSelect(e.target.value || null);
  };

  return (
    <Input
      type="date"
      value={date || ''}
      onChange={handleDateChange}
      placeholder={placeholder}
      className="max-w-[200px]"
    />
  );
};

export default DatePickerSelector;
