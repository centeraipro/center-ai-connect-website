import * as React from "react"
import {
  LayoutDashboardIcon,
  MessageSquareIcon,
  BarChartIcon,
  UsersIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  CalendarIcon,
  FileTextIcon,
  SettingsIcon,
  Scissors,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/features/auth/hooks/useAuth"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/app",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Conversations",
      url: "/app/conversations",
      icon: MessageSquareIcon,
    },
    {
      title: "Statistics",
      url: "/app/statistics",
      icon: BarChartIcon,
    },
    {
      title: "Customers",
      url: "/app/customers",
      icon: UsersIcon,
    },
    {
      title: "Products",
      url: "/app/products",
      icon: ShoppingBagIcon,
    },
    {
      title: "Orders",
      url: "/app/orders",
      icon: ShoppingCartIcon,
    },
    {
      title: "Services",
      url: "/app/services",
      icon: Scissors,
    },
    {
      title: "Appointments",
      url: "/app/appointments",
      icon: CalendarIcon,
    },
    {
      title: "Documents",
      url: "/app/documents",
      icon: FileTextIcon,
    },
    {
      title: "Configuration",
      url: "/app/configuration",
      icon: SettingsIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const userData = user
    ? {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        avatar: "/avatars/default.jpg",
      }
    : {
        name: "Guest",
        email: "guest@example.com",
        avatar: "/avatars/default.jpg",
      };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/app">
                <LayoutDashboardIcon className="h-5 w-5" />
                <span className="text-base font-semibold">
                  {user?.business?.name || "Dashboard"}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
