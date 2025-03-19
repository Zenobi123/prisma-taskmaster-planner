
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFactures } from "@/hooks/useFactures";
import { FacturesHeader } from "./factures/FacturesHeader";
import { FacturesList } from "./factures/FacturesList";
import { FacturesDialogs } from "./factures/FacturesDialogs";
import { FacturesLoading } from "./factures/FacturesLoading";

const Factures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const {
    factures,
    isLoading,
    selectedFacture,
    isCreateDialogOpen,
    isEditDialogOpen,
    isViewDialogOpen,
    isAddPaymentDialogOpen,
    setIsCreateDialogOpen,
    setIsEditDialogOpen,
    setIsViewDialogOpen,
    setIsAddPaymentDialogOpen,
    handleView,
    handleEdit,
    handleDelete,
    handleAddPayment
  } = useFactures();
  
  if (isLoading) {
    return <FacturesLoading />;
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <FacturesHeader 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onCreateClick={() => setIsCreateDialogOpen(true)}
          />
          
          <div className="mt-6">
            <FacturesList 
              factures={factures}
              searchTerm={searchTerm}
              handleView={handleView}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleAddPayment={handleAddPayment}
            />
          </div>
        </CardContent>
      </Card>

      <FacturesDialogs 
        selectedFacture={selectedFacture}
        isCreateDialogOpen={isCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isViewDialogOpen={isViewDialogOpen}
        isAddPaymentDialogOpen={isAddPaymentDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        setIsViewDialogOpen={setIsViewDialogOpen}
        setIsAddPaymentDialogOpen={setIsAddPaymentDialogOpen}
      />
    </>
  );
};

export default Factures;
