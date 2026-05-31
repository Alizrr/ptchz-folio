import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Quote, Download, FileText, Presentation, Code2, ExternalLink, Clock, SlidersHorizontal, Calendar } from "lucide-react";
import api from "../lib/api";
import { Reveal, Loader } from "../components/ui";
import { useLang } from "../context/LangContext";

const TYPE_COLORS = {
  Conference: "text-sky-300 bg-sky-400/10 border-sky-400/20",
  Journal:    "text-fuchsia-300 bg-fuchsia-400/10 border-fuchsia-400/20",
  Workshop:   "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
};

function LinkBtn({ href, icon: Icon, label }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="chip">
      <Icon className="h-3.5 w-3.5" /> {label}
    </a>
  );
}

function PubCard({ p, index }) {
  const { t, loc } = useLang();
  const isReview = p.status === "under_review";
  const typeLabel = p.type === "Conference" ? t("conference") : p.type === "Journal" ? t("journal") : t("workshop");

  return (
    <Reveal delay={index * 0.04}>
      <div className="glass glass-hover relative overflow-hidden p-6">
        {isReview ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <span className="btn-grad flex items-center gap-1.5 px-4 py-2 text-sm">
              <Clock className="h-4 w-4" /> {t("under_review")}
            </span>
            <div className="mt-2 text-[var(--text)]">
              {t("submitted_to")} <span className="font-semibold grad-text">{p.submitted_to}</span>
            </div>
            <div className="text-xs text-[var(--faint)]">{t("coming_soon")} · {p.year}</div>
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="hidden shrink-0 sm:block">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-white/[0.03] font-mono text-sm text-[var(--muted)]">
                {p.number}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[p.type] || "text-[var(--muted)] bg-white/5 border-[var(--border)]"}`}>
                  {typeLabel}
                </span>
                <span className="font-mono text-xs text-[var(--faint)]">{p.year}</span>
                <div className="ml-auto flex items-center gap-3 text-xs text-[var(--faint)]">
                  <span className="flex items-center gap-1"><Quote className="h-3.5 w-3.5" />{p.citations}</span>
                  <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" />{p.downloads}</span>
                </div>
              </div>
              <h3 className="font-display text-lg leading-snug text-white">{loc(p, "title")}</h3>
              <p className="mt-1.5 text-sm text-[var(--muted)]">{loc(p, "authors")}</p>
              {p.venue && <p className="mt-1 text-sm italic text-[var(--faint)]">{loc(p, "venue")}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <LinkBtn href={p.pdf_url} icon={FileText} label={t("pdf")} />
                <LinkBtn href={p.slides_url} icon={Presentation} label={t("slides")} />
                <LinkBtn href={p.code_url} icon={Code2} label={t("code")} />
                <LinkBtn href={p.doi_url} icon={ExternalLink} label="DOI" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}

export default function Publications() {
  const { t, lang } = useLang();
  const [pubs, setPubs] = useState(null);
  const [stats, setStats] = useState({});
  const [type, setType] = useState("All");
  const [year, setYear] = useState("All");

  useEffect(() => {
    api.get("/publications").then(({ data }) => setPubs(data));
    api.get("/stats").then(({ data }) => setStats(data));
  }, [lang]);

  const years = useMemo(() => {
    if (!pubs) return [];
    return [...new Set(pubs.map((p) => p.year).filter(Boolean))].sort((a, b) => b.localeCompare(a));
  }, [pubs]);

  const filtered = useMemo(() => {
    if (!pubs) return [];
    return pubs.filter((p) => (type === "All" || p.type === type) && (year === "All" || p.year === year));
  }, [pubs, type, year]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach((p) => { (g[p.year || "—"] = g[p.year || "—"] || []).push(p); });
    return Object.entries(g).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const TYPE_FILTERS = [
    { key: "All", label: t("all") },
    { key: "Conference", label: t("conference") },
    { key: "Journal", label: t("journal") },
    { key: "Workshop", label: t("workshop") },
  ];

  if (!pubs) return <Loader label={t("loading")} />;

  return (
    <div className="pb-10">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="grad-border flex h-11 w-11 items-center justify-center rounded-xl">
            <BookOpen className="h-5 w-5 text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">{t("nav_publications")}</h1>
            <p className="text-sm text-[var(--muted)]">{pubs.length} {t("papers")}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[var(--faint)]" />
          {TYPE_FILTERS.map((f) => (
            <button key={f.key} onClick={() => setType(f.key)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${type === f.key ? "btn-grad" : "chip"}`}>
              {f.label}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-[var(--border)]" />
          <Calendar className="h-4 w-4 text-[var(--faint)]" />
          {["All", ...years].map((y) => (
            <button key={y} onClick={() => setYear(y)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${year === y ? "btn-grad" : "chip"}`}>
              {y === "All" ? t("all") : y}
            </button>
          ))}
        </div>
      </div>

      <div className="glass mb-10 flex flex-wrap items-center gap-x-10 gap-y-3 px-6 py-4">
        <div className="flex items-center gap-2">
          <Quote className="h-4 w-4 text-[var(--accent)]" />
          <span className="font-display text-xl text-white">{stats.citations ?? 0}</span>
          <span className="text-sm text-[var(--muted)]">{t("citations")}</span>
        </div>
        <span className="h-6 w-px bg-[var(--border)]" />
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-[var(--accent)]" />
          <span className="font-display text-xl text-white">{stats.downloads ?? 0}</span>
          <span className="text-sm text-[var(--muted)]">{t("downloads")}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={type + year} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
          {grouped.map(([yr, items]) => (
            <div key={yr}>
              <div className="mb-5 flex items-center gap-4">
                <h2 className="font-display text-2xl font-semibold text-white">{yr}</h2>
                <span className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-xs text-[var(--faint)]">{items.length} {t("papers")}</span>
              </div>
              <div className="space-y-4">
                {items.map((p, i) => <PubCard key={p.id} p={p} index={i} />)}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-16 text-center text-[var(--muted)]">{t("no_pubs_filter")}</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
