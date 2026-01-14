import { useState } from 'react';
import { FileText, Settings } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useProcessFile } from '../hooks/useDocuments';
import type { DocumentType } from '../types/document.types';

interface ProcessFileDialogProps {
  fileId: number;
  filename: string;
  trigger?: React.ReactNode;
}

const documentTypeDescriptions: Record<DocumentType, string> = {
  policy: 'Company policies, terms of service, compliance documents',
  faq: 'Frequently asked questions and answers',
  guide: 'User guides, tutorials, documentation',
  other: 'General documents and content',
};

export function ProcessFileDialog({ fileId, filename, trigger }: ProcessFileDialogProps) {
  const [open, setOpen] = useState(false);
  const [documentType, setDocumentType] = useState<DocumentType>('other');
  const [chunkSize, setChunkSize] = useState('1000');
  const [chunkOverlap, setChunkOverlap] = useState('200');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const processFile = useProcessFile();

  const handleProcess = async () => {
    await processFile.mutateAsync({
      id: fileId,
      params: {
        documentType,
        chunkSize: parseInt(chunkSize),
        chunkOverlap: parseInt(chunkOverlap),
      },
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Process Document
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Process Document</DialogTitle>
          <DialogDescription>
            Vectorize and index this document to enable semantic search and AI-powered retrieval.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filename */}
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="truncate text-sm font-medium">{filename}</p>
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type *</Label>
            <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
              <SelectTrigger id="document-type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="faq">FAQ</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {documentTypeDescriptions[documentType]}
            </p>
          </div>

          {/* Advanced Settings */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Advanced Settings
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="chunk-size">Chunk Size</Label>
                <Input
                  id="chunk-size"
                  type="number"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(e.target.value)}
                  min="100"
                  max="2000"
                />
                <p className="text-xs text-muted-foreground">
                  Number of characters per chunk (default: 1000)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chunk-overlap">Chunk Overlap</Label>
                <Input
                  id="chunk-overlap"
                  type="number"
                  value={chunkOverlap}
                  onChange={(e) => setChunkOverlap(e.target.value)}
                  min="0"
                  max="500"
                />
                <p className="text-xs text-muted-foreground">
                  Number of overlapping characters between chunks (default: 200)
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Processing Info */}
          <div className="rounded-lg border bg-blue-500/10 p-3">
            <p className="text-xs text-muted-foreground">
              Processing will split the document into chunks, generate embeddings, and store them for semantic search.
              This may take a few moments depending on document size.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcess} disabled={processFile.isPending}>
              {processFile.isPending ? 'Processing...' : 'Start Processing'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
