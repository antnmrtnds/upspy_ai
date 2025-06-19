"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Building2, 
  Home, 
  Settings, 
  TrendingUp,
  Users,
  Bell,
  ChevronLeft
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Building2, label: "Concorrentes", href: "/competitors" },
    { icon: BarChart3, label: "Análises", href: "/analytics" },
    { icon: TrendingUp, label: "Preços", href: "/prices" },
    { icon: Users, label: "Equipa", href: "/team" },
    { icon: Bell, label: "Alertas", href: "/alerts" },
    { icon: Settings, label: "Configurações", href: "/settings" },
  ]

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b lg:hidden">
        <span className="text-lg font-semibold">Menu</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center space-x-3 text-sm font-medium rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}
