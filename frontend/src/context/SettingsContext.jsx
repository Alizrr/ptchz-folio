import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../lib/api";

const SettingsContext = createContext(null);

// Accent palettes. Each defines the solid accent, the brand gradient, and the
// three tints used by the animated background blobs.
export const PALETTES = {
  emerald: { label: "Emerald", accent: "#34d399",
    grad: "linear-gradient(135deg,#34d399 0%,#22d3ee 48%,#818cf8 100%)",
    blobs: ["#059669", "#4f46e5", "#0891b2"] },
  violet: { label: "Violet", accent: "#a78bfa",
    grad: "linear-gradient(135deg,#a78bfa 0%,#8b5cf6 50%,#6366f1 100%)",
    blobs: ["#7c3aed", "#4f46e5", "#9333ea"] },
  ocean: { label: "Ocean", accent: "#38bdf8",
    grad: "linear-gradient(135deg,#38bdf8 0%,#22d3ee 50%,#3b82f6 100%)",
    blobs: ["#0284c7", "#2563eb", "#0891b2"] },
  rose: { label: "Rose", accent: "#fb7185",
    grad: "linear-gradient(135deg,#fb7185 0%,#f472b6 50%,#e879f9 100%)",
    blobs: ["#e11d48", "#db2777", "#c026d3"] },
  amber: { label: "Amber", accent: "#fbbf24",
    grad: "linear-gradient(135deg,#fbbf24 0%,#fb923c 50%,#f87171 100%)",
    blobs: ["#d97706", "#ea580c", "#dc2626"] },
  mono: { label: "Mono", accent: "#cbd5e1",
    grad: "linear-gradient(135deg,#e2e8f0 0%,#cbd5e1 50%,#94a3b8 100%)",
    blobs: ["#475569", "#334155", "#64748b"] },
};

// Latin font pairings (Persian always uses Dana, handled in CSS).
export const FONTS = {
  classic: { label: "Classic", display: '"Fraunces", serif', body: '"Sora", sans-serif' },
  modern: { label: "Modern", display: '"Space Grotesk", sans-serif', body: '"Inter", sans-serif' },
  clean: { label: "Clean", display: '"Sora", sans-serif', body: '"Sora", sans-serif' },
};

const DEFAULTS = {
  brand_name: "", tagline: "", accent: "emerald", accent_custom: "",
  logo_seed: "Portfolio", logo_style: "cloud", logo_complexity: 6, logo_show_nodes: true,
  font: "classic", template: "aurora", density: "comfortable",
  show_photo: true, show_fx: true, default_lang: "en", sections: [],
};

/** Apply a settings object to the document root (CSS variables + classes). */
export function applySettings(s) {
  const root = document.documentElement;

  // Accent / gradient
  const pal = PALETTES[s.accent] || PALETTES.emerald;
  const custom = (s.accent_custom || "").trim();
  if (custom) {
    // Build a tasteful gradient + varied background tints from the single chosen
    // colour using color-mix, so a custom accent looks as rich as the presets
    // (instead of a flat, single-colour gradient).
    const lighter = `color-mix(in srgb, ${custom} 70%, white)`;
    const deeper = `color-mix(in srgb, ${custom} 75%, black)`;
    root.style.setProperty("--accent", custom);
    root.style.setProperty("--grad", `linear-gradient(135deg, ${lighter} 0%, ${custom} 50%, ${deeper} 100%)`);
    root.style.setProperty("--blob-1", `color-mix(in srgb, ${custom} 80%, black)`);
    root.style.setProperty("--blob-2", custom);
    root.style.setProperty("--blob-3", `color-mix(in srgb, ${custom} 60%, #4f46e5)`);
  } else {
    root.style.setProperty("--accent", pal.accent);
    root.style.setProperty("--grad", pal.grad);
    root.style.setProperty("--blob-1", pal.blobs[0]);
    root.style.setProperty("--blob-2", pal.blobs[1]);
    root.style.setProperty("--blob-3", pal.blobs[2]);
  }

  // Fonts
  const f = FONTS[s.font] || FONTS.classic;
  root.style.setProperty("--font-display", f.display);
  root.style.setProperty("--font-body", f.body);

  // Background FX + density
  root.classList.toggle("no-fx", !s.show_fx);
  root.classList.toggle("compact", s.density === "compact");
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/settings");
      const merged = { ...DEFAULTS, ...data };
      setSettings(merged);
      applySettings(merged);
      // If the visitor has no saved language yet, honour the site default.
      if (!localStorage.getItem("lang") && merged.default_lang) {
        localStorage.setItem("lang", merged.default_lang);
      }
    } catch {
      setSettings(DEFAULTS);
      applySettings(DEFAULTS);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Let the admin preview unsaved changes instantly.
  const preview = useCallback((partial) => {
    setSettings((prev) => {
      const next = { ...(prev || DEFAULTS), ...partial };
      applySettings(next);
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refresh, preview }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
