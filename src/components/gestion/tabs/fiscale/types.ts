
export type FiscalDocument = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  validUntil: Date | null;
};

export type AddDocumentDialogProps = {
  onAddDocument: (document: Omit<FiscalDocument, "id">) => void;
};
