import { useState } from "react";
import {
  Calendar,
  Users,
  Clock,
  FileText,
  Menu,
  BriefcaseIcon,
  CalendarDaysIcon,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const Index = () => {
  const menuItems = [
    { icon: Calendar, label: "Planning", href: "#planning" },
    { icon: Users, label: "Collaborateurs", href: "#collaborateurs" },
    { icon: BriefcaseIcon, label: "Clients", href: "#clients" },
    { icon: Clock, label: "Temps", href: "#temps" },
    { icon: CalendarDaysIcon, label: "Absences", href: "#absences" },
    { icon: FileText, label: "Rapports", href: "#rapports" },
  ];

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-neutral-100">
        <Sidebar>
          <SidebarHeader className="p-4">
            <h1 className="text-lg font-semibold">Cabinet XYZ</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2 text-neutral-600 hover:bg-neutral-200 rounded-md transition-all duration-200"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

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
            <div className="card">
              <h3 className="font-semibold text-neutral-800 mb-4">
                Tâches en cours
              </h3>
              <div className="text-3xl font-bold text-primary">12</div>
              <p className="text-neutral-600 text-sm mt-1">Cette semaine</p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-neutral-800 mb-4">
                Collaborateurs actifs
              </h3>
              <div className="text-3xl font-bold text-primary">8</div>
              <p className="text-neutral-600 text-sm mt-1">Sur 10</p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-neutral-800 mb-4">
                Heures travaillées
              </h3>
              <div className="text-3xl font-bold text-primary">156</div>
              <p className="text-neutral-600 text-sm mt-1">Ce mois</p>
            </div>
          </div>

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
    </SidebarProvider>
  );
};

export default Index;