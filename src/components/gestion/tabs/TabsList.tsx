
import React, { useRef, useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  scrollPos?: number;
}

const TabsList = ({ children, className, scrollPos = 0 }: TabsListProps) => {
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
  }, [children]);

  return (
    <div className="relative">
      {showLeftShadow && (
        <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-r from-background to-transparent z-10" />
      )}
      
      <ScrollArea
        ref={scrollRef}
        className={cn(
          "w-full overflow-x-auto no-scrollbar pb-2",
          className
        )}
        onScroll={handleScroll}
      >
        <div className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-auto min-w-full">
          {children}
        </div>
      </ScrollArea>
      
      {showRightShadow && (
        <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-background to-transparent z-10" />
      )}
    </div>
  );
};

export default TabsList;
