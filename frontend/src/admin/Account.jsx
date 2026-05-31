import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Loader2, Check, AlertCircle } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";

export default function Account() {
  const { user } = useAuth();
  const { ta } = useLang();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // {type, text}

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (next.length < 6) {
      setMsg({ type: "err", text: ta("New password must be at least 6 characters.") });
      return;
    }
    if (next !== confirm) {
      setMsg({ type: "err", text: ta("New passwords do not match.") });
      return;
    }
    setBusy(true);
    try {
      await api.post("/auth/change-password", { current_password: cur, new_password: next });
      setMsg({ type: "ok", text: ta("Password updated successfully.") });
      setCur(""); setNext(""); setConfirm("");
    } catch (e2) {
      setMsg({ type: "err", text: e2?.response?.data?.detail || ta("Could not update password.") });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-white">{ta("Account")}</h1>
        <p className="text-sm text-[var(--faint)]">
          {ta("Signed in as")} <span className="text-[var(--muted)]">{user?.username}</span>
        </p>
      </div>

      <form onSubmit={submit} className="glass space-y-4 p-6">
        <div className="mb-2 flex items-center gap-2 text-[var(--muted)]">
          <KeyRound className="h-4 w-4" />
          <span className="text-sm font-medium">{ta("Change password")}</span>
        </div>

        <div>
          <label className="lbl">{ta("Current password")}</label>
          <input type="password" className="field" value={cur}
            onChange={(e) => setCur(e.target.value)} autoComplete="current-password" />
        </div>
        <div>
          <label className="lbl">{ta("New password")}</label>
          <input type="password" className="field" value={next}
            onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
        </div>
        <div>
          <label className="lbl">{ta("Confirm new password")}</label>
          <input type="password" className="field" value={confirm}
            onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        </div>

        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              msg.type === "ok"
                ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : "border border-red-500/20 bg-red-500/10 text-red-300"
            }`}
          >
            {msg.type === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {msg.text}
          </motion.div>
        )}

        <div className="flex justify-end pt-1">
          <button type="submit" disabled={busy}
            className="btn-grad flex items-center gap-2 px-5 py-2 text-sm disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 spin" /> : <Check className="h-4 w-4" />}
            {ta("Update password")}
          </button>
        </div>
      </form>
    </div>
  );
}
