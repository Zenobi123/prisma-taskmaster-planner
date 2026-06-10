// Provider global d'aperçu de documents (facture, reçu) — point d'entrée UNIQUE
// et fidèle pour « Voir » / « Télécharger ». Tous les call-sites passent par ici
// via les hooks useInvoicePreview / useReceiptPreview → un seul rendu identique
// au vanilla, fini les divergences jsPDF.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Facture } from '@/types/facture';
import type { Paiement } from '@/types/paiement';
import { useCabinetConfig } from '@/lib/spec/cabinetConfig';
import { factureToPrintData, paiementToRecuPrintData } from '@/lib/spec/adapters';
import { sanitizePdfSegment } from '@/lib/spec/fiscal';
import { PAGE_STYLE_FACTURE, PAGE_STYLE_RECU } from '@/lib/spec/printStyles';
import PrintPreviewDialog from './PrintPreviewDialog';
import PrintableFacture from './PrintableFacture';
import PrintableRecu from './PrintableRecu';
import { useResolvedClient } from './connectors/useResolvedClient';
import { useResolvedFacture } from './connectors/useResolvedFacture';

type Mode = 'view' | 'download';
type State =
  | { kind: 'facture'; facture: Facture; mode: Mode }
  | { kind: 'recu'; paiement: Paiement; mode: Mode }
  | null;

interface DocumentPreviewApi {
  previewFacture: (facture: Facture) => void;
  downloadFacture: (facture: Facture) => void;
  previewRecu: (paiement: Paiement) => void;
  downloadRecu: (paiement: Paiement) => void;
}

const DocumentPreviewContext = createContext<DocumentPreviewApi | null>(null);

export function useDocumentPreview(): DocumentPreviewApi {
  const ctx = useContext(DocumentPreviewContext);
  if (!ctx) {
    throw new Error('useDocumentPreview doit être utilisé dans <DocumentPreviewProvider>');
  }
  return ctx;
}

export function DocumentPreviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(null);
  const close = useCallback(() => setState(null), []);

  const api = useMemo<DocumentPreviewApi>(
    () => ({
      previewFacture: (facture) => setState({ kind: 'facture', facture, mode: 'view' }),
      downloadFacture: (facture) => setState({ kind: 'facture', facture, mode: 'download' }),
      previewRecu: (paiement) => setState({ kind: 'recu', paiement, mode: 'view' }),
      downloadRecu: (paiement) => setState({ kind: 'recu', paiement, mode: 'download' }),
    }),
    [],
  );

  return (
    <DocumentPreviewContext.Provider value={api}>
      {children}
      {state?.kind === 'facture' && (
        <FacturePreviewHost facture={state.facture} mode={state.mode} onClose={close} />
      )}
      {state?.kind === 'recu' && (
        <RecuPreviewHost paiement={state.paiement} mode={state.mode} onClose={close} />
      )}
    </DocumentPreviewContext.Provider>
  );
}

function FacturePreviewHost({
  facture,
  mode,
  onClose,
}: {
  facture: Facture;
  mode: Mode;
  onClose: () => void;
}) {
  const [config] = useCabinetConfig();
  const resolvedClient = useResolvedClient(facture.client_id);
  const data = useMemo(() => factureToPrintData(facture, resolvedClient), [facture, resolvedClient]);
  const filename = `Facture_${sanitizePdfSegment(data.number, 'doc')}_${sanitizePdfSegment(
    data.client.name,
    'client',
  )}.pdf`;

  return (
    <PrintPreviewDialog
      open
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
      title={`Aperçu — ${data.number}`}
      pdfFilename={filename}
      pageStyle={PAGE_STYLE_FACTURE}
      autoDownload={mode === 'download'}
    >
      <PrintableFacture data={data} config={config} />
    </PrintPreviewDialog>
  );
}

function RecuPreviewHost({
  paiement,
  mode,
  onClose,
}: {
  paiement: Paiement;
  mode: Mode;
  onClose: () => void;
}) {
  const [config] = useCabinetConfig();
  const resolvedClient = useResolvedClient(paiement.client_id);
  const factureRef = paiement.facture as string | { id?: string } | undefined;
  const factureId = typeof factureRef === 'string' ? factureRef : factureRef?.id;
  const resolvedFacture = useResolvedFacture(paiement.est_credit ? undefined : factureId);
  const data = useMemo(
    () => paiementToRecuPrintData(paiement, resolvedClient, resolvedFacture),
    [paiement, resolvedClient, resolvedFacture],
  );
  const filename = `Recu_${sanitizePdfSegment(data.number, 'doc')}_${sanitizePdfSegment(
    data.client.name,
    'client',
  )}.pdf`;

  return (
    <PrintPreviewDialog
      open
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
      title={`Aperçu — ${data.number}`}
      pdfFilename={filename}
      pageStyle={PAGE_STYLE_RECU}
      autoDownload={mode === 'download'}
    >
      <PrintableRecu data={data} config={config} />
    </PrintPreviewDialog>
  );
}
