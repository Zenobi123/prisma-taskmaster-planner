
import { FileText, CreditCard } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import InvoicesTable from "./InvoicesTable";
import PaymentsTable from "./PaymentsTable";
import { useClientDetails } from "./ClientDetailsContext";

const ClientDetailsTabs = () => {
  const { clientDetails, onOpenApplyCreditDialog, onOpenReminderDialog } = useClientDetails();
  
  const availableCredits = clientDetails?.paiements.filter(p => p.est_credit && !p.facture_id) || [];

  return (
    <Tabs defaultValue="factures" className="mt-4">
      <TabsList className="mb-4">
        <TabsTrigger value="factures">
          <FileText className="h-4 w-4 mr-2" />
          Factures ({clientDetails?.factures?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="paiements">
          <CreditCard className="h-4 w-4 mr-2" />
          Paiements ({clientDetails?.paiements?.length || 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="factures">
        <InvoicesTable 
          invoices={clientDetails?.factures || []}
          availableCredits={availableCredits}
          onOpenApplyCreditDialog={onOpenApplyCreditDialog}
          onOpenReminderDialog={onOpenReminderDialog}
        />
      </TabsContent>

      <TabsContent value="paiements">
        <PaymentsTable payments={clientDetails?.paiements || []} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientDetailsTabs;
