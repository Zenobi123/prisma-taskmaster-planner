
import { useState } from "react";

export const useSortFactures = (initialSortKey: string = "date", initialSortDirection: "asc" | "desc" = "desc") => {
  const [sortKey, setSortKey] = useState<string>(initialSortKey);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(initialSortDirection);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return {
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    handleSort
  };
};
