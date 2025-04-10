
export interface Rapport {
  id: string;
  titre: string;
  date: string;
  type: "fiscal" | "client" | "financier" | "activite" | string;
  taille: string;
  createdAt: Date;
}

export interface ReportParameters {
  titre: string;
  startDate?: Date;
  endDate?: Date;
  clientId?: string;
  includeArchived?: boolean;
  includeDetails?: boolean;
}
