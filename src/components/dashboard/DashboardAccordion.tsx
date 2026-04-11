
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
    <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
      <AccordionItem value="igs" className="border rounded-lg bg-white shadow-sm">
        <AccordionTrigger className="px-3 sm:px-4 hover:no-underline hover:bg-gray-50 text-left">
          <span className="text-sm sm:text-base md:text-lg font-semibold leading-tight">
            Impôt Général Synthétique (IGS)
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <IgsSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="attestations" className="border rounded-lg bg-white shadow-sm">
        <AccordionTrigger className="px-3 sm:px-4 hover:no-underline hover:bg-gray-50 text-left">
          <span className="text-sm sm:text-base md:text-lg font-semibold leading-tight">
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
        <AccordionTrigger className="px-3 sm:px-4 hover:no-underline hover:bg-gray-50 text-left">
          <span className="text-sm sm:text-base md:text-lg font-semibold leading-tight">
            Gestion des Patentes
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <PatenteSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="immobilier" className="border rounded-lg bg-white shadow-sm">
        <AccordionTrigger className="px-3 sm:px-4 hover:no-underline hover:bg-gray-50 text-left">
          <span className="text-sm sm:text-base md:text-lg font-semibold leading-tight">
            <span className="hidden sm:inline">Impôts Immobiliers (Bail, PSL, Taxe Foncière)</span>
            <span className="sm:hidden">Impôts Immobiliers</span>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-3 sm:p-4">
            <ImpotsImmobiliersSection />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="dsf" className="border rounded-lg bg-white shadow-sm">
        <AccordionTrigger className="px-3 sm:px-4 hover:no-underline hover:bg-gray-50 text-left">
          <span className="text-sm sm:text-base md:text-lg font-semibold leading-tight">
            <span className="hidden sm:inline">Déclarations Statistiques et Fiscales</span>
            <span className="sm:hidden">Déclarations (DSF)</span>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <DsfSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="dbef" className="border rounded-lg bg-white shadow-sm">
        <AccordionTrigger className="px-3 sm:px-4 hover:no-underline hover:bg-gray-50 text-left">
          <span className="text-sm sm:text-base md:text-lg font-semibold leading-tight">
            <span className="hidden sm:inline">Déclarations des Bénéficiaires Effectifs (DBEF)</span>
            <span className="sm:hidden">Bénéficiaires Effectifs (DBEF)</span>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <DbefSection />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
