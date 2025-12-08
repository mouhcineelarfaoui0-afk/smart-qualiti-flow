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
        .select("id", { count: "exact" });

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

      return {
        openCount: openNCs?.length || 0,
        totalCount: allNCs?.length || 0,
        complianceRate,
        recentNCs: recentNCs || [],
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

      const { data: upcomingAudits, error: upcomingError } = await supabase
        .from("audits")
        .select("*")
        .gte("audit_date", new Date().toISOString().split("T")[0])
        .order("audit_date", { ascending: true })
        .limit(5);

      if (plannedError || upcomingError) throw plannedError || upcomingError;

      return {
        plannedCount: plannedAudits?.length || 0,
        upcomingAudits: upcomingAudits || [],
      };
    },
  });

  const { data: actionStats, isLoading: actionLoading } = useQuery({
    queryKey: ["dashboard-action-stats"],
    queryFn: async () => {
      const { data: activeActions, error } = await supabase
        .from("actions")
        .select("id", { count: "exact" })
        .in("status", ["planifiee", "en_cours"]);

      if (error) throw error;

      return {
        activeCount: activeActions?.length || 0,
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
