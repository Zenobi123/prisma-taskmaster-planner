
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "lucide-react";
import { DatePicker } from "@/components/ui/datepicker";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface GenerateReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (type: string, parameters: any) => void;
}

export function GenerateReportDialog({ isOpen, onClose, onGenerate }: GenerateReportDialogProps) {
  const [reportType, setReportType] = useState("fiscal");
  const [reportTitle, setReportTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [clientId, setClientId] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [includeDetails, setIncludeDetails] = useState(true);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parameters = {
      titre: reportTitle,
      startDate,
      endDate,
      clientId: clientId || undefined,
      includeArchived,
      includeDetails
    };
    
    onGenerate(reportType, parameters);
    
    // Reset form
    setReportTitle("");
    setStartDate(undefined);
    setEndDate(undefined);
    setClientId("");
    setIncludeArchived(false);
    setIncludeDetails(true);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Générer un nouveau rapport</DialogTitle>
          <DialogDescription>
            Choisissez le type de rapport et les paramètres souhaités
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Type de rapport</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiscal">Rapport fiscal</SelectItem>
                <SelectItem value="client">Rapport client</SelectItem>
                <SelectItem value="financier">Rapport financier</SelectItem>
                <SelectItem value="activite">Rapport d'activité</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-title">Titre du rapport</Label>
            <Input
              id="report-title"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="Entrez un titre pour ce rapport"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? startDate.toLocaleDateString() : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? endDate.toLocaleDateString() : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => 
                      startDate ? date < startDate : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {reportType === "client" && (
            <div className="space-y-2">
              <Label htmlFor="client-id">Client spécifique (optionnel)</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client-id">
                  <SelectValue placeholder="Tous les clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les clients</SelectItem>
                  <SelectItem value="client1">SARL EXEMPLE</SelectItem>
                  <SelectItem value="client2">ETS DEMO</SelectItem>
                  <SelectItem value="client3">Société ABC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="include-archived" 
              checked={includeArchived} 
              onCheckedChange={(checked) => 
                setIncludeArchived(checked as boolean)
              }
            />
            <Label htmlFor="include-archived" className="font-normal">
              Inclure les éléments archivés
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="include-details" 
              checked={includeDetails}
              onCheckedChange={(checked) => 
                setIncludeDetails(checked as boolean)
              }
            />
            <Label htmlFor="include-details" className="font-normal">
              Inclure les détails complets
            </Label>
          </div>
        
          <DialogFooter className="pt-4">
            <Button onClick={onClose} type="button" variant="outline">
              Annuler
            </Button>
            <Button type="submit">Générer le rapport</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
