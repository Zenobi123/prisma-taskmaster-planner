import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Sparkles,
  HelpCircle,
  Rocket,
  LayoutDashboard,
  Users,
  FolderOpen,
  Receipt,
  Mail,
  Briefcase,
  Calendar,
  UserCog,
  FileText,
  Settings,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthorization } from "@/hooks/useAuthorization";
import { CollaborateurUnauthorized } from "@/components/collaborateurs/CollaborateurUnauthorized";
import {
  aideSections,
  changelog,
  APP_VERSION,
  LAST_UPDATED,
  type AideSection,
} from "@/lib/spec/aideContent";

/** Mapping nom d'icône (depuis le contenu) -> composant lucide-react. */
const iconMap: Record<string, LucideIcon> = {
  Rocket,
  LayoutDashboard,
  Users,
  FolderOpen,
  Receipt,
  Mail,
  Briefcase,
  Calendar,
  UserCog,
  FileText,
  Settings,
  Lightbulb,
};

const formatDate = (iso: string) => {
  const d = new Date(iso + "T12:00:00");
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};

const SectionCard = ({ section }: { section: AideSection }) => {
  const Icon = iconMap[section.icon] ?? HelpCircle;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <span>{section.title}</span>
        </CardTitle>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1">{section.description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          {section.articles.map((article, index) => (
            <AccordionItem key={index} value={`${section.id}-${index}`}>
              <AccordionTrigger className="text-left text-sm">
                {article.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
                {article.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

const Aide = () => {
  const { isAuthorized } = useAuthorization(
    ["admin", "comptable", "gestionnaire", "expert-comptable", "fiscaliste", "assistant"],
    "aide",
    { showToast: true }
  );
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrage des rubriques/articles selon la recherche.
  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return aideSections;

    return aideSections
      .map((section) => {
        const sectionMatches =
          section.title.toLowerCase().includes(query) ||
          section.description.toLowerCase().includes(query);

        const articles = sectionMatches
          ? section.articles
          : section.articles.filter(
              (a) =>
                a.question.toLowerCase().includes(query) ||
                a.answer.toLowerCase().includes(query)
            );

        return { ...section, articles };
      })
      .filter((section) => section.articles.length > 0);
  }, [searchQuery]);

  if (!isAuthorized) {
    return <CollaborateurUnauthorized module="aide" />;
  }

  return (
    <PageLayout>
      <div className="px-4 py-4 sm:p-6">
        <div className="flex items-center gap-4 mb-4 sm:mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-1 sm:gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HelpCircle className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Aide & Documentation</h1>
              <p className="text-neutral-600 mt-1 text-xs sm:text-sm">
                Comprendre le fonctionnement de PRISMA GESTION, module par module.
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="self-start sm:self-auto whitespace-nowrap">
            Version {APP_VERSION} · maj {formatDate(LAST_UPDATED)}
          </Badge>
        </div>

        <Tabs defaultValue="guide" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Guide
            </TabsTrigger>
            <TabsTrigger value="nouveautes" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Nouveautés
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guide">
            <div className="relative mb-4 sm:mb-6 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans l'aide (ex : facture, IGS, courrier…)"
                className="pl-9"
              />
            </div>

            {filteredSections.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredSections.map((section) => (
                  <SectionCard key={section.id} section={section} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-500">
                <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">
                  Aucun résultat pour «&nbsp;{searchQuery}&nbsp;». Essayez un autre mot-clé.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="nouveautes">
            <p className="text-sm text-neutral-600 mb-4">
              Cette page recense les évolutions majeures de l'application. Elle est mise à
              jour à chaque nouvelle version.
            </p>
            <div className="space-y-4">
              {changelog.map((entry) => (
                <Card key={entry.version}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>{entry.title}</span>
                      <Badge variant="outline" className="ml-auto whitespace-nowrap">
                        v{entry.version} · {formatDate(entry.date)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-neutral-700">
                      {entry.changes.map((change, i) => (
                        <li key={i}>{change}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Aide;
