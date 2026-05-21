import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import type { Devis } from '@/types/devis';
import type { Client } from '@/types/client';
import { devisToPrintData } from '@/lib/spec/adapters';
import { useCabinetConfig } from '@/lib/spec/cabinetConfig';
import { sanitizePdfSegment } from '@/lib/spec/fiscal';
import PrintableDevis from '../PrintableDevis';
import PrintPreviewDialog from '../PrintPreviewDialog';
import { useResolvedClient } from './useResolvedClient';

interface Props {
  devis: Devis;
  client?: Client | null;
  variant?: 'icon' | 'button';
  label?: string;
}

export default function DevisPrintButton({ devis, client, variant = 'icon', label = 'Imprimer' }: Props) {
  const [open, setOpen] = useState(false);
  const [config] = useCabinetConfig();
  const resolvedClient = useResolvedClient(devis.client_id, client);
  const data = useMemo(() => devisToPrintData(devis, resolvedClient), [devis, resolvedClient]);

  const filename = `Devis_${sanitizePdfSegment(data.number, 'doc')}_${sanitizePdfSegment(data.client.name, 'client')}.pdf`;

  return (
    <>
      {variant === 'icon' ? (
        <Button size="icon" variant="ghost" onClick={() => setOpen(true)} title={label}>
          <Printer className="h-4 w-4" />
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          <Printer className="h-4 w-4 mr-1" /> {label}
        </Button>
      )}
      <PrintPreviewDialog
        open={open}
        onOpenChange={setOpen}
        title={`Aperçu — ${data.number}`}
        pdfFilename={filename}
      >
        <PrintableDevis data={data} config={config} />
      </PrintPreviewDialog>
    </>
  );
}
