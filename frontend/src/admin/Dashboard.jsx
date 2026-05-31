import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Newspaper, GraduationCap, FileText, Briefcase, BookOpen,
  Users, Cpu, Award, ArrowUpRight, Quote, Download, FileCheck, Layers, Globe,
  Upload, ShieldCheck, Eye,
} from "lucide-react";
import api from "../lib/api";
import { useLang } from "../context/LangContext";

const SECTION_CARDS = [
  { key: "news", label: "News", icon: Newspaper, to: "/admin/news" },
  { key: "education", label: "Education", icon: GraduationCap, to: "/admin/education" },
  { key: "publications", label: "Publications", icon: FileText, to: "/admin/publications" },
  { key: "experience", label: "Experience", icon: Briefcase, to: "/admin/experience" },
  { key: "teaching", label: "Teaching", icon: BookOpen, to: "/admin/teaching" },
  { key: "students", label: "Students", icon: Users, to: "/admin/students" },
  { key: "skills", label: "Skills", icon: Cpu, to: "/admin/skills" },
  { key: "awards", label: "Awards", icon: Award, to: "/admin/awards" },
];

const STAT_CARDS = [
  { key: "papers", label: "Papers", icon: Layers },
  { key: "published", label: "Published", icon: FileCheck },
  { key: "citations", label: "Citations", icon: Quote },
  { key: "downloads", label: "Downloads", icon: Download },
];

export default function Dashboard() {
  const { lang, ta } = useLang();
  const [counts, setCounts] = useState({});
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState({ skills: [], projects: [], experience: [] });

  // Re-count per language: the dashboard reflects the content set you're editing.
  useEffect(() => {
    let alive = true;
    Promise.all(
      SECTION_CARDS.map((s) =>
        api.get(`/${s.key}`).then(({ data }) => [s.key, data.length]).catch(() => [s.key, 0])
      )
    ).then((pairs) => alive && setCounts(Object.fromEntries(pairs)));
    api.get("/stats").then(({ data }) => alive && setStats(data)).catch(() => {});
    Promise.all([
      api.get("/profile").then((r) => r.data).catch(() => null),
      api.get("/skills").then((r) => r.data).catch(() => []),
      api.get("/projects").then((r) => r.data).catch(() => []),
      api.get("/experience").then((r) => r.data).catch(() => []),
    ]).then(([profileData, skills, projects, experience]) => {
      if (!alive) return;
      setProfile(profileData);
      setPreview({ skills, projects, experience });
    });
    return () => { alive = false; };
  }, [lang]);

  const checklist = [
    ["Name", !!profile?.name],
    ["Role", !!profile?.role],
    ["Summary", (profile?.bio || "").length > 120],
    ["Email", !!profile?.email || (profile?.emails || []).length > 0],
    ["Social links", (profile?.socials || []).length > 0],
    ["Experience", (counts.experience || 0) > 0],
    ["Projects", (counts.projects || 0) > 0],
    ["Skills", (counts.skills || 0) > 0],
    ["Resume/CV", !!profile?.cv_url],
    ["Photo or generated logo", !!profile?.photo_url],
  ];
  const score = Math.round((checklist.filter(([, ok]) => ok).length / checklist.length) * 100);

  const exportData = async () => {
    const { data } = await api.get("/export");
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ptchz-folio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file) => {
    if (!file) return;
    if (!confirm("Import will replace profile and content data. Continue?")) return;
    const text = await file.text();
    await api.post("/import", JSON.parse(text));
    window.location.reload();
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-display text-2xl text-white">{ta("Dashboard")}</h1>
        <p className="flex items-center gap-1.5 text-sm text-[var(--faint)]">
          <Globe className="h-3.5 w-3.5" />
          {lang === "fa"
            ? "نمایش و مدیریت محتوای فارسی"
            : "Viewing and managing English content"}
        </p>
      </div>

      {/* Publication stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_CARDS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-4"
            >
              <Icon className="mb-2 h-5 w-5 text-[var(--muted)]" />
              <div className="font-display text-2xl text-white">
                {stats ? stats[s.key] ?? 0 : "—"}
              </div>
              <div className="text-xs text-[var(--faint)]">{ta(s.label)}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <section className="glass p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg text-white">{ta("Profile readiness")}</h2>
              <p className="text-xs text-[var(--faint)]">{ta("Recruiter-facing completeness score")}</p>
            </div>
            <div className="text-end">
              <div className="font-display text-3xl text-white">{score}%</div>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${score}%` }} />
              </div>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {checklist.map(([label, ok]) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <ShieldCheck className={`h-4 w-4 ${ok ? "text-[var(--accent)]" : "text-[var(--faint)]"}`} />
                <span className={ok ? "text-[var(--muted)]" : "text-[var(--faint)]"}>{ta(label)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass p-5">
          <div className="mb-4 flex items-center gap-2">
            <Eye className="h-4 w-4 text-[var(--accent)]" />
            <h2 className="font-display text-lg text-white">{ta("Recruiter preview")}</h2>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xl font-semibold text-white">{profile?.name || ta("Full name")}</div>
              <div className="text-sm text-[var(--accent)]">{profile?.role || ta("Role / title")}</div>
              <p className="mt-2 max-h-16 overflow-hidden text-sm leading-relaxed text-[var(--muted)]">
                {profile?.bio || ta("Add a concise summary to make the first 30 seconds stronger.")}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(preview.skills || []).flatMap((c) => c.skills || []).slice(0, 8).map((s, i) => (
                <span key={`${s.name}-${i}`} className="chip text-xs">{s.name}</span>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(preview.experience || []).slice(0, 1).map((e) => (
                <div key={e.id} className="rounded-xl border border-[var(--border)] p-3 text-sm">
                  <div className="font-medium text-white">{e.role}</div>
                  <div className="text-[var(--faint)]">{e.company}</div>
                </div>
              ))}
              {(preview.projects || []).slice(0, 1).map((p) => (
                <div key={p.id} className="rounded-xl border border-[var(--border)] p-3 text-sm">
                  <div className="font-medium text-white">{p.title}</div>
                  <div className="text-[var(--faint)]">{p.role || p.url}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button onClick={exportData} className="chip">
          <Download className="h-4 w-4" /> {ta("Export content")}
        </button>
        <label className="chip cursor-pointer">
          <Upload className="h-4 w-4" /> {ta("Import content")}
          <input type="file" accept="application/json" className="hidden"
            onChange={(e) => importData(e.target.files?.[0])} />
        </label>
      </div>

      {/* Section managers */}
      <h2 className="mb-3 text-sm font-medium text-[var(--muted)]">{ta("Sections")}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECTION_CARDS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
            >
              <Link to={s.to} className="glass glass-hover group flex items-center gap-4 p-5">
                <div className="grad-border flex h-11 w-11 items-center justify-center rounded-xl">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-white">{ta(s.label)}</div>
                  <div className="text-xs text-[var(--faint)]">
                    {counts[s.key] === undefined ? "…" : `${counts[s.key]} ${ta(counts[s.key] === 1 ? "item" : "items")}`}
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[var(--faint)] transition group-hover:text-white" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
