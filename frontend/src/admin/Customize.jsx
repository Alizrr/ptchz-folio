import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Loader2, Save, Check, Palette, Type, Eye, EyeOff, Layout as LayoutIcon,
  ChevronUp, ChevronDown, GripVertical, Sparkles, Shuffle, Network, CircleDot,
} from "lucide-react";
import api from "../lib/api";
import { useSettings, PALETTES, FONTS } from "../context/SettingsContext";
import { useLang } from "../context/LangContext";
import Logo, { randomLogoSeed } from "../components/Logo";

// Human labels for the section keys the resume is composed of.
const SECTION_LABELS = {
  summary: "Summary / About",
  experience: "Work Experience",
  projects: "Projects",
  education: "Education",
  skills: "Skills",
  publications: "Publications (academic)",
  teaching: "Teaching (academic)",
  research_interests: "Research Interests (academic)",
  certifications: "Certifications",
  languages: "Languages",
  awards: "Awards",
  news: "News / Updates",
  contact: "Contact",
};

const LOGO_STYLES = [
  ["cloud", "Cloud"],
  ["constellation", "Constellation"],
  ["prism", "Prism"],
  ["orbit", "Orbit"],
];

function Toggle({ on, onClick, labelOn = "On", labelOff = "Off" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${
        on ? "btn-grad" : "chip"
      }`}
    >
      {on ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
      {on ? labelOn : labelOff}
    </button>
  );
}

export default function Customize() {
  const { settings, preview, refresh } = useSettings();
  const { ta } = useLang();
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // Seed local draft from the loaded settings (once available).
  useEffect(() => {
    if (settings && !draft) setDraft(structuredClone(settings));
  }, [settings, draft]);

  if (!draft) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 spin text-[var(--muted)]" /></div>;
  }

  // Update a field, keep a live preview in sync.
  const set = (patch) => {
    setDraft((d) => {
      const next = { ...d, ...patch };
      preview(patch); // instant visual feedback
      return next;
    });
  };

  const setSection = (idx, patch) => {
    setDraft((d) => {
      const sections = d.sections.map((s, i) => (i === idx ? { ...s, ...patch } : s));
      return { ...d, sections };
    });
  };

  const moveSection = (idx, dir) => {
    setDraft((d) => {
      const j = idx + dir;
      if (j < 0 || j >= d.sections.length) return d;
      const sections = [...d.sections];
      [sections[idx], sections[j]] = [sections[j], sections[idx]];
      return { ...d, sections };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/settings", draft);
      await refresh();
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      alert(ta("Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const SaveBtn = () => (
    <button onClick={save} disabled={saving} className="btn-grad flex items-center gap-2 px-5 py-2 text-sm">
      {done ? <Check className="h-4 w-4" /> : saving ? <Loader2 className="h-4 w-4 spin" /> : <Save className="h-4 w-4" />}
      {done ? ta("Saved") : ta("Save changes")}
    </button>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white">{ta("Customize")}</h1>
          <p className="text-sm text-[var(--faint)]">{ta("Branding, theme, and which sections appear — preview updates live.")}</p>
        </div>
        <SaveBtn />
      </div>

      {/* Branding */}
      <section className="glass p-6">
        <div className="mb-4 flex items-center gap-2 font-display text-lg text-white">
          <Sparkles className="h-4 w-4 text-[var(--accent)]" /> {ta("Branding")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="lbl">{ta("Brand name")} <span className="text-[var(--faint)]">{ta("(optional — defaults to your profile name)")}</span></label>
            <input className="field" value={draft.brand_name || ""}
              onChange={(e) => set({ brand_name: e.target.value })} placeholder="e.g. Amir Noohi" />
          </div>
          <div>
            <label className="lbl">{ta("Tagline")}</label>
            <input className="field" value={draft.tagline || ""}
              onChange={(e) => set({ tagline: e.target.value })} placeholder="e.g. Systems researcher & engineer" />
          </div>
        </div>
      </section>

      {/* Logo */}
      <section className="glass p-6">
        <div className="mb-4 flex items-center gap-2 font-display text-lg text-white">
          <Network className="h-4 w-4 text-[var(--accent)]" /> {ta("Generated logo")}
        </div>
        <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
          <div className="flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white/[0.025] p-6">
            <Logo
              seed={draft.logo_seed || draft.brand_name || "Portfolio"}
              size={124}
              style={draft.logo_style}
              complexity={draft.logo_complexity}
              showNodes={draft.logo_show_nodes}
            />
          </div>
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <label className="lbl">{ta("Logo seed")}</label>
                <input className="field" value={draft.logo_seed || ""}
                  onChange={(e) => set({ logo_seed: e.target.value })} placeholder="Portfolio" />
              </div>
              <div className="flex items-end">
                <button onClick={() => set({ logo_seed: randomLogoSeed() })}
                  className="btn-grad flex items-center gap-2 px-4 py-2.5 text-sm">
                  <Shuffle className="h-4 w-4" /> {ta("Randomize")}
                </button>
              </div>
            </div>

            <div>
              <label className="lbl">{ta("Logo style")}</label>
              <div className="flex flex-wrap gap-2">
                {LOGO_STYLES.map(([key, label]) => (
                  <button key={key} onClick={() => set({ logo_style: key })}
                    className={`rounded-lg px-3 py-1.5 text-sm transition ${draft.logo_style === key ? "btn-grad" : "chip"}`}>
                    {ta(label)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <label className="lbl">{ta("Logo complexity")}</label>
                <input type="range" min="3" max="10" step="1" value={draft.logo_complexity || 6}
                  onChange={(e) => set({ logo_complexity: Number(e.target.value) })}
                  className="w-full accent-[var(--accent)]" />
                <div className="mt-1 font-mono text-xs text-[var(--faint)]">{draft.logo_complexity || 6}/10</div>
              </div>
              <div>
                <label className="lbl">{ta("Nodes")}</label>
                <button onClick={() => set({ logo_show_nodes: !draft.logo_show_nodes })}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${draft.logo_show_nodes ? "btn-grad" : "chip"}`}>
                  <CircleDot className="h-4 w-4" /> {draft.logo_show_nodes ? ta("Shown") : ta("Hidden")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme */}
      <section className="glass p-6">
        <div className="mb-4 flex items-center gap-2 font-display text-lg text-white">
          <Palette className="h-4 w-4 text-[var(--accent)]" /> {ta("Accent palette")}
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Object.entries(PALETTES).map(([key, p]) => (
            <button key={key} onClick={() => set({ accent: key, accent_custom: "" })}
              className={`group flex flex-col items-center gap-2 rounded-xl border p-3 transition ${
                draft.accent === key && !draft.accent_custom
                  ? "border-white/30 bg-white/[0.06]" : "border-[var(--border)] hover:border-white/20"}`}>
              <span className="h-8 w-8 rounded-full" style={{ background: p.grad }} />
              <span className="text-xs text-[var(--muted)]">{p.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="lbl mb-0">{ta("Custom accent")}</label>
          <input type="color" value={draft.accent_custom || "#34d399"}
            onChange={(e) => set({ accent_custom: e.target.value })}
            className="h-9 w-12 cursor-pointer rounded-lg border border-[var(--border)] bg-transparent" />
          {draft.accent_custom && (
            <button onClick={() => set({ accent_custom: "" })} className="chip text-xs">{ta("Clear custom")}</button>
          )}
        </div>
      </section>

      {/* Typography + layout */}
      <section className="glass p-6">
        <div className="mb-4 flex items-center gap-2 font-display text-lg text-white">
          <Type className="h-4 w-4 text-[var(--accent)]" /> {ta("Typography & feel")}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="lbl">{ta("Font pairing")}</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(FONTS).map(([key, f]) => (
                <button key={key} onClick={() => set({ font: key })}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${draft.font === key ? "btn-grad" : "chip"}`}
                  style={{ fontFamily: f.display }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="lbl">{ta("Density")}</label>
            <div className="flex gap-2">
              {["comfortable", "compact"].map((d) => (
                <button key={d} onClick={() => set({ density: d })}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${draft.density === d ? "btn-grad" : "chip"}`}>
                  {ta(d)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="lbl">{ta("Default language")}</label>
            <div className="flex gap-2">
              {[["en", "English"], ["fa", "فارسی"]].map(([k, lbl]) => (
                <button key={k} onClick={() => set({ default_lang: k })}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${draft.default_lang === k ? "btn-grad" : "chip"}`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="lbl">{ta("Profile photo")}</label>
              <Toggle on={draft.show_photo} onClick={() => set({ show_photo: !draft.show_photo })}
                labelOn={ta("Shown")} labelOff={ta("Hidden")} />
            </div>
            <div>
              <label className="lbl">{ta("Animated background")}</label>
              <Toggle on={draft.show_fx} onClick={() => set({ show_fx: !draft.show_fx })}
                labelOn={ta("On")} labelOff={ta("Off")} />
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="glass p-6">
        <div className="mb-1 flex items-center gap-2 font-display text-lg text-white">
          <LayoutIcon className="h-4 w-4 text-[var(--accent)]" /> {ta("Sections")}
        </div>
        <p className="mb-4 text-sm text-[var(--faint)]">
          {ta("Toggle sections on/off and drag the order with the arrows. The public resume shows enabled sections in this order.")}
        </p>
        <div className="space-y-2">
          {draft.sections.map((s, i) => (
            <div key={s.key}
              className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                s.enabled ? "border-[var(--border)] bg-white/[0.02]" : "border-transparent bg-white/[0.01] opacity-60"}`}>
              <GripVertical className="h-4 w-4 text-[var(--faint)]" />
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveSection(i, -1)} disabled={i === 0}
                  className="text-[var(--faint)] hover:text-white disabled:opacity-20"><ChevronUp className="h-4 w-4" /></button>
                <button onClick={() => moveSection(i, 1)} disabled={i === draft.sections.length - 1}
                  className="text-[var(--faint)] hover:text-white disabled:opacity-20"><ChevronDown className="h-4 w-4" /></button>
              </div>
              <span className="flex-1 text-sm text-white">{ta(SECTION_LABELS[s.key] || s.key)}</span>
              <Toggle on={s.enabled} onClick={() => setSection(i, { enabled: !s.enabled })}
                labelOn={ta("Visible")} labelOff={ta("Hidden")} />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <SaveBtn />
      </div>
    </div>
  );
}
