
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download, X } from 'lucide-react';

interface UpdateNotificationProps {
  version?: string;
  onApplyUpdate: () => void;
  onDismiss: () => void;
  isApplying: boolean;
}

export const UpdateNotification = ({ 
  version, 
  onApplyUpdate, 
  onDismiss, 
  isApplying 
}: UpdateNotificationProps) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          variant="outline"
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Mise à jour disponible
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Mise à jour disponible
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {version ? `v${version}` : 'Nouvelle version'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <CardDescription className="text-xs">
            Une nouvelle version de l'application est disponible
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              onClick={onApplyUpdate}
              disabled={isApplying}
              size="sm"
              className="flex-1"
            >
              {isApplying ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                  Application...
                </>
              ) : (
                <>
                  <Download className="w-3 h-3 mr-2" />
                  Mettre à jour
                </>
              )}
            </Button>
            <Button
              onClick={onDismiss}
              variant="outline"
              size="sm"
              disabled={isApplying}
            >
              Plus tard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
