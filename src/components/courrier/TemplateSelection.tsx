
import { Button } from "@/components/ui/button";
import { FileText, Calendar, AlertTriangle, Award, Check } from "lucide-react";
import { Template } from "@/utils/courrierTemplates";

interface TemplateSelectionProps {
  selectedTemplateId: string;
  onTemplateChange: (templateId: string) => void;
  selectedTemplate?: Template;
}

const templates = [
  {
    id: "rappel_obligations",
    title: "Rappel d'obligations fiscales",
    description: "Rappel des échéances fiscales à venir",
    icon: AlertTriangle,
    color: "text-orange-600 bg-orange-50",
    borderColor: "border-orange-200 hover:border-orange-300"
  },
  {
    id: "convocation_rdv",
    title: "Convocation rendez-vous",
    description: "Invitation à un rendez-vous professionnel",
    icon: Calendar,
    color: "text-blue-600 bg-blue-50",
    borderColor: "border-blue-200 hover:border-blue-300"
  },
  {
    id: "nouvelle_reglementation",
    title: "Nouvelle réglementation",
    description: "Information sur les nouveautés réglementaires",
    icon: FileText,
    color: "text-purple-600 bg-purple-50",
    borderColor: "border-purple-200 hover:border-purple-300"
  },
  {
    id: "felicitations_creation",
    title: "Félicitations création",
    description: "Félicitations pour la création d'entreprise",
    icon: Award,
    color: "text-green-600 bg-green-50",
    borderColor: "border-green-200 hover:border-green-300"
  }
];

const TemplateSelection = ({ selectedTemplateId, onTemplateChange }: TemplateSelectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {templates.map((template) => {
        const IconComponent = template.icon;
        const isSelected = selectedTemplateId === template.id;
        
        return (
          <Button
            key={template.id}
            variant="outline"
            className={`h-auto p-4 justify-start relative transition-all duration-200 ${
              isSelected 
                ? 'border-[#84A98C] bg-[#84A98C]/5 shadow-sm' 
                : `${template.borderColor} bg-white hover:shadow-sm`
            }`}
            onClick={() => onTemplateChange(template.id)}
          >
            <div className="flex items-start gap-3 w-full text-left">
              <div className={`p-2 rounded-lg ${template.color} relative`}>
                <IconComponent className="w-4 h-4" />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#84A98C] rounded-full flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className={`font-medium text-sm ${isSelected ? 'text-[#84A98C]' : 'text-gray-800'}`}>
                  {template.title}
                </div>
                <div className={`text-xs mt-1 ${isSelected ? 'text-[#6B8E74]' : 'text-gray-500'}`}>
                  {template.description}
                </div>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default TemplateSelection;
