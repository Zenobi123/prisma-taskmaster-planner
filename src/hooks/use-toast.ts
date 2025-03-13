
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

export function toast(props: ToastProps) {
  const { title, description, variant, action } = props;
  
  // Map the variant to sonner's variant
  const sonnerVariant = variant === "destructive" ? "error" : "default";
  
  return sonnerToast[sonnerVariant](title, {
    description,
    action,
  });
}

export function useToast() {
  return {
    toast,
    // For compatibility with existing code that expects this structure
    toasts: [] as any[],
  };
}
