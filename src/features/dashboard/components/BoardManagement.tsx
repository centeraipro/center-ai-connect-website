import { useState } from 'react';
import { Plus, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBoardManagement } from '../hooks/useBoardManagement';
import type { KanbanBoard } from '../types/kanban.types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BoardManagementProps {
  boards: KanbanBoard[];
}

export function BoardManagement({ boards }: BoardManagementProps) {
  const { createBoard, deleteBoard } = useBoardManagement();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [language, setLanguage] = useState<'en' | 'es' | 'pt'>('en');

  const handleCreateBoard = () => {
    if (!boardName.trim()) return;

    createBoard.mutate(
      {
        name: boardName,
        language,
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          setBoardName('');
          setLanguage('en');
        },
      }
    );
  };

  const handleDeleteBoard = (boardId: number) => {
    console.log('Attempting to delete board:', boardId);
    deleteBoard.mutate(boardId, {
      onError: (error) => {
        console.error('Delete error:', error);
      }
    });
  };

  if (boards.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <CardTitle>No Kanban Boards</CardTitle>
          <CardDescription>
            Create your first board to start managing your leads
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Board
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Board</DialogTitle>
                <DialogDescription>
                  Create a new kanban board to organize your leads
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="board-name">Board Name</Label>
                  <Input
                    id="board-name"
                    placeholder="Sales Pipeline"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={(v) => setLanguage(v as 'en' | 'es' | 'pt')}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateBoard}
                  disabled={!boardName.trim() || createBoard.isPending}
                >
                  {createBoard.isPending ? 'Creating...' : 'Create Board'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Manage Boards</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Board
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Board</DialogTitle>
              <DialogDescription>
                Create a new kanban board to organize your leads
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="board-name">Board Name</Label>
                <Input
                  id="board-name"
                  placeholder="Sales Pipeline"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={(v) => setLanguage(v as 'en' | 'es' | 'pt')}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBoard}
                disabled={!boardName.trim() || createBoard.isPending}
              >
                {createBoard.isPending ? 'Creating...' : 'Create Board'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {boards.map((board) => (
          <Card key={board.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{board.name}</CardTitle>
                  <CardDescription>
                    {board.columns.length} columns
                  </CardDescription>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Board?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{board.name}" and all its columns.
                        {board.is_active && (
                          <span className="block mt-2 text-yellow-600 dark:text-yellow-500 font-medium">
                            ⚠️ This is your active board. Make sure all leads are removed first.
                          </span>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteBoard(board.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Board
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Settings className="h-4 w-4" />
                {board.is_active ? 'Active Board' : 'Inactive'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
