import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  Clock, 
  FileText, 
  Menu, 
  Receipt, 
  Wallet,
  ChevronRight
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const handleNewTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Ici nous simulons l'ajout d'une tâche
    toast({
      title: "Tâche créée",
      description: "La nouvelle tâche a été créée avec succès",
    });
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/collaborateurs", icon: Users, label: "Collaborateurs" },
    { path: "/clients", icon: Users, label: "Clients" },
    { path: "/missions", icon: Briefcase, label: "Missions" },
    { path: "/planning", icon: Calendar, label: "Planning" },
    { path: "/temps", icon: Clock, label: "Temps" },
    { path: "/facturation", icon: Receipt, label: "Facturation" },
    { path: "/depenses", icon: Wallet, label: "Dépenses" },
    { path: "/rapports", icon: FileText, label: "Rapports" }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-neutral-200 transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h1
              className={`font-semibold text-neutral-800 transition-opacity duration-300 ${
                !isSidebarOpen && "opacity-0 hidden"
              }`}
            >
              Cabinet XYZ
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
              aria-label={isSidebarOpen ? "Réduire le menu" : "Agrandir le menu"}
            >
              <Menu className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link group relative ${
                isActiveRoute(item.path) && "active"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span
                className={`transition-opacity duration-300 ${
                  !isSidebarOpen && "opacity-0 hidden"
                }`}
              >
                {item.label}
              </span>
              {!isSidebarOpen && (
                <div className="absolute left-14 bg-neutral-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
              {isActiveRoute(item.path) && (
                <ChevronRight className={`w-4 h-4 ml-auto ${!isSidebarOpen && "hidden"}`} />
              )}
            </Link>
          ))}
        </nav>

        <div className={`p-4 border-t border-neutral-200 ${!isSidebarOpen && "flex justify-center"}`}>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-neutral-100">
        <header className="bg-white border-b border-neutral-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-800">
                Tableau de bord
              </h1>
              <p className="text-neutral-600 mt-1">
                Bienvenue sur votre espace de gestion
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Nouvelle tâche</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle tâche</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleNewTask} className="space-y-4">
                  <div>
                    <Label htmlFor="taskName">Nom de la tâche</Label>
                    <Input id="taskName" required />
                  </div>
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Input id="client" required />
                  </div>
                  <div>
                    <Label htmlFor="assignedTo">Assigné à</Label>
                    <Input id="assignedTo" required />
                  </div>
                  <Button type="submit">Créer la tâche</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-8">
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
        </div>
      </main>
    </div>
  );
};

export default Index;