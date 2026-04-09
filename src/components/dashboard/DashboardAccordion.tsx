
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { IgsSection } from "./sections/IgsSection"
import DsfSection from "./sections/DsfSection"
import DbefSection from "./sections/DbefSection"
import PatenteSection from "./sections/PatenteSection"
import { ImpotsImmobiliersSection } from "./sections/ImpotsImmobiliersSection"
import ExpiringFiscalAttestations from "./ExpiringFiscalAttestations"
import { useExpiringFiscalAttestations } from "@/hooks/useExpiringFiscalAttestations"

export default function DashboardAccordion() {
  // Utiliser le hook pour récupérer les données des attestations fiscales
  const { data: attestations = [], isLoading } = useExpiringFiscalAttestations();

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      <AccordionItem value="igs" className="border rounded-lg bg-white shadow-sm">
        <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50">
          <span className="text-lg font-semibold">
            Gestion de l'Impôt Général Synthétique
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <IgsSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="attestations" className="border rounded-lg bg-white shadow-sm">
        <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50">
          <span className="text-lg font-semibold">
            Attestations de Conformité Fiscale
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <ExpiringFiscalAttestations
            attestations={attestations}
            isLoading={isLoading}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="patente" className="border rounded-lg bg-white shadow-sm">
        <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50">
          <span className="text-lg font-semibold">
            Gestion des Patentes
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <PatenteSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="immobilier" className="border rounded-lg bg-white shadow-sm">
        <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50">
          <span className="text-lg font-semibold">
            Impôts Immobiliers (Bail, PSL, Taxe Foncière)
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4">
            <ImpotsImmobiliersSection />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="dsf" className="border rounded-lg bg-white shadow-sm">
        <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50">
          <span className="text-lg font-semibold">
            Déclarations Statistiques et Fiscales
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <DsfSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="dbef" className="border rounded-lg bg-white shadow-sm">
        <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50">
          <span className="text-lg font-semibold">
            Déclarations des Bénéficiaires Effectifs (DBEF)
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <DbefSection />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
