
import { Client, ClientType } from "@/types/client";
import { ClientList } from "@/components/clients/ClientList";
import { ClientFilters } from "@/components/clients/ClientFilters";
import { MultiCriteriaFilter } from "@/components/clients/MultiCriteriaFilter";

interface ClientsContentProps {
  clients: Client[];
  allClients: Client[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: ClientType | "all";
  onTypeChange: (value: ClientType | "all") => void;
  selectedSecteur: string;
  onSecteurChange: (value: string) => void;
  showArchived: boolean;
  onShowArchivedChange: (value: boolean) => void;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onArchive: (client: Client) => void;
  onRestore: (client: Client) => void;
  onDelete: (client: Client) => void;
  onMultiCriteriaChange: (filtered: Client[]) => void;
  isMobile?: boolean;
}

export function ClientsContent({
  clients,
  allClients,
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedSecteur,
  onSecteurChange,
  showArchived,
  onShowArchivedChange,
  onView,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
  onMultiCriteriaChange,
  isMobile
}: ClientsContentProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 p-${isMobile ? '4' : '6'} h-full overflow-hidden flex flex-col`}>
      <MultiCriteriaFilter
        clients={allClients}
        onFilterChange={onMultiCriteriaChange}
        isMobile={isMobile}
      />
      
      <ClientFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedType={selectedType}
        onTypeChange={onTypeChange}
        selectedSecteur={selectedSecteur}
        onSecteurChange={onSecteurChange}
        showArchived={showArchived}
        onShowArchivedChange={onShowArchivedChange}
        clients={clients}
        isMobile={isMobile}
      />

      <div className="flex-1 overflow-y-auto">
        <ClientList
          clients={clients}
          onView={onView}
          onEdit={onEdit}
          onArchive={onArchive}
          onRestore={onRestore}
          onDelete={onDelete}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}
