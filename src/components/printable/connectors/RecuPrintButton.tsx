import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import type { Paiement } from '@/types/paiement';
import type { Client } from '@/types/client';
import { paiementToRecuPrintData } from '@/lib/spec/adapters';
import { useCabinetConfig } from '@/lib/spec/cabinetConfig';
import { sanitizePdfSegment } from '@/lib/spec/fiscal';
import PrintableRecu from '../PrintableRecu';
import PrintPreviewDialog from '../PrintPreviewDialog';

interface Props {
  paiement: Paiement;
  client?: Client | null;
  variant?: 'icon' | 'button';
  label?: string;
}

export default function RecuPrintButton({ paiement, client, variant = 'button', label = 'Aperçu fidèle' }: Props) {
  const [open, setOpen] = useState(false);
  const [config] = useCabinetConfig();
  const data = useMemo(() => paiementToRecuPrintData(paiement, client), [paiement, client]);
  const filename = `Recu_${sanitizePdfSegment(data.number, 'doc')}_${sanitizePdfSegment(data.client.name, 'client')}.pdf`;

  return (
    <>
      {variant === 'icon' ? (
        <Button size="icon" variant="ghost" onClick={() => setOpen(true)} title={label}>
          <Printer className="h-4 w-4" />
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="gap-2">
          <Printer className="h-4 w-4" /> {label}
        </Button>
      )}
      <PrintPreviewDialog
        open={open}
        onOpenChange={setOpen}
        title={`Aperçu — ${data.number}`}
        pdfFilename={filename}
      >
        <PrintableRecu data={data} config={config} />
      </PrintPreviewDialog>
    </>
  );
}
