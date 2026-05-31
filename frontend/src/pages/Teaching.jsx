import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ChevronDown, BookOpen, Building2, Users, Star, Activity } from "lucide-react";
import api, { mediaUrl } from "../lib/api";
import { Reveal, SectionHeading, Loader, Empty } from "../components/ui";
import { useLang } from "../context/LangContext";

function InstitutionCard({ inst, index }) {
  const { t, loc } = useLang();
  const [open, setOpen] = useState(index === 0);
  const isLead = (inst.role || "").toLowerCase().includes("lead");

  return (
    <Reveal delay={index * 0.06}>
      <div className="glass overflow-hidden">
        <button onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-4 p-5 text-start transition hover:bg-white/[0.02]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-white/[0.04]">
            {inst.logo_url
              ? <img src={mediaUrl(inst.logo_url)} alt="" className="h-full w-full object-contain p-1" />
              : <Building2 className="h-5 w-5 text-[var(--muted)]" />}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg text-white">{loc(inst, "name")}</h3>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--faint)]">
              <span className="font-mono">{inst.years}</span>
              <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {inst.courses_count} {t("courses")}</span>
              {inst.role && (
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${isLead ? "bg-amber-400/10 text-amber-300" : "bg-emerald-400/10 text-emerald-300"}`}>
                  <Star className="h-3 w-3" /> {inst.role}
                </span>
              )}
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 shrink-0 text-[var(--faint)] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (inst.courses || []).length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex flex-wrap gap-2 px-5 pb-5">
                {inst.courses.map((c, i) => (
                  <span key={i} className="chip text-xs">
                    {c.count > 0 && <Star className="h-3 w-3 text-amber-300" />}
                    {c.name}
                    {c.count > 0 && <span className="text-[var(--faint)]">×{c.count}</span>}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

function StudentRow({ s, index }) {
  const { loc } = useLang();
  const initials = (s.name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("");

  return (
    <Reveal delay={index * 0.05}>
      <div className="glass glass-hover flex gap-4 p-5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-medium ${s.status === "active" ? "bg-emerald-400/15 text-emerald-300" : "bg-white/[0.05] text-[var(--muted)]"}`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-medium text-white">{s.name}</h4>
            <span className="font-mono text-xs text-[var(--faint)]">{s.period}</span>
          </div>
          <div className="text-sm text-[var(--muted)]">{s.level} · {s.university}</div>
          {loc(s, "topic") && <p className="mt-2 text-sm text-[var(--faint)]">{loc(s, "topic")}</p>}
        </div>
      </div>
    </Reveal>
  );
}

export default function Teaching() {
  const { t, lang } = useLang();
  const [inst, setInst] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get("/teaching").then(({ data }) => setInst(data));
    api.get("/students").then(({ data }) => setStudents(data));
  }, [lang]);

  const totals = useMemo(() => {
    if (!inst) return {};
    return { universities: inst.length, courses: inst.reduce((a, b) => a + (b.courses_count || 0), 0) };
  }, [inst]);

  const active = students.filter((s) => s.status === "active");
  const alumni = students.filter((s) => s.status === "alumni");

  if (!inst) return <Loader label={t("loading")} />;

  return (
    <div className="space-y-16 pb-10">
      <section>
        <SectionHeading icon={GraduationCap} title={t("teaching_exp")}
          subtitle={`${totals.courses} ${t("courses")} / ${totals.universities} ${t("universities")}`} />
        {inst.length > 0 && (
          <div className="glass mb-6 flex flex-wrap gap-x-8 gap-y-3 px-6 py-4">
            <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-[var(--accent)]" />
              <span className="font-display text-lg text-white">{totals.courses}</span>
              <span className="text-sm text-[var(--faint)]">{t("teachings")}</span></div>
            <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-[var(--accent)]" />
              <span className="font-display text-lg text-white">{totals.universities}</span>
              <span className="text-sm text-[var(--faint)]">{t("universities")}</span></div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-[var(--accent)]" />
              <span className="font-display text-lg text-white">{students.length}</span>
              <span className="text-sm text-[var(--faint)]">{t("students_stat")}</span></div>
          </div>
        )}
        {inst.length === 0 ? <Empty text={t("no_teaching")} /> : (
          <div className="space-y-4">
            {inst.map((it, i) => <InstitutionCard key={it.id} inst={it} index={i} />)}
          </div>
        )}
      </section>

      {students.length > 0 && (
        <section>
          <SectionHeading icon={Users} title={t("students_advised")} subtitle={t("students_subtitle")} />
          {active.length > 0 && (
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
                <Activity className="h-4 w-4" /> {t("active")}
                <span className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[var(--faint)]">{active.length}</span>
              </div>
              <div className="space-y-3">
                {active.map((s, i) => <StudentRow key={s.id} s={s} index={i} />)}
              </div>
            </div>
          )}
          {alumni.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
                <GraduationCap className="h-4 w-4" /> {t("alumni")}
                <span className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[var(--faint)]">{alumni.length}</span>
              </div>
              <div className="space-y-3">
                {alumni.map((s, i) => <StudentRow key={s.id} s={s} index={i} />)}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
