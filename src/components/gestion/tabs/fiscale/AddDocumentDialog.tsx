
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export type FiscalDocument = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  validUntil: Date | null;
};

type AddDocumentDialogProps = {
  onAddDocument: (document: Omit<FiscalDocument, "id">) => void;
};

export function AddDocumentDialog({ onAddDocument }: AddDocumentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [createdAt, setCreatedAt] = React.useState<Date>(new Date());
  const [validUntil, setValidUntil] = React.useState<Date | undefined>(addDays(new Date(), 90));
  const [dateInputValue, setDateInputValue] = React.useState(format(new Date(), "dd/MM/yyyy", { locale: fr }));

  // Update validUntil when createdAt changes
  React.useEffect(() => {
    setValidUntil(addDays(createdAt, 90));
  }, [createdAt]);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInputValue(value);
    
    // Parse the input date
    const parsedDate = parse(value, "dd/MM/yyyy", new Date());
    
    // Only update the date if it's valid
    if (isValid(parsedDate)) {
      setCreatedAt(parsedDate);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setCreatedAt(date);
      setDateInputValue(format(date, "dd/MM/yyyy", { locale: fr }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Nom requis",
        description: "Veuillez saisir un nom pour le document",
        variant: "destructive",
      });
      return;
    }

    onAddDocument({
      name,
      description,
      createdAt,
      validUntil: validUntil || null,
    });
    
    // Reset form
    setName("");
    setDescription("");
    setCreatedAt(new Date());
    setDateInputValue(format(new Date(), "dd/MM/yyyy", { locale: fr }));
    setValidUntil(addDays(new Date(), 90));
    setOpen(false);

    toast({
      title: "Document ajouté",
      description: `${name} a été ajouté avec succès`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Plus size={16} />
          Ajouter un document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un document fiscal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Ex: Attestation de Conformité Fiscale"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Description du document"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date de création</Label>
            <div className="col-span-3 flex gap-2 items-center">
              <Input
                value={dateInputValue}
                onChange={handleDateInputChange}
                className="w-full"
                placeholder="JJ/MM/AAAA"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-10 p-0"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={createdAt}
                    onSelect={handleCalendarSelect}
                    initialFocus
                    locale={fr}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date de fin de validité</Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {validUntil ? (
                      format(validUntil, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={validUntil}
                    onSelect={(date) => date && setValidUntil(date)}
                    initialFocus
                    locale={fr}
                    fromDate={createdAt}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
