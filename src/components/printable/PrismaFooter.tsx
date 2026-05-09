// SPEC_LOVABLE.md §10.11 — Pied de page commun
interface Props {
  text?: string;
}

export default function PrismaFooter({ text }: Props) {
  return (
    <div
      style={{
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: 0 }}>
        <span style={{ fontWeight: 600, color: '#1e3a8a' }}>PRISMA Manager</span>
        {' — '}{text ?? "PRISMA GESTION : L'expertise qui sécurise votre gestion."}
      </p>
    </div>
  );
}
