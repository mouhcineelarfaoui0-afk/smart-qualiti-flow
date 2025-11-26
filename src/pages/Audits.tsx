import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Edit, 
  Trash2,
  FileText,
  Download
} from "lucide-react";
import { useAudits } from "@/hooks/useAudits";
import { AuditDialog } from "@/components/AuditDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Audits() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Tables<"audits"> | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { audits, isLoading, deleteAudit } = useAudits();

  const filteredAudits = audits?.filter(audit =>
    audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.audit_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (audit: Tables<"audits">) => {
    setSelectedAudit(audit);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedAudit(undefined);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteAudit(id);
    setDeleteId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planifie":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "en_cours":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "termine":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "reporte":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "interne":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "externe":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "fournisseur":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      case "client":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planifie: "Planifié",
      en_cours: "En cours",
      termine: "Terminé",
      reporte: "Reporté",
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      interne: "Interne",
      externe: "Externe",
      fournisseur: "Fournisseur",
      client: "Client",
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const stats = {
    total: audits?.length || 0,
    planned: audits?.filter(a => a.status === "planifie").length || 0,
    inProgress: audits?.filter(a => a.status === "en_cours").length || 0,
    completed: audits?.filter(a => a.status === "termine").length || 0,
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Audits</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Planification et suivi des audits qualité
          </p>
        </div>
        <Button onClick={handleCreate} className="h-11 sm:h-10 w-full sm:w-auto">
          <Plus className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
          <span className="text-sm sm:text-base">Nouvel Audit</span>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planifiés</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.planned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAudits && filteredAudits.length > 0 ? (
            <div className="space-y-4">
              {filteredAudits.map((audit) => (
                <Card key={audit.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">
                            {audit.audit_number}
                          </Badge>
                          <Badge className={getTypeColor(audit.type)}>
                            {getTypeLabel(audit.type)}
                          </Badge>
                          <Badge className={getStatusColor(audit.status)}>
                            {getStatusLabel(audit.status)}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold">{audit.title}</h3>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(audit.audit_date), "dd MMMM yyyy", { locale: fr })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Auditeur: {audit.auditor_id.slice(0, 8)}...</span>
                          </div>
                          {audit.score !== null && (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Score:</span>
                              <span className={audit.score >= 80 ? "text-green-600" : audit.score >= 60 ? "text-yellow-600" : "text-red-600"}>
                                {audit.score}%
                              </span>
                            </div>
                          )}
                        </div>

                        {audit.observations && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {audit.observations}
                          </p>
                        )}

                        {audit.report_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={audit.report_url} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger le rapport
                            </a>
                          </Button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(audit)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(audit.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Aucun audit enregistré
            </div>
          )}
        </CardContent>
      </Card>

      <AuditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        audit={selectedAudit}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet audit ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
