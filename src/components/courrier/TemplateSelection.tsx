
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, Mail, Users } from "lucide-react";

interface TemplateSelectionProps {
  templates: Array<{ id: string; name: string; type: string; description: string }>;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  generationType: 'bulk' | 'individual';
  onGenerationTypeChange: (type: 'bulk' | 'individual') => void;
}

export function TemplateSelection({ 
  templates, 
  selectedTemplate, 
  onTemplateChange,
  generationType,
  onGenerationTypeChange 
}: TemplateSelectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Modèle et Type de Génération
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Type de Génération</Label>
          <RadioGroup 
            value={generationType} 
            onValueChange={(value: 'bulk' | 'individual') => onGenerationTypeChange(value)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bulk" id="bulk" />
              <Label htmlFor="bulk" className="flex items-center gap-2 cursor-pointer">
                <Users className="w-4 h-4" />
                Publipostage (tous les clients)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual" className="flex items-center gap-2 cursor-pointer">
                <Mail className="w-4 h-4" />
                Courriers individuels
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Modèle de Courrier</Label>
          <Select value={selectedTemplate} onValueChange={onTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un modèle" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedTemplate && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                {templates.find(t => t.id === selectedTemplate)?.description}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
