
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { MessagePreviewProps } from "./types";

export const MessagePreview = ({ 
  isLoading, 
  messageContent, 
  onCopy 
}: MessagePreviewProps) => {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Aperçu du message</h4>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex gap-1 items-center" 
          onClick={onCopy}
        >
          <Copy className="h-3.5 w-3.5" />
          <span>Copier</span>
        </Button>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-md p-3 max-h-[250px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse text-gray-400">Chargement...</div>
          </div>
        ) : (
          <pre className="text-xs text-gray-700 whitespace-pre-wrap">
            {messageContent}
          </pre>
        )}
      </div>
    </div>
  );
};
