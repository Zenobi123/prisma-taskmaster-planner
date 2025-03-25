
import { toast } from "@/hooks/use-toast";

export const useCopyToClipboard = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copié",
          description: "Le message a été copié dans le presse-papiers",
          duration: 3000,
        });
      },
      (err) => {
        console.error('Erreur lors de la copie :', err);
        toast({
          title: "Erreur",
          description: "Impossible de copier le message",
          variant: "destructive",
          duration: 3000,
        });
      }
    );
  };

  return { copyToClipboard };
};
