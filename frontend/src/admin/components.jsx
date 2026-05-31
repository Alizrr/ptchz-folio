import { useState } from "react";
import { Upload, X, Plus, Trash2, Loader2, Check } from "lucide-react";
import { useLang } from "../context/LangContext";
import api, { mediaUrl } from "../lib/api";

/* ---------- File / image uploader ---------- */
export function Uploader({ value, onChange, accept, image }) {
  const { ta } = useLang();
  const [busy, setBusy] = useState(false);
  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } catch {
      alert(ta("Upload failed"));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex items-center gap-3">
      {image && value && (
        <img src={mediaUrl(value)} alt="" className="h-14 w-14 rounded-lg object-cover ring-1 ring-white/10" />
      )}
      <label className="chip cursor-pointer">
        {busy ? <Loader2 className="h-3.5 w-3.5 spin" /> : <Upload className="h-3.5 w-3.5" />}
        {value ? ta("Replace") : ta("Upload")}
        <input type="file" className="hidden" accept={accept}
          onChange={(e) => upload(e.target.files[0])} />
      </label>
      {value && (
        <>
          <input className="field flex-1" value={value} onChange={(e) => onChange(e.target.value)} />
          <button onClick={() => onChange("")} className="text-[var(--faint)] hover:text-red-300">
            <X className="h-4 w-4" />
          </button>
        </>
      )}
      {!value && (
        <input className="field flex-1" placeholder={ta("or paste a URL")}
          onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

/* ---------- Tag list (array of strings) ---------- */
export function TagList({ value = [], onChange }) {
  const { ta } = useLang();
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v) { onChange([...(value || []), v]); setDraft(""); }
  };
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {(value || []).map((t, i) => (
          <span key={i} className="chip text-xs">
            {t}
            <button onClick={() => onChange(value.filter((_, k) => k !== i))}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="field flex-1" value={draft} placeholder={ta("Type and press Add")}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} />
        <button onClick={add} className="chip"><Plus className="h-3.5 w-3.5" /> {ta("Add")}</button>
      </div>
    </div>
  );
}

/* ---------- Object list (array of {subfields}) ---------- */
export function ObjList({ value = [], onChange, subfields }) {
  const { ta } = useLang();
  const blank = Object.fromEntries(subfields.map((f) => [f.key, f.type === "number" ? 0 : ""]));
  const update = (i, key, v) => {
    const next = [...value];
    next[i] = { ...next[i], [key]: v };
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {(value || []).map((row, i) => (
        <div key={i} className="flex flex-wrap items-end gap-2 rounded-xl border border-[var(--border)] p-3">
          {subfields.map((f) => (
            <div key={f.key} className="min-w-[120px] flex-1">
              <label className="lbl">{ta(f.label)}</label>
              {f.type === "select" ? (
                <select className="field" value={row[f.key] || ""}
                  onChange={(e) => update(i, f.key, e.target.value)}>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input className="field" type={f.type === "number" ? "number" : "text"}
                  value={row[f.key] ?? ""}
                  onChange={(e) => update(i, f.key, f.type === "number" ? Number(e.target.value) : e.target.value)} />
              )}
            </div>
          ))}
          <button onClick={() => onChange(value.filter((_, k) => k !== i))}
            className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg text-[var(--faint)] hover:bg-red-500/10 hover:text-red-300">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...(value || []), blank])} className="chip">
        <Plus className="h-3.5 w-3.5" /> {ta("Add row")}
      </button>
    </div>
  );
}

/* ---------- Single object ({subfields}) ---------- */
export function ObjField({ value = {}, onChange, subfields }) {
  const { ta } = useLang();
  return (
    <div className="grid gap-3 rounded-xl border border-[var(--border)] p-3 sm:grid-cols-2">
      {subfields.map((f) => (
        <div key={f.key}>
          <label className="lbl">{ta(f.label)}</label>
          <input className="field" value={value?.[f.key] || ""}
            onChange={(e) => onChange({ ...value, [f.key]: e.target.value })} />
        </div>
      ))}
    </div>
  );
}

/* ---------- Master field renderer ---------- */
export function Field({ def, value, onChange }) {
  const { ta } = useLang();
  const common = "field";
  return (
    <div className={def.full ? "sm:col-span-2" : ""}>
      <label className="lbl">{ta(def.label)}</label>
      {def.type === "textarea" && (
        <textarea rows={def.rows || 3} className={common} value={value ?? ""}
          onChange={(e) => onChange(e.target.value)} />
      )}
      {def.type === "text" && (
        <input className={common} value={value ?? ""} placeholder={def.placeholder}
          onChange={(e) => onChange(e.target.value)} />
      )}
      {def.type === "number" && (
        <input type="number" className={common} value={value ?? 0}
          onChange={(e) => onChange(Number(e.target.value))} />
      )}
      {def.type === "select" && (
        <select className={common} value={value ?? def.options[0]}
          onChange={(e) => onChange(e.target.value)}>
          {def.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {def.type === "boolean" && (
        <button onClick={() => onChange(!value)}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
            value ? "btn-grad" : "chip"}`}>
          {value ? <Check className="h-4 w-4" /> : null} {value ? ta("Yes") : ta("No")}
        </button>
      )}
      {def.type === "image" && <Uploader value={value} onChange={onChange} accept="image/*" image />}
      {def.type === "file" && <Uploader value={value} onChange={onChange} accept={def.accept} />}
      {def.type === "tags" && <TagList value={value} onChange={onChange} />}
      {def.type === "objlist" && <ObjList value={value} onChange={onChange} subfields={def.subfields} />}
      {def.type === "object" && <ObjField value={value} onChange={onChange} subfields={def.subfields} />}
      {def.hint && <p className="mt-1 text-xs text-[var(--faint)]">{ta(def.hint)}</p>}
    </div>
  );
}
