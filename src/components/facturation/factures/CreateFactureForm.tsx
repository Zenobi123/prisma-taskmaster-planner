
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Facture, Prestation, Client } from "@/types/facture";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import ClientSelector from "./ClientSelector";
import PrestationFields from "./PrestationFields";
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

        {selectedClient && (
          <div className="bg-gray-50 p-3 rounded-md border">
            <p><strong>Contact:</strong> {selectedClient.telephone} | {selectedClient.email}</p>
            <p><strong>Adresse:</strong> {selectedClient.adresse}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date d'émission</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watch("date") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("date") ? format(watch("date"), "dd MMMM yyyy", { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watch("date")}
                  onSelect={(date) => date && setValue("date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="echeance">Date d'échéance</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watch("echeance") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("echeance") ? format(watch("echeance"), "dd MMMM yyyy", { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watch("echeance")}
                  onSelect={(date) => date && setValue("echeance", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut de paiement</Label>
          <Select 
            defaultValue="en_attente"
            onValueChange={(value) => setValue("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en_attente">Non payé</SelectItem>
              <SelectItem value="partiellement_payée">Partiellement payé</SelectItem>
              <SelectItem value="payée">Payé</SelectItem>
              <SelectItem value="envoyée">Envoyée</SelectItem>
              <SelectItem value="annulée">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <PrestationFields
          prestations={prestations}
          onPrestationsChange={setPrestations}
        />

        <div className="flex justify-between p-4 bg-gray-50 rounded-md border">
          <h3 className="font-semibold text-lg">Montant total:</h3>
          <p className="font-bold text-lg">{totalAmount.toLocaleString('fr-FR')} XAF</p>
        </div>
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
