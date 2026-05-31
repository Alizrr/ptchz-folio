import { SocialIcon } from "./ui";
import { useLang } from "../context/LangContext";
import { useSettings } from "../context/SettingsContext";

export default function Footer({ profile }) {
  const { t } = useLang();
  const { settings } = useSettings();
  const year = new Date().getFullYear();
  const name = settings?.brand_name || profile?.name || "";
  const tagline = settings?.tagline || profile?.role || "";

  return (
    <footer className="mt-24 border-t border-[var(--border)]">
      <div className="container-x flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="text-center sm:text-start">
          <div className="font-display text-lg text-white">{name || "Portfolio"}</div>
          <div className="text-sm text-[var(--faint)]">{tagline}</div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {(profile?.socials || []).map((s, i) => (
            <a
              key={i}
              href={s.url || "#"}
              target="_blank"
              rel="noreferrer"
              title={s.label}
              className="glass glass-hover flex h-10 w-10 items-center justify-center rounded-xl text-[var(--muted)] hover:text-white"
            >
              <SocialIcon name={s.icon} />
            </a>
          ))}
        </div>
      </div>
      <div className="container-x pb-8 text-center text-xs text-[var(--faint)] sm:text-start">
        © {year} {name}. {t("all_rights")}
      </div>
    </footer>
  );
}
