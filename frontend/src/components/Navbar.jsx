import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText, ScrollText } from "lucide-react";
import { useLang } from "../context/LangContext";
import { useSettings } from "../context/SettingsContext";
import Logo from "./Logo";

export default function Navbar({ profile }) {
  const { lang, setLang, t, isRtl } = useLang();
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  // A section is visible unless the admin disabled it in Customize.
  const enabled = (key) => {
    const s = (settings?.sections || []).find((x) => x.key === key);
    return s ? s.enabled : true;
  };

  const LINKS = [
    { to: "/", label: t("nav_about"), end: true, always: true },
    { to: "/publications", label: t("nav_publications"), key: "publications" },
    { to: "/experience", label: t("nav_experience"), key: "experience" },
    { to: "/teaching", label: t("nav_teaching"), key: "teaching" },
    { to: "/skills", label: t("nav_skills"), key: "skills" },
    { to: "/awards", label: t("nav_awards"), key: "awards" },
    { to: "/contact", label: t("nav_contact"), key: "contact" },
  ].filter((l) => l.always || enabled(l.key));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [loc.pathname]);

  const name = settings?.brand_name || profile?.name || "Portfolio";

  const LangToggle = () => (
    <div className="flex items-center gap-0 overflow-hidden rounded-lg border border-[var(--border)]">
      {["en", "fa"].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 text-xs font-medium transition ${
            lang === l
              ? "bg-white/10 text-white"
              : "text-[var(--faint)] hover:text-[var(--muted)]"
          }`}
        >
          {l === "en" ? "EN" : "FA"}
        </button>
      ))}
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-[var(--border)] bg-[#06070a]/70 backdrop-blur-xl" : ""
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo
            seed={settings?.logo_seed || name}
            size={36}
            style={settings?.logo_style}
            complexity={settings?.logo_complexity}
            showNodes={settings?.logo_show_nodes}
          />
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            {name}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `relative rounded-lg px-3.5 py-2 text-sm transition ${
                  isActive ? "text-white" : "text-[var(--muted)] hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid var(--border)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Desktop right: resume link + lang toggle + CV */}
        <div className="hidden items-center gap-3 md:flex">
          <NavLink
            to="/resume"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition ${
                isActive
                  ? "border-[var(--accent)] text-white"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-white"
              }`
            }
          >
            <ScrollText className="h-4 w-4" /> {t("nav_resume")}
          </NavLink>
          <LangToggle />
          {profile?.cv_url && (
            <a
              href={profile.cv_url}
              target="_blank"
              rel="noreferrer"
              className="btn-grad flex items-center gap-1.5 px-3.5 py-2 text-sm"
            >
              <FileText className="h-4 w-4" /> {t("nav_cv")}
            </a>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="glass flex h-10 w-10 items-center justify-center rounded-xl md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-[var(--border)] bg-[#06070a]/95 backdrop-blur-xl md:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              <NavLink
                to="/resume"
                className={({ isActive }) =>
                  `mb-1 flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                    isActive ? "border-[var(--accent)] text-white" : "border-[var(--border)] text-[var(--muted)]"
                  }`
                }
              >
                <ScrollText className="h-4 w-4" /> {t("nav_resume")}
              </NavLink>
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm ${
                      isActive ? "bg-white/[0.06] text-white" : "text-[var(--muted)]"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-2 flex items-center gap-3">
                <LangToggle />
                {profile?.cv_url && (
                  <a href={profile.cv_url} target="_blank" rel="noreferrer"
                     className="btn-grad flex items-center gap-1.5 px-3.5 py-2.5 text-sm">
                    <FileText className="h-4 w-4" /> {t("nav_cv")}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
