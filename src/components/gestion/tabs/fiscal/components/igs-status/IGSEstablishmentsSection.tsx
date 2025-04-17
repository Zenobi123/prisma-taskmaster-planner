
import { EtablissementsSection } from "../etablissements/EtablissementsSection";
import { Etablissement } from "@/hooks/fiscal/types/igsTypes";

interface IGSEstablishmentsSectionProps {
  etablissements: Etablissement[];
  chiffreAffairesAnnuel: number;
  onChiffreAffairesChange: (value: number) => void;
  onEtablissementsChange: (etablissements: Etablissement[]) => void;
}

export function IGSEstablishmentsSection({
  etablissements,
  chiffreAffairesAnnuel,
  onChiffreAffairesChange,
  onEtablissementsChange
}: IGSEstablishmentsSectionProps) {
  // Calcule le chiffre d'affaires total à partir des établissements
  const handleEtablissementsChange = (newEtablissements: Etablissement[]) => {
    onEtablissementsChange(newEtablissements);
    
    // Met à jour automatiquement le chiffre d'affaires total
    const total = newEtablissements.reduce((sum, etab) => sum + (etab.chiffreAffaires || 0), 0);
    onChiffreAffairesChange(total);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-base font-medium">Établissements</h4>
      <p className="text-sm text-gray-500">
        Ajoutez les différents établissements de l'entreprise et leur chiffre d'affaires.
        Le total sera calculé automatiquement.
      </p>
      
      <EtablissementsSection
        etablissements={etablissements}
        onChange={handleEtablissementsChange}
      />
    </div>
  );
}
