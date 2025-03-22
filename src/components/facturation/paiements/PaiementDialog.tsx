
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Paiement } from "@/types/paiement";
import { PaiementClientSection } from "./dialog/PaiementClientSection";
import { PaiementFactureSection } from "./dialog/PaiementFactureSection";
import { PaiementPrestationSection } from "./dialog/PaiementPrestationSection";
import { PaiementDateSection } from "./dialog/PaiementDateSection";
import { PaiementAmountSection } from "./dialog/PaiementAmountSection";
import { PaiementModeSection } from "./dialog/PaiementModeSection";
import { PaiementNotesSection } from "./dialog/PaiementNotesSection";
import { usePaiementDialogForm } from "./dialog/usePaiementDialogForm";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    handlePrestationChange
  } = usePaiementDialogForm({ onSubmit, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader className="pb-2">
          <DialogTitle>Nouveau Paiement</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Enregistrer un nouveau paiement
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 px-1">
              {/* Left Column */}
              <div className="space-y-2">
                {/* Client and Credit Selection */}
                <PaiementClientSection
                  selectedClientId={selectedClientId}
                  estCredit={estCredit}
                  onClientChange={handleClientChange}
                  onCreditChange={handleCreditChange}
                />

                {/* Facture Selection and Payment Type */}
                <PaiementFactureSection
                  selectedClientId={selectedClientId}
                  estCredit={estCredit}
                  selectedFactureId={selectedFactureId}
                  typePaiement={typePaiement}
                  onFactureChange={handleFactureChange}
                  onTypePaiementChange={handleTypePaiementChange}
                />

                {/* Date Selection */}
                <PaiementDateSection
                  date={date}
                  onDateChange={handleDateChange}
                />

                {/* Amount Input */}
                <PaiementAmountSection
                  register={register}
                  errors={errors}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-2">
                {/* Payment Mode */}
                <PaiementModeSection
                  selectedMode={selectedMode}
                  onModeChange={handleModeChange}
                  register={register}
                />

                {/* Notes */}
                <PaiementNotesSection
                  register={register}
                />

                {/* Prestations Selection - Full width at the bottom */}
                <div className="md:col-span-2">
                  <PaiementPrestationSection
                    selectedFactureId={selectedFactureId}
                    estCredit={estCredit}
                    typePaiement={typePaiement}
                    selectedPrestations={selectedPrestations}
                    onPrestationChange={handlePrestationChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4 pb-0 pt-2 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-8 text-xs">
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="h-8 text-xs">
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PaiementDialog;
