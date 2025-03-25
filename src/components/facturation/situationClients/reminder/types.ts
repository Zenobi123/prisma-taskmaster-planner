
export interface ReminderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvoiceId: string | null;
  onSendReminder: (method: 'email' | 'sms' | 'both') => Promise<void>;
}

export interface InvoiceDetails {
  id: string;
  montant: number;
  montant_paye: number;
  montant_restant: number;
  echeance: string;
  client: {
    nom: string;
    telephone: string;
    email: string;
  };
}

export interface MethodSelectorProps {
  selectedReminderMethod: 'email' | 'sms' | 'both';
  onMethodChange: (value: 'email' | 'sms' | 'both') => void;
}

export interface MessagePreviewProps {
  isLoading: boolean;
  messageContent: string;
  onCopy: () => void;
}
