import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Employee } from '@/types/employee';
import { paieService } from '@/services/paieService';
import { useToast } from '@/components/ui/use-toast';

interface EmployeePaieFormProps {
  employee: Employee;
  onPaieCreated?: () => void;
  onPaieUpdated?: () => void;
  onClose: () => void;
}

const EmployeePaieForm: React.FC<EmployeePaieFormProps> = ({ employee, onPaieCreated, onPaieUpdated, onClose }) => {
  const { toast } = useToast();
  const [mois, setMois] = useState<number>(new Date().getMonth() + 1);
  const [annee, setAnnee] = useState<number>(new Date().getFullYear());
  const [salaireBase, setSalaireBase] = useState<number>(employee.salaire_base || 0);
  const [heuresSup, setHeuresSup] = useState<number>(0);
  const [tauxHoraireSup, setTauxHoraireSup] = useState<number>(0);
  const [montantHeuresSup, setMontantHeuresSup] = useState<number>(0);
  const [primes, setPrimes] = useState<any[]>([]);
  const [totalPrimes, setTotalPrimes] = useState<number>(0);
  const [salaireBrut, setSalaireBrut] = useState<number>(0);
  const [cnpsEmploye, setCnpsEmploye] = useState<number>(0);
  const [cnpsEmployeur, setCnpsEmployeur] = useState<number>(0);
  const [irpp, setIrpp] = useState<number>(0);
  const [cac, setCac] = useState<number>(0);
  const [cfc, setCfc] = useState<number>(0);
  const [tdl, setTdl] = useState<number>(0);
  const [autresRetenues, setAutresRetenues] = useState<any[]>([]);
  const [totalRetenues, setTotalRetenues] = useState<number>(0);
  const [salaireNet, setSalaireNet] = useState<number>(0);
  const [datePaiement, setDatePaiement] = useState<Date | null>(null);
  const [modePaiement, setModePaiement] = useState<string>('Virement bancaire');
  const [referencePaiement, setReferencePaiement] = useState<string>('');
  const [statut, setStatut] = useState<string>('Payé');
  const [notes, setNotes] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newPrimeLabel, setNewPrimeLabel] = useState<string>('');
  const [newPrimeValue, setNewPrimeValue] = useState<number>(0);
  const [newRetenueLabel, setNewRetenueLabel] = useState<string>('');
  const [newRetenueValue, setNewRetenueValue] = useState<number>(0);
  
  const moisOptions = [
    { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' }, { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' }, { value: 5, label: 'Mai' }, { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' }, { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' }, { value: 11, label: 'Novembre' }, { value: 12, label: 'Décembre' }
  ];
  
  const calculateTotals = () => {
    const calculatedTotalPrimes = primes.reduce((acc, prime) => acc + prime.value, 0);
    const calculatedSalaireBrut = salaireBase + montantHeuresSup + calculatedTotalPrimes;
    const calculatedCnpsEmploye = calculatedSalaireBrut * 0.048;
    const calculatedCac = calculatedSalaireBrut * 0.01;
    const calculatedCfc = calculatedSalaireBrut * 0.01;
    const calculatedTdl = calculatedSalaireBrut * 0.015;
    const calculatedTotalRetenues = cnpsEmploye + cac + cfc + tdl +
      autresRetenues.reduce((acc, retenue) => acc + retenue.value, 0);
    const calculatedSalaireNet = calculatedSalaireBrut - calculatedTotalRetenues;
    
    setTotalPrimes(calculatedTotalPrimes);
    setSalaireBrut(calculatedSalaireBrut);
    setCnpsEmploye(calculatedCnpsEmploye);
    setCac(calculatedCac);
    setCfc(calculatedCfc);
    setTdl(calculatedTdl);
    setTotalRetenues(calculatedTotalRetenues);
    setSalaireNet(calculatedSalaireNet);
  };
  
  useEffect(() => {
    calculateTotals();
  }, [salaireBase, montantHeuresSup, primes, autresRetenues]);
  
  const handleAddPrime = () => {
    if (newPrimeLabel && newPrimeValue > 0) {
      setPrimes([...primes, { label: newPrimeLabel, value: newPrimeValue }]);
      setNewPrimeLabel('');
      setNewPrimeValue(0);
      setIsDialogOpen(false);
    }
  };
  
  const handleRemovePrime = (index: number) => {
    const newPrimes = [...primes];
    newPrimes.splice(index, 1);
    setPrimes(newPrimes);
  };
  
  const handleAddRetenue = () => {
    if (newRetenueLabel && newRetenueValue > 0) {
      setAutresRetenues([...autresRetenues, { label: newRetenueLabel, value: newRetenueValue }]);
      setNewRetenueLabel('');
      setNewRetenueValue(0);
      setIsDialogOpen(false);
    }
  };
  
  const handleRemoveRetenue = (index: number) => {
    const newRetenues = [...autresRetenues];
    newRetenues.splice(index, 1);
    setAutresRetenues(newRetenues);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payrollData = {
      employe_id: employee.id,
      mois,
      annee,
      salaire_base: salaireBase,
      heures_sup: heuresSup,
      taux_horaire_sup: tauxHoraireSup,
      montant_heures_sup: montantHeuresSup,
      primes: primes,
      total_primes: totalPrimes,
      salaire_brut: salaireBrut,
      cnps_employe: cnpsEmploye,
      cnps_employeur: cnpsEmployeur,
      irpp: irpp,
      cac: cac,
      cfc: cfc,
      tdl: tdl,
      autres_retenues: autresRetenues,
      total_retenues: totalRetenues,
      salaire_net: salaireNet,
      date_paiement: datePaiement ? format(datePaiement, 'yyyy-MM-dd') : null,
      mode_paiement: modePaiement,
      reference_paiement: referencePaiement,
      statut: statut,
      notes: notes,
    };
    
    try {
      const createdPayroll = await paieService.createPayroll(payrollData);
      
      if (createdPayroll) {
        toast({
          title: "Fiche de paie créée",
          description: "La fiche de paie a été créée avec succès.",
        });
        onPaieCreated?.();
        onClose();
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de la création de la fiche de paie.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création de la fiche de paie:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création de la fiche de paie.",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une fiche de paie</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mois">Mois</Label>
              <Select value={mois.toString()} onValueChange={(value) => setMois(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mois" />
                </SelectTrigger>
                <SelectContent>
                  {moisOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="annee">Année</Label>
              <Input
                type="number"
                id="annee"
                value={annee}
                onChange={(e) => setAnnee(parseInt(e.target.value))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="salaireBase">Salaire de base</Label>
            <Input
              type="number"
              id="salaireBase"
              value={salaireBase}
              onChange={(e) => setSalaireBase(parseFloat(e.target.value))}
            />
          </div>
          <Tabs defaultValue="heures">
            <TabsList>
              <TabsTrigger value="heures">Heures supplémentaires</TabsTrigger>
              <TabsTrigger value="primes">Primes</TabsTrigger>
              <TabsTrigger value="retenues">Retenues</TabsTrigger>
            </TabsList>
            <TabsContent value="heures" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heuresSup">Nombre d'heures</Label>
                  <Input
                    type="number"
                    id="heuresSup"
                    value={heuresSup}
                    onChange={(e) => setHeuresSup(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="tauxHoraireSup">Taux horaire</Label>
                  <Input
                    type="number"
                    id="tauxHoraireSup"
                    value={tauxHoraireSup}
                    onChange={(e) => setTauxHoraireSup(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="montantHeuresSup">Montant total</Label>
                <Input
                  type="number"
                  id="montantHeuresSup"
                  value={montantHeuresSup}
                  onChange={(e) => setMontantHeuresSup(parseFloat(e.target.value))}
                />
              </div>
            </TabsContent>
            <TabsContent value="primes" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Liste des primes</h4>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter une prime
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Ajouter une prime</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="label" className="text-right">
                          Label
                        </Label>
                        <Input id="label" value={newPrimeLabel} onChange={(e) => setNewPrimeLabel(e.target.value)} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="value" className="text-right">
                          Value
                        </Label>
                        <Input
                          type="number"
                          id="value"
                          value={newPrimeValue}
                          onChange={(e) => setNewPrimeValue(parseFloat(e.target.value))}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" onClick={handleAddPrime}>
                        Ajouter
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {primes.length > 0 ? (
                <ul className="list-none space-y-2">
                  {primes.map((prime, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{prime.label}</span>
                      <div className="flex items-center space-x-2">
                        <span>{prime.value}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleRemovePrime(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Aucune prime ajoutée.</p>
              )}
            </TabsContent>
            <TabsContent value="retenues" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Liste des retenues</h4>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter une retenue
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Ajouter une retenue</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="label" className="text-right">
                          Label
                        </Label>
                        <Input id="label" value={newRetenueLabel} onChange={(e) => setNewRetenueLabel(e.target.value)} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="value" className="text-right">
                          Value
                        </Label>
                        <Input
                          type="number"
                          id="value"
                          value={newRetenueValue}
                          onChange={(e) => setNewRetenueValue(parseFloat(e.target.value))}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" onClick={handleAddRetenue}>
                        Ajouter
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {autresRetenues.length > 0 ? (
                <ul className="list-none space-y-2">
                  {autresRetenues.map((retenue, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{retenue.label}</span>
                      <div className="flex items-center space-x-2">
                        <span>{retenue.value}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveRetenue(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Aucune retenue ajoutée.</p>
              )}
            </TabsContent>
          </Tabs>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="datePaiement">Date de paiement</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={format(datePaiement || new Date(), 'PPP', { locale: fr })}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>{datePaiement ? format(datePaiement, 'PPP', { locale: fr }) : <span>Choisir une date</span>}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    locale={fr}
                    selected={datePaiement}
                    onSelect={setDatePaiement}
                    disabled={(date) =>
                      date > new Date() || date < new Date('2020-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="modePaiement">Mode de paiement</Label>
              <Select value={modePaiement} onValueChange={setModePaiement}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Virement bancaire">Virement bancaire</SelectItem>
                  <SelectItem value="Chèque">Chèque</SelectItem>
                  <SelectItem value="Espèces">Espèces</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="referencePaiement">Référence de paiement</Label>
            <Input
              type="text"
              id="referencePaiement"
              value={referencePaiement}
              onChange={(e) => setReferencePaiement(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="statut">Statut</Label>
            <Select value={statut} onValueChange={setStatut}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Payé">Payé</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Non payé">Non payé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              type="text"
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <CardFooter>
            <Button type="submit">Créer la fiche de paie</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeePaieForm;
