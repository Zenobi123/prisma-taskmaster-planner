
import { Client, ClientType } from "@/types/client";

export function useClientFormSubmit() {
  const prepareSubmitData = (formData: any, type: ClientType, initialData?: Client) => {
    console.log("Preparing client data for submission:", formData);
    console.log("Client type:", type);
    console.log("Regime fiscal selected:", formData.regimefiscal);
    
    // Verify regimefiscal value is present
    if (!formData.regimefiscal) {
      console.warn("WARNING: regimefiscal is missing in form data!");
      
      // Use a fallback value based on client type if missing
      formData.regimefiscal = type === "physique" ? "reel" : "simplifie";
      console.log("Using fallback regimefiscal value:", formData.regimefiscal);
    }
    
    // Prepare the client data for API submission
    const clientData: Partial<Client> = {
      type: type,
      niu: formData.niu,
      centrerattachement: formData.centrerattachement,
      adresse: {
        ville: formData.ville,
        quartier: formData.quartier,
        lieuDit: formData.lieuDit,
      },
      contact: {
        telephone: formData.telephone,
        email: formData.email,
      },
      secteuractivite: formData.secteuractivite,
      numerocnps: formData.numerocnps,
      gestionexternalisee: formData.gestionexternalisee,
      regimefiscal: formData.regimefiscal, // Ensure this is explicitly set
      situationimmobiliere: formData.situationimmobiliere,
    };
    
    // Add type-specific fields
    if (type === "physique") {
      clientData.nom = formData.nom;
      clientData.sexe = formData.sexe;
      clientData.etatcivil = formData.etatcivil;
    } else {
      clientData.raisonsociale = formData.raisonsociale;
      clientData.sigle = formData.sigle;
      clientData.datecreation = formData.datecreation;
      clientData.lieucreation = formData.lieucreation;
      clientData.nomdirigeant = formData.nomdirigeant;
      clientData.formejuridique = formData.formejuridique;
    }
    
    // Handle IGS data if present
    if (formData.regimefiscal === "igs" && formData.igs) {
      clientData.igs = formData.igs;
    }
    
    // If this is an update, include the ID
    if (initialData?.id) {
      clientData.id = initialData.id;
    }
    
    console.log("Final client data prepared:", clientData);
    console.log("Final regime fiscal in prepared data:", clientData.regimefiscal);
    
    return clientData;
  };

  return {
    prepareSubmitData,
  };
}
