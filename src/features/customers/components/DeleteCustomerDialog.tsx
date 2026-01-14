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
import { useDeleteCustomer } from '../hooks/useCustomers';
import type { Customer } from '../types/customer.types';

interface DeleteCustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCustomerDialog({
  customer,
  open,
  onOpenChange,
}: DeleteCustomerDialogProps) {
  const deleteCustomer = useDeleteCustomer();

  const handleDelete = async () => {
    if (!customer) return;

    try {
      await deleteCustomer.mutateAsync(customer.id);
      onOpenChange(false);
    } catch (error) {
      // Error is already handled by the mutation's onError callback
      console.error('Failed to delete customer:', error);
      // Keep dialog open on error so user can try again or cancel
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {customer?.first_name} {customer?.last_name} from your
            customers. This action cannot be undone.
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
