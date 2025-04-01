
import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import PageLayout from "@/components/layout/PageLayout";
import { CollaborateurHeader } from "./CollaborateurHeader";
import { CollaborateurSearch } from "./CollaborateurSearch";
import { CollaborateurList } from "./CollaborateurList";
import { CollaborateurDialog } from "./CollaborateurDialog";
import { Collaborateur } from "@/types/collaborateur";

interface CollaborateurContentProps {
  searchTerm: string;
  selectedStatut: string;
  selectedPoste: string;
  isFiltersOpen: boolean;
  postes: string[];
  filteredCollaborateurs: Collaborateur[];
  isDialogOpen: boolean;
  newCollaborateur: Omit<Collaborateur, 'id' | 'created_at' | 'tachesencours'>;
  onSearchChange: (value: string) => void;
  onStatutChange: (value: string) => void;
  onPosteChange: (value: string) => void;
  onFiltersOpenChange: (open: boolean) => void;
  onOpenDialogChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: "actif" | "inactif") => void;
  onChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CollaborateurContent = ({
  searchTerm,
  selectedStatut,
  selectedPoste,
  isFiltersOpen,
  postes,
  filteredCollaborateurs,
  isDialogOpen,
  newCollaborateur,
  onSearchChange,
  onStatutChange,
  onPosteChange,
  onFiltersOpenChange,
  onOpenDialogChange,
  onDelete,
  onStatusChange,
  onChange,
  onSubmit,
}: CollaborateurContentProps) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <PageLayout>
        <div className="p-8">
          <CollaborateurHeader onOpenDialog={() => onOpenDialogChange(true)} />

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <CollaborateurSearch
              searchTerm={searchTerm}
              selectedStatut={selectedStatut}
              selectedPoste={selectedPoste}
              isFiltersOpen={isFiltersOpen}
              postes={postes}
              onSearchChange={onSearchChange}
              onStatutChange={onStatutChange}
              onPosteChange={onPosteChange}
              onFiltersOpenChange={onFiltersOpenChange}
            />

            <CollaborateurList 
              collaborateurs={filteredCollaborateurs}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          </div>

          <CollaborateurDialog
            isOpen={isDialogOpen}
            onOpenChange={onOpenDialogChange}
            collaborateur={newCollaborateur}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </div>
      </PageLayout>
    </div>
  );
};
