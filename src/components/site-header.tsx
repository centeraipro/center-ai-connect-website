import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ColorThemeSelector } from "@/components/ColorThemeSelector"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3 sm:px-4 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mx-1 sm:mx-2 h-4"
      />
      <h1 className="text-sm sm:text-base font-medium">Dashboard</h1>
      <div className="ml-auto flex items-center gap-1">
        <ColorThemeSelector />
        <ThemeToggle />
      </div>
    </header>
  )
}
