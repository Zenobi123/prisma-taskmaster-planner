
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
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
import { CalendarIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  mode: "espèces" | "virement" | "orange_money" | "mtn_money";
  est_credit: boolean;
  reference_transaction: string;
  notes: string;
  type_paiement: "total" | "partiel";
  prestations_payees: string[];
};

const PaiementDialog = ({ open, onOpenChange, onSubmit }: PaiementDialogProps) => {
  const { toast } = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [factures, setFactures] = useState<any[]>([]);
  const [prestations, setPrestations] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedFactureId, setSelectedFactureId] = useState<string | null>(null);
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
      reference_transaction: "",
      notes: "",
      type_paiement: "total",
      prestations_payees: []
    }
  });

  const estCredit = watch("est_credit");
  const selectedMode = watch("mode");
  const typePaiement = watch("type_paiement");
  const selectedPrestations = watch("prestations_payees");

  useEffect(() => {
    if (open) {
      fetchClients();
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (selectedClientId) {
      fetchFacturesForClient(selectedClientId);
    }
  }, [selectedClientId]);

  useEffect(() => {
    if (selectedFactureId && !estCredit) {
      fetchPrestationsForFacture(selectedFactureId);
    } else {
      setPrestations([]);
    }
  }, [selectedFactureId, estCredit]);

  useEffect(() => {
    // Si on passe de partiel à total, on vide les prestations sélectionnées
    if (typePaiement === "total") {
      setValue("prestations_payees", []);
    }
  }, [typePaiement, setValue]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("id, nom, raisonsociale, type");

      if (error) throw error;
      setClients(data || []);
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

      if (error) throw error;
      setFactures(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les factures du client."
      });
    }
  };

  const fetchPrestationsForFacture = async (factureId: string) => {
    try {
      const { data, error } = await supabase
        .from("prestations")
        .select("*")
        .eq("facture_id", factureId);

      if (error) throw error;
      setPrestations(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des prestations:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les prestations de la facture."
      });
    }
  };

  const handleClientChange = (clientId: string) => {
    setValue("client_id", clientId);
    setSelectedClientId(clientId);
    setValue("facture_id", "");
    setSelectedFactureId(null);
  };

  const handleFactureChange = (factureId: string) => {
    setValue("facture_id", factureId);
    setSelectedFactureId(factureId);
    // Calcul automatique du montant total de la facture
    const selectedFacture = factures.find(f => f.id === factureId);
    if (selectedFacture) {
      const montantRestant = selectedFacture.montant - (selectedFacture.montant_paye || 0);
      setValue("montant", montantRestant);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setValue("date", date);
    }
  };

  const handlePrestationChange = (id: string, checked: boolean) => {
    let updatedPrestations = [...selectedPrestations];
    
    if (checked) {
      updatedPrestations.push(id);
    } else {
      updatedPrestations = updatedPrestations.filter(p => p !== id);
    }
    
    setValue("prestations_payees", updatedPrestations);
    
    // Si on a sélectionné des prestations, on ajuste le montant
    if (updatedPrestations.length > 0 && typePaiement === "partiel") {
      const montantTotal = prestations
        .filter(p => updatedPrestations.includes(p.id))
        .reduce((sum, p) => sum + Number(p.montant), 0);
      
      setValue("montant", montantTotal);
    }
  };

  const onFormSubmit = async (data: PaiementFormData) => {
    setIsSubmitting(true);
    try {
      const paiementData: Omit<Paiement, "id"> = {
        client: clients.find(c => c.id === data.client_id)?.nom || clients.find(c => c.id === data.client_id)?.raisonsociale || "",
        client_id: data.client_id,
        facture: data.est_credit ? "" : data.facture_id,
        date: format(data.date, "yyyy-MM-dd"),
        montant: data.montant,
        mode: data.mode,
        est_credit: data.est_credit,
        reference: `PAY-${Date.now().toString(36)}`,
        reference_transaction: data.reference_transaction,
        notes: data.notes,
        solde_restant: 0, // Sera calculé côté serveur
        type_paiement: data.type_paiement,
        prestations_payees: data.type_paiement === "partiel" ? data.prestations_payees : []
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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Nouveau Paiement</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Enregistrer un nouveau paiement
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="grid gap-2 py-2">
            {/* Client selection */}
            <div className="grid gap-1">
              <Label htmlFor="client_id" className="text-xs font-medium">Client</Label>
              <Select onValueChange={handleClientChange}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id} className="text-xs">
                      {client.type === "physique" ? client.nom : client.raisonsociale}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Credit checkbox */}
            <div className="flex items-center space-x-2 mb-0">
              <Checkbox 
                id="est_credit" 
                checked={estCredit} 
                onCheckedChange={(checked) => setValue("est_credit", checked === true)}
              />
              <Label htmlFor="est_credit" className="text-xs">Paiement en avance (crédit client)</Label>
            </div>

            {/* Facture selection */}
            {!estCredit && selectedClientId && (
              <div className="grid gap-1">
                <Label htmlFor="facture_id" className="text-xs font-medium">Facture</Label>
                <Select onValueChange={handleFactureChange}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Sélectionner une facture" />
                  </SelectTrigger>
                  <SelectContent>
                    {factures.map((facture) => (
                      <SelectItem key={facture.id} value={facture.id} className="text-xs">
                        {facture.id} - {facture.montant - (facture.montant_paye || 0)} FCFA
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Type de paiement options - seulement visible si une facture est sélectionnée */}
            {!estCredit && selectedFactureId && (
              <div className="grid gap-1">
                <Label className="text-xs font-medium">Type de paiement</Label>
                <RadioGroup 
                  defaultValue="total" 
                  value={typePaiement}
                  onValueChange={(value: "total" | "partiel") => setValue("type_paiement", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="total" id="total" className="h-3 w-3" />
                    <Label htmlFor="total" className="text-xs">Paiement total</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="partiel" id="partiel" className="h-3 w-3" />
                    <Label htmlFor="partiel" className="text-xs">Paiement partiel</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Prestations selection - seulement visible si paiement partiel */}
            {!estCredit && selectedFactureId && typePaiement === "partiel" && prestations.length > 0 && (
              <div className="grid gap-1">
                <Label className="text-xs font-medium">Prestations à payer</Label>
                <div className="max-h-28 overflow-y-auto border rounded p-1">
                  {prestations.map((prestation) => (
                    <div key={prestation.id} className="flex items-center space-x-2 mb-1">
                      <Checkbox 
                        id={`prestation-${prestation.id}`} 
                        checked={selectedPrestations?.includes(prestation.id)}
                        onCheckedChange={(checked) => handlePrestationChange(prestation.id, checked === true)}
                        className="h-3 w-3"
                      />
                      <Label htmlFor={`prestation-${prestation.id}`} className="text-xs">
                        {prestation.description} - {prestation.montant} FCFA
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Date picker */}
            <div className="grid gap-1">
              <Label htmlFor="date" className="text-xs font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 w-full justify-start text-left font-normal text-xs"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
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

            {/* Amount */}
            <div className="grid gap-1">
              <Label htmlFor="montant" className="text-xs font-medium">Montant (FCFA)</Label>
              <Input
                id="montant"
                type="number"
                {...register("montant", { required: true, min: 1 })}
                className="h-8 text-xs"
              />
              {errors.montant && (
                <p className="text-xs text-red-500">Le montant est requis et doit être positif</p>
              )}
            </div>

            {/* Payment mode */}
            <div className="grid gap-1">
              <Label htmlFor="mode" className="text-xs font-medium">Mode de paiement</Label>
              <Select 
                onValueChange={(value: "espèces" | "virement" | "orange_money" | "mtn_money") => setValue("mode", value)} 
                defaultValue="espèces"
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Mode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="espèces" className="text-xs">Espèces</SelectItem>
                  <SelectItem value="virement" className="text-xs">Virement bancaire</SelectItem>
                  <SelectItem value="orange_money" className="text-xs">Orange Money</SelectItem>
                  <SelectItem value="mtn_money" className="text-xs">MTN Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transaction reference */}
            {["orange_money", "mtn_money"].includes(selectedMode) && (
              <div className="grid gap-1">
                <Label htmlFor="reference_transaction" className="text-xs font-medium">Référence transaction</Label>
                <Input
                  id="reference_transaction"
                  type="text"
                  placeholder="Ex: OM-123456789"
                  {...register("reference_transaction")}
                  className="h-8 text-xs"
                />
              </div>
            )}

            {/* Notes */}
            <div className="grid gap-1">
              <Label htmlFor="notes" className="text-xs font-medium">Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Informations supplémentaires..."
                className="h-16 text-xs resize-none"
              />
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-8 text-xs">
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-8 text-xs">
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaiementDialog;
