
export const FactureEmptyState = () => {
  return (
    <div className="rounded-md border p-8 text-center">
      <h3 className="text-lg font-medium mb-2">Aucune facture trouvée</h3>
      <p className="text-muted-foreground">
        Aucune facture ne correspond à vos critères de recherche.
      </p>
    </div>
  );
};
