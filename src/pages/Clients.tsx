import { useState } from "react";
import { Plus, Search, Filter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface Client {
  id: string;
  raisonSociale: string;
  siren: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  dateCreation: string;
  statut: "actif" | "inactif";
}

const clientsData: Client[] = [
  {
    id: "1",
    raisonSociale: "Entreprise A",
    siren: "123456789",
    email: "contact@entreprisea.fr",
    telephone: "0123456789",
    adresse: "123 rue des Entreprises",
    ville: "Paris",
    codePostal: "75001",
    dateCreation: "2023-01-01",
    statut: "actif",
  },
];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredClients = clientsData.filter(
    (client) =>
      client.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.siren.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-800">
              Clients
            </h1>
            <p className="text-neutral-600 mt-1">
              Gérez vos clients et leurs informations
            </p>
          </div>
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white">
            <Plus className="w-4 h-4" />
            Nouveau client
          </Button>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <Input
              type="text"
              placeholder="Rechercher un client..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
        </div>

        <div className="mt-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-neutral-600 font-medium">Raison sociale</th>
                <th className="text-left py-3 px-4 text-neutral-600 font-medium">SIREN</th>
                <th className="text-left py-3 px-4 text-neutral-600 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-neutral-600 font-medium">Téléphone</th>
                <th className="text-left py-3 px-4 text-neutral-600 font-medium">Ville</th>
                <th className="text-left py-3 px-4 text-neutral-600 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                  <td className="py-3 px-4">{client.raisonSociale}</td>
                  <td className="py-3 px-4">{client.siren}</td>
                  <td className="py-3 px-4">{client.email}</td>
                  <td className="py-3 px-4">{client.telephone}</td>
                  <td className="py-3 px-4">{client.ville}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      client.statut === 'actif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}