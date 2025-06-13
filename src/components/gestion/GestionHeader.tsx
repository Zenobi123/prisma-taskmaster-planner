
import { Users } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

interface GestionHeaderProps {
  nombreClientsEnGestion: number;
}

export const GestionHeader = ({ nombreClientsEnGestion }: GestionHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <BackButton />
      <div className="p-3 bg-green-100 rounded-lg">
        <Users className="w-8 h-8 text-green-600" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-neutral-800">Gestion</h1>
        <p className="text-neutral-600 mt-1">
          {nombreClientsEnGestion} client{nombreClientsEnGestion > 1 ? 's' : ''} en gestion
        </p>
      </div>
    </div>
  );
};
