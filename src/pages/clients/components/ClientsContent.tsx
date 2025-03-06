
import { Client, ClientType } from "@/types/client";
import { ClientList } from "@/components/clients/ClientList";
import { ClientFilters } from "@/components/clients/ClientFilters";

interface ClientsContentProps {
  clients: Client[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: ClientType | "all";
  onTypeChange: (value: ClientType | "all") => void;
  selectedSecteur: string;
  onSecteurChange: (value: string) => void;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientsContent({
  clients,
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedSecteur,
  onSecteurChange,
  onView,
  onEdit,
  onDelete,
}: ClientsContentProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <ClientFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedType={selectedType}
        onTypeChange={onTypeChange}
        selectedSecteur={selectedSecteur}
        onSecteurChange={onSecteurChange}
      />

      <ClientList
        clients={clients}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
