
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClientType, Client } from "@/types/client";
import { useState, useEffect } from "react";

interface ClientFormProps {
  onSubmit: (data: any) => void;
  type: ClientType;
  onTypeChange?: (value: ClientType) => void;
  initialData?: Client;
}

export function ClientForm({ onSubmit, type, onTypeChange, initialData }: ClientFormProps) {
  const [formData, setFormData] = useState({
    nom: "",
    raisonsociale: "",
    niu: "",
    centrerattachement: "",
    ville: "",
    quartier: "",
    lieuDit: "",
    telephone: "",
    email: "",
    secteuractivite: "commerce",
    numerocnps: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || "",
        raisonsociale: initialData.raisonsociale || "",
        niu: initialData.niu,
        centrerattachement: initialData.centrerattachement,
        ville: initialData.adresse.ville,
        quartier: initialData.adresse.quartier,
        lieuDit: initialData.adresse.lieuDit,
        telephone: initialData.contact.telephone,
        email: initialData.contact.email,
        secteuractivite: initialData.secteuractivite,
        numerocnps: initialData.numerocnps || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientData = {
      type,
      nom: type === "physique" ? formData.nom : null,
      raisonsociale: type === "morale" ? formData.raisonsociale : null,
      niu: formData.niu,
      centrerattachement: formData.centrerattachement,
      adresse: {
        ville: formData.ville,
        quartier: formData.quartier,
        lieuDit: formData.lieuDit,
      },
      contact: {
        telephone: formData.telephone,
        email: formData.email,
      },
      secteuractivite: formData.secteuractivite,
      numerocnps: formData.numerocnps || null,
    };

    onSubmit(clientData);
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {onTypeChange ? (
          <div>
            <Label>Type de client</Label>
            <Select value={type} onValueChange={onTypeChange} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physique">Personne Physique</SelectItem>
                <SelectItem value="morale">Personne Morale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {type === "physique" ? (
          <>
            <div>
              <Label>Nom et prénoms</Label>
              <Input 
                required 
                value={formData.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label>Raison sociale</Label>
              <Input 
                required 
                value={formData.raisonsociale}
                onChange={(e) => handleChange("raisonsociale", e.target.value)}
              />
            </div>
          </>
        )}

        <div>
          <Label>NIU</Label>
          <Input 
            required 
            value={formData.niu}
            onChange={(e) => handleChange("niu", e.target.value)}
          />
        </div>

        <div>
          <Label>Centre de Rattachement</Label>
          <Input 
            required 
            value={formData.centrerattachement}
            onChange={(e) => handleChange("centrerattachement", e.target.value)}
          />
        </div>

        <div>
          <Label>Ville</Label>
          <Input 
            required 
            value={formData.ville}
            onChange={(e) => handleChange("ville", e.target.value)}
          />
        </div>

        <div>
          <Label>Quartier</Label>
          <Input 
            required 
            value={formData.quartier}
            onChange={(e) => handleChange("quartier", e.target.value)}
          />
        </div>

        <div>
          <Label>Lieu-dit</Label>
          <Input 
            value={formData.lieuDit}
            onChange={(e) => handleChange("lieuDit", e.target.value)}
          />
        </div>

        <div>
          <Label>Téléphone</Label>
          <Input 
            type="tel" 
            required 
            value={formData.telephone}
            onChange={(e) => handleChange("telephone", e.target.value)}
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input 
            type="email" 
            required 
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div>
          <Label>Secteur d'activité</Label>
          <Select 
            required
            value={formData.secteuractivite} 
            onValueChange={(value) => handleChange("secteuractivite", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="commerce">Commerce</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="industrie">Industrie</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Numéro CNPS (optionnel)</Label>
          <Input 
            value={formData.numerocnps}
            onChange={(e) => handleChange("numerocnps", e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Modifier le client" : "Ajouter le client"}
      </Button>
    </form>
  );
}
