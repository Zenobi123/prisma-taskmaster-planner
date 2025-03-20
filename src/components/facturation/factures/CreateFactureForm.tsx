
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Facture, Prestation } from "@/types/facture";
import ClientSelector from "./ClientSelector";
import PrestationFields from "./PrestationFields";
import DatePickerField from "./DatePickerField";
import StatusSelector from "./StatusSelector";
import ClientInfoDisplay from "./ClientInfoDisplay";
import TotalAmountDisplay from "./TotalAmountDisplay";
import { format } from "date-fns";
import { useFactures } from "@/hooks/useFactures";

interface CreateFactureFormProps {
  onSuccess: () => void;
}

interface FormData {
  client_id: string;
  date: Date;
  echeance: Date;
  status: string;
  prestations: Prestation[];
}

const CreateFactureForm = ({ onSuccess }: CreateFactureFormProps) => {
  const { toast } = useToast();
  const { addFacture, allClients } = useFactures();
  const [prestations, setPrestations] = useState<Prestation[]>([
    { description: "", quantite: 1, montant: 0 },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      client_id: "",
      date: new Date(),
      echeance: new Date(new Date().setDate(new Date().getDate() + 30)), // +30 jours par défaut
      status: "en_attente",
      prestations: prestations,
    }
  });

  const selectedClientId = watch("client_id");
  const selectedClient = allClients.find(client => client.id === selectedClientId);
  const selectedDate = watch("date");
  const selectedEcheance = watch("echeance");

  useEffect(() => {
    const total = prestations.reduce((sum, prestation) => {
      return sum + (prestation.montant * (prestation.quantite || 1));
    }, 0);
    setTotalAmount(total);
  }, [prestations]);

  const onSubmit = (data: FormData) => {
    if (!selectedClient) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un client.",
      });
      return;
    }

    if (prestations.some(p => !p.description || p.montant <= 0)) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir correctement tous les champs des prestations.",
      });
      return;
    }

    const formattedDate = format(data.date, "dd/MM/yyyy");
    const formattedEcheance = format(data.echeance, "dd/MM/yyyy");

    const factureId = `F-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;

    const nouvelleFacture: Facture = {
      id: factureId,
      client_id: selectedClient.id,
      client: selectedClient,
      date: formattedDate,
      echeance: formattedEcheance,
      montant: totalAmount,
      montant_paye: 0,
      status: data.status as "en_attente" | "envoyée" | "payée" | "partiellement_payée" | "annulée",
      prestations: prestations.map(p => ({
        id: uuidv4(),
        description: p.description,
        quantite: p.quantite,
        montant: p.montant,
      })),
      paiements: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addFacture(nouvelleFacture);
    
    toast({
      title: "Facture créée",
      description: `La facture ${factureId} a été créée avec succès.`,
    });
    
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <ClientSelector 
          clients={allClients}
          value={selectedClientId} 
          onChange={(value) => setValue("client_id", value)}
        />

        <ClientInfoDisplay client={selectedClient} />

        <div className="grid grid-cols-2 gap-4">
          <DatePickerField 
            label="Date d'émission"
            date={selectedDate}
            onSelect={(date) => setValue("date", date)}
          />

          <DatePickerField 
            label="Date d'échéance"
            date={selectedEcheance}
            onSelect={(date) => setValue("echeance", date)}
          />
        </div>

        <StatusSelector 
          value={watch("status")}
          onChange={(value) => setValue("status", value)}
        />

        <PrestationFields
          prestations={prestations}
          onPrestationsChange={setPrestations}
        />

        <TotalAmountDisplay amount={totalAmount} />
      </div>

      <DialogFooter>
        <Button type="submit" className="bg-[#84A98C] hover:bg-[#6B8E74]">
          Créer la facture
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CreateFactureForm;
