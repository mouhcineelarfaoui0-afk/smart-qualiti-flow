import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Audits = () => {
  const mockAudits = [
    {
      id: "AUD-2025-001",
      title: "Audit interne ISO 9001",
      type: "Interne",
      status: "Planifié",
      date: "15 Jan 2025",
      auditor: "Marie Dupont",
      department: "Production",
    },
    {
      id: "AUD-2025-002",
      title: "Audit fournisseur ABC Corp",
      type: "Fournisseur",
      status: "En cours",
      date: "20 Jan 2025",
      auditor: "Jean Martin",
      department: "Achats",
    },
    {
      id: "AUD-2025-003",
      title: "Audit processus qualité",
      type: "Processus",
      status: "Complété",
      date: "10 Jan 2025",
      auditor: "Sophie Bernard",
      department: "Qualité",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complété":
        return "bg-success/10 text-success border-success/20";
      case "En cours":
        return "bg-warning/10 text-warning border-warning/20";
      case "Planifié":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Complété":
        return <CheckCircle className="h-4 w-4" />;
      case "En cours":
        return <Clock className="h-4 w-4" />;
      case "Planifié":
        return <Calendar className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Audits</h1>
          <p className="text-muted-foreground">
            Gestion et suivi des audits qualité
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendrier
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvel audit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">24</p>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Planifiés</p>
              <p className="text-2xl font-bold text-primary">8</p>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En cours</p>
              <p className="text-2xl font-bold text-warning">3</p>
            </div>
            <Clock className="h-8 w-8 text-warning" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Complétés</p>
              <p className="text-2xl font-bold text-success">13</p>
            </div>
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </Card>
      </div>

      {/* Audits List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Audits récents
          </h2>
          <Button variant="ghost" size="sm">
            Voir tout
          </Button>
        </div>

        <div className="space-y-4">
          {mockAudits.map((audit) => (
            <div
              key={audit.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">{audit.id}</p>
                    <Badge variant="outline" className="text-xs">
                      {audit.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground mb-1">{audit.title}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {audit.date}
                    </span>
                    <span>{audit.auditor}</span>
                    <span>{audit.department}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={`${getStatusColor(audit.status)} flex items-center gap-1`}
                >
                  {getStatusIcon(audit.status)}
                  {audit.status}
                </Badge>
                <Button variant="ghost" size="sm">
                  Détails
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Audits;
