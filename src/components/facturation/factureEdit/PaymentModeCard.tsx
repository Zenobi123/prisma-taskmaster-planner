
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface PaymentModeCardProps {
  form: UseFormReturn<{
    date: string;
    echeance: string;
    prestations: any[];
    notes: string;
    mode_reglement: string;
  }>;
}

export const PaymentModeCard = ({ form }: PaymentModeCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conditions de règlement</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="mode_reglement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mode de règlement</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un mode de règlement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="especes">Espèces</SelectItem>
                  <SelectItem value="cheque">Chèque</SelectItem>
                  <SelectItem value="virement">Virement bancaire</SelectItem>
                  <SelectItem value="carte">Carte bancaire</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
