
import React from 'react';
import { Client } from '@/types/client';
import { useCapitalSocial } from '@/hooks/useCapitalSocial';
import { CapitalSocialForm } from './CapitalSocialForm';
import { ActionnairesSection } from './ActionnairesSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CapitalSocialSectionProps {
  client: Client;
}

export const CapitalSocialSection: React.FC<CapitalSocialSectionProps> = ({ client }) => {
  console.log("CapitalSocialSection - Client type:", client.type);
  console.log("CapitalSocialSection - Client ID:", client.id);

  const {
    capitalSocial,
    actionnaires,
    isLoading,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    saveCapitalSocial,
    addActionnaire,
    updateActionnaire,
    deleteActionnaire
  } = useCapitalSocial(client.id);

  // Afficher seulement pour les personnes morales
  if (client.type !== 'morale') {
    console.log("CapitalSocialSection - Client n'est pas une personne morale, type:", client.type);
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  console.log("CapitalSocialSection - Rendu de la section capital social");

  return (
    <div className="space-y-6">
      <CapitalSocialForm
        capitalSocial={capitalSocial}
        onSave={saveCapitalSocial}
        onDataChange={() => setHasUnsavedChanges(true)}
      />

      <ActionnairesSection
        actionnaires={actionnaires}
        onAdd={addActionnaire}
        onUpdate={updateActionnaire}
        onDelete={deleteActionnaire}
      />
    </div>
  );
};
