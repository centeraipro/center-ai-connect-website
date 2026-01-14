import { useState, useEffect } from 'react';
import { KanbanProvider, KanbanBoard, KanbanCards, KanbanCard, KanbanHeader, type DragEndEvent } from '@/components/ui/shadcn-io/kanban';
import { Skeleton } from '@/components/ui/skeleton';
import { useKanbanBoard } from '../hooks/useKanban';
import type { Lead, KanbanColumn as KanbanColumnType } from '../types/kanban.types';

interface DashboardKanbanProps {
  boardId: number;
}

export function DashboardKanban({ boardId }: DashboardKanbanProps) {
  const { board, isLoading, error, moveLead } = useKanbanBoard(boardId);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayBoard, setDisplayBoard] = useState(board);

  // Handle smooth transitions when board changes
  useEffect(() => {
    if (board && board.id !== displayBoard?.id) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayBoard(board);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    } else if (board) {
      setDisplayBoard(board);
    }
  }, [board, displayBoard?.id]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !board) {
      return;
    }

    const leadId = parseInt(active.id.toString());
    
    // Try to determine the target column
    // First, check if we dropped directly on a column
    let targetColumnId = parseInt(over.id.toString());
    
    // If we can't parse it as a number, it might be a card ID
    // So we need to find which column that card belongs to
    if (isNaN(targetColumnId)) {
      const targetCard = board.columns.flatMap(col => 
        col.leads.map(lead => ({ leadId: lead.id, columnId: col.id }))
      ).find(item => item.leadId.toString() === over.id.toString());
      
      if (targetCard) {
        targetColumnId = targetCard.columnId;
      } else {
        console.error('Could not determine target column', over.id);
        return;
      }
    }

    // Find the lead and its current column
    const currentColumn = board.columns.find(col =>
      col.leads.some(lead => lead.id === leadId)
    );

    if (!currentColumn) {
      return;
    }

    // If dropped on same column, no need to move
    if (currentColumn.id === targetColumnId) {
      return;
    }

    try {
      await moveLead(leadId, {
        targetColumnId,
        position: 0, // Add to top of column
      });
    } catch (err) {
      console.error('Failed to move lead:', err);
    }
  };

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load kanban board: {error}
        </div>
      </div>
    );
  }

  if (isLoading || !displayBoard) {
    return (
      <div className="px-4 lg:px-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Transform board data to kanban format
  const columns = displayBoard.columns
    .sort((a, b) => a.order - b.order)
    .map((col: KanbanColumnType) => ({
      id: col.id.toString(),
      name: col.name,
      color: col.color,
    }));

  const items = displayBoard.columns.flatMap((col: KanbanColumnType) =>
    col.leads.map((lead: Lead) => ({
      id: lead.id.toString(),
      name: lead.customer.name,
      column: col.id.toString(),
      email: lead.customer.email as string,
      score: lead.score as number,
      priority: lead.priority as string,
      assignedAdmin: lead.assigned_admin?.name as string | undefined,
    }))
  );

  return (
    <div className={`w-full transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <div className="mb-4 px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-semibold">{board.name}</h2>
        <p className="text-sm text-muted-foreground">
          Manage your leads and move them through the pipeline
        </p>
      </div>

      <KanbanProvider
        columns={columns}
        data={items}
        onDragEnd={handleDragEnd}
      >
        {(column) => (
          <KanbanBoard key={column.id} id={column.id}>
            <KanbanHeader style={{ borderTopColor: column.color }}>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{column.name}</span>
                <span className="text-xs text-muted-foreground">
                  {items.filter((item) => item.column === column.id).length}
                </span>
              </div>
            </KanbanHeader>
            <KanbanCards id={column.id}>
              {(item) => (
                <KanbanCard key={item.id} id={item.id} name={item.name} column={item.column}>
                  <div className="space-y-2 min-w-0">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.name as string}</p>
                      <p className="text-xs text-muted-foreground truncate" title={item.email as string}>
                        {item.email as string}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs whitespace-nowrap">
                        Score: <span className="font-medium">{item.score as number}</span>
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${
                        item.priority === 'hot'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : item.priority === 'warm'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {(item.priority as string).toUpperCase()}
                      </span>
                    </div>
                    {item.assignedAdmin && (
                      <p className="text-xs text-muted-foreground truncate" title={item.assignedAdmin as string}>
                        Assigned: {item.assignedAdmin as string}
                      </p>
                    )}
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
}
