import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUploadFiles } from '../hooks/useDocuments';

export function UploadFileDialog() {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const uploadFiles = useUploadFiles();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    await uploadFiles.mutateAsync(selectedFiles);
    setSelectedFiles([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Upload PDF, DOCX, DOC, or TXT files to your document library
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="file-upload"
              className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50"
            >
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to select files or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOCX, DOC, TXT
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {selectedFiles.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {selectedFiles.length} file(s) selected:
                </p>
                {selectedFiles.map((file, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                ))}
              </div>
            )}
          </div>
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploadFiles.isPending}
            className="w-full"
          >
            {uploadFiles.isPending ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
