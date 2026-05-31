import { useState, useEffect } from "react";
import { Loader2, Save, Check, Globe } from "lucide-react";
import api from "../lib/api";
import { useLang } from "../context/LangContext";
import { Field } from "./components";
import { PROFILE_FIELDS } from "./schema";

export default function ProfileEditor() {
  const { lang, ta } = useLang();
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // Reset to null first (shows spinner, avoids flashing the other language's
  // values) and reload the profile row for the currently selected language.
  useEffect(() => {
    setData(null);
    api.get("/profile").then(({ data }) => setData(data));
  }, [lang]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/profile", data);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch { alert(ta("Save failed")); }
    finally { setSaving(false); }
  };

  if (!data) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 spin text-[var(--muted)]" /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white">{ta("Profile & Contact")}</h1>
          <p className="flex items-center gap-1.5 text-sm text-[var(--faint)]">
            <Globe className="h-3.5 w-3.5" />
            {lang === "fa" ? "ویرایش نسخه‌ی فارسی" : "Editing the English version"}
          </p>
        </div>
        <button onClick={save} disabled={saving} className="btn-grad flex items-center gap-2 px-5 py-2 text-sm">
          {done ? <Check className="h-4 w-4" /> : saving ? <Loader2 className="h-4 w-4 spin" /> : <Save className="h-4 w-4" />}
          {done ? ta("Saved") : ta("Save")}
        </button>
      </div>
      <div className="glass grid gap-4 p-6 sm:grid-cols-2">
        {PROFILE_FIELDS.map((f) => (
          <Field key={f.key} def={f} value={data[f.key]}
            onChange={(v) => setData((p) => ({ ...p, [f.key]: v }))} />
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={save} disabled={saving} className="btn-grad flex items-center gap-2 px-5 py-2 text-sm">
          {done ? <Check className="h-4 w-4" /> : saving ? <Loader2 className="h-4 w-4 spin" /> : <Save className="h-4 w-4" />}
          {done ? ta("Saved") : ta("Save")}
        </button>
      </div>
    </div>
  );
}
