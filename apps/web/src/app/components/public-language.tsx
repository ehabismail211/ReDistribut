"use client";

import { useEffect, useState } from "react";

type Locale = "en" | "ar";

const storageKey = "redist-language";

const ar: Record<string, string> = {
  "Home": "الرئيسية",
  "How It Works": "كيف يعمل",
  "Suppliers": "للموردين",
  "Recipients": "للمستفيدين",
  "FAQ": "الأسئلة الشائعة",
  "Contact": "تواصل معنا",
  "Workspace": "مساحة العمل",
  "Request pilot conversation": "اطلب محادثة تجريبية",
  "Request a pilot conversation": "اطلب محادثة تجريبية",
  "UAE-first redistribution management": "إدارة إعادة التوزيع في الإمارات أولا",
  "Redistribute surplus resources with trust, evidence, and impact.": "أعد توزيع الموارد الفائضة بثقة وإثبات وأثر.",
  "ReDist helps verified UAE organizations move usable surplus from listing to request, handover, certificate, and impact tracking.": "تساعد ReDist المؤسسات الموثقة في الإمارات على نقل الفائض القابل للاستخدام من العرض إلى الطلب والتسليم والشهادة وتتبع الأثر.",
  "See how it works": "اعرف كيف يعمل",
  "Founder-guided pilot status": "حالة التجربة بإرشاد المؤسس",
  "Controlled UAE workflows": "مسارات عمل مضبوطة في الإمارات",
  "Access is qualified and staged. Public impact claims will wait for completed, approved real transfers.": "الوصول مؤهل وممرحَل. لن تُنشر أي ادعاءات أثر عامة إلا بعد اكتمال تحويلات حقيقية واعتمادها.",
  "Why ReDist": "لماذا ReDist",
  "Useful surplus should not disappear into informal coordination.": "الفائض المفيد لا ينبغي أن يضيع في تنسيق غير منظم.",
  "Many organizations hold resources that could be reused, but redistribution is often slowed by unclear requests, manual follow-up, missing evidence, and trust questions.": "تمتلك مؤسسات كثيرة موارد يمكن إعادة استخدامها، لكن إعادة التوزيع تتباطأ بسبب الطلبات غير الواضحة والمتابعة اليدوية وغياب الإثبات وأسئلة الثقة.",
  "One workflow for responsible redistribution": "مسار واحد لإعادة توزيع مسؤولة",
  "Suppliers, recipients, and administrators get a structured operating path: list available resources, request what is needed, coordinate handover, verify completion, and preserve evidence.": "يحصل الموردون والمستفيدون والمشرفون على مسار تشغيلي منظم: عرض الموارد المتاحة، طلب المطلوب، تنسيق التسليم، التحقق من الإكمال، وحفظ الإثبات.",
  "Who needs this resource?": "من يحتاج هذا المورد؟",
  "Is the organization verified?": "هل المؤسسة موثقة؟",
  "What quantity is available?": "ما الكمية المتاحة؟",
  "Who approves the request?": "من يوافق على الطلب؟",
  "What evidence exists after completion?": "ما الإثبات المتوفر بعد الإكمال؟",
  "Choose your path": "اختر مسارك",
  "Built for suppliers, recipients, and partners.": "مصمم للموردين والمستفيدين والشركاء.",
  "I have surplus resources": "لدي موارد فائضة",
  "List available surplus, review recipient requests, approve handovers, and keep evidence of completed transfers.": "اعرض الفائض المتاح، راجع طلبات المستفيدين، وافق على التسليمات، واحتفظ بإثبات التحويلات المكتملة.",
  "For suppliers": "للموردين",
  "I need resources": "أحتاج إلى موارد",
  "Discover available resources, request what your organization needs, and track transfer status through handover.": "اكتشف الموارد المتاحة، اطلب ما تحتاجه مؤسستك، وتابع حالة التحويل حتى التسليم.",
  "For recipients": "للمستفيدين",
  "I want to partner": "أرغب في الشراكة",
  "Support a UAE-first circular economy workflow with practical verification and certificate evidence.": "ادعم مسار اقتصاد دائري في الإمارات مع تحقق عملي وإثبات بالشهادات.",
  "For partners": "للشركاء",
  "Learn more": "اعرف المزيد",
  "How it works": "كيف يعمل",
  "From surplus to evidence in six steps.": "من الفائض إلى الإثبات في ست خطوات.",
  "Trust by design": "الثقة منذ التصميم",
  "Organization-to-organization, not anonymous browsing.": "من مؤسسة إلى مؤسسة، وليس تصفحا مجهولا.",
  "Controlled pilot access": "وصول تجريبي مضبوط",
  "ReDist is currently preparing founder-guided UAE pilot workflows. Public impact results will be shared only after real transfers are completed and approved for publication.": "تعمل ReDist حاليا على تجهيز مسارات تجربة في الإمارات بإرشاد المؤسس. لن تُشارك نتائج أثر عامة إلا بعد اكتمال تحويلات حقيقية واعتمادها للنشر.",
  "Verified organization workflow": "مسار عمل لمؤسسات موثقة",
  "Supplier approval before handover": "موافقة المورد قبل التسليم",
  "Transfer status tracking": "تتبع حالة التحويل",
  "Certificate-backed completion evidence": "إثبات إكمال مدعوم بشهادة",
  "Impact metrics tied to completed workflows": "مؤشرات أثر مرتبطة بمسارات مكتملة",
  "Impact visibility": "وضوح الأثر",
  "Make redistribution visible without overclaiming.": "اجعل إعادة التوزيع واضحة من دون مبالغة في الادعاءات.",
  "ReDist is designed to help organizations understand value recovered, items redistributed, waste diverted, certificate evidence, and recipient usefulness once transfers are completed.": "صُممت ReDist لمساعدة المؤسسات على فهم القيمة المستردة، والعناصر المعاد توزيعها، والنفايات التي تم تجنبها، وإثبات الشهادات، وفائدة المستفيد بعد اكتمال التحويلات.",
  "AED value recovered": "القيمة المستردة بالدرهم",
  "Items redistributed": "العناصر المعاد توزيعها",
  "Waste diverted": "النفايات المحولة عن الهدر",
  "Certificate evidence": "إثبات الشهادة",
  "Designed to track after completed, verified workflows. No public real pilot results are claimed yet.": "مصمم للتتبع بعد اكتمال مسارات موثقة. لا توجد حتى الآن ادعاءات نتائج تجريبية عامة حقيقية.",
  "Ready to test a guided redistribution workflow?": "هل أنت مستعد لاختبار مسار إعادة توزيع موجه؟",
  "Start with a founder conversation. ReDist is looking for UAE organizations and ecosystem partners who can validate practical, trusted redistribution workflows.": "ابدأ بمحادثة مع المؤسس. تبحث ReDist عن مؤسسات وشركاء في الإمارات للتحقق من مسارات إعادة توزيع عملية وموثوقة.",
  "Controlled pilot": "تجربة مضبوطة",
  "ReDist certificates are operational evidence of a platform workflow. They are not legal guarantees, government approvals, safety certifications, tax receipts, or audited ESG certificates.": "شهادات ReDist هي إثبات تشغيلي لمسار عمل داخل المنصة. وهي ليست ضمانات قانونية أو موافقات حكومية أو شهادات سلامة أو إيصالات ضريبية أو شهادات ESG مدققة.",
  "UAE-first redistribution management for verified organizations. Founder-guided pilot preparation is underway.": "إدارة إعادة توزيع في الإمارات أولا للمؤسسات الموثقة. يجري حاليا تجهيز التجربة بإرشاد المؤسس.",
  "A practical workflow for verified redistribution.": "مسار عملي لإعادة توزيع موثقة.",
  "ReDist gives organizations a structured way to list resources, discover available surplus, submit requests, coordinate handovers, verify completion, and track impact evidence.": "تمنح ReDist المؤسسات طريقة منظمة لعرض الموارد، واكتشاف الفائض المتاح، وتقديم الطلبات، وتنسيق التسليم، والتحقق من الإكمال، وتتبع إثبات الأثر.",
  "Workflow": "مسار العمل",
  "List, Discover, Request, Transfer, Verify, Impact.": "اعرض، اكتشف، اطلب، حوّل، تحقق، أثر.",
  "Create a listing with practical details such as resource name, quantity, condition, location, urgency, supplier organization, and handover notes.": "أنشئ عرضا بتفاصيل عملية مثل اسم المورد، الكمية، الحالة، الموقع، الأولوية، مؤسسة المورد، وملاحظات التسليم.",
  "Suppliers keep control over what gets released and which requests are approved.": "يحافظ الموردون على التحكم فيما يتم إصداره والطلبات التي تتم الموافقة عليها.",
  "Discover available resources by category, location, urgency, quantity, condition, and supplier context.": "اكتشف الموارد المتاحة حسب الفئة والموقع والأولوية والكمية والحالة وسياق المورد.",
  "Submit structured requests and track status through approval, handover, verification, and certificate review.": "قدّم طلبات منظمة وتابع الحالة من الموافقة إلى التسليم والتحقق ومراجعة الشهادة.",
  "Evidence": "الإثبات",
  "Verification and impact are tied to completed workflows.": "التحقق والأثر مرتبطان بالمسارات المكتملة.",
  "ReDist is designed to preserve evidence after handover, but impact claims should be based on completed transfers and clearly labeled estimates.": "صُممت ReDist لحفظ الإثبات بعد التسليم، لكن ادعاءات الأثر يجب أن تستند إلى تحويلات مكتملة وتقديرات موضحة بوضوح.",
  "Turn surplus resources into verified redistribution.": "حوّل الموارد الفائضة إلى إعادة توزيع موثقة.",
  "ReDist helps suppliers list available surplus, review recipient requests, coordinate handovers, and keep certificate-backed evidence after completion.": "تساعد ReDist الموردين على عرض الفائض المتاح، ومراجعة طلبات المستفيدين، وتنسيق التسليم، وحفظ إثبات مدعوم بالشهادات بعد الإكمال.",
  "Become a pilot supplier": "انضم كمورد تجريبي",
  "Supplier value": "قيمة المورد",
  "Keep control while making surplus useful.": "حافظ على التحكم مع جعل الفائض مفيدا.",
  "List surplus responsibly": "اعرض الفائض بمسؤولية",
  "Make usable resources visible with quantity, condition, location, and handover details.": "اجعل الموارد القابلة للاستخدام مرئية مع الكمية والحالة والموقع وتفاصيل التسليم.",
  "Review every request": "راجع كل طلب",
  "Approve, decline, or clarify requests before any resource moves forward.": "وافق أو ارفض أو وضح الطلبات قبل انتقال أي مورد.",
  "Coordinate handover": "نسق التسليم",
  "Keep pickup readiness, timing, and access instructions clear.": "اجعل جاهزية الاستلام والتوقيت وتعليمات الوصول واضحة.",
  "Keep evidence": "احتفظ بالإثبات",
  "Completed transfers can produce certificate-backed operational evidence.": "يمكن للتحويلات المكتملة إنتاج إثبات تشغيلي مدعوم بالشهادة.",
  "Good early categories": "فئات مناسبة للبداية",
  "Furniture and fixtures": "الأثاث والتجهيزات",
  "Reusable warehouse materials": "مواد مستودعات قابلة لإعادة الاستخدام",
  "Cartons, packaging, and storage bins": "كرتون وتغليف وصناديق تخزين",
  "Non-sensitive equipment": "معدات غير حساسة",
  "Packaged non-perishable supplies": "مستلزمات معبأة غير سريعة التلف",
  "Categories that need review": "فئات تحتاج إلى مراجعة",
  "Prepared food, medical items, hazardous goods, regulated goods, or legally sensitive categories require separate review and may not be accepted for early pilot workflows.": "الأطعمة الجاهزة، والمواد الطبية، والبضائع الخطرة، والبضائع المنظمة، أو الفئات الحساسة قانونيا تحتاج إلى مراجعة منفصلة وقد لا تُقبل في مسارات التجربة المبكرة.",
  "Have one low-risk surplus category to test?": "هل لديك فئة فائض منخفضة المخاطر للاختبار؟",
  "The ideal first supplier can assign one responsible contact, complete one guided workflow within two weeks, and provide direct feedback.": "المورد الأول المثالي يستطيع تعيين جهة اتصال مسؤولة واحدة، وإكمال مسار موجه خلال أسبوعين، وتقديم ملاحظات مباشرة.",
  "Request supplier pilot consideration": "اطلب تقييمك كمورد تجريبي",
  "Discover available surplus resources from verified organizations.": "اكتشف موارد فائضة متاحة من مؤسسات موثقة.",
  "ReDist helps recipient organizations find resources, submit requests, track handovers, and receive evidence after completed transfers.": "تساعد ReDist المؤسسات المستفيدة على إيجاد الموارد، وتقديم الطلبات، وتتبع التسليم، واستلام الإثبات بعد اكتمال التحويلات.",
  "Become a pilot recipient": "انضم كمستفيد تجريبي",
  "Recipient value": "قيمة المستفيد",
  "Find resources with clarity before requesting.": "اعثر على الموارد بوضوح قبل تقديم الطلب.",
  "Discover available surplus": "اكتشف الفائض المتاح",
  "Find resources by practical details such as category, location, condition, and urgency.": "ابحث عن الموارد حسب تفاصيل عملية مثل الفئة والموقع والحالة والأولوية.",
  "Understand handover fit": "افهم ملاءمة التسليم",
  "Review quantity, city, supplier context, and pickup notes before requesting.": "راجع الكمية والمدينة وسياق المورد وملاحظات الاستلام قبل الطلب.",
  "Track request status": "تابع حالة الطلب",
  "Follow the workflow through supplier review, handover, verification, and completion.": "تابع مسار العمل عبر مراجعة المورد والتسليم والتحقق والإكمال.",
  "Receive evidence": "استلم الإثبات",
  "Completed transfers can provide certificate-backed operational evidence for internal records.": "يمكن للتحويلات المكتملة توفير إثبات تشغيلي مدعوم بالشهادة للسجلات الداخلية.",
  "Who this is for": "لمن هذا",
  "NGOs and charities": "المنظمات غير الربحية والجمعيات الخيرية",
  "Community support organizations": "مؤسسات دعم المجتمع",
  "Schools and training centers": "المدارس ومراكز التدريب",
  "Social enterprises": "المؤسسات الاجتماعية",
  "Approved organizational recipients": "المستفيدون المؤسسيون المعتمدون",
  "What recipients can request": "ما الذي يمكن للمستفيدين طلبه",
  "Early pilot categories should stay low-risk: furniture, shelving, storage bins, cartons, non-sensitive equipment, training supplies, and packaged non-perishable resources.": "يجب أن تبقى فئات التجربة المبكرة منخفضة المخاطر: الأثاث، الرفوف، صناديق التخزين، الكرتون، المعدات غير الحساسة، مستلزمات التدريب، والموارد المعبأة غير سريعة التلف.",
  "Need practical resources for your organization?": "هل تحتاج مؤسستك إلى موارد عملية؟",
  "The ideal first recipient has a real resource need, one responsible contact, pickup or handover capacity, and willingness to provide feedback.": "المستفيد الأول المثالي لديه حاجة حقيقية للموارد، وجهة اتصال مسؤولة واحدة، وقدرة على الاستلام أو التسليم، واستعداد لتقديم الملاحظات.",
  "Request recipient pilot consideration": "اطلب تقييمك كمستفيد تجريبي",
  "Answers before your founder conversation.": "إجابات قبل محادثتك مع المؤسس.",
  "Understand the ReDist pilot model, supplier and recipient workflows, verification, certificates, impact boundaries, and launch limits.": "افهم نموذج تجربة ReDist، ومسارات الموردين والمستفيدين، والتحقق، والشهادات، وحدود الأثر، وقيود الإطلاق.",
  "Contact founder": "تواصل مع المؤسس",
  "Still have questions?": "هل ما زالت لديك أسئلة؟",
  "Send a short inquiry and the founder can route you to the right supplier, recipient, partner, or pilot conversation.": "أرسل استفسارا قصيرا وسيوجهك المؤسس إلى محادثة المورد أو المستفيد أو الشريك أو التجربة المناسبة.",
  "Contact ReDist": "تواصل مع ReDist",
  "Start with a founder conversation.": "ابدأ بمحادثة مع المؤسس.",
  "Tell us whether you have surplus resources, need resources, want to partner, or want to discuss ReDist's controlled UAE pilot.": "أخبرنا إن كان لديك موارد فائضة، أو تحتاج إلى موارد، أو ترغب في الشراكة، أو تريد مناقشة تجربة ReDist المضبوطة في الإمارات.",
  "Complete the form": "أكمل النموذج",
  "Lead capture": "تسجيل الاستفسار",
  "Request pilot consideration or a founder walkthrough.": "اطلب تقييمك للتجربة أو جولة مع المؤسس.",
  "Do not submit sensitive documents through this form. Pilot access is controlled and reviewed before any organization is invited.": "لا ترسل مستندات حساسة عبر هذا النموذج. الوصول للتجربة مضبوط وتتم مراجعته قبل دعوة أي مؤسسة.",
  "What happens next": "ماذا يحدث بعد ذلك",
  "The founder reviews the inquiry.": "يراجع المؤسس الاستفسار.",
  "Qualified organizations are invited to a short discovery conversation.": "تُدعى المؤسسات المؤهلة إلى محادثة تعريفية قصيرة.",
  "Potential pilot participants are assessed for safe category fit.": "يتم تقييم المشاركين المحتملين في التجربة من حيث ملاءمة الفئات الآمنة.",
  "Protected pilot access is shared only after qualification.": "لا تتم مشاركة الوصول المحمي للتجربة إلا بعد التأهيل.",
  "No public self-serve launch, real pilot results, or audited ESG impact claims are implied by this form.": "لا يعني هذا النموذج إطلاقا عاما ذاتي الخدمة أو نتائج تجربة حقيقية أو ادعاءات أثر ESG مدققة.",
  "Full name": "الاسم الكامل",
  "Work email": "البريد الإلكتروني للعمل",
  "Phone": "الهاتف",
  "Organization": "المؤسسة",
  "Role / title": "الدور / المسمى الوظيفي",
  "City / emirate": "المدينة / الإمارة",
  "Interest type": "نوع الاهتمام",
  "Organization type": "نوع المؤسسة",
  "Timeline": "الإطار الزمني",
  "Resource category, need, or partnership idea": "فئة المورد أو الحاجة أو فكرة الشراكة",
  "I consent to ReDist contacting me about this inquiry. I understand this form should not be used to submit sensitive documents.": "أوافق على أن تتواصل معي ReDist بخصوص هذا الاستفسار. أفهم أن هذا النموذج لا يجب استخدامه لإرسال مستندات حساسة.",
  "Website": "الموقع الإلكتروني",
  "Submit inquiry": "إرسال الاستفسار",
  "Submitting...": "جار الإرسال...",
  "Inquiry sent to founder review.": "تم إرسال الاستفسار لمراجعة المؤسس.",
  "Your inquiry has been captured as a ReDist lead record. The founder will review pilot fit before any workspace access is shared.": "تم تسجيل استفسارك كسجل اهتمام في ReDist. سيراجع المؤسس ملاءمة التجربة قبل مشاركة أي وصول لمساحة العمل.",
  "Submit another inquiry": "إرسال استفسار آخر",
  "Pilot interest": "اهتمام بالتجربة",
  "Supplier inquiry": "استفسار مورد",
  "Recipient inquiry": "استفسار مستفيد",
  "Partnership request": "طلب شراكة",
  "Impact / ESG discussion": "نقاش الأثر / ESG",
  "Founder walkthrough": "جولة مع المؤسس",
  "General question": "سؤال عام",
  "Select one": "اختر واحدا",
  "Hotel / hospitality": "فندق / ضيافة",
  "Restaurant / food service": "مطعم / خدمات طعام",
  "Warehouse / logistics": "مستودع / لوجستيات",
  "NGO / charity": "منظمة غير ربحية / جمعية خيرية",
  "School / training center": "مدرسة / مركز تدريب",
  "Corporate ESG / sustainability": "استدامة / ESG للشركات",
  "Other": "أخرى",
  "Immediate": "فوري",
  "2 weeks": "أسبوعان",
  "1 month": "شهر واحد",
  "Later": "لاحقا",
  "List": "اعرض",
  "Discover": "اكتشف",
  "Request": "اطلب",
  "Transfer": "حوّل",
  "Verify": "تحقق",
  "Impact": "الأثر",
  "Suppliers list available surplus with quantity, condition, location, urgency, and handover notes.": "يعرض الموردون الفائض المتاح مع الكمية والحالة والموقع والأولوية وملاحظات التسليم.",
  "Recipients discover available resources by practical details such as category, city, quantity, and supplier context.": "يكتشف المستفيدون الموارد المتاحة عبر تفاصيل عملية مثل الفئة والمدينة والكمية وسياق المورد.",
  "Recipients submit structured requests and suppliers review before approving any handover.": "يقدم المستفيدون طلبات منظمة ويراجعها الموردون قبل الموافقة على أي تسليم.",
  "Approved requests move into handover coordination with clear next steps for both organizations.": "تنتقل الطلبات المعتمدة إلى تنسيق التسليم بخطوات تالية واضحة للمؤسستين.",
  "Completion is verified through the workflow before certificate evidence is reviewed.": "يتم التحقق من الإكمال عبر مسار العمل قبل مراجعة إثبات الشهادة.",
  "Completed transfers can support value, item, waste diversion, certificate, and usefulness evidence.": "يمكن للتحويلات المكتملة دعم إثبات القيمة والعنصر وتحويل النفايات والشهادة والفائدة.",
  "Built for organization-to-organization redistribution, not anonymous consumer browsing.": "مصمم لإعادة التوزيع بين المؤسسات، وليس للتصفح الاستهلاكي المجهول.",
  "Suppliers review requests and control what quantity moves forward before handover.": "يراجع الموردون الطلبات ويتحكمون في الكمية التي تنتقل قبل التسليم.",
  "Completed transfers can create operational evidence tied to a platform workflow.": "يمكن للتحويلات المكتملة إنشاء إثبات تشغيلي مرتبط بمسار عمل المنصة.",
  "ReDist is designed to track recovered value, redistributed items, and waste diversion from completed transfers.": "صُممت ReDist لتتبع القيمة المستردة، والعناصر المعاد توزيعها، والنفايات المحولة عن الهدر من التحويلات المكتملة.",
};

const placeholderTranslations: Record<string, string> = {
  "Dubai, Abu Dhabi, Sharjah...": "دبي، أبوظبي، الشارقة...",
  "Tell us what surplus you have, what resources you need, or how you want to partner.": "أخبرنا ما الفائض المتاح لديك، أو الموارد التي تحتاجها، أو كيف ترغب في الشراكة.",
};

function readLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(storageKey);
  return stored === "ar" || stored === "en" ? stored : "en";
}

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function translate(value: string, locale: Locale) {
  if (locale === "en") return value;
  return ar[normalize(value)] ?? value;
}

function applyPublicLanguage(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  document.body.dataset.locale = locale;
  document.body.dataset.dir = locale === "ar" ? "rtl" : "ltr";

  const page = document.querySelector<HTMLElement>(".mkt-page");
  if (!page) return;

  page.lang = locale;
  page.dir = locale === "ar" ? "rtl" : "ltr";

  const reverse = new Map(Object.entries(ar).map(([english, arabic]) => [arabic, english]));
  const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      return normalize(node.textContent ?? "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  for (const node of nodes) {
    const current = normalize(node.textContent ?? "");
    if (!current) continue;
    if (locale === "ar" && ar[current]) {
      node.textContent = ar[current];
    } else if (locale === "en" && reverse.has(current)) {
      node.textContent = reverse.get(current) ?? current;
    }
  }

  page.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[placeholder]").forEach((element) => {
    const current = normalize(element.placeholder);
    const reversePlaceholder = new Map(Object.entries(placeholderTranslations).map(([english, arabic]) => [arabic, english]));
    if (locale === "ar" && placeholderTranslations[current]) {
      element.placeholder = placeholderTranslations[current];
    } else if (locale === "en" && reversePlaceholder.has(current)) {
      element.placeholder = reversePlaceholder.get(current) ?? current;
    }
  });
}

export function PublicLanguageController() {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    setLocale(readLocale());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, locale);
    applyPublicLanguage(locale);

    const observer = new MutationObserver(() => applyPublicLanguage(locale));
    const page = document.querySelector(".mkt-page");
    if (page) observer.observe(page, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  return (
    <div className="mkt-language-switcher" aria-label="Language">
      <button className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")} type="button">
        EN
      </button>
      <button className={locale === "ar" ? "active" : ""} onClick={() => setLocale("ar")} type="button">
        عربي
      </button>
    </div>
  );
}
