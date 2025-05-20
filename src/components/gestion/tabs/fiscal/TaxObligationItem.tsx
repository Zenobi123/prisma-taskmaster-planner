import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, CircleX, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AttachmentSection } from "./declaration/AttachmentSection";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { PaymentDetailsSection } from "./components/PaymentDetailsSection";
import { ObservationsSection } from "./components/ObservationsSection";

interface TaxObligationItemProps {
  obligationName: string;
  title: string;
  status: TaxObligationStatus;
  onStatusChange: (obligation: string, field: string, value: string | number | boolean | undefined) => void;
  onAttachmentUpload: (obligation: string, attachmentType: string, filePath: string) => void;
}

export const TaxObligationItem: React.FC<TaxObligationItemProps> = ({
  obligationName,
  title,
  status,
  onStatusChange,
  onAttachmentUpload,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleStatusChange = (field: string, value: string | number | boolean | undefined) => {
    onStatusChange(obligationName, field, value);
  };

  const dateEcheanceFormatted = status.dateEcheance
    ? new Date(status.dateEcheance).toLocaleDateString()
    : "Non renseignée";

  const datePaiementFormatted = status.datePaiement
    ? new Date(status.datePaiement).toLocaleDateString()
    : "Non renseignée";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          {title}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Assujetti</span>
            <Switch
              checked={status.assujetti}
              onCheckedChange={(checked) => handleStatusChange("assujetti", checked)}
            />
          </div>
        </CardTitle>
        <CardDescription>
          {status.assujetti ? (
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor={`${obligationName}-payee`} className="text-sm">
                  Payée
                </Label>
                <Switch
                  id={`${obligationName}-payee`}
                  checked={status.payee}
                  onCheckedChange={(checked) => handleStatusChange("payee", checked)}
                />
                {status.payee ? (
                  <CheckCircle className="text-green-500 h-4 w-4" />
                ) : (
                  <CircleX className="text-red-500 h-4 w-4" />
                )}
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`${obligationName}-dateEcheance`}>Date d'échéance</Label>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !status.dateEcheance && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateEcheanceFormatted}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={status.dateEcheance ? new Date(status.dateEcheance) : undefined}
                          onSelect={(date) => {
                            handleStatusChange("dateEcheance", date?.toISOString());
                            setIsCalendarOpen(false);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor={`${obligationName}-datePaiement`}>Date de règlement</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !status.datePaiement && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {datePaiementFormatted}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={status.datePaiement ? new Date(status.datePaiement) : undefined}
                          onSelect={(date) => {
                            handleStatusChange("datePaiement", date?.toISOString());
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`${obligationName}-montant`} className="flex items-center">
                      Montant
                      <Coins className="h-3 w-3 ml-1" />
                    </Label>
                    <Input
                      type="number"
                      id={`${obligationName}-montant`}
                      value={status.montant?.toString() || ""}
                      onChange={(e) =>
                        handleStatusChange("montant", parseFloat(e.target.value))
                      }
                      placeholder="Montant à payer"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${obligationName}-montantPenalite`} className="flex items-center">
                      Pénalités
                      <Coins className="h-3 w-3 ml-1" />
                    </Label>
                    <Input
                      type="number"
                      id={`${obligationName}-montantPenalite`}
                      value={status.montantPenalite?.toString() || ""}
                      onChange={(e) =>
                        handleStatusChange("montantPenalite", parseFloat(e.target.value))
                      }
                      placeholder="Montant des pénalités"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`${obligationName}-montantTotal`} className="flex items-center">
                    Montant total
                    <Coins className="h-3 w-3 ml-1" />
                  </Label>
                  <Input
                    type="number"
                    id={`${obligationName}-montantTotal`}
                    value={status.montantTotal?.toString() || ""}
                    onChange={(e) =>
                      handleStatusChange("montantTotal", parseFloat(e.target.value))
                    }
                    placeholder="Montant total à payer"
                  />
                </div>
              </div>

              <PaymentDetailsSection
                status={status}
                obligationName={obligationName}
                onStatusChange={handleStatusChange}
              />

              <ObservationsSection
                status={status}
                obligationName={obligationName}
                onStatusChange={handleStatusChange}
              />

              <AttachmentSection
                obligationName={obligationName}
                onAttachmentUpload={onAttachmentUpload}
              />
            </div>
          ) : (
            <p className="text-muted-foreground">Non assujetti à cette obligation.</p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};
