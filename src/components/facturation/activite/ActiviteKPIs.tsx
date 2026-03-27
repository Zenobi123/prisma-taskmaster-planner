
import { ActiviteData } from "@/hooks/facturation/useVueActivite";
import { Users, TrendingUp, Receipt, DollarSign, CheckCircle, Clock, BarChart2, Percent } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(Math.round(n));

interface KPICardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  border: string;
}

const KPICard = ({ label, value, icon: Icon, color, border }: KPICardProps) => (
  <div className={`bg-white rounded-lg border-l-4 ${border} p-4 shadow-sm`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className={`text-lg font-bold mt-1 ${color}`}>{value}</p>
      </div>
      <Icon className={`w-8 h-8 opacity-20 ${color}`} />
    </div>
  </div>
);

interface Props {
  data: ActiviteData;
}

const ActiviteKPIs = ({ data }: Props) => {
  const kpis: KPICardProps[] = [
    {
      label: "Clients actifs",
      value: String(data.nbClientsActifs),
      icon: Users,
      color: "text-gray-700",
      border: "border-gray-400",
    },
    {
      label: "CA Total facturé",
      value: `${fmt(data.totalCA)} FCFA`,
      icon: TrendingUp,
      color: "text-blue-700",
      border: "border-blue-400",
    },
    {
      label: "Impôts & taxes",
      value: `${fmt(data.totalImpots)} FCFA`,
      icon: Receipt,
      color: "text-red-700",
      border: "border-red-400",
    },
    {
      label: "Honoraires",
      value: `${fmt(data.totalHonoraires)} FCFA`,
      icon: DollarSign,
      color: "text-green-700",
      border: "border-green-400",
    },
    {
      label: "Paiements reçus",
      value: `${fmt(data.totalPaye)} FCFA`,
      icon: CheckCircle,
      color: "text-emerald-700",
      border: "border-emerald-400",
    },
    {
      label: "Reste à payer",
      value: `${fmt(data.totalReste)} FCFA`,
      icon: Clock,
      color: "text-orange-700",
      border: "border-orange-400",
    },
    {
      label: "Prestations effectuées",
      value: `${data.prestationsEffectuees} / ${data.totalPrestations}`,
      icon: BarChart2,
      color: "text-teal-700",
      border: "border-teal-400",
    },
    {
      label: "Taux de recouvrement",
      value: `${data.tauxRecouvrement.toFixed(1)}%`,
      icon: Percent,
      color: "text-indigo-700",
      border: "border-indigo-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {kpis.map(kpi => (
        <KPICard key={kpi.label} {...kpi} />
      ))}
    </div>
  );
};

export default ActiviteKPIs;
