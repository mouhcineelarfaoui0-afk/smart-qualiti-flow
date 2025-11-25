import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Audit = Tables<"audits">;
type AuditInsert = TablesInsert<"audits">;
type AuditUpdate = TablesUpdate<"audits">;

export const useAudits = () => {
  const queryClient = useQueryClient();

  const { data: audits, isLoading } = useQuery({
    queryKey: ["audits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audits")
        .select("*")
        .order("audit_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (audit: AuditInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("audits")
        .insert({ ...audit, created_by: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      toast({
        title: "Audit créé",
        description: `Audit ${data.audit_number} créé avec succès.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: AuditUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("audits")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      toast({
        title: "Audit mis à jour",
        description: "L'audit a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("audits")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      toast({
        title: "Audit supprimé",
        description: "L'audit a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadReport = async (file: File, auditId: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${auditId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("audits")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("audits")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  return {
    audits,
    isLoading,
    createAudit: createMutation.mutateAsync,
    updateAudit: updateMutation.mutateAsync,
    deleteAudit: deleteMutation.mutate,
    uploadReport,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
