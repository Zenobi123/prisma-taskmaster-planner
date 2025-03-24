
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
import { Loader2, Receipt } from "lucide-react";

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
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Receipt size={20} className="text-primary" />
            Nouveau paiement
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Enregistrez un nouveau paiement client ou un crédit
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Informations principales</h3>
              
              <PaiementClientSection
                selectedClientId={selectedClientId}
                estCredit={estCredit}
                onClientChange={handleClientChange}
                onCreditChange={handleCreditChange}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <PaiementDateSection 
                  date={date} 
                  onDateChange={handleDateChange} 
                />
                
                <PaiementAmountSection
                  register={register}
                  errors={errors}
                />
              </div>
              
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
              
              <PaiementNotesSection
                register={register}
              />
            </div>
            
            <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Détails du paiement</h3>
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

          <DialogFooter className="pt-4 border-t border-gray-100 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-gray-300 text-gray-700"
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-hover transition-colors"
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
