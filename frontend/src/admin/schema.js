// Schema-driven admin forms. Each section lists its editable fields,
// plus how to render a short summary in the list view.

export const ICON_OPTIONS = ["code", "cpu", "cloud", "database", "layers", "monitor", "network", "brain", "terminal"];
export const LEVEL_OPTIONS = ["expert", "proficient", "familiar"];

export const PROFILE_FIELDS = [
  { key: "name", label: "Full name", type: "text" },
  { key: "role", label: "Role / title", type: "text" },
  { key: "institution", label: "Institution", type: "text", full: true },
  { key: "location", label: "Location", type: "text" },
  { key: "email", label: "Primary email", type: "text" },
  { key: "photo_url", label: "Profile photo", type: "image", full: true },
  { key: "cv_url", label: "CV / Resume", type: "text", full: true },
  { key: "bio", label: "About me", type: "textarea", rows: 5, full: true },
  { key: "research_interests", label: "Research interests", type: "tags", full: true },
  { key: "contact_note", label: "Contact note", type: "text", full: true,
    placeholder: "Open to research collaborations, PhD advice, and industry projects" },
  { key: "emails", label: "Emails (contact page)", type: "objlist", full: true,
    subfields: [{ key: "label", label: "Label", type: "text" }, { key: "value", label: "Email", type: "text" }] },
  { key: "office", label: "Office", type: "object", full: true,
    subfields: [{ key: "room", label: "Room" }, { key: "address", label: "Address" }, { key: "map_url", label: "Map URL" }] },
  { key: "department", label: "Department", type: "object", full: true,
    subfields: [{ key: "name", label: "Name" }, { key: "university", label: "University" }] },
  { key: "socials", label: "Social links", type: "objlist", full: true,
    subfields: [
      { key: "label", label: "Label", type: "text" },
      { key: "url", label: "URL", type: "text" },
      { key: "icon", label: "Icon", type: "select", options: ["scholar", "github", "linkedin", "x", "orcid", "telegram", "instagram", "whatsapp", "email"] },
    ] },
];

export const SECTIONS = {
  news: {
    title: "News",
    fields: [
      { key: "date", label: "Date", type: "text", placeholder: "May 2026" },
      { key: "text", label: "Text", type: "textarea", full: true },
    ],
    summary: (n) => ({ title: n.date, sub: n.text }),
  },
  education: {
    title: "Education",
    fields: [
      { key: "degree", label: "Degree", type: "text" },
      { key: "institution", label: "Institution", type: "text" },
      { key: "field", label: "Field", type: "text", full: true },
      { key: "start", label: "Start", type: "text", placeholder: "Jan 2023" },
      { key: "end", label: "End", type: "text", placeholder: "Dec 2026" },
      { key: "duration", label: "Duration", type: "text", placeholder: "4 years" },
      { key: "supervisor", label: "Supervisor", type: "text", full: true },
      { key: "thesis", label: "Thesis", type: "textarea", full: true },
    ],
    summary: (e) => ({ title: `${e.degree} — ${e.institution}`, sub: `${e.start} – ${e.end}` }),
  },
  publications: {
    title: "Publications",
    fields: [
      { key: "number", label: "Number", type: "number" },
      { key: "type", label: "Type", type: "select", options: ["Conference", "Journal", "Workshop"] },
      { key: "year", label: "Year", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["published", "under_review"] },
      { key: "submitted_to", label: "Submitted to (if under review)", type: "text" },
      { key: "title", label: "Title", type: "textarea", rows: 2, full: true },
      { key: "authors", label: "Authors", type: "text", full: true },
      { key: "venue", label: "Venue", type: "text", full: true },
      { key: "pdf_url", label: "PDF", type: "text" },
      { key: "slides_url", label: "Slides", type: "text" },
      { key: "code_url", label: "Code URL", type: "text" },
      { key: "doi_url", label: "DOI URL", type: "text" },
      { key: "citations", label: "Citations", type: "number" },
      { key: "downloads", label: "Downloads", type: "number" },
    ],
    summary: (p) => ({ title: p.title || `(${p.status}) → ${p.submitted_to}`, sub: `${p.type} · ${p.year}` }),
  },
  experience: {
    title: "Experience",
    fields: [
      { key: "role", label: "Role", type: "text" },
      { key: "company", label: "Company", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "start", label: "Start", type: "text" },
      { key: "end", label: "End", type: "text" },
      { key: "current", label: "Current?", type: "boolean" },
      { key: "description", label: "Description", type: "textarea", full: true },
      { key: "tags", label: "Tags", type: "tags", full: true },
    ],
    summary: (e) => ({ title: `${e.role} @ ${e.company}`, sub: `${e.start} – ${e.current ? "Present" : e.end}` }),
  },
  teaching: {
    title: "Teaching",
    fields: [
      { key: "name", label: "University", type: "text" },
      { key: "logo_url", label: "Logo", type: "image" },
      { key: "years", label: "Years", type: "text", placeholder: "2023 - 2026" },
      { key: "courses_count", label: "Courses count", type: "number" },
      { key: "role", label: "Role", type: "text", placeholder: "Lead TA x5" },
      { key: "courses", label: "Courses", type: "objlist", full: true,
        subfields: [{ key: "name", label: "Course", type: "text" }, { key: "count", label: "Times", type: "number" }] },
    ],
    summary: (t) => ({ title: t.name, sub: `${t.years} · ${t.courses_count} courses` }),
  },
  students: {
    title: "Students",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "level", label: "Level", type: "text", placeholder: "MSc / BSc / PhD" },
      { key: "university", label: "University", type: "text" },
      { key: "period", label: "Period", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["active", "alumni"] },
      { key: "topic", label: "Topic", type: "textarea", full: true },
    ],
    summary: (s) => ({ title: s.name, sub: `${s.level} · ${s.status}` }),
  },
  skills: {
    title: "Skills",
    fields: [
      { key: "category", label: "Category", type: "text" },
      { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
      { key: "skills", label: "Skills", type: "objlist", full: true,
        subfields: [
          { key: "name", label: "Name", type: "text" },
          { key: "level", label: "Level", type: "select", options: LEVEL_OPTIONS },
        ] },
    ],
    summary: (s) => ({ title: s.category, sub: `${(s.skills || []).length} skills` }),
  },
  awards: {
    title: "Awards",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "description", label: "Description", type: "textarea", full: true },
    ],
    summary: (a) => ({ title: a.title, sub: `${a.issuer} ${a.year}` }),
  },
  projects: {
    title: "Projects",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "role", label: "Your role", type: "text" },
      { key: "url", label: "Link (live / repo)", type: "text", full: true },
      { key: "start", label: "Start", type: "text" },
      { key: "end", label: "End", type: "text" },
      { key: "current", label: "Ongoing?", type: "boolean" },
      { key: "description", label: "Description", type: "textarea", full: true },
      { key: "bullets", label: "Highlights", type: "tags", full: true,
        hint: "Each highlight is a short achievement line." },
      { key: "tags", label: "Tech / keywords", type: "tags", full: true },
    ],
    summary: (p) => ({ title: p.title, sub: p.role || p.url }),
  },
  certifications: {
    title: "Certifications",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "credential_id", label: "Credential ID", type: "text" },
      { key: "url", label: "Verify URL", type: "text", full: true },
    ],
    summary: (c) => ({ title: c.name, sub: `${c.issuer} ${c.year}` }),
  },
  languages: {
    title: "Languages",
    fields: [
      { key: "name", label: "Language", type: "text" },
      { key: "level", label: "Level", type: "select",
        options: ["Native", "Fluent", "Advanced", "Intermediate", "Basic"] },
    ],
    summary: (l) => ({ title: l.name, sub: l.level }),
  },
};
