import { supabase } from "@/integrations/supabase/client";
import { getCiviliteLongue } from "@/lib/spec/fiscal";

// ─── Types ───────────────────────────────────────────────────────────────────

export type MissionDocType =
  | "ordre_missionnaire"
  | "ordre_superviseur"
  | "ordre_client"
  | "rapport_superviseur"
  | "rapport_client";

export interface RapportMissionJSON {
  objet: string;
  periode: string;
  travaux_realises: string[];
  constatations: string[];
  anomalies: string[];
  recommandations: string[];
  conclusion: string;
}

export interface RapportParsed extends RapportMissionJSON {
  format: "json" | "md" | "txt";
}

export interface MissionInfo {
  id: string;
  title: string;
  start_date: string | null;
  end_date: string | null;
  collaborateur_id: string;
  client_id: string | null;
}

export interface CollaborateurInfo {
  id: string;
  nom: string;
  prenom: string;
  poste: string;
}

export interface ClientInfo {
  id: string;
  nom: string | null;
  raisonsociale: string | null;
  type: string;
  niu: string | null;
  ville: string | null;
  civilite?: string | null;
}

// ─── Référence ────────────────────────────────────────────────────────────────

const genRef = (prefix: string) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const uid = Date.now().toString(36).toUpperCase().slice(-4);
  return `${prefix}-${uid}/${y}/${m}`;
};

// ─── Superviseur ──────────────────────────────────────────────────────────────

export const getSuperviseur = async (): Promise<CollaborateurInfo | null> => {
  const roles = ["expert-comptable", "gestionnaire", "comptable"];
  for (const role of roles) {
    const { data } = await supabase
      .from("collaborateurs")
      .select("id, nom, prenom, poste")
      .eq("statut", "actif")
      .eq("poste", role)
      .order("nom", { ascending: true })
      .limit(1)
      .single();
    if (data) return data as CollaborateurInfo;
  }
  return null;
};

// ─── Formatage date ───────────────────────────────────────────────────────────

const fmtDate = (iso: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const today = () =>
  new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// ─── Nom client ───────────────────────────────────────────────────────────────

const clientNom = (c: ClientInfo) =>
  c.type === "morale" ? (c.raisonsociale ?? "") : (c.nom ?? "");

// ─── Nom collaborateur ────────────────────────────────────────────────────────

const collabNom = (c: CollaborateurInfo) => `${c.prenom} ${c.nom}`.trim();

// ─── Corps des documents ──────────────────────────────────────────────────────

const buildOrdreMissionnaire = (
  ref: string,
  mission: MissionInfo,
  missionnaire: CollaborateurInfo,
  superviseur: CollaborateurInfo | null,
  client: ClientInfo,
): { sujet: string; corps: string } => ({
  sujet: `Ordre de mission N° ${ref} — ${mission.title}`,
  corps: `ORDRE DE MISSION N° ${ref}

Il vous est donné ordre de vous rendre auprès de :

${clientNom(client)}
NIU : ${client.niu ?? "[NIU non renseigné]"}
Localité : ${client.ville ?? "[Ville non renseignée]"}

à l'effet d'effectuer les travaux ci-après désignés :

OBJET : ${mission.title}
PÉRIODE D'INTERVENTION : Du ${fmtDate(mission.start_date)} au ${fmtDate(mission.end_date)}

INSTRUCTIONS DU SUPERVISEUR :
Vous êtes prié(e) de :
- Procéder à la vérification complète des documents et pièces comptables mis à votre disposition par le client
- Établir un rapport détaillé de vos travaux à soumettre au superviseur de la mission
- Respecter la confidentialité absolue des informations collectées
- Signaler immédiatement tout obstacle ou irrégularité majeure au superviseur

À l'issue de la mission, vous déposerez un rapport de mission comportant : vos constatations, les travaux réalisés, les anomalies relevées et vos recommandations.

Yaoundé, le ${today()}

Le Superviseur de la Mission
${superviseur ? collabNom(superviseur) : "La Direction"}
PRISMA GESTION`,
});

const buildOrdreSuperviseur = (
  ref: string,
  mission: MissionInfo,
  missionnaire: CollaborateurInfo,
  client: ClientInfo,
): { sujet: string; corps: string } => ({
  sujet: `Ordre de mission N° ${ref} — Copie Superviseur`,
  corps: `ORDRE DE MISSION N° ${ref}
(COPIE SUPERVISEUR — CONFIDENTIEL)

Mission confiée à : ${collabNom(missionnaire)}
Poste : ${missionnaire.poste}

CLIENT CONCERNÉ :
${clientNom(client)} | NIU : ${client.niu ?? "—"} | ${client.ville ?? "—"}

OBJET DE LA MISSION : ${mission.title}
PÉRIODE : Du ${fmtDate(mission.start_date)} au ${fmtDate(mission.end_date)}

POINTS D'ATTENTION POUR LE SUPERVISEUR :
- Vérifier l'exhaustivité du rapport de mission avant transmission au client
- Valider les constatations et recommandations formulées par le missionnaire
- S'assurer de l'absence d'informations sensibles internes dans la version client
- Approuver le rapport avant archivage dans le dossier client

SUIVI :
Le missionnaire est tenu de vous informer de l'avancement des travaux et de tout incident survenu en cours de mission.

Yaoundé, le ${today()}

Direction - PRISMA GESTION`,
});

const buildOrdreClient = (
  ref: string,
  mission: MissionInfo,
  missionnaire: CollaborateurInfo,
  client: ClientInfo,
): { sujet: string; corps: string } => {
  const civilite = getCiviliteLongue(client.civilite as "M." | "Mme" | undefined);
  const destinataire = clientNom(client);
  return {
    sujet: `Lettre de mission — ${mission.title}`,
    corps: `${civilite} ${destinataire},

Nous avons l'honneur de porter à votre connaissance que notre cabinet mandate ${collabNom(missionnaire)} pour effectuer une intervention auprès de votre structure dans le cadre de la mission ci-dessous définie.

OBJET DE LA MISSION : ${mission.title}
PÉRIODE D'INTERVENTION : Du ${fmtDate(mission.start_date)} au ${fmtDate(mission.end_date)}

Nous vous remercions de bien vouloir réserver à notre collaborateur(trice) le meilleur accueil et de mettre à sa disposition tous les documents et informations nécessaires à la bonne exécution de sa mission.

À l'issue des travaux, un rapport vous sera transmis.

Dans l'attente de votre coopération, nous vous prions d'agréer, ${civilite}, l'expression de nos salutations distinguées.

Yaoundé, le ${today()}

La Direction
PRISMA GESTION`,
  };
};

const buildRapportSuperviseur = (
  ref: string,
  mission: MissionInfo,
  missionnaire: CollaborateurInfo,
  superviseur: CollaborateurInfo | null,
  client: ClientInfo,
  rapport: RapportParsed,
): { sujet: string; corps: string } => {
  const fmtList = (items: string[]) =>
    items.length ? items.map((i) => `- ${i}`).join("\n") : "Aucun élément signalé.";

  return {
    sujet: `Rapport de mission N° ${ref} — ${clientNom(client)} (Superviseur)`,
    corps: `RAPPORT DE MISSION N° ${ref}
(RAPPORT SUPERVISEUR — CONFIDENTIEL)

CLIENT : ${clientNom(client)} | NIU : ${client.niu ?? "—"} | ${client.ville ?? "—"}
MISSIONNAIRE : ${collabNom(missionnaire)}
OBJET : ${rapport.objet}
PÉRIODE : ${rapport.periode}

1. TRAVAUX RÉALISÉS
${fmtList(rapport.travaux_realises)}

2. CONSTATATIONS
${fmtList(rapport.constatations)}

3. ANOMALIES ET POINTS D'ATTENTION
${fmtList(rapport.anomalies)}

4. RECOMMANDATIONS
${fmtList(rapport.recommandations)}

5. CONCLUSION
${rapport.conclusion}

---
Rapport établi par : ${collabNom(missionnaire)}
Date de soumission : ${today()}
Superviseur : ${superviseur ? collabNom(superviseur) : "La Direction"}`,
  };
};

const buildRapportClient = (
  ref: string,
  mission: MissionInfo,
  missionnaire: CollaborateurInfo,
  client: ClientInfo,
  rapport: RapportParsed,
): { sujet: string; corps: string } => {
  const civilite = getCiviliteLongue(client.civilite as "M." | "Mme" | undefined);
  const fmtList = (items: string[]) =>
    items.length ? items.map((i) => `- ${i}`).join("\n") : "Aucun élément à signaler.";

  return {
    sujet: `Rapport de mission — ${rapport.objet}`,
    corps: `${civilite} ${clientNom(client)},

Veuillez trouver ci-après le rapport de la mission d'intervention effectuée auprès de votre structure.

OBJET : ${rapport.objet}
PÉRIODE : ${rapport.periode}

1. TRAVAUX RÉALISÉS
${fmtList(rapport.travaux_realises)}

2. CONSTATATIONS
${fmtList(rapport.constatations)}

3. RECOMMANDATIONS
${fmtList(rapport.recommandations)}

4. CONCLUSION
${rapport.conclusion}

Nous restons à votre disposition pour toute clarification.

Veuillez agréer, ${civilite}, l'expression de nos salutations distinguées.

Yaoundé, le ${today()}

La Direction
PRISMA GESTION`,
  };
};

// ─── Insertion courrier ───────────────────────────────────────────────────────

const insertCourrier = async (opts: {
  reference: string;
  client: ClientInfo;
  sujet: string;
  corps: string;
  taskId: string;
  docType: MissionDocType;
  destinataireNom?: string;
}) => {
  const { data, error } = await supabase
    .from("courriers")
    .insert({
      reference: opts.reference,
      client_id: opts.client.id,
      client_nom: opts.destinataireNom ?? clientNom(opts.client),
      template_id: `mission_${opts.docType}`,
      template_titre: opts.sujet,
      sujet: opts.sujet,
      contenu: opts.corps,
      statut: "envoye",
      mode_envoi: "remise_en_main_propre",
      date_creation: new Date().toISOString(),
      date_envoi: new Date().toISOString(),
      task_id: opts.taskId,
      mission_doc_type: opts.docType,
    } as never)
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
};

// ─── Génération ordre de mission ──────────────────────────────────────────────

export const genererOrdreMission = async (
  mission: MissionInfo,
): Promise<{ missionnaire: string; superviseur: string; client: string }> => {
  const [missFetch, clientFetch, superviseur] = await Promise.all([
    supabase
      .from("collaborateurs")
      .select("id, nom, prenom, poste")
      .eq("id", mission.collaborateur_id)
      .single(),
    mission.client_id
      ? supabase
          .from("clients")
          .select("id, nom, raisonsociale, type, niu, ville, civilite")
          .eq("id", mission.client_id)
          .single()
      : Promise.resolve({ data: null }),
    getSuperviseur(),
  ]);

  if (missFetch.error || !missFetch.data)
    throw new Error("Missionnaire introuvable");

  const missionnaire = missFetch.data as CollaborateurInfo;
  const client: ClientInfo = clientFetch.data
    ? (clientFetch.data as ClientInfo)
    : { id: "", nom: "Client non renseigné", raisonsociale: null, type: "physique", niu: null, ville: null };

  const refBase = genRef("OM");

  const [docMiss, docSuperv, docClient] = await Promise.all([
    (() => {
      const { sujet, corps } = buildOrdreMissionnaire(refBase, mission, missionnaire, superviseur, client);
      return insertCourrier({
        reference: `${refBase}-M`,
        client,
        sujet,
        corps,
        taskId: mission.id,
        docType: "ordre_missionnaire",
        destinataireNom: collabNom(missionnaire),
      });
    })(),
    (() => {
      const { sujet, corps } = buildOrdreSuperviseur(refBase, mission, missionnaire, client);
      return insertCourrier({
        reference: `${refBase}-S`,
        client,
        sujet,
        corps,
        taskId: mission.id,
        docType: "ordre_superviseur",
        destinataireNom: superviseur ? collabNom(superviseur) : "La Direction",
      });
    })(),
    (() => {
      const { sujet, corps } = buildOrdreClient(refBase, mission, missionnaire, client);
      return insertCourrier({
        reference: `${refBase}-C`,
        client,
        sujet,
        corps,
        taskId: mission.id,
        docType: "ordre_client",
      });
    })(),
  ]);

  return { missionnaire: docMiss, superviseur: docSuperv, client: docClient };
};

// ─── Parsing du rapport ───────────────────────────────────────────────────────

const parseSection = (text: string, ...keys: string[]): string[] => {
  for (const key of keys) {
    const re = new RegExp(`(?:^|\\n)${key}\\s*:?\\s*\\n([\\s\\S]*?)(?=\\n[A-ZÉÈÀÙÔÎÊÂ][A-ZÉÈÀÙÔÎÊÂa-z\\s]+\\s*:?\\s*\\n|$)`, "i");
    const m = text.match(re);
    if (m) {
      return m[1]
        .split(/\r?\n/)
        .map((l) => l.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean);
    }
  }
  return [];
};

const parseSingleField = (text: string, ...keys: string[]): string => {
  for (const key of keys) {
    const re = new RegExp(`(?:^|\\n)(?:\\*\\*)?${key}(?:\\*\\*)?\\s*:?\\s*(.+)`, "i");
    const m = text.match(re);
    if (m) return m[1].trim().replace(/\*\*/g, "");
  }
  return "";
};

export const parseRapportFile = (content: string, format: "json" | "md" | "txt"): RapportParsed => {
  if (format === "json") {
    try {
      const parsed = JSON.parse(content) as Partial<RapportMissionJSON>;
      return {
        format,
        objet: parsed.objet ?? "",
        periode: parsed.periode ?? "",
        travaux_realises: Array.isArray(parsed.travaux_realises) ? parsed.travaux_realises : [],
        constatations: Array.isArray(parsed.constatations) ? parsed.constatations : [],
        anomalies: Array.isArray(parsed.anomalies) ? parsed.anomalies : [],
        recommandations: Array.isArray(parsed.recommandations) ? parsed.recommandations : [],
        conclusion: parsed.conclusion ?? "",
      };
    } catch {
      throw new Error("Fichier JSON invalide. Vérifiez le format.");
    }
  }

  // MD ou TXT : parsing par sections
  return {
    format,
    objet: parseSingleField(content, "Objet", "OBJET", "objet"),
    periode: parseSingleField(content, "Période", "PERIODE", "période"),
    travaux_realises: parseSection(content, "Travaux réalisés", "TRAVAUX REALISES", "Travaux", "travaux"),
    constatations: parseSection(content, "Constatations", "CONSTATATIONS"),
    anomalies: parseSection(content, "Anomalies", "ANOMALIES"),
    recommandations: parseSection(content, "Recommandations", "RECOMMANDATIONS"),
    conclusion: parseSingleField(content, "Conclusion", "CONCLUSION")
      || parseSection(content, "Conclusion", "CONCLUSION").join(" "),
  };
};

// ─── Soumission du rapport de mission ────────────────────────────────────────

export const soumettrRapportMission = async (
  mission: MissionInfo,
  file: File,
): Promise<{ rapportId: string; superviseurId: string; clientId: string }> => {
  // Lire le fichier
  const content = await file.text();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "txt";
  const format = (["json", "md", "txt"].includes(ext) ? ext : "txt") as "json" | "md" | "txt";

  // Parser le contenu
  const rapport = parseRapportFile(content, format);

  // Charger missionnaire, client et superviseur
  const [missFetch, clientFetch, superviseur] = await Promise.all([
    supabase
      .from("collaborateurs")
      .select("id, nom, prenom, poste")
      .eq("id", mission.collaborateur_id)
      .single(),
    mission.client_id
      ? supabase
          .from("clients")
          .select("id, nom, raisonsociale, type, niu, ville, civilite")
          .eq("id", mission.client_id)
          .single()
      : Promise.resolve({ data: null }),
    getSuperviseur(),
  ]);

  if (missFetch.error || !missFetch.data) throw new Error("Missionnaire introuvable");
  const missionnaire = missFetch.data as CollaborateurInfo;
  const client: ClientInfo = clientFetch.data
    ? (clientFetch.data as ClientInfo)
    : { id: "", nom: "Client non renseigné", raisonsociale: null, type: "physique", niu: null, ville: null };

  // Uploader le fichier dans le bucket (best-effort)
  let filePath: string | null = null;
  const storagePath = `missions/${mission.id}/${Date.now()}_${file.name}`;
  const { data: uploadData } = await supabase.storage
    .from("rapports-mission")
    .upload(storagePath, file, { upsert: false });
  if (uploadData) filePath = uploadData.path;

  const refBase = genRef("RM");

  // Créer les 2 courriers
  const [superviseurId, clientId] = await Promise.all([
    (() => {
      const { sujet, corps } = buildRapportSuperviseur(refBase, mission, missionnaire, superviseur, client, rapport);
      return insertCourrier({
        reference: `${refBase}-S`,
        client,
        sujet,
        corps,
        taskId: mission.id,
        docType: "rapport_superviseur",
        destinataireNom: superviseur ? collabNom(superviseur) : "La Direction",
      });
    })(),
    (() => {
      const { sujet, corps } = buildRapportClient(refBase, mission, missionnaire, client, rapport);
      return insertCourrier({
        reference: `${refBase}-C`,
        client,
        sujet,
        corps,
        taskId: mission.id,
        docType: "rapport_client",
      });
    })(),
  ]);

  // Sauvegarder le rapport dans la table rapports_mission
  const { data: rapportRow, error: rapportErr } = await supabase
    .from("rapports_mission")
    .insert({
      task_id: mission.id,
      file_format: format,
      contenu_parse: content,
      file_path: filePath,
      statut: "traite",
      rapport_superviseur_id: superviseurId,
      rapport_client_id: clientId,
    } as never)
    .select("id")
    .single();

  if (rapportErr) throw rapportErr;

  return { rapportId: (rapportRow as { id: string }).id, superviseurId, clientId };
};

// ─── Lecture des documents de mission ─────────────────────────────────────────

export const getDocumentsMission = async (taskId: string) => {
  const { data, error } = await supabase
    .from("courriers")
    .select("id, reference, sujet, mission_doc_type, statut, date_creation")
    .eq("task_id" as never, taskId)
    .order("date_creation", { ascending: true });

  if (error) return [];
  return data as Array<{
    id: string;
    reference: string;
    sujet: string;
    mission_doc_type: string;
    statut: string;
    date_creation: string;
  }>;
};

export const getRapportsMission = async (taskId: string) => {
  const { data, error } = await supabase
    .from("rapports_mission")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
};

// ─── Schéma JSON de référence (pour documentation inline) ────────────────────

export const RAPPORT_JSON_SCHEMA_EXEMPLE: RapportMissionJSON = {
  objet: "Audit fiscal annuel - Exercice 2025",
  periode: "Janvier 2025 - Décembre 2025",
  travaux_realises: [
    "Vérification des déclarations fiscales mensuelles",
    "Analyse des charges déductibles",
    "Contrôle de la conformité des factures",
  ],
  constatations: [
    "Conformité générale des déclarations IGS",
    "Retard dans le dépôt de la DSF 2024",
  ],
  anomalies: [
    "Factures sans numéro détectées en octobre 2025",
  ],
  recommandations: [
    "Régulariser la DSF 2024 dans les 30 jours",
    "Mettre en place un suivi mensuel des factures",
  ],
  conclusion:
    "La mission s'est déroulée conformément au programme de travail établi. Les irrégularités constatées nécessitent une attention particulière dans les délais indiqués.",
};
