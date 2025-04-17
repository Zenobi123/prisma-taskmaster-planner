
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import RecentTasks from "./RecentTasks";
import ExpiringFiscalAttestations from "./ExpiringFiscalAttestations";
import PatenteSection from "./sections/PatenteSection";
import IgsSection from "./sections/IgsSection";
import DsfSection from "./sections/DsfSection";
import { useExpiringFiscalAttestations } from "@/hooks/useExpiringFiscalAttestations";

interface DashboardCollapsibleProps {
  title: string;
  componentName: "RecentTasks" | "ExpiringFiscalAttestations" | "PatenteSection" | "IgsSection" | "DsfSection";
}

export default function DashboardCollapsible({ title, componentName }: DashboardCollapsibleProps) {
  // Use the hook to get data for ExpiringFiscalAttestations
  const { data: attestations = [], isLoading } = useExpiringFiscalAttestations();
  
  const renderComponent = () => {
    switch (componentName) {
      case "RecentTasks":
        return <RecentTasks />;
      case "ExpiringFiscalAttestations":
        return <ExpiringFiscalAttestations attestations={attestations} isLoading={isLoading} />;
      case "PatenteSection":
        return <PatenteSection />;
      case "IgsSection":
        return <IgsSection />;
      case "DsfSection":
        return <DsfSection />;
      default:
        return null;
    }
  };

  return (
    <Collapsible className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-transparent">
            <ChevronDown className="h-4 w-4 collapsible-closed" />
            <ChevronUp className="h-4 w-4 collapsible-open" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>{renderComponent()}</CollapsibleContent>
    </Collapsible>
  );
}
