
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FactureInfoCardsProps {
  invoiceDate: string;
  dueDate: string;
  paymentMethod: string | undefined;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
}

export const FactureInfoCards = ({
  invoiceDate,
  dueDate,
  paymentMethod,
  clientName,
  clientEmail,
  clientPhone,
  clientAddress
}: FactureInfoCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations de la facture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date d'émission:</span>
            <span>{invoiceDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date d'échéance:</span>
            <span>{dueDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mode de règlement:</span>
            <span>{paymentMethod || "Non spécifié"}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Client</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nom:</span>
            <span>{clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span>{clientEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Téléphone:</span>
            <span>{clientPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Adresse:</span>
            <span>{clientAddress}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
