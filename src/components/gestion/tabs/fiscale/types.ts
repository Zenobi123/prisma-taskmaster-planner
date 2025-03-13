
export type FiscalDocument = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  validUntil: Date | null;
  client_id?: string;
};

export type AddDocumentDialogProps = {
  onAddDocument: (document: Omit<FiscalDocument, "id">) => void;
  clientId?: string;
};

// Type pour l'affichage dans le tableau de bord
export type FiscalDocumentDisplay = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  valid_until: string | null;
  client_id: string;
  clients?: {
    id: string;
    niu: string;
    nom?: string | null;
    raisonsociale?: string | null;
    type: 'physique' | 'morale';
  };
};
