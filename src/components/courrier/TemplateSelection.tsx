
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    color: "text-orange-600 bg-orange-100",
    borderColor: "border-orange-200 hover:border-orange-300"
  },
  {
    id: "convocation_rdv",
    title: "Convocation rendez-vous",
    description: "Invitation à un rendez-vous professionnel",
    icon: Calendar,
    color: "text-blue-600 bg-blue-100",
    borderColor: "border-blue-200 hover:border-blue-300"
  },
  {
    id: "nouvelle_reglementation",
    title: "Nouvelle réglementation",
    description: "Information sur les nouveautés réglementaires",
    icon: FileText,
    color: "text-purple-600 bg-purple-100",
    borderColor: "border-purple-200 hover:border-purple-300"
  },
  {
    id: "felicitations_creation",
    title: "Félicitations création",
    description: "Félicitations pour la création d'entreprise",
    icon: Award,
    color: "text-green-600 bg-green-100",
    borderColor: "border-green-200 hover:border-green-300"
  }
];

const TemplateSelection = ({ selectedTemplateId, onTemplateChange }: TemplateSelectionProps) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Modèles de courrier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => {
            const IconComponent = template.icon;
            const isSelected = selectedTemplateId === template.id;
            
            return (
              <Button
                key={template.id}
                variant="outline"
                className={`h-auto p-4 justify-start relative transition-all duration-200 ${
                  isSelected 
                    ? 'border-indigo-400 bg-indigo-50 shadow-md' 
                    : `${template.borderColor} bg-white hover:shadow-lg`
                }`}
                onClick={() => onTemplateChange(template.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className={`p-3 rounded-lg ${template.color} relative`}>
                    <IconComponent className="w-5 h-5" />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <div className={`font-medium ${isSelected ? 'text-indigo-800' : 'text-gray-800'}`}>
                      {template.title}
                    </div>
                    <div className={`text-sm mt-1 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>
                      {template.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSelection;
