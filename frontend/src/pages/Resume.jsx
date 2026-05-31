import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Mail, FileText, ExternalLink, Link2, Check, Printer,
  Briefcase, FolderGit2, GraduationCap, Cpu, BookOpen, Users,
  BadgeCheck, Languages as LangIcon, Trophy, Newspaper, Sparkles,
  Quote, Download, Star,
} from "lucide-react";
import api, { mediaUrl } from "../lib/api";
import { useLang } from "../context/LangContext";
import { useSettings } from "../context/SettingsContext";
import { SocialIcon, Loader } from "../components/ui";
import Logo from "../components/Logo";

const LEVEL_DOTS = { expert: 3, proficient: 2, familiar: 1 };

function Dots({ level }) {
  const n = LEVEL_DOTS[level] || 1;
  return (
    <span className="inline-flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full"
          style={{ background: i < n ? "var(--accent)" : "rgba(255,255,255,0.18)" }} />
      ))}
    </span>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="resume-section"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: "color-mix(in srgb, var(--accent) 14%, transparent)" }}>
          <Icon className="h-4 w-4" style={{ color: "var(--accent)" }} />
        </span>
        <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
        <span className="ms-1 h-px flex-1 bg-[var(--border)]" />
      </div>
      {children}
    </motion.section>
  );
}

function Period({ start, end, current, presentLabel }) {
  if (!start && !end && !current) return null;
  return (
    <span className="whitespace-nowrap font-mono text-xs text-[var(--faint)]">
      {start}{(start && (end || current)) ? " – " : ""}{current ? presentLabel : end}
    </span>
  );
}

export default function Resume() {
  const { t, lang, isRtl } = useLang();
  const { settings } = useSettings();
  const [d, setD] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    const get = (p) => api.get(p).then((r) => r.data).catch(() => null);
    Promise.all([
      get("/profile"), get("/experience"), get("/projects"), get("/education"),
      get("/skills"), get("/publications"), get("/teaching"), get("/students"),
      get("/certifications"), get("/languages"), get("/awards"), get("/news"),
    ]).then(([profile, experience, projects, education, skills, publications,
              teaching, students, certifications, languages, awards, news]) => {
      if (!alive) return;
      setD({ profile: profile || {}, experience, projects, education, skills, publications,
             teaching, students, certifications, languages, awards, news });
    });
    return () => { alive = false; };
  }, [lang]);

  const order = useMemo(
    () => (settings?.sections || []).filter((s) => s.enabled).map((s) => s.key),
    [settings]
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  };

  if (!d || !settings) return <Loader label={t("loading")} />;

  const p = d.profile;
  const has = (arr) => Array.isArray(arr) && arr.length > 0;

  // --- per-section renderers -------------------------------------------------
  const blocks = {
    summary: () => p.bio && (
      <Section icon={Sparkles} title={t("summary")}>
        <p className="max-w-3xl leading-relaxed text-[var(--muted)]">{p.bio}</p>
      </Section>
    ),

    research_interests: () => has(p.research_interests) && (
      <Section icon={Sparkles} title={t("research_interests")}>
        <div className="flex flex-wrap gap-2">
          {p.research_interests.map((r, i) => <span key={i} className="chip">{r}</span>)}
        </div>
      </Section>
    ),

    experience: () => has(d.experience) && (
      <Section icon={Briefcase} title={t("experience")}>
        <div className="space-y-5">
          {d.experience.map((e) => (
            <div key={e.id} className="resume-item">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="text-lg font-semibold text-white">{e.role}</h3>
                <Period start={e.start} end={e.end} current={e.current} presentLabel={t("present")} />
              </div>
              <div className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                {e.company}{e.location ? ` · ${e.location}` : ""}
              </div>
              {e.description && <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{e.description}</p>}
              {has(e.tags) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {e.tags.map((tg, i) => <span key={i} className="chip text-xs">{tg}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    ),

    projects: () => has(d.projects) && (
      <Section icon={FolderGit2} title={t("projects")}>
        <div className="grid gap-4 sm:grid-cols-2">
          {d.projects.map((pr) => (
            <div key={pr.id} className="glass glass-hover p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-white">{pr.title}</h3>
                {pr.url && (
                  <a href={pr.url} target="_blank" rel="noreferrer"
                     className="text-[var(--faint)] hover:text-white" title={t("view_project")}>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              {pr.role && <div className="text-sm" style={{ color: "var(--accent)" }}>{pr.role}</div>}
              {pr.description && <p className="mt-2 text-sm text-[var(--muted)]">{pr.description}</p>}
              {has(pr.bullets) && (
                <ul className="mt-2 space-y-1">
                  {pr.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[var(--muted)]">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {has(pr.tags) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {pr.tags.map((tg, i) => <span key={i} className="chip text-xs">{tg}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    ),

    education: () => has(d.education) && (
      <Section icon={GraduationCap} title={t("education")}>
        <div className="space-y-4">
          {d.education.map((e) => (
            <div key={e.id} className="resume-item">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="text-lg font-semibold text-white">{e.degree}</h3>
                <Period start={e.start} end={e.end} presentLabel={t("present")} />
              </div>
              <div className="text-sm" style={{ color: "var(--accent)" }}>{e.institution}</div>
              {e.field && <p className="mt-1 text-sm text-[var(--muted)]">{e.field}</p>}
              {e.supervisor && <p className="mt-1 text-sm text-[var(--faint)]">{t("supervisor")}: {e.supervisor}</p>}
            </div>
          ))}
        </div>
      </Section>
    ),

    skills: () => has(d.skills) && (
      <Section icon={Cpu} title={t("technical_skills")}>
        <div className="grid gap-4 sm:grid-cols-2">
          {d.skills.map((c) => (
            <div key={c.id}>
              <div className="mb-2 text-sm font-semibold text-white">{c.category}</div>
              <div className="flex flex-wrap gap-1.5">
                {(c.skills || []).map((s, i) => (
                  <span key={i} className="chip text-xs"><Dots level={s.level} /> {s.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    ),

    publications: () => has(d.publications) && (
      <Section icon={BookOpen} title={t("nav_publications")}>
        <div className="space-y-3">
          {d.publications.map((pub) => (
            <div key={pub.id} className="resume-item">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-[var(--faint)]">{pub.year}</span>
                <h3 className="font-medium text-white">{pub.title || `${t("submitted_to")} ${pub.submitted_to}`}</h3>
              </div>
              {pub.authors && <p className="text-sm text-[var(--muted)]">{pub.authors}</p>}
              {pub.venue && <p className="text-sm italic text-[var(--faint)]">{pub.venue}</p>}
              {(pub.citations > 0 || pub.downloads > 0) && (
                <div className="mt-1 flex gap-4 text-xs text-[var(--faint)]">
                  {pub.citations > 0 && <span className="flex items-center gap-1"><Quote className="h-3 w-3" />{pub.citations}</span>}
                  {pub.downloads > 0 && <span className="flex items-center gap-1"><Download className="h-3 w-3" />{pub.downloads}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    ),

    teaching: () => has(d.teaching) && (
      <Section icon={BookOpen} title={t("teaching_exp")}>
        <div className="space-y-3">
          {d.teaching.map((ti) => (
            <div key={ti.id} className="resume-item">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="font-semibold text-white">{ti.name}</h3>
                <span className="font-mono text-xs text-[var(--faint)]">{ti.years}</span>
              </div>
              {ti.role && <div className="text-sm" style={{ color: "var(--accent)" }}>{ti.role}</div>}
              {has(ti.courses) && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ti.courses.map((c, i) => (
                    <span key={i} className="chip text-xs">{c.name}{c.count > 0 ? ` ×${c.count}` : ""}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {has(d.students) && (
            <div className="mt-4">
              <div className="mb-2 text-sm font-semibold text-white">{t("students_advised")}</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {d.students.map((s) => (
                  <div key={s.id} className="glass p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-white">{s.name}</span>
                      <span className="text-xs text-[var(--faint)]">{s.period}</span>
                    </div>
                    <div className="text-xs text-[var(--muted)]">{s.level} · {s.university}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
    ),

    certifications: () => has(d.certifications) && (
      <Section icon={BadgeCheck} title={t("certifications")}>
        <div className="grid gap-3 sm:grid-cols-2">
          {d.certifications.map((c) => (
            <div key={c.id} className="glass flex items-start justify-between gap-3 p-4">
              <div>
                <h3 className="font-medium text-white">{c.name}</h3>
                <div className="text-sm text-[var(--muted)]">{c.issuer}{c.year ? ` · ${c.year}` : ""}</div>
                {c.credential_id && <div className="font-mono text-xs text-[var(--faint)]">{c.credential_id}</div>}
              </div>
              {c.url && (
                <a href={c.url} target="_blank" rel="noreferrer"
                   className="chip shrink-0 text-xs"><ExternalLink className="h-3 w-3" /> {t("verify")}</a>
              )}
            </div>
          ))}
        </div>
      </Section>
    ),

    languages: () => has(d.languages) && (
      <Section icon={LangIcon} title={t("languages")}>
        <div className="flex flex-wrap gap-3">
          {d.languages.map((l) => (
            <div key={l.id} className="glass flex items-center gap-3 px-4 py-2.5">
              <span className="font-medium text-white">{l.name}</span>
              <span className="text-sm" style={{ color: "var(--accent)" }}>{l.level}</span>
            </div>
          ))}
        </div>
      </Section>
    ),

    awards: () => has(d.awards) && (
      <Section icon={Trophy} title={t("awards_honors")}>
        <div className="grid gap-3 sm:grid-cols-2">
          {d.awards.map((a) => (
            <div key={a.id} className="glass p-4">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-medium text-white">{a.title}</h3>
                {a.year && <span className="font-mono text-xs text-[var(--faint)]">{a.year}</span>}
              </div>
              {a.issuer && <div className="text-sm" style={{ color: "var(--accent)" }}>{a.issuer}</div>}
              {a.description && <p className="mt-1 text-sm text-[var(--muted)]">{a.description}</p>}
            </div>
          ))}
        </div>
      </Section>
    ),

    news: () => has(d.news) && (
      <Section icon={Newspaper} title={t("recent_news")}>
        <div className="space-y-2">
          {d.news.map((n) => (
            <div key={n.id} className="flex gap-3 text-sm">
              <span className="shrink-0 font-medium" style={{ color: "var(--accent)" }}>{n.date}</span>
              <span className="text-[var(--muted)]">{n.text}</span>
            </div>
          ))}
        </div>
      </Section>
    ),

    contact: () => (
      <Section icon={Mail} title={t("contact_title")}>
        <div className="flex flex-wrap gap-2">
          {has(p.emails) ? p.emails.map((e, i) => (
            <a key={i} href={`mailto:${e.value}`} className="chip"><Mail className="h-3.5 w-3.5" /> {e.value}</a>
          )) : p.email && <a href={`mailto:${p.email}`} className="chip"><Mail className="h-3.5 w-3.5" /> {p.email}</a>}
          {(p.socials || []).map((s, i) => (
            <a key={i} href={s.url || "#"} target="_blank" rel="noreferrer" className="chip">
              <SocialIcon name={s.icon} className="h-3.5 w-3.5" /> {s.label}
            </a>
          ))}
        </div>
      </Section>
    ),
  };

  return (
    <div className="resume-root mx-auto max-w-4xl pb-16">
      {/* Share / action bar */}
      <div className="resume-actions mb-6 flex items-center justify-end gap-2">
        <button onClick={copyLink} className="chip">
          {copied ? <Check className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} /> : <Link2 className="h-3.5 w-3.5" />}
          {copied ? t("link_copied") : t("share_link")}
        </button>
        <button onClick={() => window.print()} className="chip">
          <Printer className="h-3.5 w-3.5" /> {t("print")}
        </button>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass grad-border mb-12 overflow-hidden p-7 sm:p-9"
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:text-start">
          {settings.show_photo && (
            <div className="relative shrink-0">
              <div className="absolute -inset-1.5 rounded-3xl opacity-50 blur-lg" style={{ background: "var(--grad)" }} />
              {p.photo_url ? (
                <img src={mediaUrl(p.photo_url)} alt={p.name}
                  className="relative h-28 w-28 rounded-3xl object-cover ring-1 ring-white/10" />
              ) : (
                <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white/[0.04] ring-1 ring-white/10">
                  <Logo
                    seed={settings.logo_seed || settings.brand_name || p.name || "Portfolio"}
                    size={84}
                    tile={false}
                    style={settings.logo_style}
                    complexity={settings.logo_complexity}
                    showNodes={settings.logo_show_nodes}
                  />
                </div>
              )}
            </div>
          )}
          <div className="flex-1 text-center sm:text-start">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white">
              {settings.brand_name || p.name || t("your_name")}
            </h1>
            <p className="mt-1 text-lg font-medium grad-text">{settings.tagline || p.role || t("your_role")}</p>
            {p.institution && <p className="mt-1 text-[var(--muted)]">{p.institution}</p>}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[var(--muted)] sm:justify-start">
              {p.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" style={{ color: "var(--accent)" }} /> {p.location}</span>}
              {p.email && <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 hover:text-white"><Mail className="h-4 w-4" style={{ color: "var(--accent)" }} /> {p.email}</a>}
            </div>
            {(has(p.socials) || p.cv_url) && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {(p.socials || []).slice(0, 5).map((s, i) => (
                  <a key={i} href={s.url || "#"} target="_blank" rel="noreferrer" className="chip text-xs">
                    <SocialIcon name={s.icon} className="h-3.5 w-3.5" /> {s.label}
                  </a>
                ))}
                {p.cv_url && (
                  <a href={p.cv_url} target="_blank" rel="noreferrer" className="btn-grad flex items-center gap-1.5 px-3.5 py-1.5 text-sm">
                    <FileText className="h-3.5 w-3.5" /> {t("download_cv")}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Sections in the admin-defined order */}
      <div className="space-y-12">
        {order.map((key) => {
          const render = blocks[key];
          return render ? <div key={key}>{render()}</div> : null;
        })}
      </div>
    </div>
  );
}
