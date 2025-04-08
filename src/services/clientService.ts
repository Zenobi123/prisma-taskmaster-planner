
import { Client } from "@/types/client";
import { getClients } from "./clientServices/clientsFetcher";
import { addClient } from "./clientServices/clientCreator";
import { updateClient } from "./clientServices/clientUpdater";
import { archiveClient, deleteClient } from "./clientServices/clientStatusManager";

// Re-export all client-related functions to maintain backward compatibility
export {
  getClients,
  addClient,
  updateClient,
  archiveClient,
  deleteClient
};
