// SPEC_LOVABLE.md §3 — UI de configuration du cabinet
// (identité, signataire, signature, cachet, coordonnées de paiement).
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, Save, Building2, PenSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  useCabinetConfig,
  fileToDataURL,
  type CabinetConfig,
} from '@/lib/spec/cabinetConfig';

export default function CabinetConfigSettings() {
  const [config, setConfig] = useCabinetConfig();
  const [draft, setDraft] = useState<CabinetConfig>(config);
  const [saving, setSaving] = useState(false);
  const sigRef = useRef<HTMLInputElement>(null);
  const cachetRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const update = <K extends keyof CabinetConfig>(key: K, value: CabinetConfig[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'signature' | 'cachet',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Format invalide', description: 'Veuillez sélectionner une image.', variant: 'destructive' });
      return;
    }
    if (file.size > 1024 * 1024) {
      toast({ title: 'Image trop lourde', description: "L'image dépasse 1 Mo.", variant: 'destructive' });
      return;
    }
    const dataUrl = await fileToDataURL(file);
    update(field, dataUrl);
  };

  const handleSave = () => {
    setSaving(true);
    try {
      setConfig(draft);
      toast({ title: 'Configuration enregistrée', description: 'Les modèles imprimables utilisent désormais ces informations.' });
    } catch {
      toast({ title: 'Erreur', description: "Impossible d'enregistrer la configuration.", variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="w-4 h-4" /> Identité du cabinet
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Nom du cabinet</Label>
            <Input value={draft.nomCabinet} onChange={(e) => update('nomCabinet', e.target.value)} />
          </div>
          <div>
            <Label>Slogan</Label>
            <Input value={draft.slogan} onChange={(e) => update('slogan', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Siège social</Label>
            <Input value={draft.siege} onChange={(e) => update('siege', e.target.value)} />
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input value={draft.telephone} onChange={(e) => update('telephone', e.target.value)} />
          </div>
          <div>
            <Label>NIU</Label>
            <Input value={draft.niu} onChange={(e) => update('niu', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PenSquare className="w-4 h-4" /> Signataire & visuels
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Nom du signataire</Label>
            <Input value={draft.signataireNom} onChange={(e) => update('signataireNom', e.target.value)} />
          </div>
          <div>
            <Label>Titre / fonction</Label>
            <Input value={draft.signataireTitre} onChange={(e) => update('signataireTitre', e.target.value)} />
          </div>

          <div>
            <Label>Signature (image)</Label>
            <input
              ref={sigRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => handleFile(e, 'signature')}
            />
            <div className="flex items-center gap-2 mt-1">
              <Button type="button" variant="outline" size="sm" onClick={() => sigRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1" />
                {draft.signature ? 'Remplacer' : 'Téléverser'}
              </Button>
              {draft.signature && (
                <Button type="button" variant="ghost" size="sm" onClick={() => update('signature', undefined)}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {draft.signature && (
              <img src={draft.signature} alt="Signature" className="mt-2 max-h-16 border rounded p-1 bg-white" />
            )}
          </div>

          <div>
            <Label>Cachet (image)</Label>
            <input
              ref={cachetRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => handleFile(e, 'cachet')}
            />
            <div className="flex items-center gap-2 mt-1">
              <Button type="button" variant="outline" size="sm" onClick={() => cachetRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1" />
                {draft.cachet ? 'Remplacer' : 'Téléverser'}
              </Button>
              {draft.cachet && (
                <Button type="button" variant="ghost" size="sm" onClick={() => update('cachet', undefined)}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {draft.cachet && (
              <img src={draft.cachet} alt="Cachet" className="mt-2 max-h-20 border rounded p-1 bg-white" />
            )}
          </div>

          <div className="sm:col-span-2">
            <Label>Mention de pied de page</Label>
            <Textarea
              rows={2}
              value={draft.signaturePromo}
              onChange={(e) => update('signaturePromo', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coordonnées de paiement (par défaut)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Mode de paiement</Label>
            <Input value={draft.modePaiement} onChange={(e) => update('modePaiement', e.target.value)} />
          </div>
          <div>
            <Label>Numéros</Label>
            <Input value={draft.numerosPaiement} onChange={(e) => update('numerosPaiement', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Échéance facture</Label>
            <Input value={draft.echeanceFacture} onChange={(e) => update('echeanceFacture', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} style={{ backgroundColor: '#1e3a8a' }}>
          <Save className="w-4 h-4 mr-2" />
          Enregistrer la configuration
        </Button>
      </div>
    </div>
  );
}
