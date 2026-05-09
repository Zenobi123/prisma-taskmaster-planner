import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import type { CourrierRecord } from '@/types/courrier';
import type { Client } from '@/types/client';
import { courrierToPrintData } from '@/lib/spec/adapters';
import { useCabinetConfig } from '@/lib/spec/cabinetConfig';
import { sanitizePdfSegment } from '@/lib/spec/fiscal';
import PrintableCourrier from '../PrintableCourrier';
import PrintPreviewDialog from '../PrintPreviewDialog';

interface Props {
  courrier: CourrierRecord;
  client?: Client | null;
  variant?: 'icon' | 'button';
  label?: string;
}

export default function CourrierPrintButton({ courrier, client, variant = 'icon', label = 'Imprimer' }: Props) {
  const [open, setOpen] = useState(false);
  const [config] = useCabinetConfig();
  const data = useMemo(() => courrierToPrintData(courrier, client), [courrier, client]);

  const filename = `Courrier_${sanitizePdfSegment(data.ref, 'doc')}_${sanitizePdfSegment(data.destinataire, 'destinataire')}.pdf`;

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
        title={`Aperçu — ${data.ref}`}
        pdfFilename={filename}
        variant="courrier"
      >
        <PrintableCourrier data={data} config={config} />
      </PrintPreviewDialog>
    </>
  );
}
