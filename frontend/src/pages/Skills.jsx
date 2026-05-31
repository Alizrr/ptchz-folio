import { useState, useEffect, useMemo } from "react";
import { Code2, Cpu, Cloud, Database, Layers, Monitor, Network, Brain, Terminal } from "lucide-react";
import api from "../lib/api";
import { Reveal, Loader, Empty } from "../components/ui";
import { useLang } from "../context/LangContext";

const CAT_ICONS = { code: Code2, cpu: Cpu, cloud: Cloud, database: Database, layers: Layers, monitor: Monitor, network: Network, brain: Brain, terminal: Terminal };
const LEVEL_COLORS = { expert: "var(--accent)", proficient: "#60a5fa", familiar: "#9aa3b2" };

function Dots({ level }) {
  const count = level === "expert" ? 3 : level === "proficient" ? 2 : 1;
  const color = LEVEL_COLORS[level] || LEVEL_COLORS.familiar;
  return (
    <span className="flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full"
          style={{ background: i < count ? color : "rgba(255,255,255,0.15)" }} />
      ))}
    </span>
  );
}

export default function Skills() {
  const { t, loc, lang } = useLang();
  const [skills, setSkills] = useState(null);

  useEffect(() => {
    api.get("/skills").then(({ data }) => setSkills(data));
  }, [lang]);

  const totalTech = useMemo(
    () => (skills || []).reduce((a, c) => a + (c.skills || []).length, 0),
    [skills]
  );

  if (!skills) return <Loader label={t("loading")} />;

  return (
    <div className="pb-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="grad-border flex h-11 w-11 items-center justify-center rounded-xl">
            <Code2 className="h-5 w-5 text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">{t("technical_skills")}</h1>
            <p className="text-sm text-[var(--muted)]">{totalTech} {t("technologies")}</p>
          </div>
        </div>
        <div className="glass flex items-center gap-4 px-4 py-2.5 text-xs">
          <span className="text-[var(--faint)]">{t("proficiency")}</span>
          {["expert", "proficient", "familiar"].map((lv) => (
            <span key={lv} className="flex items-center gap-1.5 text-[var(--muted)]">
              <Dots level={lv} /> {t(lv)}
            </span>
          ))}
        </div>
      </div>

      {skills.length === 0 ? (
        <Empty text={t("no_items")} />
      ) : (
        <div className="glass divide-y divide-[var(--border)] p-2">
          {skills.map((cat, i) => {
            const Icon = CAT_ICONS[cat.icon] || Code2;
            return (
              <Reveal key={cat.id} delay={i * 0.04}>
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
                  <div className="flex w-48 shrink-0 items-center gap-2.5 text-sm font-medium text-white">
                    <Icon className="h-4 w-4 text-[var(--accent)]" /> {loc(cat, "category")}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(cat.skills || []).map((s, k) => (
                      <span key={k} className="chip text-xs"
                        style={{ borderColor: `${LEVEL_COLORS[s.level] || LEVEL_COLORS.familiar}33` }}>
                        <Dots level={s.level} /> {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
