import { createContext, useContext, useState, useEffect, useCallback } from "react";

const LangContext = createContext(null);

// All UI strings in both languages
const TRANS = {
  en: {
    // Navbar
    nav_about: "About",
    nav_publications: "Publications",
    nav_experience: "Experience",
    nav_teaching: "Teaching",
    nav_skills: "Skills",
    nav_awards: "Awards",
    nav_contact: "Contact",
    nav_cv: "CV / Resume",
    // About page
    about_me: "About Me",
    research_interests: "Research Interests",
    education: "Education",
    recent_news: "Recent News",
    supervisor: "Supervisor",
    thesis: "Thesis",
    view_cv: "View CV",
    your_name: "Your Name",
    your_role: "Your Role",
    no_news: "No news yet.",
    // Publications
    citations: "citations",
    downloads: "downloads",
    all: "All",
    conference: "Conference",
    journal: "Journal",
    workshop: "Workshop",
    under_review: "Under Review",
    submitted_to: "Submitted to",
    coming_soon: "Coming soon",
    no_pubs_filter: "No publications match these filters.",
    pdf: "Pdf",
    slides: "Slides",
    code: "Code",
    papers: "papers",
    // Experience
    experience: "Experience",
    experience_subtitle: "Research & industry roles",
    present: "Present",
    no_experience: "No experience entries yet.",
    // Teaching
    teaching_exp: "Teaching Experience",
    students_advised: "Students Advised",
    students_subtitle: "Mentoring the next generation of researchers",
    teachings: "teachings",
    universities: "universities",
    students_stat: "students advised",
    active: "ACTIVE",
    alumni: "ALUMNI",
    courses: "courses",
    no_teaching: "No teaching entries yet.",
    // Awards / Skills
    awards_honors: "Awards & Honors",
    no_awards: "No awards added yet.",
    technical_skills: "Technical Skills",
    technologies: "technologies",
    proficiency: "Proficiency:",
    expert: "Expert",
    proficient: "Proficient",
    familiar: "Familiar",
    // Contact
    contact_title: "Get in Touch",
    contact_default: "Open to research collaborations and projects",
    email_label: "EMAIL",
    office_label: "OFFICE",
    dept_label: "DEPARTMENT",
    connect_label: "Connect",
    no_links: "No links added yet.",
    // Misc
    loading: "Loading",
    no_items: "Nothing here yet.",
    view_site: "View site",
    all_rights: "All rights reserved.",
    // Resume view + new sections
    nav_resume: "Résumé",
    projects: "Projects",
    certifications: "Certifications",
    languages: "Languages",
    summary: "Summary",
    share_link: "Copy link",
    link_copied: "Link copied!",
    print: "Print",
    view_project: "View project",
    verify: "Verify",
    download_cv: "Download CV",
  },
  fa: {
    // Navbar
    nav_about: "درباره",
    nav_publications: "مقالات",
    nav_experience: "تجربیات",
    nav_teaching: "تدریس",
    nav_skills: "مهارت‌ها",
    nav_awards: "جوایز",
    nav_contact: "تماس",
    nav_cv: "رزومه",
    // About
    about_me: "درباره‌ی من",
    research_interests: "علایق پژوهشی",
    education: "تحصیلات",
    recent_news: "اخبار اخیر",
    supervisor: "استاد راهنما",
    thesis: "پایان‌نامه",
    view_cv: "مشاهده رزومه",
    your_name: "نام شما",
    your_role: "نقش شما",
    no_news: "هنوز خبری اضافه نشده.",
    // Publications
    citations: "استناد",
    downloads: "دانلود",
    all: "همه",
    conference: "کنفرانس",
    journal: "مجله",
    workshop: "کارگاه",
    under_review: "در دست بررسی",
    submitted_to: "ارسال‌شده به",
    coming_soon: "به‌زودی",
    no_pubs_filter: "مقاله‌ای با این فیلترها یافت نشد.",
    pdf: "فایل PDF",
    slides: "اسلاید",
    code: "کد",
    papers: "مقاله",
    // Experience
    experience: "تجربیات",
    experience_subtitle: "نقش‌های پژوهشی و صنعتی",
    present: "اکنون",
    no_experience: "تجربه‌ای اضافه نشده.",
    // Teaching
    teaching_exp: "تجربه‌ی تدریس",
    students_advised: "دانشجویان تحت راهنمایی",
    students_subtitle: "راهنمایی نسل بعدی پژوهشگران",
    teachings: "تدریس",
    universities: "دانشگاه",
    students_stat: "دانشجوی مشاوره‌شده",
    active: "فعال",
    alumni: "فارغ‌التحصیل",
    courses: "دوره",
    no_teaching: "تجربه‌ی تدریسی اضافه نشده.",
    // Awards / Skills
    awards_honors: "جوایز و افتخارات",
    no_awards: "جایزه‌ای اضافه نشده.",
    technical_skills: "مهارت‌های فنی",
    technologies: "فناوری",
    proficiency: "سطح مهارت:",
    expert: "متخصص",
    proficient: "ماهر",
    familiar: "آشنا",
    // Contact
    contact_title: "تماس با من",
    contact_default: "آماده‌ی همکاری در پژوهش و پروژه‌های صنعتی",
    email_label: "ایمیل",
    office_label: "دفتر",
    dept_label: "دپارتمان",
    connect_label: "شبکه‌های اجتماعی",
    no_links: "لینکی اضافه نشده.",
    // Misc
    loading: "در حال بارگذاری",
    no_items: "هنوز چیزی اضافه نشده.",
    view_site: "مشاهده سایت",
    all_rights: "تمامی حقوق محفوظ است.",
    // Resume view + new sections
    nav_resume: "رزومه",
    projects: "پروژه‌ها",
    certifications: "گواهینامه‌ها",
    languages: "زبان‌ها",
    summary: "خلاصه",
    share_link: "کپی لینک",
    link_copied: "لینک کپی شد!",
    print: "چاپ",
    view_project: "مشاهده پروژه",
    verify: "اعتبارسنجی",
    download_cv: "دانلود رزومه",
  },
};

// Admin-panel strings, keyed by the exact English text used in the admin UI and
// schema. This lets the dashboard be fully localised without duplicating labels
// in the schema — we translate at render time via ta(). English returns as-is.
const ADMIN_FA = {
  // Nav / chrome
  "Dashboard": "داشبورد", "Profile & Contact": "پروفایل و تماس", "Customize": "شخصی‌سازی",
  "Content": "محتوا", "Settings": "تنظیمات", "Account": "حساب کاربری",
  "Admin": "پنل مدیریت",
  "View site": "مشاهده سایت", "Log out": "خروج",
  // Section titles
  "Awards": "جوایز", "Certifications": "گواهینامه‌ها", "Education": "تحصیلات",
  "Experience": "تجربیات", "Languages": "زبان‌ها", "News": "اخبار", "Projects": "پروژه‌ها",
  "Publications": "مقالات", "Skills": "مهارت‌ها", "Students": "دانشجویان", "Teaching": "تدریس",
  // Field labels
  "About me": "درباره‌ی من", "Address": "آدرس", "Authors": "نویسندگان", "CV / Resume": "رزومه (CV)",
  "Category": "دسته‌بندی", "Citations": "استنادها", "Code URL": "لینک کد", "Company": "شرکت",
  "Contact note": "یادداشت تماس", "Course": "درس", "Courses count": "تعداد دروس", "Courses": "دروس",
  "Credential ID": "شناسه‌ی گواهی", "Current?": "فعلی؟", "DOI URL": "لینک DOI", "Date": "تاریخ",
  "Degree": "مدرک", "Department": "دپارتمان", "Description": "توضیحات", "Downloads": "دانلودها",
  "Duration": "مدت", "Email": "ایمیل", "Emails (contact page)": "ایمیل‌ها (صفحه‌ی تماس)",
  "End": "پایان", "Field": "رشته", "Full name": "نام کامل", "Highlights": "نکات برجسته",
  "Icon": "آیکون", "Institution": "مؤسسه / دانشگاه", "Issuer": "صادرکننده", "Label": "برچسب",
  "Language": "زبان", "Level": "سطح", "Link (live / repo)": "لینک (دمو / مخزن)", "Location": "مکان",
  "Logo": "لوگو", "Map URL": "لینک نقشه", "Name": "نام", "Number": "شماره", "Office": "دفتر",
  "Ongoing?": "در حال انجام؟", "PDF": "PDF", "Period": "بازه‌ی زمانی", "Primary email": "ایمیل اصلی",
  "Profile photo": "عکس پروفایل", "Research interests": "علایق پژوهشی", "Role / title": "نقش / عنوان",
  "Role": "نقش", "Room": "اتاق", "Slides": "اسلایدها", "Social links": "شبکه‌های اجتماعی",
  "Start": "شروع", "Status": "وضعیت", "Submitted to (if under review)": "ارسال‌شده به (در صورت بررسی)",
  "Supervisor": "استاد راهنما", "Tags": "برچسب‌ها", "Tech / keywords": "فناوری / کلیدواژه‌ها",
  "Text": "متن", "Thesis": "پایان‌نامه", "Times": "دفعات", "Title": "عنوان", "Topic": "موضوع",
  "Type": "نوع", "URL": "لینک", "University": "دانشگاه", "Venue": "محل انتشار",
  "Verify URL": "لینک اعتبارسنجی", "Year": "سال", "Years": "سال‌ها", "Your role": "نقش شما",
  "Each highlight is a short achievement line.": "هر نکته یک خط کوتاه از دستاوردهاست.",
  // CRUD manager
  "Add new": "افزودن مورد", "items": "مورد", "item": "مورد", "Edit": "ویرایش", "New": "جدید",
  "Save": "ذخیره", "Saved": "ذخیره شد", "Cancel": "انصراف", "Delete this item?": "این مورد حذف شود؟",
  "Save failed": "ذخیره ناموفق بود", 'Nothing yet. Click "Add new".': "هنوز چیزی نیست. روی «افزودن مورد» بزنید.",
  // Profile editor
  "Save changes": "ذخیره‌ی تغییرات",
  // Account
  "Signed in as": "واردشده به‌عنوان", "Change password": "تغییر رمز عبور",
  "Current password": "رمز فعلی", "New password": "رمز جدید", "Confirm new password": "تکرار رمز جدید",
  "Update password": "به‌روزرسانی رمز",
  "New password must be at least 6 characters.": "رمز جدید باید حداقل ۶ کاراکتر باشد.",
  "New passwords do not match.": "رمزهای جدید مطابقت ندارند.",
  "Password updated successfully.": "رمز با موفقیت به‌روزرسانی شد.",
  "Could not update password.": "به‌روزرسانی رمز ناموفق بود.",
  // Components (forms)
  "Upload": "بارگذاری", "Replace": "جایگزینی", "or paste a URL": "یا یک لینک بچسبانید",
  "Type and press Add": "بنویسید و «افزودن» بزنید", "Add": "افزودن", "Add row": "افزودن ردیف",
  "Upload failed": "بارگذاری ناموفق بود", "Yes": "بله", "No": "خیر",
  // Dashboard
  "Papers": "مقالات", "Published": "منتشرشده", "Sections": "بخش‌ها",
  "Profile readiness": "آمادگی پروفایل", "Recruiter-facing completeness score": "امتیاز تکمیل برای نگاه استخدام‌کننده",
  "Recruiter preview": "پیش‌نمایش استخدام‌کننده", "Export content": "خروجی محتوا", "Import content": "ورود محتوا",
  "Summary": "خلاصه", "Resume/CV": "رزومه/CV", "Photo or generated logo": "عکس یا لوگوی تولیدی",
  "Add a concise summary to make the first 30 seconds stronger.": "یک خلاصه کوتاه اضافه کنید تا ۳۰ ثانیه اول قوی‌تر شود.",
  "Manage every section of your portfolio from here.": "همه‌ی بخش‌های سایت را از اینجا مدیریت کنید.",
  // Customize
  "Branding, theme, and which sections appear — preview updates live.":
    "برندینگ، تم و بخش‌های نمایش‌داده‌شده — پیش‌نمایش زنده به‌روز می‌شود.",
  "Branding": "برندینگ", "Brand name": "نام برند", "Tagline": "شعار",
  "Generated logo": "لوگوی تولیدی", "Logo seed": "بذر لوگو", "Randomize": "تولید تصادفی",
  "Logo style": "سبک لوگو", "Logo complexity": "پیچیدگی لوگو", "Nodes": "نقطه‌ها",
  "Cloud": "ابری", "Constellation": "صورت فلکی", "Prism": "منشوری", "Orbit": "مداری",
  "(optional — defaults to your profile name)": "(اختیاری — پیش‌فرض نام پروفایل)",
  "Accent palette": "پالت رنگ", "Custom accent": "رنگ دلخواه", "Clear custom": "حذف رنگ دلخواه",
  "Typography & feel": "تایپوگرافی و حال‌وهوا", "Font pairing": "جفت فونت", "Density": "تراکم",
  "comfortable": "راحت", "compact": "فشرده", "Default language": "زبان پیش‌فرض",
  "Shown": "نمایش", "Hidden": "پنهان", "Animated background": "پس‌زمینه‌ی متحرک",
  "On": "روشن", "Off": "خاموش", "Visible": "قابل‌نمایش",
  "Toggle sections on/off and drag the order with the arrows. The public resume shows enabled sections in this order.":
    "بخش‌ها را روشن/خاموش و با فلش‌ها جابه‌جا کنید. رزومه‌ی عمومی بخش‌های فعال را به همین ترتیب نشان می‌دهد.",
  "Summary / About": "خلاصه / درباره", "Work Experience": "تجربه‌ی کاری",
  "Publications (academic)": "مقالات (آکادمیک)", "Teaching (academic)": "تدریس (آکادمیک)",
  "Research Interests (academic)": "علایق پژوهشی (آکادمیک)", "News / Updates": "اخبار / به‌روزرسانی‌ها",
  "Contact": "تماس", "English": "انگلیسی",
};

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem("lang") || "en");

  // Update document direction and font when language changes
  useEffect(() => {
    const root = document.documentElement;
    if (lang === "fa") {
      root.setAttribute("dir", "rtl");
      root.setAttribute("lang", "fa");
      root.classList.add("rtl");
    } else {
      root.setAttribute("dir", "ltr");
      root.setAttribute("lang", "en");
      root.classList.remove("rtl");
    }
  }, [lang]);

  const setLang = useCallback((l) => {
    localStorage.setItem("lang", l);
    setLangState(l);
  }, []);

  /** Translate a UI string key */
  const t = useCallback(
    (key) => TRANS[lang]?.[key] ?? TRANS.en[key] ?? key,
    [lang]
  );

  /** Get localised field from a data item.
   *  loc(news, 'text') → news.text_fa if lang=fa (falling back to news.text), else news.text
   */
  const loc = useCallback(
    (item, field) => {
      if (!item) return "";
      if (lang === "fa") return item[field + "_fa"] || item[field] || "";
      return item[field] || "";
    },
    [lang]
  );

  /** Translate an admin-panel string (keyed by its English text). */
  const ta = useCallback(
    (text) => (lang === "fa" ? (ADMIN_FA[text] ?? text) : text),
    [lang]
  );

  const isRtl = lang === "fa";

  return (
    <LangContext.Provider value={{ lang, setLang, t, ta, loc, isRtl }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
