
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchFactureById } from "@/services/facture/facturesQuery";
import { useFactures } from "@/hooks/useFactures";
import { Prestation } from "@/types/facture";
import { PrestationsForm } from "@/components/facturation/newFacture/PrestationsForm";

const FactureEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateEmission, setDateEmission] = useState<Date | undefined>();
  const [dateEcheance, setDateEcheance] = useState<Date | undefined>();
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { data: facture, isLoading, isError } = useQuery({
    queryKey: ['facture', id],
    queryFn: () => id ? fetchFactureById(id) : Promise.reject("ID manquant"),
    enabled: !!id
  });
  
  const { handleUpdateInvoice } = useFactures();
  
  const form = useForm({
    defaultValues: {
      date: "",
      echeance: "",
      prestations: [] as Prestation[],
      notes: "",
      mode_reglement: "",
    }
  });
  
  // Initialiser le formulaire avec les données de la facture
  useEffect(() => {
    if (facture) {
      // Définir les dates
      try {
        const dateObj = parseISO(facture.date);
        const echeanceObj = parseISO(facture.echeance);
        setDateEmission(dateObj);
        setDateEcheance(echeanceObj);
        form.setValue("date", facture.date);
        form.setValue("echeance", facture.echeance);
      } catch (e) {
        console.error("Erreur lors du parsing des dates:", e);
      }
      
      // Définir les prestations
      setPrestations(facture.prestations);
      form.setValue("prestations", facture.prestations);
      
      // Autres champs
      form.setValue("notes", facture.notes || "");
      form.setValue("mode_reglement", facture.mode_reglement || "");
    }
  }, [facture, form]);
  
  // Mise à jour des champs de formulaire quand les états changent
  useEffect(() => {
    if (dateEmission) {
      form.setValue("date", format(dateEmission, "yyyy-MM-dd"));
    }
    
    if (dateEcheance) {
      form.setValue("echeance", format(dateEcheance, "yyyy-MM-dd"));
    }
    
    form.setValue("prestations", prestations);
  }, [dateEmission, dateEcheance, prestations, form]);
  
  // Soumission du formulaire
  const onSubmit = async (data: any) => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Calculer le montant total
      const montant = prestations.reduce((sum, p) => sum + p.montant, 0);
      
      // Construire les données à mettre à jour
      const updateData = {
        ...data,
        prestations,
        montant,
      };
      
      // Mettre à jour la facture
      await handleUpdateInvoice(id, updateData);
      
      toast({
        title: "Facture mise à jour",
        description: "La facture a été mise à jour avec succès.",
      });
      
      // Rediriger vers la page de détails
      navigate(`/facturation/${id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la facture.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // État de chargement
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement des données de la facture...</p>
        </div>
      </div>
    );
  }
  
  // État d'erreur
  if (isError || !facture) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-destructive mb-4">Erreur lors du chargement de la facture</p>
          <Button variant="outline" onClick={() => navigate("/facturation")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }
  
  // Vérifier si la facture est payée
  if (facture.status === "paye") {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-amber-600 mb-4">Cette facture a déjà été payée et ne peut plus être modifiée.</p>
          <Button variant="outline" onClick={() => navigate(`/facturation/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux détails
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* En-tête */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(`/facturation/${id}`)}
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Modifier la facture {facture.id}</h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations client (affichage uniquement) */}
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Nom</p>
                  <p>{facture.client_nom}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Email</p>
                  <p>{facture.client_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Téléphone</p>
                  <p>{facture.client_telephone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Adresse</p>
                  <p>{facture.client_adresse}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>Date d'émission</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateEmission 
                          ? format(dateEmission, "dd MMMM yyyy", { locale: fr })
                          : "Sélectionner une date"}
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
                  <FormLabel>Date d'échéance</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateEcheance 
                          ? format(dateEcheance, "dd MMMM yyyy", { locale: fr }) 
                          : "Sélectionner une date"}
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
            </CardContent>
          </Card>
          
          {/* Prestations */}
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
          
          {/* Mode de règlement */}
          <Card>
            <CardHeader>
              <CardTitle>Conditions de règlement</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
          
          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
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
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={loading || prestations.length === 0}>
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default FactureEdit;
