
export interface Event {
  id: string;
  title: string;
  client: string;
  collaborateur: string;
  time: string;
  type: "mission" | "reunion";
}
