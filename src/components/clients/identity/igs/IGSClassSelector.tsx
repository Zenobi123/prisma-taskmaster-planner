
import { CGAClasse } from "@/types/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

export const igsClassesInfo: Record<CGAClasse, { label: string; montant: number }> = {
  classe1: { label: "Classe 1 (< 500 000 FCFA)", montant: 62000 },
  classe2: { label: "Classe 2 (500 000 - 999 999 FCFA)", montant: 98000 },
  classe3: { label: "Classe 3 (1 000 000 - 1 499 999 FCFA)", montant: 172000 },
  classe4: { label: "Classe 4 (1 500 000 - 1 999 999 FCFA)", montant: 276000 },
  classe5: { label: "Classe 5 (2 000 000 - 2 499 999 FCFA)", montant: 375000 },
  classe6: { label: "Classe 6 (2 500 000 - 4 999 999 FCFA)", montant: 518000 },
  classe7: { label: "Classe 7 (5 000 000 - 9 999 999 FCFA)", montant: 998000 },
  classe8: { label: "Classe 8 (10 000 000 - 19 999 999 FCFA)", montant: 1398000 },
  classe9: { label: "Classe 9 (20 000 000 - 29 999 999 FCFA)", montant: 1798000 },
  classe10: { label: "Classe 10 (30 000 000 - 50 000 000 FCFA)", montant: 2198000 }
};

interface IGSClassSelectorProps {
  classeIGS?: CGAClasse;
  onChange: (value: CGAClasse) => void;
}

export function IGSClassSelector({ classeIGS, onChange }: IGSClassSelectorProps) {
  const form = useForm({
    defaultValues: {
      classeIGS: classeIGS || "classe1"
    }
  });

  const handleChange = (value: CGAClasse) => {
    onChange(value);
  };

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="classeIGS"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Classe IGS</FormLabel>
            <FormControl>
              <Select
                value={classeIGS || field.value}
                onValueChange={(value) => handleChange(value as CGAClasse)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une classe IGS" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(igsClassesInfo).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
}
