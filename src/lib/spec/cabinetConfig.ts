// SPEC_LOVABLE.md §3 — Configuration cabinet
import { useEffect, useState } from 'react';

export interface CabinetConfig {
  nomCabinet: string;
  slogan: string;
  siege: string;
  telephone: string;
  niu: string;
  signataireNom: string;
  signataireTitre: string;
  signature?: string; // data URL base64
  cachet?: string;    // data URL base64
  signaturePromo: string;
  // Coordonnées de paiement (SPEC §3.2)
  modePaiement: string;
  numerosPaiement: string;
  echeanceFacture: string;
}

export const DEFAULT_CABINET_CONFIG: CabinetConfig = {
  nomCabinet: 'PRISMA GESTION',
  slogan: 'Comptabilité - Finance - Fiscalité',
  siege: 'Yaoundé - Bata Longkak',
  telephone: '(237) 656 752 475 / 671 050 546',
  niu: 'M052116042979Z',
  signataireNom: 'OBIANG TIME Nathan',
  signataireTitre: 'Directeur Associé',
  signature: undefined,
  cachet: undefined,
  signaturePromo: "PRISMA Manager — PRISMA GESTION : L'expertise qui sécurise votre gestion.",
  modePaiement: 'Mobile Money / Espèces',
  numerosPaiement: '656 75 24 75 / 694 31 05 54 — OBIANG TIME Nathan',
  echeanceFacture: "30 jours à compter de la date d'émission",
};

const STORAGE_KEY = 'cabinetConfig';
const STORAGE_EVENT = 'cabinet-config-updated';

export function loadCabinetConfig(): CabinetConfig {
  if (typeof window === 'undefined') return DEFAULT_CABINET_CONFIG;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CABINET_CONFIG;
    const parsed = JSON.parse(raw) as Partial<CabinetConfig>;
    return { ...DEFAULT_CABINET_CONFIG, ...parsed };
  } catch {
    return DEFAULT_CABINET_CONFIG;
  }
}

export function saveCabinetConfig(cfg: CabinetConfig): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: cfg }));
}

export function useCabinetConfig(): [CabinetConfig, (cfg: CabinetConfig) => void] {
  const [cfg, setCfg] = useState<CabinetConfig>(() => loadCabinetConfig());

  useEffect(() => {
    const onUpdate = () => setCfg(loadCabinetConfig());
    window.addEventListener(STORAGE_EVENT, onUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) onUpdate();
    });
    return () => {
      window.removeEventListener(STORAGE_EVENT, onUpdate);
    };
  }, []);

  const update = (next: CabinetConfig) => {
    saveCabinetConfig(next);
    setCfg(next);
  };

  return [cfg, update];
}

// Convertit un fichier image en data URL base64
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
