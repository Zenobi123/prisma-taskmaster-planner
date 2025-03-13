
import { useState, useEffect } from "react";
import { format, addDays, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import type { FiscalDocument } from "../types";

export function useDocumentForm(onAddDocument: (document: Omit<FiscalDocument, "id">) => void, clientId?: string) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createdAt, setCreatedAt] = useState<Date>(new Date());
  const [validUntil, setValidUntil] = useState<Date | undefined>(addDays(new Date(), 90));
  const [dateInputValue, setDateInputValue] = useState(format(new Date(), "dd/MM/yyyy", { locale: fr }));

  useEffect(() => {
    setValidUntil(addDays(createdAt, 90));
  }, [createdAt]);

  const handleDateInputChange = (value: string) => {
    setDateInputValue(value);
    const parsedDate = parse(value, "dd/MM/yyyy", new Date());
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

  const resetForm = () => {
    setName("");
    setDescription("");
    setCreatedAt(new Date());
    setDateInputValue(format(new Date(), "dd/MM/yyyy", { locale: fr }));
    setValidUntil(addDays(new Date(), 90));
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

    if (!clientId) {
      toast({
        title: "Erreur",
        description: "Aucun client sélectionné",
        variant: "destructive",
      });
      return;
    }

    onAddDocument({
      name,
      description,
      createdAt,
      validUntil: validUntil || null,
      client_id: clientId
    });
    
    resetForm();
    return true;
  };

  return {
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
  };
}
