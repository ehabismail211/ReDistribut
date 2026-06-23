"use client";

import { useEffect, useState } from "react";
import { BookOpen, FileQuestion, Languages, LifeBuoy, Search, UserCheck } from "lucide-react";
import { faqGroups } from "./marketing";

type Locale = "en" | "ar";

type HelpSection = {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  screenshot: string;
  steps: string[];
  arabicSteps: string[];
};

const helpSections: HelpSection[] = [
  {
    id: "quick-start",
    title: "Quick Start Guide",
    arabicTitle: "دليل البدء السريع",
    description: "Start with the safest first workflow: access, dashboard, first action, and attention queues.",
    arabicDescription: "ابدأ بأكثر مسار آمن: الوصول، لوحة التحكم، أول إجراء، وقوائم ما يحتاج إلى انتباه.",
    screenshot: "/help/workspace-dashboard.png",
    steps: [
      "Open redistribut.com and request access if you do not already have a workspace account.",
      "Start from the Dashboard and choose the correct first action.",
      "Suppliers create listings, recipients discover resources, and admins review queues.",
      "Check Needs Attention before reviewing reports or impact.",
    ],
    arabicSteps: [
      "افتح redistribut.com واطلب الوصول إذا لم يكن لديك حساب مساحة عمل.",
      "ابدأ من لوحة التحكم واختر أول إجراء مناسب.",
      "ينشئ الموردون العروض، ويكتشف المستفيدون الموارد، ويراجع المشرفون القوائم.",
      "راجع ما يحتاج إلى انتباه قبل التقارير أو الأثر.",
    ],
  },
  {
    id: "user-manual",
    title: "User Manual",
    arabicTitle: "دليل المستخدم",
    description: "Understand the full ReDist workflow from public access through certificates and impact evidence.",
    arabicDescription: "افهم مسار ReDist الكامل من الوصول العام إلى الشهادات وإثبات الأثر.",
    screenshot: "/help/public-home.png",
    steps: [
      "Use the public site to understand the pilot model and request access.",
      "Confirm your organization profile after workspace approval.",
      "Follow the daily workflow: Dashboard, Discover, Requests, Transfers, Impact.",
      "Use certificates and impact only after completed, verified workflows.",
    ],
    arabicSteps: [
      "استخدم الموقع العام لفهم نموذج التجربة وطلب الوصول.",
      "تأكد من ملف المؤسسة بعد اعتماد مساحة العمل.",
      "اتبع سير العمل اليومي: لوحة التحكم، الاكتشاف، الطلبات، التحويلات، الأثر.",
      "استخدم الشهادات والأثر فقط بعد اكتمال مسارات موثقة.",
    ],
  },
  {
    id: "supplier-guide",
    title: "Supplier Guide",
    arabicTitle: "دليل المورد",
    description: "For organizations that have surplus resources and need to publish, approve, and hand over safely.",
    arabicDescription: "للمؤسسات التي لديها موارد فائضة وتحتاج إلى النشر والموافقة والتسليم بأمان.",
    screenshot: "/help/workspace-submit-request.png",
    steps: [
      "Create a listing with name, quantity, condition, location, urgency, and handover notes.",
      "Review incoming requests before any resource moves forward.",
      "Accept, decline, or clarify requests based on operational fit.",
      "Complete verification after handover so evidence can be recorded.",
    ],
    arabicSteps: [
      "أنشئ عرضا يتضمن الاسم والكمية والحالة والموقع والأولوية وملاحظات التسليم.",
      "راجع الطلبات الواردة قبل انتقال أي مورد.",
      "وافق أو ارفض أو اطلب توضيحا حسب الملاءمة التشغيلية.",
      "أكمل التحقق بعد التسليم حتى يتم تسجيل الإثبات.",
    ],
  },
  {
    id: "recipient-guide",
    title: "Recipient Guide",
    arabicTitle: "دليل المستفيد",
    description: "For organizations that need resources and want to discover, request, and track handovers.",
    arabicDescription: "للمؤسسات التي تحتاج إلى موارد وتريد الاكتشاف والطلب ومتابعة التسليم.",
    screenshot: "/help/workspace-discover.png",
    steps: [
      "Use Discover to filter resources by category, location, urgency, and availability.",
      "Review quantity, supplier, condition, and pickup readiness before requesting.",
      "Submit a clear request message with the required quantity.",
      "Track supplier response and transfer status through handover and verification.",
    ],
    arabicSteps: [
      "استخدم الاكتشاف لتصفية الموارد حسب الفئة والموقع والأولوية والتوفر.",
      "راجع الكمية والمورد والحالة وجاهزية الاستلام قبل الطلب.",
      "أرسل رسالة طلب واضحة مع الكمية المطلوبة.",
      "تابع رد المورد وحالة التحويل حتى التسليم والتحقق.",
    ],
  },
  {
    id: "requests-transfers",
    title: "Requests and Transfers",
    arabicTitle: "الطلبات والتحويلات",
    description: "Separate what needs your action, what is waiting on others, and what has been completed.",
    arabicDescription: "افصل بين ما يحتاج إلى إجراء منك، وما ينتظر الآخرين، وما اكتمل.",
    screenshot: "/help/workspace-requests.png",
    steps: [
      "Open Requests to review approvals, scheduling, and verification needs.",
      "Use Transfers for accepted handovers and completion confirmation.",
      "Keep completed or closed requests separate from active work.",
      "Use certificate evidence only when the transfer workflow is complete.",
    ],
    arabicSteps: [
      "افتح الطلبات لمراجعة الموافقات والجدولة واحتياجات التحقق.",
      "استخدم التحويلات للتسليمات المقبولة وتأكيد الإكمال.",
      "افصل الطلبات المكتملة أو المغلقة عن العمل النشط.",
      "استخدم إثبات الشهادة فقط عند اكتمال مسار التحويل.",
    ],
  },
  {
    id: "certificates-impact",
    title: "Certificates and Impact",
    arabicTitle: "الشهادات والأثر",
    description: "Review operational evidence, value recovered, redistributed items, and waste diversion carefully.",
    arabicDescription: "راجع الإثبات التشغيلي والقيمة المستردة والعناصر المعاد توزيعها وتحويل الهدر بعناية.",
    screenshot: "/help/workspace-impact.png",
    steps: [
      "Open Certificates to review QR-verifiable transfer evidence where available.",
      "Open Impact after completed transfers to understand value and outcome evidence.",
      "Treat impact values as platform-supported estimates unless independently audited.",
      "Do not use certificates as legal guarantees, tax receipts, or audited ESG certificates.",
    ],
    arabicSteps: [
      "افتح الشهادات لمراجعة إثبات التحويل القابل للتحقق عبر QR حيثما توفر.",
      "افتح الأثر بعد التحويلات المكتملة لفهم القيمة وإثبات النتائج.",
      "تعامل مع قيم الأثر كتقديرات مدعومة من المنصة ما لم يتم تدقيقها بشكل مستقل.",
      "لا تستخدم الشهادات كضمانات قانونية أو إيصالات ضريبية أو شهادات ESG مدققة.",
    ],
  },
];

const manualLinks = [
  { label: "Quick Start Guide", arabicLabel: "دليل البدء السريع", href: "#quick-start", file: "docs/REDIST_QUICK_START_GUIDE_EN_AR.md" },
  { label: "User Manual", arabicLabel: "دليل المستخدم", href: "#user-manual", file: "docs/REDIST_USER_MANUAL_EN_AR.md" },
  { label: "Supplier Guide", arabicLabel: "دليل المورد", href: "#supplier-guide", file: "docs/REDIST_SUPPLIER_GUIDE_EN_AR.md" },
  { label: "Recipient Guide", arabicLabel: "دليل المستفيد", href: "#recipient-guide", file: "docs/REDIST_RECIPIENT_GUIDE_EN_AR.md" },
  { label: "FAQ", arabicLabel: "الأسئلة الشائعة", href: "#faq", file: "Public FAQ" },
];

export function HelpCenterContent({ internal = false }: { internal?: boolean }) {
  const [locale, setLocale] = useState<Locale>("en");
  const isArabic = locale === "ar";

  useEffect(() => {
    const stored = window.localStorage.getItem("redist-language");
    if (stored === "ar" || stored === "en") setLocale(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("redist-language", locale);
    document.body.dataset.locale = locale;
    document.body.dataset.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic, locale]);

  return (
    <section className="help-center" lang={locale} dir={isArabic ? "rtl" : "ltr"}>
      <div className="help-language-panel" aria-label="Help Center language">
        <Languages size={22} aria-hidden />
        <div>
          <span>{isArabic ? "لغة دليل المستخدم" : "User manual language"}</span>
          <strong>{isArabic ? "اعرض التعليمات العربية فقط أو الإنجليزية فقط." : "Show either Arabic guidance or English guidance."}</strong>
        </div>
        <div className="help-language-actions">
          <button className={!isArabic ? "active" : ""} onClick={() => setLocale("en")} type="button">English</button>
          <button className={isArabic ? "active" : ""} onClick={() => setLocale("ar")} type="button">العربية</button>
        </div>
      </div>

      <div className="help-search-panel" role="search">
        <Search size={22} aria-hidden />
        <div>
          <span>{isArabic ? "أقسام الدليل القابلة للبحث" : "Searchable guide sections"}</span>
          <strong>{isArabic ? "استخدم بحث المتصفح للعثور على المصطلحات العربية." : "Use browser find to search English terms."}</strong>
          <p>{isArabic ? "جرّب: المورد، الطلبات، الشهادات، التحويلات." : "Try: listing, request, certificate, transfer."}</p>
        </div>
      </div>

      <div className="help-document-grid" aria-label="Documentation coverage">
        {manualLinks.map((link) => (
          <a className="help-document-card" href={link.href} key={link.label}>
            <BookOpen size={20} aria-hidden />
            <strong>{isArabic ? link.arabicLabel : link.label}</strong>
            <span>{link.file}</span>
          </a>
        ))}
      </div>

      <div className="help-section-list">
        {helpSections.map((section) => (
          <article className="help-guide-section" id={section.id} key={section.id}>
            <div className="help-guide-copy">
              <span className="mkt-eyebrow">{isArabic ? section.arabicTitle : section.title}</span>
              <h2>{isArabic ? section.arabicTitle : section.title}</h2>
              <p>{isArabic ? section.arabicDescription : section.description}</p>
              <ol>
                {(isArabic ? section.arabicSteps : section.steps).map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
            <figure className="help-screenshot">
              <img src={section.screenshot} alt={`${section.title} screenshot`} />
              <figcaption>{isArabic ? `لقطة شاشة: ${section.arabicTitle}` : `${section.title} screenshot`}</figcaption>
            </figure>
          </article>
        ))}
      </div>

      <section className="help-faq-preview" id="faq">
        <div className="dashboard-card-header">
          <div>
            <span className="mkt-eyebrow">{isArabic ? "الأسئلة الشائعة" : "FAQ"}</span>
            <h2>{isArabic ? "أسئلة التجربة الشائعة" : "Common pilot questions"}</h2>
            <p>{isArabic ? "افتح صفحة الأسئلة الشائعة الكاملة للإجابات العربية أو الإنجليزية." : "Selected questions from the public FAQ, with the full FAQ available as a dedicated page."}</p>
          </div>
          <a className="mkt-button mkt-button-secondary" href="/faq">{isArabic ? "فتح الأسئلة الشائعة" : "Open FAQ"}</a>
        </div>
        {isArabic ? (
          <div className="help-faq-language-note">
            <FileQuestion size={18} aria-hidden />
            <p>تتوفر الأسئلة الشائعة الكاملة باللغة العربية عند استخدام زر اللغة في صفحة FAQ.</p>
          </div>
        ) : (
          <div className="mkt-faq-list">
            {faqGroups.slice(0, 3).flatMap((group) => group.items.slice(0, 2)).map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<FileQuestion size={18} aria-hidden /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        )}
      </section>

      {internal ? (
        <section className="help-support-card">
          <LifeBuoy size={24} aria-hidden />
          <div>
            <span className="mkt-eyebrow">{isArabic ? "دعم المؤسس" : "Founder support"}</span>
            <h2>{isArabic ? "هل تحتاج إلى مساعدة أثناء التجربة؟" : "Need help during the pilot?"}</h2>
            <p>{isArabic ? "تواصل مع المؤسس واذكر اسم الصفحة والمؤسسة ومرجع الطلب أو التحويل ولقطة الشاشة والإجراء المتوقع." : "Contact the founder with the page name, organization, request or transfer reference, screenshot, and the next action you expected."}</p>
            <ul>
              {(isArabic ? [
                "لمشكلات الوصول، أرفق البريد الإلكتروني واسم المؤسسة.",
                "لمشكلات الطلب أو التحويل، أرفق مرجع الطلب والحالة الحالية.",
                "لأسئلة الشهادة، أرفق مرجع الشهادة أو التحويل.",
              ] : [
                "For access issues, include the email address and organization name.",
                "For request or transfer issues, include the request reference and current status.",
                "For certificate questions, include the certificate or transfer reference.",
              ]).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <UserCheck size={24} aria-hidden />
        </section>
      ) : null}
    </section>
  );
}
