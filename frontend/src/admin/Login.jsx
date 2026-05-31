import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, Loader2, ArrowRight, ShieldCheck, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import Background from "../components/Background";

const TXT = {
  en: { title: "Admin Panel", sub: "Sign in to manage your portfolio", user: "Username",
        pass: "Password", err: "Incorrect username or password", signing: "Signing in…",
        signin: "Sign in" },
  fa: { title: "پنل مدیریت", sub: "برای مدیریت سایت خود وارد شوید", user: "نام کاربری",
        pass: "رمز عبور", err: "نام کاربری یا رمز عبور نادرست است", signing: "در حال ورود…",
        signin: "ورود" },
};

export default function Login() {
  const { login, user, ready } = useAuth();
  const { lang, setLang } = useLang();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const x = TXT[lang] || TXT.en;

  useEffect(() => {
    if (ready && user) nav("/admin/dashboard", { replace: true });
  }, [ready, user, nav]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(username, password);
      nav("/admin/dashboard", { replace: true });
    } catch {
      setErr(x.err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <Background />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass w-full max-w-md p-8"
      >
        {/* Language toggle */}
        <div className="mb-4 flex justify-end">
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            <Globe className="mx-1 h-3.5 w-3.5 text-[var(--faint)]" />
            {["en", "fa"].map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  lang === l ? "btn-grad" : "text-[var(--muted)] hover:text-white"}`}>
                {l === "en" ? "EN" : "فا"}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-7 flex flex-col items-center text-center">
          <div className="grad-border mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-2xl text-white">{x.title}</h1>
          <p className="mt-1 text-sm text-[var(--faint)]">{x.sub}</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="lbl">{x.user}</label>
            <div className="relative">
              <User className="field-icon h-4 w-4 text-[var(--faint)]" />
              <input
                className="field has-icon"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="lbl">{x.pass}</label>
            <div className="relative">
              <Lock className="field-icon h-4 w-4 text-[var(--faint)]" />
              <input
                type="password"
                className="field has-icon"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          {err && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
            >
              {err}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-grad flex w-full items-center justify-center gap-2 py-2.5 text-sm disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 spin" /> : <ArrowRight className="h-4 w-4" />}
            {busy ? x.signing : x.signin}
          </button>
        </form>

      </motion.div>
    </div>
  );
}
