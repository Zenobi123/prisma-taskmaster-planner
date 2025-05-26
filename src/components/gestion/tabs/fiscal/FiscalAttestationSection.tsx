
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface FiscalAttestationSectionProps {
  creationDate: string;
  validityEndDate: string;
  setCreationDate: (date: string) => void;
  handleSave: () => Promise<void>;
  showInAlert?: boolean;
  onToggleAlert?: () => void;
  hiddenFromDashboard?: boolean;
  onToggleDashboardVisibility?: () => void;
}

export function FiscalAttestationSection({ 
  creationDate, 
  validityEndDate, 
  setCreationDate, 
  handleSave,
  showInAlert = true,
  onToggleAlert,
  hiddenFromDashboard = false,
  onToggleDashboardVisibility
}: FiscalAttestationSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await handleSave();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to validate date format (DD/MM/YYYY)
  const isValidDateFormat = (date: string): boolean => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(date);
  };

  const isDateInvalid = creationDate && !isValidDateFormat(creationDate);

  return (
    <Card className="border-[#E8FDF5] bg-[#F4FEFA]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-[#336755]">
          Attestation de Conformité Fiscale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="creationDate" className="text-[#336755]">
              Date de délivrance
            </Label>
            <div className="relative">
              <Input
                id="creationDate"
                placeholder="JJ/MM/AAAA"
                value={creationDate}
                onChange={(e) => setCreationDate(e.target.value)}
                className={`pl-10 ${isDateInvalid ? 'border-red-500' : 'border-[#A8C1AE]'}`}
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-[#84A98C]" />
            </div>
            {isDateInvalid && (
              <p className="text-red-500 text-xs mt-1">
                Format invalide. Utilisez JJ/MM/AAAA
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="validityEndDate" className="text-[#336755]">
              Date d'expiration
            </Label>
            <div className="relative">
              <Input
                id="validityEndDate"
                placeholder="JJ/MM/AAAA"
                value={validityEndDate}
                readOnly
                className="pl-10 bg-[#E8FDF5] border-[#A8C1AE]"
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-[#84A98C]" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Switch 
            id="show-alerts" 
            checked={showInAlert} 
            onCheckedChange={onToggleAlert}
          />
          <Label htmlFor="show-alerts" className="text-[#336755]">
            Afficher les alertes d'expiration
          </Label>
        </div>

        <div className="flex items-center space-x-2 mt-2">
          <Switch 
            id="hide-dashboard" 
            checked={hiddenFromDashboard} 
            onCheckedChange={onToggleDashboardVisibility}
          />
          <Label htmlFor="hide-dashboard" className="text-[#336755]">
            Masquer du tableau de bord
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || isDateInvalid}
          className="bg-[#84A98C] hover:bg-[#5E8C61] text-white"
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </CardFooter>
    </Card>
  );
}
