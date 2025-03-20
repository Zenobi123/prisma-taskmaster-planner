
import { Facture } from "@/types/facture";
import { 
  FactureViewHeader, 
  FactureGeneralInfo, 
  FactureClientInfo, 
  FacturePrestations, 
  FacturePaiements, 
  FactureNotes 
} from "./factureView";

interface FactureViewProps {
  facture: Facture;
  onAddPayment?: () => void;
}

export function FactureView({ facture, onAddPayment }: FactureViewProps) {
  return (
    <div className="space-y-6">
      <FactureViewHeader facture={facture} onAddPayment={onAddPayment} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FactureGeneralInfo facture={facture} />
        <FactureClientInfo facture={facture} />
      </div>
      
      <FacturePrestations facture={facture} />
      <FacturePaiements facture={facture} />
      <FactureNotes notes={facture.notes} />
    </div>
  );
}
