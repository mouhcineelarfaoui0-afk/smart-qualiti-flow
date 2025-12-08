import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentForm } from "./DocumentForm";
import type { Tables } from "@/integrations/supabase/types";

type Document = Tables<"documents">;

interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document?: Document | null;
  onSubmit: (data: any) => Promise<void>;
  uploadFile: (file: File) => Promise<string>;
  isSubmitting?: boolean;
}

export const DocumentDialog = ({
  open,
  onOpenChange,
  document,
  onSubmit,
  uploadFile,
  isSubmitting,
}: DocumentDialogProps) => {
  const handleSubmit = async (data: any) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {document ? "Modifier le document" : "Nouveau document"}
          </DialogTitle>
        </DialogHeader>
        <DocumentForm
          document={document}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          uploadFile={uploadFile}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
