import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const NonConformities = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Non-conformités</h1>
          <p className="text-muted-foreground">Gestion des écarts et anomalies qualité</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle NC
        </Button>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground text-center py-8">Module en construction...</p>
      </Card>
    </div>
  );
};

export default NonConformities;
