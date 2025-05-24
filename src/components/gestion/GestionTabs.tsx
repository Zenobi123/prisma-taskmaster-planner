
import React, { useRef, useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Client } from "@/types/client";

interface GestionTabsProps {
  client: Client;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scrollPos?: number;
}

export function GestionTabs({ client, activeTab, setActiveTab, scrollPos }: GestionTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftShadow(scrollLeft > 0);
      setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <div className="relative">
        {showLeftShadow && (
          <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-r from-background to-transparent z-10" />
        )}
        
        <ScrollArea
          ref={scrollRef}
          className="w-full overflow-x-auto no-scrollbar pb-2"
          onScroll={handleScroll}
        >
          <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-auto min-w-full">
            <TabsTrigger value="informations" onClick={() => setActiveTab("informations")}>
              Informations
            </TabsTrigger>
            <TabsTrigger value="contacts" onClick={() => setActiveTab("contacts")}>
              Contacts
            </TabsTrigger>
            <TabsTrigger value="documents" onClick={() => setActiveTab("documents")}>
              Documents
            </TabsTrigger>
            <TabsTrigger value="comptabilite" onClick={() => setActiveTab("comptabilite")}>
              Comptabilité
            </TabsTrigger>
            <TabsTrigger value="parametres" onClick={() => setActiveTab("parametres")}>
              Paramètres
            </TabsTrigger>
          </TabsList>
        </ScrollArea>
        
        {showRightShadow && (
          <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-background to-transparent z-10" />
        )}
      </div>
    </Tabs>
  );
}
