"""
Optional seed script. Populates the database with a complete sample profile in
BOTH languages (English + Persian) so you can immediately see the site and the
language toggle working, then edit/delete anything from the admin dashboard.

Run from the backend folder:   python seed.py
This is OPTIONAL - by default the site starts empty.

Sample persona: "Ali Zareei" - a data scientist / ML engineer. All data here is
for demonstration only.
"""
from database import SessionLocal, Base, engine
import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()

CONTENT_MODELS = [models.News, models.Education, models.Publication, models.Experience,
                  models.TeachingInstitution, models.Student, models.SkillCategory,
                  models.Award, models.Project, models.Certification, models.Language]


def wipe():
    for m in CONTENT_MODELS:
        db.query(m).delete()
    db.query(models.Profile).delete()
    db.query(models.Settings).delete()
    db.commit()


def set_profile(lang, **kw):
    db.add(models.Profile(lang=lang, **kw))


# ---------------------------------------------------------------------------
# ENGLISH
# ---------------------------------------------------------------------------
def seed_en():
    set_profile(
        "en",
        name="Ali Zareei",
        role="Data Scientist & Machine Learning Engineer",
        institution="Computer Science - Data Science & ML",
        location="Tehran, Iran",
        email="alizrr8@gmail.com",
        photo_url="/uploads/profile-ali.jpg",
        bio=("I'm a data scientist and machine learning engineer who likes turning messy, "
             "real-world data into models and products people can actually rely on. My "
             "background is in computer science, and I work across the full lifecycle - from "
             "framing the problem and cleaning data, to training and evaluating models, to "
             "shipping them behind clean APIs and watching how they behave in production. I'm "
             "especially drawn to NLP and recommendation systems, and I care a lot about "
             "reproducibility and honest evaluation."),
        research_interests=["Machine Learning", "Data Science", "Deep Learning", "NLP",
                            "Recommender Systems", "MLOps", "Computer Vision", "Statistics"],
        contact_note="Open to ML / data science roles, research collaborations, and consulting",
        emails=[
            {"label": "Primary", "value": "alizrr8@gmail.com"},
        ],
        office={"room": "Remote-first", "address": "Tehran, Iran (GMT+3:30)", "map_url": ""},
        department={"name": "Independent / Open to opportunities", "university": "Available worldwide (remote)"},
        socials=[
            {"label": "GitHub", "url": "https://github.com/", "icon": "github"},
            {"label": "LinkedIn", "url": "https://linkedin.com/", "icon": "linkedin"},
            {"label": "Google Scholar", "url": "https://scholar.google.com/", "icon": "scholar"},
            {"label": "Telegram", "url": "https://t.me/Z4r3i", "icon": "telegram"},
            {"label": "Email", "value": "alizrr8@gmail.com", "url": "mailto:alizrr8@gmail.com", "icon": "email"},
        ],
    )

    news = [
        ("Apr 2026", "Released an open-source NLP toolkit for Persian text preprocessing - now used in a few research projects."),
        ("Feb 2026", "Our recommender-system paper was accepted at a regional ML workshop."),
        ("Dec 2025", "Built a churn-prediction model that improved retention campaigns' ROI by 24%."),
        ("Oct 2025", "Started a part-time role mentoring junior data scientists at a local bootcamp."),
        ("Aug 2025", "Completed the DeepLearning.AI MLOps specialization and put it straight to work."),
    ]
    for i, (dte, txt) in enumerate(news):
        db.add(models.News(lang="en", date=dte, text=txt, sort_order=i))

    edu = [
        dict(degree="M.Sc. in Computer Science", institution="University of Tehran",
             field="Artificial Intelligence & Machine Learning", start="2020", end="2022", duration="2 years",
             supervisor="Dr. R. Mohammadi",
             thesis="A deep learning approach to aspect-based sentiment analysis for low-resource languages."),
        dict(degree="B.Sc. in Computer Science", institution="Shahid Beheshti University",
             field="Computer Science", start="2016", end="2020", duration="4 years",
             supervisor="",
             thesis="Comparative study of classical and neural methods for short-text classification."),
    ]
    for i, e in enumerate(edu):
        db.add(models.Education(lang="en", sort_order=i, **e))

    experience = [
        dict(role="Machine Learning Engineer", company="Snapp! (Ride-hailing)", location="Tehran / Remote",
             start="2023", end="", current=True,
             description="Build and deploy ML models for demand forecasting and personalization.",
             bullets=["Developed a demand-forecasting model that reduced driver idle time by 18%.",
                      "Owned the feature store and training pipelines used across three ML teams.",
                      "Set up model monitoring that catches data drift before it hits users."],
             tags=["Python", "PyTorch", "Spark", "Airflow", "MLflow"]),
        dict(role="Data Scientist", company="Digikala (E-commerce)", location="Tehran",
             start="2021", end="2023", current=False,
             description="Worked on recommendation and customer-analytics problems for a large marketplace.",
             bullets=["Built a hybrid recommender that lifted click-through rate by 12%.",
                      "Created a churn-prediction pipeline feeding the retention team's campaigns.",
                      "Ran A/B tests and translated results into product decisions."],
             tags=["Python", "scikit-learn", "SQL", "XGBoost", "Pandas"]),
        dict(role="Data Analyst (Intern -> Junior)", company="Cafe Bazaar", location="Tehran",
             start="2019", end="2021", current=False,
             description="Turned product and behavioral data into dashboards and insights.",
             bullets=["Built self-serve dashboards that cut ad-hoc reporting requests in half.",
                      "Automated weekly cohort analyses with Python and SQL."],
             tags=["SQL", "Python", "Metabase", "Statistics"]),
    ]
    for i, e in enumerate(experience):
        db.add(models.Experience(lang="en", sort_order=i, **e))

    publications = [
        dict(number=2, type="Workshop", year="2026", status="published",
             title="A Hybrid Recommender for Sparse E-commerce Interactions",
             authors="A. Zareei, R. Mohammadi",
             venue="Regional Workshop on Machine Learning & Applications",
             pdf_url="#", code_url="#", citations=3, downloads=140),
        dict(number=1, type="Journal", year="2023", status="published",
             title="Aspect-Based Sentiment Analysis for Low-Resource Languages with Transfer Learning",
             authors="A. Zareei, R. Mohammadi, S. Karimi",
             venue="Journal of AI & Data Mining (sample)",
             pdf_url="#", doi_url="#", citations=11, downloads=620),
    ]
    for i, p in enumerate(publications):
        db.add(models.Publication(lang="en", sort_order=i, **p))

    projects = [
        dict(title="ParsNLP", role="Author & Maintainer",
             description="An open-source toolkit for Persian text normalization, tokenization, and embeddings.",
             url="https://github.com/", start="2024", end="", current=True,
             bullets=["800+ GitHub stars; used in several academic and industry projects.",
                      "Includes pretrained embeddings and a simple, well-documented API."],
             tags=["Python", "NLP", "PyTorch", "Open Source"]),
        dict(title="RecoLab", role="Creator",
             description="A reproducible benchmark suite for recommender-system algorithms with one-command experiments.",
             url="https://github.com/", start="2023", end="2024", current=False,
             bullets=["Implements 10+ classic and neural recommenders behind a unified interface.",
                      "Ships with notebooks reproducing every reported number."],
             tags=["Python", "PyTorch", "Pandas", "MLflow"]),
        dict(title="VisionTag", role="Solo project",
             description="A small image auto-tagging service with a fine-tuned vision model and a clean REST API.",
             url="", start="2022", end="2023", current=False,
             bullets=["Fine-tuned a CNN to 92% top-1 accuracy on a custom dataset.",
                      "Served via FastAPI with batched inference."],
             tags=["Python", "TensorFlow", "FastAPI", "Computer Vision"]),
    ]
    for i, p in enumerate(projects):
        db.add(models.Project(lang="en", sort_order=i, **p))

    skills = [
        dict(category="Languages", icon="code", skills=[
            {"name": "Python", "level": "expert"}, {"name": "SQL", "level": "expert"},
            {"name": "R", "level": "proficient"}, {"name": "Scala", "level": "familiar"},
            {"name": "C++", "level": "familiar"}]),
        dict(category="ML & Deep Learning", icon="brain", skills=[
            {"name": "PyTorch", "level": "expert"}, {"name": "scikit-learn", "level": "expert"},
            {"name": "TensorFlow / Keras", "level": "proficient"}, {"name": "XGBoost", "level": "expert"},
            {"name": "Hugging Face", "level": "proficient"}, {"name": "spaCy", "level": "proficient"}]),
        dict(category="Data & Analytics", icon="database", skills=[
            {"name": "Pandas", "level": "expert"}, {"name": "NumPy", "level": "expert"},
            {"name": "Spark", "level": "proficient"}, {"name": "PostgreSQL", "level": "proficient"},
            {"name": "Matplotlib / Seaborn", "level": "expert"}]),
        dict(category="MLOps & Infra", icon="cloud", skills=[
            {"name": "MLflow", "level": "proficient"}, {"name": "Airflow", "level": "proficient"},
            {"name": "Docker", "level": "proficient"}, {"name": "FastAPI", "level": "expert"},
            {"name": "AWS", "level": "familiar"}]),
        dict(category="Foundations", icon="cpu", skills=[
            {"name": "Statistics", "level": "expert"}, {"name": "A/B Testing", "level": "proficient"},
            {"name": "Linear Algebra", "level": "expert"}, {"name": "Algorithms", "level": "proficient"}]),
    ]
    for i, s in enumerate(skills):
        db.add(models.SkillCategory(lang="en", sort_order=i, **s))

    certs = [
        dict(name="Machine Learning Specialization", issuer="DeepLearning.AI / Coursera",
             year="2022", credential_id="DLAI-ML-2022", url="https://coursera.org/verify"),
        dict(name="MLOps Specialization", issuer="DeepLearning.AI / Coursera",
             year="2025", credential_id="DLAI-MLOPS-2025", url="https://coursera.org/verify"),
        dict(name="TensorFlow Developer Certificate", issuer="Google",
             year="2023", credential_id="TF-DEV-2023", url="https://tensorflow.org/certificate"),
    ]
    for i, c in enumerate(certs):
        db.add(models.Certification(lang="en", sort_order=i, **c))

    langs = [
        dict(name="Persian", level="Native"),
        dict(name="English", level="Fluent"),
        dict(name="Arabic", level="Basic"),
    ]
    for i, l in enumerate(langs):
        db.add(models.Language(lang="en", sort_order=i, **l))

    awards = [
        dict(title="Best Workshop Paper (Honorable Mention)", issuer="Regional ML Workshop", year="2026",
             description="Recognized for the hybrid recommender-system work on sparse interactions."),
        dict(title="1st Place - University Data Science Hackathon", issuer="University of Tehran", year="2021",
             description="Built a winning demand-forecasting solution in 48 hours."),
    ]
    for i, a in enumerate(awards):
        db.add(models.Award(lang="en", sort_order=i, **a))


# ---------------------------------------------------------------------------
# PERSIAN
# ---------------------------------------------------------------------------
def seed_fa():
    set_profile(
        "fa",
        name="علی زارعی",
        role="دانشمند داده و مهندس یادگیری ماشین",
        institution="علوم کامپیوتر - علوم داده و یادگیری ماشین",
        location="تهران، ایران",
        email="alizrr8@gmail.com",
        photo_url="/uploads/profile-ali.jpg",
        bio=("من یک دانشمند داده و مهندس یادگیری ماشین هستم و دوست دارم داده‌های آشفته و واقعی را "
             "به مدل‌ها و محصولاتی تبدیل کنم که آدم‌ها واقعاً بتوانند به آن‌ها تکیه کنند. پیشینه‌ام "
             "علوم کامپیوتر است و در تمام چرخه‌ی کار حضور دارم — از تعریف مسئله و پاک‌سازی داده، تا "
             "آموزش و ارزیابی مدل، تا انتشار آن پشت APIهای تمیز و پایش رفتارش در محیط تولید. "
             "به‌طور ویژه به پردازش زبان طبیعی و سیستم‌های توصیه‌گر علاقه دارم و برایم بازتولیدپذیری "
             "و ارزیابی صادقانه اهمیت زیادی دارد."),
        research_interests=["یادگیری ماشین", "علوم داده", "یادگیری عمیق", "پردازش زبان طبیعی",
                            "سیستم‌های توصیه‌گر", "MLOps", "بینایی ماشین", "آمار"],
        contact_note="آماده‌ی همکاری در نقش‌های یادگیری ماشین و علوم داده، پژوهش و مشاوره",
        emails=[
            {"label": "اصلی", "value": "alizrr8@gmail.com"},
        ],
        office={"room": "دورکاری", "address": "تهران، ایران (GMT+3:30)", "map_url": ""},
        department={"name": "مستقل / آماده‌ی همکاری", "university": "در دسترس برای همکاری جهانی (دورکار)"},
        socials=[
            {"label": "گیت‌هاب", "url": "https://github.com/", "icon": "github"},
            {"label": "لینکدین", "url": "https://linkedin.com/", "icon": "linkedin"},
            {"label": "گوگل اسکولار", "url": "https://scholar.google.com/", "icon": "scholar"},
            {"label": "تلگرام", "url": "https://t.me/Z4r3i", "icon": "telegram"},
            {"label": "ایمیل", "value": "alizrr8@gmail.com", "url": "mailto:alizrr8@gmail.com", "icon": "email"},
        ],
    )

    news = [
        ("فروردین ۱۴۰۵", "یک جعبه‌ابزار متن‌باز برای پیش‌پردازش متن فارسی منتشر کردم — اکنون در چند پروژه‌ی پژوهشی استفاده می‌شود."),
        ("بهمن ۱۴۰۴", "مقاله‌ی ما درباره‌ی سیستم توصیه‌گر در یک کارگاه منطقه‌ای یادگیری ماشین پذیرفته شد."),
        ("آذر ۱۴۰۴", "یک مدل پیش‌بینی ریزش مشتری ساختم که بازده کمپین‌های نگه‌داشت را ۲۴٪ بهبود داد."),
        ("مهر ۱۴۰۴", "به‌صورت پاره‌وقت منتورینگ دانشمندان داده‌ی جونیور را در یک بوت‌کمپ آغاز کردم."),
        ("مرداد ۱۴۰۴", "تخصص MLOps از DeepLearning.AI را کامل کردم و بلافاصله در کار به‌کارش بردم."),
    ]
    for i, (dte, txt) in enumerate(news):
        db.add(models.News(lang="fa", date=dte, text=txt, sort_order=i))

    edu = [
        dict(degree="کارشناسی ارشد علوم کامپیوتر", institution="دانشگاه تهران",
             field="هوش مصنوعی و یادگیری ماشین", start="۱۳۹۹", end="۱۴۰۱", duration="۲ سال",
             supervisor="دکتر ر. محمدی",
             thesis="رویکردی مبتنی بر یادگیری عمیق برای تحلیل احساس جنبه‌محور در زبان‌های کم‌منبع."),
        dict(degree="کارشناسی علوم کامپیوتر", institution="دانشگاه شهید بهشتی",
             field="علوم کامپیوتر", start="۱۳۹۵", end="۱۳۹۹", duration="۴ سال",
             supervisor="",
             thesis="مطالعه‌ی تطبیقی روش‌های کلاسیک و عصبی برای دسته‌بندی متن کوتاه."),
    ]
    for i, e in enumerate(edu):
        db.add(models.Education(lang="fa", sort_order=i, **e))

    experience = [
        dict(role="مهندس یادگیری ماشین", company="اسنپ", location="تهران / دورکار",
             start="۱۴۰۲", end="", current=True,
             description="ساخت و استقرار مدل‌های یادگیری ماشین برای پیش‌بینی تقاضا و شخصی‌سازی.",
             bullets=["توسعه‌ی یک مدل پیش‌بینی تقاضا که زمان بیکاری رانندگان را ۱۸٪ کاهش داد.",
                      "مالکیت feature store و خطوط لوله‌ی آموزش مورد استفاده‌ی سه تیم یادگیری ماشین.",
                      "راه‌اندازی پایش مدل که رانش داده را پیش از رسیدن به کاربر تشخیص می‌دهد."],
             tags=["Python", "PyTorch", "Spark", "Airflow", "MLflow"]),
        dict(role="دانشمند داده", company="دیجی‌کالا", location="تهران",
             start="۱۴۰۰", end="۱۴۰۲", current=False,
             description="کار روی مسائل توصیه‌گری و تحلیل مشتری برای یک بازار بزرگ آنلاین.",
             bullets=["ساخت یک توصیه‌گر ترکیبی که نرخ کلیک را ۱۲٪ افزایش داد.",
                      "ایجاد یک خط لوله‌ی پیش‌بینی ریزش که کمپین‌های تیم نگه‌داشت را تغذیه می‌کرد.",
                      "اجرای تست‌های A/B و تبدیل نتایج به تصمیم‌های محصولی."],
             tags=["Python", "scikit-learn", "SQL", "XGBoost", "Pandas"]),
        dict(role="تحلیل‌گر داده (کارآموز ← جونیور)", company="کافه‌بازار", location="تهران",
             start="۱۳۹۸", end="۱۴۰۰", current=False,
             description="تبدیل داده‌های محصول و رفتاری به داشبورد و بینش.",
             bullets=["ساخت داشبوردهای سلف‌سرویس که درخواست‌های گزارش موردی را نصف کرد.",
                      "خودکارسازی تحلیل‌های هفتگی کوهورت با پایتون و SQL."],
             tags=["SQL", "Python", "Metabase", "آمار"]),
    ]
    for i, e in enumerate(experience):
        db.add(models.Experience(lang="fa", sort_order=i, **e))

    publications = [
        dict(number=2, type="Workshop", year="۱۴۰۵", status="published",
             title="یک توصیه‌گر ترکیبی برای تعاملات پراکنده در تجارت الکترونیک",
             authors="ع. زارعی، ر. محمدی",
             venue="کارگاه منطقه‌ای یادگیری ماشین و کاربردها",
             pdf_url="#", code_url="#", citations=3, downloads=140),
        dict(number=1, type="Journal", year="۱۴۰۲", status="published",
             title="تحلیل احساس جنبه‌محور برای زبان‌های کم‌منبع با یادگیری انتقالی",
             authors="ع. زارعی، ر. محمدی، س. کریمی",
             venue="نشریه‌ی هوش مصنوعی و داده‌کاوی (نمونه)",
             pdf_url="#", doi_url="#", citations=11, downloads=620),
    ]
    for i, p in enumerate(publications):
        db.add(models.Publication(lang="fa", sort_order=i, **p))

    projects = [
        dict(title="ParsNLP", role="نویسنده و نگه‌دارنده",
             description="یک جعبه‌ابزار متن‌باز برای نرمال‌سازی، توکن‌سازی و امبدینگ متن فارسی.",
             url="https://github.com/", start="۱۴۰۳", end="", current=True,
             bullets=["بیش از ۸۰۰ ستاره در گیت‌هاب؛ استفاده در چند پروژه‌ی دانشگاهی و صنعتی.",
                      "شامل امبدینگ‌های ازپیش‌آموزش‌دیده و یک API ساده و مستند."],
             tags=["Python", "NLP", "PyTorch", "متن‌باز"]),
        dict(title="RecoLab", role="سازنده",
             description="یک مجموعه‌ی محک بازتولیدپذیر برای الگوریتم‌های سیستم توصیه‌گر با آزمایش‌های تک‌دستوری.",
             url="https://github.com/", start="۱۴۰۲", end="۱۴۰۳", current=False,
             bullets=["پیاده‌سازی بیش از ۱۰ توصیه‌گر کلاسیک و عصبی پشت یک رابط یکپارچه.",
                      "همراه با نوت‌بوک‌هایی که هر عدد گزارش‌شده را بازتولید می‌کنند."],
             tags=["Python", "PyTorch", "Pandas", "MLflow"]),
        dict(title="VisionTag", role="پروژه‌ی شخصی",
             description="یک سرویس کوچک برچسب‌گذاری خودکار تصویر با مدل بینایی فاین‌تیون‌شده و یک API تمیز.",
             url="", start="۱۴۰۱", end="۱۴۰۲", current=False,
             bullets=["فاین‌تیون یک CNN تا دقت ۹۲٪ در رتبه‌ی اول روی یک دیتاست سفارشی.",
                      "ارائه از طریق FastAPI با استنتاج دسته‌ای."],
             tags=["Python", "TensorFlow", "FastAPI", "بینایی ماشین"]),
    ]
    for i, p in enumerate(projects):
        db.add(models.Project(lang="fa", sort_order=i, **p))

    skills = [
        dict(category="زبان‌ها", icon="code", skills=[
            {"name": "Python", "level": "expert"}, {"name": "SQL", "level": "expert"},
            {"name": "R", "level": "proficient"}, {"name": "Scala", "level": "familiar"},
            {"name": "C++", "level": "familiar"}]),
        dict(category="یادگیری ماشین و عمیق", icon="brain", skills=[
            {"name": "PyTorch", "level": "expert"}, {"name": "scikit-learn", "level": "expert"},
            {"name": "TensorFlow / Keras", "level": "proficient"}, {"name": "XGBoost", "level": "expert"},
            {"name": "Hugging Face", "level": "proficient"}, {"name": "spaCy", "level": "proficient"}]),
        dict(category="داده و تحلیل", icon="database", skills=[
            {"name": "Pandas", "level": "expert"}, {"name": "NumPy", "level": "expert"},
            {"name": "Spark", "level": "proficient"}, {"name": "PostgreSQL", "level": "proficient"},
            {"name": "Matplotlib / Seaborn", "level": "expert"}]),
        dict(category="MLOps و زیرساخت", icon="cloud", skills=[
            {"name": "MLflow", "level": "proficient"}, {"name": "Airflow", "level": "proficient"},
            {"name": "Docker", "level": "proficient"}, {"name": "FastAPI", "level": "expert"},
            {"name": "AWS", "level": "familiar"}]),
        dict(category="مبانی", icon="cpu", skills=[
            {"name": "آمار", "level": "expert"}, {"name": "تست A/B", "level": "proficient"},
            {"name": "جبر خطی", "level": "expert"}, {"name": "الگوریتم‌ها", "level": "proficient"}]),
    ]
    for i, s in enumerate(skills):
        db.add(models.SkillCategory(lang="fa", sort_order=i, **s))

    certs = [
        dict(name="تخصص یادگیری ماشین", issuer="DeepLearning.AI / کورسرا",
             year="۱۴۰۱", credential_id="DLAI-ML-2022", url="https://coursera.org/verify"),
        dict(name="تخصص MLOps", issuer="DeepLearning.AI / کورسرا",
             year="۱۴۰۴", credential_id="DLAI-MLOPS-2025", url="https://coursera.org/verify"),
        dict(name="گواهی توسعه‌دهنده‌ی TensorFlow", issuer="گوگل",
             year="۱۴۰۲", credential_id="TF-DEV-2023", url="https://tensorflow.org/certificate"),
    ]
    for i, c in enumerate(certs):
        db.add(models.Certification(lang="fa", sort_order=i, **c))

    langs = [
        dict(name="فارسی", level="زبان مادری"),
        dict(name="انگلیسی", level="مسلط"),
        dict(name="عربی", level="مقدماتی"),
    ]
    for i, l in enumerate(langs):
        db.add(models.Language(lang="fa", sort_order=i, **l))

    awards = [
        dict(title="بهترین مقاله‌ی کارگاه (تقدیر ویژه)", issuer="کارگاه منطقه‌ای یادگیری ماشین", year="۱۴۰۵",
             description="قدردانی به‌خاطر کار روی سیستم توصیه‌گر ترکیبی برای تعاملات پراکنده."),
        dict(title="رتبه‌ی اول — هکاتون علوم داده‌ی دانشگاه", issuer="دانشگاه تهران", year="۱۴۰۰",
             description="ساخت یک راه‌حل برنده‌ی پیش‌بینی تقاضا در ۴۸ ساعت."),
    ]
    for i, a in enumerate(awards):
        db.add(models.Award(lang="fa", sort_order=i, **a))


def seed_settings():
    sections = [
        {"key": "summary", "enabled": True},
        {"key": "experience", "enabled": True},
        {"key": "projects", "enabled": True},
        {"key": "skills", "enabled": True},
        {"key": "publications", "enabled": True},
        {"key": "education", "enabled": True},
        {"key": "certifications", "enabled": True},
        {"key": "languages", "enabled": True},
        {"key": "awards", "enabled": True},
        {"key": "news", "enabled": True},
        {"key": "research_interests", "enabled": True},
        {"key": "teaching", "enabled": False},
        {"key": "contact", "enabled": True},
    ]
    db.add(models.Settings(
        brand_name="Ali Zareei", tagline="Data Scientist & ML Engineer",
        logo_seed="Ali Zareei", logo_style="constellation", logo_complexity=7,
        logo_show_nodes=True,
        accent="violet", accent_custom="#5d67fe", font="modern", template="aurora",
        density="comfortable", show_photo=True, show_fx=True,
        default_lang="en", sections=sections,
    ))


def run():
    wipe()
    seed_en()
    seed_fa()
    seed_settings()
    db.commit()
    print("Seed complete (English + Persian) - persona: Ali Zareei.")


if __name__ == "__main__":
    run()
    db.close()
