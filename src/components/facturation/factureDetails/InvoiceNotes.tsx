
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoiceNotesProps {
  notes: string | undefined;
}

export const InvoiceNotes = ({ notes }: InvoiceNotesProps) => {
  if (!notes) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{notes}</p>
      </CardContent>
    </Card>
  );
};
