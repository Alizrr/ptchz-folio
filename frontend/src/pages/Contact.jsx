import { useOutletContext } from "react-router-dom";
import { Mail, Building, MapPin, ExternalLink, AtSign } from "lucide-react";
import { Reveal, SectionHeading, SocialIcon } from "../components/ui";
import { useLang } from "../context/LangContext";

export default function Contact() {
  const { profile } = useOutletContext();
  const { t, loc } = useLang();
  const p = profile || {};

  return (
    <div className="pb-10">
      <SectionHeading icon={Mail} title={t("contact_title")}
        subtitle={loc(p, "contact_note") || t("contact_default")} />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {(p.emails || []).length > 0 && (
            <Reveal>
              <div className="glass p-6">
                <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
                  <AtSign className="h-4 w-4" /> {t("email_label")}
                </div>
                <div className="space-y-3">
                  {p.emails.map((e, i) => (
                    <a key={i} href={`mailto:${e.value}`}
                       className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-2 py-1.5 transition hover:bg-white/[0.03]">
                      <span className="w-24 text-xs uppercase tracking-wider text-[var(--faint)]">{e.label}</span>
                      <span className="text-[var(--text)]">{e.value}</span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
          {p.office?.room && (
            <Reveal delay={0.05}>
              <div className="glass flex items-start gap-4 p-6">
                <div className="grad-border flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                  <Building className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <div className="flex-1">
                  <div className="font-mono text-xs uppercase tracking-wider text-[var(--faint)]">{t("office_label")}</div>
                  <div className="mt-1 font-medium text-white">{p.office.room}</div>
                  {p.office.address && <div className="text-sm text-[var(--muted)]">{p.office.address}</div>}
                </div>
                {p.office.map_url && (
                  <a href={p.office.map_url} target="_blank" rel="noreferrer"
                     className="text-[var(--faint)] hover:text-white"><ExternalLink className="h-4 w-4" /></a>
                )}
              </div>
            </Reveal>
          )}
          {p.department?.name && (
            <Reveal delay={0.1}>
              <div className="glass flex items-start gap-4 p-6">
                <div className="grad-border flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                  <MapPin className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <div>
                  <div className="font-mono text-xs uppercase tracking-wider text-[var(--faint)]">{t("dept_label")}</div>
                  <div className="mt-1 font-medium text-white">{p.department.name}</div>
                  {p.department.university && <div className="text-sm text-[var(--muted)]">{p.department.university}</div>}
                </div>
              </div>
            </Reveal>
          )}
        </div>
        <Reveal delay={0.1}>
          <div className="glass p-6">
            <div className="mb-5 flex items-center gap-2 font-display text-lg text-white">
              <ExternalLink className="h-4 w-4 text-[var(--accent)]" /> {t("connect_label")}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(p.socials || []).map((s, i) => (
                <a key={i} href={s.url || "#"} target="_blank" rel="noreferrer"
                   className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm text-[var(--muted)] transition hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)] hover:text-white">
                  <SocialIcon name={s.icon} /> {s.label}
                </a>
              ))}
              {(p.socials || []).length === 0 && (
                <p className="col-span-2 text-sm text-[var(--faint)]">{t("no_links")}</p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
