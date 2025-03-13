
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right"
      toastOptions={{
        classNames: {
          error: "bg-red-50 border-red-500 text-red-900",
          success: "bg-green-50 border-green-500 text-green-900",
          info: "bg-blue-50 border-blue-500 text-blue-900",
          warning: "bg-amber-50 border-amber-500 text-amber-900",
        },
        style: {
          border: "1px solid",
          padding: "16px",
          borderRadius: "6px",
        }
      }}
    />
  );
}
