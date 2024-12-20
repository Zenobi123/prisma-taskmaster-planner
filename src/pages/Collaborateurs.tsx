import { Plus, Search } from "lucide-react";

const Collaborateurs = () => {
  return (
    <main className="flex-1 p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-800">
              Collaborateurs
            </h1>
            <p className="text-neutral-600 mt-1">
              Gérez votre équipe et leurs accès
            </p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouveau collaborateur
          </button>
        </div>
      </header>

      {/* Search and filters */}
      <div className="card mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Rechercher un collaborateur..."
              className="input-field pl-10"
            />
          </div>
          <button className="btn-secondary">Filtres</button>
        </div>
      </div>

      {/* Team members list */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Fonction</th>
                <th>Email</th>
                <th>Statut</th>
                <th>Date d'entrée</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">MD</span>
                  </div>
                  <span>Marie Dubois</span>
                </td>
                <td>Expert Comptable</td>
                <td>marie.d@cabinet.fr</td>
                <td>
                  <span className="badge badge-green">Actif</span>
                </td>
                <td>01/01/2023</td>
              </tr>
              <tr>
                <td className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">PL</span>
                  </div>
                  <span>Pierre Lambert</span>
                </td>
                <td>Comptable</td>
                <td>pierre.l@cabinet.fr</td>
                <td>
                  <span className="badge badge-green">Actif</span>
                </td>
                <td>15/03/2023</td>
              </tr>
              <tr>
                <td className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">SB</span>
                  </div>
                  <span>Sophie Bernard</span>
                </td>
                <td>Assistante comptable</td>
                <td>sophie.b@cabinet.fr</td>
                <td>
                  <span className="badge badge-gray">En congé</span>
                </td>
                <td>01/06/2023</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Collaborateurs;