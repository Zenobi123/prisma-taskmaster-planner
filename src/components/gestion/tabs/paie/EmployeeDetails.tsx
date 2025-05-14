import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Employee } from "@/types/employee";
import { paieService } from "@/services/paieService";

interface EmployeeDetailsProps {
  employee: Employee;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de l'employé</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Nom:</p>
            <p>{employee.nom}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Prénom:</p>
            <p>{employee.prenom}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Email:</p>
            <p>{employee.email || "Non défini"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Téléphone:</p>
            <p>{employee.telephone || "Non défini"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Adresse:</p>
            <p>{employee.adresse || "Non définie"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Genre:</p>
            <p>{employee.genre || "Non défini"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Date de naissance:</p>
            <p>
              {employee.date_naissance
                ? format(new Date(employee.date_naissance), "dd MMMM yyyy", { locale: fr })
                : "Non définie"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Date d'embauche:</p>
            <p>{format(new Date(employee.date_embauche), "dd MMMM yyyy", { locale: fr })}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Poste:</p>
            <p>{employee.poste}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Département:</p>
            <p>{employee.departement || "Non défini"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Type de contrat:</p>
            <p>{employee.type_contrat || "Non défini"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Statut:</p>
            <p>{employee.statut}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Salaire de base:</p>
            <p>{employee.salaire_base} FCFA</p>
          </div>
          <div>
            <p className="text-sm font-medium">Numéro CNPS:</p>
            <p>{employee.numero_cnps || "Non défini"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Banque:</p>
            <p>{employee.banque || "Non définie"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Numéro de compte:</p>
            <p>{employee.numero_compte || "Non défini"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeDetails;
