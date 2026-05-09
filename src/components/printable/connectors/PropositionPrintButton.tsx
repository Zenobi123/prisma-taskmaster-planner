import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import type { Proposition } from '@/types/proposition';
import type { Client } from '@/types/client';
import { propositionToPrintData } from '@/lib/spec/adapters';
import { useCabinetConfig } from '@/lib/spec/cabinetConfig';
import { sanitizePdfSegment } from '@/lib/spec/fiscal';
import PrintableProposition from '../PrintableProposition';
import PrintPreviewDialog from '../PrintPreviewDialog';

interface Props {
  proposition: Proposition;
  client?: Client | null;
  variant?: 'icon' | 'button';
  label?: string;
}

export default function PropositionPrintButton({
  proposition,
  client,
  variant = 'icon',
  label = 'Imprimer',
}: Props) {
  const [open, setOpen] = useState(false);
  const [config] = useCabinetConfig();
  const data = useMemo(() => propositionToPrintData(proposition, client), [proposition, client]);
  const filename = `Proposition_${sanitizePdfSegment(proposition.numero, 'doc')}_${sanitizePdfSegment(data.client.name, 'client')}.pdf`;

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
        title={`Aperçu — ${proposition.numero}`}
        pdfFilename={filename}
      >
        <PrintableProposition data={data} config={config} />
      </PrintPreviewDialog>
    </>
  );
}
