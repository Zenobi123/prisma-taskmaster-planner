
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

// Import components
import IgsSection from "./sections/IgsSection";
import DsfSection from "./sections/DsfSection";
import DarpSection from "./sections/DarpSection";
import PatenteSection from "./sections/PatenteSection";
import ExpiringFiscalAttestations from "./ExpiringFiscalAttestations";

interface DashboardCollapsibleProps {
  title: string;
  componentName: string;
}

const DashboardCollapsible = ({ title, componentName }: DashboardCollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const renderComponent = () => {
    switch (componentName) {
      case "IgsSection":
        return <IgsSection />;
      case "DsfSection":
        return <DsfSection />;
      case "DarpSection":
        return <DarpSection />;
      case "PatenteSection":
        return <PatenteSection />;
      case "ExpiringFiscalAttestations":
        return <ExpiringFiscalAttestations />;
      default:
        return null;
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full flex justify-between p-4 h-auto hover:bg-transparent">
          <span className="text-lg font-medium">{title}</span>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {renderComponent()}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DashboardCollapsible;
