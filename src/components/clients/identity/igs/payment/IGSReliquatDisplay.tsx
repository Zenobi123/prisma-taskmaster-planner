
import { BadgeEuro } from "lucide-react";

interface IGSReliquatDisplayProps {
  reliquat: number | null;
}

export function IGSReliquatDisplay({ reliquat }: IGSReliquatDisplayProps) {
  if (reliquat === null) {
    return null;
  }
  
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
      <p className="text-blue-800 font-medium flex items-center">
        <BadgeEuro className="h-5 w-5 mr-2" />
        Reliquat IGS à payer: {reliquat.toLocaleString()} FCFA
      </p>
    </div>
  );
}
