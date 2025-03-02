
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewFactureDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateInvoice: (formData: any) => void;
}

export const NewFactureDialog = ({
  isOpen,
  onOpenChange,
  onCreateInvoice,
}: NewFactureDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle facture client.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="client">Client</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client-001">SARL TechPro</SelectItem>
                <SelectItem value="client-002">SAS WebDev</SelectItem>
                <SelectItem value="client-003">EURL ConseilPlus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date d'émission</Label>
              <Input id="date" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="echeance">Date d'échéance</Label>
              <Input id="echeance" type="date" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Prestations</Label>
            <div className="border rounded-md p-3">
              <div className="grid grid-cols-12 gap-2 mb-2">
                <div className="col-span-8">
                  <Input placeholder="Description" />
                </div>
                <div className="col-span-4">
                  <Input placeholder="Montant (FCFA)" type="number" />
                </div>
              </div>
              <Button variant="outline" className="w-full mt-2" size="sm">
                <Plus className="w-3 h-3 mr-1" /> Ajouter une prestation
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={() => onCreateInvoice({})}>
            Créer la facture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
