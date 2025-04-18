
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Trash2 } from "lucide-react";
import { Establishment } from "@/hooks/fiscal/types/igsTypes";

interface EstablishmentFormProps {
  establishment: Establishment;
  index: number;
  onRemove: (id: string) => void;
  onChange: (id: string, field: keyof Establishment, value: string | number) => void;
}

export function EstablishmentForm({
  establishment,
  index,
  onRemove,
  onChange
}: EstablishmentFormProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-500" />
            <h4 className="font-medium">
              {index === 0 ? "Établissement principal" : `Établissement ${index + 1}`}
            </h4>
          </div>
          {index > 0 && (
            <Button 
              onClick={() => onRemove(establishment.id)} 
              variant="ghost" 
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`est-name-${establishment.id}`}>Nom commercial</Label>
            <Input 
              id={`est-name-${establishment.id}`}
              value={establishment.name}
              onChange={(e) => onChange(establishment.id, "name", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`est-activity-${establishment.id}`}>Activité</Label>
            <Input 
              id={`est-activity-${establishment.id}`}
              value={establishment.activity}
              onChange={(e) => onChange(establishment.id, "activity", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`est-city-${establishment.id}`}>Ville</Label>
            <Input 
              id={`est-city-${establishment.id}`}
              value={establishment.city}
              onChange={(e) => onChange(establishment.id, "city", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`est-department-${establishment.id}`}>Département</Label>
            <Input 
              id={`est-department-${establishment.id}`}
              value={establishment.department}
              onChange={(e) => onChange(establishment.id, "department", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`est-district-${establishment.id}`}>Quartier</Label>
            <Input 
              id={`est-district-${establishment.id}`}
              value={establishment.district}
              onChange={(e) => onChange(establishment.id, "district", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`est-revenue-${establishment.id}`}>Chiffre d'affaires HT</Label>
            <Input 
              id={`est-revenue-${establishment.id}`}
              type="number"
              value={establishment.revenue || ""}
              onChange={(e) => onChange(establishment.id, "revenue", Number(e.target.value))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
