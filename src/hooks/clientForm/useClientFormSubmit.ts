
import { Client, ClientType, RegimeFiscal } from "@/types/client";

export function useClientFormSubmit() {
  const prepareSubmitData = (formData: any, type: ClientType, initialData?: Client) => {
    console.log("Preparing client data for submission, form data:", JSON.stringify(formData, null, 2));
    console.log("Client type:", type);
    console.log("Regime fiscal in form data:", formData.regimefiscal);
    
    // S'assurer que regimefiscal est défini
    if (!formData.regimefiscal) {
      console.warn("WARNING: regimefiscal is missing in form data!");
      
      // Utiliser une valeur de secours basée sur le type de client ou la valeur initiale
      if (initialData?.regimefiscal) {
        formData.regimefiscal = initialData.regimefiscal;
        console.log("Using initial regimefiscal value:", formData.regimefiscal);
      } else {
        // Ensure proper RegimeFiscal type for the default value
        formData.regimefiscal = (type === "physique" ? "reel" : "simplifie") as RegimeFiscal;
        console.log("Using fallback regimefiscal value:", formData.regimefiscal);
      }
    }
    
    // Préparer les données client pour la soumission à l'API
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
      regimefiscal: formData.regimefiscal as RegimeFiscal, // Type assertion to ensure compatibility
      situationimmobiliere: formData.situationimmobiliere,
    };
    
    // Ajouter les champs spécifiques au type
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
    
    // Gérer les données IGS si présentes
    if (formData.regimefiscal === "igs" && formData.igs) {
      clientData.igs = formData.igs;
      
      // Ajout : S'assurer que fiscal_data existe et contient les données IGS
      clientData.fiscal_data = {
        ...(initialData?.fiscal_data || {}),
        igs: {
          ...(initialData?.fiscal_data?.igs || {}),
          soumisIGS: formData.igs.soumisIGS,
          adherentCGA: formData.igs.adherentCGA,
          classeIGS: formData.igs.classeIGS
        }
      };
    }
    
    // Si c'est une mise à jour, inclure l'ID
    if (initialData?.id) {
      clientData.id = initialData.id;
    }
    
    console.log("Final client data prepared:", JSON.stringify(clientData, null, 2));
    console.log("Final regimefiscal value:", clientData.regimefiscal);
    
    return clientData;
  };

  return {
    prepareSubmitData,
  };
}
