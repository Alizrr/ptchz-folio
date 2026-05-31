import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Mail, FileText, BookOpen, Sparkles } from "lucide-react";
import api, { mediaUrl } from "../lib/api";
import { Reveal, SectionHeading, SocialIcon } from "../components/ui";
import Logo from "../components/Logo";
import { useLang } from "../context/LangContext";
import { useSettings } from "../context/SettingsContext";

export default function About() {
  const { profile } = useOutletContext();
  const { t, loc, isRtl, lang } = useLang();
  const { settings } = useSettings();
  const [news, setNews] = useState([]);
  const [education, setEducation] = useState([]);

  useEffect(() => {
    api.get("/news").then(({ data }) => setNews(data));
    api.get("/education").then(({ data }) => setEducation(data));
  }, [lang]);

  const p = profile || {};

  return (
    <div className="space-y-20 pb-10">
      {/* HERO */}
      <section>
        <div className="glass grad-border overflow-hidden p-6 sm:p-10">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`relative shrink-0 ${settings && !settings.show_photo ? "hidden" : ""}`}
            >
              <div className="absolute -inset-2 rounded-3xl opacity-60 blur-xl"
                   style={{ background: "var(--grad)" }} />
              {p.photo_url ? (
                <img src={mediaUrl(p.photo_url)} alt={loc(p, "name")}
                  className="relative h-40 w-40 rounded-3xl object-cover ring-1 ring-white/10" />
              ) : (
                <div className="relative flex h-40 w-40 items-center justify-center rounded-3xl bg-white/[0.04] ring-1 ring-white/10">
                  <Logo
                    seed={settings?.logo_seed || settings?.brand_name || p.name || "Portfolio"}
                    size={120}
                    tile={false}
                    style={settings?.logo_style}
                    complexity={settings?.logo_complexity}
                    showNodes={settings?.logo_show_nodes}
                  />
                </div>
              )}
            </motion.div>

            <div className={`flex-1 text-center sm:${isRtl ? "text-end" : "text-start"}`}>
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl"
              >
                {p.name || t("your_name")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="mt-2 text-lg font-medium grad-text"
              >
                {loc(p, "role") || t("your_role")}
              </motion.p>
              <p className="mt-1 text-[var(--muted)]">{loc(p, "institution")}</p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--muted)] sm:justify-start">
                {p.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[var(--accent)]" /> {p.location}
                  </span>
                )}
                {p.email && (
                  <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 hover:text-white">
                    <Mail className="h-4 w-4 text-[var(--accent)]" /> {p.email}
                  </a>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {(p.socials || []).slice(0, 5).map((s, i) => (
                  <a key={i} href={s.url || "#"} target="_blank" rel="noreferrer" className="chip">
                    <SocialIcon name={s.icon} className="h-3.5 w-3.5" /> {s.label}
                  </a>
                ))}
                {p.cv_url && (
                  <a href={p.cv_url} target="_blank" rel="noreferrer"
                     className="btn-grad flex items-center gap-1.5 px-3.5 py-1.5 text-sm">
                    <FileText className="h-3.5 w-3.5" /> {t("view_cv")}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* LEFT */}
        <div className="space-y-16">
          {loc(p, "bio") && (
            <Reveal>
              <section>
                <SectionHeading icon={BookOpen} title={t("about_me")} />
                <div className="glass p-6 sm:p-7">
                  <p className="leading-relaxed text-[var(--muted)]">{loc(p, "bio")}</p>
                </div>
              </section>
            </Reveal>
          )}

          {(isRtl ? (p.research_interests_fa || p.research_interests) : p.research_interests || []).length > 0 && (
            <Reveal>
              <section>
                <SectionHeading icon={Sparkles} title={t("research_interests")} />
                <div className="flex flex-wrap gap-2.5">
                  {(isRtl ? (p.research_interests_fa || p.research_interests) : p.research_interests || []).map((r, i) => (
                    <motion.span key={i}
                      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                      className="rounded-xl border border-[var(--border)] bg-white/[0.03] px-4 py-2.5 text-sm text-[var(--text)] transition hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]">
                      {r}
                    </motion.span>
                  ))}
                </div>
              </section>
            </Reveal>
          )}

          {education.length > 0 && (
            <Reveal>
              <section>
                <SectionHeading icon={BookOpen} title={t("education")} />
                <div className="tl-line space-y-5">
                  {education.map((e, i) => (
                    <Reveal key={e.id} delay={i * 0.06}>
                      <div className="tl-pad relative">
                        <div className="tl-dot" />
                        <div className="glass glass-hover p-5">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="font-display text-xl text-white">{loc(e, "degree")}</h3>
                            <span className="font-mono text-xs text-[var(--faint)]">
                              {e.start} – {e.end} {e.duration && `· ${e.duration}`}
                            </span>
                          </div>
                          <div className="text-sm text-[var(--accent)]">{loc(e, "institution")}</div>
                          {loc(e, "field") && <p className="mt-2 text-sm text-[var(--muted)]">{loc(e, "field")}</p>}
                          {loc(e, "supervisor") && (
                            <p className="mt-3 text-sm">
                              <span className="font-mono text-xs uppercase tracking-wider text-[var(--faint)]">{t("supervisor")}</span>
                              <br />
                              <span className="text-[var(--muted)]">{loc(e, "supervisor")}</span>
                            </p>
                          )}
                          {loc(e, "thesis") && (
                            <p className="mt-3 text-sm">
                              <span className="font-mono text-xs uppercase tracking-wider text-[var(--faint)]">{t("thesis")}</span>
                              <br />
                              <span className="text-[var(--muted)]">{loc(e, "thesis")}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>
            </Reveal>
          )}
        </div>

        {/* RIGHT — NEWS */}
        <div>
          <Reveal delay={0.1}>
            <section className="lg:sticky lg:top-24">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                </span>
                <h2 className="font-display text-xl text-white">{t("recent_news")}</h2>
              </div>
              <div className="glass max-h-[640px] space-y-1 overflow-y-auto p-2">
                {news.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-[var(--faint)]">{t("no_news")}</p>
                )}
                {news.map((n, i) => (
                  <motion.div key={n.id}
                    initial={{ opacity: 0, x: isRtl ? -12 : 12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                    className="rounded-xl px-4 py-3.5 transition hover:bg-white/[0.03]">
                    <span className="font-semibold text-[var(--accent)]">{n.date}:</span>{" "}
                    <span className="text-sm text-[var(--muted)]">{loc(n, "text")}</span>
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
