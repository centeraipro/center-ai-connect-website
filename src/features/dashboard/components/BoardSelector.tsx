import { Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { KanbanBoard } from '../types/kanban.types';

interface BoardSelectorProps {
  boards: KanbanBoard[];
  selectedBoardId: number | undefined;
  onBoardChange: (boardId: number) => void;
}

export function BoardSelector({ boards, selectedBoardId, onBoardChange }: BoardSelectorProps) {
  if (boards.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Board:</label>
      <Select
        value={selectedBoardId?.toString()}
        onValueChange={(value) => onBoardChange(Number(value))}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select a board" />
        </SelectTrigger>
        <SelectContent>
          {boards.map((board) => (
            <SelectItem key={board.id} value={board.id.toString()}>
              <div className="flex items-center gap-2">
                <span>{board.name}</span>
                {board.is_active && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
