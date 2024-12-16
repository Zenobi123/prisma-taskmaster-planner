import { useState } from "react";
import { Calendar, Users, Briefcase, Clock, FileText, Menu } from "lucide-react";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-neutral-200 p-4 transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1
            className={`font-semibold text-neutral-800 ${
              !isSidebarOpen && "hidden"
            }`}
          >
            Cabinet XYZ
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <Menu className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        <nav className="space-y-2">
          <a href="#" className="sidebar-link active">
            <Calendar className="w-5 h-5" />
            {isSidebarOpen && <span>Planning</span>}
          </a>
          <a href="#" className="sidebar-link">
            <Users className="w-5 h-5" />
            {isSidebarOpen && <span>Collaborateurs</span>}
          </a>
          <a href="#" className="sidebar-link">
            <Users className="w-5 h-5" />
            {isSidebarOpen && <span>Clients</span>}
          </a>
          <a href="#" className="sidebar-link">
            <Briefcase className="w-5 h-5" />
            {isSidebarOpen && <span>Missions</span>}
          </a>
          <a href="#" className="sidebar-link">
            <Clock className="w-5 h-5" />
            {isSidebarOpen && <span>Temps</span>}
          </a>
          <a href="#" className="sidebar-link">
            <FileText className="w-5 h-5" />
            {isSidebarOpen && <span>Rapports</span>}
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-800">
                Tableau de bord
              </h1>
              <p className="text-neutral-600 mt-1">
                Bienvenue sur votre espace de gestion
              </p>
            </div>
            <button className="btn-primary">Nouvelle tâche</button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="font-semibold text-neutral-800 mb-4">
              Tâches en cours
            </h3>
            <div className="text-3xl font-bold text-primary">12</div>
            <p className="text-neutral-600 text-sm mt-1">Cette semaine</p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-neutral-800 mb-4">
              Heures travaillées
            </h3>
            <div className="text-3xl font-bold text-primary">156</div>
            <p className="text-neutral-600 text-sm mt-1">Ce mois</p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-neutral-800 mb-4">
              Collaborateurs actifs
            </h3>
            <div className="text-3xl font-bold text-primary">8</div>
            <p className="text-neutral-600 text-sm mt-1">Sur 10</p>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-neutral-800 mb-6">
            Tâches récentes
          </h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Tâche</th>
                  <th>Client</th>
                  <th>Assigné à</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bilan annuel</td>
                  <td>SARL Example</td>
                  <td>Marie D.</td>
                  <td>
                    <span className="badge badge-green">En cours</span>
                  </td>
                </tr>
                <tr>
                  <td>Déclaration TVA</td>
                  <td>SAS Tech</td>
                  <td>Pierre M.</td>
                  <td>
                    <span className="badge badge-gray">En attente</span>
                  </td>
                </tr>
                <tr>
                  <td>Révision comptable</td>
                  <td>EURL Web</td>
                  <td>Sophie L.</td>
                  <td>
                    <span className="badge badge-green">En cours</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;