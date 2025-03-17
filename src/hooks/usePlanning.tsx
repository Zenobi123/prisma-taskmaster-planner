
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/taskService";
import { getCollaborateurs } from "@/services/collaborateurService";
import { Event } from "@/types/event";
import { transformTasksToEvents, extractDatesWithEvents, filterEvents } from "@/utils/planningUtils";

export const usePlanning = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [collaborateurFilter, setCollaborateurFilter] = useState("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [datesWithEvents, setDatesWithEvents] = useState<Date[]>([]);

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const { data: collaborateurs, isLoading: isLoadingCollabs } = useQuery({
    queryKey: ["collaborateurs"],
    queryFn: getCollaborateurs,
  });

  useEffect(() => {
    if (tasks && !isLoadingTasks) {
      // Use utility functions to transform data
      const transformedEvents = transformTasksToEvents(tasks);
      setEvents(transformedEvents);

      const uniqueDates = extractDatesWithEvents(tasks);
      setDatesWithEvents(uniqueDates);
    }
  }, [tasks, isLoadingTasks]);

  // Use the utility function to filter events
  const filteredEvents = tasks ? filterEvents(events, {
    collaborateurFilter,
    date,
    tasks
  }) : [];

  const getEventBadge = (type: string) => {
    switch (type) {
      case "mission":
        return "secondary";
      case "reunion":
        return "outline";
      default:
        return null;
    }
  };

  return {
    date,
    setDate,
    events,
    filteredEvents,
    collaborateurFilter,
    setCollaborateurFilter,
    datesWithEvents,
    collaborateurs,
    isLoading: isLoadingTasks || isLoadingCollabs,
    getEventBadge,
  };
};
