import { Client } from "@/types/client";

interface ContratPrestationsProps {
  client: Client;
}

export function ContratPrestations({ client }: ContratPrestationsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Contrat de prestations</h2>
      <p className="text-muted-foreground">
        Suivi et gestion de notre contrat avec {client.type === "physique" ? client.nom : client.raisonsociale}
      </p>
      
      <div className="p-8 text-center border rounded-md border-dashed">
        <p className="text-muted-foreground">Contenu en cours de développement</p>
      </div>
    </div>
  );
}
