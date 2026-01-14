import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardKanban } from "@/features/dashboard/components/DashboardKanban"
import { BoardManagement } from "@/features/dashboard/components/BoardManagement"
import { BoardSelector } from "@/features/dashboard/components/BoardSelector"
import { useKanbanBoards } from "@/features/dashboard/hooks/useKanban"

export function DashboardContent() {
  const { boards, isLoading: boardsLoading } = useKanbanBoards();
  
  // State for selected board
  const [selectedBoardId, setSelectedBoardId] = useState<number | undefined>(undefined);

  // Initialize selected board when boards load
  useEffect(() => {
    if (boards.length > 0 && selectedBoardId === undefined) {
      const activeBoard = boards.find(board => board.is_active) || boards[0];
      setSelectedBoardId(activeBoard.id);
    }
  }, [boards, selectedBoardId]);

  // Get the currently selected board
  const currentBoard = boards.find(board => board.id === selectedBoardId);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full flex flex-col overflow-hidden">
          <SiteHeader />
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-8">
              <SectionCards />
            {!boardsLoading && (
              <>
                <BoardManagement boards={boards} />
                {boards.length > 0 && (
                  <BoardSelector
                    boards={boards}
                    selectedBoardId={selectedBoardId}
                    onBoardChange={setSelectedBoardId}
                  />
                )}
                {currentBoard && (
                  <div className="w-full relative z-10">
                    <DashboardKanban boardId={currentBoard.id} />
                  </div>
                )}
              </>
            )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
