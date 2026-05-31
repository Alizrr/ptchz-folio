import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, ChevronUp, ChevronDown, Loader2, Save } from "lucide-react";
import api from "../lib/api";
import { useLang } from "../context/LangContext";
import { Field } from "./components";
import { SECTIONS } from "./schema";

export default function CrudManager({ section }) {
  const cfg = SECTIONS[section];
  const { lang, ta } = useLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // object being edited (or {} for new)
  const [saving, setSaving] = useState(false);

  // `lang` is in the dependency list so switching language in the admin
  // re-creates `load`, which the effect below then runs — fetching that
  // language's rows. The API client attaches ?lang= automatically.
  const load = useCallback(() => {
    setLoading(true);
    api.get(`/${section}`).then(({ data }) => setItems(data)).finally(() => setLoading(false));
  }, [section, lang]);

  useEffect(() => { load(); }, [load]);

  const blank = () => {
    const o = {};
    cfg.fields.forEach((f) => {
      o[f.key] = f.type === "number" ? 0 : f.type === "boolean" ? false
        : ["tags", "objlist"].includes(f.type) ? [] : f.type === "object" ? {} : "";
    });
    return o;
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing.id) await api.put(`/${section}/${editing.id}`, editing);
      else await api.post(`/${section}`, editing);
      setEditing(null);
      load();
    } catch { alert(ta("Save failed")); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm(ta("Delete this item?"))) return;
    await api.delete(`/${section}/${id}`);
    load();
  };

  const move = async (index, dir) => {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
    await api.post(`/${section}/reorder`, next.map((x) => x.id));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white">{ta(cfg.title)}</h1>
          <p className="text-sm text-[var(--faint)]">{items.length} {ta("items")}</p>
        </div>
        <button onClick={() => setEditing(blank())} className="btn-grad flex items-center gap-2 px-4 py-2 text-sm">
          <Plus className="h-4 w-4" /> {ta("Add new")}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 spin text-[var(--muted)]" /></div>
      ) : items.length === 0 ? (
        <div className="glass py-16 text-center text-sm text-[var(--faint)]">{ta('Nothing yet. Click "Add new".')}</div>
      ) : (
        <div className="space-y-2">
          {items.map((it, i) => {
            const s = cfg.summary(it);
            return (
              <div key={it.id} className="glass glass-hover flex items-center gap-3 p-4">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => move(i, -1)} disabled={i === 0}
                    className="text-[var(--faint)] hover:text-white disabled:opacity-20"><ChevronUp className="h-4 w-4" /></button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1}
                    className="text-[var(--faint)] hover:text-white disabled:opacity-20"><ChevronDown className="h-4 w-4" /></button>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-white">{s.title || "(untitled)"}</div>
                  <div className="truncate text-sm text-[var(--faint)]">{s.sub}</div>
                </div>
                <button onClick={() => setEditing(it)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-white/5 hover:text-white">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(it.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--faint)] hover:bg-red-500/10 hover:text-red-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass my-8 w-full max-w-2xl p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl text-white">
                  {editing.id ? ta("Edit") : ta("New")} {lang === "fa" ? ta(cfg.title) : cfg.title.replace(/s$/, "")}
                </h2>
                <button onClick={() => setEditing(null)} className="text-[var(--faint)] hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {cfg.fields.map((f) => (
                  <Field key={f.key} def={f} value={editing[f.key]}
                    onChange={(v) => setEditing((p) => ({ ...p, [f.key]: v }))} />
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setEditing(null)} className="chip px-4 py-2">{ta("Cancel")}</button>
                <button onClick={save} disabled={saving}
                  className="btn-grad flex items-center gap-2 px-5 py-2 text-sm">
                  {saving ? <Loader2 className="h-4 w-4 spin" /> : <Save className="h-4 w-4" />} {ta("Save")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
