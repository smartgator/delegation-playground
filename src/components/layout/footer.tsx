import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        <p className="text-sm text-muted-foreground">
          Built for{" "}
          <span className="font-medium text-foreground">
            MetaMask Delegation Framework
          </span>
        </p>
        <Link
          href="#"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Github className="h-4 w-4" />
          <span className="hidden sm:inline">GitHub</span>
        </Link>
      </div>
    </footer>
  )
}
