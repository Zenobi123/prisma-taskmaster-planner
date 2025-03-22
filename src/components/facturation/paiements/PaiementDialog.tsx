
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Paiement } from "@/types/paiement";
import { Client } from "@/types/client";
import { Facture } from "@/types/facture";
import { CalendarIcon } from "lucide-react";

interface PaiementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (paiement: Omit<Paiement, "id">) => Promise<any>;
}

type PaiementFormData = {
  client_id: string;
  facture_id: string;
  date: Date;
  montant: number;
  mode: string;
  est_credit: boolean;
  notes: string;
};

const PaiementDialog = ({ open, onOpenChange, onSubmit }: PaiementDialogProps) => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<PaiementFormData>({
    defaultValues: {
      client_id: "",
      facture_id: "",
      date: new Date(),
      montant: 0,
      mode: "espèces",
      est_credit: false,
      notes: ""
    }
  });

  const estCredit = watch("est_credit");
  const selectedMode = watch("mode");

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetchFacturesForClient(selectedClientId);
    }
  }, [selectedClientId]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("id, nom, raisonsociale, type");

      if (error) {
        throw error;
      }

      setClients(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer la liste des clients."
      });
    }
  };

  const fetchFacturesForClient = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from("factures")
        .select("*")
        .eq("client_id", clientId)
        .or("status_paiement.eq.non_payée,status_paiement.eq.partiellement_payée");

      if (error) {
        throw error;
      }

      setFactures(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les factures du client."
      });
    }
  };

  const handleClientChange = (clientId: string) => {
    setValue("client_id", clientId);
    setSelectedClientId(clientId);
    setValue("facture_id", ""); // Reset selected facture when client changes
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setValue("date", date);
    }
  };

  const onFormSubmit = async (data: PaiementFormData) => {
    setIsSubmitting(true);
    try {
      const estVerifie = ["orange_money", "mtn_money"].includes(data.mode) ? false : true;
      
      const paiementData: Omit<Paiement, "id"> = {
        client: clients.find(c => c.id === data.client_id)?.nom || "",
        client_id: data.client_id,
        facture: data.est_credit ? "" : data.facture_id,
        date: format(data.date, "yyyy-MM-dd"),
        montant: data.montant,
        mode: data.mode,
        est_credit: data.est_credit,
        est_verifie: estVerifie,
        notes: data.notes,
        reference: `PAY-${Date.now().toString(36)}`,
        solde_restant: 0 // Sera calculé côté serveur
      };

      await onSubmit(paiementData);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement du paiement."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau Paiement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client_id">Client</Label>
              <Select onValueChange={handleClientChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.type === "physique" ? client.nom : client.raisonsociale}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="est_credit" 
                checked={estCredit} 
                onCheckedChange={(checked) => {
                  setValue("est_credit", checked === true);
                }} 
              />
              <Label htmlFor="est_credit">Paiement en avance (crédit client)</Label>
            </div>

            {!estCredit && selectedClientId && (
              <div className="grid gap-2">
                <Label htmlFor="facture_id">Facture</Label>
                <Select onValueChange={(value) => setValue("facture_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une facture" />
                  </SelectTrigger>
                  <SelectContent>
                    {factures.map((facture) => (
                      <SelectItem key={facture.id} value={facture.id}>
                        {facture.id} - {facture.montant - (facture.montant_paye || 0)} FCFA restant
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "P", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="montant">Montant (FCFA)</Label>
              <Input
                id="montant"
                type="number"
                {...register("montant", { required: true, min: 1 })}
              />
              {errors.montant && (
                <p className="text-sm text-red-500">Le montant est requis et doit être positif</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mode">Mode de paiement</Label>
              <Select onValueChange={(value) => setValue("mode", value)} defaultValue="espèces">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="espèces">Espèces</SelectItem>
                  <SelectItem value="virement">Virement bancaire</SelectItem>
                  <SelectItem value="orange_money">Orange Money</SelectItem>
                  <SelectItem value="mtn_money">MTN Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {["orange_money", "mtn_money"].includes(selectedMode) && (
              <div className="grid gap-2">
                <Label htmlFor="reference_transaction">Référence de la transaction</Label>
                <Input
                  id="reference_transaction"
                  type="text"
                  placeholder="Ex: OM-123456789"
                  {...register("reference_transaction", { required: true })}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Informations supplémentaires..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer le paiement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaiementDialog;
