import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type NonConformity = Tables<"non_conformities">;
type NonConformityInsert = TablesInsert<"non_conformities">;
type NonConformityUpdate = TablesUpdate<"non_conformities">;

export const useNonConformities = () => {
  const queryClient = useQueryClient();

  const { data: nonConformities, isLoading } = useQuery({
    queryKey: ["non-conformities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("non_conformities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (nc: NonConformityInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("non_conformities")
        .insert({ ...nc, created_by: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["non-conformities"] });
      toast({
        title: "Non-conformité créée",
        description: `NC ${data.nc_number} créée avec succès.`,
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
    mutationFn: async ({ id, ...updates }: NonConformityUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("non_conformities")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["non-conformities"] });
      toast({
        title: "Non-conformité mise à jour",
        description: "La non-conformité a été mise à jour avec succès.",
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
        .from("non_conformities")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["non-conformities"] });
      toast({
        title: "Non-conformité supprimée",
        description: "La non-conformité a été supprimée avec succès.",
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

  const uploadFile = async (file: File, ncId: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${ncId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("non-conformities")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("non-conformities")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  return {
    nonConformities,
    isLoading,
    createNonConformity: createMutation.mutateAsync,
    updateNonConformity: updateMutation.mutateAsync,
    deleteNonConformity: deleteMutation.mutate,
    uploadFile,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
