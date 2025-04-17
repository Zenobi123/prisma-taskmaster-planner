
import { Card, CardContent } from "@/components/ui/card";
import { IGSStatusContent } from "./IGSStatusContent";
import { useIGSStatusState } from "./hooks/useIGSStatusState";
import { Etablissement, IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { CGAClasse } from "@/types/client";

interface IGSStatusSectionProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patente?: IGSPayment;
  acompteJanvier?: IGSPayment;
  acompteFevrier?: IGSPayment;
  chiffreAffairesAnnuel?: number;
  etablissements?: Etablissement[];
  onChange: (name: string, value: any) => void;
}

export function IGSStatusSection(props: IGSStatusSectionProps) {
  const statusState = useIGSStatusState(props);
  
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-semibold">Impôt Général Synthétique (IGS)</h3>
      
      <Card>
        <CardContent className="pt-6">
          <IGSStatusContent {...statusState} />
        </CardContent>
      </Card>
    </div>
  );
}
