import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteFile } from '../hooks/useDocuments';

interface DeleteFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string;
  filename: string;
}

export function DeleteFileDialog({
  open,
  onOpenChange,
  fileId,
  filename,
}: DeleteFileDialogProps) {
  const deleteFile = useDeleteFile();

  const handleDelete = async () => {
    await deleteFile.mutateAsync(fileId);
    onOpenChange(false);
    // Force cleanup of any stray overlays after successful delete
    setTimeout(() => {
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
      overlays.forEach((overlay) => overlay.remove());
    }, 350);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      // Force cleanup when dialog closes
      setTimeout(() => {
        document.body.style.pointerEvents = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
        overlays.forEach((overlay) => overlay.remove());
      }, 350);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete File</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{filename}"? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
