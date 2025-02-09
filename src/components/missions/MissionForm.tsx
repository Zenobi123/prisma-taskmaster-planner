
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MissionFormFields } from "./MissionFormFields";

interface MissionFormProps {
  onSuccess?: () => void;
}

export const MissionForm = ({ onSuccess }: MissionFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement mission creation logic
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <MissionFormFields 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <Button type="submit">
        Créer la mission
      </Button>
    </form>
  );
};
