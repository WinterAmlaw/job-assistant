import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg tracking-tight">Job Assistant</Link>
          <Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">Jobs</Link>
          <Link href="/resumes" className="text-muted-foreground hover:text-foreground transition-colors">Resumes</Link>
          <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">Tools</Link>
        </div>
      </div>
    </nav>
  );
}
