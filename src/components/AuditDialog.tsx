import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuditForm } from "./AuditForm";
import { useAudits } from "@/hooks/useAudits";
import type { Tables } from "@/integrations/supabase/types";

interface AuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audit?: Tables<"audits">;
}

export const AuditDialog = ({
  open,
  onOpenChange,
  audit,
}: AuditDialogProps) => {
  const { createAudit, updateAudit, uploadReport, isCreating, isUpdating } = useAudits();

  const handleSubmit = async (data: any, file?: File) => {
    try {
      if (audit) {
        let reportUrl = audit.report_url;
        
        if (file) {
          reportUrl = await uploadReport(file, audit.id);
        }

        await updateAudit({
          id: audit.id,
          ...data,
          report_url: reportUrl,
        });
      } else {
        const newAudit = await createAudit({
          ...data,
          audit_number: "",
        });
        
        if (file && newAudit) {
          await uploadReport(file, newAudit.id);
        }
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting audit:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {audit ? "Modifier l'audit" : "Nouvel audit"}
          </DialogTitle>
          <DialogDescription>
            {audit
              ? "Modifiez les informations de l'audit"
              : "Planifiez un nouvel audit en remplissant les informations ci-dessous"}
          </DialogDescription>
        </DialogHeader>
        <AuditForm
          onSubmit={handleSubmit}
          initialData={audit}
          isLoading={isCreating || isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
};
