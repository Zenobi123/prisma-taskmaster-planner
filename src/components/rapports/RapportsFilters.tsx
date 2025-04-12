
import React from "react";
import { Search } from "lucide-react";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";

interface RapportsFiltersProps {
  searchTerm: string;
  typeFilter: string;
  selectedPeriod: string;
  selectedDate?: Date;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
}

export const RapportsFilters = ({
  searchTerm,
  typeFilter,
  selectedPeriod,
  selectedDate,
  onSearchChange,
  onTypeChange,
  onPeriodChange,
  onDateChange,
}: RapportsFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un rapport..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Type de rapport" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          <SelectItem value="fiscal">Fiscal</SelectItem>
          <SelectItem value="client">Client</SelectItem>
          <SelectItem value="financier">Financier</SelectItem>
          <SelectItem value="activite">Activité</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Période" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes périodes</SelectItem>
          <SelectItem value="this_month">Ce mois</SelectItem>
          <SelectItem value="this_year">Cette année</SelectItem>
          <SelectItem value="last_year">Année précédente</SelectItem>
          <SelectItem value="custom">Période personnalisée</SelectItem>
        </SelectContent>
      </Select>
      
      {selectedPeriod === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-[200px]">
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? selectedDate.toLocaleDateString() : "Choisir une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <DatePicker
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
