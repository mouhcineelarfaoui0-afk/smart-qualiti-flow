import { KPICard } from "@/components/KPICard";
import { AlertTriangle, CheckCircle, ClipboardCheck, TrendingUp, Users, FileText, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Tableau de bord</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Vue d'ensemble de votre système qualité</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <KPICard
          title="Non-conformités ouvertes"
          value={12}
          subtitle="En attente de traitement"
          icon={AlertTriangle}
          variant="warning"
          trend="down"
          trendValue="-15%"
        />
        <KPICard
          title="Taux de conformité"
          value="94.5%"
          subtitle="Objectif: 95%"
          icon={CheckCircle}
          variant="success"
          trend="up"
          trendValue="+2.3%"
        />
        <KPICard
          title="Audits planifiés"
          value={8}
          subtitle="Ce mois-ci"
          icon={ClipboardCheck}
          variant="default"
          trend="neutral"
          trendValue="Stable"
        />
        <KPICard
          title="Actions CAPA"
          value={23}
          subtitle="Actions en cours"
          icon={TrendingUp}
          variant="default"
        />
        <KPICard
          title="Documents actifs"
          value={156}
          subtitle="Conformes ISO 9001"
          icon={FileText}
          variant="default"
        />
        <KPICard
          title="Utilisateurs actifs"
          value={47}
          subtitle="Sur la plateforme"
          icon={Users}
          variant="default"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Non-conformités récentes</h2>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">Voir tout</Button>
          </div>
          <div className="space-y-3">
            {[
              { id: "NC-2025-001", title: "Défaut d'emballage produit A", status: "Ouverte", priority: "Haute" },
              { id: "NC-2025-002", title: "Non-respect procédure contrôle", status: "En cours", priority: "Moyenne" },
              { id: "NC-2025-003", title: "Écart température stockage", status: "Ouverte", priority: "Haute" },
            ].map((nc) => (
              <div key={nc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-secondary/50 rounded-lg gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{nc.id}</p>
                  <p className="text-xs text-muted-foreground truncate">{nc.title}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded whitespace-nowrap self-start sm:self-auto ${
                    nc.priority === "Haute"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  {nc.priority}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Prochains audits</h2>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">Calendrier</Button>
          </div>
          <div className="space-y-3">
            {[
              { title: "Audit interne ISO 9001", date: "15 Jan 2025", auditor: "Marie Dupont" },
              { title: "Audit fournisseur", date: "22 Jan 2025", auditor: "Jean Martin" },
              { title: "Audit processus production", date: "29 Jan 2025", auditor: "Sophie Bernard" },
            ].map((audit, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-secondary/50 rounded-lg gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{audit.title}</p>
                  <p className="text-xs text-muted-foreground truncate">Auditeur: {audit.auditor}</p>
                </div>
                <div className="text-xs font-medium text-primary whitespace-nowrap">{audit.date}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button className="w-full justify-start h-12 sm:h-10" variant="outline">
            <AlertTriangle className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">Déclarer NC</span>
          </Button>
          <Button className="w-full justify-start h-12 sm:h-10" variant="outline">
            <ClipboardCheck className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">Planifier audit</span>
          </Button>
          <Button className="w-full justify-start h-12 sm:h-10" variant="outline">
            <FileText className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">Créer document</span>
          </Button>
          <Button className="w-full justify-start h-12 sm:h-10" variant="outline">
            <Brain className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">Assistant IA</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
