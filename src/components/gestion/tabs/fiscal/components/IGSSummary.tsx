
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatMontant } from "@/utils/formatUtils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { QuarterlyPayment } from "@/hooks/fiscal/types/igsTypes";

interface IGSSummaryProps {
  totalRevenue: number;
  igsClass: number;
  igsAmount: number;
  cgaReduction: boolean;
  onCgaReductionChange: (value: boolean) => void;
  quarterlyPayments: QuarterlyPayment[];
  onPaymentStatusChange: (index: number, isPaid: boolean) => void;
}

export function IGSSummary({
  totalRevenue,
  igsClass,
  igsAmount,
  cgaReduction,
  onCgaReductionChange,
  quarterlyPayments,
  onPaymentStatusChange
}: IGSSummaryProps) {
  const totalPaid = quarterlyPayments.reduce((sum, payment) => 
    sum + (payment.isPaid ? payment.amount : 0), 0
  );
  const remainingAmount = igsAmount - totalPaid;
  
  // Calculate overdue amount
  const currentDate = new Date();
  const overdueAmount = quarterlyPayments.reduce((sum, payment) => {
    const dueDate = new Date(payment.dueDate.split('/').reverse().join('-'));
    if (!payment.isPaid && dueDate < currentDate) {
      return sum + payment.amount;
    }
    return sum;
  }, 0);

  return (
    <Card className="bg-slate-50">
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-1">
          <h4 className="font-semibold">Récapitulatif IGS</h4>
          <p className="text-sm text-muted-foreground">
            Synthèse du calcul de l'IGS basé sur le chiffre d'affaires
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Chiffre d'affaires total</p>
            <p className="text-lg font-bold">{formatMontant(totalRevenue)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Classe IGS</p>
            <p className="text-lg font-bold">Classe {igsClass}</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="cga-reduction"
              checked={cgaReduction}
              onCheckedChange={onCgaReductionChange}
            />
            <Label htmlFor="cga-reduction">
              Application réduction CGA (50%)
            </Label>
          </div>
          
          <div className="bg-white p-4 rounded-md border">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium">Montant annuel IGS</p>
                <p className="text-xl font-bold text-primary">{formatMontant(igsAmount)}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Payé : </span>
                    <span className="font-medium text-green-600">{formatMontant(totalPaid)}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Reste à payer : </span>
                    <span className="font-medium text-red-600">{formatMontant(remainingAmount)}</span>
                  </p>
                  {overdueAmount > 0 && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">En retard : </span>
                      <span className="font-medium text-red-600">{formatMontant(overdueAmount)}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium mb-2">Échéances trimestrielles</p>
                <div className="space-y-2">
                  {quarterlyPayments.map((payment, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={payment.isPaid}
                          onCheckedChange={(checked) => onPaymentStatusChange(index, checked as boolean)}
                          id={`payment-${index}`}
                        />
                        <div>
                          <p className="font-medium">{payment.dueDate}</p>
                          <p className="text-sm text-muted-foreground">{formatMontant(payment.amount)}</p>
                        </div>
                      </div>
                      <Badge variant={payment.isPaid ? "success" : "destructive"}>
                        {payment.isPaid ? "Payé" : "À payer"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
