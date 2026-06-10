// Dialog d'aperçu avant impression / téléchargement PDF (charte SPEC).
// Impression : iframe (rendu HTML fidèle). Téléchargement : html2canvas + jsPDF
// (port du downloadPDF vanilla) → PDF identique au document de référence.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Printer, FileDown, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  usePrintIframe,
  PAGE_STYLE_A4_DEFAULT,
  PAGE_STYLE_A4_COURRIER,
} from '@/lib/spec/usePrint';
import { downloadElementToPdf } from '@/lib/spec/documentExport';
import { useToast } from '@/components/ui/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: ReactNode;
  pdfFilename?: string;
  variant?: 'default' | 'courrier';
  /** Bloc @page spécifique au document (marges A4). Prioritaire sur `variant`. */
  pageStyle?: string;
  /** Déclenche automatiquement le téléchargement PDF à l'ouverture. */
  autoDownload?: boolean;
}

export default function PrintPreviewDialog({
  open,
  onOpenChange,
  title,
  children,
  pdfFilename,
  variant = 'default',
  pageStyle,
  autoDownload = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const autoDone = useRef(false);

  const resolvedPageStyle =
    pageStyle ?? (variant === 'courrier' ? PAGE_STYLE_A4_COURRIER : PAGE_STYLE_A4_DEFAULT);
  // Le nom d'impression (et donc le « Enregistrer au format PDF ») reprend le
  // nom du fichier PDF, sans l'extension.
  const documentTitle = pdfFilename ? pdfFilename.replace(/\.pdf$/i, '') : undefined;
  const print = usePrintIframe(() => ref.current, { pageStyle: resolvedPageStyle, documentTitle });

  const handleDownload = async () => {
    const node = ref.current;
    if (!node || downloading) return;
    setDownloading(true);
    try {
      await downloadElementToPdf(node, pdfFilename || 'document.pdf');
      toast({ title: 'PDF téléchargé', description: pdfFilename });
    } catch (err) {
      console.error('Erreur PDF:', err);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Échec de la génération du PDF.' });
    } finally {
      setDownloading(false);
    }
  };

  // Téléchargement automatique (action « Télécharger ») : on attend le rendu
  // complet de l'aperçu avant de lancer la capture.
  useEffect(() => {
    if (!open) {
      autoDone.current = false;
      return;
    }
    if (autoDownload && !autoDone.current) {
      autoDone.current = true;
      const t = window.setTimeout(() => {
        void handleDownload();
      }, 350);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoDownload]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[calc(100vw-2rem)] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-5 py-3 border-b flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base">{title}</DialogTitle>
          <div className="flex items-center gap-2 no-print">
            <Button size="sm" variant="outline" onClick={handleDownload} disabled={downloading}>
              {downloading ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4 mr-1" />
              )}{' '}
              PDF
            </Button>
            <Button size="sm" onClick={() => print()} style={{ backgroundColor: '#1e3a8a' }}>
              <Printer className="w-4 h-4 mr-1" /> Imprimer
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="overflow-auto bg-gray-100 p-4" style={{ maxHeight: 'calc(90vh - 60px)' }}>
          <div ref={ref} className="bg-white shadow-md mx-auto w-fit">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
