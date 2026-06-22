"use client";

import { createContext, useContext, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  Archive,
  Award,
  BarChart3,
  Bell,
  Bookmark,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Flag,
  Globe2,
  Handshake,
  History,
  LayoutDashboard,
  LogIn,
  MapPin,
  MessageSquare,
  PackagePlus,
  QrCode,
  Search,
  Send,
  Settings,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { calculateImpactMetrics, type ImpactBreakdown, type ImpactMetrics } from "@/lib/impact";
import {
  createLocalTransferCertificate,
  verificationUrl,
  type TransferCertificateRecord,
} from "@/lib/transfer-certificate";

type Locale = "en" | "ar";

type LocalizationContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  t: (value: string) => string;
  n: (value: number) => string;
  money: (value: number) => string;
  date: (value: string) => string;
};

const languageStorageKey = "redist-language";

const arabicTranslations: Record<string, string> = {
  "Dashboard": "لوحة التحكم",
  "Discover": "الاكتشاف",
  "Requests": "الطلبات",
  "Transfers": "التحويلات",
  "Impact": "الأثر",
  "Daily workflow": "سير العمل اليومي",
  "Action center for supplier, recipient, and admin work.": "مركز إجراءات لعمل المورد والمستفيد والمشرف.",
  "Find available resources, submit requests, and close handovers.": "ابحث عن الموارد المتاحة وأرسل الطلبات وأغلق التسليمات.",
  "Supplier tools": "أدوات المورد",
  "For teams with surplus inventory to publish and manage.": "للفرق التي لديها فائض مخزون للنشر والإدارة.",
  "Recipient tools": "أدوات المستفيد",
  "Saved searches, request messages, and alerts.": "عمليات البحث المحفوظة ورسائل الطلبات والتنبيهات.",
  "Operations admin": "إدارة العمليات",
  "Verification, platform controls, proof, and reporting.": "التحقق وضوابط المنصة والإثبات والتقارير.",
  "Workspace settings": "إعدادات مساحة العمل",
  "Company access, organization profile, and local preferences.": "وصول المؤسسة وملفها والتفضيلات المحلية.",
  "Listings": "العروض",
  "Organizations": "المؤسسات",
  "Administration": "الإدارة",
  "Pilot monitoring": "مراقبة التجربة",
  "Request messages": "رسائل الطلبات",
  "Resource groups": "مجموعات الموارد",
  "Alerts": "التنبيهات",
  "Verification": "التحقق",
  "Certificates": "الشهادات",
  "Documents": "المستندات",
  "Organization": "المؤسسة",
  "Messages": "الرسائل",
  "Notifications": "الإشعارات",
  "Account": "الحساب",
  "Categories": "الفئات",
  "Groups": "المجموعات",
  "Verification review": "مراجعة التحقق",
  "Trust overview": "نظرة الثقة",
  "Platform impact": "أثر المنصة",
  "Moderation": "الإشراف",
  "Settings": "الإعدادات",
  "Sign in required": "تسجيل الدخول مطلوب",
  "Reset local preview": "إعادة ضبط المعاينة",
  "Language": "اللغة",
  "English": "English",
  "العربية": "العربية",
  "UAE pilot dashboard": "لوحة تجربة الإمارات",
  "Operational command center for inventory movement, trust readiness, and completed redistribution impact in {city}.": "مركز تحكم تشغيلي لحركة المخزون وجاهزية الثقة وأثر إعادة التوزيع المكتمل في {city}.",
  "Dubai pilot": "تجربة دبي",
  "Recovered value": "القيمة المستردة",
  "Estimated value from completed handovers": "قيمة تقديرية من عمليات التسليم المكتملة",
  "Impact KPI": "مؤشر أثر",
  "Inventory moved": "المخزون المنقول",
  "Units completed through requests": "وحدات مكتملة عبر الطلبات",
  "active listings": "عروض نشطة",
  "Waste avoided": "النفايات المتجنبة",
  "Estimated from completed activity": "تقدير من النشاط المكتمل",
  "completed flows": "مسارات مكتملة",
  "Completed transactions": "عمليات التحويل المكتملة",
  "Closed request and handover flows": "طلبات وتسليمات مغلقة",
  "open requests": "طلبات مفتوحة",
  "Active listings": "العروض النشطة",
  "Published inventory currently available or reserved.": "مخزون منشور متاح أو محجوز حاليا.",
  "Listing": "العرض",
  "Quantity": "الكمية",
  "No active listings yet.": "لا توجد عروض نشطة بعد.",
  "Open requests": "الطلبات المفتوحة",
  "Requests waiting for owner action or handover completion.": "طلبات بانتظار إجراء المالك أو إكمال التسليم.",
  "Request": "الطلب",
  "No requests yet. New requests will appear here.": "لا توجد طلبات بعد. ستظهر الطلبات الجديدة هنا.",
  "Trust score": "درجة الثقة",
  "Operational reputation score from verification, reliability, and audit behavior.": "درجة سمعة تشغيلية مبنية على التحقق والموثوقية وسلوك التدقيق.",
  "Verification status:": "حالة التحقق:",
  "Open reports:": "بلاغات مفتوحة:",
  "Saved items:": "عناصر محفوظة:",
  "Organization setup": "إعداد المؤسسة",
  "Pilot profile used by the workspace workflow.": "ملف تجربة مستخدم في مسار العمل.",
  "Save organization": "حفظ المؤسسة",
  "Notifications preview": "معاينة الإشعارات",
  "Recent workflow alerts and organization updates.": "تنبيهات سير العمل وتحديثات المؤسسة الأخيرة.",
  "Recent activity": "النشاط الأخير",
  "Latest controlled workflow events from the audit trail.": "أحدث أحداث سير العمل من سجل التدقيق.",
  "Discover inventory": "اكتشاف المخزون",
  "Find verified surplus by category, location, urgency, and offer type.": "ابحث عن الفائض الموثق حسب الفئة والموقع والأولوية ونوع العرض.",
  "Search inventory": "بحث في المخزون",
  "Meals, boxes, furniture...": "وجبات، صناديق، أثاث...",
  "Sort by": "ترتيب حسب",
  "Most relevant": "الأكثر صلة",
  "Highest quantity": "أعلى كمية",
  "Expiry urgency": "أولوية الانتهاء",
  "Nearest location": "أقرب موقع",
  "Save search": "حفظ البحث",
  "Filters": "الفلاتر",
  "Refine UAE pilot listings without changing the workflow.": "تنقية عروض تجربة الإمارات دون تغيير سير العمل.",
  "Subcategory": "الفئة الفرعية",
  "Offer type": "نوع العرض",
  "Saved search placeholder": "موضع حفظ البحث",
  "Saved filters will later trigger notification matches.": "ستفعل الفلاتر المحفوظة إشعارات المطابقة لاحقا.",
  "Available listings": "العروض المتاحة",
  "No published listings match this filter.": "لا توجد عروض منشورة تطابق هذا الفلتر.",
  "Quantity required": "الكمية المطلوبة",
  "Message to owner": "رسالة إلى المالك",
  "Send request": "إرسال الطلب",
  "Saved": "محفوظ",
  "Save item": "حفظ العنصر",
  "Report": "إبلاغ",
  "available": "متاح",
  "Impact dashboard": "لوحة الأثر",
  "Enterprise circularity reporting for recovered value, resource movement, waste prevention, and trust readiness in {city}.": "تقارير مؤسسية للاقتصاد الدائري حول القيمة المستردة وحركة الموارد ومنع الهدر وجاهزية الثقة في {city}.",
  "AED recovered": "القيمة المستردة بالدرهم",
  "Estimated value retained through completed handovers.": "قيمة تقديرية محتفظ بها عبر التسليمات المكتملة.",
  "Resources redistributed": "الموارد المعاد توزيعها",
  "Total units completed through controlled transactions.": "إجمالي الوحدات المكتملة عبر عمليات مضبوطة.",
  "Waste prevented": "النفايات المتجنبة",
  "Estimated material diverted from disposal.": "مواد تقديرية تم تجنب التخلص منها.",
  "CO2 saved": "الانبعاثات المتجنبة",
  "Estimated emissions avoided from reuse and redistribution.": "انبعاثات تقديرية تم تجنبها عبر إعادة الاستخدام والتوزيع.",
  "Closed request, handover, and completion workflows.": "مسارات الطلب والتسليم والإكمال المغلقة.",
  "operating reputation for this organization.": "سمعة تشغيلية لهذه المؤسسة.",
  "Monthly impact summary": "ملخص الأثر الشهري",
  "Recovered value and waste prevention trend for the current pilot period.": "اتجاه القيمة المستردة ومنع الهدر للفترة التجريبية الحالية.",
  "Top categories": "أعلى الفئات",
  "Category contribution ranked by redistributed resources.": "مساهمة الفئات مرتبة حسب الموارد المعاد توزيعها.",
  "Top locations": "أعلى المواقع",
  "Location contribution ranked by redistributed resources.": "مساهمة المواقع مرتبة حسب الموارد المعاد توزيعها.",
  "UAE pilot impact command center": "مركز قيادة أثر تجربة الإمارات",
  "Platform-level reporting for top organizations, categories, sectors, cities, and growth trends across validated Sprint 4 simulation flows.": "تقارير على مستوى المنصة لأعلى المؤسسات والفئات والقطاعات والمدن واتجاهات النمو عبر مسارات محاكاة Sprint 4 المعتمدة.",
  "UAE launch scope": "نطاق إطلاق الإمارات",
  "Simulation verified": "تم التحقق بالمحاكاة",
  "Platform AED recovered": "القيمة المستردة على المنصة",
  "Total simulated recovered value across UAE pilot scenarios.": "إجمالي القيمة المستردة المحاكاة عبر سيناريوهات تجربة الإمارات.",
  "Total completed units across platform scenarios.": "إجمالي الوحدات المكتملة عبر سيناريوهات المنصة.",
  "Estimated platform waste diversion.": "تقدير النفايات المتجنبة على مستوى المنصة.",
  "Completed transaction lifecycle count.": "عدد دورات التحويل المكتملة.",
  "Top sectors": "أعلى القطاعات",
  "Sector contribution from restaurant, hotel, warehouse, and NGO simulations.": "مساهمة القطاعات من محاكاة المطاعم والفنادق والمستودعات والجهات غير الربحية.",
  "Top organizations": "أعلى المؤسسات",
  "Pilot leaderboard generated from validated impact scenarios.": "ترتيب تجريبي صادر من سيناريوهات أثر معتمدة.",
  "Transfer certificates": "شهادات التحويل",
  "QR-verifiable proof generated from completed redistribution transactions.": "إثبات قابل للتحقق عبر QR صادر من عمليات إعادة التوزيع المكتملة.",
  "Certificates appear here after completed handovers.": "تظهر الشهادات هنا بعد اكتمال التسليم.",
  "Trust and verification": "الثقة والتحقق",
  "Current level": "المستوى الحالي",
  "Organization capability tier for controlled workflows.": "مستوى قدرة المؤسسة للمسارات المضبوطة.",
  "Status": "الحالة",
  "Pending reviews": "مراجعات معلقة",
  "Documents or profile changes waiting for reviewer action.": "مستندات أو تغييرات ملف بانتظار إجراء المراجع.",
  "Expiring documents": "مستندات قاربت الانتهاء",
  "Expired or urgent renewal records requiring follow-up.": "سجلات منتهية أو عاجلة التجديد تتطلب متابعة.",
  "Verification history": "سجل التحقق",
  "Audit events relevant to submission, review, rejection, and expiry.": "أحداث التدقيق المتعلقة بالتقديم والمراجعة والرفض والانتهاء.",
  "Submit review": "إرسال للمراجعة",
  "Verification documents": "مستندات التحقق",
  "Required document states for UAE-first organization verification.": "حالات المستندات المطلوبة للتحقق من المؤسسات في الإمارات.",
  "Transfer Certificate": "شهادة التحويل",
  "proof center": "مركز الإثبات",
  "Auditable, QR-verifiable proof for completed redistribution transactions.": "إثبات قابل للتدقيق والتحقق عبر QR لعمليات إعادة التوزيع المكتملة.",
  "issued": "صادرة",
  "Certificate viewer": "عارض الشهادة",
  "Professional certificate layout ready for PDF print/download.": "تخطيط شهادة مهني جاهز للطباعة والتنزيل بصيغة PDF.",
  "Certificate list": "قائمة الشهادات",
  "Latest completed transfer certificates.": "أحدث شهادات التحويل المكتملة.",
  "Certificate history": "سجل الشهادة",
  "Append-only certificate events for audit review.": "أحداث شهادة ملحقة فقط لمراجعة التدقيق.",
  "Complete a request handover to generate the first transfer certificate.": "أكمل تسليم طلب لإنشاء أول شهادة تحويل.",
  "Certificate valid": "الشهادة صالحة",
  "Download PDF": "تنزيل PDF",
  "Verify": "تحقق",
  "Verify QR": "تحقق QR",
  "ReDist Transfer Certificate": "شهادة تحويل ReDist",
  "Issued": "أصدرت في",
  "Transfer completed": "اكتمل التحويل في",
  "Sender": "المرسل",
  "Receiver": "المستلم",
  "Item summary": "ملخص المورد",
  "Handover": "التسليم",
  "Trust snapshot:": "لقطة الثقة:",
  "Verification:": "التحقق:",
  "Hash:": "البصمة:",
  "This certificate confirms that the referenced ReDist transfer workflow was completed on the platform. It is not a tax invoice, payment receipt, customs declaration, or legal title document.": "تؤكد هذه الشهادة اكتمال مسار تحويل ReDist المشار إليه على المنصة. ليست فاتورة ضريبية أو إيصال دفع أو بيان جمركي أو مستند ملكية قانوني.",
  "Company access": "وصول المؤسسة",
  "Company verification profile": "ملف تحقق المؤسسة",
  "Language preference": "تفضيل اللغة",
  "Interface language is saved locally for this pilot workspace.": "يتم حفظ لغة الواجهة محليا لمساحة العمل التجريبية.",
  "Arabic & RTL": "العربية واتجاه اليمين إلى اليسار",
  "Draft": "مسودة",
  "Pending review": "قيد المراجعة",
  "Verified": "موثق",
  "Needs changes": "يتطلب تعديلات",
  "Unverified": "غير موثق",
  "Basic Verified": "موثق أساسي",
  "Business Verified": "موثق تجاري",
  "Enterprise Verified": "موثق مؤسسي",
  "NGO Verified": "موثق كجهة غير ربحية",
  "Government Verified": "موثق حكومي",
  "Bronze": "برونزي",
  "Silver": "فضي",
  "Gold": "ذهبي",
  "Platinum": "بلاتيني",
  "Trust": "ثقة",
  "Score range: Bronze 0-49, Silver 50-69, Gold 70-84, Platinum 85-100.": "نطاق الدرجة: برونزي 0-49، فضي 50-69، ذهبي 70-84، بلاتيني 85-100.",
  "Why this score was earned": "سبب الحصول على هذه الدرجة",
  "Transparent contribution from verification, workflow reliability, audit events, and document state.": "مساهمة واضحة من التحقق وموثوقية سير العمل وأحداث التدقيق وحالة المستندات.",
  "Metadata placeholder until upload flow is added.": "بيانات وصفية مؤقتة إلى حين إضافة مسار الرفع.",
  "Required": "مطلوب",
  "Expires": "ينتهي في",
  "Required for UAE verification policy": "مطلوب لسياسة التحقق في الإمارات",
  "Calculation snapshot": "لقطة الحساب",
  "Current production metric set supported by the Sprint 4 impact engine.": "مجموعة مؤشرات إنتاجية حالية مدعومة بمحرك أثر Sprint 4.",
  "Impact breakdown appears after completed transactions.": "يظهر تفصيل الأثر بعد اكتمال عمليات التحويل.",
  "Estimated CO2 Saved": "الانبعاثات المقدرة المتجنبة",
  "matching listings": "عروض مطابقة",
  "matching listing": "عرض مطابق",
  "published": "منشور",
  "reserved": "محجوز",
  "completed": "مكتمل",
  "pending": "معلق",
  "accepted": "مقبول",
  "declined": "مرفوض",
  "cancelled": "ملغي",
  "Free": "مجاني",
  "For sale": "للبيع",
  "Exchange": "تبادل",
  "All": "الكل",
  "Pickup": "استلام",
  "Delivery by owner": "توصيل من المالك",
  "Requester delivery": "توصيل من الطالب",
  "Courier coordination": "تنسيق شحن",
  "Food and beverage": "الأغذية والمشروبات",
  "Packaging and containers": "التغليف والحاويات",
  "Packaging materials": "مواد التغليف",
  "Furniture and fixtures": "الأثاث والتجهيزات",
  "Furniture & Fixtures": "الأثاث والتجهيزات",
  "Warehouse Materials": "مواد المستودعات",
  "Food & Beverage": "الأغذية والمشروبات",
  "Community supplies": "مستلزمات مجتمعية",
  "Community Supplies": "مستلزمات مجتمعية",
  "Office supplies": "مستلزمات مكتبية",
  "Dubai": "دبي",
  "Abu Dhabi": "أبوظبي",
  "Sharjah": "الشارقة",
  "Jebel Ali": "جبل علي",
  "Dubai Marina": "دبي مارينا",
  "Industrial Area": "المنطقة الصناعية",
  "Mussafah": "مصفح",
  "Dashboard action center": "مركز إجراءات لوحة التحكم",
  "What should move today?": "ما الذي يجب تحريكه اليوم؟",
  "Start with surplus listings, resource requests, handovers, and review queues.": "ابدأ بعروض الفائض وطلبات الموارد والتسليمات وقوائم المراجعة.",
  "Dashboard status summary": "ملخص حالة لوحة التحكم",
  "Action center": "مركز الإجراءات",
  "Supplier": "المورد",
  "Recipient": "المستفيد",
  "Workflow": "سير العمل",
  "Operations": "العمليات",
  "Create a listing": "إنشاء عرض",
  "Discover resources": "اكتشاف الموارد",
  "Review requests": "مراجعة الطلبات",
  "View transfers": "عرض التحويلات",
  "Publish surplus inventory for controlled redistribution.": "انشر المخزون الفائض لإعادة توزيع مضبوطة.",
  "Find available stock by category, location, and urgency.": "اعثر على المخزون المتاح حسب الفئة والموقع والأولوية.",
  "Respond to requests and move accepted items forward.": "استجب للطلبات وحرّك العناصر المقبولة إلى المرحلة التالية.",
  "Track accepted handovers and completed transfers.": "تابع التسليمات المقبولة والتحويلات المكتملة.",
  "Needs attention": "يحتاج إلى اهتمام",
  "Queues that should be handled before reviewing analytics.": "قوائم يجب التعامل معها قبل مراجعة التحليلات.",
  "Requests awaiting response": "طلبات بانتظار الرد",
  "Supplier queue for accepting or declining resource requests.": "قائمة المورد لقبول طلبات الموارد أو رفضها.",
  "Transfers awaiting verification": "تحويلات بانتظار التحقق",
  "Accepted handovers ready to be completed and certified.": "تسليمات مقبولة جاهزة للإكمال وإصدار الشهادة.",
  "Expiring or urgent listings": "عروض عاجلة أو قاربت الانتهاء",
  "Surplus inventory that should move soon or be reviewed.": "مخزون فائض يجب تحريكه قريبا أو مراجعته.",
  "Admin review items": "عناصر مراجعة إدارية",
  "Documents, verification records, and reports needing operations review.": "مستندات وسجلات تحقق وبلاغات تحتاج إلى مراجعة تشغيلية.",
  "Recent listings": "أحدث العروض",
  "Supplier inventory currently available or reserved.": "مخزون المورد المتاح أو المحجوز حاليا.",
  "Recent requests": "أحدث الطلبات",
  "Recipient demand and supplier response status.": "حالة طلب المستفيد واستجابة المورد.",
  "Accepted and completed transfers": "التحويلات المقبولة والمكتملة",
  "Handover status for requests that have moved past review.": "حالة التسليم للطلبات التي تجاوزت مرحلة المراجعة.",
  "Accepted transfers appear after requests are approved.": "تظهر التحويلات المقبولة بعد الموافقة على الطلبات.",
  "Admin operating context": "سياق تشغيل المشرف",
  "Verification readiness, trust, reports, and saved recipient interest.": "جاهزية التحقق والثقة والبلاغات واهتمام المستفيدين المحفوظ.",
  "Documents needing review:": "مستندات تحتاج إلى مراجعة:",
  "Workspace context": "سياق مساحة العمل",
  "Pilot organization and city used by the local workflow preview.": "المؤسسة والمدينة التجريبيتان المستخدمتان في معاينة سير العمل المحلية.",
  "City": "المدينة",
  "Unread alerts": "تنبيهات غير مقروءة",
  "Impact snapshot": "لمحة الأثر",
  "Visible proof from completed redistribution work.": "إثبات واضح من أعمال إعادة التوزيع المكتملة.",
  "Open impact": "فتح الأثر",
  "Units completed through controlled transfers.": "وحدات مكتملة عبر تحويلات مضبوطة.",
  "Estimated material kept out of disposal.": "مواد تقديرية تم إبقاؤها بعيدا عن التخلص منها.",
  "completed handovers": "تسليمات مكتملة",
  "Resource discovery": "اكتشاف الموارد",
  "Find available surplus for redistribution by urgency, location, and handover readiness.": "اعثر على الفائض المتاح لإعادة التوزيع حسب الأولوية والموقع وجاهزية التسليم.",
  "Search resources": "البحث عن الموارد",
  "Prepared meals, cartons, fixtures...": "وجبات جاهزة، كراتين، تجهيزات...",
  "Discovery summary": "ملخص الاكتشاف",
  "Available resources": "الموارد المتاحة",
  "Urgent resources": "موارد عاجلة",
  "Nearby resources": "موارد قريبة",
  "Categories available": "الفئات المتاحة",
  "Listing filters": "فلاتر العروض",
  "Operational filters": "فلاتر تشغيلية",
  "Narrow available surplus by resource fit and handover conditions.": "ضيّق نطاق الفائض المتاح حسب ملاءمة المورد وشروط التسليم.",
  "Category": "الفئة",
  "Location": "الموقع",
  "Availability status": "حالة التوفر",
  "Available for request": "متاح للطلب",
  "Expiry and urgency": "الانتهاء والأولوية",
  "All urgency levels": "كل مستويات الأولوية",
  "Urgent or near expiry": "عاجل أو قريب الانتهاء",
  "Standard timing": "توقيت عادي",
  "Pickup readiness": "جاهزية الاستلام",
  "Organization type": "نوع المؤسسة",
  "Verified supplier organizations": "مؤسسات موردة موثقة",
  "Saved resource search": "بحث موارد محفوظ",
  "Keep this sourcing view for recurring redistribution needs.": "احتفظ بمنظور التوريد هذا لاحتياجات إعادة التوزيع المتكررة.",
  "Resource": "المورد",
  "Urgency": "الأولوية",
  "Action": "الإجراء",
  "No available resources match this filter.": "لا توجد موارد متاحة تطابق هذا الفلتر.",
  "Available surplus": "الفائض المتاح",
  "Handover location": "موقع التسليم",
  "Handover note": "ملاحظة التسليم",
  "No expiry date": "لا يوجد تاريخ انتهاء",
  "Expired": "منتهي",
  "Expires today": "ينتهي اليوم",
  "1 day left": "متبق يوم واحد",
  "Operational request queue": "قائمة الطلبات التشغيلية",
  "Approve new requests, track handovers, and close redistribution work without mixing active and completed queues.": "وافق على الطلبات الجديدة، وتتبع التسليمات، وأغلق أعمال إعادة التوزيع دون خلط القوائم النشطة بالمكتملة.",
  "Request queue summary": "ملخص قائمة الطلبات",
  "Awaiting approval": "بانتظار الموافقة",
  "Awaiting my action": "بانتظار إجرائي",
  "New requests that need approval, rejection, scheduling, or handover verification.": "طلبات جديدة تحتاج إلى موافقة أو رفض أو جدولة أو تحقق من التسليم.",
  "No requests need your action. New resource requests from Discover will appear here.": "لا توجد طلبات تحتاج إلى إجراء منك. ستظهر هنا طلبات الموارد الجديدة من الاكتشاف.",
  "Awaiting other party": "بانتظار الطرف الآخر",
  "Requests that are waiting for supplier response, recipient confirmation, or external transfer verification.": "طلبات تنتظر رد المورد أو تأكيد المستفيد أو تحقق تحويل خارجي.",
  "Nothing is waiting on another party right now.": "لا يوجد شيء ينتظر الطرف الآخر حاليا.",
  "Active transfers": "التحويلات النشطة",
  "Approved requests moving toward handover completion.": "طلبات معتمدة تتحرك نحو إكمال التسليم.",
  "Approved handovers will move here after a request is accepted.": "ستنتقل التسليمات المعتمدة إلى هنا بعد قبول الطلب.",
  "Completed and closed": "مكتملة ومغلقة",
  "Completed, rejected, or cancelled requests kept separate from active operations.": "طلبات مكتملة أو مرفوضة أو ملغاة محفوظة بعيدا عن العمليات النشطة.",
  "Closed requests and certificate-ready handovers will appear here.": "ستظهر هنا الطلبات المغلقة والتسليمات الجاهزة للشهادات.",
  "Closed requests": "طلبات مغلقة",
  "Open": "مفتوح",
  "Clear": "واضح",
  "Request ref": "مرجع الطلب",
  "Approve": "موافقة",
  "Decline": "رفض",
  "Schedule handover": "جدولة التسليم",
  "Certificate ready": "الشهادة جاهزة",
  "Request declined": "تم رفض الطلب",
  "Request cancelled": "تم إلغاء الطلب",
  "Approve or decline this resource request.": "وافق على طلب المورد هذا أو ارفضه.",
  "Schedule handover and verify transfer completion.": "جدول التسليم وتحقق من اكتمال التحويل.",
  "Certificate ready for audit and sharing.": "الشهادة جاهزة للتدقيق والمشاركة.",
  "Completed handover recorded.": "تم تسجيل التسليم المكتمل.",
  "Closed after supplier declined the request.": "أُغلق بعد رفض المورد للطلب.",
  "Closed after cancellation.": "أُغلق بعد الإلغاء.",
  "Review request status.": "راجع حالة الطلب.",
  "Unknown supplier": "مورد غير معروف",
  "Requesting organization": "المؤسسة الطالبة",
  "Pending location": "موقع قيد التأكيد",
  "units": "وحدات",
  "Verify transfer": "تحقق من التحويل",
  "Handover and verification workspace": "مساحة التسليم والتحقق",
  "Track accepted handovers, verify completed transfers, and find certificates without mixing active work with closed records.": "تابع التسليمات المقبولة، وتحقق من التحويلات المكتملة، واعثر على الشهادات دون خلط العمل النشط بالسجلات المغلقة.",
  "Transfer workspace summary": "ملخص مساحة التحويلات",
  "Ready for handover": "جاهز للتسليم",
  "Accepted requests ready for pickup, drop-off, or coordinated handover.": "طلبات مقبولة جاهزة للاستلام أو التسليم أو التسليم المنسق.",
  "No accepted handovers are ready yet. Approved requests from Requests will appear here.": "لا توجد تسليمات مقبولة جاهزة بعد. ستظهر هنا الطلبات المعتمدة من صفحة الطلبات.",
  "Verification required": "التحقق مطلوب",
  "Transfers waiting for completion confirmation and certificate generation.": "تحويلات بانتظار تأكيد الإكمال وإنشاء الشهادة.",
  "No transfers currently require verification.": "لا توجد تحويلات تتطلب التحقق حاليا.",
  "Completed transfers": "التحويلات المكتملة",
  "Closed handovers with certificate status shown when available.": "تسليمات مغلقة مع عرض حالة الشهادة عند توفرها.",
  "Completed transfers and certificates will appear after handover verification.": "ستظهر التحويلات المكتملة والشهادات بعد التحقق من التسليم.",
  "Exceptions and delays": "الاستثناءات والتأخيرات",
  "Exceptions or delays": "استثناءات أو تأخيرات",
  "Declined, cancelled, expired, or blocked handovers supported by the current request states.": "تسليمات مرفوضة أو ملغاة أو منتهية أو محظورة مدعومة بحالات الطلب الحالية.",
  "No transfer exceptions or delays are recorded.": "لا توجد استثناءات أو تأخيرات مسجلة للتحويلات.",
  "Completed transfer": "تحويل مكتمل",
  "Declined handover": "تسليم مرفوض",
  "Cancelled handover": "تسليم ملغى",
  "Confirm handover completion to issue the transfer certificate.": "أكد اكتمال التسليم لإصدار شهادة التحويل.",
  "Certificate is available for audit and verification.": "الشهادة متاحة للتدقيق والتحقق.",
  "Completed transfer recorded.": "تم تسجيل التحويل المكتمل.",
  "No handover required after request rejection.": "لا يلزم تسليم بعد رفض الطلب.",
  "No handover required after cancellation.": "لا يلزم تسليم بعد الإلغاء.",
  "Review transfer status.": "راجع حالة التحويل.",
  "Transfer ref": "مرجع التحويل",
  "Handover method": "طريقة التسليم",
  "Certificate status": "حالة الشهادة",
  "Not issued yet": "لم تصدر بعد",
  "Impact summary": "ملخص الأثر",
  "Redistributed value and environmental indicators from completed transfer activity.": "القيمة المعاد توزيعها والمؤشرات البيئية من نشاط التحويلات المكتملة.",
  "Estimated redistributed value retained through completed handovers.": "قيمة معاد توزيعها تقديرية احتُفظ بها عبر التسليمات المكتملة.",
  "Total units completed through verified transfer workflows.": "إجمالي الوحدات المكتملة عبر مسارات تحويل موثقة.",
  "Estimated material diverted from disposal through reuse.": "مواد تقديرية تم تحويلها عن التخلص منها عبر إعادة الاستخدام.",
  "Estimated emissions avoided from redistribution activity.": "انبعاثات تقديرية تم تجنبها من نشاط إعادة التوزيع.",
  "Recipient impact": "أثر المستفيد",
  "Recipient organizations represented by completed requests and certificates.": "مؤسسات مستفيدة ممثلة بطلبات وشهادات مكتملة.",
  "Transfer outcomes": "نتائج التحويلات",
  "Completed redistribution activity supporting the impact claims.": "نشاط إعادة توزيع مكتمل يدعم ادعاءات الأثر.",
  "Resources by category": "الموارد حسب الفئة",
  "Redistributed resources grouped by completed category contribution.": "موارد معاد توزيعها مجمعة حسب مساهمة الفئة المكتملة.",
  "Resources by location": "الموارد حسب الموقع",
  "Redistributed resources grouped by handover geography.": "موارد معاد توزيعها مجمعة حسب جغرافيا التسليم.",
  "Organization contribution": "مساهمة المؤسسة",
  "Supplier contribution": "مساهمة المورد",
  "Recipient contribution": "مساهمة المستفيد",
  "Combined ecosystem impact": "الأثر المشترك للمنظومة",
  "Supplier, recipient, and ecosystem contribution using existing workspace data.": "مساهمة المورد والمستفيد والمنظومة باستخدام بيانات مساحة العمل الحالية.",
  "Impact evidence": "إثبات الأثر",
  "Certificates, completed handovers, verification, and trust context behind the results.": "الشهادات والتسليمات المكتملة والتحقق وسياق الثقة خلف النتائج.",
  "Certificate references": "مراجع الشهادات",
  "QR-verifiable certificate records generated from completed transfers.": "سجلات شهادات قابلة للتحقق عبر QR صادرة من تحويلات مكتملة.",
  "Verification and trust context": "سياق التحقق والثقة",
  "Organization credibility indicators supporting impact evidence.": "مؤشرات مصداقية المؤسسة التي تدعم إثبات الأثر.",
  "Founder and pilot view": "منظور المؤسس والتجربة",
  "UAE pilot impact snapshot": "لمحة أثر تجربة الإمارات",
  "Pilot-based platform snapshot from existing simulation fixtures.": "لمحة منصة مبنية على التجربة من بيانات المحاكاة الحالية.",
  "Pilot-based calculation": "حساب مبني على التجربة",
  "Pilot AED recovered": "القيمة المستردة في التجربة",
  "Pilot resources redistributed": "موارد معاد توزيعها في التجربة",
  "Pilot organizations": "مؤسسات التجربة",
  "Prepared chicken meals": "وجبات دجاج جاهزة",
  "Double-wall cardboard boxes": "كراتين شحن مزدوجة الجدار",
  "Freshly prepared and packed meals. Pickup window today from 4-7 PM.": "وجبات طازجة ومعبأة. نافذة الاستلام اليوم من 4 إلى 7 مساء.",
  "Unused shipping boxes in three common sizes, ready for collection.": "كراتين شحن غير مستخدمة بثلاثة أحجام شائعة وجاهزة للاستلام.",
  "North Warehouse": "مستودع نورث",
  "Prepared meals": "وجبات جاهزة",
  "Cartons and boxes": "كراتين وصناديق",
  "meals": "وجبات",
  "boxes": "كراتين",
  "Workspace ready": "مساحة العمل جاهزة",
  "Create listings, request stock, follow groups, and review reports locally.": "أنشئ عروضا، واطلب المخزون، وتابع المجموعات، وراجع البلاغات محليا.",
  "workspace.created": "تم إنشاء مساحة العمل",
  "System": "النظام",
  "Local ReDist preview initialized.": "تم تهيئة معاينة ReDist المحلية.",
  "Now": "الآن",
  "Current account": "الحساب الحالي",
  "Local preview of the organization identity attached to this workspace.": "معاينة محلية لهوية المؤسسة المرتبطة بمساحة العمل هذه.",
  "Verification records": "سجلات التحقق",
  "Licenses and supporting records currently attached to the account.": "الرخص والسجلات الداعمة المرتبطة حاليا بالحساب.",
  "Sign in": "تسجيل الدخول",
  "Use email and password now; Supabase Auth will replace this local preview step.": "استخدم البريد الإلكتروني وكلمة المرور الآن؛ سيحل Supabase Auth محل خطوة المعاينة المحلية هذه.",
  "Sign up company or supplier": "تسجيل مؤسسة أو مورد",
  "Collect the minimum details needed before license verification.": "اجمع الحد الأدنى من التفاصيل المطلوبة قبل التحقق من الرخصة.",
  "Publish inventory": "نشر المخزون",
  "Create a safe, non-regulated item listing.": "أنشئ عرضا آمنا لعنصر غير منظم.",
  "UAE category control": "إدارة فئات الإمارات",
  "Suggested starter categories for UAE redistribution. Arrange or hide categories any time.": "فئات بداية مقترحة لإعادة التوزيع في الإمارات. يمكنك ترتيب الفئات أو إخفاؤها في أي وقت.",
  "Request conversation": "محادثة الطلب",
  "Follow category/location groups for matching inventory alerts.": "تابع مجموعات الفئات والمواقع لتنبيهات المخزون المطابق.",
  "Saved searches": "عمليات البحث المحفوظة",
  "Local saved filters for notification rules later.": "فلاتر محفوظة محليا لقواعد التنبيه لاحقا.",
  "Local notification center for important workflow activity.": "مركز إشعارات محلي لنشاط سير العمل المهم.",
  "Review reports and flagged listings before production admin tools.": "راجع البلاغات والعروض المعلّمة قبل أدوات الإدارة الإنتاجية.",
  "Audit trail": "سجل التدقيق",
  "Local activity history for controlled workflow decisions.": "سجل نشاط محلي لقرارات سير العمل المضبوطة.",
  "Add document metadata": "إضافة بيانات وصفية للمستند",
  "Local preview only. Upload screens and private storage policies remain future work.": "معاينة محلية فقط. شاشات الرفع وسياسات التخزين الخاص ما زالت عملا مستقبليا.",
  "Document readiness": "جاهزية المستندات",
  "Required UAE verification documents and current review states.": "مستندات التحقق المطلوبة في الإمارات وحالات المراجعة الحالية.",
  "Verification summary": "ملخص التحقق",
  "Public-safe organization trust context for listings and workspace decisions.": "سياق ثقة آمن للعرض العام للمؤسسة والعروض وقرارات مساحة العمل.",
  "Branches and members": "الفروع والأعضاء",
  "Operational context used for future country, branch, and role scoping.": "سياق تشغيلي يُستخدم مستقبلا لتحديد نطاق الدولة والفرع والدور.",
  "Certificate readiness": "جاهزية الشهادة",
  "Completed transfers create immutable QR-verifiable proof.": "تنشئ التحويلات المكتملة إثباتا ثابتا قابلا للتحقق عبر QR.",
  "Attached records": "السجلات المرفقة",
  "Current review queue for the company profile.": "قائمة المراجعة الحالية لملف المؤسسة.",
  "Review audit timeline": "جدول تدقيق المراجعة",
  "Verification events visible to authorized reviewers.": "أحداث التحقق المرئية للمراجعين المخولين.",
  "Highest current trust scores across the platform preview.": "أعلى درجات ثقة حالية عبر معاينة المنصة.",
  "Lowest trust organizations": "أدنى المؤسسات في الثقة",
  "Organizations needing review, support, or risk intervention.": "مؤسسات تحتاج إلى مراجعة أو دعم أو تدخل مخاطر.",
  "Score history": "سجل الدرجة",
  "Recent score movements and levels for review context.": "حركات ومستويات الدرجة الأخيرة لسياق المراجعة.",
  "Maintain the company or supplier details required for approval.": "حافظ على تفاصيل المؤسسة أو المورد المطلوبة للاعتماد.",
  "Licenses and permits": "الرخص والتصاريح",
  "Add trade, food, municipality, warehouse, or charity approvals.": "أضف موافقات التجارة أو الغذاء أو البلدية أو المستودع أو الجمعية الخيرية.",
  "UAE locations": "مواقع الإمارات",
  "Manage pickup and handover points for listings.": "إدارة نقاط الاستلام والتسليم للعروض.",
  "Team and roles": "الفريق والأدوار",
  "Preview organization permissions before Supabase auth.": "معاينة صلاحيات المؤسسة قبل Supabase Auth.",
  "Founder monitoring workspace": "مساحة متابعة المؤسس",
  "Operational view for onboarding the first UAE pilot organizations, tracking feedback, issues, trust, impact, and transaction readiness.": "منظور تشغيلي لإدخال أول مؤسسات تجربة في الإمارات وتتبع الملاحظات والمشكلات والثقة والأثر وجاهزية التحويلات.",
  "UAE pilot platform": "منصة تجربة الإمارات",
  "Organizations invited into the UAE founder-led pilot.": "مؤسسات مدعوة إلى تجربة الإمارات بقيادة المؤسس.",
  "Listings created": "العروض المنشأة",
  "First supply-side listings across restaurant, hotel, warehouse, and NGO pilots.": "أول عروض جانب التوريد عبر تجارب المطاعم والفنادق والمستودعات والجهات غير الربحية.",
  "Requests created": "الطلبات المنشأة",
  "Demand-side requests generated in the pilot workflow.": "طلبات جانب الطلب المنشأة في مسار التجربة.",
  "Transactions completed": "التحويلات المكتملة",
  "Completed request and handover flows validated by scenario automation.": "مسارات طلب وتسليم مكتملة تم التحقق منها عبر أتمتة السيناريوهات.",
  "Verification completion": "اكتمال التحقق",
  "Pilot organizations with approved verification status.": "مؤسسات التجربة ذات حالة تحقق معتمدة.",
  "Feedback submitted": "الملاحظات المقدمة",
  "Suggestions, bugs, and feature requests captured from pilot users.": "اقتراحات وأخطاء وطلبات ميزات مسجلة من مستخدمي التجربة.",
  "Founder monitoring dashboard": "لوحة متابعة المؤسس",
  "Single view of pilot activity, verification readiness, trust, impact, and issue health.": "منظور واحد لنشاط التجربة وجاهزية التحقق والثقة والأثر وصحة المشكلات.",
  "Feedback center": "مركز الملاحظات",
  "Capture suggestions, bugs, and feature requests from UAE pilot users.": "سجل الاقتراحات والأخطاء وطلبات الميزات من مستخدمي تجربة الإمارات.",
  "Issue tracking": "تتبع المشكلات",
  "Open, resolved, and critical pilot issues requiring founder attention.": "مشكلات تجربة مفتوحة ومحلولة وحرجة تتطلب انتباه المؤسس.",
  "Issue": "مشكلة",
  "Issues": "المشكلات",
  "Priority": "الأولوية",
  "Type": "النوع",
  "Title": "العنوان",
  "Details": "التفاصيل",
  "Short feedback title": "عنوان ملاحظة قصير",
  "What happened, who was affected, and what should improve?": "ماذا حدث، ومن تأثر، وما الذي يجب تحسينه؟",
  "Submit feedback": "إرسال الملاحظة",
  "Invited": "تمت الدعوة",
  "Registration": "التسجيل",
  "Verification submitted": "تم تقديم التحقق",
  "Verification approved": "تم اعتماد التحقق",
  "First listing": "أول عرض",
  "First request": "أول طلب",
  "First transaction": "أول تحويل",
  "Cohort readiness": "جاهزية المجموعة",
  "Active pilot organizations": "مؤسسات تجربة نشطة",
  "Open issues": "مشكلات مفتوحة",
  "Resolved issues": "مشكلات محلولة",
  "Critical issues": "مشكلات حرجة",
  "Impact results": "نتائج الأثر",
  "Based on listed quantity reserved or completed through request workflows.": "استنادا إلى الكمية المعروضة المحجوزة أو المكتملة عبر مسارات الطلب.",
  "Based on completed request quantities already recorded in the workspace.": "استنادا إلى كميات الطلبات المكتملة المسجلة بالفعل في مساحة العمل.",
  "Estimated redistributed value supported by completed transfers and evidence.": "قيمة معاد توزيعها تقديرية مدعومة بتحويلات وإثباتات مكتملة.",
  "Completed units": "وحدات مكتملة",
  "Certificates generated": "الشهادات المنشأة",
  "Certificates appear after completed handovers are verified.": "تظهر الشهادات بعد التحقق من التسليمات المكتملة.",
  "Top cities": "أعلى المدن",
  "Items redistributed": "العناصر المعاد توزيعها",
  "Waste diverted": "النفايات المحولة عن الهدر",
  "AED value recovered": "القيمة المستردة بالدرهم",
  "CO2 impact": "أثر CO2",
  "Transfer": "التحويل",
};

const LocalizationContext = createContext<LocalizationContextValue>({
  locale: "en",
  dir: "ltr",
  setLocale: () => undefined,
  t: (value) => value,
  n: (value) => value.toLocaleString("en-US"),
  money: (value) => `AED ${Math.round(value).toLocaleString("en-US")}`,
  date: (value) => new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
});

function translateText(locale: Locale, value: string) {
  if (locale !== "ar") return value;
  const dayMatch = value.match(/^(\d+) days left$/);
  if (dayMatch) return `متبق ${Number(dayMatch[1]).toLocaleString("ar-AE")} أيام`;
  const resourcesReadyMatch = value.match(/^(\d+) resources ready for redistribution review\\.$/);
  if (resourcesReadyMatch) return `${Number(resourcesReadyMatch[1]).toLocaleString("ar-AE")} موارد جاهزة لمراجعة إعادة التوزيع.`;
  const singleResourceReadyMatch = value.match(/^(\d+) resource ready for redistribution review\\.$/);
  if (singleResourceReadyMatch) return `${Number(singleResourceReadyMatch[1]).toLocaleString("ar-AE")} مورد جاهز لمراجعة إعادة التوزيع.`;
  return arabicTranslations[value] ?? value;
}

function useI18n() {
  return useContext(LocalizationContext);
}

function LocalizedText({ children }: { children: string }) {
  const { t } = useI18n();
  return <>{t(children)}</>;
}

type ListingStatus = "draft" | "published" | "paused" | "reserved" | "completed";
type RequestStatus = "pending" | "accepted" | "declined" | "completed" | "cancelled";
type Section =
  | "account"
  | "dashboard"
  | "discover"
  | "pilot"
  | "impact"
  | "transfers"
  | "publish"
  | "verification"
  | "certificates"
  | "documents"
  | "organization"
  | "categories"
  | "requests"
  | "messages"
  | "groups"
  | "notifications"
  | "verificationAdmin"
  | "trustAdmin"
  | "impactAdmin"
  | "moderation"
  | "settings";
type NavItem = { id: Section; label: string; icon: typeof LayoutDashboard; count?: number };
type NavGroup = { title: string; description: string; items: NavItem[] };
type HandoverMethod = "Pickup" | "Delivery by owner" | "Requester delivery" | "Courier coordination";
type AccountType = "Company" | "Supplier";
type VerificationStatus = "Draft" | "Pending review" | "Verified" | "Needs changes";
type VerificationLevel =
  | "Unverified"
  | "Basic Verified"
  | "Business Verified"
  | "Enterprise Verified"
  | "NGO Verified"
  | "Government Verified";
type LicenseStatus = "Uploaded" | "Pending Review" | "Approved" | "Rejected" | "Expired";
type TrustLevel = "Bronze" | "Silver" | "Gold" | "Platinum";

type TrustFactor = {
  key: string;
  label: string;
  points: number;
  detail: string;
};

type TrustScore = {
  score: number;
  level: TrustLevel;
  factors: TrustFactor[];
};

type LicenseRecord = {
  id: string;
  licenseType: string;
  number: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  documentName: string;
  status: LicenseStatus;
};

type CompanyProfile = {
  signedIn: boolean;
  accountType: AccountType;
  legalName: string;
  tradeName: string;
  email: string;
  phone: string;
  passwordHint: string;
  website: string;
  emirate: string;
  city: string;
  address: string;
  businessCategory: string;
  businessSubcategory: string;
  businessActivity: string;
  trn: string;
  authorizedPerson: string;
  authorizedRole: string;
  authorizedEmail: string;
  authorizedPhone: string;
  verificationLevel: VerificationLevel;
  verificationStatus: VerificationStatus;
  verificationNotes: string;
  licenses: LicenseRecord[];
  documents: string[];
};

type OrganizationLocation = {
  id: string;
  label: string;
  emirate: string;
  area: string;
};

type TeamMember = {
  id: string;
  name: string;
  role: "Owner admin" | "Inventory manager" | "Requester" | "Moderator";
  status: "active" | "invited";
};

type AuditEvent = {
  id: string;
  action: string;
  actor: string;
  detail: string;
  at: string;
};

type Category = {
  id: string;
  name: string;
  description: string;
  order: number;
  hidden: boolean;
  restricted: boolean;
  examples: string;
  subcategories: string[];
};

type Listing = {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  offerType: "Free" | "For sale" | "Exchange";
  reason: "Excess stock" | "Near expiry" | "Slow moving" | "Other";
  city: string;
  area: string;
  handoverMethods: HandoverMethod[];
  quantityTotal: number;
  quantityAvailable: number;
  unit: string;
  owner: string;
  description: string;
  expiryDate?: string;
  price?: string;
  status: ListingStatus;
  saved: boolean;
  groupIds: string[];
};

type RequestRecord = {
  id: string;
  listingId: string;
  quantity: number;
  message: string;
  handoverMethod: HandoverMethod;
  status: RequestStatus;
  receiverOrganization?: string;
  timeline: string[];
};

type Conversation = {
  id: string;
  requestId: string;
  messages: Array<{ id: string; sender: "Owner" | "Requester"; body: string; at: string }>;
};

type Group = {
  id: string;
  name: string;
  category: string;
  city: string;
  members: number;
  following: boolean;
};

type NotificationRecord = {
  id: string;
  title: string;
  body: string;
  read: boolean;
};

type Report = {
  id: string;
  listingId: string;
  reason: string;
  status: "open" | "reviewing" | "resolved";
};

type PilotOrganization = {
  id: string;
  name: string;
  type: "Restaurant" | "Hotel" | "Warehouse" | "NGO";
  city: string;
  status: "invited" | "onboarding" | "active" | "attention";
  invited: boolean;
  registrationCompleted: boolean;
  verificationSubmitted: boolean;
  verificationApproved: boolean;
  firstListingCreated: boolean;
  firstRequestCreated: boolean;
  firstTransactionCompleted: boolean;
  listingsCreated: number;
  requestsCreated: number;
  transactionsCompleted: number;
  issuesReported: number;
  trustScore: number;
};

type PilotFeedback = {
  id: string;
  organization: string;
  type: "Suggestion" | "Bug" | "Feature request";
  priority: "Low" | "Medium" | "High" | "Critical";
  category: "Onboarding" | "Verification" | "Listings" | "Requests" | "Handover" | "Impact" | "Certificate";
  status: "Open" | "Reviewing" | "Resolved";
  title: string;
  detail: string;
  createdAt: string;
};

type WorkspaceState = {
  account: CompanyProfile;
  organization: string;
  city: string;
  locations: OrganizationLocation[];
  team: TeamMember[];
  auditEvents: AuditEvent[];
  categories: Category[];
  listings: Listing[];
  requests: RequestRecord[];
  conversations: Conversation[];
  groups: Group[];
  notifications: NotificationRecord[];
  reports: Report[];
  pilotFeedback: PilotFeedback[];
  savedSearches: string[];
  certificates: TransferCertificateRecord[];
};

type TrustScenario = {
  id: string;
  organization: string;
  score: TrustScore;
  history: Array<{ label: string; score: number; at: string }>;
};

type ImpactTrend = {
  label: string;
  aed: number;
  waste: number;
  transactions: number;
};

type ImpactLeaderboardItem = {
  label: string;
  sector: string;
  city: string;
  metrics: ImpactMetrics;
};

const storageKey = "redist-local-workspace-v2";

const requiredVerificationDocuments = [
  "Trade License",
  "VAT/TRN",
  "Food Permit",
  "Storage Permit",
  "NGO License",
  "Government Authorization",
  "Other",
];

const verificationLevels: VerificationLevel[] = [
  "Unverified",
  "Basic Verified",
  "Business Verified",
  "Enterprise Verified",
  "NGO Verified",
  "Government Verified",
];

const pilotOrganizations: PilotOrganization[] = [
  {
    id: "pilot-restaurant",
    name: "Dubai Marina Restaurant",
    type: "Restaurant",
    city: "Dubai Marina",
    status: "active",
    invited: true,
    registrationCompleted: true,
    verificationSubmitted: true,
    verificationApproved: true,
    firstListingCreated: true,
    firstRequestCreated: true,
    firstTransactionCompleted: true,
    listingsCreated: 1,
    requestsCreated: 3,
    transactionsCompleted: 2,
    issuesReported: 1,
    trustScore: 72,
  },
  {
    id: "pilot-hotel",
    name: "Abu Dhabi Hotel Group",
    type: "Hotel",
    city: "Abu Dhabi",
    status: "active",
    invited: true,
    registrationCompleted: true,
    verificationSubmitted: true,
    verificationApproved: true,
    firstListingCreated: true,
    firstRequestCreated: true,
    firstTransactionCompleted: true,
    listingsCreated: 1,
    requestsCreated: 2,
    transactionsCompleted: 2,
    issuesReported: 0,
    trustScore: 76,
  },
  {
    id: "pilot-warehouse",
    name: "Jebel Ali Logistics",
    type: "Warehouse",
    city: "Jebel Ali",
    status: "attention",
    invited: true,
    registrationCompleted: true,
    verificationSubmitted: true,
    verificationApproved: false,
    firstListingCreated: true,
    firstRequestCreated: true,
    firstTransactionCompleted: true,
    listingsCreated: 1,
    requestsCreated: 3,
    transactionsCompleted: 2,
    issuesReported: 2,
    trustScore: 64,
  },
  {
    id: "pilot-ngo",
    name: "Dubai Community NGO",
    type: "NGO",
    city: "Dubai",
    status: "onboarding",
    invited: true,
    registrationCompleted: true,
    verificationSubmitted: true,
    verificationApproved: false,
    firstListingCreated: true,
    firstRequestCreated: true,
    firstTransactionCompleted: true,
    listingsCreated: 1,
    requestsCreated: 3,
    transactionsCompleted: 2,
    issuesReported: 1,
    trustScore: 68,
  },
];

const initialPilotFeedback: PilotFeedback[] = [
  {
    id: "pilot-feedback-1",
    organization: "Jebel Ali Logistics",
    type: "Bug",
    priority: "High",
    category: "Verification",
    status: "Open",
    title: "Storage permit renewal reminder needs clearer owner",
    detail: "Warehouse team wants reviewer notes and renewal owner visible in the same queue.",
    createdAt: "20 Jun 2026",
  },
  {
    id: "pilot-feedback-2",
    organization: "Dubai Marina Restaurant",
    type: "Suggestion",
    priority: "Medium",
    category: "Handover",
    status: "Reviewing",
    title: "Add pickup window confirmation before completion",
    detail: "Restaurant operator wants a final handover time confirmation before certificate issue.",
    createdAt: "20 Jun 2026",
  },
  {
    id: "pilot-feedback-3",
    organization: "Dubai Community NGO",
    type: "Feature request",
    priority: "Low",
    category: "Impact",
    status: "Resolved",
    title: "Show monthly impact summary for board reporting",
    detail: "NGO team requested simple monthly exports for trustee updates.",
    createdAt: "19 Jun 2026",
  },
];

const dubaiBusinessCategories = [
  {
    name: "Commercial trading",
    subcategories: [
      "Foodstuff trading",
      "Bags, packaging materials and paper trading",
      "Furniture trading",
      "Electronics group",
      "Office and electronic equipment rental",
      "Used articles trading",
      "Used electronics and furniture trading",
      "Stationery and books trading",
    ],
  },
  {
    name: "Food and hospitality",
    subcategories: [
      "Restaurants and coffee shops",
      "Foodstuff supply",
      "Food industries",
      "Bread manufacturing",
      "Meat processing",
      "Water manufacturing and bottling",
      "Supermarket",
      "Roastery",
    ],
  },
  {
    name: "Industrial and manufacturing",
    subcategories: [
      "Manufacturing of paper and paper products",
      "Plastic industries",
      "Metal containers and boxes manufacturing",
      "Furniture and wood products manufacturing",
      "Textiles and products manufacturing",
      "Garments and rugs manufacturing",
      "Machinery and equipment manufacturing",
      "Separate industrial activities",
    ],
  },
  {
    name: "Professional services",
    subcategories: [
      "Management, information and marketing consultancy",
      "Technical consultancy",
      "Legal services",
      "Accounting and finance consultants",
      "Business and professional organizations",
      "Business councils",
      "Other professional services",
      "Separate professional activities",
    ],
  },
  {
    name: "Facilities and maintenance",
    subcategories: [
      "Facilities management group",
      "Building maintenance, surveillance and cleaning services",
      "Cleaning services",
      "Cleaning equipment trading",
      "Repairing of electrical and electronic appliances",
      "Building materials trading",
      "Sewage and cleaning services",
    ],
  },
  {
    name: "Transport, storage and logistics",
    subcategories: [
      "Transport, shipping and storage",
      "Packing services",
      "Cargo and passenger transport",
      "Car rent and passenger transport",
      "Ships and boats trading",
      "Postal services",
      "Equipment and engines trading",
    ],
  },
  {
    name: "Health, education and social",
    subcategories: [
      "Medical clinic",
      "Medical laboratories",
      "Education",
      "Nursery",
      "Social work activities",
      "Charity society",
      "Animal welfare organization",
      "Veterinary clinic",
    ],
  },
  {
    name: "Waste and circular economy",
    subcategories: [
      "Waste collection and treatment",
      "Waste trading",
      "Documents destroying and storage",
      "Used auto spare parts trading",
      "Used heavy equipment trading",
      "Used articles trading",
    ],
  },
];

const initialAccount: CompanyProfile = {
  signedIn: true,
  accountType: "Supplier",
  legalName: "Demo Restaurant Group LLC",
  tradeName: "Demo Restaurant Group",
  email: "operations@demo-restaurant.ae",
  phone: "+971 50 000 0000",
  passwordHint: "local-demo",
  website: "https://redistribut.com",
  emirate: "Dubai",
  city: "Dubai",
  address: "Dubai Marina, Dubai, UAE",
  businessCategory: "Food and hospitality",
  businessSubcategory: "Restaurants and coffee shops",
  businessActivity: "Restaurant and catering surplus redistribution",
  trn: "100000000000003",
  authorizedPerson: "Operations owner",
  authorizedRole: "Owner admin",
  authorizedEmail: "operations@demo-restaurant.ae",
  authorizedPhone: "+971 50 000 0000",
  verificationLevel: "Business Verified",
  verificationStatus: "Pending review",
  verificationNotes: "Business profile is verified. Food permit renewal is pending review before category expansion.",
  licenses: [
    {
      id: "lic-trade-demo",
      licenseType: "Trade License",
      number: "DED-000000",
      issuingAuthority: "Dubai Department of Economy and Tourism",
      issueDate: "2026-01-01",
      expiryDate: "2027-01-01",
      documentName: "demo-trade-license.pdf",
      status: "Approved",
    },
    {
      id: "lic-vat-demo",
      licenseType: "VAT/TRN",
      number: "100000000000003",
      issuingAuthority: "Federal Tax Authority",
      issueDate: "2026-01-15",
      expiryDate: "2027-01-15",
      documentName: "demo-vat-trn.pdf",
      status: "Pending Review",
    },
    {
      id: "lic-food-demo",
      licenseType: "Food Permit",
      number: "DM-FS-2401",
      issuingAuthority: "Dubai Municipality",
      issueDate: "2025-01-10",
      expiryDate: "2026-01-10",
      documentName: "demo-food-permit.pdf",
      status: "Expired",
    },
    {
      id: "lic-government-demo",
      licenseType: "Government Authorization",
      number: "AUTH-DRAFT",
      issuingAuthority: "Pilot authority placeholder",
      issueDate: "2026-02-01",
      expiryDate: "2027-02-01",
      documentName: "authorization-placeholder.pdf",
      status: "Rejected",
    },
  ],
  documents: [
    "Trade License",
    "VAT/TRN",
    "Food Permit",
    "Government Authorization",
  ],
};

const uaeStarterCategories: Category[] = [
  {
    id: "food-and-beverage",
    name: "Food and beverage",
    description: "Prepared meals, packaged food, beverages, pantry stock, and catering surplus.",
    order: 1,
    hidden: false,
    restricted: false,
    examples: "Meals, rice, canned goods, bottled drinks",
    subcategories: ["Prepared meals", "Packaged food", "Beverages", "Bakery", "Catering surplus", "Pantry staples"],
  },
  {
    id: "packaging-materials",
    name: "Packaging materials",
    description: "Boxes, cartons, bags, labels, wrapping, pallets, and shipping consumables.",
    order: 2,
    hidden: false,
    restricted: false,
    examples: "Cartons, paper bags, bubble wrap, pallets",
    subcategories: ["Cartons and boxes", "Bags and pouches", "Labels", "Wrapping", "Pallets", "Shipping consumables"],
  },
  {
    id: "office-supplies",
    name: "Office supplies",
    description: "Stationery, consumables, printers, small office tools, and workplace supplies.",
    order: 3,
    hidden: false,
    restricted: false,
    examples: "Paper, files, ink, desk accessories",
    subcategories: ["Stationery", "Printer supplies", "Files and folders", "Desk accessories", "Office tools"],
  },
  {
    id: "furniture-fixtures",
    name: "Furniture and fixtures",
    description: "Office, retail, hospitality, and warehouse furniture or removable fixtures.",
    order: 4,
    hidden: false,
    restricted: false,
    examples: "Chairs, tables, shelving, display stands",
    subcategories: ["Office furniture", "Retail fixtures", "Shelving", "Storage", "Display stands"],
  },
  {
    id: "hospitality-supplies",
    name: "Hospitality supplies",
    description: "Hotel, restaurant, and event supplies that are safe to redistribute.",
    order: 5,
    hidden: false,
    restricted: false,
    examples: "Linens, uniforms, disposables, buffet tools",
    subcategories: ["Linens", "Uniforms", "Event supplies", "Kitchen tools", "Safe disposables"],
  },
  {
    id: "retail-inventory",
    name: "Retail inventory",
    description: "Slow-moving non-regulated stock from shops, distributors, and warehouses.",
    order: 6,
    hidden: false,
    restricted: false,
    examples: "Accessories, household items, seasonal stock",
    subcategories: ["Household goods", "Accessories", "Seasonal stock", "Display stock", "General merchandise"],
  },
  {
    id: "building-maintenance",
    name: "Building and maintenance",
    description: "Non-hazardous facility maintenance materials and spare parts.",
    order: 7,
    hidden: false,
    restricted: false,
    examples: "Tiles, fixtures, tools, spare fittings",
    subcategories: ["Tools", "Fixtures", "Spare parts", "Tiles", "Non-hazardous materials"],
  },
  {
    id: "electronics-it",
    name: "Electronics and IT",
    description: "Working electronics, accessories, and office IT equipment.",
    order: 8,
    hidden: false,
    restricted: false,
    examples: "Monitors, cables, routers, keyboards",
    subcategories: ["Computers and monitors", "Cables", "Networking", "Peripherals", "Accessories"],
  },
  {
    id: "health-wellness-non-regulated",
    name: "Health and wellness non-regulated",
    description: "Non-prescription, non-medical, safe wellness and hygiene supplies.",
    order: 9,
    hidden: false,
    restricted: false,
    examples: "Sanitizers, masks, hygiene packs",
    subcategories: ["Hygiene supplies", "Sanitizers", "Masks", "Wellness packs", "Non-medical supplies"],
  },
  {
    id: "medical-pharmaceutical",
    name: "Medical and pharmaceutical",
    description: "Restricted until licensing, storage, transport, verification, and audit controls are ready.",
    order: 10,
    hidden: true,
    restricted: true,
    examples: "Medicines, prescription products, clinical supplies",
    subcategories: ["Prescription medicines", "OTC medicines", "Clinical supplies", "Medical devices"],
  },
  {
    id: "hazardous-regulated",
    name: "Hazardous or regulated materials",
    description: "Restricted until applicable UAE rules, approvals, transport, and disposal workflows are implemented.",
    order: 11,
    hidden: true,
    restricted: true,
    examples: "Chemicals, batteries in bulk, flammables",
    subcategories: ["Chemicals", "Bulk batteries", "Flammables", "Controlled goods"],
  },
];

const initialState: WorkspaceState = {
  account: initialAccount,
  organization: "Demo Restaurant Group",
  city: "Dubai",
  locations: [
    { id: "loc-dubai-marina", label: "Dubai Marina kitchen", emirate: "Dubai", area: "Dubai Marina" },
    { id: "loc-sharjah-industrial", label: "Sharjah warehouse", emirate: "Sharjah", area: "Industrial Area" },
    { id: "loc-abu-dhabi-mussafah", label: "Abu Dhabi store", emirate: "Abu Dhabi", area: "Mussafah" },
  ],
  team: [
    { id: "member-owner", name: "Operations owner", role: "Owner admin", status: "active" },
    { id: "member-inventory", name: "Inventory coordinator", role: "Inventory manager", status: "active" },
    { id: "member-moderator", name: "Safety reviewer", role: "Moderator", status: "invited" },
  ],
  auditEvents: [
    {
      id: "audit-start",
      action: "workspace.created",
      actor: "System",
      detail: "Local ReDist preview initialized.",
      at: "Now",
    },
  ],
  categories: uaeStarterCategories,
  listings: [
    {
      id: "meals",
      title: "Prepared chicken meals",
      category: "Food and beverage",
      subcategory: "Prepared meals",
      offerType: "Free",
      reason: "Near expiry",
      city: "Dubai",
      area: "Dubai Marina",
      handoverMethods: ["Pickup", "Requester delivery"],
      quantityTotal: 120,
      quantityAvailable: 120,
      unit: "meals",
      owner: "Demo Restaurant Group",
      description: "Freshly prepared and packed meals. Pickup window today from 4-7 PM.",
      expiryDate: "2026-06-15",
      status: "published",
      saved: false,
      groupIds: ["food-dubai"],
    },
    {
      id: "boxes",
      title: "Double-wall cardboard boxes",
      category: "Packaging materials",
      subcategory: "Cartons and boxes",
      offerType: "For sale",
      reason: "Excess stock",
      city: "Sharjah",
      area: "Industrial Area",
      handoverMethods: ["Pickup", "Courier coordination"],
      quantityTotal: 850,
      quantityAvailable: 850,
      unit: "boxes",
      owner: "North Warehouse",
      description: "Unused shipping boxes in three common sizes, ready for collection.",
      price: "AED 1.25 each",
      status: "published",
      saved: true,
      groupIds: ["packaging-uae"],
    },
  ],
  requests: [],
  conversations: [],
  groups: [
    { id: "food-dubai", name: "Dubai food redistribution", category: "Food and beverage", city: "Dubai", members: 42, following: true },
    { id: "packaging-uae", name: "Packaging exchange UAE", category: "Packaging materials", city: "Sharjah", members: 18, following: false },
    { id: "office-supplies", name: "Office supplies circular group", category: "Office supplies", city: "Abu Dhabi", members: 26, following: false },
  ],
  notifications: [
    { id: "welcome", title: "Workspace ready", body: "Create listings, request stock, follow groups, and review reports locally.", read: false },
  ],
  reports: [],
  pilotFeedback: initialPilotFeedback,
  savedSearches: ["Food and beverage in Dubai", "Near expiry free items"],
  certificates: [],
};

function useWorkspaceState() {
  const [state, setState] = useState<WorkspaceState>(initialState);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Partial<WorkspaceState>;
      const categories = mergeCategories(parsed.categories);
      setState({
        ...initialState,
        ...parsed,
        account: mergeAccount(parsed.account),
        categories,
        locations: parsed.locations?.length ? parsed.locations : initialState.locations,
        team: parsed.team?.length ? parsed.team : initialState.team,
        auditEvents: parsed.auditEvents?.length ? parsed.auditEvents : initialState.auditEvents,
        certificates: parsed.certificates ?? initialState.certificates,
        pilotFeedback: parsed.pilotFeedback?.length ? parsed.pilotFeedback : initialState.pilotFeedback,
        listings: (parsed.listings ?? initialState.listings).map((listing) => ({
          ...listing,
          subcategory:
            "subcategory" in listing && typeof listing.subcategory === "string"
              ? listing.subcategory
              : categories.find((item) => item.name === listing.category)?.subcategories[0] ?? "General",
          area:
            "area" in listing && typeof listing.area === "string"
              ? listing.area
              : parsed.locations?.find((location) => location.emirate === listing.city)?.area ?? "Central",
          handoverMethods:
            "handoverMethods" in listing && Array.isArray(listing.handoverMethods)
              ? listing.handoverMethods
              : ["Pickup"],
        })) as Listing[],
      });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  return [state, setState] as const;
}

function mergeAccount(account?: Partial<CompanyProfile>) {
  if (!account) return initialAccount;
  return {
    ...initialAccount,
    ...account,
    licenses: account.licenses?.length ? account.licenses : initialAccount.licenses,
    documents: account.documents?.length ? account.documents : initialAccount.documents,
  };
}

function shortId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function audit(action: string, actor: string, detail: string): AuditEvent {
  return {
    id: shortId("audit"),
    action,
    actor,
    detail,
    at: new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }),
  };
}

function buildTransferCertificate({
  account,
  organization,
  listing,
  request,
  trustScore,
  sequence,
}: {
  account: CompanyProfile;
  organization: string;
  listing: Listing;
  request: RequestRecord;
  trustScore: TrustScore;
  sequence: number;
}) {
  const transferDate = new Date().toISOString();
  const metrics = calculateImpactMetrics({
    listings: [{
      id: listing.id,
      title: listing.title,
      category: listing.category,
      city: listing.city,
      unit: listing.unit,
      unitPrice: numericPrice(listing.price),
      status: "completed",
    }],
    requests: [{ id: request.id, listingId: listing.id, quantity: request.quantity, status: "completed" }],
  });

  return createLocalTransferCertificate({
    transaction_id: `txn-${request.id}`,
    listing_request_id: null,
    sender_organization_id: "00000000-0000-4000-8000-000000000001",
    receiver_organization_id: null,
    sender_organization_name: organization,
    receiver_organization_name: request.receiverOrganization ?? "Approved recipient organization",
    item_name: listing.title,
    category: listing.category,
    quantity: request.quantity,
    unit: listing.unit,
    estimated_value: metrics.aed_recovered,
    currency: "AED",
    transfer_date: transferDate,
    location: `${listing.area}, ${listing.city}`,
    handover_method: request.handoverMethod,
    trust_snapshot: {
      score: trustScore.score,
      level: trustScore.level,
      verification_level: account.verificationLevel,
      verification_status: account.verificationStatus,
    },
    impact_snapshot: {
      aed_recovered: metrics.aed_recovered,
      resources_redistributed: metrics.resources_redistributed,
      waste_prevented_kg: metrics.waste_prevented_kg,
      co2_saved_kg: metrics.co2_saved_kg,
    },
  }, sequence);
}

function expiryStatus(expiryDate?: string) {
  if (!expiryDate) return { label: "No expiry date", urgent: false };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(`${expiryDate}T00:00:00`);
  const days = Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000);

  if (days < 0) return { label: "Expired", urgent: true };
  if (days === 0) return { label: "Expires today", urgent: true };
  if (days === 1) return { label: "1 day left", urgent: true };
  if (days <= 3) return { label: `${days} days left`, urgent: true };
  return { label: `${days} days left`, urgent: false };
}

function trustLevelForScore(score: number): TrustLevel {
  if (score >= 85) return "Platinum";
  if (score >= 70) return "Gold";
  if (score >= 50) return "Silver";
  return "Bronze";
}

function trustFactor(key: string, label: string, points: number, detail: string): TrustFactor {
  return { key, label, points, detail };
}

function calculateLocalTrustScore(input: {
  verificationLevel: VerificationLevel;
  completedTransactions: number;
  averageResponseHours: number | null;
  acceptanceRate: number;
  cancellationRate: number;
  disputeRate: number;
  negativeAuditEvents: number;
  profileCompleteness: number;
  approvedDocuments: number;
  expiredDocuments: number;
  rejectedDocuments: number;
}): TrustScore {
  const verificationPoints: Record<VerificationLevel, number> = {
    "Unverified": 0,
    "Basic Verified": 10,
    "Business Verified": 20,
    "Enterprise Verified": 25,
    "NGO Verified": 20,
    "Government Verified": 25,
  };
  const factors: TrustFactor[] = [
    trustFactor("verification", `${input.verificationLevel}`, verificationPoints[input.verificationLevel], "Verification level confirms organization identity and operating readiness."),
    trustFactor("transactions", "Completed Transactions", Math.min(18, input.completedTransactions * 3), `${input.completedTransactions} completed workflows.`),
    trustFactor("response", "Fast Response Time", input.averageResponseHours == null ? 0 : input.averageResponseHours <= 4 ? 10 : input.averageResponseHours <= 24 ? 6 : input.averageResponseHours <= 72 ? 3 : -4, input.averageResponseHours == null ? "No response history yet." : `${input.averageResponseHours} hour average response.`),
    trustFactor("acceptance", "Acceptance Rate", input.acceptanceRate >= 0.85 ? 10 : input.acceptanceRate >= 0.65 ? 6 : input.acceptanceRate >= 0.4 ? 2 : -6, `${Math.round(input.acceptanceRate * 100)}% accepted.`),
    trustFactor("cancellation", "Cancellation Rate", input.cancellationRate >= 0.3 ? -15 : input.cancellationRate >= 0.15 ? -8 : input.cancellationRate > 0 ? -3 : 5, `${Math.round(input.cancellationRate * 100)}% cancelled.`),
    trustFactor("disputes", "Dispute Rate", input.disputeRate >= 0.2 ? -15 : input.disputeRate > 0 ? -8 : 5, `${Math.round(input.disputeRate * 100)}% disputed.`),
    trustFactor("audit", "Audit Events", input.negativeAuditEvents > 3 ? -10 : input.negativeAuditEvents > 0 ? -4 : 4, `${input.negativeAuditEvents} negative audit events.`),
    trustFactor("profile", "Profile Completeness", Math.round(input.profileCompleteness * 10), `${Math.round(input.profileCompleteness * 100)}% complete.`),
    trustFactor("documents", "Document Status", Math.min(10, input.approvedDocuments * 2) - input.expiredDocuments * 8 - input.rejectedDocuments * 5, `${input.approvedDocuments} approved, ${input.expiredDocuments} expired, ${input.rejectedDocuments} rejected.`),
  ];
  const score = Math.max(0, Math.min(100, Math.round(factors.reduce((total, item) => total + item.points, 35))));
  return { score, level: trustLevelForScore(score), factors };
}

function trustScoreForAccount(account: CompanyProfile, requests: RequestRecord[], auditEvents: AuditEvent[]): TrustScore {
  const required = [
    account.legalName,
    account.tradeName,
    account.email,
    account.phone,
    account.address,
    account.businessActivity,
    account.authorizedPerson,
    account.authorizedRole,
    account.authorizedEmail,
    account.authorizedPhone,
  ];
  const completed = requests.filter((request) => request.status === "completed").length;
  const accepted = requests.filter((request) => request.status === "accepted" || request.status === "completed").length;
  const cancelled = requests.filter((request) => request.status === "cancelled").length;
  const totalRequests = Math.max(1, requests.length);
  const approvedDocuments = account.licenses.filter((license) => license.status === "Approved").length;
  const expiredDocuments = account.licenses.filter((license) => license.status === "Expired").length;
  const rejectedDocuments = account.licenses.filter((license) => license.status === "Rejected").length;
  const negativeAuditEvents = auditEvents.filter((event) => /rejected|expired|cancelled|reported|declined/i.test(event.action)).length;

  return calculateLocalTrustScore({
    verificationLevel: account.verificationLevel,
    completedTransactions: completed,
    averageResponseHours: requests.length ? 6 : 18,
    acceptanceRate: accepted / totalRequests,
    cancellationRate: cancelled / totalRequests,
    disputeRate: 0,
    negativeAuditEvents,
    profileCompleteness: required.filter(Boolean).length / required.length,
    approvedDocuments,
    expiredDocuments,
    rejectedDocuments,
  });
}

function demoTrustScenarios(): TrustScenario[] {
  return [
    {
      id: "top-enterprise",
      organization: "Emirates Circular Logistics",
      score: calculateLocalTrustScore({
        verificationLevel: "Enterprise Verified",
        completedTransactions: 12,
        averageResponseHours: 2,
        acceptanceRate: 0.94,
        cancellationRate: 0,
        disputeRate: 0,
        negativeAuditEvents: 0,
        profileCompleteness: 1,
        approvedDocuments: 6,
        expiredDocuments: 0,
        rejectedDocuments: 0,
      }),
      history: [{ label: "Current", score: 96, at: "Now" }, { label: "Previous", score: 91, at: "Last month" }],
    },
    {
      id: "verified-restaurant",
      organization: "Demo Restaurant Group",
      score: calculateLocalTrustScore({
        verificationLevel: "Business Verified",
        completedTransactions: 3,
        averageResponseHours: 6,
        acceptanceRate: 0.82,
        cancellationRate: 0.05,
        disputeRate: 0,
        negativeAuditEvents: 1,
        profileCompleteness: 1,
        approvedDocuments: 2,
        expiredDocuments: 1,
        rejectedDocuments: 1,
      }),
      history: [{ label: "Current", score: 72, at: "Now" }, { label: "Previous", score: 76, at: "Last review" }],
    },
    {
      id: "low-trust",
      organization: "Delayed Warehouse LLC",
      score: calculateLocalTrustScore({
        verificationLevel: "Basic Verified",
        completedTransactions: 1,
        averageResponseHours: 96,
        acceptanceRate: 0.35,
        cancellationRate: 0.4,
        disputeRate: 0.22,
        negativeAuditEvents: 5,
        profileCompleteness: 0.55,
        approvedDocuments: 1,
        expiredDocuments: 2,
        rejectedDocuments: 1,
      }),
      history: [{ label: "Current", score: 9, at: "Now" }, { label: "Previous", score: 31, at: "Last month" }],
    },
  ];
}

function numericPrice(price?: string) {
  if (!price) return null;
  const match = price.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function impactListingsFromWorkspace(listings: Listing[]) {
  return listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    category: listing.category,
    city: listing.city,
    quantityAvailable: listing.quantityAvailable,
    unit: listing.unit,
    unitPrice: numericPrice(listing.price),
    status: listing.status,
  }));
}

function impactRequestsFromWorkspace(requests: RequestRecord[]) {
  return requests.map((request) => ({
    id: request.id,
    listingId: request.listingId,
    quantity: request.quantity,
    status: request.status,
  }));
}

function simulatedImpactInputs() {
  const listings = [
    { id: "restaurant-meals", title: "Prepared chicken meals", category: "Food & Beverage", city: "Dubai Marina", unit: "meals", unitPrice: null, status: "completed" },
    { id: "hotel-chairs", title: "Gently used banquet chairs", category: "Furniture & Fixtures", city: "Abu Dhabi", unit: "chairs", unitPrice: null, status: "completed" },
    { id: "warehouse-pallets", title: "Reusable plastic pallets", category: "Warehouse Materials", city: "Jebel Ali", unit: "pallets", unitPrice: 12, status: "completed" },
    { id: "ngo-kits", title: "Hygiene kits", category: "Community Supplies", city: "Dubai", unit: "kits", unitPrice: null, status: "completed" },
  ];
  const requests = [
    { id: "restaurant-1", listingId: "restaurant-meals", quantity: 80, status: "completed" },
    { id: "restaurant-2", listingId: "restaurant-meals", quantity: 40, status: "completed" },
    { id: "hotel-1", listingId: "hotel-chairs", quantity: 20, status: "completed" },
    { id: "hotel-2", listingId: "hotel-chairs", quantity: 40, status: "completed" },
    { id: "warehouse-1", listingId: "warehouse-pallets", quantity: 500, status: "completed" },
    { id: "warehouse-2", listingId: "warehouse-pallets", quantity: 700, status: "completed" },
    { id: "ngo-1", listingId: "ngo-kits", quantity: 200, status: "completed" },
    { id: "ngo-2", listingId: "ngo-kits", quantity: 300, status: "completed" },
  ];

  return { listings, requests };
}

function demoPlatformImpact() {
  const platform = calculateImpactMetrics(simulatedImpactInputs());
  const organizations: ImpactLeaderboardItem[] = [
    {
      label: "Jebel Ali Logistics",
      sector: "Warehouse",
      city: "Jebel Ali",
      metrics: calculateImpactMetrics({
        listings: [{ id: "warehouse-pallets", title: "Reusable plastic pallets", category: "Warehouse Materials", city: "Jebel Ali", unit: "pallets", unitPrice: 12, status: "completed" }],
        requests: [
          { id: "warehouse-1", listingId: "warehouse-pallets", quantity: 500, status: "completed" },
          { id: "warehouse-2", listingId: "warehouse-pallets", quantity: 700, status: "completed" },
        ],
      }),
    },
    {
      label: "Dubai Community NGO",
      sector: "NGO",
      city: "Dubai",
      metrics: calculateImpactMetrics({
        listings: [{ id: "ngo-kits", title: "Hygiene kits", category: "Community Supplies", city: "Dubai", unit: "kits", unitPrice: null, status: "completed" }],
        requests: [
          { id: "ngo-1", listingId: "ngo-kits", quantity: 200, status: "completed" },
          { id: "ngo-2", listingId: "ngo-kits", quantity: 300, status: "completed" },
        ],
      }),
    },
    {
      label: "Abu Dhabi Hotel Group",
      sector: "Hotel",
      city: "Abu Dhabi",
      metrics: calculateImpactMetrics({
        listings: [{ id: "hotel-chairs", title: "Gently used banquet chairs", category: "Furniture & Fixtures", city: "Abu Dhabi", unit: "chairs", unitPrice: null, status: "completed" }],
        requests: [
          { id: "hotel-1", listingId: "hotel-chairs", quantity: 20, status: "completed" },
          { id: "hotel-2", listingId: "hotel-chairs", quantity: 40, status: "completed" },
        ],
      }),
    },
    {
      label: "Dubai Marina Restaurant",
      sector: "Restaurant",
      city: "Dubai Marina",
      metrics: calculateImpactMetrics({
        listings: [{ id: "restaurant-meals", title: "Prepared chicken meals", category: "Food & Beverage", city: "Dubai Marina", unit: "meals", unitPrice: null, status: "completed" }],
        requests: [
          { id: "restaurant-1", listingId: "restaurant-meals", quantity: 80, status: "completed" },
          { id: "restaurant-2", listingId: "restaurant-meals", quantity: 40, status: "completed" },
        ],
      }),
    },
  ].sort((a, b) => b.metrics.aed_recovered - a.metrics.aed_recovered);

  const trends: ImpactTrend[] = [
    { label: "Apr", aed: Math.round(platform.aed_recovered * 0.32), waste: Math.round(platform.waste_prevented_kg * 0.28), transactions: 3 },
    { label: "May", aed: Math.round(platform.aed_recovered * 0.58), waste: Math.round(platform.waste_prevented_kg * 0.52), transactions: 5 },
    { label: "Jun", aed: platform.aed_recovered, waste: platform.waste_prevented_kg, transactions: platform.completed_transactions },
  ];

  return { platform, organizations, trends };
}

function pilotReadinessPercent(organization: PilotOrganization) {
  const steps = [
    organization.invited,
    organization.registrationCompleted,
    organization.verificationSubmitted,
    organization.verificationApproved,
    organization.firstListingCreated,
    organization.firstRequestCreated,
    organization.firstTransactionCompleted,
  ];

  return Math.round((steps.filter(Boolean).length / steps.length) * 100);
}

function pilotKpis(organizations: PilotOrganization[], feedback: PilotFeedback[]) {
  const activeOrganizations = organizations.filter((organization) => organization.status === "active").length;
  const verificationComplete = organizations.filter((organization) => organization.verificationApproved).length;
  const openIssues = feedback.filter((item) => item.status !== "Resolved").length;
  const criticalIssues = feedback.filter((item) => item.priority === "Critical" && item.status !== "Resolved").length;

  return {
    pilotOrganizations: organizations.length,
    activeOrganizations,
    listingsCreated: organizations.reduce((total, organization) => total + organization.listingsCreated, 0),
    requestsCreated: organizations.reduce((total, organization) => total + organization.requestsCreated, 0),
    transactionsCompleted: organizations.reduce((total, organization) => total + organization.transactionsCompleted, 0),
    verificationCompletion: Math.round((verificationComplete / Math.max(organizations.length, 1)) * 100),
    feedbackSubmitted: feedback.length,
    openIssues,
    resolvedIssues: feedback.filter((item) => item.status === "Resolved").length,
    criticalIssues,
  };
}

function mergeCategories(savedCategories?: Category[]) {
  if (!savedCategories?.length) return uaeStarterCategories;

  return savedCategories.map((category) => {
    const starter = uaeStarterCategories.find((item) => item.id === category.id);
    return {
      ...category,
      subcategories: category.subcategories?.length ? category.subcategories : starter?.subcategories ?? ["General"],
    };
  });
}

export function Workspace() {
  const [state, setState] = useWorkspaceState();
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem(languageStorageKey);
    return stored === "ar" || stored === "en" ? stored : "en";
  });
  const [section, setSection] = useState<Section>("dashboard");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("All");
  const [offerType, setOfferType] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [handoverFilter, setHandoverFilter] = useState("All");
  const [selectedListingId, setSelectedListingId] = useState(state.listings[0]?.id ?? "");
  const [requestQuantity, setRequestQuantity] = useState(10);
  const [requestMessage, setRequestMessage] = useState("We can collect today between 4-6 PM.");
  const [messageDraft, setMessageDraft] = useState("Confirmed, our team can bring insulated boxes.");
  const dir = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.body.dataset.locale = locale;
    document.body.dataset.dir = dir;
    window.localStorage.setItem(languageStorageKey, locale);
  }, [dir, locale]);

  const localization = useMemo<LocalizationContextValue>(() => ({
    locale,
    dir,
    setLocale: setLocaleState,
    t: (value) => translateText(locale, value),
    n: (value) => value.toLocaleString(locale === "ar" ? "ar-AE" : "en-US"),
    money: (value) => new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(Math.round(value)),
    date: (value) => new Date(value).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }), [dir, locale]);

  const selectedListing = state.listings.find((listing) => listing.id === selectedListingId) ?? state.listings[0];
  const orderedCategories = [...state.categories].sort((a, b) => a.order - b.order);
  const visibleCategories = orderedCategories.filter((item) => !item.hidden && !item.restricted);
  const categories = ["All", ...visibleCategories.map((item) => item.name)];
  const visibleSubcategories =
    category === "All"
      ? ["All"]
      : ["All", ...(visibleCategories.find((item) => item.name === category)?.subcategories ?? [])];
  const offers = ["All", "Free", "For sale", "Exchange"];
  const publishedListings = state.listings.filter((listing) => listing.status === "published");
  const discoverCities = ["All", ...Array.from(new Set(publishedListings.map((listing) => listing.city)))];
  const discoverHandoverMethods = ["All", ...Array.from(new Set(publishedListings.flatMap((listing) => listing.handoverMethods)))];
  const openRequests = state.requests.filter((request) => request.status === "pending" || request.status === "accepted");
  const unreadNotifications = state.notifications.filter((notification) => !notification.read).length;
  const openReports = state.reports.filter((report) => report.status !== "resolved").length;
  const pendingVerificationReviews = state.account.licenses.filter((license) => license.status === "Pending Review").length;
  const expiringVerificationDocuments = state.account.licenses.filter((license) => {
    const status = expiryStatus(license.expiryDate);
    return status.urgent || license.status === "Expired";
  }).length;
  const trustScore = trustScoreForAccount(state.account, state.requests, state.auditEvents);
  const trustScenarios = demoTrustScenarios();

  const filteredListings = state.listings.filter((listing) => {
    const matchesQuery =
      !query ||
      listing.title.toLowerCase().includes(query.toLowerCase()) ||
      listing.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || listing.category === category;
    const matchesSubcategory = subcategory === "All" || listing.subcategory === subcategory;
    const matchesOffer = offerType === "All" || listing.offerType === offerType;
    const matchesCity = cityFilter === "All" || listing.city === cityFilter;
    const matchesUrgency =
      urgencyFilter === "All" ||
      (urgencyFilter === "Urgent" && expiryStatus(listing.expiryDate).urgent) ||
      (urgencyFilter === "Standard" && !expiryStatus(listing.expiryDate).urgent);
    const matchesHandover = handoverFilter === "All" || listing.handoverMethods.includes(handoverFilter as HandoverMethod);

    const categoryRecord = state.categories.find((item) => item.name === listing.category);
    const categoryVisible = !categoryRecord || (!categoryRecord.hidden && !categoryRecord.restricted);

    return listing.status === "published" && categoryVisible && matchesQuery && matchesCategory && matchesSubcategory && matchesOffer && matchesCity && matchesUrgency && matchesHandover;
  });
  const selectedDiscoverListing = filteredListings.find((listing) => listing.id === selectedListing.id) ?? filteredListings[0] ?? selectedListing;

  const selectedRequest = state.requests.find((request) => request.status !== "completed") ?? state.requests[0];
  const selectedConversation = selectedRequest
    ? state.conversations.find((conversation) => conversation.requestId === selectedRequest.id)
    : undefined;

  const impact = useMemo(
    () => calculateImpactMetrics({
      listings: impactListingsFromWorkspace(state.listings),
      requests: impactRequestsFromWorkspace(state.requests),
    }),
    [state.listings, state.requests],
  );
  const platformImpact = useMemo(() => demoPlatformImpact(), []);
  const organizationImpact = impact.completed_transactions > 0
    ? impact
    : platformImpact.organizations[3].metrics;
  const organizationImpactTrends: ImpactTrend[] = [
    { label: "Apr", aed: Math.round(organizationImpact.aed_recovered * 0.35), waste: Math.round(organizationImpact.waste_prevented_kg * 0.31), transactions: Math.max(1, organizationImpact.completed_transactions - 1) },
    { label: "May", aed: Math.round(organizationImpact.aed_recovered * 0.68), waste: Math.round(organizationImpact.waste_prevented_kg * 0.63), transactions: Math.max(1, organizationImpact.completed_transactions) },
    { label: "Jun", aed: organizationImpact.aed_recovered, waste: organizationImpact.waste_prevented_kg, transactions: organizationImpact.completed_transactions },
  ];

  function addNotification(title: string, body: string) {
    setState((current) => ({
      ...current,
      notifications: [{ id: shortId("note"), title, body, read: false }, ...current.notifications],
    }));
  }

  function updateOrganization(formData: FormData) {
    const organization = String(formData.get("organization") || state.organization);
    const city = String(formData.get("city") || state.city);
    setState((current) => ({
      ...current,
      organization,
      city,
      auditEvents: [audit("organization.updated", "Owner admin", `${organization} updated for ${city}.`), ...current.auditEvents],
    }));
    addNotification("Organization updated", `${organization} is ready in ${city}.`);
  }

  function signUpCompany(formData: FormData) {
    const legalName = String(formData.get("legalName") || "").trim();
    const tradeName = String(formData.get("tradeName") || legalName).trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const licenseNumber = String(formData.get("licenseNumber") || "").trim();
    const issuingAuthority = String(formData.get("issuingAuthority") || "").trim();
    const licenseExpiry = String(formData.get("licenseExpiry") || "").trim();
    if (!legalName || !email || !password || !phone || !licenseNumber || !issuingAuthority || !licenseExpiry) return;

    const account: CompanyProfile = {
      ...initialAccount,
      signedIn: true,
      accountType: String(formData.get("accountType") || "Supplier") as AccountType,
      legalName,
      tradeName,
      email,
      phone,
      passwordHint: password,
      emirate: String(formData.get("emirate") || "Dubai"),
      city: String(formData.get("city") || "Dubai"),
      address: String(formData.get("address") || ""),
      businessCategory: String(formData.get("businessCategory") || dubaiBusinessCategories[0].name),
      businessSubcategory: String(formData.get("businessSubcategory") || dubaiBusinessCategories[0].subcategories[0]),
      businessActivity: String(formData.get("businessActivity") || ""),
      trn: String(formData.get("trn") || ""),
      authorizedPerson: String(formData.get("authorizedPerson") || ""),
      authorizedRole: String(formData.get("authorizedRole") || ""),
      authorizedEmail: String(formData.get("authorizedEmail") || email),
      authorizedPhone: String(formData.get("authorizedPhone") || phone),
      verificationLevel: "Unverified",
      verificationStatus: "Pending review",
      verificationNotes: "Company profile created locally and queued for verification review.",
      licenses: [
        {
          id: shortId("lic"),
          licenseType: String(formData.get("licenseType") || "Trade License"),
          number: licenseNumber,
          issuingAuthority,
          issueDate: String(formData.get("licenseIssueDate") || ""),
          expiryDate: licenseExpiry,
          documentName: String(formData.get("licenseDocument") || "License document pending upload"),
          status: "Pending Review",
        },
      ],
      documents: formData.getAll("documents").map(String),
    };

    setState((current) => ({
      ...current,
      account,
      organization: tradeName,
      city: account.city,
      auditEvents: [audit("account.signup", tradeName, `${account.accountType} account created for ${legalName}.`), ...current.auditEvents],
    }));
    setSection("dashboard");
    addNotification("Account created", `${tradeName} is signed in and pending verification.`);
  }

  function signInCompany(formData: FormData) {
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    if (!email || !password) return;

    setState((current) => ({
      ...current,
      account: {
        ...current.account,
        signedIn: true,
        email,
        passwordHint: password,
      },
      auditEvents: [audit("account.signin", current.account.tradeName, `${email} signed in locally.`), ...current.auditEvents],
    }));
    setSection("dashboard");
    addNotification("Signed in", `${email} is active in the local preview.`);
  }

  function signOutCompany() {
    setState((current) => ({
      ...current,
      account: { ...current.account, signedIn: false },
      auditEvents: [audit("account.signout", current.account.tradeName, "Company account signed out locally."), ...current.auditEvents],
    }));
    setSection("account");
  }

  function updateCompanyProfile(formData: FormData) {
    const legalName = String(formData.get("legalName") || "").trim();
    const tradeName = String(formData.get("tradeName") || legalName).trim();
    if (!legalName || !tradeName) return;

    setState((current) => ({
      ...current,
      organization: tradeName,
      city: String(formData.get("city") || current.city),
      account: {
        ...current.account,
        accountType: String(formData.get("accountType") || current.account.accountType) as AccountType,
        legalName,
        tradeName,
        email: String(formData.get("email") || current.account.email),
        phone: String(formData.get("phone") || current.account.phone),
        website: String(formData.get("website") || ""),
        emirate: String(formData.get("emirate") || current.account.emirate),
        city: String(formData.get("city") || current.account.city),
        address: String(formData.get("address") || ""),
        businessCategory: String(formData.get("businessCategory") || current.account.businessCategory),
        businessSubcategory: String(formData.get("businessSubcategory") || current.account.businessSubcategory),
        businessActivity: String(formData.get("businessActivity") || ""),
        trn: String(formData.get("trn") || ""),
        authorizedPerson: String(formData.get("authorizedPerson") || ""),
        authorizedRole: String(formData.get("authorizedRole") || ""),
        authorizedEmail: String(formData.get("authorizedEmail") || ""),
        authorizedPhone: String(formData.get("authorizedPhone") || ""),
        verificationStatus: current.account.verificationStatus === "Verified" ? "Pending review" : current.account.verificationStatus,
        verificationNotes: "Profile updated locally. Submit verification again after document changes.",
        documents: formData.getAll("documents").map(String),
      },
      auditEvents: [audit("profile.updated", tradeName, `${legalName} profile details updated.`), ...current.auditEvents],
    }));
    addNotification("Profile updated", `${tradeName} verification profile was updated.`);
  }

  function addLicenseRecord(formData: FormData) {
    const licenseType = String(formData.get("licenseType") || "").trim();
    const number = String(formData.get("number") || "").trim();
    const issuingAuthority = String(formData.get("issuingAuthority") || "").trim();
    const expiryDate = String(formData.get("expiryDate") || "").trim();
    if (!licenseType || !number || !issuingAuthority || !expiryDate) return;

    const file = formData.get("documentFile");
    const documentName = file instanceof File && file.name ? file.name : String(formData.get("documentName") || "Document pending upload");
    const license: LicenseRecord = {
      id: shortId("lic"),
      licenseType,
      number,
      issuingAuthority,
      issueDate: String(formData.get("issueDate") || ""),
      expiryDate,
      documentName,
      status: "Pending Review",
    };

    setState((current) => ({
      ...current,
      account: {
        ...current.account,
        verificationStatus: "Pending review",
        licenses: [license, ...current.account.licenses],
        documents: current.account.documents.includes(licenseType)
          ? current.account.documents
          : [licenseType, ...current.account.documents],
      },
      auditEvents: [audit("license.added", current.account.tradeName, `${licenseType} ${number} added for review.`), ...current.auditEvents],
    }));
    addNotification("License added", `${licenseType} is pending verification review.`);
  }

  function submitVerification() {
    setState((current) => ({
      ...current,
      account: {
        ...current.account,
        verificationStatus: "Pending review",
        verificationNotes: "Submitted locally. Production flow will route this to admin review with document storage.",
      },
      auditEvents: [audit("verification.submitted", current.account.tradeName, "Company verification package submitted."), ...current.auditEvents],
    }));
    addNotification("Verification submitted", "Company profile and licenses are ready for admin review.");
  }

  function chooseCategory(value: string) {
    setCategory(value);
    setSubcategory("All");
  }

  function publishListing(formData: FormData) {
    const quantity = Number(formData.get("quantity"));
    const title = String(formData.get("title") || "Untitled item");
    const fallbackCategory = visibleCategories[0]?.name ?? "Food and beverage";
    const categoryName = String(formData.get("category") || fallbackCategory);
    const categoryRecord = visibleCategories.find((item) => item.name === categoryName);
    const subcategoryName = String(formData.get("subcategory") || categoryRecord?.subcategories[0] || "General");
    const city = String(formData.get("city") || state.city);
    const area = String(formData.get("area") || state.locations.find((location) => location.emirate === city)?.area || "Central");
    const handoverMethods = formData.getAll("handoverMethods").map(String) as HandoverMethod[];
    const linkedGroup = state.groups.find((group) => group.category === categoryName);
    const listing: Listing = {
      id: shortId("listing"),
      title,
      category: categoryName,
      subcategory: subcategoryName,
      offerType: String(formData.get("offerType") || "Free") as Listing["offerType"],
      reason: String(formData.get("reason") || "Excess stock") as Listing["reason"],
      city,
      area,
      handoverMethods: handoverMethods.length ? handoverMethods : ["Pickup"],
      quantityTotal: quantity,
      quantityAvailable: quantity,
      unit: String(formData.get("unit") || "units"),
      owner: state.organization,
      description: String(formData.get("description") || "Available for pickup after owner approval."),
      expiryDate: String(formData.get("expiryDate") || "") || undefined,
      status: "published",
      saved: false,
      groupIds: linkedGroup ? [linkedGroup.id] : [],
    };

    setState((current) => ({
      ...current,
      listings: [listing, ...current.listings],
      auditEvents: [audit("listing.published", state.organization, `${title} published in ${city} / ${area}.`), ...current.auditEvents],
    }));
    setSelectedListingId(listing.id);
    setSection("discover");
    addNotification("Listing published", `${title} is now discoverable in ${city}.`);
  }

  function toggleSave(listingId: string) {
    setState((current) => ({
      ...current,
      listings: current.listings.map((listing) =>
        listing.id === listingId ? { ...listing, saved: !listing.saved } : listing,
      ),
    }));
  }

  function saveSearch() {
    const scope = [category === "All" ? "All categories" : category, subcategory === "All" ? "" : subcategory]
      .filter(Boolean)
      .join(" / ");
    const label = `${scope}${query ? ` matching "${query}"` : ""}`;
    setState((current) => ({
      ...current,
      savedSearches: current.savedSearches.includes(label) ? current.savedSearches : [label, ...current.savedSearches],
    }));
    addNotification("Search saved", label);
  }

  function submitRequest() {
    if (!selectedListing || requestQuantity < 1 || requestQuantity > selectedListing.quantityAvailable) return;

    const request: RequestRecord = {
      id: shortId("request"),
      listingId: selectedListing.id,
      quantity: requestQuantity,
      message: requestMessage,
      handoverMethod: selectedListing.handoverMethods[0] ?? "Pickup",
      status: "pending",
      receiverOrganization: "Dubai Community NGO",
      timeline: ["Request submitted"],
    };

    const conversation: Conversation = {
      id: shortId("conversation"),
      requestId: request.id,
      messages: [
        {
          id: shortId("message"),
          sender: "Requester",
          body: requestMessage,
          at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    setState((current) => ({
      ...current,
      requests: [request, ...current.requests],
      conversations: [conversation, ...current.conversations],
      auditEvents: [audit("request.submitted", "Requester", `${request.quantity} ${selectedListing.unit} requested from ${selectedListing.title}.`), ...current.auditEvents],
    }));
    setSection("requests");
    addNotification("Request received", `${request.quantity} ${selectedListing.unit} requested from ${selectedListing.title}.`);
  }

  function acceptRequest(requestId: string) {
    const target = state.requests.find((request) => request.id === requestId);
    if (!target) return;

    const listing = state.listings.find((item) => item.id === target.listingId);
    if (!listing || target.quantity > listing.quantityAvailable) return;

    setState((current) => ({
      ...current,
      requests: current.requests.map((request) =>
        request.id === requestId
          ? { ...request, status: "accepted", timeline: [...request.timeline, "Owner accepted and reserved quantity"] }
          : request,
      ),
      listings: current.listings.map((item) =>
        item.id === target.listingId
          ? {
              ...item,
              quantityAvailable: item.quantityAvailable - target.quantity,
              status: item.quantityAvailable - target.quantity === 0 ? "reserved" : item.status,
            }
          : item,
      ),
      auditEvents: [audit("request.accepted", state.organization, `${target.quantity} ${listing.unit} reserved from ${listing.title}.`), ...current.auditEvents],
    }));
    addNotification("Quantity reserved", `${target.quantity} ${listing.unit} reserved for handover.`);
  }

  function declineRequest(requestId: string) {
    setState((current) => ({
      ...current,
      requests: current.requests.map((request) =>
        request.id === requestId ? { ...request, status: "declined", timeline: [...request.timeline, "Owner declined request"] } : request,
      ),
      auditEvents: [audit("request.declined", "Owner admin", `Request ${requestId} declined.`), ...current.auditEvents],
    }));
    addNotification("Request declined", "The requester was notified in the local preview.");
  }

  function completeRequest(requestId: string) {
    setState((current) => {
      const target = current.requests.find((request) => request.id === requestId);
      const listing = target ? current.listings.find((item) => item.id === target.listingId) : undefined;
      const alreadyIssued = current.certificates.some((certificate) => certificate.transaction_id === `txn-${requestId}`);
      const certificate = target && listing && !alreadyIssued
        ? buildTransferCertificate({
            account: current.account,
            organization: current.organization,
            listing,
            request: { ...target, status: "completed" },
            trustScore: trustScoreForAccount(current.account, current.requests, current.auditEvents),
            sequence: current.certificates.length + 1,
          })
        : null;

      return {
        ...current,
        requests: current.requests.map((request) =>
          request.id === requestId ? { ...request, status: "completed", timeline: [...request.timeline, "Handover completed", "Transfer certificate issued"] } : request,
        ),
        certificates: certificate ? [certificate, ...current.certificates] : current.certificates,
        auditEvents: [
          ...(certificate ? [audit("certificate.issued", "System", `${certificate.certificate_number} issued for ${certificate.item_name}.`)] : []),
          audit("handover.completed", "Owner admin", `Request ${requestId} completed.`),
          ...current.auditEvents,
        ],
      };
    });
    addNotification("Transfer certificate issued", "Handover completed and QR-verifiable certificate generated.");
  }

  function sendMessage() {
    if (!selectedConversation || !messageDraft.trim()) return;

    setState((current) => ({
      ...current,
      conversations: current.conversations.map((conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              messages: [
                ...conversation.messages,
                {
                  id: shortId("message"),
                  sender: "Owner",
                  body: messageDraft.trim(),
                  at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ],
            }
          : conversation,
      ),
      auditEvents: [audit("message.sent", "Owner admin", "Conversation reply sent."), ...current.auditEvents],
    }));
    setMessageDraft("");
    addNotification("Message sent", "Conversation updated in the local preview.");
  }

  function toggleFollowGroup(groupId: string) {
    setState((current) => ({
      ...current,
      groups: current.groups.map((group) =>
        group.id === groupId ? { ...group, following: !group.following, members: group.members + (group.following ? -1 : 1) } : group,
      ),
      auditEvents: [audit("group.follow.changed", "Member", `Follow setting changed for ${groupId}.`), ...current.auditEvents],
    }));
  }

  function moveCategory(categoryId: string, direction: -1 | 1) {
    setState((current) => {
      const ordered = [...current.categories].sort((a, b) => a.order - b.order);
      const index = ordered.findIndex((item) => item.id === categoryId);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return current;

      const currentCategory = ordered[index];
      const targetCategory = ordered[targetIndex];
      return {
        ...current,
        categories: current.categories.map((item) => {
          if (item.id === currentCategory.id) return { ...item, order: targetCategory.order };
          if (item.id === targetCategory.id) return { ...item, order: currentCategory.order };
          return item;
        }),
        auditEvents: [audit("category.reordered", "Owner admin", `${currentCategory.name} moved ${direction === -1 ? "up" : "down"}.`), ...current.auditEvents],
      };
    });
  }

  function toggleCategoryHidden(categoryId: string) {
    setState((current) => ({
      ...current,
      categories: current.categories.map((item) =>
        item.id === categoryId ? { ...item, hidden: !item.hidden } : item,
      ),
      auditEvents: [audit("category.visibility.changed", "Owner admin", `Visibility changed for ${categoryId}.`), ...current.auditEvents],
    }));
  }

  function addSubcategory(categoryId: string, formData: FormData) {
    const name = String(formData.get("subcategory") || "").trim();
    if (!name) return;

    setState((current) => ({
      ...current,
      categories: current.categories.map((item) =>
        item.id === categoryId || item.name === categoryId
          ? {
              ...item,
              subcategories: item.subcategories.includes(name)
                ? item.subcategories
                : [...item.subcategories, name],
            }
          : item,
      ),
      auditEvents: [audit("subcategory.added", "Owner admin", `${name} added.`), ...current.auditEvents],
    }));
    addNotification("Subcategory added", name);
  }

  function removeSubcategory(categoryId: string, subcategoryName: string) {
    setState((current) => ({
      ...current,
      categories: current.categories.map((item) =>
        item.id === categoryId
          ? {
              ...item,
              subcategories: item.subcategories.filter((subcategory) => subcategory !== subcategoryName),
            }
          : item,
      ),
      auditEvents: [audit("subcategory.removed", "Owner admin", `${subcategoryName} removed.`), ...current.auditEvents],
    }));
  }

  function resetCategories() {
    setState((current) => ({
      ...current,
      categories: uaeStarterCategories,
      auditEvents: [audit("categories.reset", "Owner admin", "UAE starter category list restored."), ...current.auditEvents],
    }));
    addNotification("Categories reset", "UAE starter category order and visibility restored.");
  }

  function addLocation(formData: FormData) {
    const label = String(formData.get("label") || "").trim();
    const emirate = String(formData.get("emirate") || "").trim();
    const area = String(formData.get("area") || "").trim();
    if (!label || !emirate || !area) return;

    setState((current) => ({
      ...current,
      locations: [{ id: shortId("loc"), label, emirate, area }, ...current.locations],
      auditEvents: [audit("location.added", "Owner admin", `${label} added in ${emirate} / ${area}.`), ...current.auditEvents],
    }));
    addNotification("Location added", `${label} is now available for publishing.`);
  }

  function inviteTeamMember(formData: FormData) {
    const name = String(formData.get("name") || "").trim();
    const role = String(formData.get("role") || "Inventory manager") as TeamMember["role"];
    if (!name) return;

    setState((current) => ({
      ...current,
      team: [{ id: shortId("member"), name, role, status: "invited" }, ...current.team],
      auditEvents: [audit("team.invited", "Owner admin", `${name} invited as ${role}.`), ...current.auditEvents],
    }));
    addNotification("Team invite created", `${name} added to local team preview.`);
  }

  function reportListing(listingId: string) {
    const listing = state.listings.find((item) => item.id === listingId);
    if (!listing) return;

    setState((current) => ({
      ...current,
      reports: [
        { id: shortId("report"), listingId, reason: "Needs moderator review", status: "open" },
        ...current.reports,
      ],
      auditEvents: [audit("report.created", "Member", `${listing.title} reported.`), ...current.auditEvents],
    }));
    addNotification("Report submitted", `${listing.title} was added to moderation review.`);
    setSection("moderation");
  }

  function resolveReport(reportId: string) {
    setState((current) => ({
      ...current,
      reports: current.reports.map((report) => (report.id === reportId ? { ...report, status: "resolved" } : report)),
      auditEvents: [audit("report.resolved", "Moderator", `Report ${reportId} resolved.`), ...current.auditEvents],
    }));
  }

  function submitPilotFeedback(formData: FormData) {
    const title = String(formData.get("title") || "").trim();
    const detail = String(formData.get("detail") || "").trim();
    if (!title || !detail) return;

    const feedback: PilotFeedback = {
      id: shortId("pilot-feedback"),
      organization: String(formData.get("organization") || state.organization),
      type: String(formData.get("type") || "Suggestion") as PilotFeedback["type"],
      priority: String(formData.get("priority") || "Medium") as PilotFeedback["priority"],
      category: String(formData.get("category") || "Onboarding") as PilotFeedback["category"],
      status: "Open",
      title,
      detail,
      createdAt: new Date().toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" }),
    };

    setState((current) => ({
      ...current,
      pilotFeedback: [feedback, ...current.pilotFeedback],
      auditEvents: [audit("pilot.feedback.created", feedback.organization, `${feedback.priority} ${feedback.type}: ${feedback.title}`), ...current.auditEvents],
    }));
    addNotification("Pilot feedback submitted", `${feedback.title} added to founder monitoring.`);
  }

  function updatePilotFeedbackStatus(feedbackId: string, status: PilotFeedback["status"]) {
    setState((current) => ({
      ...current,
      pilotFeedback: current.pilotFeedback.map((feedback) =>
        feedback.id === feedbackId ? { ...feedback, status } : feedback,
      ),
      auditEvents: [audit("pilot.feedback.updated", "Founder", `Pilot feedback ${feedbackId} marked ${status}.`), ...current.auditEvents],
    }));
  }

  function markNotificationsRead() {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((notification) => ({ ...notification, read: true })),
    }));
  }

  function resetLocalPreview() {
    window.localStorage.removeItem(storageKey);
    setState(initialState);
    setSelectedListingId(initialState.listings[0].id);
    setSection("dashboard");
  }

  const primaryNavItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "discover", label: "Discover", icon: Search, count: publishedListings.length },
    { id: "requests", label: "Requests", icon: Handshake, count: openRequests.length },
    { id: "transfers", label: "Transfers", icon: CheckCircle2, count: state.requests.filter((request) => request.status === "accepted" || request.status === "completed").length },
    { id: "impact", label: "Impact", icon: BarChart3 },
  ];
  const secondaryNavGroups: NavGroup[] = [
    {
      title: "Supplier tools",
      description: "For teams with surplus inventory to publish and manage.",
      items: [
        { id: "publish", label: "Listings", icon: PackagePlus },
        { id: "categories", label: "Categories", icon: Filter, count: visibleCategories.length },
      ],
    },
    {
      title: "Recipient tools",
      description: "Saved searches, request messages, and alerts.",
      items: [
        { id: "messages", label: "Request messages", icon: MessageSquare, count: state.conversations.length },
        { id: "groups", label: "Resource groups", icon: Users, count: state.groups.filter((group) => group.following).length },
        { id: "notifications", label: "Alerts", icon: Bell, count: unreadNotifications },
      ],
    },
    {
      title: "Operations admin",
      description: "Verification, platform controls, proof, and reporting.",
      items: [
        { id: "pilot", label: "Pilot monitoring", icon: Globe2, count: pilotKpis(pilotOrganizations, state.pilotFeedback).openIssues },
        { id: "verification", label: "Verification", icon: ShieldCheck, count: pendingVerificationReviews },
        { id: "documents", label: "Documents", icon: FileText, count: expiringVerificationDocuments },
        { id: "certificates", label: "Certificates", icon: QrCode, count: state.certificates.length },
        { id: "verificationAdmin", label: "Administration", icon: ClipboardList, count: pendingVerificationReviews },
        { id: "trustAdmin", label: "Trust overview", icon: Award },
        { id: "impactAdmin", label: "Platform impact", icon: TrendingUp },
        { id: "moderation", label: "Moderation", icon: Flag, count: openReports },
      ],
    },
    {
      title: "Workspace settings",
      description: "Company access, organization profile, and local preferences.",
      items: [
        { id: "organization", label: "Organizations", icon: Building2 },
        { id: "account", label: "Account", icon: state.account.signedIn ? Building2 : LogIn },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  function renderNavItem(item: NavItem) {
    return (
      <button
        className={section === item.id ? "workspace-nav-item active" : "workspace-nav-item"}
        key={item.id}
        onClick={() => setSection(item.id)}
        aria-current={section === item.id ? "page" : undefined}
        type="button"
      >
        <item.icon size={18} />
        <span>{localization.t(item.label)}</span>
        {item.count ? <em>{localization.n(item.count)}</em> : null}
      </button>
    );
  }

  return (
    <LocalizationContext.Provider value={localization}>
    <div className={`workspace-layout ${dir === "rtl" ? "rtl" : "ltr"}`} dir={dir} lang={locale}>
      <aside className="workspace-nav" aria-label="Workspace sections">
        <div className="workspace-brand">
          <span className="proto-mark">RD</span>
          <div>
            <strong>ReDist</strong>
            <small>{state.account.signedIn ? state.account.tradeName : localization.t("Sign in required")}</small>
          </div>
        </div>
        <LanguageSwitcher />
        <div className="workspace-nav-group primary">
          <div className="workspace-nav-group-label">
            <span>{localization.t("Daily workflow")}</span>
            <small>{localization.t("Find available resources, submit requests, and close handovers.")}</small>
          </div>
          {primaryNavItems.map(renderNavItem)}
        </div>
        <div className="workspace-nav-secondary" aria-label={localization.t("Secondary workspace sections")}>
          {secondaryNavGroups.map((group) => (
            <div className="workspace-nav-group" key={group.title}>
              <div className="workspace-nav-group-label">
                <span>{localization.t(group.title)}</span>
                <small>{localization.t(group.description)}</small>
              </div>
              {group.items.map(renderNavItem)}
            </div>
          ))}
        </div>
        <button className="reset-button" onClick={resetLocalPreview} type="button">{localization.t("Reset local preview")}</button>
      </aside>

      <div className="workspace-content">
        {section === "account" && (
          <AccountSection
            account={state.account}
            signInCompany={signInCompany}
            signUpCompany={signUpCompany}
            signOutCompany={signOutCompany}
          />
        )}

        {section === "dashboard" && (
          <DashboardSection
            impact={impact}
            openRequests={openRequests.length}
            publishedListings={publishedListings.length}
            organization={state.organization}
            city={state.city}
            savedCount={state.listings.filter((listing) => listing.saved).length}
            reports={openReports}
            auditEvents={state.auditEvents}
            account={state.account}
            listings={state.listings}
            requests={state.requests}
            notifications={state.notifications}
            trustScore={trustScore}
            updateOrganization={updateOrganization}
            navigateTo={setSection}
          />
        )}

        {section === "discover" && (
          <DiscoverSection
            categories={categories}
            category={category}
            subcategories={visibleSubcategories}
            subcategory={subcategory}
            filteredListings={filteredListings}
            offerType={offerType}
            offers={offers}
            cities={discoverCities}
            cityFilter={cityFilter}
            setCityFilter={setCityFilter}
            urgencyFilter={urgencyFilter}
            setUrgencyFilter={setUrgencyFilter}
            handoverMethods={discoverHandoverMethods}
            handoverFilter={handoverFilter}
            setHandoverFilter={setHandoverFilter}
            query={query}
            requestMessage={requestMessage}
            requestQuantity={requestQuantity}
            selectedListing={selectedDiscoverListing}
            setCategory={chooseCategory}
            setSubcategory={setSubcategory}
            setOfferType={setOfferType}
            setQuery={setQuery}
            setRequestMessage={setRequestMessage}
            setRequestQuantity={setRequestQuantity}
            setSelectedListingId={setSelectedListingId}
            submitRequest={submitRequest}
            toggleSave={toggleSave}
            saveSearch={saveSearch}
            reportListing={reportListing}
            account={state.account}
            trustScore={trustScore}
          />
        )}

        {section === "pilot" && (
          <PilotWorkspaceSection
            organizations={pilotOrganizations}
            feedback={state.pilotFeedback}
            impact={platformImpact.platform}
            submitPilotFeedback={submitPilotFeedback}
            updatePilotFeedbackStatus={updatePilotFeedbackStatus}
          />
        )}

        {section === "publish" && (
          <PublishSection
            categories={visibleCategories}
            city={state.city}
            locations={state.locations}
            publishListing={publishListing}
          />
        )}

        {section === "impact" && (
          <ImpactDashboardSection
            account={state.account}
            organization={state.organization}
            city={state.city}
            metrics={organizationImpact}
            trends={organizationImpactTrends}
            trustScore={trustScore}
            certificates={state.certificates}
            listings={state.listings}
            requests={state.requests}
          />
        )}

        {section === "transfers" && (
          <TransfersSection
            listings={state.listings}
            requests={state.requests}
            certificates={state.certificates}
            completeRequest={completeRequest}
          />
        )}

        {section === "verification" && (
          <VerificationDashboardSection account={state.account} auditEvents={state.auditEvents} submitVerification={submitVerification} trustScore={trustScore} />
        )}

        {section === "documents" && (
          <VerificationDocumentsSection account={state.account} addLicenseRecord={addLicenseRecord} />
        )}

        {section === "organization" && (
          <OrganizationProfileSection account={state.account} organization={state.organization} city={state.city} locations={state.locations} team={state.team} trustScore={trustScore} certificates={state.certificates} />
        )}

        {section === "certificates" && (
          <CertificatesSection certificates={state.certificates} organization={state.organization} />
        )}

        {section === "categories" && (
          <CategoriesSection
            categories={orderedCategories}
            moveCategory={moveCategory}
            toggleCategoryHidden={toggleCategoryHidden}
            addSubcategory={addSubcategory}
            removeSubcategory={removeSubcategory}
            resetCategories={resetCategories}
          />
        )}

        {section === "requests" && (
          <RequestsSection
            listings={state.listings}
            requests={state.requests}
            certificates={state.certificates}
            acceptRequest={acceptRequest}
            declineRequest={declineRequest}
            completeRequest={completeRequest}
          />
        )}

        {section === "messages" && (
          <MessagesSection
            conversation={selectedConversation}
            listing={selectedRequest ? state.listings.find((item) => item.id === selectedRequest.listingId) : undefined}
            messageDraft={messageDraft}
            setMessageDraft={setMessageDraft}
            sendMessage={sendMessage}
          />
        )}

        {section === "groups" && (
          <GroupsSection
            groups={state.groups}
            savedSearches={state.savedSearches}
            listings={state.listings}
            toggleFollowGroup={toggleFollowGroup}
          />
        )}

        {section === "verificationAdmin" && (
          <AdminVerificationReviewSection account={state.account} auditEvents={state.auditEvents} />
        )}

        {section === "trustAdmin" && (
          <AdminTrustOverviewSection scenarios={trustScenarios} currentOrganization={state.organization} currentScore={trustScore} />
        )}

        {section === "impactAdmin" && (
          <AdminImpactDashboardSection
            metrics={platformImpact.platform}
            organizations={platformImpact.organizations}
            trends={platformImpact.trends}
          />
        )}

        {section === "notifications" && (
          <NotificationsSection notifications={state.notifications} markNotificationsRead={markNotificationsRead} />
        )}

        {section === "moderation" && (
          <ModerationSection reports={state.reports} listings={state.listings} resolveReport={resolveReport} />
        )}

        {section === "settings" && (
          <SettingsSection
            account={state.account}
            locations={state.locations}
            team={state.team}
            auditEvents={state.auditEvents}
            updateCompanyProfile={updateCompanyProfile}
            addLicenseRecord={addLicenseRecord}
            submitVerification={submitVerification}
            addLocation={addLocation}
            inviteTeamMember={inviteTeamMember}
          />
        )}
      </div>
    </div>
    </LocalizationContext.Provider>
  );
}

function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="language-switcher" aria-label={t("Language")}>
      <span>{t("Language")}</span>
      <div role="group" aria-label={t("Language preference")}>
        <button className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")} type="button">
          English
        </button>
        <button className={locale === "ar" ? "active" : ""} onClick={() => setLocale("ar")} type="button">
          العربية
        </button>
      </div>
    </div>
  );
}

function AccountSection({
  account,
  signInCompany,
  signUpCompany,
  signOutCompany,
}: {
  account: CompanyProfile;
  signInCompany: (formData: FormData) => void;
  signUpCompany: (formData: FormData) => void;
  signOutCompany: () => void;
}) {
  return (
    <section className="workspace-section-stack">
      <div className="workspace-hero-panel account-hero-panel">
        <span className="eyebrow">Company access</span>
        <h2>{account.signedIn ? `${account.tradeName} is signed in.` : "Sign in or create a verified ReDist company profile."}</h2>
        <p>Companies and suppliers must provide license, contact, and authorized representative details before production publishing.</p>
      </div>

      {account.signedIn && (
        <div className="workspace-grid two-column">
          <section className="workspace-panel">
            <PanelHeading icon={Building2} title="Current account" text="Local preview of the organization identity attached to this workspace." />
            <VerificationSummary account={account} />
            <div className="profile-facts">
              <span>{account.accountType}</span>
              <span>{account.email}</span>
              <span>{account.emirate} / {account.city}</span>
            </div>
            <button className="button warning" onClick={signOutCompany} type="button">Sign out locally</button>
          </section>

          <section className="workspace-panel">
            <PanelHeading icon={FileText} title="Verification records" text="Licenses and supporting records currently attached to the account." />
            <LicenseList licenses={account.licenses} />
          </section>
        </div>
      )}

      <div className="workspace-grid two-column">
        <section className="workspace-panel">
          <PanelHeading icon={LogIn} title="Sign in" text="Use email and password now; Supabase Auth will replace this local preview step." />
          <form action={signInCompany} className="publish-form">
            <label className="wide-field">
              <span>Email</span>
              <input name="email" type="email" defaultValue={account.email} required />
            </label>
            <label className="wide-field">
              <span>Password</span>
              <input name="password" type="password" defaultValue={account.passwordHint} required />
            </label>
            <button className="button primary wide-field" type="submit">
              <LogIn size={18} />
              Sign in locally
            </button>
          </form>
        </section>

        <section className="workspace-panel">
          <PanelHeading icon={UserPlus} title="Sign up company or supplier" text="Collect the minimum details needed before license verification." />
          <form action={signUpCompany} className="publish-form expanded-form">
            <label>
              <span>Account type</span>
              <select name="accountType" defaultValue="Supplier">
                <option>Supplier</option>
                <option>Company</option>
              </select>
            </label>
            <label>
              <span>Legal name</span>
              <input name="legalName" required placeholder="Registered company name" />
            </label>
            <label>
              <span>Trade name</span>
              <input name="tradeName" required placeholder="Public supplier name" />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" required placeholder="admin@company.ae" />
            </label>
            <label>
              <span>Password</span>
              <input name="password" type="password" required minLength={8} placeholder="Minimum 8 characters" />
            </label>
            <label>
              <span>Phone</span>
              <input name="phone" required placeholder="+971..." />
            </label>
            <label>
              <span>Emirate</span>
              <select name="emirate" defaultValue="Dubai">
                <option>Dubai</option>
                <option>Abu Dhabi</option>
                <option>Sharjah</option>
                <option>Ajman</option>
                <option>Ras Al Khaimah</option>
                <option>Fujairah</option>
                <option>Umm Al Quwain</option>
              </select>
            </label>
            <label>
              <span>City</span>
              <input name="city" defaultValue="Dubai" required />
            </label>
            <label>
              <span>TRN</span>
              <input name="trn" placeholder="VAT TRN if applicable" />
            </label>
            <label>
              <span>Business category</span>
              <select name="businessCategory" defaultValue="Commercial trading">
                {dubaiBusinessCategories.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Business subcategory</span>
              <select name="businessSubcategory" defaultValue="Foodstuff trading">
                {dubaiBusinessCategories.map((category) => (
                  <optgroup label={category.name} key={category.name}>
                    {category.subcategories.map((subcategory) => (
                      <option key={`${category.name}-${subcategory}`}>{subcategory}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="wide-field">
              <span>Business activity</span>
              <input name="businessActivity" required placeholder="Food supplier, hotel operator, warehouse distributor..." />
            </label>
            <label className="wide-field">
              <span>Address</span>
              <textarea name="address" rows={3} required placeholder="Registered UAE address" />
            </label>
            <label>
              <span>License type</span>
              <select name="licenseType" defaultValue="Trade License">
                <option>Trade License</option>
                <option>VAT/TRN</option>
                <option>Food Permit</option>
                <option>Storage Permit</option>
                <option>NGO License</option>
                <option>Government Authorization</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              <span>License number</span>
              <input name="licenseNumber" required />
            </label>
            <label>
              <span>Issuing authority</span>
              <input name="issuingAuthority" required placeholder="DED, ADDED, SEDD..." />
            </label>
            <label>
              <span>Issue date</span>
              <input name="licenseIssueDate" type="date" />
            </label>
            <label>
              <span>Expiry date</span>
              <input name="licenseExpiry" type="date" required />
            </label>
            <label>
              <span>Document reference</span>
              <input name="licenseDocument" placeholder="trade-license.pdf" />
            </label>
            <label>
              <span>Authorized person</span>
              <input name="authorizedPerson" required placeholder="Full name" />
            </label>
            <label>
              <span>Role</span>
              <input name="authorizedRole" required placeholder="Owner, GM, operations manager" />
            </label>
            <label>
              <span>Authorized email</span>
              <input name="authorizedEmail" type="email" placeholder="Optional if same as account email" />
            </label>
            <label>
              <span>Authorized phone</span>
              <input name="authorizedPhone" placeholder="+971..." />
            </label>
            <RequiredDocumentsField selectedDocuments={requiredVerificationDocuments.slice(0, 6)} />
            <button className="button primary wide-field" type="submit">
              <UserPlus size={18} />
              Create company profile
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}

function DashboardSection({
  impact,
  openRequests,
  publishedListings,
  organization,
  city,
  savedCount,
  reports,
  auditEvents,
  account,
  listings,
  requests,
  notifications,
  trustScore,
  updateOrganization,
  navigateTo,
}: {
  impact: ImpactMetrics;
  openRequests: number;
  publishedListings: number;
  organization: string;
  city: string;
  savedCount: number;
  reports: number;
  auditEvents: AuditEvent[];
  account: CompanyProfile;
  listings: Listing[];
  requests: RequestRecord[];
  notifications: NotificationRecord[];
  trustScore: TrustScore;
  updateOrganization: (formData: FormData) => void;
  navigateTo: (section: Section) => void;
}) {
  const { locale, t, n, money } = useI18n();
  const pendingRequests = requests.filter((request) => request.status === "pending");
  const acceptedTransfers = requests.filter((request) => request.status === "accepted");
  const completedRequests = requests.filter((request) => request.status === "completed");
  const activeListings = listings.filter((listing) => listing.status === "published" || listing.status === "reserved");
  const urgentListings = activeListings.filter((listing) => listing.reason === "Near expiry" || expiryStatus(listing.expiryDate).urgent);
  const reviewDocuments = documentRecords(account).filter((document) =>
    document.status === "Pending Review" ||
    document.status === "Rejected" ||
    document.status === "Expired" ||
    (document.expiry ? expiryStatus(document.expiry).urgent : false),
  );
  const recentListings = activeListings.slice(0, 4);
  const recentRequests = requests.slice(0, 4);
  const transferRequests = requests.filter((request) => request.status === "accepted" || request.status === "completed").slice(0, 4);
  const unreadNotifications = notifications.filter((notification) => !notification.read).length;
  const verificationTone = account.verificationStatus === "Verified" ? "success" : account.verificationStatus === "Needs changes" ? "warning" : "info";
  const adminAttentionCount = reviewDocuments.length + reports;
  const attentionItems = [
    {
      icon: Handshake,
      label: "Requests awaiting response",
      value: pendingRequests.length,
      text: "Supplier queue for accepting or declining resource requests.",
      section: "requests" as Section,
      tone: pendingRequests.length ? "warning" : "success",
    },
    {
      icon: CheckCircle2,
      label: "Transfers awaiting verification",
      value: acceptedTransfers.length,
      text: "Accepted handovers ready to be completed and certified.",
      section: "transfers" as Section,
      tone: acceptedTransfers.length ? "warning" : "success",
    },
    {
      icon: Clock3,
      label: "Expiring or urgent listings",
      value: urgentListings.length,
      text: "Surplus inventory that should move soon or be reviewed.",
      section: "discover" as Section,
      tone: urgentListings.length ? "warning" : "success",
    },
    {
      icon: ShieldCheck,
      label: "Admin review items",
      value: adminAttentionCount,
      text: "Documents, verification records, and reports needing operations review.",
      section: "verification" as Section,
      tone: adminAttentionCount ? "warning" : "success",
    },
  ];

  return (
    <section className="dashboard-shell">
      <div className="dashboard-hero">
        <div>
          <span className="eyebrow">{t("Dashboard action center")}</span>
          <h2>{t("What should move today?")}</h2>
          <p>{t("Start with surplus listings, resource requests, handovers, and review queues.")} {organization} · {t(city)}</p>
        </div>
        <div className="dashboard-hero-actions" aria-label="Dashboard status summary">
          <span className="status-pill info">{t("Dubai pilot")}</span>
          <span className={`status-pill ${verificationTone}`}>{t(account.verificationStatus)}</span>
          <span className="status-pill warning">{n(openRequests)} {t("open requests")}</span>
        </div>
      </div>

      <div className="dashboard-action-grid" aria-label="Action center">
        <button className="dashboard-action-card primary" onClick={() => navigateTo("publish")} type="button">
          <PackagePlus size={22} />
          <span>{t("Supplier")}</span>
          <strong>{t("Create a listing")}</strong>
          <p>{t("Publish surplus inventory for controlled redistribution.")}</p>
        </button>
        <button className="dashboard-action-card" onClick={() => navigateTo("discover")} type="button">
          <Search size={22} />
          <span>{t("Recipient")}</span>
          <strong>{t("Discover resources")}</strong>
          <p>{t("Find available stock by category, location, and urgency.")}</p>
        </button>
        <button className="dashboard-action-card" onClick={() => navigateTo("requests")} type="button">
          <Handshake size={22} />
          <span>{t("Workflow")}</span>
          <strong>{t("Review requests")}</strong>
          <p>{t("Respond to requests and move accepted items forward.")}</p>
        </button>
        <button className="dashboard-action-card" onClick={() => navigateTo("transfers")} type="button">
          <CheckCircle2 size={22} />
          <span>{t("Operations")}</span>
          <strong>{t("View transfers")}</strong>
          <p>{t("Track accepted handovers and completed transfers.")}</p>
        </button>
      </div>

      <section className="dashboard-card dashboard-attention-card">
        <div className="dashboard-card-header">
          <PanelHeading icon={Bell} title="Needs attention" text="Queues that should be handled before reviewing analytics." />
          <span className="dashboard-count">{n(pendingRequests.length + acceptedTransfers.length + urgentListings.length + adminAttentionCount)}</span>
        </div>
        <div className="dashboard-attention-grid">
          {attentionItems.map((item) => (
            <button className="dashboard-attention-item" onClick={() => navigateTo(item.section)} type="button" key={item.label}>
              <item.icon size={18} />
              <div>
                <strong>{t(item.label)}</strong>
                <p>{t(item.text)}</p>
              </div>
              <span className={`status-pill ${item.tone}`}>{n(item.value)}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="dashboard-grid active-workflow-grid">
        <section className="dashboard-card dashboard-list-card">
          <div className="dashboard-card-header">
            <PanelHeading icon={PackagePlus} title="Recent listings" text="Supplier inventory currently available or reserved." />
            <span className="dashboard-count">{n(publishedListings)}</span>
          </div>
          <div className="dashboard-table" role="table" aria-label="Active listings">
            <div className="dashboard-table-row dashboard-table-head" role="row">
              <span role="columnheader">{t("Listing")}</span>
              <span role="columnheader">{t("Quantity")}</span>
              <span role="columnheader">{t("Status")}</span>
            </div>
            {recentListings.length ? recentListings.map((listing) => (
              <div className="dashboard-table-row" role="row" key={listing.id}>
                <span role="cell">
                  <strong>{t(listing.title)}</strong>
                  <small>{t(listing.category)} · {t(listing.city)}</small>
                </span>
                <span role="cell">{n(listing.quantityAvailable)} {t(listing.unit)}</span>
                <span role="cell" className={`status-pill ${listing.status === "published" ? "success" : "info"}`}>{t(listing.status)}</span>
              </div>
            )) : (
              <div className="dashboard-empty">{t("No active listings yet.")}</div>
            )}
          </div>
        </section>

        <section className="dashboard-card dashboard-list-card">
          <div className="dashboard-card-header">
            <PanelHeading icon={Handshake} title="Recent requests" text="Recipient demand and supplier response status." />
            <span className="dashboard-count">{n(openRequests)}</span>
          </div>
          <div className="dashboard-table" role="table" aria-label="Open requests">
            <div className="dashboard-table-row dashboard-table-head" role="row">
              <span role="columnheader">{t("Request")}</span>
              <span role="columnheader">{t("Quantity")}</span>
              <span role="columnheader">{t("Status")}</span>
            </div>
            {recentRequests.length ? recentRequests.map((request) => {
              const listing = listings.find((item) => item.id === request.listingId);
              return (
                <div className="dashboard-table-row" role="row" key={request.id}>
                  <span role="cell">
                    <strong>{listing ? t(listing.title) : t("Listing")}</strong>
                    <small>{t(request.handoverMethod)}</small>
                  </span>
                  <span role="cell">{n(request.quantity)} {listing ? t(listing.unit) : t("units")}</span>
                  <span role="cell" className={`status-pill ${request.status === "completed" ? "success" : request.status === "declined" ? "danger" : "warning"}`}>{t(request.status)}</span>
                </div>
              );
            }) : (
              <div className="dashboard-empty">{t("No requests yet. New requests will appear here.")}</div>
            )}
          </div>
        </section>

        <section className="dashboard-card dashboard-list-card">
          <div className="dashboard-card-header">
            <PanelHeading icon={CheckCircle2} title="Accepted and completed transfers" text="Handover status for requests that have moved past review." />
            <span className="dashboard-count">{n(acceptedTransfers.length + completedRequests.length)}</span>
          </div>
          <div className="dashboard-table" role="table" aria-label="Accepted and completed transfers">
            <div className="dashboard-table-row dashboard-table-head" role="row">
              <span role="columnheader">{t("Transfer")}</span>
              <span role="columnheader">{t("Quantity")}</span>
              <span role="columnheader">{t("Status")}</span>
            </div>
            {transferRequests.length ? transferRequests.map((request) => {
              const listing = listings.find((item) => item.id === request.listingId);
              return (
                <div className="dashboard-table-row" role="row" key={request.id}>
                  <span role="cell">
                    <strong>{listing ? t(listing.title) : t("Listing")}</strong>
                    <small>{t(request.handoverMethod)}</small>
                  </span>
                  <span role="cell">{n(request.quantity)} {listing ? t(listing.unit) : t("units")}</span>
                  <span role="cell" className={`status-pill ${request.status === "completed" ? "success" : "warning"}`}>{t(request.status)}</span>
                </div>
              );
            }) : (
              <div className="dashboard-empty">{t("Accepted transfers appear after requests are approved.")}</div>
            )}
          </div>
        </section>

        <section className="dashboard-card dashboard-trust-card">
          <PanelHeading icon={Award} title="Admin operating context" text="Verification readiness, trust, reports, and saved recipient interest." />
          <TrustScoreCard score={trustScore} compact />
          <div className="trust-status-list">
            <TrustBadge score={trustScore} />
            <span><ShieldCheck size={17} /> {t("Verification status:")} {t(account.verificationStatus)}</span>
            <span><Flag size={17} /> {t("Open reports:")} {n(reports)}</span>
            <span><Bookmark size={17} /> {t("Saved items:")} {n(savedCount)}</span>
            <span><FileText size={17} /> {t("Documents needing review:")} {n(reviewDocuments.length)}</span>
          </div>
        </section>
      </div>

      <div className="dashboard-grid dashboard-support-grid">
        <section className="dashboard-card organization-card">
          <PanelHeading icon={Building2} title="Workspace context" text="Pilot organization and city used by the local workflow preview." />
          <form action={updateOrganization} className="dashboard-organization-form">
            <label>
              <span>{t("Organization")}</span>
              <input name="organization" defaultValue={organization} />
            </label>
            <label>
              <span>{t("City")}</span>
              <input name="city" defaultValue={city} />
            </label>
            <button className="button primary" type="submit">{t("Save organization")}</button>
          </form>
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <PanelHeading icon={Bell} title="Unread alerts" text="Recent workflow alerts and organization updates." />
            <span className="dashboard-count">{n(unreadNotifications)}</span>
          </div>
          <div className="dashboard-feed">
            {notifications.slice(0, 3).map((notification) => (
              <article className={notification.read ? "dashboard-feed-item read" : "dashboard-feed-item"} key={notification.id}>
                <strong>{t(notification.title)}</strong>
                <p>{t(notification.body)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-card">
          <PanelHeading icon={ClipboardList} title="Recent activity" text="Latest controlled workflow events from the audit trail." />
          <div className="dashboard-feed">
            {auditEvents.slice(0, 3).map((event) => (
              <article className="dashboard-feed-item" key={event.id}>
                <strong>{t(event.action)}</strong>
                <p>{t(event.detail)}</p>
                <span>{t(event.actor)} · {t(event.at)}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="dashboard-impact-snapshot" aria-label="Impact snapshot">
        <div className="dashboard-section-title">
          <PanelHeading icon={BarChart3} title="Impact snapshot" text="Visible proof from completed redistribution work." />
          <button className="mini-action muted" onClick={() => navigateTo("impact")} type="button">{t("Open impact")}</button>
        </div>
        <div className="dashboard-kpi-grid compact">
          <article className="dashboard-kpi-card primary">
            <div className="dashboard-kpi-icon"><Globe2 size={18} /></div>
            <span>{t("AED value recovered")}</span>
            <strong>{money(impact.aed_recovered)}</strong>
            <p>{t("Estimated value retained through completed handovers.")}</p>
          </article>
          <article className="dashboard-kpi-card">
            <div className="dashboard-kpi-icon"><PackagePlus size={18} /></div>
            <span>{t("Items redistributed")}</span>
            <strong>{n(impact.resources_redistributed)}</strong>
            <p>{t("Units completed through controlled transfers.")}</p>
          </article>
          <article className="dashboard-kpi-card">
            <div className="dashboard-kpi-icon"><TrendingDown size={18} /></div>
            <span>{t("Waste diverted")}</span>
            <strong>{impactFormat(impact.waste_prevented_kg, "kg", locale)}</strong>
            <p>{t("Estimated material kept out of disposal.")}</p>
          </article>
          <article className="dashboard-kpi-card">
            <div className="dashboard-kpi-icon"><CheckCircle2 size={18} /></div>
            <span>{t("CO2 impact")}</span>
            <strong>{impactFormat(impact.co2_saved_kg, "kg", locale)}</strong>
            <p>{n(completedRequests.length)} {t("completed handovers")}</p>
          </article>
        </div>
      </section>
    </section>
  );
}

function impactFormat(value: number, unit: "aed" | "kg" | "number" = "number", locale: Locale = "en") {
  const numberLocale = locale === "ar" ? "ar-AE" : "en-US";
  if (unit === "aed") {
    return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  }
  if (unit === "kg") return `${Math.round(value).toLocaleString(numberLocale)} ${locale === "ar" ? "كجم" : "kg"}`;
  return Math.round(value).toLocaleString(numberLocale);
}

function ImpactKpiCard({
  icon: Icon,
  label,
  value,
  text,
  tone = "neutral",
}: {
  icon: typeof Globe2;
  label: string;
  value: string;
  text: string;
  tone?: "neutral" | "primary" | "success" | "warning";
}) {
  const { t } = useI18n();

  return (
    <article className={`impact-kpi-card ${tone}`}>
      <div className="impact-kpi-icon"><Icon size={19} /></div>
      <span>{t(label)}</span>
      <strong>{value}</strong>
      <p>{t(text)}</p>
    </article>
  );
}

function ImpactTrendCard({ trends }: { trends: ImpactTrend[] }) {
  const { locale, t } = useI18n();
  const maxAed = Math.max(...trends.map((trend) => trend.aed), 1);

  return (
    <section className="dashboard-card impact-trend-card">
      <PanelHeading icon={TrendingUp} title="Monthly impact summary" text="Recovered value and waste prevention trend for the current pilot period." />
      <div className="impact-trend-list">
        {trends.map((trend) => (
          <article key={trend.label}>
            <span>{trend.label}</span>
            <div className="impact-trend-bar" style={{ "--impact-width": `${Math.max(8, (trend.aed / maxAed) * 100)}%` } as CSSProperties} />
            <strong>{impactFormat(trend.aed, "aed", locale)}</strong>
            <small>{impactFormat(trend.waste, "kg", locale)} · {locale === "ar" ? `${trend.transactions.toLocaleString("ar-AE")} ${t("Completed transactions")}` : `${trend.transactions} transactions`}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ImpactBreakdownCard({
  icon: Icon,
  title,
  text,
  items,
}: {
  icon: typeof Globe2;
  title: string;
  text: string;
  items: ImpactBreakdown[];
}) {
  const { locale, t } = useI18n();
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="dashboard-card impact-breakdown-card">
      <PanelHeading icon={Icon} title={title} text={text} />
      <div className="impact-breakdown-list">
        {items.length ? items.map((item) => (
          <article key={item.label}>
            <div>
              <strong>{t(item.label)}</strong>
              <span>{impactFormat(item.value, "number", locale)} {t("Resources redistributed")} · {impactFormat(item.aed_recovered, "aed", locale)}</span>
            </div>
            <div className="impact-breakdown-track">
              <span style={{ "--impact-width": `${Math.max(6, (item.value / maxValue) * 100)}%` } as CSSProperties} />
            </div>
          </article>
        )) : (
          <div className="dashboard-empty">{t("Impact breakdown appears after completed transactions.")}</div>
        )}
      </div>
    </section>
  );
}

function MonthlyImpactSummary({ metrics }: { metrics: ImpactMetrics }) {
  const { locale, t } = useI18n();

  return (
    <section className="dashboard-card monthly-impact-summary">
      <PanelHeading icon={ClipboardList} title="Calculation snapshot" text="Current production metric set supported by the Sprint 4 impact engine." />
      <div>
        <span>{t("AED recovered")}</span>
        <strong>{impactFormat(metrics.aed_recovered, "aed", locale)}</strong>
      </div>
      <div>
        <span>{t("Resources redistributed")}</span>
        <strong>{impactFormat(metrics.resources_redistributed, "number", locale)}</strong>
      </div>
      <div>
        <span>{t("Estimated CO2 Saved")}</span>
        <strong>{impactFormat(metrics.co2_saved_kg, "kg", locale)}</strong>
      </div>
      <div>
        <span>{t("Completed transactions")}</span>
        <strong>{impactFormat(metrics.completed_transactions, "number", locale)}</strong>
      </div>
    </section>
  );
}

function PilotWorkspaceSection({
  organizations,
  feedback,
  impact,
  submitPilotFeedback,
  updatePilotFeedbackStatus,
}: {
  organizations: PilotOrganization[];
  feedback: PilotFeedback[];
  impact: ImpactMetrics;
  submitPilotFeedback: (formData: FormData) => void;
  updatePilotFeedbackStatus: (id: string, status: PilotFeedback["status"]) => void;
}) {
  const { locale, t, n } = useI18n();
  const kpis = pilotKpis(organizations, feedback);
  const openIssues = feedback.filter((item) => item.status !== "Resolved");
  const criticalIssues = openIssues.filter((item) => item.priority === "Critical");

  return (
    <section className="pilot-workspace-shell">
      <div className="verification-hero-panel pilot-hero-panel">
        <div>
          <span className="eyebrow">{t("UAE pilot platform")}</span>
          <h2>{t("Founder monitoring workspace")}</h2>
          <p>{t("Operational view for onboarding the first UAE pilot organizations, tracking feedback, issues, trust, impact, and transaction readiness.")}</p>
        </div>
        <div className="impact-hero-badges">
          <span className="status-pill success">{n(kpis.activeOrganizations)} {t("active pilot organizations")}</span>
          <span className={criticalIssues.length ? "status-pill danger" : "status-pill info"}>{n(criticalIssues.length)} {t("critical issues")}</span>
        </div>
      </div>

      <div className="pilot-kpi-grid">
        <ImpactKpiCard icon={Building2} label="Pilot organizations" value={n(kpis.pilotOrganizations)} text="Organizations invited into the UAE founder-led pilot." tone="primary" />
        <ImpactKpiCard icon={PackagePlus} label="Listings created" value={n(kpis.listingsCreated)} text="First supply-side listings across restaurant, hotel, warehouse, and NGO pilots." />
        <ImpactKpiCard icon={Handshake} label="Requests created" value={n(kpis.requestsCreated)} text="Demand-side requests generated in the pilot workflow." />
        <ImpactKpiCard icon={CheckCircle2} label="Transactions completed" value={n(kpis.transactionsCompleted)} text="Completed request and handover flows validated by scenario automation." tone="success" />
        <ImpactKpiCard icon={ShieldCheck} label="Verification completion" value={`${n(kpis.verificationCompletion)}%`} text="Pilot organizations with approved verification status." tone="warning" />
        <ImpactKpiCard icon={MessageSquare} label="Feedback submitted" value={n(kpis.feedbackSubmitted)} text="Suggestions, bugs, and feature requests captured from pilot users." />
      </div>

      <div className="pilot-dashboard-grid">
        <section className="dashboard-card pilot-orgs-panel">
          <PanelHeading icon={Users} title="Pilot organizations" text="Onboarding progress and first workflow milestones for each UAE pilot organization." />
          <div className="pilot-org-list">
            {organizations.map((organization) => (
              <article className={`pilot-org-card ${organization.status}`} key={organization.id}>
                <div className="pilot-org-header">
                  <div>
                    <strong>{organization.name}</strong>
                    <span>{t(organization.type)} · {t(organization.city)}</span>
                  </div>
                  <span className={`status-pill ${organization.status === "active" ? "success" : organization.status === "attention" ? "warning" : "info"}`}>
                    {t(organization.status)}
                  </span>
                </div>
                <div className="pilot-progress-track" aria-label={`${organization.name} onboarding progress`}>
                  <span style={{ "--pilot-progress": `${pilotReadinessPercent(organization)}%` } as CSSProperties} />
                </div>
                <div className="pilot-step-grid">
                  <PilotStep label="Invited" done={organization.invited} />
                  <PilotStep label="Registration" done={organization.registrationCompleted} />
                  <PilotStep label="Verification submitted" done={organization.verificationSubmitted} />
                  <PilotStep label="Verification approved" done={organization.verificationApproved} />
                  <PilotStep label="First listing" done={organization.firstListingCreated} />
                  <PilotStep label="First request" done={organization.firstRequestCreated} />
                  <PilotStep label="First transaction" done={organization.firstTransactionCompleted} />
                </div>
                <div className="pilot-org-metrics">
                  <Metric label="Transactions" value={n(organization.transactionsCompleted)} />
                  <Metric label="Issues" value={n(organization.issuesReported)} />
                  <Metric label="Trust" value={`${n(organization.trustScore)}/100`} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-card founder-monitor-panel">
          <PanelHeading icon={LayoutDashboard} title="Founder monitoring dashboard" text="Single view of pilot activity, verification readiness, trust, impact, and issue health." />
          <div className="founder-monitor-grid">
            <Metric label="Active pilot organizations" value={n(kpis.activeOrganizations)} />
            <Metric label="Listings" value={n(kpis.listingsCreated)} />
            <Metric label="Requests" value={n(kpis.requestsCreated)} />
            <Metric label="Transactions" value={n(kpis.transactionsCompleted)} />
            <Metric label="Verification completion" value={`${n(kpis.verificationCompletion)}%`} />
            <Metric label="Open issues" value={n(kpis.openIssues)} />
            <Metric label="Resolved issues" value={n(kpis.resolvedIssues)} />
            <Metric label="Critical issues" value={n(kpis.criticalIssues)} />
          </div>
          <div className="pilot-impact-summary">
            <div>
              <span>{t("Impact summary")}</span>
              <strong>{impactFormat(impact.aed_recovered, "aed", locale)}</strong>
              <p>{impactFormat(impact.resources_redistributed, "number", locale)} {t("Resources redistributed")} · {impactFormat(impact.waste_prevented_kg, "kg", locale)}</p>
            </div>
            <TrustBadge score={{ score: Math.round(organizations.reduce((total, organization) => total + organization.trustScore, 0) / organizations.length), level: trustLevelForScore(Math.round(organizations.reduce((total, organization) => total + organization.trustScore, 0) / organizations.length)), factors: [] }} />
          </div>
        </section>

        <section className="dashboard-card feedback-center-panel">
          <PanelHeading icon={MessageSquare} title="Feedback center" text="Capture suggestions, bugs, and feature requests from UAE pilot users." />
          <form action={submitPilotFeedback} className="pilot-feedback-form">
            <label>
              <span>{t("Organization")}</span>
              <select name="organization">
                {organizations.map((organization) => <option key={organization.id}>{organization.name}</option>)}
              </select>
            </label>
            <label>
              <span>{t("Type")}</span>
              <select name="type" defaultValue="Suggestion">
                <option>Suggestion</option>
                <option>Bug</option>
                <option>Feature request</option>
              </select>
            </label>
            <label>
              <span>{t("Priority")}</span>
              <select name="priority" defaultValue="Medium">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>
            <label>
              <span>{t("Category")}</span>
              <select name="category" defaultValue="Onboarding">
                <option>Onboarding</option>
                <option>Verification</option>
                <option>Listings</option>
                <option>Requests</option>
                <option>Handover</option>
                <option>Impact</option>
                <option>Certificate</option>
              </select>
            </label>
            <label className="wide-field">
              <span>{t("Title")}</span>
              <input name="title" required placeholder={t("Short feedback title")} />
            </label>
            <label className="wide-field">
              <span>{t("Details")}</span>
              <textarea name="detail" required rows={3} placeholder={t("What happened, who was affected, and what should improve?")} />
            </label>
            <button className="button primary wide-field" type="submit">
              <MessageSquare size={18} />
              {t("Submit feedback")}
            </button>
          </form>
        </section>

        <section className="dashboard-card issue-tracking-panel">
          <PanelHeading icon={Flag} title="Issue tracking" text="Open, resolved, and critical pilot issues requiring founder attention." />
          <div className="pilot-issue-summary">
            <Metric label="Open issues" value={n(kpis.openIssues)} />
            <Metric label="Resolved issues" value={n(kpis.resolvedIssues)} />
            <Metric label="Critical issues" value={n(kpis.criticalIssues)} />
          </div>
          <div className="pilot-feedback-list">
            {feedback.map((item) => (
              <article className={`pilot-feedback-card ${item.priority.toLowerCase()}`} key={item.id}>
                <div>
                  <span className={`status-pill ${item.priority === "Critical" || item.priority === "High" ? "danger" : item.priority === "Medium" ? "warning" : "info"}`}>
                    {t(item.priority)}
                  </span>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                  <small>{item.organization} · {t(item.type)} · {t(item.category)} · {item.createdAt}</small>
                </div>
                <select value={item.status} onChange={(event) => updatePilotFeedbackStatus(item.id, event.target.value as PilotFeedback["status"])} aria-label={`Update ${item.title} status`}>
                  <option>Open</option>
                  <option>Reviewing</option>
                  <option>Resolved</option>
                </select>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function PilotStep({ label, done }: { label: string; done: boolean }) {
  const { t } = useI18n();

  return (
    <span className={done ? "pilot-step done" : "pilot-step"}>
      {done ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
      {t(label)}
    </span>
  );
}

function ImpactDashboardSection({
  account,
  organization,
  city,
  metrics,
  trends,
  trustScore,
  certificates,
  listings,
  requests,
}: {
  account: CompanyProfile;
  organization: string;
  city: string;
  metrics: ImpactMetrics;
  trends: ImpactTrend[];
  trustScore: TrustScore;
  certificates: TransferCertificateRecord[];
  listings: Listing[];
  requests: RequestRecord[];
}) {
  const { locale, t, n } = useI18n();
  const completedRequests = requests.filter((request) => request.status === "completed");
  const activeRequests = requests.filter((request) => request.status === "pending" || request.status === "accepted");
  const supplierUnits = listings.reduce((total, listing) => total + Math.max(0, listing.quantityTotal - listing.quantityAvailable), 0);
  const recipientUnits = completedRequests.reduce((total, request) => total + request.quantity, 0);
  const recipientOrganizations = new Set([
    ...completedRequests.map((request) => request.receiverOrganization).filter(Boolean),
    ...certificates.map((certificate) => certificate.receiver_organization_name),
  ]).size;
  const pilotMetrics = demoPlatformImpact().platform;
  const pilotStats = pilotKpis(pilotOrganizations, []);
  const latestEvidence = certificates.slice(0, 3);

  return (
    <section className="impact-dashboard-shell">
      <div className="verification-hero-panel impact-hero-panel">
        <div>
          <span className="eyebrow">{t("Impact results")}</span>
          <h2>{organization} {t("redistribution value")}</h2>
          <p>{t("ESG-oriented results generated from completed ReDist handovers, transfer certificates, and pilot workspace data in {city}.").replace("{city}", t(city))}</p>
        </div>
        <div className="impact-hero-badges">
          <TrustBadge score={trustScore} />
          <VerificationBadge level={account.verificationLevel} status={account.verificationStatus} />
        </div>
      </div>

      <section className="impact-results-section">
        <div className="impact-section-heading">
          <PanelHeading icon={Globe2} title="Impact summary" text="Redistributed value and environmental indicators from completed transfer activity." />
          <span className="status-pill info">{t("Pilot-based calculation")}</span>
        </div>
        <div className="impact-kpi-grid">
          <ImpactKpiCard icon={Globe2} label="AED value recovered" value={impactFormat(metrics.aed_recovered, "aed", locale)} text="Estimated redistributed value retained through completed handovers." tone="primary" />
          <ImpactKpiCard icon={PackagePlus} label="Items redistributed" value={impactFormat(metrics.resources_redistributed, "number", locale)} text="Total units completed through verified transfer workflows." />
          <ImpactKpiCard icon={TrendingDown} label="Waste diverted" value={impactFormat(metrics.waste_prevented_kg, "kg", locale)} text="Estimated material diverted from disposal through reuse." tone="success" />
          <ImpactKpiCard icon={CheckCircle2} label="CO2 impact" value={impactFormat(metrics.co2_saved_kg, "kg", locale)} text="Estimated emissions avoided from redistribution activity." />
          <ImpactKpiCard icon={Users} label="Recipient impact" value={n(recipientOrganizations)} text="Recipient organizations represented by completed requests and certificates." />
        </div>
      </section>

      <section className="impact-results-section">
        <PanelHeading icon={Handshake} title="Transfer outcomes" text="Completed redistribution activity supporting the impact claims." />
        <div className="impact-outcome-grid">
          <Metric label="Completed transfers" value={impactFormat(metrics.completed_transactions, "number", locale)} />
          <Metric label="Certificates generated" value={n(certificates.length)} />
          <Metric label="Active workflow items" value={n(activeRequests.length)} />
          <Metric label="Completed units" value={n(recipientUnits)} />
        </div>
        <div className="impact-dashboard-grid">
          <ImpactBreakdownCard icon={Filter} title="Resources by category" text="Redistributed resources grouped by completed category contribution." items={metrics.top_categories} />
          <ImpactBreakdownCard icon={MapPin} title="Resources by location" text="Redistributed resources grouped by handover geography." items={metrics.top_locations} />
        </div>
      </section>

      <section className="impact-results-section">
        <PanelHeading icon={Building2} title="Organization contribution" text="Supplier, recipient, and ecosystem contribution using existing workspace data." />
        <div className="organization-contribution-grid">
          <article>
            <PackagePlus size={20} />
            <span>{t("Supplier contribution")}</span>
            <strong>{n(supplierUnits)} {t("units moved from surplus")}</strong>
            <p>{t("Based on listed quantity reserved or completed through request workflows.")}</p>
          </article>
          <article>
            <Handshake size={20} />
            <span>{t("Recipient contribution")}</span>
            <strong>{n(recipientUnits)} {t("units received through handovers")}</strong>
            <p>{t("Based on completed request quantities already recorded in the workspace.")}</p>
          </article>
          <article>
            <Globe2 size={20} />
            <span>{t("Combined ecosystem impact")}</span>
            <strong>{impactFormat(metrics.aed_recovered, "aed", locale)}</strong>
            <p>{t("Estimated redistributed value supported by completed transfers and evidence.")}</p>
          </article>
        </div>
      </section>

      <section className="impact-results-section">
        <PanelHeading icon={QrCode} title="Impact evidence" text="Certificates, completed handovers, verification, and trust context behind the results." />
        <div className="impact-evidence-grid">
          <section className="dashboard-card certificate-summary-panel">
            <PanelHeading icon={QrCode} title="Certificate references" text="QR-verifiable certificate records generated from completed transfers." />
            {latestEvidence.length ? (
              <div className="certificate-list">
                {latestEvidence.map((certificate) => <CertificateCard certificate={certificate} compact key={certificate.id} />)}
              </div>
            ) : (
              <div className="dashboard-empty">{t("Certificates appear after completed handovers are verified.")}</div>
            )}
          </section>
          <section className="dashboard-card">
            <PanelHeading icon={ShieldCheck} title="Verification and trust context" text="Organization credibility indicators supporting impact evidence." />
            <div className="trust-status-list">
              <TrustBadge score={trustScore} />
              <span><ShieldCheck size={17} /> {t("Verification status:")} {t(account.verificationStatus)}</span>
              <span><Award size={17} /> {t("Trust score")} {n(trustScore.score)}/100</span>
              <span><CheckCircle2 size={17} /> {n(completedRequests.length)} {t("completed handovers")}</span>
            </div>
          </section>
        </div>
      </section>

      <section className="impact-results-section">
        <PanelHeading icon={LayoutDashboard} title="Founder and pilot view" text="UAE pilot snapshot using existing simulated pilot cohort and impact data." />
        <div className="impact-dashboard-grid">
          <ImpactTrendCard trends={trends} />
          <section className="dashboard-card monthly-impact-summary">
            <PanelHeading icon={Globe2} title="UAE pilot impact snapshot" text="Pilot-based platform snapshot from existing simulation fixtures." />
            <div>
              <span>{t("Pilot AED recovered")}</span>
              <strong>{impactFormat(pilotMetrics.aed_recovered, "aed", locale)}</strong>
            </div>
            <div>
              <span>{t("Pilot resources redistributed")}</span>
              <strong>{impactFormat(pilotMetrics.resources_redistributed, "number", locale)}</strong>
            </div>
            <div>
              <span>{t("Cohort readiness")}</span>
              <strong>{n(pilotStats.verificationCompletion)}%</strong>
            </div>
            <div>
              <span>{t("Pilot organizations")}</span>
              <strong>{n(pilotStats.pilotOrganizations)}</strong>
            </div>
          </section>
        </div>
      </section>
    </section>
  );
}

function ImpactLeaderboard({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; meta: string; value: string }>;
}) {
  return (
    <section className="dashboard-card impact-leaderboard">
      <PanelHeading icon={Award} title={title} text="Pilot leaderboard generated from validated impact scenarios." />
      <div>
        {items.map((item, index) => (
          <article key={item.label}>
            <span>{index + 1}</span>
            <div>
              <strong>{item.label}</strong>
              <small>{item.meta}</small>
            </div>
            <em>{item.value}</em>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminImpactDashboardSection({
  metrics,
  organizations,
  trends,
}: {
  metrics: ImpactMetrics;
  organizations: ImpactLeaderboardItem[];
  trends: ImpactTrend[];
}) {
  const { locale, t } = useI18n();
  const sectors = [...organizations]
    .reduce<Map<string, { label: string; value: number; aed: number }>>((map, organization) => {
      const current = map.get(organization.sector) ?? { label: organization.sector, value: 0, aed: 0 };
      current.value += organization.metrics.resources_redistributed;
      current.aed += organization.metrics.aed_recovered;
      map.set(organization.sector, current);
      return map;
    }, new Map());
  const sectorItems = [...sectors.values()].sort((a, b) => b.value - a.value);
  const cityItems = metrics.top_locations.map((location) => ({
    label: t(location.label),
    meta: `${impactFormat(location.value, "number", locale)} ${t("Resources redistributed")}`,
    value: impactFormat(location.aed_recovered, "aed", locale),
  }));
  const categoryItems = metrics.top_categories.map((category) => ({
    label: t(category.label),
    meta: `${impactFormat(category.value, "number", locale)} ${t("Resources redistributed")}`,
    value: impactFormat(category.aed_recovered, "aed", locale),
  }));

  return (
    <section className="impact-dashboard-shell">
      <div className="verification-hero-panel impact-hero-panel">
        <div>
          <span className="eyebrow">{t("Platform impact")}</span>
          <h2>{t("UAE pilot impact command center")}</h2>
          <p>{t("Platform-level reporting for top organizations, categories, sectors, cities, and growth trends across validated Sprint 4 simulation flows.")}</p>
        </div>
        <div className="impact-hero-badges">
          <span className="status-pill success">{t("UAE launch scope")}</span>
          <span className="status-pill info">{t("Simulation verified")}</span>
        </div>
      </div>

      <div className="impact-kpi-grid">
        <ImpactKpiCard icon={Globe2} label="Platform AED recovered" value={impactFormat(metrics.aed_recovered, "aed", locale)} text="Total simulated recovered value across UAE pilot scenarios." tone="primary" />
        <ImpactKpiCard icon={PackagePlus} label="Resources redistributed" value={impactFormat(metrics.resources_redistributed, "number", locale)} text="Total completed units across platform scenarios." />
        <ImpactKpiCard icon={TrendingDown} label="Waste prevented" value={impactFormat(metrics.waste_prevented_kg, "kg", locale)} text="Estimated platform waste diversion." tone="success" />
        <ImpactKpiCard icon={Handshake} label="Completed transactions" value={impactFormat(metrics.completed_transactions, "number", locale)} text="Completed transaction lifecycle count." />
      </div>

      <div className="impact-dashboard-grid">
        <ImpactTrendCard trends={trends} />
        <ImpactBreakdownCard icon={Filter} title="Top sectors" text="Sector contribution from restaurant, hotel, warehouse, and NGO simulations." items={sectorItems.map((sector) => ({ label: sector.label, value: sector.value, aed_recovered: sector.aed, completed_transactions: 0 }))} />
        <ImpactLeaderboard
          title="Top organizations"
          items={organizations.map((organization) => ({
            label: organization.label,
            meta: `${t(organization.sector)} · ${t(organization.city)}`,
            value: impactFormat(organization.metrics.aed_recovered, "aed", locale),
          }))}
        />
        <ImpactLeaderboard title="Top cities" items={cityItems} />
        <ImpactLeaderboard title="Top categories" items={categoryItems} />
      </div>
    </section>
  );
}

function certificateDate(value: string, locale: Locale = "en") {
  return new Date(value).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-AE", { year: "numeric", month: "short", day: "numeric" });
}

function QrVerificationBlock({ token }: { token: string }) {
  const { t } = useI18n();
  const cells = Array.from({ length: 49 }, (_, index) => {
    const code = token.charCodeAt(index % token.length) + index * 17;
    return code % 3 !== 0;
  });

  return (
    <a className="certificate-qr" href={verificationUrl(token)} target="_blank" rel="noreferrer" aria-label="Open QR verification page">
      <QrCode size={18} />
      <span>
        {cells.map((filled, index) => <i className={filled ? "filled" : ""} key={index} />)}
      </span>
      <small>{t("Verify QR")}</small>
    </a>
  );
}

function CertificateBadge({ certificate }: { certificate: TransferCertificateRecord }) {
  const { t } = useI18n();

  return (
    <span className={`certificate-status ${certificate.status}`}>
      <ShieldCheck size={14} />
      {certificate.status === "issued" ? t("Certificate valid") : t(certificate.status)}
    </span>
  );
}

function CertificateCard({ certificate, compact = false }: { certificate: TransferCertificateRecord; compact?: boolean }) {
  const { locale, t, n } = useI18n();

  return (
    <article className={`certificate-card ${compact ? "compact" : ""}`}>
      <div>
        <CertificateBadge certificate={certificate} />
        <h3>{certificate.certificate_number}</h3>
        <p>{certificate.item_name} · {n(certificate.quantity)} {certificate.unit} · {t(certificate.category)}</p>
      </div>
      <div className="certificate-card-meta">
        <span>{certificate.sender_organization_name}</span>
        <strong>{certificate.receiver_organization_name}</strong>
        <small>{certificateDate(certificate.transfer_date, locale)} · {t(certificate.location)}</small>
      </div>
      {!compact && (
        <div className="certificate-card-actions">
          <QrVerificationBlock token={certificate.qr_verification_token} />
          <button className="mini-action" onClick={() => window.print()} type="button">
            <Download size={14} />
            {t("Download PDF")}
          </button>
          <a className="mini-action muted" href={verificationUrl(certificate.qr_verification_token)} target="_blank" rel="noreferrer">
            <ExternalLink size={14} />
            {t("Verify")}
          </a>
        </div>
      )}
    </article>
  );
}

function CertificatePdfLayout({ certificate }: { certificate: TransferCertificateRecord }) {
  const { locale, t, n } = useI18n();

  return (
    <section className="certificate-pdf-layout">
      <div className="certificate-pdf-header">
        <div>
          <span className="proto-mark">RD</span>
          <strong>{t("ReDist Transfer Certificate")}</strong>
          <small>{certificate.certificate_number}</small>
        </div>
        <QrVerificationBlock token={certificate.qr_verification_token} />
      </div>
      <div className="certificate-pdf-band">
        <CertificateBadge certificate={certificate} />
        <span>{t("Issued")} {certificateDate(certificate.issued_at, locale)}</span>
        <span>{t("Transfer completed")} {certificateDate(certificate.transfer_date, locale)}</span>
      </div>
      <div className="certificate-pdf-grid">
        <div>
          <span>{t("Sender")}</span>
          <strong>{certificate.sender_organization_name}</strong>
        </div>
        <div>
          <span>{t("Receiver")}</span>
          <strong>{certificate.receiver_organization_name}</strong>
        </div>
        <div>
          <span>{t("Item summary")}</span>
          <strong>{certificate.item_name}</strong>
          <p>{n(certificate.quantity)} {certificate.unit} · {t(certificate.category)}</p>
        </div>
        <div>
          <span>{t("Handover")}</span>
          <strong>{t(certificate.handover_method)}</strong>
          <p>{t(certificate.location)}</p>
        </div>
      </div>
      <div className="certificate-impact-strip">
        <div><span>{t("AED recovered")}</span><strong>{impactFormat(certificate.impact_snapshot.aed_recovered, "aed", locale)}</strong></div>
        <div><span>{t("Waste prevented")}</span><strong>{impactFormat(certificate.impact_snapshot.waste_prevented_kg, "kg", locale)}</strong></div>
        <div><span>{t("CO2 saved")}</span><strong>{impactFormat(certificate.impact_snapshot.co2_saved_kg, "kg", locale)}</strong></div>
      </div>
      <div className="certificate-pdf-footer">
        <span>{t("Trust snapshot:")} {t(certificate.trust_snapshot.level)} · {n(certificate.trust_snapshot.score)}/100</span>
        <span>{t("Verification:")} {t(certificate.trust_snapshot.verification_level)} · {t(certificate.trust_snapshot.verification_status)}</span>
        <span>{t("Hash:")} {certificate.certificate_hash}</span>
      </div>
      <p className="certificate-disclaimer">{t("This certificate confirms that the referenced ReDist transfer workflow was completed on the platform. It is not a tax invoice, payment receipt, customs declaration, or legal title document.")}</p>
    </section>
  );
}

function CertificateHistory({ certificate }: { certificate: TransferCertificateRecord }) {
  return (
    <section className="workspace-panel">
      <PanelHeading icon={History} title="Certificate history" text="Append-only certificate events for audit review." />
      <div className="verification-timeline">
        {certificate.history.map((event) => (
          <article key={`${event.event}-${event.at}`}>
            <span>{event.event}</span>
            <div>
              <strong>{event.actor}</strong>
              <p>{event.detail}</p>
              <small>{event.at}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CertificateSummaryPanel({ certificates }: { certificates: TransferCertificateRecord[] }) {
  const latest = certificates[0];

  return (
    <section className="dashboard-card certificate-summary-panel">
      <PanelHeading icon={QrCode} title="Transfer certificates" text="QR-verifiable proof generated from completed redistribution transactions." />
      {latest ? (
        <CertificateCard certificate={latest} compact />
      ) : (
        <div className="dashboard-empty">Certificates appear here after completed handovers.</div>
      )}
    </section>
  );
}

function CertificatesSection({ certificates, organization }: { certificates: TransferCertificateRecord[]; organization: string }) {
  const { t, n } = useI18n();
  const selected = certificates[0];

  return (
    <section className="workspace-section-stack">
      <div className="verification-hero-panel">
        <div>
          <span className="eyebrow">{t("Transfer certificates")}</span>
          <h2>{organization} {t("proof center")}</h2>
          <p>{t("Auditable, QR-verifiable proof for completed redistribution transactions.")}</p>
        </div>
        <span className="status-pill success">{n(certificates.length)} {t("issued")}</span>
      </div>

      {selected ? (
        <div className="workspace-grid two-column">
          <section className="workspace-panel certificate-viewer">
            <PanelHeading icon={FileText} title="Certificate viewer" text="Professional certificate layout ready for PDF print/download." />
            <CertificatePdfLayout certificate={selected} />
          </section>
          <div className="workspace-section-stack">
            <section className="workspace-panel">
              <PanelHeading icon={QrCode} title="Certificate list" text="Latest completed transfer certificates." />
              <div className="certificate-list">
                {certificates.map((certificate) => <CertificateCard certificate={certificate} key={certificate.id} />)}
              </div>
            </section>
            <CertificateHistory certificate={selected} />
          </div>
        </div>
      ) : (
        <section className="workspace-panel">
          <div className="empty-workspace-state">{t("Complete a request handover to generate the first transfer certificate.")}</div>
        </section>
      )}
    </section>
  );
}

function DiscoverSection(props: {
  categories: string[];
  category: string;
  subcategories: string[];
  subcategory: string;
  filteredListings: Listing[];
  offerType: string;
  offers: string[];
  cities: string[];
  cityFilter: string;
  setCityFilter: (value: string) => void;
  urgencyFilter: string;
  setUrgencyFilter: (value: string) => void;
  handoverMethods: string[];
  handoverFilter: string;
  setHandoverFilter: (value: string) => void;
  query: string;
  requestMessage: string;
  requestQuantity: number;
  selectedListing: Listing;
  setCategory: (value: string) => void;
  setSubcategory: (value: string) => void;
  setOfferType: (value: string) => void;
  setQuery: (value: string) => void;
  setRequestMessage: (value: string) => void;
  setRequestQuantity: (value: number) => void;
  setSelectedListingId: (value: string) => void;
  submitRequest: () => void;
  toggleSave: (id: string) => void;
  saveSearch: () => void;
  reportListing: (id: string) => void;
  account: CompanyProfile;
  trustScore: TrustScore;
}) {
  const { t, n } = useI18n();
  const urgentResources = props.filteredListings.filter((listing) => expiryStatus(listing.expiryDate).urgent);
  const nearbyResources = props.filteredListings.filter((listing) => listing.city === props.account.city || listing.city === props.selectedListing.city);
  const categoriesAvailable = new Set(props.filteredListings.map((listing) => listing.category)).size;

  return (
    <section className="discover-shell">
      <div className="discover-search-panel">
        <div>
          <span className="eyebrow">{t("Resource discovery")}</span>
          <h2>{t("Find available surplus for redistribution by urgency, location, and handover readiness.")}</h2>
        </div>
        <label className="discover-search-field">
          <Search size={19} />
          <span>{t("Search resources")}</span>
          <input dir="auto" value={props.query} onChange={(event) => props.setQuery(event.target.value)} placeholder={t("Prepared meals, cartons, fixtures...")} />
        </label>
        <div className="discover-search-actions">
          <label>
            <span>{t("Sort by")}</span>
            <select defaultValue="relevance" aria-label="Sort listings">
              <option value="relevance">{t("Most relevant")}</option>
              <option value="quantity">{t("Highest quantity")}</option>
              <option value="expiry">{t("Expiry urgency")}</option>
              <option value="location">{t("Nearest location")}</option>
            </select>
          </label>
          <button className="button secondary" onClick={props.saveSearch} type="button">
            <Bookmark size={18} />
            {t("Save search")}
          </button>
        </div>
      </div>

      <div className="discovery-summary-grid" aria-label="Discovery summary">
        <article>
          <PackagePlus size={18} />
          <span>{t("Available resources")}</span>
          <strong>{n(props.filteredListings.length)}</strong>
        </article>
        <article className={urgentResources.length ? "urgent" : ""}>
          <Clock3 size={18} />
          <span>{t("Urgent resources")}</span>
          <strong>{n(urgentResources.length)}</strong>
        </article>
        <article>
          <MapPin size={18} />
          <span>{t("Nearby resources")}</span>
          <strong>{n(nearbyResources.length)}</strong>
        </article>
        <article>
          <Filter size={18} />
          <span>{t("Categories available")}</span>
          <strong>{n(categoriesAvailable)}</strong>
        </article>
      </div>

      <div className="discover-layout">
        <aside className="discover-filter-sidebar" aria-label="Listing filters">
          <PanelHeading icon={Filter} title="Operational filters" text="Narrow available surplus by resource fit and handover conditions." />
          <div className="filter-group">
          <span>{t("Categories")}</span>
            <div className="category-filter-list">
              {props.categories.map((item) => (
                <button
                  className={item === props.category ? "category-filter active" : "category-filter"}
                  key={item}
                  onClick={() => props.setCategory(item)}
                  type="button"
                >
                  {t(item)}
                </button>
              ))}
            </div>
          </div>
          <label>
            <span>{t("Subcategory")}</span>
            <select value={props.subcategory} onChange={(event) => props.setSubcategory(event.target.value)}>
              {props.subcategories.map((item) => <option key={item} value={item}>{t(item)}</option>)}
            </select>
          </label>
          <label>
            <span>{t("Location")}</span>
            <select value={props.cityFilter} onChange={(event) => props.setCityFilter(event.target.value)}>
              {props.cities.map((item) => <option key={item} value={item}>{t(item)}</option>)}
            </select>
          </label>
          <label>
            <span>{t("Availability status")}</span>
            <select defaultValue="published" aria-label="Availability status">
              <option value="published">{t("Available for request")}</option>
            </select>
          </label>
          <label>
            <span>{t("Expiry and urgency")}</span>
            <select value={props.urgencyFilter} onChange={(event) => props.setUrgencyFilter(event.target.value)}>
              <option value="All">{t("All urgency levels")}</option>
              <option value="Urgent">{t("Urgent or near expiry")}</option>
              <option value="Standard">{t("Standard timing")}</option>
            </select>
          </label>
          <label>
            <span>{t("Pickup readiness")}</span>
            <select value={props.handoverFilter} onChange={(event) => props.setHandoverFilter(event.target.value)}>
              {props.handoverMethods.map((item) => <option key={item} value={item}>{t(item)}</option>)}
            </select>
          </label>
          <label>
            <span>{t("Organization type")}</span>
            <select defaultValue="verified" aria-label="Organization type">
              <option value="verified">{t("Verified supplier organizations")}</option>
            </select>
          </label>
          <label>
            <span>{t("Offer type")}</span>
            <select value={props.offerType} onChange={(event) => props.setOfferType(event.target.value)}>
              {props.offers.map((item) => <option key={item} value={item}>{t(item)}</option>)}
            </select>
          </label>
          <div className="saved-search-placeholder">
            <Bookmark size={18} />
            <div>
              <strong>{t("Saved resource search")}</strong>
              <p>{t("Keep this sourcing view for recurring redistribution needs.")}</p>
            </div>
          </div>
        </aside>

        <div className="discover-results-panel">
          <div className="discover-results-header">
            <PanelHeading icon={ClipboardList} title="Available resources" text={`${n(props.filteredListings.length)} ${props.filteredListings.length === 1 ? "resource" : "resources"} ready for redistribution review.`} />
            <span className="status-pill info">{t(props.category)}</span>
          </div>
          <div className="resource-list" role="table" aria-label="Available resources">
            <div className="resource-list-row resource-list-head" role="row">
              <span role="columnheader">{t("Resource")}</span>
              <span role="columnheader">{t("Quantity")}</span>
              <span role="columnheader">{t("Location")}</span>
              <span role="columnheader">{t("Urgency")}</span>
              <span role="columnheader">{t("Action")}</span>
            </div>
            {props.filteredListings.length === 0 ? (
              <div className="empty-workspace-state">{t("No available resources match this filter.")}</div>
            ) : props.filteredListings.map((listing) => (
              <button
                className={listing.id === props.selectedListing.id ? "resource-list-row active" : "resource-list-row"}
                key={listing.id}
                onClick={() => props.setSelectedListingId(listing.id)}
                role="row"
                type="button"
              >
                <span role="cell" className="resource-cell-main">
                  <strong>{t(listing.title)}</strong>
                  <small>{t(listing.category)} / {t(listing.subcategory)}</small>
                  <em>{t(listing.owner)}</em>
                </span>
                <span role="cell">{n(listing.quantityAvailable)} {t(listing.unit)}</span>
                <span role="cell">{t(listing.city)} / {t(listing.area)}</span>
                <span role="cell" className={expiryStatus(listing.expiryDate).urgent ? "expiry-pill urgent" : "expiry-pill"}>
                  {t(expiryStatus(listing.expiryDate).label)}
                </span>
                <span role="cell" className="resource-row-action">
                  {t("Request")}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="discover-detail-panel">
          <PanelHeading icon={ClipboardList} title={props.selectedListing.title} text={props.selectedListing.description} />
          <div className="listing-verification-strip">
            <VerificationBadge level={props.account.verificationLevel} status={props.account.verificationStatus} />
            <TrustBadge score={props.trustScore} />
            <span>{t(props.selectedListing.owner)}</span>
          </div>
          <div className="resource-detail-summary">
            <div>
              <span>{t("Available surplus")}</span>
              <strong>{n(props.selectedListing.quantityAvailable)} {t(props.selectedListing.unit)}</strong>
            </div>
            <div>
              <span>{t("Handover location")}</span>
              <strong>{t(props.selectedListing.city)} / {t(props.selectedListing.area)}</strong>
            </div>
            <div>
              <span>{t("Urgency")}</span>
              <strong>{t(expiryStatus(props.selectedListing.expiryDate).label)}</strong>
            </div>
          </div>
          <div className="detail-tags">
            <span>{t(props.selectedListing.offerType)}</span>
            <span>{t(props.selectedListing.category)}</span>
            <span>{t(props.selectedListing.subcategory)}</span>
            <span>{t(props.selectedListing.city)} / {t(props.selectedListing.area)}</span>
            <span>{t(props.selectedListing.status)}</span>
            <span className={expiryStatus(props.selectedListing.expiryDate).urgent ? "expiry-pill urgent" : "expiry-pill"}>
              {t(expiryStatus(props.selectedListing.expiryDate).label)}
            </span>
          </div>
          <div className="handover-strip">
            {props.selectedListing.handoverMethods.map((method) => (
              <span key={method}>{t(method)}</span>
            ))}
          </div>
          <div className="request-box">
            <label>
              <span>{t("Quantity required")}</span>
              <input
                type="number"
                min={1}
                max={props.selectedListing.quantityAvailable}
                value={props.requestQuantity}
                onChange={(event) => props.setRequestQuantity(Number(event.target.value))}
              />
            </label>
            <label>
              <span>{t("Handover note")}</span>
              <textarea dir="auto" value={props.requestMessage} onChange={(event) => props.setRequestMessage(event.target.value)} rows={3} />
            </label>
            <button className="button primary" onClick={props.submitRequest} type="button">
              <Send size={18} />
              {t("Send request")}
            </button>
            <div className="split-actions">
              <button className="button secondary" onClick={() => props.toggleSave(props.selectedListing.id)} type="button">
                <Bookmark size={18} />
                {props.selectedListing.saved ? t("Saved") : t("Save item")}
              </button>
              <button className="button warning" onClick={() => props.reportListing(props.selectedListing.id)} type="button">
                <Flag size={18} />
                {t("Report")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PublishSection({
  categories,
  city,
  locations,
  publishListing,
}: {
  categories: Category[];
  city: string;
  locations: OrganizationLocation[];
  publishListing: (formData: FormData) => void;
}) {
  const defaultCategory = categories[0]?.name ?? "";
  const [selectedCategoryName, setSelectedCategoryName] = useState(defaultCategory);
  const selectedCategory = categories.find((item) => item.name === selectedCategoryName) ?? categories[0];
  const availableSubcategories = selectedCategory?.subcategories ?? [];

  useEffect(() => {
    if (defaultCategory && !categories.some((item) => item.name === selectedCategoryName)) {
      setSelectedCategoryName(defaultCategory);
    }
  }, [categories, defaultCategory, selectedCategoryName]);

  return (
    <section className="workspace-panel">
      <PanelHeading icon={PackagePlus} title="Publish inventory" text="Create a safe, non-regulated item listing." />
      <form action={publishListing} className="publish-form expanded-form">
        <label className="wide-field">
          <span>Item name</span>
          <input name="title" required minLength={3} placeholder="Prepared meals, boxes, chairs..." />
        </label>
        <label>
          <span>Category</span>
          <select
            name="category"
            value={selectedCategoryName}
            disabled={!categories.length}
            onChange={(event) => setSelectedCategoryName(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Subcategory</span>
          <select name="subcategory" disabled={!availableSubcategories.length}>
            {availableSubcategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Offer type</span>
          <select name="offerType" defaultValue="Free">
            <option>Free</option>
            <option>For sale</option>
            <option>Exchange</option>
          </select>
        </label>
        <label>
          <span>Reason</span>
          <select name="reason" defaultValue="Excess stock">
            <option>Excess stock</option>
            <option>Near expiry</option>
            <option>Slow moving</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          <span>City</span>
          <input name="city" defaultValue={city} required />
        </label>
        <label>
          <span>Area</span>
          <select name="area" defaultValue={locations.find((location) => location.emirate === city)?.area ?? locations[0]?.area}>
            {locations.map((location) => (
              <option key={location.id} value={location.area}>{location.emirate} / {location.area}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Quantity</span>
          <input name="quantity" type="number" min={1} defaultValue={50} required />
        </label>
        <label>
          <span>Unit</span>
          <input name="unit" defaultValue="units" required />
        </label>
        <label>
          <span>Expiry date</span>
          <input name="expiryDate" type="date" />
        </label>
        <label className="wide-field">
          <span>Description</span>
          <textarea name="description" rows={4} placeholder="Condition, pickup time, storage notes, and handover details." />
        </label>
        <fieldset className="handover-options wide-field">
          <legend>Handover methods</legend>
          {(["Pickup", "Delivery by owner", "Requester delivery", "Courier coordination"] as HandoverMethod[]).map((method) => (
            <label key={method}>
              <input name="handoverMethods" type="checkbox" value={method} defaultChecked={method === "Pickup"} />
              <span>{method}</span>
            </label>
          ))}
        </fieldset>
        <button className="button primary wide-field" type="submit" disabled={!categories.length}>
          <PackagePlus size={18} />
          {categories.length ? "Publish local listing" : "Show at least one category first"}
        </button>
      </form>
    </section>
  );
}

function CategoriesSection({
  categories,
  moveCategory,
  toggleCategoryHidden,
  addSubcategory,
  removeSubcategory,
  resetCategories,
}: {
  categories: Category[];
  moveCategory: (id: string, direction: -1 | 1) => void;
  toggleCategoryHidden: (id: string) => void;
  addSubcategory: (id: string, formData: FormData) => void;
  removeSubcategory: (id: string, subcategory: string) => void;
  resetCategories: () => void;
}) {
  const visibleCount = categories.filter((item) => !item.hidden && !item.restricted).length;

  return (
    <section className="workspace-section-stack">
      <div className="workspace-panel category-intro">
        <div className="panel-toolbar">
          <PanelHeading
            icon={Filter}
            title="UAE category control"
            text="Suggested starter categories for UAE redistribution. Arrange or hide categories any time."
          />
          <button className="button secondary" onClick={resetCategories} type="button">Reset UAE list</button>
        </div>
        <div className="category-summary">
          <Metric label="visible MVP categories" value={visibleCount} />
          <Metric label="hidden or restricted" value={categories.length - visibleCount} />
          <Metric label="total suggested" value={categories.length} />
        </div>
        <p className="category-note">
          Medicines, pharmaceuticals, hazardous materials, and other regulated items stay hidden for the MVP until UAE-specific licensing, storage, transport, verification, and audit controls are ready.
        </p>
      </div>

      <div className="category-list">
        {categories.map((category, index) => (
          <article className={category.hidden ? "category-row hidden-category" : "category-row"} key={category.id}>
            <div className="category-order">{index + 1}</div>
            <div className="category-main">
              <div className="category-title-line">
                <h3>{category.name}</h3>
                {category.restricted && <span className="restricted-pill">Restricted</span>}
                {category.hidden && <span className="hidden-pill">Hidden</span>}
              </div>
              <p>{category.description}</p>
              <small>{category.examples}</small>
              <div className="subcategory-list">
                {category.subcategories.map((subcategory) => (
                  <span className="subcategory-chip" key={subcategory}>
                    {subcategory}
                    <button
                      onClick={() => removeSubcategory(category.id, subcategory)}
                      type="button"
                      aria-label={`Remove ${subcategory}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <form action={(formData) => addSubcategory(category.id, formData)} className="subcategory-form">
                <input name="subcategory" placeholder="Add subcategory" />
                <button className="mini-action muted" type="submit">Add</button>
              </form>
            </div>
            <div className="category-actions">
              <button
                className="icon-action"
                disabled={index === 0}
                onClick={() => moveCategory(category.id, -1)}
                type="button"
                aria-label={`Move ${category.name} up`}
              >
                <ChevronUp size={18} />
              </button>
              <button
                className="icon-action"
                disabled={index === categories.length - 1}
                onClick={() => moveCategory(category.id, 1)}
                type="button"
                aria-label={`Move ${category.name} down`}
              >
                <ChevronDown size={18} />
              </button>
              <button className="mini-action muted" onClick={() => toggleCategoryHidden(category.id)} type="button">
                {category.hidden ? "Show" : "Hide"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RequestsSection(props: {
  listings: Listing[];
  requests: RequestRecord[];
  certificates: TransferCertificateRecord[];
  acceptRequest: (id: string) => void;
  declineRequest: (id: string) => void;
  completeRequest: (id: string) => void;
}) {
  const { t, n } = useI18n();
  const awaitingMyAction = props.requests.filter((request) => request.status === "pending");
  const awaitingOtherParty = props.requests.filter((request) => request.status === "accepted" && request.timeline.length <= 2);
  const activeTransfers = props.requests.filter((request) => request.status === "accepted");
  const closedRequests = props.requests.filter((request) => request.status === "completed" || request.status === "declined" || request.status === "cancelled");

  const queueSummary = [
    { label: "Awaiting approval", value: awaitingMyAction.length, tone: awaitingMyAction.length ? "warning" : "success" },
    { label: "Awaiting other party", value: awaitingOtherParty.length, tone: awaitingOtherParty.length ? "info" : "success" },
    { label: "Active transfers", value: activeTransfers.length, tone: activeTransfers.length ? "warning" : "success" },
    { label: "Closed requests", value: closedRequests.length, tone: "info" },
  ];

  return (
    <section className="requests-queue-shell">
      <div className="requests-queue-hero">
        <div>
          <span className="eyebrow">{t("Requests")}</span>
          <h2>{t("Operational request queue")}</h2>
          <p>{t("Approve new requests, track handovers, and close redistribution work without mixing active and completed queues.")}</p>
        </div>
        <div className="requests-summary-grid" aria-label="Request queue summary">
          {queueSummary.map((item) => (
            <article key={item.label}>
              <span>{t(item.label)}</span>
              <strong>{n(item.value)}</strong>
              <em className={`status-pill ${item.tone}`}>{t(item.value ? "Open" : "Clear")}</em>
            </article>
          ))}
        </div>
      </div>

      <RequestQueueSection
        title="Awaiting my action"
        text="New requests that need approval, rejection, scheduling, or handover verification."
        icon={Handshake}
        emptyText="No requests need your action. New resource requests from Discover will appear here."
        requests={awaitingMyAction}
        listings={props.listings}
        certificates={props.certificates}
        acceptRequest={props.acceptRequest}
        declineRequest={props.declineRequest}
        completeRequest={props.completeRequest}
      />

      <RequestQueueSection
        title="Awaiting other party"
        text="Requests that are waiting for supplier response, recipient confirmation, or external transfer verification."
        icon={Clock3}
        emptyText="Nothing is waiting on another party right now."
        requests={awaitingOtherParty}
        listings={props.listings}
        certificates={props.certificates}
        acceptRequest={props.acceptRequest}
        declineRequest={props.declineRequest}
        completeRequest={props.completeRequest}
        passive
      />

      <RequestQueueSection
        title="Active transfers"
        text="Approved requests moving toward handover completion."
        icon={CheckCircle2}
        emptyText="Approved handovers will move here after a request is accepted."
        requests={activeTransfers}
        listings={props.listings}
        certificates={props.certificates}
        acceptRequest={props.acceptRequest}
        declineRequest={props.declineRequest}
        completeRequest={props.completeRequest}
      />

      <RequestQueueSection
        title="Completed and closed"
        text="Completed, rejected, or cancelled requests kept separate from active operations."
        icon={Archive}
        emptyText="Closed requests and certificate-ready handovers will appear here."
        requests={closedRequests}
        listings={props.listings}
        certificates={props.certificates}
        acceptRequest={props.acceptRequest}
        declineRequest={props.declineRequest}
        completeRequest={props.completeRequest}
        passive
      />
    </section>
  );
}

function requestStatusLabel(status: RequestStatus) {
  if (status === "pending") return "Awaiting approval";
  if (status === "accepted") return "Schedule handover";
  if (status === "completed") return "Certificate ready";
  if (status === "declined") return "Request declined";
  if (status === "cancelled") return "Request cancelled";
  return status;
}

function requestNextStep(status: RequestStatus, certificate?: TransferCertificateRecord) {
  if (status === "pending") return "Approve or decline this resource request.";
  if (status === "accepted") return "Schedule handover and verify transfer completion.";
  if (status === "completed" && certificate) return "Certificate ready for audit and sharing.";
  if (status === "completed") return "Completed handover recorded.";
  if (status === "declined") return "Closed after supplier declined the request.";
  if (status === "cancelled") return "Closed after cancellation.";
  return "Review request status.";
}

function RequestQueueSection({
  title,
  text,
  icon,
  emptyText,
  requests,
  listings,
  certificates,
  acceptRequest,
  declineRequest,
  completeRequest,
  passive = false,
}: {
  title: string;
  text: string;
  icon: typeof Handshake;
  emptyText: string;
  requests: RequestRecord[];
  listings: Listing[];
  certificates: TransferCertificateRecord[];
  acceptRequest: (id: string) => void;
  declineRequest: (id: string) => void;
  completeRequest: (id: string) => void;
  passive?: boolean;
}) {
  const { t, n } = useI18n();

  return (
    <section className="request-queue-section">
      <div className="dashboard-card-header">
        <PanelHeading icon={icon} title={title} text={text} />
        <span className="dashboard-count">{n(requests.length)}</span>
      </div>
      <div className="request-queue-list">
        {requests.length === 0 ? (
          <div className="empty-workspace-state">{t(emptyText)}</div>
        ) : requests.map((request) => {
          const listing = listings.find((item) => item.id === request.listingId);
          const certificate = certificates.find((item) => item.transaction_id === `txn-${request.id}`);
          const statusTone = request.status === "completed" ? "success" : request.status === "declined" || request.status === "cancelled" ? "danger" : request.status === "accepted" ? "info" : "warning";
          return (
            <article className="request-queue-card" key={request.id}>
              <div className="request-queue-main">
                <div className="request-reference-line">
                  <span>{t("Request ref")} {request.id}</span>
                  <em className={`status-pill ${statusTone}`}>{t(requestStatusLabel(request.status))}</em>
                </div>
                <h3>{listing ? t(listing.title) : t("Listing")}</h3>
                <p>{t(requestNextStep(request.status, certificate))}</p>
                <div className="request-meta-grid">
                  <div><span>{t("Supplier")}</span><strong>{listing ? t(listing.owner) : t("Unknown supplier")}</strong></div>
                  <div><span>{t("Recipient")}</span><strong>{request.receiverOrganization ?? t("Requesting organization")}</strong></div>
                  <div><span>{t("Quantity")}</span><strong>{n(request.quantity)} {listing ? t(listing.unit) : t("units")}</strong></div>
                  <div><span>{t("Location")}</span><strong>{listing ? `${t(listing.city)} / ${t(listing.area)}` : t("Pending location")}</strong></div>
                </div>
                <ol className="request-timeline">
                  {request.timeline.map((item) => <li key={item}>{t(item)}</li>)}
                </ol>
                {certificate && <CertificateCard certificate={certificate} compact />}
              </div>
              <div className="request-actions">
                {!passive && request.status === "pending" && (
                  <>
                    <button className="mini-action" onClick={() => acceptRequest(request.id)} type="button">{t("Approve")}</button>
                    <button className="mini-action muted" onClick={() => declineRequest(request.id)} type="button">{t("Decline")}</button>
                  </>
                )}
                {!passive && request.status === "accepted" && (
                  <button className="mini-action" onClick={() => completeRequest(request.id)} type="button">{t("Verify transfer")}</button>
                )}
                {request.status === "completed" && <CheckCircle2 className="done-icon" size={24} />}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TransfersSection(props: {
  listings: Listing[];
  requests: RequestRecord[];
  certificates: TransferCertificateRecord[];
  completeRequest: (id: string) => void;
}) {
  const { t, n } = useI18n();
  const readyForHandover = props.requests.filter((request) => request.status === "accepted");
  const verificationRequired = readyForHandover.filter((request) => !props.certificates.some((certificate) => certificate.transaction_id === `txn-${request.id}`));
  const completedTransfers = props.requests.filter((request) => request.status === "completed");
  const exceptions = props.requests.filter((request) => request.status === "declined" || request.status === "cancelled");

  const transferSummary = [
    { label: "Ready for handover", value: readyForHandover.length, tone: readyForHandover.length ? "warning" : "success" },
    { label: "Verification required", value: verificationRequired.length, tone: verificationRequired.length ? "warning" : "success" },
    { label: "Completed transfers", value: completedTransfers.length, tone: "info" },
    { label: "Exceptions or delays", value: exceptions.length, tone: exceptions.length ? "danger" : "success" },
  ];

  return (
    <section className="transfers-workspace-shell">
      <div className="transfers-workspace-hero">
        <div>
          <span className="eyebrow">{t("Transfers")}</span>
          <h2>{t("Handover and verification workspace")}</h2>
          <p>{t("Track accepted handovers, verify completed transfers, and find certificates without mixing active work with closed records.")}</p>
        </div>
        <div className="requests-summary-grid" aria-label="Transfer workspace summary">
          {transferSummary.map((item) => (
            <article key={item.label}>
              <span>{t(item.label)}</span>
              <strong>{n(item.value)}</strong>
              <em className={`status-pill ${item.tone}`}>{t(item.value ? "Open" : "Clear")}</em>
            </article>
          ))}
        </div>
      </div>

      <TransferQueueSection
        title="Ready for handover"
        text="Accepted requests ready for pickup, drop-off, or coordinated handover."
        icon={MapPin}
        emptyText="No accepted handovers are ready yet. Approved requests from Requests will appear here."
        requests={readyForHandover}
        listings={props.listings}
        certificates={props.certificates}
        completeRequest={props.completeRequest}
      />

      <TransferQueueSection
        title="Verification required"
        text="Transfers waiting for completion confirmation and certificate generation."
        icon={ShieldCheck}
        emptyText="No transfers currently require verification."
        requests={verificationRequired}
        listings={props.listings}
        certificates={props.certificates}
        completeRequest={props.completeRequest}
        verificationFocus
      />

      <TransferQueueSection
        title="Completed transfers"
        text="Closed handovers with certificate status shown when available."
        icon={QrCode}
        emptyText="Completed transfers and certificates will appear after handover verification."
        requests={completedTransfers}
        listings={props.listings}
        certificates={props.certificates}
        completeRequest={props.completeRequest}
        passive
      />

      <TransferQueueSection
        title="Exceptions and delays"
        text="Declined, cancelled, expired, or blocked handovers supported by the current request states."
        icon={Archive}
        emptyText="No transfer exceptions or delays are recorded."
        requests={exceptions}
        listings={props.listings}
        certificates={props.certificates}
        completeRequest={props.completeRequest}
        passive
      />
    </section>
  );
}

function transferStatusLabel(status: RequestStatus, certificate?: TransferCertificateRecord) {
  if (status === "accepted") return "Verification required";
  if (status === "completed" && certificate) return "Certificate ready";
  if (status === "completed") return "Completed transfer";
  if (status === "declined") return "Declined handover";
  if (status === "cancelled") return "Cancelled handover";
  return requestStatusLabel(status);
}

function transferNextStep(status: RequestStatus, certificate?: TransferCertificateRecord) {
  if (status === "accepted") return "Confirm handover completion to issue the transfer certificate.";
  if (status === "completed" && certificate) return "Certificate is available for audit and verification.";
  if (status === "completed") return "Completed transfer recorded.";
  if (status === "declined") return "No handover required after request rejection.";
  if (status === "cancelled") return "No handover required after cancellation.";
  return "Review transfer status.";
}

function TransferQueueSection({
  title,
  text,
  icon,
  emptyText,
  requests,
  listings,
  certificates,
  completeRequest,
  passive = false,
  verificationFocus = false,
}: {
  title: string;
  text: string;
  icon: typeof Handshake;
  emptyText: string;
  requests: RequestRecord[];
  listings: Listing[];
  certificates: TransferCertificateRecord[];
  completeRequest: (id: string) => void;
  passive?: boolean;
  verificationFocus?: boolean;
}) {
  const { t, n } = useI18n();

  return (
    <section className={verificationFocus ? "transfer-queue-section verification-focus" : "transfer-queue-section"}>
      <div className="dashboard-card-header">
        <PanelHeading icon={icon} title={title} text={text} />
        <span className="dashboard-count">{n(requests.length)}</span>
      </div>
      <div className="transfer-queue-list">
        {requests.length === 0 ? (
          <div className="empty-workspace-state">{t(emptyText)}</div>
        ) : requests.map((request) => {
          const listing = listings.find((item) => item.id === request.listingId);
          const certificate = certificates.find((item) => item.transaction_id === `txn-${request.id}`);
          const statusTone = request.status === "completed" ? "success" : request.status === "declined" || request.status === "cancelled" ? "danger" : "warning";
          return (
            <article className="transfer-card" key={request.id}>
              <div className="transfer-card-main">
                <div className="request-reference-line">
                  <span>{t("Transfer ref")} {request.id}</span>
                  <em className={`status-pill ${statusTone}`}>{t(transferStatusLabel(request.status, certificate))}</em>
                </div>
                <h3>{listing ? t(listing.title) : t("Listing")}</h3>
                <p>{t(transferNextStep(request.status, certificate))}</p>
                <div className="request-meta-grid">
                  <div><span>{t("Supplier")}</span><strong>{listing ? t(listing.owner) : t("Unknown supplier")}</strong></div>
                  <div><span>{t("Recipient")}</span><strong>{request.receiverOrganization ?? t("Requesting organization")}</strong></div>
                  <div><span>{t("Quantity")}</span><strong>{n(request.quantity)} {listing ? t(listing.unit) : t("units")}</strong></div>
                  <div><span>{t("Handover location")}</span><strong>{listing ? `${t(listing.city)} / ${t(listing.area)}` : t("Pending location")}</strong></div>
                  <div><span>{t("Handover method")}</span><strong>{t(request.handoverMethod)}</strong></div>
                  <div><span>{t("Certificate status")}</span><strong>{certificate ? t("Certificate ready") : t("Not issued yet")}</strong></div>
                </div>
                {certificate && <CertificateCard certificate={certificate} compact />}
              </div>
              <div className="transfer-actions">
                {!passive && request.status === "accepted" && (
                  <button className="mini-action transfer-verify-action" onClick={() => completeRequest(request.id)} type="button">
                    <ShieldCheck size={15} />
                    {t("Verify transfer")}
                  </button>
                )}
                {certificate && <CertificateBadge certificate={certificate} />}
                {request.status === "completed" && !certificate && <CheckCircle2 className="done-icon" size={24} />}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function MessagesSection(props: {
  conversation?: Conversation;
  listing?: Listing;
  messageDraft: string;
  setMessageDraft: (value: string) => void;
  sendMessage: () => void;
}) {
  return (
    <section className="workspace-panel message-panel">
      <PanelHeading icon={MessageSquare} title="Request conversation" text={props.listing ? `Linked to ${props.listing.title}` : "Create a request first to start a conversation."} />
      {!props.conversation ? (
        <div className="empty-workspace-state">No conversation yet.</div>
      ) : (
        <>
          <div className="message-list">
            {props.conversation.messages.map((message) => (
              <article className={message.sender === "Owner" ? "message owner" : "message"} key={message.id}>
                <strong>{message.sender}</strong>
                <p>{message.body}</p>
                <span>{message.at}</span>
              </article>
            ))}
          </div>
          <label>
            <span>Reply</span>
            <textarea value={props.messageDraft} onChange={(event) => props.setMessageDraft(event.target.value)} rows={3} />
          </label>
          <button className="button primary" onClick={props.sendMessage} type="button">
            <Send size={18} />
            Send message
          </button>
        </>
      )}
    </section>
  );
}

function GroupsSection(props: {
  groups: Group[];
  savedSearches: string[];
  listings: Listing[];
  toggleFollowGroup: (id: string) => void;
}) {
  return (
    <section className="workspace-grid two-column">
      <div className="workspace-panel">
        <PanelHeading icon={Users} title="Groups" text="Follow category/location groups for matching inventory alerts." />
        <div className="workspace-list">
          {props.groups.map((group) => (
            <article className="request-card" key={group.id}>
              <div>
                <h3>{group.name}</h3>
                <p>{group.category} · {group.city} · {group.members} members</p>
                <span>{props.listings.filter((listing) => listing.groupIds.includes(group.id)).length} linked listings</span>
              </div>
              <button className="mini-action" onClick={() => props.toggleFollowGroup(group.id)} type="button">
                {group.following ? "Following" : "Follow"}
              </button>
            </article>
          ))}
        </div>
      </div>
      <div className="workspace-panel">
        <PanelHeading icon={Bookmark} title="Saved searches" text="Local saved filters for notification rules later." />
        <div className="workspace-list">
          {props.savedSearches.map((search) => (
            <div className="saved-search" key={search}>{search}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NotificationsSection(props: {
  notifications: NotificationRecord[];
  markNotificationsRead: () => void;
}) {
  return (
    <section className="workspace-panel">
      <div className="panel-toolbar">
        <PanelHeading icon={Bell} title="Notifications" text="Local notification center for important workflow activity." />
        <button className="button secondary" onClick={props.markNotificationsRead} type="button">Mark all read</button>
      </div>
      <div className="workspace-list">
        {props.notifications.map((notification) => (
          <article className={notification.read ? "notification-card read" : "notification-card"} key={notification.id}>
            <strong>{notification.title}</strong>
            <p>{notification.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ModerationSection(props: {
  reports: Report[];
  listings: Listing[];
  resolveReport: (id: string) => void;
}) {
  return (
    <section className="workspace-panel">
      <PanelHeading icon={Flag} title="Moderation" text="Review reports and flagged listings before production admin tools." />
      <div className="workspace-list">
        {props.reports.length === 0 ? (
          <div className="empty-workspace-state">No reports. Use Report from a listing detail to test moderation.</div>
        ) : props.reports.map((report) => {
          const listing = props.listings.find((item) => item.id === report.listingId);
          return (
            <article className="request-card" key={report.id}>
              <div>
                <h3>{listing?.title ?? "Listing removed"}</h3>
                <p>{report.reason}</p>
                <span>{report.status}</span>
              </div>
              {report.status !== "resolved" && (
                <button className="mini-action" onClick={() => props.resolveReport(report.id)} type="button">Resolve</button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function verificationTone(status: VerificationStatus | LicenseStatus) {
  if (status === "Verified" || status === "Approved") return "success";
  if (status === "Pending review" || status === "Pending Review" || status === "Uploaded") return "info";
  if (status === "Needs changes") return "warning";
  if (status === "Rejected" || status === "Expired") return "danger";
  return "neutral";
}

function documentRecords(account: CompanyProfile) {
  return requiredVerificationDocuments.map((documentType) => {
    const record = account.licenses.find((license) => license.licenseType === documentType);
    return {
      documentType,
      record,
      status: record?.status ?? ("Uploaded" as LicenseStatus),
      expiry: record?.expiryDate,
      authority: record?.issuingAuthority ?? "Required for UAE verification policy",
    };
  });
}

function verificationSummaryStats(account: CompanyProfile) {
  const documents = documentRecords(account);
  return {
    total: documents.length,
    uploaded: documents.filter((document) => Boolean(document.record)).length,
    pending: documents.filter((document) => document.status === "Pending Review").length,
    approved: documents.filter((document) => document.status === "Approved").length,
    rejected: documents.filter((document) => document.status === "Rejected").length,
    expired: documents.filter((document) => document.status === "Expired").length,
  };
}

function VerificationBadge({
  level,
  status,
  compact = false,
}: {
  level: VerificationLevel;
  status: VerificationStatus;
  compact?: boolean;
}) {
  const { t } = useI18n();

  return (
    <span className={`verification-badge ${verificationTone(status)} ${compact ? "compact" : ""}`}>
      <ShieldCheck size={compact ? 13 : 15} />
      {compact ? t(level.replace(" Verified", "")) : `${t(level)} · ${t(status)}`}
    </span>
  );
}

function trustTone(level: TrustLevel) {
  if (level === "Platinum") return "platinum";
  if (level === "Gold") return "gold";
  if (level === "Silver") return "silver";
  return "bronze";
}

function TrustBadge({ score, compact = false }: { score: TrustScore; compact?: boolean }) {
  const { t, n } = useI18n();

  return (
    <span className={`trust-badge ${trustTone(score.level)} ${compact ? "compact" : ""}`}>
      <Award size={compact ? 13 : 15} />
      {compact ? `${t(score.level)} ${n(score.score)}` : `${t(score.level)} ${t("Trust")} · ${n(score.score)}/100`}
    </span>
  );
}

function TrustScoreCard({ score, compact = false }: { score: TrustScore; compact?: boolean }) {
  const { t, n } = useI18n();

  return (
    <article className={`trust-score-card ${trustTone(score.level)} ${compact ? "compact" : ""}`}>
      <div className="trust-score-meter" aria-label={`Trust score ${score.score} out of 100`}>
        <strong>{n(score.score)}</strong>
        <span>{t(score.level)}</span>
      </div>
      <div>
        <TrustBadge score={score} />
        <p>{t("Score range: Bronze 0-49, Silver 50-69, Gold 70-84, Platinum 85-100.")}</p>
      </div>
    </article>
  );
}

function TrustExplanationPanel({ score }: { score: TrustScore }) {
  const { t, n } = useI18n();

  return (
    <section className="workspace-panel trust-explanation-panel">
      <PanelHeading icon={ClipboardList} title="Why this score was earned" text="Transparent contribution from verification, workflow reliability, audit events, and document state." />
      <div className="trust-factor-list">
        {score.factors.map((factor) => (
          <article className={factor.points >= 0 ? "trust-factor positive" : "trust-factor negative"} key={factor.key}>
            <span>{factor.points >= 0 ? `+${n(factor.points)}` : n(factor.points)}</span>
            <div>
              <strong>{t(factor.label)}</strong>
              <p>{t(factor.detail)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function VerificationStatusCard({
  icon: Icon,
  label,
  value,
  tone = "neutral",
  text,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string | number;
  tone?: "neutral" | "success" | "info" | "warning" | "danger";
  text: string;
}) {
  const { t, n } = useI18n();

  return (
    <article className={`verification-status-card ${tone}`}>
      <Icon size={20} />
      <span>{t(label)}</span>
      <strong>{typeof value === "number" ? n(value) : t(String(value))}</strong>
      <p>{t(text)}</p>
    </article>
  );
}

function DocumentStatusCard({ document }: { document: ReturnType<typeof documentRecords>[number] }) {
  const { t } = useI18n();

  return (
    <article className={`document-status-card ${verificationTone(document.status)}`}>
      <div>
        <span>{t(document.documentType)}</span>
        <strong>{t(document.status)}</strong>
        <p>{document.record?.documentName ?? t("Metadata placeholder until upload flow is added.")}</p>
      </div>
      <div>
        <em>{document.record?.number ?? t("Required")}</em>
        <small>{document.expiry ? `${t("Expires")} ${document.expiry}` : t(document.authority)}</small>
      </div>
    </article>
  );
}

function AuditTimeline({ auditEvents, filterVerification = true }: { auditEvents: AuditEvent[]; filterVerification?: boolean }) {
  const events = filterVerification
    ? auditEvents.filter((event) => event.action.startsWith("verification") || event.action.startsWith("license"))
    : auditEvents;

  const timeline = events.length
    ? events
    : [
        audit("verification.submitted", "Demo Restaurant Group", "Verification package submitted for review."),
        audit("verification.approved", "Verifier", "Trade license approved."),
        audit("verification.rejected", "Verifier", "Government authorization returned for correction."),
        audit("verification.expired", "System", "Food permit marked expired."),
      ];

  return (
    <div className="verification-timeline">
      {timeline.map((event) => (
        <article key={event.id}>
          <span aria-hidden="true" />
          <div>
            <strong>{event.action}</strong>
            <p>{event.detail}</p>
            <small>{event.actor} · {event.at}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

function VerificationDashboardSection({
  account,
  auditEvents,
  submitVerification,
  trustScore,
}: {
  account: CompanyProfile;
  auditEvents: AuditEvent[];
  submitVerification: () => void;
  trustScore: TrustScore;
}) {
  const stats = verificationSummaryStats(account);
  const documents = documentRecords(account);
  const expiring = documents.filter((document) => document.status === "Expired" || (document.expiry && expiryStatus(document.expiry).urgent));

  return (
    <section className="workspace-section-stack">
      <div className="verification-hero-panel">
        <div>
          <span className="eyebrow">Trust and verification</span>
          <h2>{account.tradeName}</h2>
          <p>Production-shaped verification workspace for UAE launch readiness, document review, and audit history.</p>
        </div>
        <div className="hero-badge-stack">
          <VerificationBadge level={account.verificationLevel} status={account.verificationStatus} />
          <TrustBadge score={trustScore} />
        </div>
      </div>

      <div className="verification-card-grid">
        <VerificationStatusCard icon={ShieldCheck} label="Current level" value={account.verificationLevel} tone="success" text="Organization capability tier for controlled workflows." />
        <VerificationStatusCard icon={Clock3} label="Status" value={account.verificationStatus} tone={verificationTone(account.verificationStatus)} text={account.verificationNotes} />
        <VerificationStatusCard icon={ClipboardList} label="Pending reviews" value={stats.pending} tone="info" text="Documents or profile changes waiting for reviewer action." />
        <VerificationStatusCard icon={FileText} label="Expiring documents" value={expiring.length} tone={expiring.length ? "danger" : "success"} text="Expired or urgent renewal records requiring follow-up." />
      </div>

      <div className="workspace-grid two-column">
        <TrustScoreCard score={trustScore} />
        <TrustExplanationPanel score={trustScore} />
        <section className="workspace-panel">
          <PanelHeading icon={FileText} title="Document readiness" text="Required UAE verification documents and current review states." />
          <div className="document-card-list">
            {documents.slice(0, 5).map((document) => (
              <DocumentStatusCard document={document} key={document.documentType} />
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="panel-toolbar">
            <PanelHeading icon={History} title="Verification history" text="Audit events relevant to submission, review, rejection, and expiry." />
            <button className="button secondary" onClick={submitVerification} type="button">Submit review</button>
          </div>
          <AuditTimeline auditEvents={auditEvents} />
        </section>
      </div>
    </section>
  );
}

function VerificationDocumentsSection({
  account,
  addLicenseRecord,
}: {
  account: CompanyProfile;
  addLicenseRecord: (formData: FormData) => void;
}) {
  const documents = documentRecords(account);
  const stats = verificationSummaryStats(account);

  return (
    <section className="workspace-section-stack">
      <section className="workspace-panel">
        <div className="panel-toolbar">
          <PanelHeading icon={FileText} title="Verification documents" text="Required document states for UAE-first organization verification." />
          <VerificationBadge level={account.verificationLevel} status={account.verificationStatus} />
        </div>
        <div className="verification-mini-stats">
          <Metric label="uploaded" value={`${stats.uploaded}/${stats.total}`} />
          <Metric label="pending" value={stats.pending} />
          <Metric label="approved" value={stats.approved} />
          <Metric label="rejected" value={stats.rejected} />
          <Metric label="expired" value={stats.expired} />
        </div>
        <div className="document-card-grid">
          {documents.map((document) => (
            <DocumentStatusCard document={document} key={document.documentType} />
          ))}
        </div>
      </section>

      <section className="workspace-panel">
        <PanelHeading icon={PackagePlus} title="Add document metadata" text="Local preview only. Upload screens and private storage policies remain future work." />
        <form action={addLicenseRecord} className="publish-form">
          <label>
            <span>Document type</span>
            <select name="licenseType" defaultValue="Trade License">
              {requiredVerificationDocuments.map((document) => <option key={document}>{document}</option>)}
            </select>
          </label>
          <label>
            <span>Number</span>
            <input name="number" required />
          </label>
          <label>
            <span>Issuing authority</span>
            <input name="issuingAuthority" required />
          </label>
          <label>
            <span>Expiry date</span>
            <input name="expiryDate" type="date" required />
          </label>
          <label className="wide-field">
            <span>Document reference</span>
            <input name="documentName" placeholder="trade-license.pdf" />
          </label>
          <button className="button primary wide-field" type="submit">Add document for review</button>
        </form>
      </section>
    </section>
  );
}

function OrganizationProfileSection({
  account,
  organization,
  city,
  locations,
  team,
  trustScore,
  certificates,
}: {
  account: CompanyProfile;
  organization: string;
  city: string;
  locations: OrganizationLocation[];
  team: TeamMember[];
  trustScore: TrustScore;
  certificates: TransferCertificateRecord[];
}) {
  const stats = verificationSummaryStats(account);

  return (
    <section className="workspace-section-stack">
      <section className="organization-profile-hero">
        <div>
          <span className="eyebrow">Organization profile</span>
          <h2>{organization}</h2>
          <p>{account.businessActivity}</p>
        </div>
        <div className="hero-badge-stack">
          <VerificationBadge level={account.verificationLevel} status={account.verificationStatus} />
          <TrustBadge score={trustScore} />
        </div>
      </section>

      <div className="workspace-grid two-column">
        <section className="workspace-panel">
          <PanelHeading icon={Building2} title="Verification summary" text="Public-safe organization trust context for listings and workspace decisions." />
          <VerificationSummary account={account} />
          <div className="profile-facts">
            <span>{account.accountType}</span>
            <span>{account.emirate} / {city}</span>
            <span>{stats.approved} approved documents</span>
            <span>{stats.pending} pending reviews</span>
          </div>
        </section>

        <section className="workspace-panel">
          <PanelHeading icon={Award} title="Trust score" text="Reputation summary for organization reliability." />
          <TrustScoreCard score={trustScore} />
        </section>
      </div>

      <div className="workspace-grid two-column">
        <TrustExplanationPanel score={trustScore} />

        <section className="workspace-panel">
          <PanelHeading icon={MapPin} title="Branches and members" text="Operational context used for future country, branch, and role scoping." />
          <div className="workspace-list">
            {locations.map((location) => (
              <article className="setting-row" key={location.id}>
                <strong>{location.label}</strong>
                <span>{location.emirate} / {location.area}</span>
              </article>
            ))}
            {team.map((member) => (
              <article className="setting-row" key={member.id}>
                <strong>{member.name}</strong>
                <span>{member.role} · {member.status}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="workspace-grid two-column">
        <CertificateSummaryPanel certificates={certificates} />
        <section className="workspace-panel">
          <PanelHeading icon={QrCode} title="Certificate readiness" text="Completed transfers create immutable QR-verifiable proof." />
          <div className="profile-facts">
            <span>{certificates.length} issued certificates</span>
            <span>PDF layout ready</span>
            <span>Public QR verification</span>
            <span>Audit history enabled</span>
          </div>
        </section>
      </div>
    </section>
  );
}

function AdminVerificationReviewSection({
  account,
  auditEvents,
}: {
  account: CompanyProfile;
  auditEvents: AuditEvent[];
}) {
  const documents = documentRecords(account);
  const queue = [
    { label: "Pending reviews", status: "Pending Review", documents: documents.filter((document) => document.status === "Pending Review") },
    { label: "Approved", status: "Approved", documents: documents.filter((document) => document.status === "Approved") },
    { label: "Rejected", status: "Rejected", documents: documents.filter((document) => document.status === "Rejected") },
    { label: "Expired", status: "Expired", documents: documents.filter((document) => document.status === "Expired") },
  ];

  return (
    <section className="workspace-section-stack">
      <div className="verification-hero-panel">
        <div>
          <span className="eyebrow">Admin review queue</span>
          <h2>Verification review</h2>
          <p>First review queue for pending, approved, rejected, and expired verification records.</p>
        </div>
        <span className="status-pill info">Reviewer preview</span>
      </div>

      <div className="admin-review-grid">
        {queue.map((group) => (
          <section className="workspace-panel" key={group.label}>
            <PanelHeading icon={ClipboardList} title={group.label} text={`${group.documents.length} document record${group.documents.length === 1 ? "" : "s"}.`} />
            <div className="document-card-list">
              {group.documents.length ? group.documents.map((document) => (
                <DocumentStatusCard document={document} key={document.documentType} />
              )) : <div className="empty-workspace-state">No records in this queue.</div>}
            </div>
          </section>
        ))}
      </div>

      <section className="workspace-panel">
        <PanelHeading icon={History} title="Review audit timeline" text="Verification events visible to authorized reviewers." />
        <AuditTimeline auditEvents={auditEvents} />
      </section>
    </section>
  );
}

function AdminTrustOverviewSection({
  scenarios,
  currentOrganization,
  currentScore,
}: {
  scenarios: TrustScenario[];
  currentOrganization: string;
  currentScore: TrustScore;
}) {
  const organizations = [
    { id: "current", organization: currentOrganization, score: currentScore, history: [{ label: "Current", score: currentScore.score, at: "Now" }, { label: "Previous", score: Math.max(0, currentScore.score - 4), at: "Last review" }] },
    ...scenarios,
  ].sort((a, b) => b.score.score - a.score.score);
  const topOrganizations = organizations.slice(0, 3);
  const lowestOrganizations = [...organizations].sort((a, b) => a.score.score - b.score.score).slice(0, 3);

  return (
    <section className="workspace-section-stack">
      <div className="verification-hero-panel">
        <div>
          <span className="eyebrow">Admin trust overview</span>
          <h2>Trust score monitoring</h2>
          <p>Platform-wide reputation view for top performers, lowest trust organizations, and score movement.</p>
        </div>
        <span className="status-pill info">Score engine preview</span>
      </div>

      <div className="workspace-grid two-column">
        <section className="workspace-panel">
          <PanelHeading icon={TrendingUp} title="Top organizations" text="Highest current trust scores across the platform preview." />
          <div className="trust-admin-list">
            {topOrganizations.map((item) => (
              <article key={item.id}>
                <strong>{item.organization}</strong>
                <TrustBadge score={item.score} />
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <PanelHeading icon={TrendingDown} title="Lowest trust organizations" text="Organizations needing review, support, or risk intervention." />
          <div className="trust-admin-list">
            {lowestOrganizations.map((item) => (
              <article key={item.id}>
                <strong>{item.organization}</strong>
                <TrustBadge score={item.score} />
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="workspace-panel">
        <PanelHeading icon={History} title="Score history" text="Recent score movements and levels for review context." />
        <div className="trust-history-grid">
          {organizations.map((item) => (
            <article className="trust-history-card" key={item.id}>
              <div>
                <strong>{item.organization}</strong>
                <TrustBadge score={item.score} compact />
              </div>
              <div className="trust-history-bars">
                {item.history.map((entry) => (
                  <span key={`${item.id}-${entry.label}`} style={{ "--score": `${entry.score}%` } as CSSProperties}>
                    <em>{entry.label}</em>
                    <b>{entry.score}</b>
                    <small>{entry.at}</small>
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function SettingsSection({
  account,
  locations,
  team,
  auditEvents,
  updateCompanyProfile,
  addLicenseRecord,
  submitVerification,
  addLocation,
  inviteTeamMember,
}: {
  account: CompanyProfile;
  locations: OrganizationLocation[];
  team: TeamMember[];
  auditEvents: AuditEvent[];
  updateCompanyProfile: (formData: FormData) => void;
  addLicenseRecord: (formData: FormData) => void;
  submitVerification: () => void;
  addLocation: (formData: FormData) => void;
  inviteTeamMember: (formData: FormData) => void;
}) {
  return (
    <section className="workspace-section-stack">
      <section className="workspace-panel">
        <div className="panel-toolbar">
          <PanelHeading icon={ShieldCheck} title="Company verification profile" text="Maintain the company or supplier details required for approval." />
          <button className="button secondary" onClick={submitVerification} type="button">Submit verification</button>
        </div>
        <VerificationSummary account={account} />
        <form action={updateCompanyProfile} className="publish-form expanded-form">
          <label>
            <span>Account type</span>
            <select name="accountType" defaultValue={account.accountType}>
              <option>Supplier</option>
              <option>Company</option>
            </select>
          </label>
          <label>
            <span>Legal name</span>
            <input name="legalName" defaultValue={account.legalName} required />
          </label>
          <label>
            <span>Trade name</span>
            <input name="tradeName" defaultValue={account.tradeName} required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" defaultValue={account.email} required />
          </label>
          <label>
            <span>Phone</span>
            <input name="phone" defaultValue={account.phone} required />
          </label>
          <label>
            <span>Website</span>
            <input name="website" type="url" defaultValue={account.website} placeholder="https://..." />
          </label>
          <label>
            <span>Emirate</span>
            <select name="emirate" defaultValue={account.emirate}>
              <option>Dubai</option>
              <option>Abu Dhabi</option>
              <option>Sharjah</option>
              <option>Ajman</option>
              <option>Ras Al Khaimah</option>
              <option>Fujairah</option>
              <option>Umm Al Quwain</option>
            </select>
          </label>
          <label>
            <span>City</span>
            <input name="city" defaultValue={account.city} required />
          </label>
          <label>
            <span>TRN</span>
            <input name="trn" defaultValue={account.trn} />
          </label>
          <label>
            <span>Business category</span>
            <select name="businessCategory" defaultValue={account.businessCategory}>
              {dubaiBusinessCategories.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Business subcategory</span>
            <select name="businessSubcategory" defaultValue={account.businessSubcategory}>
              {dubaiBusinessCategories.map((category) => (
                <optgroup label={category.name} key={category.name}>
                  {category.subcategories.map((subcategory) => (
                    <option key={`${category.name}-${subcategory}`}>{subcategory}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="wide-field">
            <span>Business activity</span>
            <input name="businessActivity" defaultValue={account.businessActivity} required />
          </label>
          <label className="wide-field">
            <span>Registered address</span>
            <textarea name="address" rows={3} defaultValue={account.address} required />
          </label>
          <label>
            <span>Authorized person</span>
            <input name="authorizedPerson" defaultValue={account.authorizedPerson} required />
          </label>
          <label>
            <span>Role</span>
            <input name="authorizedRole" defaultValue={account.authorizedRole} required />
          </label>
          <label>
            <span>Authorized email</span>
            <input name="authorizedEmail" type="email" defaultValue={account.authorizedEmail} required />
          </label>
          <label>
            <span>Authorized phone</span>
            <input name="authorizedPhone" defaultValue={account.authorizedPhone} required />
          </label>
          <RequiredDocumentsField selectedDocuments={account.documents} />
          <button className="button primary wide-field" type="submit">Save verification profile</button>
        </form>
      </section>

      <div className="workspace-grid two-column">
        <section className="workspace-panel">
          <PanelHeading icon={FileText} title="Licenses and permits" text="Add trade, food, municipality, warehouse, or charity approvals." />
          <form action={addLicenseRecord} className="publish-form">
            <label className="wide-field">
              <span>License or permit type</span>
              <select name="licenseType" defaultValue="Trade License">
                <option>Trade License</option>
                <option>VAT/TRN</option>
                <option>Food Permit</option>
                <option>Storage Permit</option>
                <option>NGO License</option>
                <option>Government Authorization</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              <span>Number</span>
              <input name="number" required />
            </label>
            <label>
              <span>Issuing authority</span>
              <input name="issuingAuthority" required placeholder="DED, Municipality, FTA..." />
            </label>
            <label>
              <span>Issue date</span>
              <input name="issueDate" type="date" />
            </label>
            <label>
              <span>Expiry date</span>
              <input name="expiryDate" type="date" required />
            </label>
            <label className="wide-field">
              <span>Document file</span>
              <input name="documentFile" type="file" accept=".pdf,.png,.jpg,.jpeg" />
            </label>
            <label className="wide-field">
              <span>Document reference</span>
              <input name="documentName" placeholder="Use when a file is not attached in local preview" />
            </label>
            <button className="button primary wide-field" type="submit">Add license for review</button>
          </form>
        </section>

        <section className="workspace-panel">
          <PanelHeading icon={ClipboardList} title="Attached records" text="Current review queue for the company profile." />
          <LicenseList licenses={account.licenses} />
          <div className="document-checklist">
            {account.documents.map((document) => (
              <span key={document}>{document}</span>
            ))}
          </div>
        </section>
      </div>

      <div className="workspace-grid two-column">
        <section className="workspace-panel">
          <PanelHeading icon={MapPin} title="UAE locations" text="Manage pickup and handover points for listings." />
          <form action={addLocation} className="publish-form">
            <label className="wide-field">
              <span>Location label</span>
              <input name="label" placeholder="Dubai central warehouse" />
            </label>
            <label>
              <span>Emirate</span>
              <select name="emirate" defaultValue="Dubai">
                <option>Dubai</option>
                <option>Abu Dhabi</option>
                <option>Sharjah</option>
                <option>Ajman</option>
                <option>Ras Al Khaimah</option>
                <option>Fujairah</option>
                <option>Umm Al Quwain</option>
              </select>
            </label>
            <label>
              <span>Area</span>
              <input name="area" placeholder="Al Quoz, Mussafah, JLT..." />
            </label>
            <button className="button primary wide-field" type="submit">Add location</button>
          </form>
          <div className="workspace-list">
            {locations.map((location) => (
              <article className="setting-row" key={location.id}>
                <strong>{location.label}</strong>
                <span>{location.emirate} / {location.area}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <PanelHeading icon={Users} title="Team and roles" text="Preview organization permissions before Supabase auth." />
          <form action={inviteTeamMember} className="publish-form">
            <label className="wide-field">
              <span>Name</span>
              <input name="name" placeholder="Team member name" />
            </label>
            <label className="wide-field">
              <span>Role</span>
              <select name="role" defaultValue="Inventory manager">
                <option>Owner admin</option>
                <option>Inventory manager</option>
                <option>Requester</option>
                <option>Moderator</option>
              </select>
            </label>
            <button className="button primary wide-field" type="submit">Invite locally</button>
          </form>
          <div className="workspace-list">
            {team.map((member) => (
              <article className="setting-row" key={member.id}>
                <strong>{member.name}</strong>
                <span>{member.role} · {member.status}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <AuditPanel auditEvents={auditEvents} />
    </section>
  );
}

function AuditPanel({ auditEvents }: { auditEvents: AuditEvent[] }) {
  return (
    <section className="workspace-panel">
      <PanelHeading icon={ShieldCheck} title="Audit trail" text="Local activity history for controlled workflow decisions." />
      <div className="audit-list">
        {auditEvents.map((event) => (
          <article className="audit-row" key={event.id}>
            <div>
              <strong>{event.action}</strong>
              <p>{event.detail}</p>
            </div>
            <span>{event.actor} · {event.at}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function VerificationSummary({ account }: { account: CompanyProfile }) {
  const required = [
    account.legalName,
    account.tradeName,
    account.email,
    account.phone,
    account.address,
    account.businessActivity,
    account.authorizedPerson,
    account.authorizedRole,
    account.authorizedEmail,
    account.authorizedPhone,
  ];
  const completeProfile = required.filter(Boolean).length;
  const activeLicenses = account.licenses.filter((license) => license.status !== "Expired").length;
  const statusClass = account.verificationStatus.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="verification-summary">
      <div>
        <span className={`verification-status ${statusClass}`}>{account.verificationStatus}</span>
        <strong>{account.legalName}</strong>
        <p>{account.businessCategory} / {account.businessSubcategory}</p>
        <p>{account.verificationNotes}</p>
      </div>
      <div className="verification-metrics">
        <Metric label="profile fields" value={`${completeProfile}/${required.length}`} />
        <Metric label="license records" value={activeLicenses} />
        <Metric label="documents" value={account.documents.length} />
      </div>
    </div>
  );
}

function RequiredDocumentsField({ selectedDocuments }: { selectedDocuments: string[] }) {
  return (
    <fieldset className="required-documents wide-field">
      <legend>Required verification documents</legend>
      {requiredVerificationDocuments.map((document) => (
        <label key={document}>
          <input
            name="documents"
            type="checkbox"
            value={document}
            defaultChecked={selectedDocuments.includes(document)}
          />
          <span>{document}</span>
        </label>
      ))}
    </fieldset>
  );
}

function LicenseList({ licenses }: { licenses: LicenseRecord[] }) {
  return (
    <div className="license-list">
      {licenses.length === 0 ? (
        <div className="empty-workspace-state">No license records yet.</div>
      ) : licenses.map((license) => (
        <article className="license-card" key={license.id}>
          <div>
            <strong>{license.licenseType}</strong>
            <p>{license.number} · {license.issuingAuthority}</p>
            <span>{license.documentName}</span>
          </div>
          <div>
            <em>{license.status}</em>
            <span>Expires {license.expiryDate || "not set"}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  const { t } = useI18n();

  return (
    <div className="metric-card">
      <strong>{value}</strong>
      <span>{t(label)}</span>
    </div>
  );
}

function PanelHeading({ icon: Icon, title, text }: { icon: typeof Globe2; title: string; text: string }) {
  const { t } = useI18n();

  return (
    <div className="panel-heading">
      <Icon size={23} />
      <div>
        <h2>{t(title)}</h2>
        <p>{t(text)}</p>
      </div>
    </div>
  );
}
