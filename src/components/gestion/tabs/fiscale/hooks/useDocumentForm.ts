import { useState, useEffect } from "react";
import { format, addDays, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import type { FiscalDocument } from "../types";

export function useDocumentForm(onAddDocument: (document: Omit<FiscalDocument, "id">) => void) {
  const [description, setDescription] = useState("");
  const [createdAt, setCreatedAt] = useState<Date>(new Date());
  const [validUntil, setValidUntil] = useState<Date | undefined>(addDays(new Date(), 90));
  const [dateInputValue, setDateInputValue] = useState(format(new Date(), "dd/MM/yyyy", { locale: fr }));
  const [documentType, setDocumentType] = useState<string>("ACF");

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
    setDescription("");
    setCreatedAt(new Date());
    setDateInputValue(format(new Date(), "dd/MM/yyyy", { locale: fr }));
    setValidUntil(addDays(new Date(), 90));
    setDocumentType("ACF");
  };

  const getDocumentName = (type: string): string => {
    switch (type) {
      case "ACF":
        return "Attestation de Conformité Fiscale";
      case "DSF":
        return "Déclaration Statistique et Fiscale";
      case "PATENTE":
        return "Patente";
      case "AUTRE":
        return "Document fiscal";
      default:
        return "Document fiscal";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description) {
      toast({
        title: "Description requise",
        description: "Veuillez saisir une description pour le document",
        variant: "destructive",
      });
      return;
    }

    onAddDocument({
      description,
      createdAt,
      validUntil: validUntil || null,
      documentType,
      name: getDocumentName(documentType),
      documentUrl: null
    });
    
    resetForm();
    return true;
  };

  return {
    description,
    setDescription,
    createdAt,
    validUntil,
    setValidUntil,
    dateInputValue,
    documentType,
    setDocumentType,
    handleDateInputChange,
    handleCalendarSelect,
    handleSubmit,
  };
}
