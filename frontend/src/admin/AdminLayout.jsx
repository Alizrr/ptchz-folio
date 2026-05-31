import { useState } from "react";
import { NavLink, Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, UserCircle, Newspaper, GraduationCap, FileText,
  Briefcase, BookOpen, Users, Cpu, Award, KeyRound, LogOut,
  Loader2, Menu, X, ExternalLink, Globe,
  Palette, FolderGit2, BadgeCheck, Languages,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import Background from "../components/Background";

// A compact EN / FA switch. In the admin it decides WHICH language's content
// you are currently editing (it shares the same state as the public site).
function LangSwitch({ lang, setLang }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
      <Globe className="mx-1 h-3.5 w-3.5 text-[var(--faint)]" />
      {["en", "fa"].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
            lang === l ? "btn-grad" : "text-[var(--muted)] hover:text-white"
          }`}
        >
          {l === "en" ? "EN" : "فا"}
        </button>
      ))}
    </div>
  );
}

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/profile", label: "Profile & Contact", icon: UserCircle },
  { to: "/admin/customize", label: "Customize", icon: Palette },
  { divider: "Content" },
  { to: "/admin/news", label: "News", icon: Newspaper },
  { to: "/admin/education", label: "Education", icon: GraduationCap },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { to: "/admin/publications", label: "Publications", icon: FileText },
  { to: "/admin/teaching", label: "Teaching", icon: BookOpen },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/skills", label: "Skills", icon: Cpu },
  { to: "/admin/certifications", label: "Certifications", icon: BadgeCheck },
  { to: "/admin/languages", label: "Languages", icon: Languages },
  { to: "/admin/awards", label: "Awards", icon: Award },
  { divider: "Settings" },
  { to: "/admin/account", label: "Account", icon: KeyRound },
];

export default function AdminLayout() {
  const { user, ready, logout } = useAuth();
  const { lang, setLang, isRtl, ta } = useLang();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Background />
        <Loader2 className="h-6 w-6 spin text-[var(--muted)]" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin" replace />;

  const SidebarContent = () => (
    <>
      <Link to="/admin/dashboard" className="mb-4 flex items-center gap-3 px-2">
        <div className="grad-border flex h-9 w-9 items-center justify-center rounded-xl">
          <LayoutDashboard className="h-4 w-4 text-white" />
        </div>
        <span className="font-display text-lg text-white">{ta("Admin")}</span>
      </Link>

      {/* Which language am I editing right now? */}
      <div className="mb-5 px-2">
        <LangSwitch lang={lang} setLang={setLang} />
        <p className="mt-2 px-1 text-[11px] leading-relaxed text-[var(--faint)]">
          {lang === "fa"
            ? "در حال ویرایش محتوای فارسی"
            : "Editing English content"}
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {NAV.map((item, i) =>
          item.divider ? (
            <div key={`d-${i}`} className="px-3 pb-1 pt-4 text-[11px] uppercase tracking-wider text-[var(--faint)]">
              {ta(item.divider)}
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-[var(--muted)] hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {ta(item.label)}
            </NavLink>
          )
        )}
      </nav>

      <div className="mt-4 space-y-1 border-t border-white/5 pt-4">
        <a href="/" target="_blank" rel="noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-4 w-4" /> {ta("View site")}
        </a>
        <button onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:bg-red-500/10 hover:text-red-300">
          <LogOut className="h-4 w-4" /> {ta("Log out")}
        </button>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen">
      <Background />

      {/* Desktop sidebar */}
      <aside className="fixed start-0 top-0 z-40 hidden h-screen w-64 flex-col border-e border-white/5 bg-black/30 p-4 backdrop-blur-xl lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 bg-black/40 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link to="/admin/dashboard" className="font-display text-lg text-white">{ta("Admin")}</Link>
        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} setLang={setLang} />
          <button onClick={() => setOpen(true)} className="text-white"><Menu className="h-6 w-6" /></button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: isRtl ? 300 : -300 }} animate={{ x: 0 }} exit={{ x: isRtl ? 300 : -300 }}
              transition={{ type: "tween", duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-72 flex-col border-e border-white/5 bg-[var(--bg)]/95 p-4"
            >
              <button onClick={() => setOpen(false)}
                className="mb-2 self-end text-[var(--faint)] hover:text-white">
                <X className="h-5 w-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:ps-64">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
          <motion.div
            key={loc.pathname}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
