import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardStats = () => {
  const { data: ncStats, isLoading: ncLoading } = useQuery({
    queryKey: ["dashboard-nc-stats"],
    queryFn: async () => {
      const { data: openNCs, error: openError } = await supabase
        .from("non_conformities")
        .select("id", { count: "exact" })
        .in("status", ["ouverte", "en_cours"]);

      const { data: allNCs, error: allError } = await supabase
        .from("non_conformities")
        .select("*");

      const { data: recentNCs, error: recentError } = await supabase
        .from("non_conformities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (openError || allError || recentError) throw openError || allError || recentError;

      const closedNCs = (allNCs?.length || 0) - (openNCs?.length || 0);
      const complianceRate = allNCs?.length 
        ? Math.round((closedNCs / allNCs.length) * 100 * 10) / 10 
        : 100;

      // Calculate NC by status for pie chart
      const statusCounts = {
        ouverte: 0,
        en_cours: 0,
        resolue: 0,
        cloturee: 0,
        rejetee: 0,
      };
      allNCs?.forEach((nc) => {
        if (nc.status in statusCounts) {
          statusCounts[nc.status as keyof typeof statusCounts]++;
        }
      });

      // Calculate NC by priority for bar chart
      const priorityCounts = {
        basse: 0,
        moyenne: 0,
        haute: 0,
        critique: 0,
      };
      allNCs?.forEach((nc) => {
        if (nc.priority in priorityCounts) {
          priorityCounts[nc.priority as keyof typeof priorityCounts]++;
        }
      });

      return {
        openCount: openNCs?.length || 0,
        totalCount: allNCs?.length || 0,
        complianceRate,
        recentNCs: recentNCs || [],
        statusData: [
          { name: "Ouverte", value: statusCounts.ouverte, fill: "hsl(var(--chart-1))" },
          { name: "En cours", value: statusCounts.en_cours, fill: "hsl(var(--chart-2))" },
          { name: "Résolue", value: statusCounts.resolue, fill: "hsl(var(--chart-3))" },
          { name: "Clôturée", value: statusCounts.cloturee, fill: "hsl(var(--chart-4))" },
          { name: "Rejetée", value: statusCounts.rejetee, fill: "hsl(var(--chart-5))" },
        ].filter(d => d.value > 0),
        priorityData: [
          { name: "Basse", value: priorityCounts.basse, fill: "hsl(var(--chart-3))" },
          { name: "Moyenne", value: priorityCounts.moyenne, fill: "hsl(var(--chart-2))" },
          { name: "Haute", value: priorityCounts.haute, fill: "hsl(var(--chart-1))" },
          { name: "Critique", value: priorityCounts.critique, fill: "hsl(var(--destructive))" },
        ],
      };
    },
  });

  const { data: auditStats, isLoading: auditLoading } = useQuery({
    queryKey: ["dashboard-audit-stats"],
    queryFn: async () => {
      const currentMonth = new Date();
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data: plannedAudits, error: plannedError } = await supabase
        .from("audits")
        .select("id", { count: "exact" })
        .gte("audit_date", startOfMonth.toISOString().split("T")[0])
        .lte("audit_date", endOfMonth.toISOString().split("T")[0]);

      const { data: allAudits, error: allError } = await supabase
        .from("audits")
        .select("*");

      const { data: upcomingAudits, error: upcomingError } = await supabase
        .from("audits")
        .select("*")
        .gte("audit_date", new Date().toISOString().split("T")[0])
        .order("audit_date", { ascending: true })
        .limit(5);

      if (plannedError || upcomingError || allError) throw plannedError || upcomingError || allError;

      // Calculate audit types for chart
      const typeCounts = {
        interne: 0,
        externe: 0,
        fournisseur: 0,
        client: 0,
      };
      allAudits?.forEach((audit) => {
        if (audit.type in typeCounts) {
          typeCounts[audit.type as keyof typeof typeCounts]++;
        }
      });

      return {
        plannedCount: plannedAudits?.length || 0,
        upcomingAudits: upcomingAudits || [],
        typeData: [
          { name: "Interne", value: typeCounts.interne, fill: "hsl(var(--chart-1))" },
          { name: "Externe", value: typeCounts.externe, fill: "hsl(var(--chart-2))" },
          { name: "Fournisseur", value: typeCounts.fournisseur, fill: "hsl(var(--chart-3))" },
          { name: "Client", value: typeCounts.client, fill: "hsl(var(--chart-4))" },
        ].filter(d => d.value > 0),
      };
    },
  });

  const { data: actionStats, isLoading: actionLoading } = useQuery({
    queryKey: ["dashboard-action-stats"],
    queryFn: async () => {
      const { data: allActions, error } = await supabase
        .from("actions")
        .select("*");

      if (error) throw error;

      const statusCounts = {
        planifiee: 0,
        en_cours: 0,
        terminee: 0,
        verifiee: 0,
      };
      allActions?.forEach((action) => {
        if (action.status in statusCounts) {
          statusCounts[action.status as keyof typeof statusCounts]++;
        }
      });

      return {
        activeCount: allActions?.filter(a => a.status === "planifiee" || a.status === "en_cours").length || 0,
        statusData: [
          { name: "Planifiée", value: statusCounts.planifiee, fill: "hsl(var(--chart-1))" },
          { name: "En cours", value: statusCounts.en_cours, fill: "hsl(var(--chart-2))" },
          { name: "Terminée", value: statusCounts.terminee, fill: "hsl(var(--chart-3))" },
          { name: "Vérifiée", value: statusCounts.verifiee, fill: "hsl(var(--chart-4))" },
        ].filter(d => d.value > 0),
      };
    },
  });

  const { data: documentStats, isLoading: documentLoading } = useQuery({
    queryKey: ["dashboard-document-stats"],
    queryFn: async () => {
      const { data: activeDocuments, error } = await supabase
        .from("documents")
        .select("id", { count: "exact" })
        .eq("is_active", true);

      if (error) throw error;

      return {
        activeCount: activeDocuments?.length || 0,
      };
    },
  });

  const { data: userStats, isLoading: userLoading } = useQuery({
    queryKey: ["dashboard-user-stats"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id", { count: "exact" });

      if (error) throw error;

      return {
        userCount: profiles?.length || 0,
      };
    },
  });

  return {
    ncStats,
    auditStats,
    actionStats,
    documentStats,
    userStats,
    isLoading: ncLoading || auditLoading || actionLoading || documentLoading || userLoading,
  };
};
