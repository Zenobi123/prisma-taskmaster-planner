
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { addPaiement } from "@/services/factureService";

// Schéma de validation pour un paiement
const paiementSchema = z.object({
  date: z.date(),
  montant: z.number().min(0.01, "Le montant doit être supérieur à 0"),
  mode: z.string().min(1, "Veuillez sélectionner un mode de paiement"),
  notes: z.string().optional()
});

type PaiementFormData = z.infer<typeof paiementSchema>;

interface PaiementFormProps {
  facture: Facture;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PaiementForm({ facture, onSuccess, onCancel }: PaiementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Calculer le solde restant
  const soldeRestant = facture.montant - (facture.montant_paye || 0);
  
  // Initialiser le formulaire
  const form = useForm<PaiementFormData>({
    resolver: zodResolver(paiementSchema),
    defaultValues: {
      date: new Date(),
      montant: soldeRestant > 0 ? soldeRestant : 0,
      mode: "virement",
      notes: ""
    }
  });
  
  // Mutation pour ajouter un paiement
  const addPaiementMutation = useMutation({
    mutationFn: addPaiement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      toast({
        title: "Paiement ajouté",
        description: "Le paiement a été ajouté avec succès à la facture."
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error("Erreur lors de l'ajout du paiement:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du paiement.",
        variant: "destructive"
      });
    }
  });
  
  // Gérer la soumission du formulaire
  const onSubmit = async (data: PaiementFormData) => {
    try {
      setIsSubmitting(true);
      
      // Vérifier que le montant ne dépasse pas le solde restant
      if (data.montant > soldeRestant) {
        toast({
          title: "Attention",
          description: `Le montant du paiement (${data.montant} XAF) dépasse le solde restant (${soldeRestant} XAF).`,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Préparer les données du paiement
      const paiementData = {
        facture_id: facture.id,
        date: format(data.date, "yyyy-MM-dd"),
        montant: data.montant,
        mode: data.mode,
        notes: data.notes
      };
      
      // Ajouter le paiement
      await addPaiementMutation.mutateAsync(paiementData);
    } catch (error) {
      console.error("Erreur lors de la soumission du paiement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Facture</span>
            <span className="font-semibold">#{facture.id.substring(0, 8)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Client</span>
            <span className="font-semibold">{facture.client.nom}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Montant total</span>
            <span className="font-semibold">{new Intl.NumberFormat('fr-FR').format(facture.montant)} XAF</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Montant payé</span>
            <span>{new Intl.NumberFormat('fr-FR').format(facture.montant_paye || 0)} XAF</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Solde restant</span>
            <span className="font-bold text-green-600">{new Intl.NumberFormat('fr-FR').format(soldeRestant)} XAF</span>
          </div>
        </div>
        
        {/* Date du paiement */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date du paiement</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Montant */}
        <FormField
          control={form.control}
          name="montant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant (XAF)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Montant du paiement" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Mode de paiement */}
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mode de paiement</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un mode de paiement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="virement">Virement bancaire</SelectItem>
                  <SelectItem value="espèces">Espèces</SelectItem>
                  <SelectItem value="chèque">Chèque</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                  <SelectItem value="carte">Carte bancaire</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optionnel)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ajouter des notes sur ce paiement" 
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Traitement en cours..." : "Enregistrer le paiement"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
