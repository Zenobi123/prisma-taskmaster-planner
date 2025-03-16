
import { CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface Obligation {
  name: string;
  deadline: string;
  daysRemaining: number;
  type: string;
}

interface UpcomingObligationsProps {
  obligations: Obligation[];
}

const UpcomingObligations = ({ obligations }: UpcomingObligationsProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <CalendarClock className="h-5 w-5 mr-2 text-amber-500" />
          Échéances fiscales à venir
        </CardTitle>
      </CardHeader>
      <CardContent>
        {obligations.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Obligation</TableHead>
                <TableHead>Date limite</TableHead>
                <TableHead>Jours restants</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {obligations.map((obligation, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{obligation.name}</TableCell>
                  <TableCell>{obligation.deadline}</TableCell>
                  <TableCell>
                    <span className={
                      obligation.daysRemaining <= 2 
                        ? "text-red-600 font-semibold" 
                        : obligation.daysRemaining <= 5 
                          ? "text-amber-600 font-semibold" 
                          : "text-blue-600"
                    }>
                      {obligation.daysRemaining} jour{obligation.daysRemaining > 1 ? 's' : ''}
                    </span>
                  </TableCell>
                  <TableCell>
                    {obligation.type === 'attestation' ? 'Expiration' : 
                    obligation.type === 'dépôt' ? 'Déclaration' : 'Paiement'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-neutral-500">
            Aucune échéance fiscale à venir
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingObligations;
