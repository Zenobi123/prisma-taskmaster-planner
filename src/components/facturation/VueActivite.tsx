
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, BarChart2, Users, CreditCard, ClipboardList, AlertTriangle } from "lucide-react";
import { useVueActivite } from "@/hooks/facturation/useVueActivite";
import ActiviteKPIs from "./activite/ActiviteKPIs";
import SyntheseGlobale from "./activite/SyntheseGlobale";
import SituationPaiements from "./activite/SituationPaiements";
import SuiviPrestations from "./activite/SuiviPrestations";
import ResteAFaire from "./activite/ResteAFaire";

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

const SectionCard = ({
  title,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}) => (
  <Card className="shadow-sm border border-gray-200">
    <CardHeader className={`pb-2 border-b ${color} rounded-t-lg`}>
      <CardTitle className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="w-4 h-4" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-3">{children}</CardContent>
  </Card>
);

const VueActivite = () => {
  const [year, setYear] = useState(currentYear);
  const { data, isLoading, error, refresh } = useVueActivite(year);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Exercice</span>
          <Select value={String(year)} onValueChange={v => setYear(Number(v))}>
            <SelectTrigger className="w-28 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map(y => (
                <SelectItem key={y} value={String(y)} className="text-sm">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={refresh}
          className="h-8 text-xs gap-1.5"
          disabled={isLoading}
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
          Erreur : {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#84A98C]" />
        </div>
      ) : data ? (
        <>
          {/* KPIs */}
          <ActiviteKPIs data={data} />

          {/* Section 1 – Synthèse globale */}
          <SectionCard
            title="1 — Synthèse globale"
            icon={BarChart2}
            color="bg-blue-50 text-blue-800"
          >
            <SyntheseGlobale rows={data.clientsRows} />
          </SectionCard>

          {/* Section 2 – Situation des paiements */}
          <SectionCard
            title="2 — Situation des paiements"
            icon={CreditCard}
            color="bg-green-50 text-green-800"
          >
            <SituationPaiements
              clientsRows={data.clientsRows}
              recusRows={data.recusRows}
              totalPaye={data.totalPaye}
              totalReste={data.totalReste}
              tauxRecouvrement={data.tauxRecouvrement}
            />
          </SectionCard>

          {/* Section 3 – Suivi des prestations */}
          <SectionCard
            title="3 — Suivi des prestations"
            icon={ClipboardList}
            color="bg-purple-50 text-purple-800"
          >
            <SuiviPrestations
              rows={data.prestationsRows}
              totalPrestations={data.totalPrestations}
              prestationsEffectuees={data.prestationsEffectuees}
            />
          </SectionCard>

          {/* Section 4 – Reste à faire */}
          <SectionCard
            title="4 — Reste à faire"
            icon={AlertTriangle}
            color="bg-red-50 text-red-800"
          >
            <ResteAFaire
              impotsImpayes={data.impotsImpayes}
              honorairesImpayes={data.honorairesImpayes}
              prestationsNonRealisees={data.prestationsNonRealisees}
            />
          </SectionCard>
        </>
      ) : null}
    </div>
  );
};

export default VueActivite;
