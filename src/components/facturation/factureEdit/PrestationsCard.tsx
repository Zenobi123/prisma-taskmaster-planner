
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrestationsForm } from "@/components/facturation/newFacture/PrestationsForm";
import { Prestation } from "@/types/facture";

interface PrestationsCardProps {
  prestations: Prestation[];
  setPrestations: (prestations: Prestation[]) => void;
}

export const PrestationsCard = ({ prestations, setPrestations }: PrestationsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prestations</CardTitle>
      </CardHeader>
      <CardContent>
        <PrestationsForm
          prestations={prestations}
          setPrestations={setPrestations}
        />
      </CardContent>
    </Card>
  );
};
