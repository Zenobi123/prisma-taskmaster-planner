
import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import PageLayout from "@/components/layout/PageLayout";
import { CollaborateurHeader } from "./CollaborateurHeader";

interface CollaborateurLoadingProps {
  onOpenDialog: () => void;
}

export const CollaborateurLoading = ({ onOpenDialog }: CollaborateurLoadingProps) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <PageLayout>
        <div className="p-8">
          <CollaborateurHeader onOpenDialog={onOpenDialog} />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};
