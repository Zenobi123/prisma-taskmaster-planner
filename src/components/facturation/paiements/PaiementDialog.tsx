
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePaiementForm } from "./dialog/hooks/usePaiementForm";
import { Paiement } from "@/types/paiement";
import { PaiementClientSection } from "./dialog/PaiementClientSection";
import { PaiementDateSection } from "./dialog/PaiementDateSection";
import { PaiementFactureSection } from "./dialog/PaiementFactureSection";
import { PaiementModeSection } from "./dialog/PaiementModeSection";
import { PaiementNotesSection } from "./dialog/PaiementNotesSection";
import { PaiementAmountSection } from "./dialog/PaiementAmountSection";
import { PaiementPrestationSection } from "./dialog/PaiementPrestationSection";
import { Loader2 } from "lucide-react";

interface PaiementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (paiement: Omit<Paiement, "id">) => Promise<any>;
}

const PaiementDialog = ({ open, onOpenChange, onSubmit }: PaiementDialogProps) => {
  const {
    register,
    handleSubmit,
    errors,
    onFormSubmit,
    selectedClientId,
    selectedFactureId,
    estCredit,
    selectedMode,
    typePaiement,
    selectedPrestations,
    date,
    isSubmitting,
    handleClientChange,
    handleFactureChange,
    handleDateChange,
    handleCreditChange,
    handleModeChange,
    handleTypePaiementChange,
    handlePrestationChange,
    handlePrestationAmountChange,
    prestationAmounts,
    originalPrestationAmounts
  } = usePaiementForm({ onSubmit, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Nouveau paiement</DialogTitle>
          <DialogDescription>
            Enregistrez un nouveau paiement client ou un crédit
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <PaiementClientSection
                selectedClientId={selectedClientId}
                onClientChange={handleClientChange}
              />
              
              <PaiementDateSection 
                date={date} 
                onDateChange={handleDateChange} 
              />
              
              <PaiementFactureSection
                selectedClientId={selectedClientId}
                estCredit={estCredit}
                selectedFactureId={selectedFactureId}
                typePaiement={typePaiement}
                onFactureChange={handleFactureChange}
                onTypePaiementChange={handleTypePaiementChange}
              />
              
              <PaiementModeSection
                est_credit={estCredit}
                selectedMode={selectedMode}
                onCreditChange={handleCreditChange}
                onModeChange={handleModeChange}
                register={register}
                errors={errors}
              />
              
              <PaiementAmountSection
                register={register}
                errors={errors}
              />
              
              <PaiementNotesSection
                register={register}
              />
            </div>
            
            <div>
              <PaiementPrestationSection
                selectedFactureId={selectedFactureId}
                typePaiement={typePaiement}
                selectedPrestations={selectedPrestations}
                onPrestationChange={handlePrestationChange}
                onPrestationAmountChange={handlePrestationAmountChange}
                prestationAmounts={prestationAmounts}
                originalPrestationAmounts={originalPrestationAmounts}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer le paiement'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaiementDialog;
