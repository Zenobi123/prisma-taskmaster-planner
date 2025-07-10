
import { Client, ClientType, RegimeFiscal } from "@/types/client";
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
  selectedRegimeFiscal: RegimeFiscal | "all";
  onRegimeFiscalChange: (value: RegimeFiscal | "all") => void;
  showArchived: boolean;
  onShowArchivedChange: (value: boolean) => void;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onArchive: (client: Client) => void;
  onRestore: (client: Client) => void;
  onDelete: (client: Client) => void;
  isMobile?: boolean;
}

export function ClientsContent({
  clients,
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedSecteur,
  onSecteurChange,
  selectedRegimeFiscal,
  onRegimeFiscalChange,
  showArchived,
  onShowArchivedChange,
  onView,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
  isMobile
}: ClientsContentProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 p-${isMobile ? '4' : '6'} h-full overflow-hidden flex flex-col`}>
      <ClientFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedType={selectedType}
        onTypeChange={onTypeChange}
        selectedSecteur={selectedSecteur}
        onSecteurChange={onSecteurChange}
        selectedRegimeFiscal={selectedRegimeFiscal}
        onRegimeFiscalChange={onRegimeFiscalChange}
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
