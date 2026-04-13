import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2, Archive, RefreshCw, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmVariant = "danger" | "warning" | "info";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  icon?: LucideIcon;
  isLoading?: boolean;
}

const variantStyles: Record<ConfirmVariant, { icon: LucideIcon; iconClass: string; buttonClass: string; bgClass: string }> = {
  danger: {
    icon: Trash2,
    iconClass: "text-red-500",
    buttonClass: "bg-red-600 hover:bg-red-700 text-white border-none",
    bgClass: "bg-red-50 dark:bg-red-950/30",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    buttonClass: "bg-amber-600 hover:bg-amber-700 text-white border-none",
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
  },
  info: {
    icon: RefreshCw,
    iconClass: "text-primary",
    buttonClass: "bg-primary hover:bg-primary/90 text-primary-foreground border-none",
    bgClass: "bg-primary/5",
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "danger",
  icon,
  isLoading = false,
}: ConfirmDialogProps) {
  const styles = variantStyles[variant];
  const Icon = icon || styles.icon;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="gap-4">
          <div className={cn("mx-auto flex h-14 w-14 items-center justify-center rounded-full", styles.bgClass)}>
            <Icon className={cn("h-7 w-7", styles.iconClass)} />
          </div>
          <AlertDialogTitle className="text-center text-lg">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-sm leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 flex-row gap-3 sm:justify-center border-none pt-2">
          <AlertDialogCancel
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:min-w-[120px]"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={cn("flex-1 sm:flex-none sm:min-w-[120px]", styles.buttonClass)}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                En cours...
              </span>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
