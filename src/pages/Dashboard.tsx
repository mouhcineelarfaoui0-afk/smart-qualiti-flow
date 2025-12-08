import { KPICard } from "@/components/KPICard";
import { AlertTriangle, CheckCircle, ClipboardCheck, TrendingUp, Users, FileText, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const navigate = useNavigate();
  const { ncStats, auditStats, actionStats, documentStats, userStats, isLoading } = useDashboardStats();

  const getPriorityStyle = (priority: string) => {
    const styles: Record<string, string> = {
      critique: "bg-destructive/10 text-destructive",
      haute: "bg-destructive/10 text-destructive",
      moyenne: "bg-warning/10 text-warning",
      basse: "bg-muted text-muted-foreground",
    };
    return styles[priority] || styles.moyenne;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      critique: "Critique",
      haute: "Haute",
      moyenne: "Moyenne",
      basse: "Basse",
    };
    return labels[priority] || priority;
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Tableau de bord</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Vue d'ensemble de votre système qualité</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-4 sm:p-6">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </Card>
            ))}
          </>
        ) : (
          <>
            <KPICard
              title="Non-conformités ouvertes"
              value={ncStats?.openCount || 0}
              subtitle="En attente de traitement"
              icon={AlertTriangle}
              variant={ncStats?.openCount && ncStats.openCount > 5 ? "warning" : "default"}
            />
            <KPICard
              title="Taux de conformité"
              value={`${ncStats?.complianceRate || 100}%`}
              subtitle="Objectif: 95%"
              icon={CheckCircle}
              variant={(ncStats?.complianceRate || 100) >= 95 ? "success" : "warning"}
            />
            <KPICard
              title="Audits planifiés"
              value={auditStats?.plannedCount || 0}
              subtitle="Ce mois-ci"
              icon={ClipboardCheck}
              variant="default"
            />
            <KPICard
              title="Actions CAPA"
              value={actionStats?.activeCount || 0}
              subtitle="Actions en cours"
              icon={TrendingUp}
              variant="default"
            />
            <KPICard
              title="Documents actifs"
              value={documentStats?.activeCount || 0}
              subtitle="Conformes ISO 9001"
              icon={FileText}
              variant="default"
            />
            <KPICard
              title="Utilisateurs actifs"
              value={userStats?.userCount || 0}
              subtitle="Sur la plateforme"
              icon={Users}
              variant="default"
            />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Non-conformités récentes</h2>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm" onClick={() => navigate("/non-conformities")}>
              Voir tout
            </Button>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-3 bg-secondary/50 rounded-lg">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              ))
            ) : ncStats?.recentNCs && ncStats.recentNCs.length > 0 ? (
              ncStats.recentNCs.slice(0, 5).map((nc) => (
                <div key={nc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-secondary/50 rounded-lg gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{nc.nc_number}</p>
                    <p className="text-xs text-muted-foreground truncate">{nc.title}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded whitespace-nowrap self-start sm:self-auto ${getPriorityStyle(nc.priority)}`}>
                    {getPriorityLabel(nc.priority)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune non-conformité récente</p>
            )}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Prochains audits</h2>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm" onClick={() => navigate("/audits")}>
              Calendrier
            </Button>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-3 bg-secondary/50 rounded-lg">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))
            ) : auditStats?.upcomingAudits && auditStats.upcomingAudits.length > 0 ? (
              auditStats.upcomingAudits.slice(0, 5).map((audit) => (
                <div key={audit.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-secondary/50 rounded-lg gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{audit.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {audit.audit_number}
                    </p>
                  </div>
                  <div className="text-xs font-medium text-primary whitespace-nowrap">
                    {format(new Date(audit.audit_date), "d MMM yyyy", { locale: fr })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun audit planifié</p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button className="w-full justify-start h-12 sm:h-10" variant="outline" onClick={() => navigate("/non-conformities")}>
            <AlertTriangle className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">Déclarer NC</span>
          </Button>
          <Button className="w-full justify-start h-12 sm:h-10" variant="outline" onClick={() => navigate("/audits")}>
            <ClipboardCheck className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">Planifier audit</span>
          </Button>
          <Button className="w-full justify-start h-12 sm:h-10" variant="outline" onClick={() => navigate("/documents")}>
            <FileText className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">Créer document</span>
          </Button>
          <Button className="w-full justify-start h-12 sm:h-10" variant="outline" onClick={() => navigate("/ai-assistant")}>
            <Brain className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">Assistant IA</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
