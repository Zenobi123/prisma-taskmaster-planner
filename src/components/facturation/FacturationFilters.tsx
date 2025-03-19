
import { useEffect, useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchClients } from "@/services/facture/clientService";

interface FacturationFiltersProps {
  onStatusChange: (status: string | undefined) => void;
  onClientChange: (clientId: string | undefined) => void;
  onDateChange: (dateDebut: string | undefined, dateFin: string | undefined) => void;
}

export const FacturationFilters = ({
  onStatusChange,
  onClientChange,
  onDateChange
}: FacturationFiltersProps) => {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [dateDebut, setDateDebut] = useState<Date | undefined>(undefined);
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined);

  // Récupération de la liste des clients
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  // Formatage des dates pour l'affichage
  const formatDateRange = () => {
    if (dateDebut && dateFin) {
      return `${format(dateDebut, 'dd/MM/yyyy')} - ${format(dateFin, 'dd/MM/yyyy')}`;
    }
    if (dateDebut) {
      return `À partir du ${format(dateDebut, 'dd/MM/yyyy')}`;
    }
    if (dateFin) {
      return `Jusqu'au ${format(dateFin, 'dd/MM/yyyy')}`;
    }
    return "Sélectionner des dates";
  };

  // Transmission des filtres au composant parent
  useEffect(() => {
    onStatusChange(status);
  }, [status, onStatusChange]);

  useEffect(() => {
    onClientChange(clientId);
  }, [clientId, onClientChange]);

  useEffect(() => {
    const debutStr = dateDebut ? format(dateDebut, 'yyyy-MM-dd') : undefined;
    const finStr = dateFin ? format(dateFin, 'yyyy-MM-dd') : undefined;
    onDateChange(debutStr, finStr);
  }, [dateDebut, dateFin, onDateChange]);

  // Réinitialisation des filtres
  const handleReset = () => {
    setStatus(undefined);
    setClientId(undefined);
    setDateDebut(undefined);
    setDateFin(undefined);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Select
        value={status}
        onValueChange={setStatus}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous les statuts</SelectItem>
          <SelectItem value="non_paye">Non payé</SelectItem>
          <SelectItem value="partiellement_paye">Partiellement payé</SelectItem>
          <SelectItem value="paye">Payé</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={clientId}
        onValueChange={setClientId}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous les clients</SelectItem>
          {clients.map(client => (
            <SelectItem key={client.id} value={client.id}>
              {client.nom}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[230px] justify-start text-left">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateDebut}
            locale={fr}
            selected={{
              from: dateDebut,
              to: dateFin
            }}
            onSelect={(range) => {
              setDateDebut(range?.from);
              setDateFin(range?.to);
            }}
          />
        </PopoverContent>
      </Popover>

      {(status || clientId || dateDebut || dateFin) && (
        <Button variant="ghost" size="icon" onClick={handleReset} title="Réinitialiser les filtres">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
