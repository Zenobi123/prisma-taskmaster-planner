
import { Button } from "@/components/ui/button";

interface FactureDetailsFooterProps {
  onClose: () => void;
}

export const FactureDetailsFooter = ({ onClose }: FactureDetailsFooterProps) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        variant="outline"
        onClick={onClose}
        className="transition-all hover:bg-neutral-100"
      >
        Fermer
      </Button>
    </div>
  );
};
