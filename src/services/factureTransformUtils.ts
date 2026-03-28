
// Shared client transformation utility for facture services
export function transformClient(client: any): { id: string; nom: string; adresse: string; telephone: string; email: string } | undefined {
  if (!client) return undefined;

  return {
    id: client.id,
    nom: client.type === "physique" ? client.nom || "" : client.raisonsociale || "",
    adresse: typeof client.adresse === 'object' && client.adresse && 'ville' in client.adresse
      ? String(client.adresse.ville) : "",
    telephone: typeof client.contact === 'object' && client.contact && 'telephone' in client.contact
      ? String(client.contact.telephone) : "",
    email: typeof client.contact === 'object' && client.contact && 'email' in client.contact
      ? String(client.contact.email) : ""
  };
}
