
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { calculationService } from "@/services/calculationService";
import { Employe } from "@/types/paie";
import { paieService } from "@/services/paieService";
import { toast } from "sonner";

const formSchema = z.object({
  mois: z.coerce.number().min(1).max(12),
  annee: z.coerce.number().min(2020).max(2050),
  salaire_base: z.coerce.number().min(0),
  heures_sup: z.coerce.number().min(0).optional(),
  taux_horaire_sup: z.coerce.number().min(0).optional(),
  primes: z.string().optional(),
  statut: z.string(),
  mode_paiement: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface EmployeePaieFormProps {
  employee: Employe;
  clientId: string;
  onSuccess: () => void;
}

export function EmployeePaieForm({ employee, clientId, onSuccess }: EmployeePaieFormProps) {
  const [open, setOpen] = useState(false);
  const [calculatedValues, setCalculatedValues] = useState({
    salaireBrut: 0,
    cnpsEmploye: 0,
    cnpsEmployeur: 0,
    irpp: 0,
    cac: 0,
    tdl: 0,
    rav: 0,
    cfc: 0,
    cfcEmployeur: 0,
    fne: 0,
    salaireNet: 0,
    coutEmployeur: 0,
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mois: new Date().getMonth() + 1,
      annee: new Date().getFullYear(),
      salaire_base: employee.salaire_base,
      heures_sup: 0,
      taux_horaire_sup: 0,
      primes: "",
      statut: "En cours",
      mode_paiement: "Virement",
    },
  });
  
  // Calculer les valeurs lorsque le salaire de base change
  useEffect(() => {
    const salaire_base = form.watch("salaire_base");
    const heures_sup = form.watch("heures_sup") || 0;
    const taux_horaire_sup = form.watch("taux_horaire_sup") || 0;
    
    const montantHeuresSup = heures_sup * taux_horaire_sup;
    const primesValue = parseFloat(form.watch("primes") || "0");
    
    const salaireBrut = salaire_base + montantHeuresSup + (isNaN(primesValue) ? 0 : primesValue);
    
    // Calculer les déductions employé
    const cnpsEmploye = calculationService.calculateCNPSEmployee(salaireBrut);
    const irpp = calculationService.calculateIRPP(salaireBrut);
    const cac = calculationService.calculateCAC(irpp);
    const tdl = calculationService.calculateTDL(salaireBrut);
    const rav = calculationService.calculateRAV(salaireBrut);
    const cfc = calculationService.calculateCFCEmployee(salaireBrut);
    const salaireNet = salaireBrut - cnpsEmploye - irpp - cac - tdl - rav - cfc;
    
    // Calculer les charges employeur
    const cnpsEmployeur = calculationService.calculateCNPSEmployer(salaireBrut);
    const fne = calculationService.calculateFNE(salaireBrut);
    const cfcEmployeur = calculationService.calculateCFCEmployer(salaireBrut);
    const coutEmployeur = salaireBrut + cnpsEmployeur + fne + cfcEmployeur;
    
    setCalculatedValues({
      salaireBrut,
      cnpsEmploye,
      cnpsEmployeur,
      irpp,
      cac,
      tdl,
      rav,
      cfc,
      cfcEmployeur,
      fne,
      salaireNet,
      coutEmployeur
    });
  }, [form.watch]);
  
  const onSubmit = async (data: FormValues) => {
    try {
      // Préparer les primes en format JSON
      let primesJSON = {};
      try {
        if (data.primes) {
          primesJSON = JSON.parse(data.primes);
        }
      } catch (e) {
        // Si ce n'est pas un JSON valide, le traiter comme un montant simple
        const primeAmount = parseFloat(data.primes || "0");
        if (!isNaN(primeAmount)) {
          primesJSON = { "Prime générale": primeAmount };
        }
      }
      
      // Calculer le montant des heures supplémentaires
      const montantHeuresSup = (data.heures_sup || 0) * (data.taux_horaire_sup || 0);
      
      // Calculer le total des primes
      let totalPrimes = 0;
      if (typeof primesJSON === "object") {
        Object.values(primesJSON).forEach((value) => {
          if (typeof value === "number") {
            totalPrimes += value;
          }
        });
      }
      
      // Calculer le salaire brut
      const salaireBrut = data.salaire_base + montantHeuresSup + totalPrimes;
      
      // Créer l'enregistrement de paie
      const paieRecord = {
        client_id: clientId,
        employe_id: employee.id,
        mois: data.mois,
        annee: data.annee,
        salaire_base: data.salaire_base,
        heures_sup: data.heures_sup || 0,
        taux_horaire_sup: data.taux_horaire_sup || 0,
        montant_heures_sup: montantHeuresSup,
        primes: primesJSON,
        total_primes: totalPrimes,
        salaire_brut: salaireBrut,
        cnps_employe: calculatedValues.cnpsEmploye,
        cnps_employeur: calculatedValues.cnpsEmployeur,
        irpp: calculatedValues.irpp,
        cac: calculatedValues.cac,
        tdl: calculatedValues.tdl,
        rav: calculatedValues.rav,
        cfc: calculatedValues.cfc,
        autres_retenues: {},
        total_retenues: calculatedValues.cnpsEmploye + calculatedValues.irpp + calculatedValues.cac + 
                        calculatedValues.tdl + calculatedValues.rav + calculatedValues.cfc,
        salaire_net: calculatedValues.salaireNet,
        statut: data.statut as any,
        mode_paiement: data.mode_paiement,
      };
      
      // Enregistrer la paie
      const result = await paieService.createPayroll(paieRecord as any);
      
      if (result) {
        toast.success("Fiche de paie créée avec succès");
        setOpen(false);
        onSuccess();
      } else {
        toast.error("Erreur lors de la création de la fiche de paie");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur s'est produite lors de la création");
    }
  };
  
  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('fr-FR').format(value);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Créer fiche de paie</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Créer une fiche de paie pour {employee.prenom} {employee.nom}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mois"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mois</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un mois" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Janvier</SelectItem>
                        <SelectItem value="2">Février</SelectItem>
                        <SelectItem value="3">Mars</SelectItem>
                        <SelectItem value="4">Avril</SelectItem>
                        <SelectItem value="5">Mai</SelectItem>
                        <SelectItem value="6">Juin</SelectItem>
                        <SelectItem value="7">Juillet</SelectItem>
                        <SelectItem value="8">Août</SelectItem>
                        <SelectItem value="9">Septembre</SelectItem>
                        <SelectItem value="10">Octobre</SelectItem>
                        <SelectItem value="11">Novembre</SelectItem>
                        <SelectItem value="12">Décembre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="annee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="salaire_base"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salaire de base (FCFA)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heures_sup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heures supplémentaires</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taux_horaire_sup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taux horaire (FCFA/heure)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="primes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primes (montant ou JSON)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Montant ou JSON: {"Prime ancienneté": 15000}' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="statut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Payé">Payé</SelectItem>
                        <SelectItem value="Annulé">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mode_paiement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode de paiement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Virement">Virement</SelectItem>
                        <SelectItem value="Chèque">Chèque</SelectItem>
                        <SelectItem value="Espèces">Espèces</SelectItem>
                        <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Résumé des calculs */}
            <div className="bg-muted/30 rounded-md p-4 space-y-2">
              <h3 className="font-medium">Résumé des calculs</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>Salaire brut:</div>
                <div className="text-right">{formatMoney(calculatedValues.salaireBrut)} FCFA</div>
                
                <div>CNPS (employé):</div>
                <div className="text-right">-{formatMoney(calculatedValues.cnpsEmploye)} FCFA</div>
                
                <div>IRPP:</div>
                <div className="text-right">-{formatMoney(calculatedValues.irpp)} FCFA</div>
                
                <div>CAC:</div>
                <div className="text-right">-{formatMoney(calculatedValues.cac)} FCFA</div>
                
                <div>TDL:</div>
                <div className="text-right">-{formatMoney(calculatedValues.tdl)} FCFA</div>
                
                <div>RAV:</div>
                <div className="text-right">-{formatMoney(calculatedValues.rav)} FCFA</div>
                
                <div>CFC (employé):</div>
                <div className="text-right">-{formatMoney(calculatedValues.cfc)} FCFA</div>
                
                <div className="font-bold">Salaire net:</div>
                <div className="text-right font-bold">{formatMoney(calculatedValues.salaireNet)} FCFA</div>
                
                <div className="border-t pt-2 font-medium">Coût total employeur:</div>
                <div className="text-right border-t pt-2 font-medium">{formatMoney(calculatedValues.coutEmployeur)} FCFA</div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Créer la fiche de paie</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
