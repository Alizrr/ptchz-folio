import { useState, useEffect } from "react";
import { Briefcase, MapPin } from "lucide-react";
import api from "../lib/api";
import { Reveal, SectionHeading, Loader, Empty } from "../components/ui";
import { useLang } from "../context/LangContext";

export default function Experience() {
  const { t, loc, lang } = useLang();
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.get("/experience").then(({ data }) => setItems(data));
  }, [lang]);

  if (!items) return <Loader label={t("loading")} />;

  return (
    <div className="pb-10">
      <SectionHeading icon={Briefcase} title={t("experience")} subtitle={t("experience_subtitle")} />
      {items.length === 0 ? (
        <Empty text={t("no_experience")} />
      ) : (
        <div className="tl-line space-y-6">
          {items.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.06}>
              <div className="tl-pad relative">
                <div className="tl-dot" />
                <div className="glass glass-hover p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl text-white">{loc(e, "role")}</h3>
                      <div className="mt-0.5 font-medium grad-text">{loc(e, "company")}</div>
                    </div>
                    <div className="text-end">
                      <div className="font-mono text-xs text-[var(--faint)]">
                        {e.start} – {e.current ? t("present") : e.end}
                      </div>
                      {e.location && (
                        <div className="mt-1 flex items-center justify-end gap-1 text-xs text-[var(--faint)]">
                          <MapPin className="h-3 w-3" /> {e.location}
                        </div>
                      )}
                    </div>
                  </div>
                  {loc(e, "description") && (
                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{loc(e, "description")}</p>
                  )}
                  {(e.tags || []).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {e.tags.map((tag, k) => <span key={k} className="chip text-xs">{tag}</span>)}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
