"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, Search, Bell, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useAuth, useClerk } from "@clerk/nextjs"
import Link from "next/link"

export function Header() {
  const { isSignedIn, isLoaded } = useAuth()
  const { signOut } = useClerk()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="container flex h-14 items-center">
        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              SpyPortuguês
            </span>
          </Link>
        </div>

        {/* Mobile logo */}
        <div className="flex md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">SpyPortuguês</span>
          </Link>
        </div>

        {/* Navigation - Desktop - Only show for authenticated users */}
        {isSignedIn && (
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/dashboard"
            >
              Painel
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/competitors"
            >
              Concorrentes
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/analytics"
            >
              Análises
            </Link>
          </nav>
        )}

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Search - Only show for authenticated users */}
          {isSignedIn && (
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Pesquisar..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {/* Notifications - Only for authenticated users */}
            {isSignedIn && (
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
            )}

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Authentication controls */}
            {isLoaded && (
              <>
                {isSignedIn ? (
                  /* User menu for authenticated users */
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-4 w-4" />
                        <span className="sr-only">User menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Perfil</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">Configurações</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => signOut()}
                        className="text-red-600"
                      >
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  /* Sign in/up buttons for unauthenticated users */
                  <div className="flex items-center space-x-2">
                    <Button asChild variant="ghost">
                      <Link href="/sign-in">Entrar</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/sign-up">Registar</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
