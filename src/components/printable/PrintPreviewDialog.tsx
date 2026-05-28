// Dialog d'aperçu avant impression / téléchargement PDF (charte SPEC).
import { useRef, type ReactNode } from 'react';
import { Printer, FileDown, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  usePrintIframe,
  PAGE_STYLE_A4_DEFAULT,
  PAGE_STYLE_A4_COURRIER,
} from '@/lib/spec/usePrint';
import { exportNodeToPdf } from '@/lib/spec/pdfExport';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: ReactNode;
  pdfFilename?: string;
  variant?: 'default' | 'courrier';
}

export default function PrintPreviewDialog({
  open,
  onOpenChange,
  title,
  children,
  pdfFilename,
  variant = 'default',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const pageStyle = variant === 'courrier' ? PAGE_STYLE_A4_COURRIER : PAGE_STYLE_A4_DEFAULT;
  // Le nom d'impression (et donc le « Enregistrer au format PDF ») reprend le
  // nom du fichier PDF, sans l'extension.
  const documentTitle = pdfFilename ? pdfFilename.replace(/\.pdf$/i, '') : undefined;
  const print = usePrintIframe(() => ref.current, { pageStyle, documentTitle });

  const handleDownload = async () => {
    const node = ref.current;
    if (!node) return;
    await exportNodeToPdf(node, pdfFilename || 'document.pdf');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[calc(100vw-2rem)] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-5 py-3 border-b flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base">{title}</DialogTitle>
          <div className="flex items-center gap-2 no-print">
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <FileDown className="w-4 h-4 mr-1" /> PDF
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
          <div ref={ref} className="bg-white shadow-md">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
