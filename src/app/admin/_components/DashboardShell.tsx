"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getStoredUser, logout } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  UserCircle,
  Settings,
  FolderOpen,
  Upload,
  BarChart3,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type Variant = "admin" | "investor";

const investorNav = [
  { href: "/investor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/investor", label: "Posts", icon: FileText },
];

export function DashboardShell({
  variant,
  children,
  title,
}: {
  variant: Variant;
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [investorsOpen, setInvestorsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [postsOpen, setPostsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [formsOpen, setFormsOpen] = useState(false);

  const basePath = variant === "admin" ? "/admin" : "/investor";

  // Read user after mount to avoid hydration mismatches
  useEffect(() => {
    setUser(getStoredUser());
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin/investors")) setInvestorsOpen(true);
    else if (pathname.startsWith("/admin/categories")) {
      setPostsOpen(true);
      setCategoriesOpen(true);
    } else if (pathname.startsWith("/admin/posts")) setPostsOpen(true);
    else if (pathname.startsWith("/admin/settings")) setSettingsOpen(true);
    else if (pathname.startsWith("/admin/documents") || pathname.startsWith("/admin/analytics")) setDocsOpen(true);
    else if (pathname.startsWith("/admin/forms")) setFormsOpen(true);
  }, [pathname]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black flex flex-col">
      {/* Dashboard header - top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-white/10 bg-black/95 backdrop-blur px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:bg-white/10 hover:text-ravok-gold"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Link href={basePath} className="flex items-center gap-2 shrink-0">
          <span className="font-heading font-bold text-lg text-white">RAVOK</span>
          <span className="text-xs font-sans uppercase tracking-widest text-ravok-slate hidden sm:inline">
            {variant === "admin" ? "Admin" : "Investor"}
          </span>
        </Link>
        <div className="flex-1 min-w-0" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-ravok-slate font-sans truncate max-w-[120px] sm:max-w-[200px]">
            {user.name}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 hover:text-ravok-gold shrink-0"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-white/10 bg-black/98 flex flex-col transition-transform duration-200 ease-out lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="flex flex-col gap-1 p-4">
            {variant === "admin" && (
              <>
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors",
                    pathname === "/admin"
                      ? "bg-ravok-gold/20 text-ravok-gold border border-ravok-gold/30"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  Dashboard
                </Link>

                {/* Investors dropdown */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setInvestorsOpen((o) => !o)}
                    aria-expanded={investorsOpen}
                    aria-controls="sidebar-investors"
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors",
                      pathname.startsWith("/admin/investors")
                        ? "bg-ravok-gold/10 text-ravok-gold border border-ravok-gold/20"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Users className="h-4 w-4 shrink-0" />
                      Investors
                    </span>
                    {investorsOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                  </button>
                  {investorsOpen && (
                    <div id="sidebar-investors" className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                      <Link href="/admin/investors" className={cn("rounded px-2 py-1.5 text-sm font-sans", (pathname === "/admin/investors" || pathname.startsWith("/admin/investors/details")) ? "text-ravok-gold" : "text-white/70 hover:text-white")}>All</Link>
                      <Link href="/admin/investors/requests" className={cn("rounded px-2 py-1.5 text-sm font-sans", pathname === "/admin/investors/requests" ? "text-ravok-gold" : "text-white/70 hover:text-white")}>View Request</Link>
                      <Link href="/admin/investors/approve" className={cn("rounded px-2 py-1.5 text-sm font-sans", pathname === "/admin/investors/approve" ? "text-ravok-gold" : "text-white/70 hover:text-white")}>Approve Request</Link>
                    </div>
                  )}
                </div>

                {/* Posts dropdown (includes Categories) */}
                <div className="mt-1">
                  <button
                    type="button"
                    onClick={() => setPostsOpen((o) => !o)}
                    aria-expanded={postsOpen}
                    aria-controls="sidebar-posts"
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors",
                      pathname.startsWith("/admin/posts") || pathname.startsWith("/admin/categories")
                        ? "bg-ravok-gold/10 text-ravok-gold border border-ravok-gold/20"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <FileText className="h-4 w-4 shrink-0" />
                      Posts
                    </span>
                    {postsOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                  </button>
                  {postsOpen && (
                    <div id="sidebar-posts" className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                      <Link href="/admin/posts" className={cn("rounded px-2 py-1.5 text-sm font-sans", (pathname === "/admin/posts" || pathname.startsWith("/admin/posts/edit")) ? "text-ravok-gold" : "text-white/70 hover:text-white")}>All</Link>
                      <Link href="/admin/posts/add" className={cn("rounded px-2 py-1.5 text-sm font-sans", pathname === "/admin/posts/add" ? "text-ravok-gold" : "text-white/70 hover:text-white")}>Add post</Link>
                      <div className="my-1 border-t border-white/10" />
                      <Link href="/admin/categories" className={cn("rounded px-2 py-1.5 text-sm font-sans", (pathname === "/admin/categories" || pathname.startsWith("/admin/categories/edit")) ? "text-ravok-gold" : "text-white/70 hover:text-white")}>Categories</Link>
                      <Link href="/admin/categories/add" className={cn("rounded px-2 py-1.5 text-sm font-sans", pathname === "/admin/categories/add" ? "text-ravok-gold" : "text-white/70 hover:text-white")}>Add category</Link>
                    </div>
                  )}
                </div>

                {/* Settings dropdown */}
                <div className="mt-1">
                  <button
                    type="button"
                    onClick={() => setSettingsOpen((o) => !o)}
                    aria-expanded={settingsOpen}
                    aria-controls="sidebar-settings"
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors",
                      pathname.startsWith("/admin/settings")
                        ? "bg-ravok-gold/10 text-ravok-gold border border-ravok-gold/20"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Settings className="h-4 w-4 shrink-0" />
                      Settings
                    </span>
                    {settingsOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                  </button>
                  {settingsOpen && (
                    <div id="sidebar-settings" className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                      <Link href="/admin/settings/email" className={cn("rounded px-2 py-1.5 text-sm font-sans", pathname === "/admin/settings/email" ? "text-ravok-gold" : "text-white/70 hover:text-white")}>Email forwarding</Link>
                    </div>
                  )}
                </div>

                {/* Investor Documents */}
                <div className="mt-1">
                  <button
                    type="button"
                    onClick={() => setDocsOpen((o) => !o)}
                    aria-expanded={docsOpen}
                    aria-controls="sidebar-docs"
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors",
                      pathname.startsWith("/admin/documents") || pathname.startsWith("/admin/analytics")
                        ? "bg-ravok-gold/10 text-ravok-gold border border-ravok-gold/20"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <FolderOpen className="h-4 w-4 shrink-0" />
                      Investor Documents
                    </span>
                    {docsOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                  </button>
                  {docsOpen && (
                    <div id="sidebar-docs" className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                      <Link href="/admin/documents/categories" className={cn("rounded px-2 py-1.5 text-sm font-sans", pathname === "/admin/documents/categories" ? "text-ravok-gold" : "text-white/70 hover:text-white")}>Document Categories</Link>
                      <Link href="/admin/documents/uploads" className={cn("rounded px-2 py-1.5 text-sm font-sans", pathname === "/admin/documents/uploads" ? "text-ravok-gold" : "text-white/70 hover:text-white")}>Upload Documents</Link>
                      <Link href="/admin/analytics" className={cn("flex items-center gap-1.5 rounded px-2 py-1.5 text-sm font-sans", pathname.startsWith("/admin/analytics") ? "text-ravok-gold" : "text-white/70 hover:text-white")}><BarChart3 className="h-3.5 w-3.5" />Analytics</Link>
                    </div>
                  )}
                </div>

                {/* Data Rooms */}
                <div className="mt-1">
                  <Link
                    href="/admin/rooms"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors",
                      pathname.startsWith("/admin/rooms")
                        ? "bg-ravok-gold/10 text-ravok-gold border border-ravok-gold/20"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <FolderOpen className="h-4 w-4 shrink-0" />
                    Data Rooms
                  </Link>
                </div>

                {/* Forms */}
                <div className="mt-1">
                  <Link
                    href="/admin/forms"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors",
                      pathname.startsWith("/admin/forms")
                        ? "bg-ravok-gold/10 text-ravok-gold border border-ravok-gold/20"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    Forms
                  </Link>
                </div>

                {/* Profile */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Link
                    href="/admin/profile"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors",
                      pathname === "/admin/profile"
                        ? "bg-ravok-gold/20 text-ravok-gold border border-ravok-gold/30"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <UserCircle className="h-4 w-4 shrink-0" />
                    Profile
                  </Link>
                </div>
              </>
            )}
            {variant === "investor" && (
              <>
                <Link
                  href="/investor"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors",
                    pathname === "/investor"
                      ? "bg-ravok-gold/20 text-ravok-gold border border-ravok-gold/30"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  Dashboard
                </Link>
                <Link
                  href="/investor/documents"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors",
                    pathname.startsWith("/investor/documents")
                      ? "bg-ravok-gold/20 text-ravok-gold border border-ravok-gold/30"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <FolderOpen className="h-4 w-4 shrink-0" />
                  Investor Documents
                </Link>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Link
                    href="/investor/profile"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors",
                      pathname === "/investor/profile"
                        ? "bg-ravok-gold/20 text-ravok-gold border border-ravok-gold/30"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <UserCircle className="h-4 w-4 shrink-0" />
                    Profile
                  </Link>
                </div>
              </>
            )}
          </nav>
          <div className="mt-auto p-4 border-t border-white/10">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-ravok-slate hover:text-ravok-gold font-sans transition-colors"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to website
            </Link>
          </div>
        </aside>

        {/* Overlay when sidebar open on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/60 lg:hidden top-14"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto flex flex-col min-w-0">
          {title && (
            <div className="border-b border-white/10 px-4 lg:px-6 py-4">
              <h1 className="font-heading font-bold text-xl text-ravok-gold uppercase tracking-wide">
                {title}
              </h1>
            </div>
          )}
          <div className="flex-1 p-4 lg:p-6">{children}</div>

          {/* Dashboard footer */}
          <footer className="border-t border-white/10 px-4 lg:px-6 py-3 flex items-center justify-between">
            <p className="text-xs font-sans text-ravok-slate">
              © {new Date().getFullYear()} RAVOK Studios. All rights reserved.
            </p>
            <Link
              href="/"
              className="text-xs font-sans text-ravok-slate hover:text-ravok-gold transition-colors"
            >
              Main site
            </Link>
          </footer>
        </main>
      </div>
    </div>
  );
}
