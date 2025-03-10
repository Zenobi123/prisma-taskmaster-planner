
import React, { ReactNode } from "react";

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
}

export function SectionHeader({ icon, title, children }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-lg font-medium flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}
