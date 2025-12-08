import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import type { Tables } from "@/integrations/supabase/types";

type Document = Tables<"documents">;

const documentSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  version: z.string().default("1.0"),
  expiry_date: z.string().optional(),
  is_active: z.boolean().default(true),
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface DocumentFormProps {
  document?: Document | null;
  onSubmit: (data: DocumentFormData & { file_url: string }) => Promise<void>;
  onCancel: () => void;
  uploadFile: (file: File) => Promise<string>;
  isSubmitting?: boolean;
}

const CATEGORIES = [
  "Procédure",
  "Instruction",
  "Formulaire",
  "Politique",
  "Manuel",
  "Spécification",
  "Plan",
  "Rapport",
  "Enregistrement",
  "Autre",
];

export const DocumentForm = ({
  document,
  onSubmit,
  onCancel,
  uploadFile,
  isSubmitting = false,
}: DocumentFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: document?.title || "",
      category: document?.category || "",
      version: document?.version || "1.0",
      expiry_date: document?.expiry_date || "",
      is_active: document?.is_active ?? true,
    },
  });

  const handleSubmit = async (data: DocumentFormData) => {
    try {
      let fileUrl = document?.file_url || "";

      if (file) {
        setIsUploading(true);
        fileUrl = await uploadFile(file);
        setIsUploading(false);
      }

      if (!fileUrl && !document) {
        form.setError("root", { message: "Un fichier est requis" });
        return;
      }

      await onSubmit({ ...data, file_url: fileUrl });
    } catch (error) {
      setIsUploading(false);
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre *</FormLabel>
              <FormControl>
                <Input placeholder="Titre du document" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input placeholder="1.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'expiration</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Document actif</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Les documents inactifs ne sont pas visibles par les employés
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Fichier {!document && "*"}</FormLabel>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="flex-1"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            />
            {file && <span className="text-sm text-muted-foreground truncate max-w-32">{file.name}</span>}
          </div>
          {document?.file_url && !file && (
            <p className="text-xs text-muted-foreground">
              Fichier actuel: {document.file_url.split("/").pop()}
            </p>
          )}
        </div>

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {document ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
