import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Planning = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [collaborateurFilter, setCollaborateurFilter] = useState("all");

  // Données mockées pour l'exemple
  const events = [
    {
      id: 1,
      title: "Audit comptable",
      client: "SARL TechPro",
      collaborateur: "Sophie Martin",
      time: "09:00 - 12:00",
      type: "mission",
    },
    {
      id: 2,
      title: "Réunion client",
      client: "SAS WebDev",
      collaborateur: "Pierre Dubois",
      time: "14:00 - 15:30",
      type: "reunion",
    },
    {
      id: 3,
      title: "Déclaration TVA",
      client: "EURL ConseilPlus",
      collaborateur: "Marie Lambert",
      time: "15:30 - 17:00",
      type: "mission",
    },
  ];

  const getEventBadge = (type: string) => {
    switch (type) {
      case "mission":
        return <Badge variant="secondary">Mission</Badge>;
      case "reunion":
        return <Badge variant="outline">Réunion</Badge>;
      default:
        return null;
    }
  };

  const filteredEvents = events.filter((event) => {
    return collaborateurFilter === "all" || event.collaborateur === collaborateurFilter;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Planning</h1>
        <Select value={collaborateurFilter} onValueChange={setCollaborateurFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par collaborateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les collaborateurs</SelectItem>
            <SelectItem value="Sophie Martin">Sophie Martin</SelectItem>
            <SelectItem value="Pierre Dubois">Pierre Dubois</SelectItem>
            <SelectItem value="Marie Lambert">Marie Lambert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">
            Événements du {date?.toLocaleDateString()}
          </h2>
          {filteredEvents.map((event) => (
            <Card key={event.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.client}</p>
                  <p className="text-sm text-gray-500">{event.collaborateur}</p>
                  <p className="text-sm text-gray-500 mt-1">{event.time}</p>
                </div>
                <div>{getEventBadge(event.type)}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planning;