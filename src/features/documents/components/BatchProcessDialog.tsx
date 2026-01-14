import { useState } from 'react';
import { FileStack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useBatchProcess } from '../hooks/useDocuments';
import type { DocumentType } from '../types/document.types';

interface BatchProcessDialogProps {
  selectedFileIds: number[];
  onSuccess?: () => void;
}

export function BatchProcessDialog({ selectedFileIds, onSuccess }: BatchProcessDialogProps) {
  const [open, setOpen] = useState(false);
  const [documentType, setDocumentType] = useState<DocumentType>('other');

  const batchProcess = useBatchProcess();

  const handleBatchProcess = async () => {
    await batchProcess.mutateAsync({
      fileIds: selectedFileIds,
      documentType,
    });
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={selectedFileIds.length === 0}>
          <FileStack className="mr-2 h-4 w-4" />
          Batch Process ({selectedFileIds.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Batch Process Documents</DialogTitle>
          <DialogDescription>
            Process multiple documents at once with the same settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Files Count */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-medium">
              {selectedFileIds.length} document{selectedFileIds.length !== 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              All selected documents will be processed with the same document type
            </p>
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <Label htmlFor="batch-document-type">Document Type *</Label>
            <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
              <SelectTrigger id="batch-document-type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="faq">FAQ</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Processing Info */}
          <div className="rounded-lg border bg-blue-500/10 p-3">
            <p className="text-xs text-muted-foreground">
              Documents will be queued for processing. You can monitor progress in the documents list.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBatchProcess} disabled={batchProcess.isPending}>
              {batchProcess.isPending ? 'Processing...' : `Process ${selectedFileIds.length} Document${selectedFileIds.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
