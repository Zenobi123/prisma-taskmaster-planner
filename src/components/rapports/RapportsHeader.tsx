
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RapportsHeaderProps {
  onGenerateReport: () => void;
}

export const RapportsHeader = ({ onGenerateReport }: RapportsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Rapports</h1>
          <p className="text-neutral-600 mt-1">
            Consultez et générez des rapports
          </p>
        </div>
        <Button onClick={onGenerateReport}>
          Générer un rapport
        </Button>
      </div>
    </>
  );
};
