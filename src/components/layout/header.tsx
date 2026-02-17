"use client"

import Link from "next/link"
import { Link2, Home, Boxes } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
            <Link2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden text-lg font-semibold tracking-tight sm:inline-block">
            Delegation Playground
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link
            href="/playground"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Boxes className="h-4 w-4" />
            <span className="hidden sm:inline">Playground</span>
          </Link>
          <div className="ml-2 h-6 w-px bg-border" />
          <ThemeToggle />
          <div className="ml-2">
            <ConnectButton />
          </div>
        </nav>
      </div>
    </header>
  )
}
