"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconBell,
  IconTrendingUp,
  IconBuilding,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
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

const data = {
  user: {
    name: "Utilizador",
    email: "user@spyportugues.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Concorrentes",
      url: "/competitors",
      icon: IconBuilding,
    },
    {
      title: "Análises",
      url: "/analytics",
      icon: IconChartBar,
    },
    {
      title: "Preços",
      url: "/prices",
      icon: IconTrendingUp,
    },
    {
      title: "Equipa",
      url: "/team",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Alertas",
      icon: IconBell,
      isActive: true,
      url: "/alerts",
      items: [
        {
          title: "Alertas Ativos",
          url: "/alerts/active",
        },
        {
          title: "Histórico",
          url: "/alerts/history",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Ajuda",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Pesquisar",
      url: "/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Relatórios",
      url: "/reports",
      icon: IconReport,
    },
    {
      name: "Base de Dados",
      url: "/database",
      icon: IconDatabase,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SpyPortuguês</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
