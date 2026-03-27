
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, Calendar, FileText, Award,
  Bell, Receipt, BookOpen, Info, Users, Check,
  Send, Star, ClipboardList, Briefcase, Mail,
  RefreshCw, Clock
} from "lucide-react";
import { courrierTemplates, Template } from "@/utils/courrierTemplates";

interface TemplateSelectionProps {
  selectedTemplateId: string;
  onTemplateChange: (templateId: string) => void;
  selectedTemplate?: Template;
}

type CategoryMeta = {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ElementType;
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  fiscal: {
    label: "Fiscal",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200 hover:border-orange-400",
    icon: Receipt,
  },
  relance: {
    label: "Relance",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200 hover:border-red-400",
    icon: RefreshCw,
  },
  client: {
    label: "Client",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200 hover:border-blue-400",
    icon: Users,
  },
  information: {
    label: "Information",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200 hover:border-purple-400",
    icon: Info,
  },
  convocation: {
    label: "Convocation",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200 hover:border-green-400",
    icon: Calendar,
  },
};

const TEMPLATE_ICONS: Record<string, React.ElementType> = {
  rappel_obligations: AlertTriangle,
  rappel_igs: Receipt,
  rappel_patente: BookOpen,
  rappel_declaration_annuelle: ClipboardList,
  transmission_documents_fiscaux: FileText,
  mise_a_jour_regime_fiscal: RefreshCw,
  relance_facture_impayee: Bell,
  relance_documents_manquants: Briefcase,
  relance_rendez_vous: Clock,
  relance_mise_en_demeure: AlertTriangle,
  felicitations_creation: Award,
  bienvenue_nouveau_client: Star,
  confirmation_mission: Check,
  fin_mission: Mail,
  nouvelle_reglementation: Info,
  info_loi_finances: BookOpen,
  info_controle_fiscal: AlertTriangle,
  info_cga: FileText,
  convocation_rdv: Calendar,
  convocation_assemblee: Users,
  convocation_formation: Send,
};

const CATEGORIES = ["fiscal", "relance", "client", "information", "convocation"] as const;

const TemplateSelection = ({ selectedTemplateId, onTemplateChange }: TemplateSelectionProps) => {
  return (
    <div className="space-y-4">
      {CATEGORIES.map(cat => {
        const meta = CATEGORY_META[cat];
        const CatIcon = meta.icon;
        const templates = courrierTemplates.filter(t => t.category === cat);
        if (!templates.length) return null;

        return (
          <div key={cat}>
            <div className="flex items-center gap-1.5 mb-2">
              <CatIcon className={`w-3 h-3 ${meta.color}`} />
              <span className={`text-xs font-semibold uppercase tracking-wide ${meta.color}`}>
                {meta.label}
              </span>
              <Badge variant="secondary" className="text-xs px-1.5 py-0 ml-1 h-4">
                {templates.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pl-1">
              {templates.map(template => {
                const Icon = TEMPLATE_ICONS[template.id] || FileText;
                const isSelected = selectedTemplateId === template.id;
                return (
                  <Button
                    key={template.id}
                    variant="outline"
                    className={`h-auto p-2.5 justify-start relative transition-all duration-150 ${
                      isSelected
                        ? "border-[#84A98C] bg-[#84A98C]/5 shadow-sm"
                        : `${meta.border} bg-white`
                    }`}
                    onClick={() => onTemplateChange(template.id)}
                  >
                    <div className="flex items-start gap-2 w-full text-left">
                      <div className={`p-1.5 rounded-md ${meta.bg} ${meta.color} relative flex-shrink-0`}>
                        <Icon className="w-3 h-3" />
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#84A98C] rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-xs leading-tight ${isSelected ? "text-[#84A98C]" : "text-gray-800"}`}>
                          {template.title}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TemplateSelection;
