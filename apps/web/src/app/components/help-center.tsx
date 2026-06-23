import { BookOpen, FileQuestion, LifeBuoy, Search, UserCheck } from "lucide-react";
import { faqGroups } from "./marketing";

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
  { label: "Quick Start Guide", href: "#quick-start", file: "docs/REDIST_QUICK_START_GUIDE_EN_AR.md" },
  { label: "User Manual", href: "#user-manual", file: "docs/REDIST_USER_MANUAL_EN_AR.md" },
  { label: "Supplier Guide", href: "#supplier-guide", file: "docs/REDIST_SUPPLIER_GUIDE_EN_AR.md" },
  { label: "Recipient Guide", href: "#recipient-guide", file: "docs/REDIST_RECIPIENT_GUIDE_EN_AR.md" },
  { label: "FAQ", href: "#faq", file: "Public FAQ" },
];

export function HelpCenterContent({ internal = false }: { internal?: boolean }) {
  return (
    <section className="help-center">
      <div className="help-search-panel" role="search">
        <Search size={22} aria-hidden />
        <div>
          <span>Searchable guide sections</span>
          <strong>Use browser find to search English or Arabic terms.</strong>
          <p>Try: listing, request, certificate, المورد, الطلبات, الشهادات.</p>
        </div>
      </div>

      <div className="help-document-grid" aria-label="Documentation coverage">
        {manualLinks.map((link) => (
          <a className="help-document-card" href={link.href} key={link.label}>
            <BookOpen size={20} aria-hidden />
            <strong>{link.label}</strong>
            <span>{link.file}</span>
          </a>
        ))}
      </div>

      <div className="help-section-list">
        {helpSections.map((section) => (
          <article className="help-guide-section" id={section.id} key={section.id}>
            <div className="help-guide-copy">
              <span className="mkt-eyebrow">{section.title}</span>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
              <ol>
                {section.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <div className="help-arabic" lang="ar" dir="rtl">
                <h3>{section.arabicTitle}</h3>
                <p>{section.arabicDescription}</p>
                <ol>
                  {section.arabicSteps.map((step) => <li key={step}>{step}</li>)}
                </ol>
              </div>
            </div>
            <figure className="help-screenshot">
              <img src={section.screenshot} alt={`${section.title} screenshot`} />
              <figcaption>{section.title} screenshot</figcaption>
            </figure>
          </article>
        ))}
      </div>

      <section className="help-faq-preview" id="faq">
        <div className="dashboard-card-header">
          <div>
            <span className="mkt-eyebrow">FAQ</span>
            <h2>Common pilot questions</h2>
            <p>Selected questions from the public FAQ, with the full FAQ available as a dedicated page.</p>
          </div>
          <a className="mkt-button mkt-button-secondary" href="/faq">Open FAQ</a>
        </div>
        <div className="mkt-faq-list">
          {faqGroups.slice(0, 3).flatMap((group) => group.items.slice(0, 2)).map(([question, answer]) => (
            <details key={question}>
              <summary>{question}<FileQuestion size={18} aria-hidden /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      {internal ? (
        <section className="help-support-card">
          <LifeBuoy size={24} aria-hidden />
          <div>
            <span className="mkt-eyebrow">Founder support</span>
            <h2>Need help during the pilot?</h2>
            <p>Contact the founder with the page name, organization, request or transfer reference, screenshot, and the next action you expected.</p>
            <ul>
              <li>For access issues, include the email address and organization name.</li>
              <li>For request or transfer issues, include the request reference and current status.</li>
              <li>For certificate questions, include the certificate or transfer reference.</li>
            </ul>
          </div>
          <UserCheck size={24} aria-hidden />
        </section>
      ) : null}
    </section>
  );
}
