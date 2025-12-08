import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Document = Tables<"documents">;
type DocumentInsert = TablesInsert<"documents">;
type DocumentUpdate = TablesUpdate<"documents">;

export const useDocuments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Document[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (document: Omit<DocumentInsert, "created_by" | "document_number">) => {
      if (!user) throw new Error("User not authenticated");

      const { data: docNumber } = await supabase.rpc("generate_document_number");
      
      const { data, error } = await supabase
        .from("documents")
        .insert({
          ...document,
          created_by: user.id,
          document_number: docNumber || `DOC-${Date.now()}`,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document créé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création du document: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: DocumentUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("documents")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document mis à jour avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("documents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document supprimé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression: " + error.message);
    },
  });

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  return {
    documents,
    isLoading,
    createDocument: createMutation.mutateAsync,
    updateDocument: updateMutation.mutateAsync,
    deleteDocument: deleteMutation.mutate,
    uploadFile,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
