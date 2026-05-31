import { motion } from "framer-motion";
import {
  Github, Linkedin, Twitter, GraduationCap, Send, Instagram,
  MessageCircle, Globe, Loader2, Inbox, Mail,
} from "lucide-react";

export function Reveal({ children, delay = 0, y = 24, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ icon: Icon, title, subtitle, kicker }) {
  return (
    <div className="mb-8 flex items-start gap-4">
      {Icon && (
        <div className="grad-border mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
          <Icon className="h-5 w-5 text-[var(--accent)]" />
        </div>
      )}
      <div>
        {kicker && (
          <div className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--accent)_80%,transparent)]">
            {kicker}
          </div>
        )}
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1.5 text-sm text-[var(--muted)]">{subtitle}</p>}
      </div>
    </div>
  );
}

export function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-[var(--muted)]">
      <Loader2 className="h-5 w-5 spin" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function Empty({ text = "Nothing here yet." }) {
  return (
    <div className="glass flex flex-col items-center gap-3 py-16 text-center">
      <Inbox className="h-8 w-8 text-[var(--faint)]" />
      <p className="text-sm text-[var(--muted)]">{text}</p>
    </div>
  );
}

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  twitter: Twitter,
  scholar: GraduationCap,
  orcid: Globe,
  telegram: Send,
  instagram: Instagram,
  whatsapp: MessageCircle,
  email: Mail,
};

export function SocialIcon({ name, className = "h-4 w-4" }) {
  const Cmp = ICONS[(name || "").toLowerCase()] || Globe;
  return <Cmp className={className} />;
}
