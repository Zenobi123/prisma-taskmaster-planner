
import { useState } from "react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import ExpiringFiscalAttestations from "./ExpiringFiscalAttestations";
import DsfSection from "./sections/DsfSection";
import PatenteSection from "./sections/PatenteSection";
import { useExpiringFiscalAttestations } from "@/hooks/useExpiringFiscalAttestations";

interface DashboardCollapsibleProps {
  title: string;
  componentName: "ExpiringFiscalAttestations" | "DsfSection" | "PatenteSection";
}

const DashboardCollapsible = ({ title, componentName }: DashboardCollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: attestations = [], isLoading } = useExpiringFiscalAttestations();

  const renderComponent = () => {
    switch (componentName) {
      case "ExpiringFiscalAttestations":
        return <ExpiringFiscalAttestations attestations={attestations} isLoading={isLoading} />;
      case "DsfSection":
        return <DsfSection />;
      case "PatenteSection":
        return <PatenteSection />;
      default:
        return null;
    }
  };

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      className="border rounded-lg overflow-hidden bg-white shadow-sm"
    >
      <div className="flex justify-between items-center p-4 border-b bg-white">
        <h2 className="text-xl font-semibold text-neutral-800">
          {title}
        </h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="p-2">
          {renderComponent()}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DashboardCollapsible;
