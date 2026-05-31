import { useState, useEffect } from "react";
import { Trophy, Award as AwardIcon } from "lucide-react";
import api from "../lib/api";
import { Reveal, SectionHeading, Loader, Empty } from "../components/ui";
import { useLang } from "../context/LangContext";

export default function Awards() {
  const { t, loc, lang } = useLang();
  const [awards, setAwards] = useState(null);

  useEffect(() => {
    api.get("/awards").then(({ data }) => setAwards(data));
  }, [lang]);

  if (!awards) return <Loader label={t("loading")} />;

  return (
    <div className="pb-10">
      <SectionHeading icon={Trophy} title={t("awards_honors")} />
      {awards.length === 0 ? (
        <Empty text={t("no_awards")} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {awards.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.05}>
              <div className="glass glass-hover flex gap-4 p-5">
                <div className="grad-border flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                  <AwardIcon className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-display text-lg text-white">{loc(a, "title")}</h3>
                    {a.year && <span className="font-mono text-xs text-[var(--faint)]">{a.year}</span>}
                  </div>
                  {loc(a, "issuer") && <div className="text-sm text-[var(--accent)]">{loc(a, "issuer")}</div>}
                  {loc(a, "description") && <p className="mt-2 text-sm text-[var(--muted)]">{loc(a, "description")}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
