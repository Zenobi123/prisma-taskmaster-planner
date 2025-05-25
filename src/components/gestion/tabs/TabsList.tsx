
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TabsListProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CustomTabsList({ activeTab, onTabChange }: TabsListProps) {
  const [scrollPos, setScrollPos] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
      }
    };
    
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);
  
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      const newPosition = direction === "left" 
        ? Math.max(scrollPos - scrollAmount, 0)
        : scrollPos + scrollAmount;
        
      setScrollPos(newPosition);
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth"
      });
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      {canScrollLeft && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => scroll("left")}
          className="hidden sm:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      <ScrollArea ref={scrollRef} className="flex-1">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="flex flex-nowrap overflow-x-auto">
            <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
            <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
            <TabsTrigger value="comptable">Comptable</TabsTrigger>
            <TabsTrigger value="contrat-prestations">Contrats</TabsTrigger>
            <TabsTrigger value="cloture-exercice">Clôture</TabsTrigger>
            <TabsTrigger value="dossier">Dossier</TabsTrigger>
            <TabsTrigger value="gestion-admin">Administration</TabsTrigger>
            <TabsTrigger value="gestion-rh">RH</TabsTrigger>
            <TabsTrigger value="gestion-paie">Paie</TabsTrigger>
          </TabsList>
        </Tabs>
      </ScrollArea>
      
      {canScrollRight && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => scroll("right")}
          className="hidden sm:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default function TabsListWrapper(props: TabsListProps) {
  return <CustomTabsList {...props} />;
}
