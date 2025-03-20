
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FactureNotesProps {
  notes?: string;
}

export function FactureNotes({ notes }: FactureNotesProps) {
  if (!notes) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{notes}</p>
      </CardContent>
    </Card>
  );
}
