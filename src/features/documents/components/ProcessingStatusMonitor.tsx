import { useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetFiles, useProcessFile } from '../hooks/useDocuments';
import type { DocumentFile } from '../types/document.types';

export function ProcessingStatusMonitor() {
  const { data, refetch } = useGetFiles({ status: 'processing' });
  const processFile = useProcessFile();

  const processingFiles = data?.files || [];

  // Poll every 5 seconds when there are processing files
  useEffect(() => {
    if (processingFiles.length === 0) return;

    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [processingFiles.length, refetch]);

  if (processingFiles.length === 0) return null;

  const handleRetry = (file: DocumentFile) => {
    if (file.document_type) {
      processFile.mutate({
        id: parseInt(file.id),
        params: { documentType: file.document_type },
      });
    }
  };

  return (
    <Card className="p-4 bg-blue-500/5 border-blue-500/20">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <h3 className="text-sm font-medium">
            Processing {processingFiles.length} document{processingFiles.length !== 1 ? 's' : ''}
          </h3>
        </div>

        <div className="space-y-2">
          {processingFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{file.original_filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {file.status === 'processing' && 'Vectorizing and indexing...'}
                    {file.status === 'indexed' && `Indexed with ${file.chunk_count} chunks`}
                    {file.status === 'failed' && (file.error_message || 'Processing failed')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {file.status === 'processing' && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
                {file.status === 'indexed' && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {file.status === 'failed' && (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRetry(file)}
                      disabled={processFile.isPending}
                    >
                      Retry
                    </Button>
                  </>
                )}
                {file.document_type && (
                  <Badge variant="outline" className="text-xs">
                    {file.document_type}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
