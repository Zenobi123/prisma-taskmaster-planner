
import ClientsPage from "./clients/ClientsPage";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Clients() {
  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <ClientsPage />
    </ScrollArea>
  );
}
