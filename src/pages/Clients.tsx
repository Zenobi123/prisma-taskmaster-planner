
import ClientsPage from "./clients/ClientsPage";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Clients() {
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4">
          <ClientsPage />
        </div>
      </ScrollArea>
    </div>
  );
}
