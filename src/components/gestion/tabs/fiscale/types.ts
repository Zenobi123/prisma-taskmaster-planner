
export type FiscalDocument = {
  id: string;
  description: string;
  createdAt: Date;
  validUntil: Date | null;
  documentType?: string;
};

export type AddDocumentDialogProps = {
  onAddDocument: (document: Omit<FiscalDocument, "id">) => void;
};

// Type pour l'affichage dans le tableau de bord
export type FiscalDocumentDisplay = {
  id: string;
  description: string;
  created_at: string;
  valid_until: string | null;
  client_id: string;
  document_type?: string;
  clients?: {
    id: string;
    niu: string;
    nom?: string;
    raisonsociale?: string;
    type: 'physique' | 'morale';
  };
};
