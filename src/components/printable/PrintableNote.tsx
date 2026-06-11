// Rendu imprimable de la NOTE EXPLICATIVE — PORT FIDÈLE de note-app.html / displayNote().
import { forwardRef } from 'react';
import type { ClientSpec } from '@/lib/spec/fiscal';
import { getCiviliteLongue } from '@/lib/spec/fiscal';
import type { CabinetConfig } from '@/lib/spec/cabinetConfig';

export interface LigneNote {
  type: 'Impôt' | 'Honoraire';
  designation: string;
  montant: number;
}

export interface NotePrintData {
  number: string;
  date: string;
  client: ClientSpec;
  clientContact?: string;
  lignes: LigneNote[];
  totalImpots: number;
  totalHonoraires: number;
}

interface Props {
  data: NotePrintData;
  config: CabinetConfig;
}

const fCFA = (n: number) => `${Math.round(n || 0).toLocaleString('fr-FR')} F CFA`;

// Retire un préfixe de civilité (M., Mme, Monsieur, Madame) en tête du contact.
function stripCivilitePrefix(contact?: string): string {
  if (!contact) return '';
  return contact.replace(/^\s*(M\.|Mme\.?|Mr\.?|Monsieur|Madame|Mlle\.?)\s+/i, '').trim();
}

const PrintableNote = forwardRef<HTMLDivElement, Props>(({ data, config }, ref) => {
  const dateStr = new Date(data.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const c = data.client;
  const villeLine = [c.ville, c.quartier].filter(Boolean).join(' - ');
  const civiliteLongue = getCiviliteLongue(c.civilite);
  const contactSansCivilite = stripCivilitePrefix(data.clientContact);
  const destinataireContact = contactSansCivilite ? `${civiliteLongue} ${contactSansCivilite}` : civiliteLongue;
  const totalGeneral = data.totalImpots + data.totalHonoraires;

  const impots = data.lignes.filter((l) => l.type === 'Impôt');
  const honoraires = data.lignes.filter((l) => l.type === 'Honoraire');

  return (
    // Réplique du conteneur vanilla : <div class="max-w-4xl mx-auto bg-white p-12 print-area" id="printArea">
    <div
      ref={ref}
      className="prisma-printable print-area max-w-4xl mx-auto bg-white p-12"
      style={{ fontFamily: "'Inter', sans-serif", color: '#111827' }}
    >
      {/* En-tête */}
      <div className="flex justify-between items-start mb-4">
        <div className="font-bold">
          <h1 className="text-2xl text-blue-900">{config.nomCabinet}</h1>
          <p className="text-xs text-gray-600 uppercase tracking-widest">{config.slogan}</p>
          <div className="text-sm mt-2 text-gray-700">
            <p>Siège Social : {config.siege}</p>
            <p>Tél : {config.telephone}</p>
            <p>N.I.U : {config.niu}</p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>Yaoundé, le {dateStr}</p>
        </div>
      </div>

      <div style={{ borderBottom: '2px solid #1e3a8a', marginBottom: '1rem' }} />

      {/* Destinataire */}
      <div className="mb-6" style={{ marginLeft: 'auto', width: '50%' }}>
        <p className="font-bold text-lg">{c.name}</p>
        {c.niu && <p className="text-sm text-gray-600 mt-1">NIU : {c.niu}</p>}
        {villeLine && <p className="text-sm text-gray-600">{villeLine}</p>}
        {data.clientContact && (
          <p className="text-sm font-semibold text-blue-900 mt-2">À l'attention de {destinataireContact}</p>
        )}
      </div>

      <div className="mb-6">
        <p className="font-bold underline">
          Objet : Note explicative relative à la Note d'honoraire {data.number}
        </p>
      </div>

      <div className="text-gray-800 leading-relaxed space-y-2" style={{ fontSize: '0.9rem' }}>
        <p>{civiliteLongue},</p>

        <p>
          Suite à l'émission de notre Note d'honoraire en référence, nous vous adressons la présente pour vous
          apporter les précisions techniques nécessaires à la bonne compréhension de sa composition.
        </p>

        <h3 className="font-bold text-blue-900 mt-4 text-base">I. STRUCTURE DE LA FACTURATION</h3>

        <p>La note d'honoraire se décompose en deux catégories distinctes d'éléments :</p>

        <h4 className="font-semibold text-blue-900 mt-3 text-sm">
          A. Les paiements d'obligations fiscales (Total : {fCFA(data.totalImpots)})
        </h4>

        <p className="text-sm">
          Les postes ci-dessous constituent vos obligations fiscales exigibles auprès de l'Administration fiscale
          camerounaise, à savoir :
        </p>

        <ol className="list-decimal pl-6 space-y-1 text-sm">
          {impots.map((i, idx) => (
            <li key={`i${idx}`}>
              <strong>
                {i.designation} : {fCFA(i.montant)}
              </strong>
            </li>
          ))}
        </ol>

        <h5 className="font-semibold text-blue-800 mt-2 text-sm">Modalités de traitement :</h5>

        <p className="text-sm">
          En versant ces montants au Cabinet PRISMA GESTION, vous nous mandatez pour procéder au règlement desdites
          obligations fiscales auprès des Centres des Impôts compétents en votre nom et pour votre compte.
        </p>

        <p className="text-sm">
          À défaut de versement au Cabinet, il vous incombera, en votre qualité de contribuable, de vous acquitter
          directement de ces impositions auprès de l'Administration fiscale dans les délais légaux impartis.
        </p>

        <h4 className="font-semibold text-blue-900 mt-3 text-sm">
          B. Les honoraires pour prestations intellectuelles (Total : {fCFA(data.totalHonoraires)})
        </h4>

        <p className="text-sm">
          Les autres postes constituent la rémunération des prestations intellectuelles et techniques assurées par
          notre Cabinet, notamment :
        </p>

        <ol className="list-decimal pl-6 space-y-1 text-sm">
          {honoraires.map((h, idx) => (
            <li key={`h${idx}`}>
              <strong>
                {h.designation} : {fCFA(h.montant)}
              </strong>
            </li>
          ))}
        </ol>

        <h3 className="font-bold text-blue-900 mt-4 text-base">II. MONTANT TOTAL</h3>

        <p>Le montant global de la note d'honoraire s'établit donc comme suit :</p>

        <ul className="list-disc pl-6 space-y-1">
          <li>
            Impôts : <strong>{fCFA(data.totalImpots)}</strong>
          </li>
          <li>
            Honoraires prestations : <strong>{fCFA(data.totalHonoraires)}</strong>
          </li>
          <li className="font-bold text-blue-900">TOTAL GÉNÉRAL : {fCFA(totalGeneral)}</li>
        </ul>

        <p className="mt-3">
          Nous restons à votre entière disposition pour tout complément d'information que vous jugeriez utile
          concernant cette facturation.
        </p>

        <p>Veuillez agréer, {civiliteLongue}, l'expression de notre considération distinguée.</p>
      </div>

      {/* Signature */}
      <div className="mt-6 flex justify-end">
        <div className="flex items-center gap-4">
          {config.cachet && <img src={config.cachet} alt="Cachet" style={{ maxHeight: '70px' }} />}
          <div className="text-center">
            <p className="font-bold">Pour {config.nomCabinet}</p>
            {config.signature && (
              <img src={config.signature} alt="Signature" style={{ maxHeight: '50px', margin: '0.5rem auto' }} />
            )}
            <div style={{ borderTop: '1px solid #9ca3af', paddingTop: '0.25rem', marginTop: '0.5rem' }}>
              <p className="text-base font-bold">{config.signataireNom}</p>
              <p className="text-sm text-gray-600">Comptable - Fiscaliste</p>
              <p className="text-sm text-gray-600">{config.signataireTitre}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div style={{ marginTop: '2rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: 0 }}>
          <span style={{ fontWeight: 600, color: '#1e3a8a' }}>PRISMA Manager</span> — PRISMA GESTION : L'expertise
          qui sécurise votre gestion.
        </p>
      </div>
    </div>
  );
});

PrintableNote.displayName = 'PrintableNote';
export default PrintableNote;
