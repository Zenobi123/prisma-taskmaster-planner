
import { CGAClasse, IGSData, IGSPayment } from "@/types/client";

interface IGSFieldsProps {
  onChange: (name: string, value: any) => void;
  igs?: IGSData;
}

export function IGSFields({ 
  onChange,
  igs 
}: IGSFieldsProps) {
  // Removed all IGS-related fields
  return null;
}
