
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useClientDetails } from "./client-details-context";
import InformationTab from "./tabs/InformationTab";
import InvoicesTab from "./tabs/InvoicesTab";
import PaymentsTab from "./tabs/PaymentsTab";
import DerivedPrestationsTab from "./tabs/DerivedPrestationsTab";

type VueSituation = "globale" | "cabinet" | "fiscale";

const VUE_OPTIONS: { value: VueSituation; label: string }[] = [
  { value: "globale", label: "Globale" },
  { value: "cabinet", label: "Cabinet" },
  { value: "fiscale", label: "Fiscale" },
];

const ClientDetailsTabs = () => {
  const { clientDetails } = useClientDetails();
  const [vue, setVue] = useState<VueSituation>("globale");
  const [activeTab, setActiveTab] = useState("informations");

  // Onglets visibles selon la vue (cf. situation-app.html : globale / cabinet / fiscale)
  const show = {
    informations: true,
    factures: vue === "globale" || vue === "cabinet",
    paiements: vue === "globale" || vue === "cabinet",
    honoraires: vue === "globale" || vue === "cabinet",
    dossierFiscal: vue === "globale" || vue === "fiscale",
  };

  // Si l'onglet actif n'est plus visible après changement de vue, revenir à Informations.
  const tabVisible: Record<string, boolean> = {
    informations: true,
    factures: show.factures,
    paiements: show.paiements,
    "dossier-fiscal": show.dossierFiscal,
    honoraires: show.honoraires,
  };
  useEffect(() => {
    if (!tabVisible[activeTab]) setActiveTab("informations");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vue]);

  if (!clientDetails) {
    return null;
  }

  const clientId = clientDetails.id || clientDetails.client?.id;

  return (
    <div className="w-full space-y-3">
      {/* Sélecteur de vue */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-md border bg-muted/40 p-0.5">
          {VUE_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              type="button"
              size="sm"
              variant={vue === opt.value ? "default" : "ghost"}
              className="h-7 px-3 text-xs"
              onClick={() => setVue(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        {(vue === "globale" || vue === "fiscale") && clientId && (
          <Button asChild size="sm" variant="outline" className="h-7 text-xs">
            <Link to={`/gestion?client=${clientId}&tab=obligations-fiscales`}>
              <ExternalLink className="h-3 w-3 mr-1" />
              Dossier fiscal complet (Gestion)
            </Link>
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-gray-200 overflow-x-auto">
          <TabsList className="flex space-x-2 w-max">
            <TabsTrigger value="informations" className="rounded-md px-3 py-2 text-sm font-medium">
              Informations
            </TabsTrigger>
            {show.factures && (
              <TabsTrigger value="factures" className="rounded-md px-3 py-2 text-sm font-medium">
                Factures <Badge variant="secondary" className="ml-2">{clientDetails.factures.length}</Badge>
              </TabsTrigger>
            )}
            {show.paiements && (
              <TabsTrigger value="paiements" className="rounded-md px-3 py-2 text-sm font-medium">
                Paiements <Badge variant="secondary" className="ml-2">{clientDetails.paiements.length}</Badge>
              </TabsTrigger>
            )}
            {show.dossierFiscal && (
              <TabsTrigger value="dossier-fiscal" className="rounded-md px-3 py-2 text-sm font-medium">
                Dossier fiscal annuel
              </TabsTrigger>
            )}
            {show.honoraires && (
              <TabsTrigger value="honoraires" className="rounded-md px-3 py-2 text-sm font-medium">
                Honoraires cabinet
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="informations" className="mt-2">
          <InformationTab />
        </TabsContent>

        {show.factures && (
          <TabsContent value="factures" className="mt-2">
            <InvoicesTab />
          </TabsContent>
        )}

        {show.paiements && (
          <TabsContent value="paiements" className="mt-2">
            <PaymentsTab />
          </TabsContent>
        )}

        {show.dossierFiscal && (
          <TabsContent value="dossier-fiscal" className="mt-2">
            <DerivedPrestationsTab type="impot" />
          </TabsContent>
        )}

        {show.honoraires && (
          <TabsContent value="honoraires" className="mt-2">
            <DerivedPrestationsTab type="honoraire" />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ClientDetailsTabs;
