// Rendu imprimable de la FACTURE — PORT FIDÈLE de facture-app.html / printFacture().
// Le markup et les classes `.fct-*` reproduisent à l'identique le document vanilla.
import { forwardRef } from 'react';
import type { ClientSpec } from '@/lib/spec/fiscal';
import type { Prestation } from '@/lib/spec/facturePrestations';
import type { CabinetConfig } from '@/lib/spec/cabinetConfig';
import { FACTURE_PRINT_CSS, PRINT_PAGE_FRAME_CSS } from '@/lib/spec/printStyles';

export interface FacturePrintData {
  number: string;
  date: string;
  client: ClientSpec;
  prestations: Prestation[];
  totalImpots: number;
  totalHonoraires: number;
  total: number;
}

interface Props {
  data: FacturePrintData;
  config: CabinetConfig;
}

// Formatage monétaire identique au vanilla : « F » sur les lignes, « F CFA »
// sur les totaux et sous-totaux.
const fShort = (n: number) => `${Math.round(n || 0).toLocaleString('fr-FR')} F`;
const fCFA = (n: number) => `${Math.round(n || 0).toLocaleString('fr-FR')} F CFA`;

const PrintableFacture = forwardRef<HTMLDivElement, Props>(({ data, config }, ref) => {
  let dateStr = 'N/A';
  try {
    dateStr = new Date(data.date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    /* noop */
  }

  const c = data.client;
  const villeLine = [c.ville, c.quartier].filter(Boolean).join(' - ');

  return (
    <div ref={ref} className="prisma-printable">
      <style dangerouslySetInnerHTML={{ __html: PRINT_PAGE_FRAME_CSS + FACTURE_PRINT_CSS }} />
      {/* Réplique du conteneur vanilla : <div class="max-w-4xl mx-auto bg-white p-8 print-area" id="printArea"> */}
      <div className="prisma-print-page print-area">
        {/* En-tête */}
        <div className="fct-header-top">
          <div>
            <div className="fct-company-name">{config.nomCabinet}</div>
            <div className="fct-company-sub">{config.slogan}</div>
            <div className="fct-company-info">
              Siège Social : {config.siege}
              <br />
              Tél : {config.telephone}
              <br />
              N.I.U : {config.niu}
            </div>
          </div>
          <div>
            <div className="fct-title-facture">FACTURE</div>
            <div className="fct-header-date">Date : {dateStr}</div>
          </div>
        </div>
        <div className="fct-divider" />

        {/* Numéro + Facturé à */}
        <div className="fct-meta">
          <div className="fct-meta-num">
            <div className="fct-meta-num-label">Numéro de facture</div>
            <div className="fct-meta-num-value">{data.number}</div>
          </div>
          <div className="fct-meta-client">
            <div className="fct-meta-client-label">Facturé à :</div>
            <div className="fct-meta-client-name">{c.name || 'Client'}</div>
            {c.niu && <div className="fct-meta-client-info">NIU : {c.niu}</div>}
            {villeLine && <div className="fct-meta-client-info">{villeLine}</div>}
            {c.contact && <div className="fct-meta-client-info">Contact : {c.contact}</div>}
          </div>
        </div>

        {/* Tableau prestations */}
        <table className="fct-table">
          <thead>
            <tr className="fct-thead-info">
              <td colSpan={5}>
                {config.nomCabinet} &nbsp;·&nbsp; Facture {data.number} &nbsp;·&nbsp; {c.name} &nbsp;·&nbsp; {dateStr}
              </td>
            </tr>
            <tr>
              <th style={{ width: '8%', textAlign: 'center' }}>N°</th>
              <th style={{ width: '48%', textAlign: 'left' }}>Désignation</th>
              <th style={{ width: '10%', textAlign: 'center' }}>Qté</th>
              <th style={{ width: '17%', textAlign: 'right' }}>Prix Unitaire</th>
              <th style={{ width: '17%', textAlign: 'right' }}>Montant</th>
            </tr>
          </thead>
          <tbody>
            {data.prestations.map((p, i) => {
              const isImpot = p.type === 'Impôt';
              return (
                <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ textAlign: 'center', padding: '6px 8px' }}>{i + 1}</td>
                  <td style={{ padding: '6px 8px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '8pt',
                        fontWeight: 600,
                        backgroundColor: isImpot ? '#dbeafe' : '#d1fae5',
                        color: isImpot ? '#1d4ed8' : '#059669',
                      }}
                    >
                      {p.type}
                    </span>
                    <span style={{ marginLeft: '4px' }}>{p.designation}</span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '6px 8px' }}>{p.qty}</td>
                  <td style={{ textAlign: 'right', padding: '6px 8px' }}>{fShort(p.price)}</td>
                  <td style={{ textAlign: 'right', padding: '6px 8px', fontWeight: 600, color: '#1e3a8a' }}>
                    {fShort(p.total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} style={{ textAlign: 'right', fontSize: '11pt', padding: '9px 8px' }}>
                TOTAL À PAYER
              </td>
              <td style={{ textAlign: 'right', fontSize: '13pt', padding: '9px 8px' }}>{fCFA(data.total)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Sous-totaux + paiement + signature (groupe insécable) */}
        <div className="fct-bottom-table">
          <div className="fct-summary-wrap">
            <div className="fct-summary">
              <div className="fct-box-impots">
                <div className="fct-box-impots-title">Total Impôts</div>
                <div className="fct-box-impots-amount">{fCFA(data.totalImpots)}</div>
              </div>
              <div className="fct-box-honoraires">
                <div className="fct-box-honoraires-title">Total Honoraires</div>
                <div className="fct-box-honoraires-amount">{fCFA(data.totalHonoraires)}</div>
              </div>
            </div>
          </div>
          <div className="fct-payment-signature-group">
            <div className="fct-payment">
              <div className="fct-payment-title">Informations de paiement</div>
              <div className="fct-payment-info">
                <strong>Mode de paiement :</strong> {config.modePaiement}
                <br />
                <strong>Numéros :</strong> {config.numerosPaiement}
                <br />
                <strong>Échéance :</strong> {config.echeanceFacture}
              </div>
            </div>
            <div className="fct-sig-wrap">
              <div className="fct-signature-block">
                {config.cachet && (
                  <div className="fct-sig-cachet-wrap">
                    <img src={config.cachet} alt="Cachet" style={{ maxHeight: '65px', display: 'block' }} />
                  </div>
                )}
                <div className="fct-sig-inner">
                  <div className="fct-sig-label">Pour {config.nomCabinet}</div>
                  {config.signature && (
                    <img
                      src={config.signature}
                      alt="Signature"
                      style={{ maxHeight: '45px', display: 'block', margin: '4px auto' }}
                    />
                  )}
                  <div className="fct-sig-line">
                    <div className="fct-sig-name">{config.signataireNom}</div>
                    <div className="fct-sig-title">{config.signataireTitre}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="fct-footer">
              <strong style={{ color: '#1e3a8a' }}>PRISMA Manager</strong> — PRISMA GESTION : L'expertise qui
              sécurise votre gestion.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PrintableFacture.displayName = 'PrintableFacture';
export default PrintableFacture;
