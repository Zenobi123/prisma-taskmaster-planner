// Bouton "Imprimer" prêt à l'emploi pour une Facture (type existant).
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import type { Facture } from '@/types/facture';
import type { Client } from '@/types/client';
import { factureToPrintData } from '@/lib/spec/adapters';
import { useCabinetConfig } from '@/lib/spec/cabinetConfig';
import { PAGE_STYLE_FACTURE } from '@/lib/spec/printStyles';
import { sanitizePdfSegment } from '@/lib/spec/fiscal';
import PrintableFacture from '../PrintableFacture';
import PrintPreviewDialog from '../PrintPreviewDialog';
import { useResolvedClient } from './useResolvedClient';

interface Props {
  facture: Facture;
  client?: Client | null;
  variant?: 'icon' | 'button' | 'menuitem';
  label?: string;
}

export default function FacturePrintButton({ facture, client, variant = 'icon', label = 'Imprimer' }: Props) {
  const [open, setOpen] = useState(false);
  const [config] = useCabinetConfig();
  const resolvedClient = useResolvedClient(facture.client_id, client);
  const data = useMemo(() => factureToPrintData(facture, resolvedClient), [facture, resolvedClient]);

  const filename = `Facture_${sanitizePdfSegment(data.number, 'doc')}_${sanitizePdfSegment(data.client.name, 'client')}.pdf`;

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
        pageStyle={PAGE_STYLE_FACTURE}
      >
        <PrintableFacture data={data} config={config} />
      </PrintPreviewDialog>
    </>
  );
}
