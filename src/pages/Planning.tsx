
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getTasks, Task } from "@/services/taskService";
import { getCollaborateurs } from "@/services/collaborateurService";

interface Event {
  id: string;
  title: string;
  client: string;
  collaborateur: string;
  time: string;
  type: "mission" | "reunion";
}

const Planning = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [collaborateurFilter, setCollaborateurFilter] = useState("all");
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  // Fetch real data from the database
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const { data: collaborateurs, isLoading: isLoadingCollabs } = useQuery({
    queryKey: ["collaborateurs"],
    queryFn: getCollaborateurs,
  });

  // Transform tasks into events when data is loaded
  useEffect(() => {
    if (tasks && !isLoadingTasks) {
      const transformedEvents = tasks.map((task: any) => {
        // Format time string
        const startTime = task.start_time || "00:00";
        const endTime = task.end_time || "00:00";
        const timeString = `${startTime} - ${endTime}`;

        // Determine client name
        const clientName = task.clients 
          ? (task.clients.type === "physique" ? task.clients.nom : task.clients.raisonsociale) 
          : "Sans client";

        // Determine collaborator name
        const collaborateurName = task.collaborateurs
          ? `${task.collaborateurs.prenom} ${task.collaborateurs.nom}`
          : "Non assigné";

        // Default type is mission, but could be extended with more logic
        const eventType: "mission" | "reunion" = task.title.toLowerCase().includes("réunion") 
          ? "reunion" 
          : "mission";

        return {
          id: task.id,
          title: task.title,
          client: clientName,
          collaborateur: collaborateurName,
          time: timeString,
          type: eventType,
        };
      });

      setEvents(transformedEvents);
    }
  }, [tasks, isLoadingTasks]);

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

  // Filter events by selected date and collaborateur
  const filteredEvents = events.filter((event) => {
    const isSameCollaborateur = collaborateurFilter === "all" || event.collaborateur === collaborateurFilter;
    
    // Find task to check date
    const taskData = tasks?.find((task: any) => task.id === event.id);
    const taskDate = taskData?.start_date ? new Date(taskData.start_date) : null;
    
    // Check if task date matches selected date
    let isSameDate = false;
    if (date && taskDate) {
      isSameDate = 
        date.getDate() === taskDate.getDate() && 
        date.getMonth() === taskDate.getMonth() && 
        date.getFullYear() === taskDate.getFullYear();
    }
    
    return isSameCollaborateur && isSameDate;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Planning</h1>
          <p className="text-neutral-600 mt-1">
            Consultez et gérez le planning des missions
          </p>
        </div>
        <Select value={collaborateurFilter} onValueChange={setCollaborateurFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par collaborateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les collaborateurs</SelectItem>
            {collaborateurs?.map((collaborateur: any) => (
              <SelectItem 
                key={collaborateur.id} 
                value={`${collaborateur.prenom} ${collaborateur.nom}`}
              >
                {collaborateur.prenom} {collaborateur.nom}
              </SelectItem>
            ))}
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
          {isLoadingTasks || isLoadingCollabs ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
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
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucun événement trouvé pour cette date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Planning;
