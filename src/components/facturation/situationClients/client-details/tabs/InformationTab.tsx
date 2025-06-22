
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useClientDetails } from "../ClientDetailsContext";
import ClientInfoSection from "./information/ClientInfoSection";

const InformationTab = () => {
  const { clientDetails } = useClientDetails();
  
  console.log("InformationTab - clientDetails:", clientDetails);
  
  // Use the client data from clientDetails if available
  const client = clientDetails?.client || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-800">
            Informations générales
          </h3>
          
          <ClientInfoSection client={client} />
        </div>
      </div>
      
      <div>
        <Button className="bg-[#3C6255] hover:bg-[#2B4B3E] text-white">
          <Edit className="w-4 h-4 mr-2" />
          Modifier les informations
        </Button>
      </div>
    </div>
  );
};

export default InformationTab;
