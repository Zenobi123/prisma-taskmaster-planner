
interface NotesSectionProps {
  notes: string | undefined;
}

export const NotesSection = ({ notes }: NotesSectionProps) => {
  if (!notes) return null;
  
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-neutral-500">Notes</h3>
      <p className="text-sm p-3 bg-neutral-50 rounded-md">{notes}</p>
    </div>
  );
};
