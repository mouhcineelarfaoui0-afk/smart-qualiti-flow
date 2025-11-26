import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, AlertTriangle, Edit, Trash2, FileText, Calendar } from "lucide-react";
import { useState } from "react";
import { useNonConformities } from "@/hooks/useNonConformities";
import { NonConformityDialog } from "@/components/NonConformityDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const NonConformities = () => {
  const { nonConformities, isLoading, deleteNonConformity, isDeleting } = useNonConformities();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNc, setSelectedNc] = useState<Tables<"non_conformities"> | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredNcs = nonConformities?.filter(
    (nc) =>
      nc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nc.nc_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (nc: Tables<"non_conformities">) => {
    setSelectedNc(nc);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedNc(undefined);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteNonConformity(id);
    setDeleteId(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critique":
        return "bg-destructive text-destructive-foreground border-destructive";
      case "haute":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "moyenne":
        return "bg-warning/10 text-warning border-warning/20";
      case "basse":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cloturee":
        return "bg-success/10 text-success border-success/20";
      case "resolue":
        return "bg-primary/10 text-primary border-primary/20";
      case "en_cours":
        return "bg-warning/10 text-warning border-warning/20";
      case "ouverte":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "rejetee":
        return "bg-secondary text-secondary-foreground border-border";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "cloturee":
        return "Clôturée";
      case "resolue":
        return "Résolue";
      case "en_cours":
        return "En cours";
      case "ouverte":
        return "Ouverte";
      case "rejetee":
        return "Rejetée";
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "critique":
        return "Critique";
      case "haute":
        return "Haute";
      case "moyenne":
        return "Moyenne";
      case "basse":
        return "Basse";
      default:
        return priority;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Non-conformités</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Gestion des écarts et anomalies qualité</p>
        </div>
        <Button onClick={handleCreate} className="gap-2 h-11 sm:h-10">
          <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
          <span className="text-sm sm:text-base">Nouvelle NC</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                {nonConformities?.length || 0}
              </p>
            </div>
            <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground flex-shrink-0" />
          </div>
        </Card>
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-xs sm:text-sm text-muted-foreground">Ouvertes</p>
              <p className="text-xl sm:text-2xl font-bold text-destructive truncate">
                {nonConformities?.filter((nc) => nc.status === "ouverte").length || 0}
              </p>
            </div>
            <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 text-destructive flex-shrink-0" />
          </div>
        </Card>
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-xs sm:text-sm text-muted-foreground">En cours</p>
              <p className="text-xl sm:text-2xl font-bold text-warning truncate">
                {nonConformities?.filter((nc) => nc.status === "en_cours").length || 0}
              </p>
            </div>
            <Calendar className="h-7 w-7 sm:h-8 sm:w-8 text-warning flex-shrink-0" />
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher par titre ou numéro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 sm:pl-11 h-11 sm:h-10"
        />
      </div>

      {/* Non-Conformities List */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-4">
          {filteredNcs && filteredNcs.length > 0 ? (
            filteredNcs.map((nc) => (
              <div
                key={nc.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors gap-3"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-destructive/10 flex-shrink-0">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-sm sm:text-base text-foreground">{nc.nc_number}</p>
                      <Badge variant="outline" className={`${getPriorityColor(nc.priority)} text-xs`}>
                        {getPriorityLabel(nc.priority)}
                      </Badge>
                      <Badge variant="outline" className={`${getStatusColor(nc.status)} text-xs`}>
                        {getStatusLabel(nc.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mb-2 line-clamp-2">{nc.title}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                      <span className="truncate">
                        Créé le {format(new Date(nc.created_at!), "PP", { locale: fr })}
                      </span>
                      {nc.due_date && (
                        <span className="flex items-center gap-1 truncate">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          Échéance: {format(new Date(nc.due_date), "PP", { locale: fr })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(nc)}
                    className="h-9 w-9 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(nc.id)}
                    className="h-9 w-9 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              {searchTerm
                ? "Aucune non-conformité trouvée"
                : "Aucune non-conformité enregistrée"}
            </p>
          )}
        </div>
      </Card>

      <NonConformityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nonConformity={selectedNc}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette non-conformité ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NonConformities;
