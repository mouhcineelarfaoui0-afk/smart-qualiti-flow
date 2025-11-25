import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Tables } from "@/integrations/supabase/types";

const auditSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  type: z.enum(["interne", "externe", "fournisseur", "client"]),
  audit_date: z.date({ required_error: "La date est requise" }),
  auditor_id: z.string().min(1, "L'auditeur est requis"),
  status: z.enum(["planifie", "en_cours", "termine", "reporte"]),
  score: z.number().min(0).max(100).optional(),
  observations: z.string().optional(),
});

type AuditFormData = z.infer<typeof auditSchema>;

interface AuditFormProps {
  onSubmit: (data: AuditFormData, file?: File) => void;
  initialData?: Tables<"audits">;
  isLoading?: boolean;
}

export const AuditForm = ({ onSubmit, initialData, isLoading }: AuditFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<AuditFormData>({
    resolver: zodResolver(auditSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      type: initialData.type,
      audit_date: new Date(initialData.audit_date),
      auditor_id: initialData.auditor_id,
      status: initialData.status,
      score: initialData.score || undefined,
      observations: initialData.observations || "",
    } : {
      title: "",
      type: "interne",
      status: "planifie",
      auditor_id: "",
      observations: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        form.setError("root", { message: "Le fichier ne doit pas dépasser 10 MB" });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = (data: AuditFormData) => {
    onSubmit(data, selectedFile || undefined);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de l'audit</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Audit interne ISO 9001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type d'audit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="interne">Interne</SelectItem>
                    <SelectItem value="externe">Externe</SelectItem>
                    <SelectItem value="fournisseur">Fournisseur</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planifie">Planifié</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                    <SelectItem value="reporte">Reporté</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="audit_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date d'audit</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={fr}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="auditor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Auditeur</FormLabel>
                <FormControl>
                  <Input placeholder="ID de l'auditeur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score (0-100)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Score de conformité"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observations</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes et observations de l'audit"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Rapport d'audit (PDF)</FormLabel>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="flex-1"
            />
            {selectedFile && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Fichier sélectionné: {selectedFile.name}
            </p>
          )}
        </div>

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span>Enregistrement...</span>
          ) : (
            <span>{initialData ? "Mettre à jour" : "Créer l'audit"}</span>
          )}
        </Button>
      </form>
    </Form>
  );
};
