
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useDocumentForm } from "./hooks/useDocumentForm";
import { DateInput } from "./components/DateInput";
import type { AddDocumentDialogProps } from "./types";

export function AddDocumentDialog({ onAddDocument }: AddDocumentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const {
    name,
    setName,
    description,
    setDescription,
    createdAt,
    validUntil,
    setValidUntil,
    dateInputValue,
    handleDateInputChange,
    handleCalendarSelect,
    handleSubmit,
  } = useDocumentForm((doc) => {
    onAddDocument(doc);
    setOpen(false);
    toast({
      title: "Document ajouté",
      description: `${doc.name} a été ajouté avec succès`,
    });
  });

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
          
          <DateInput
            label="Date de création"
            value={dateInputValue}
            selected={createdAt}
            onInputChange={handleDateInputChange}
            onCalendarSelect={handleCalendarSelect}
          />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date de fin de validité</Label>
            <div className="col-span-3">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => setValidUntil(undefined)}
              >
                {validUntil ? (
                  format(validUntil, "PPP", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
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
