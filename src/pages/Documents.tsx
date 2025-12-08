import { useState } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { DocumentDialog } from "@/components/DocumentDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Plus,
  Search,
  MoreVertical,
  FileText,
  Download,
  Pencil,
  Trash2,
  Filter,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

type Document = Tables<"documents">;

const Documents = () => {
  const {
    documents,
    isLoading,
    createDocument,
    updateDocument,
    deleteDocument,
    uploadFile,
    isCreating,
    isUpdating,
  } = useDocuments();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const categories = [...new Set(documents.map((d) => d.category))];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.document_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && doc.is_active) ||
      (statusFilter === "inactive" && !doc.is_active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: documents.length,
    active: documents.filter((d) => d.is_active).length,
    expiringSoon: documents.filter((d) => {
      if (!d.expiry_date) return false;
      const expiry = new Date(d.expiry_date);
      const now = new Date();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      return expiry.getTime() - now.getTime() < thirtyDays && expiry > now;
    }).length,
  };

  const handleCreate = () => {
    setSelectedDocument(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDialogOpen(true);
  };

  const handleDelete = (doc: Document) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      deleteDocument(documentToDelete.id);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleSubmit = async (data: any) => {
    if (selectedDocument) {
      await updateDocument({ id: selectedDocument.id, ...data });
    } else {
      await createDocument(data);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Procédure: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      Instruction: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Formulaire: "bg-green-500/10 text-green-500 border-green-500/20",
      Politique: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      Manuel: "bg-red-500/10 text-red-500 border-red-500/20",
      Spécification: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gestion documentaire ISO 9001
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto h-12 sm:h-10">
          <Plus className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
          Nouveau document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total documents</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.active}</p>
            <p className="text-xs text-muted-foreground">Documents actifs</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-warning/10">
            <XCircle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.expiringSoon}</p>
            <p className="text-xs text-muted-foreground">Expirent bientôt</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 sm:h-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40 h-12 sm:h-10">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32 h-12 sm:h-10">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Documents List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : filteredDocuments.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun document</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
              ? "Aucun document ne correspond aux filtres"
              : "Commencez par créer votre premier document"}
          </p>
          {!searchQuery && categoryFilter === "all" && statusFilter === "all" && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Créer un document
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-mono">
                    {doc.document_number}
                  </p>
                  <h3 className="font-semibold text-foreground truncate">{doc.title}</h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(doc)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(doc)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className={getCategoryColor(doc.category)}>
                  {doc.category}
                </Badge>
                <Badge variant="outline">v{doc.version}</Badge>
                <Badge
                  variant={doc.is_active ? "default" : "secondary"}
                  className={doc.is_active ? "bg-success/10 text-success" : ""}
                >
                  {doc.is_active ? "Actif" : "Inactif"}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  Créé le{" "}
                  {format(new Date(doc.created_at!), "d MMM yyyy", { locale: fr })}
                </p>
                {doc.expiry_date && (
                  <p
                    className={
                      new Date(doc.expiry_date) < new Date() ? "text-destructive" : ""
                    }
                  >
                    Expire le{" "}
                    {format(new Date(doc.expiry_date), "d MMM yyyy", { locale: fr })}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <DocumentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        document={selectedDocument}
        onSubmit={handleSubmit}
        uploadFile={uploadFile}
        isSubmitting={isCreating || isUpdating}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le document "{documentToDelete?.title}" sera
              définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Documents;
