
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, AlertTriangle, Award } from "lucide-react";

interface TemplateSelectionProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

const templates = [
  {
    id: "rappel_obligations",
    title: "Rappel d'obligations fiscales",
    description: "Rappel des échéances fiscales à venir",
    icon: AlertTriangle,
    color: "text-orange-600 bg-orange-100"
  },
  {
    id: "convocation_rdv",
    title: "Convocation rendez-vous",
    description: "Invitation à un rendez-vous professionnel",
    icon: Calendar,
    color: "text-blue-600 bg-blue-100"
  },
  {
    id: "nouvelle_reglementation",
    title: "Nouvelle réglementation",
    description: "Information sur les nouveautés réglementaires",
    icon: FileText,
    color: "text-purple-600 bg-purple-100"
  },
  {
    id: "felicitations_creation",
    title: "Félicitations création",
    description: "Félicitations pour la création d'entreprise",
    icon: Award,
    color: "text-green-600 bg-green-100"
  }
];

export const TemplateSelection = ({ selectedTemplate, onTemplateChange }: TemplateSelectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Modèles de courrier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => {
            const IconComponent = template.icon;
            return (
              <Button
                key={template.id}
                variant={selectedTemplate === template.id ? "default" : "outline"}
                className="h-auto p-4 justify-start"
                onClick={() => onTemplateChange(template.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className={`p-2 rounded-md ${template.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{template.title}</div>
                    <div className="text-sm text-muted-foreground">
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
