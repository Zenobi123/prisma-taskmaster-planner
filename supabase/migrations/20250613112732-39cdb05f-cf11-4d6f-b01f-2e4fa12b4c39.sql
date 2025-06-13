
-- Ajouter une colonne deleted_at pour les suppressions soft
ALTER TABLE clients 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Créer un index pour optimiser les requêtes sur deleted_at
CREATE INDEX idx_clients_deleted_at ON clients(deleted_at);

-- Mettre à jour la contrainte de statut pour inclure 'supprime'
ALTER TABLE clients 
DROP CONSTRAINT IF EXISTS clients_statut_check;

ALTER TABLE clients 
ADD CONSTRAINT clients_statut_check 
CHECK (statut IN ('actif', 'inactif', 'archive', 'supprime'));
