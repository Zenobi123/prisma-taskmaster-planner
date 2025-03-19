
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

interface NotesCardProps {
  form: UseFormReturn<{
    date: string;
    echeance: string;
    prestations: any[];
    notes: string;
    mode_reglement: string;
  }>;
  loading: boolean;
  prestationsLength: number;
}

export const NotesCard = ({ form, loading, prestationsLength }: NotesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Informations complémentaires (facultatif)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" disabled={loading || prestationsLength === 0}>
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </CardFooter>
    </Card>
  );
};
