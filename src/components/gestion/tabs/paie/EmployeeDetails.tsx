
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Employe, Paie } from "@/types/paie";
import { rhService } from "@/services/rhService";
import { paieService } from "@/services/paieService";
import { EmployeePaieForm } from "./EmployeePaieForm";
import { EmployeePaieTable } from "./EmployeePaieTable";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Calendar, BriefcaseBusiness, Building2, CreditCard } from "lucide-react";

interface EmployeeDetailsProps {
  employeeId: string;
  clientId: string;
}

export function EmployeeDetails({ employeeId, clientId }: EmployeeDetailsProps) {
  const [employee, setEmployee] = useState<Employe | null>(null);
  const [paies, setPaies] = useState<Paie[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Charger les données de l'employé et ses fiches de paie
  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les données de l'employé
      const employeeData = await rhService.getEmployeeById(employeeId);
      if (employeeData) {
        setEmployee(employeeData);
      }
      
      // Charger les fiches de paie de l'employé
      const paiesData = await paieService.getPayrollsByEmployeeId(employeeId);
      setPaies(paiesData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast.error("Erreur lors du chargement des données de l'employé");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (employeeId) {
      loadData();
    }
  }, [employeeId]);
  
  // Formater une date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="p-6 bg-red-50 text-red-800 rounded-md">
        Employé non trouvé
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{employee.prenom} {employee.nom}</CardTitle>
          <CardDescription>{employee.poste} - {employee.departement}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Informations personnelles</h3>
                <Separator className="mb-2" />
                
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Date de naissance: {formatDate(employee.date_naissance)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Genre: {employee.genre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Email: {employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Téléphone: {employee.telephone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Adresse: {employee.adresse}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Informations professionnelles</h3>
                <Separator className="mb-2" />
                
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2">
                    <BriefcaseBusiness className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Poste: {employee.poste}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Département: {employee.departement}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Type de contrat: {employee.type_contrat}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Date d'embauche: {formatDate(employee.date_embauche)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Informations financières</h3>
                <Separator className="mb-2" />
                
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Salaire de base: {employee.salaire_base.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">N° CNPS: {employee.numero_cnps}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Banque: {employee.banque}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">N° Compte: {employee.numero_compte}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <EmployeePaieForm 
          employee={employee} 
          clientId={clientId} 
          onSuccess={loadData}
        />
      </div>
      
      <EmployeePaieTable paies={paies} />
    </div>
  );
}
