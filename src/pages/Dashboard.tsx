import { KPICard } from "@/components/KPICard";
import { AlertTriangle, CheckCircle, ClipboardCheck, TrendingUp, Users, FileText, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid, Area, AreaChart } from "recharts";
import { useState } from "react";

const Dashboard = () => {
  const [trendPeriod, setTrendPeriod] = useState<"monthly" | "weekly">("monthly");
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

      {/* NC Trend Chart */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Évolution des non-conformités</h2>
          <div className="flex gap-2">
            <Button
              variant={trendPeriod === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTrendPeriod("monthly")}
            >
              Mensuel
            </Button>
            <Button
              variant={trendPeriod === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTrendPeriod("weekly")}
            >
              Hebdomadaire
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="h-80">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={trendPeriod === "monthly" ? ncStats?.monthlyTrend : ncStats?.weeklyTrend}>
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="period" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }} 
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="created"
                name="NC créées"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorCreated)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="closed"
                name="NC clôturées"
                stroke="hsl(var(--chart-3))"
                fillOpacity={1}
                fill="url(#colorClosed)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* NC by Status Pie Chart */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Non-conformités par statut</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Skeleton className="h-48 w-48 rounded-full" />
            </div>
          ) : ncStats?.statusData && ncStats.statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={ncStats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {ncStats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Aucune donnée disponible
            </div>
          )}
        </Card>

        {/* NC by Priority Bar Chart */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Non-conformités par priorité</h2>
          {isLoading ? (
            <div className="space-y-4 h-64 flex flex-col justify-center">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : ncStats?.priorityData ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ncStats.priorityData} layout="vertical">
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80} 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {ncStats.priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Aucune donnée disponible
            </div>
          )}
        </Card>

        {/* Audit Types Pie Chart */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Audits par type</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Skeleton className="h-48 w-48 rounded-full" />
            </div>
          ) : auditStats?.typeData && auditStats.typeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={auditStats.typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {auditStats.typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Aucune donnée d'audit
            </div>
          )}
        </Card>

        {/* Actions Status Bar Chart */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Actions CAPA par statut</h2>
          {isLoading ? (
            <div className="space-y-4 h-64 flex flex-col justify-center">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : actionStats?.statusData && actionStats.statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={actionStats.statusData} layout="vertical">
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80} 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {actionStats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Aucune action CAPA
            </div>
          )}
        </Card>
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
