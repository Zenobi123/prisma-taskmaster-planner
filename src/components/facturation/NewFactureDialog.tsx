
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { PrestationsForm } from "./newFacture/PrestationsForm";
import { useQuery } from "@tanstack/react-query";
import { fetchClients } from "@/services/facture/clientService";
import { CreateFactureData } from "@/services/facture/factureCreate";
import { Prestation } from "@/types/facture";

interface NewFactureDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateInvoice: (data: CreateFactureData) => Promise<any>;
}

export const NewFactureDialog = ({
  isOpen,
  onOpenChange,
  onCreateInvoice,
}: NewFactureDialogProps) => {
  const form = useForm<CreateFactureData>({
    defaultValues: {
      client_id: "",
      client_nom: "",
      client_email: "",
      client_telephone: "",
      client_adresse: "",
      date: format(new Date(), "yyyy-MM-dd"),
      echeance: format(addDays(new Date(), 30), "yyyy-MM-dd"),
      prestations: [{ description: "", montant: 0 }],
      notes: "",
      mode_reglement: "virement",
    },
  });
  
  const [prestations, setPrestations] = useState<Prestation[]>([
    { description: "", montant: 0 }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [dateEmission, setDateEmission] = useState<Date>(new Date());
  const [dateEcheance, setDateEcheance] = useState<Date>(addDays(new Date(), 30));

  // Récupération de la liste des clients
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  // Mise à jour des dates dans le formulaire
  useEffect(() => {
    form.setValue("date", format(dateEmission, "yyyy-MM-dd"));
    form.setValue("echeance", format(dateEcheance, "yyyy-MM-dd"));
  }, [dateEmission, dateEcheance, form]);

  // Mise à jour des prestations dans le formulaire
  useEffect(() => {
    form.setValue("prestations", prestations);
  }, [prestations, form]);

  // Sélection d'un client
  const handleClientSelect = (clientId: string) => {
    form.setValue("client_id", clientId);
    
    const selectedClient = clients.find(client => client.id === clientId);
    if (selectedClient) {
      form.setValue("client_nom", selectedClient.nom);
      form.setValue("client_email", selectedClient.email);
      form.setValue("client_telephone", selectedClient.telephone);
      form.setValue("client_adresse", selectedClient.adresse);
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (data: CreateFactureData) => {
    setLoading(true);
    try {
      await onCreateInvoice(data);
      onOpenChange(false);
      form.reset();
      setPrestations([{ description: "", montant: 0 }]);
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
          <DialogDescription>
            Remplissez les détails ci-dessous pour créer une nouvelle facture.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Section client */}
            <div>
              <h3 className="text-lg font-medium mb-4">Informations client</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={handleClientSelect}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="client_nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="client_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="client_telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="client_adresse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Section dates */}
            <div>
              <h3 className="text-lg font-medium mb-4">Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date d'émission</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(dateEmission, "dd MMMM yyyy", { locale: fr })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateEmission}
                        onSelect={(date) => date && setDateEmission(date)}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Date d'échéance</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(dateEcheance, "dd MMMM yyyy", { locale: fr })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateEcheance}
                        onSelect={(date) => date && setDateEcheance(date)}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Section prestations */}
            <PrestationsForm
              prestations={prestations}
              setPrestations={setPrestations}
            />

            {/* Section paiement */}
            <div>
              <h3 className="text-lg font-medium mb-4">Conditions de règlement</h3>
              <FormField
                control={form.control}
                name="mode_reglement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode de règlement</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un mode de règlement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="especes">Espèces</SelectItem>
                        <SelectItem value="cheque">Chèque</SelectItem>
                        <SelectItem value="virement">Virement bancaire</SelectItem>
                        <SelectItem value="carte">Carte bancaire</SelectItem>
                        <SelectItem value="mobile">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informations complémentaires (facultatif)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading || prestations.length === 0 || !form.getValues().client_id}>
                {loading ? "Création en cours..." : "Créer la facture"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
