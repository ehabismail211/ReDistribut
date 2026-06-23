"use client";

import { useEffect, useState } from "react";

type Locale = "en" | "ar";

const storageKey = "redist-language";

const ar: Record<string, string> = {
  "Home": "الرئيسية",
  "How It Works": "كيف يعمل",
  "Suppliers": "للموردين",
  "Recipients": "للمستفيدين",
  "Help Center": "مركز المساعدة",
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
  "Supplier approval control": "تحكم المورد في الموافقة",
  "Suppliers review requests and control what quantity moves forward before handover.": "يراجع الموردون الطلبات ويتحكمون في الكمية التي تنتقل قبل التسليم.",
  "Completed transfers can create operational evidence tied to a platform workflow.": "يمكن للتحويلات المكتملة إنشاء إثبات تشغيلي مرتبط بمسار عمل المنصة.",
  "ReDist is designed to track recovered value, redistributed items, and waste diversion from completed transfers.": "صُممت ReDist لتتبع القيمة المستردة، والعناصر المعاد توزيعها، والنفايات المحولة عن الهدر من التحويلات المكتملة.",
  "General": "عام",
  "Trust and verification": "الثقة والتحقق",
  "Impact, pilot, and launch": "الأثر والتجربة والإطلاق",
  "What is ReDist?": "ما هي ReDist؟",
  "ReDist is a UAE-first redistribution management platform for verified organizations. It helps organizations list surplus resources, discover available resources, submit requests, coordinate handovers, verify completion, and track impact evidence.": "ReDist منصة إماراتية لإدارة إعادة التوزيع بين المؤسسات الموثقة. تساعد المؤسسات على عرض الموارد الفائضة، واكتشاف الموارد المتاحة، وتقديم الطلبات، وتنسيق التسليم، والتحقق من الإكمال، وتتبع إثبات الأثر.",
  "Is ReDist a marketplace?": "هل ReDist سوق إلكتروني؟",
  "ReDist is not designed as a consumer marketplace. It is an organization-to-organization redistribution workflow built around trust, approval, handover evidence, and impact visibility.": "ReDist ليست مصممة كسوق استهلاكي. إنها مسار إعادة توزيع بين المؤسسات مبني حول الثقة والموافقة وإثبات التسليم ووضوح الأثر.",
  "Who is ReDist for?": "لمن صُممت ReDist؟",
  "ReDist is for suppliers with usable surplus, recipients that need resources, administrators who manage verification, and partners who support circular economy activity.": "ReDist مخصصة للموردين الذين لديهم فائض قابل للاستخدام، والمستفيدين الذين يحتاجون إلى موارد، والمشرفين الذين يديرون التحقق، والشركاء الذين يدعمون أنشطة الاقتصاد الدائري.",
  "Is ReDist live publicly?": "هل ReDist متاحة للعامة الآن؟",
  "ReDist is preparing founder-guided UAE pilot workflows. Public self-serve access is not the current launch mode.": "تجهز ReDist حاليا مسارات تجربة في الإمارات بإرشاد المؤسس. الوصول العام ذاتي الخدمة ليس نموذج الإطلاق الحالي.",
  "What problem does ReDist solve?": "ما المشكلة التي تحلها ReDist؟",
  "ReDist helps organizations move from informal surplus coordination to a structured workflow with listings, requests, handovers, certificates, and impact tracking.": "تساعد ReDist المؤسسات على الانتقال من تنسيق الفائض غير الرسمي إلى مسار منظم يشمل العروض والطلبات والتسليمات والشهادات وتتبع الأثر.",
  "Why is ReDist UAE-first?": "لماذا تبدأ ReDist من الإمارات؟",
  "The UAE has strong hospitality, logistics, retail, NGO, and ESG activity. ReDist is starting there to validate a focused operating model before broader expansion.": "تمتلك الإمارات نشاطا قويا في الضيافة واللوجستيات والتجزئة والمؤسسات غير الربحية والاستدامة. تبدأ ReDist من هناك للتحقق من نموذج تشغيلي مركز قبل التوسع الأوسع.",
  "What does redistribution mean?": "ماذا تعني إعادة التوزيع؟",
  "Redistribution means moving usable surplus resources from one organization to another organization that can use them.": "إعادة التوزيع تعني نقل الموارد الفائضة القابلة للاستخدام من مؤسسة إلى مؤسسة أخرى تستطيع الاستفادة منها.",
  "What does surplus mean?": "ماذا يعني الفائض؟",
  "Surplus means usable resources an organization no longer needs, has in excess, or wants to redirect before they become waste or idle inventory.": "الفائض يعني موارد قابلة للاستخدام لم تعد المؤسسة بحاجة إليها، أو لديها منها كمية زائدة، أو تريد توجيهها قبل أن تصبح هدرا أو مخزونا خاملا.",
  "Who can become a supplier?": "من يمكنه أن يصبح موردا؟",
  "UAE organizations with usable surplus may apply for pilot consideration. Early supplier fit depends on category safety, responsible contact availability, and willingness to complete one guided workflow.": "يمكن للمؤسسات في الإمارات التي لديها فائض قابل للاستخدام التقدم للتقييم ضمن التجربة. تعتمد ملاءمة المورد المبكرة على سلامة الفئة، وتوفر جهة اتصال مسؤولة، والاستعداد لإكمال مسار موجه واحد.",
  "What can suppliers list?": "ما الذي يمكن للموردين عرضه؟",
  "Pilot-safe examples include furniture, fixtures, reusable warehouse materials, cartons, bins, non-sensitive equipment, and packaged non-perishable supplies.": "تشمل الأمثلة الآمنة للتجربة الأثاث والتجهيزات ومواد المستودعات القابلة لإعادة الاستخدام والكرتون والصناديق والمعدات غير الحساسة والمستلزمات المعبأة غير سريعة التلف.",
  "Can restaurants list food?": "هل يمكن للمطاعم عرض الطعام؟",
  "Food-adjacent workflows may require additional compliance review. ReDist should not begin with prepared food unless safety, handling, and legal requirements are reviewed.": "قد تحتاج مسارات الطعام أو ما حوله إلى مراجعة امتثال إضافية. لا ينبغي أن تبدأ ReDist بالطعام الجاهز ما لم تتم مراجعة متطلبات السلامة والتعامل والمتطلبات القانونية.",
  "Can hotels list surplus furniture?": "هل يمكن للفنادق عرض الأثاث الفائض؟",
  "Yes, hotel furniture and fixtures are strong examples of practical early pilot categories if condition, quantity, and pickup details are clear.": "نعم، أثاث الفنادق وتجهيزاتها أمثلة قوية لفئات تجربة مبكرة عملية إذا كانت الحالة والكمية وتفاصيل الاستلام واضحة.",
  "Can warehouses list pallets or cartons?": "هل يمكن للمستودعات عرض المنصات أو الكرتون؟",
  "Yes, reusable warehouse materials such as pallets, cartons, bins, and packaging are strong early pilot examples.": "نعم، مواد المستودعات القابلة لإعادة الاستخدام مثل المنصات والكرتون والصناديق والتغليف أمثلة قوية للتجربة المبكرة.",
  "Does a supplier have to accept every request?": "هل يجب على المورد قبول كل طلب؟",
  "No. Suppliers review requests before approving or declining.": "لا. يراجع الموردون الطلبات قبل الموافقة أو الرفض.",
  "Can suppliers control quantity?": "هل يمكن للموردين التحكم في الكمية؟",
  "Yes. Suppliers should list available quantity and approve only the quantity they are willing to transfer.": "نعم. يجب على الموردين عرض الكمية المتاحة والموافقة فقط على الكمية التي يرغبون في تحويلها.",
  "What does a supplier receive after a transfer?": "ماذا يحصل المورد بعد التحويل؟",
  "A supplier can receive operational evidence of the completed transfer, including certificate-backed confirmation where supported.": "يمكن للمورد الحصول على إثبات تشغيلي للتحويل المكتمل، بما في ذلك تأكيد مدعوم بالشهادة عند توفره.",
  "Who can become a recipient?": "من يمكنه أن يصبح مستفيدا؟",
  "Recipients may include NGOs, charities, community organizations, schools, training centers, social enterprises, or approved organizations with real resource needs.": "قد يشمل المستفيدون المنظمات غير الربحية والجمعيات الخيرية والمؤسسات المجتمعية والمدارس ومراكز التدريب والمؤسسات الاجتماعية أو المؤسسات المعتمدة ذات الاحتياجات الحقيقية للموارد.",
  "How do recipients find resources?": "كيف يجد المستفيدون الموارد؟",
  "Recipients use Discover to view available surplus by practical details such as category, location, quantity, condition, urgency, and supplier context.": "يستخدم المستفيدون صفحة الاكتشاف لعرض الفائض المتاح حسب تفاصيل عملية مثل الفئة والموقع والكمية والحالة والأولوية وسياق المورد.",
  "Can recipients request any resource?": "هل يمكن للمستفيدين طلب أي مورد؟",
  "Recipients can submit requests for available resources, but supplier approval and category eligibility still apply.": "يمكن للمستفيدين تقديم طلبات للموارد المتاحة، لكن موافقة المورد وأهلية الفئة ما زالت مطلوبة.",
  "Does ReDist guarantee that requests are approved?": "هل تضمن ReDist الموافقة على الطلبات؟",
  "No. Suppliers review and decide whether to approve requests.": "لا. يراجع الموردون الطلبات ويقررون ما إذا كانوا سيوافقون عليها.",
  "Can recipients request partial quantities?": "هل يمكن للمستفيدين طلب كميات جزئية؟",
  "The workflow is designed to support practical quantity decisions. For early pilot workflows, the founder may help clarify partial request handling.": "صُمم مسار العمل لدعم قرارات الكمية العملية. في مسارات التجربة المبكرة، قد يساعد المؤسس في توضيح التعامل مع الطلبات الجزئية.",
  "Can individuals request resources?": "هل يمكن للأفراد طلب الموارد؟",
  "ReDist is designed for organization-to-organization workflows, not individual consumer requests.": "ReDist مصممة لمسارات بين المؤسسات، وليس لطلبات المستهلكين الأفراد.",
  "What happens after a request is approved?": "ماذا يحدث بعد الموافقة على الطلب؟",
  "The workflow moves toward handover coordination, verification, certificate review, and impact tracking.": "ينتقل مسار العمل إلى تنسيق التسليم والتحقق ومراجعة الشهادة وتتبع الأثر.",
  "Can recipients use certificates for reporting?": "هل يمكن للمستفيدين استخدام الشهادات للتقارير؟",
  "Certificates may support internal evidence, but they are operational records, not audited ESG certificates or legal documents.": "قد تدعم الشهادات الإثبات الداخلي، لكنها سجلات تشغيلية وليست شهادات ESG مدققة أو مستندات قانونية.",
  "Are organizations verified?": "هل يتم توثيق المؤسسات؟",
  "ReDist is designed around verified organization workflows. Early pilot participation is founder-guided and controlled.": "صُممت ReDist حول مسارات عمل لمؤسسات موثقة. المشاركة المبكرة في التجربة موجهة ومضبوطة من المؤسس.",
  "What does verification mean?": "ماذا يعني التحقق؟",
  "Verification may include organization identity, responsible contact, eligibility, and category review. It does not mean ReDist guarantees every outcome.": "قد يشمل التحقق هوية المؤسسة وجهة الاتصال المسؤولة والأهلية ومراجعة الفئة. ولا يعني أن ReDist تضمن كل نتيجة.",
  "Does ReDist inspect every item?": "هل تفحص ReDist كل عنصر؟",
  "No. ReDist is not an inspection service. Suppliers and recipients remain responsible for accurate descriptions and handover confirmation.": "لا. ReDist ليست خدمة فحص. يبقى الموردون والمستفيدون مسؤولين عن دقة الوصف وتأكيد التسليم.",
  "Does ReDist guarantee item quality?": "هل تضمن ReDist جودة العناصر؟",
  "No. ReDist does not guarantee item quality, suitability, safety, or legal compliance.": "لا. لا تضمن ReDist جودة العناصر أو ملاءمتها أو سلامتها أو امتثالها القانوني.",
  "What is a ReDist certificate?": "ما هي شهادة ReDist؟",
  "A ReDist certificate is operational evidence that a transfer workflow was completed in the platform.": "شهادة ReDist هي إثبات تشغيلي بأن مسار تحويل اكتمل داخل المنصة.",
  "Is a certificate a legal document?": "هل الشهادة مستند قانوني؟",
  "No. It is not a legal guarantee, tax receipt, safety certificate, government approval, or audited ESG certificate.": "لا. هي ليست ضمانا قانونيا أو إيصالا ضريبيا أو شهادة سلامة أو موافقة حكومية أو شهادة ESG مدققة.",
  "Can certificates be verified?": "هل يمكن التحقق من الشهادات؟",
  "ReDist is designed to support certificate verification and referenceable transfer evidence.": "صُممت ReDist لدعم التحقق من الشهادات وإثبات التحويل القابل للرجوع إليه.",
  "Can certificates be disputed?": "هل يمكن الاعتراض على الشهادات؟",
  "Yes. Certificate disputes should be reviewed through the support and dispute process.": "نعم. يجب مراجعة نزاعات الشهادات عبر مسار الدعم وحل النزاعات.",
  "What impact does ReDist track?": "ما الأثر الذي تتبعه ReDist؟",
  "ReDist is designed to track value recovered, items redistributed, waste diverted, certificate evidence, and recipient usefulness.": "صُممت ReDist لتتبع القيمة المستردة، والعناصر المعاد توزيعها، والنفايات المحولة عن الهدر، وإثبات الشهادات، وفائدة المستفيدين.",
  "Does ReDist have real impact results yet?": "هل لدى ReDist نتائج أثر حقيقية حتى الآن؟",
  "No public real pilot impact results are available yet. ReDist should publish results only after completed, verified workflows and participant approval.": "لا توجد حتى الآن نتائج أثر حقيقية عامة للتجربة. ينبغي أن تنشر ReDist النتائج فقط بعد اكتمال مسارات موثقة وموافقة المشاركين.",
  "Are CO2 metrics available?": "هل تتوفر مؤشرات CO2؟",
  "Environmental estimates may be possible where defensible data exists, but they must be clearly labeled and should not be treated as audited claims.": "قد تكون التقديرات البيئية ممكنة عند توفر بيانات يمكن الدفاع عنها، لكن يجب وسمها بوضوح وعدم التعامل معها كادعاءات مدققة.",
  "Can organizations use ReDist for ESG reporting?": "هل يمكن للمؤسسات استخدام ReDist لتقارير ESG؟",
  "ReDist can support evidence gathering for ESG conversations, but formal ESG reporting requires appropriate methodology and review.": "يمكن لـ ReDist دعم جمع الإثباتات لمحادثات ESG، لكن التقارير الرسمية تتطلب منهجية مناسبة ومراجعة.",
  "What is the current pilot status?": "ما حالة التجربة الحالية؟",
  "ReDist is prepared for founder-guided UAE Pilot Wave 1. The first real live organization workflows are pending.": "ReDist جاهزة لموجة التجربة الأولى في الإمارات بإرشاد المؤسس. ما زالت أول مسارات المؤسسات الحقيقية الحية قيد الانتظار.",
  "How can an organization join the pilot?": "كيف يمكن لمؤسسة الانضمام إلى التجربة؟",
  "Organizations can request a founder conversation and may be invited if they fit the pilot criteria.": "يمكن للمؤسسات طلب محادثة مع المؤسس وقد تتم دعوتها إذا كانت مناسبة لمعايير التجربة.",
  "What categories are not suitable for the first pilot?": "ما الفئات غير المناسبة للتجربة الأولى؟",
  "Hazardous, medical, regulated, legally sensitive, unsafe, or unclear categories are not suitable for the first pilot.": "الفئات الخطرة أو الطبية أو المنظمة أو الحساسة قانونيا أو غير الآمنة أو غير الواضحة ليست مناسبة للتجربة الأولى.",
  "Does ReDist charge during the pilot?": "هل تفرض ReDist رسوما أثناء التجربة؟",
  "The recommended early pilot model is founder-guided and free while value and willingness to pay are validated.": "النموذج المقترح للتجربة المبكرة موجه من المؤسس ومجاني أثناء التحقق من القيمة والاستعداد للدفع.",
  "Terms": "الشروط",
  "Privacy": "الخصوصية",
  "Legal framework": "إطار قانوني",
  "Terms framework for responsible redistribution.": "إطار شروط لإعادة توزيع مسؤولة.",
  "This page summarizes the ReDist Terms of Service framework for public review. It is not final legal advice and must be reviewed by qualified UAE legal counsel before commercial use.": "تلخص هذه الصفحة إطار شروط خدمة ReDist للمراجعة العامة. وهي ليست نصيحة قانونية نهائية ويجب مراجعتها من مستشار قانوني مؤهل في الإمارات قبل الاستخدام التجاري.",
  "Review notice": "تنبيه المراجعة",
  "Framework pending formal UAE legal review.": "إطار بانتظار مراجعة قانونية رسمية في الإمارات.",
  "ReDist is currently operated as a founder-guided platform and pilot workflow. These terms concepts explain intended responsibilities and limitations, but they do not replace a finalized legal agreement.": "تعمل ReDist حاليا كمنصة ومسار تجربة بإرشاد المؤسس. توضح مفاهيم الشروط هذه المسؤوليات والقيود المقصودة، لكنها لا تستبدل اتفاقية قانونية نهائية.",
  "Scope of service": "نطاق الخدمة",
  "ReDist provides a platform workflow for verified or pilot-approved organizations to list surplus resources, discover available resources, submit and review requests, coordinate handovers, record transfer completion, generate certificate-backed platform evidence, and view impact summaries.": "توفر ReDist مسار عمل للمنصة يتيح للمؤسسات الموثقة أو المعتمدة للتجربة عرض الموارد الفائضة، واكتشاف الموارد المتاحة، وتقديم الطلبات ومراجعتها، وتنسيق التسليمات، وتسجيل إكمال التحويل، وإنشاء إثبات منصة مدعوم بالشهادة، وعرض ملخصات الأثر.",
  "ReDist is not a logistics provider, payment processor, escrow provider, tax advisor, legal title transfer service, food safety certifier, customs broker, or government regulator.": "ReDist ليست مزود خدمات لوجستية أو معالج مدفوعات أو مزود ضمان مالي أو مستشارا ضريبيا أو خدمة نقل ملكية قانونية أو جهة اعتماد سلامة غذائية أو وسيط جمارك أو جهة تنظيم حكومية.",
  "User and organization responsibilities": "مسؤوليات المستخدم والمؤسسة",
  "Provide accurate account, organization, listing, request, handover, and feedback information.": "تقديم معلومات دقيقة عن الحساب والمؤسسة والعرض والطلب والتسليم والملاحظات.",
  "Use ReDist only through authorized organization representatives and approved workflow roles.": "استخدام ReDist فقط عبر ممثلي المؤسسة المخولين وأدوار سير العمل المعتمدة.",
  "Confirm that listed resources are lawful, usable, controlled by the organization, and suitable for redistribution.": "تأكيد أن الموارد المعروضة قانونية وقابلة للاستخدام وتحت سيطرة المؤسسة ومناسبة لإعادة التوزيع.",
  "Follow internal safety, compliance, approval, and handover procedures before completing any transfer.": "اتباع إجراءات السلامة والامتثال والموافقة والتسليم الداخلية قبل إكمال أي تحويل.",
  "Report incorrect information, unsafe content, disputes, suspicious activity, or unauthorized access promptly.": "الإبلاغ فورا عن المعلومات غير الصحيحة أو المحتوى غير الآمن أو النزاعات أو النشاط المشبوه أو الوصول غير المصرح به.",
  "Platform limitations": "حدود المنصة",
  "ReDist facilitates workflow coordination and evidence, but does not independently inspect every resource.": "تسهل ReDist تنسيق مسار العمل والإثبات، لكنها لا تفحص كل مورد بشكل مستقل.",
  "ReDist does not guarantee resource quality, safety, legality, suitability, or handover completion.": "لا تضمن ReDist جودة المورد أو سلامته أو قانونيته أو ملاءمته أو إكمال تسليمه.",
  "Verification indicates reviewed information or documents; it is not a government approval or future conduct guarantee.": "يشير التحقق إلى مراجعة معلومات أو مستندات؛ وليس موافقة حكومية أو ضمانا للسلوك المستقبلي.",
  "Transfer certificates are operational platform evidence, not tax invoices, payment receipts, customs documents, legal title documents, or audited ESG certificates.": "شهادات التحويل هي إثبات تشغيلي من المنصة، وليست فواتير ضريبية أو إيصالات دفع أو مستندات جمركية أو مستندات ملكية قانونية أو شهادات ESG مدققة.",
  "Impact values and environmental estimates should be treated as platform-supported estimates unless separately audited.": "يجب التعامل مع قيم الأثر والتقديرات البيئية كتقديرات مدعومة من المنصة ما لم يتم تدقيقها بشكل منفصل.",
  "Disputes and restrictions": "النزاعات والقيود",
  "A dispute can be raised for incorrect listing details, quantity mismatch, failed handover, certificate errors, or verification concerns.": "يمكن رفع نزاع بسبب تفاصيل عرض غير صحيحة أو عدم تطابق الكمية أو فشل التسليم أو أخطاء الشهادة أو مخاوف التحقق.",
  "ReDist may preserve audit evidence, pause a workflow, request clarification from the parties, and mark certificates as corrected, disputed, revoked, or closed where appropriate.": "قد تحتفظ ReDist بإثباتات التدقيق، أو توقف مسار العمل، أو تطلب توضيحا من الأطراف، أو تضع علامة على الشهادات كمصححة أو متنازع عليها أو ملغاة أو مغلقة عند اللزوم.",
  "Founder or platform review may result in account, category, listing, request, certificate, or access restrictions when risk is identified.": "قد تؤدي مراجعة المؤسس أو المنصة إلى قيود على الحساب أو الفئة أو العرض أو الطلب أو الشهادة أو الوصول عند تحديد مخاطر.",
  "Questions about ReDist responsibilities?": "هل لديك أسئلة حول مسؤوليات ReDist؟",
  "Contact the founder before joining a pilot workflow, submitting sensitive information, or using ReDist evidence externally.": "تواصل مع المؤسس قبل الانضمام إلى مسار تجربة، أو إرسال معلومات حساسة، أو استخدام إثبات ReDist خارجيا.",
  "Ask a question": "اطرح سؤالا",
  "Privacy framework": "إطار الخصوصية",
  "Privacy framework for organization trust workflows.": "إطار خصوصية لمسارات ثقة المؤسسات.",
  "This page summarizes the ReDist privacy framework for public review. It is not a final privacy policy and must be reviewed by qualified UAE privacy or legal counsel before commercial use.": "تلخص هذه الصفحة إطار خصوصية ReDist للمراجعة العامة. وهي ليست سياسة خصوصية نهائية ويجب مراجعتها من مستشار خصوصية أو قانوني مؤهل في الإمارات قبل الاستخدام التجاري.",
  "Framework pending formal UAE privacy review.": "إطار بانتظار مراجعة خصوصية رسمية في الإمارات.",
  "ReDist collects only the information needed to operate founder-guided redistribution, lead review, verification, evidence, and pilot workflows. Final privacy obligations require professional review.": "تجمع ReDist فقط المعلومات اللازمة لتشغيل إعادة التوزيع بإرشاد المؤسس ومراجعة العملاء المحتملين والتحقق والإثبات ومسارات التجربة. تتطلب الالتزامات النهائية للخصوصية مراجعة مهنية.",
  "Data ReDist may process": "البيانات التي قد تعالجها ReDist",
  "Organization data such as legal name, trade name, organization type, location, contact details, verification status, trust context, listings, requests, transfers, certificates, and impact summaries.": "بيانات المؤسسة مثل الاسم القانوني والاسم التجاري ونوع المؤسسة والموقع وبيانات الاتصال وحالة التحقق وسياق الثقة والعروض والطلبات والتحويلات والشهادات وملخصات الأثر.",
  "User data such as name, email, role, organization membership, support requests, feedback submissions, and authorized workflow actions.": "بيانات المستخدم مثل الاسم والبريد الإلكتروني والدور وعضوية المؤسسة وطلبات الدعم والملاحظات وإجراءات سير العمل المخولة.",
  "Lead inquiry data submitted through the public contact form, including name, organization, email, phone, inquiry type, city, timeline, and message.": "بيانات الاستفسارات المقدمة عبر نموذج التواصل العام، بما في ذلك الاسم والمؤسسة والبريد الإلكتروني والهاتف ونوع الاستفسار والمدينة والإطار الزمني والرسالة.",
  "Operational records such as verification documents, transfer certificates, handover evidence, audit actions, permission decisions, and support notes where required for platform operation.": "السجلات التشغيلية مثل مستندات التحقق وشهادات التحويل وإثباتات التسليم وإجراءات التدقيق وقرارات الصلاحيات وملاحظات الدعم عند الحاجة لتشغيل المنصة.",
  "Why data is used": "لماذا تُستخدم البيانات",
  "Operate supplier, recipient, transfer, verification, certificate, impact, and founder review workflows.": "تشغيل مسارات المورد والمستفيد والتحويل والتحقق والشهادة والأثر ومراجعة المؤسس.",
  "Review organization eligibility and pilot suitability.": "مراجعة أهلية المؤسسة وملاءمتها للتجربة.",
  "Support trust, safety, dispute review, auditability, and platform security.": "دعم الثقة والسلامة ومراجعة النزاعات وقابلية التدقيق وأمن المنصة.",
  "Respond to inquiries, schedule founder conversations, and manage pilot or partnership follow-up.": "الرد على الاستفسارات وجدولة محادثات المؤسس وإدارة متابعة التجربة أو الشراكة.",
  "Protection principles": "مبادئ الحماية",
  "Sensitive documents should not be submitted through the public contact form.": "لا ينبغي إرسال المستندات الحساسة عبر نموذج التواصل العام.",
  "Founder and platform review areas are intended to be protected from public access.": "تهدف مناطق مراجعة المؤسس والمنصة إلى الحماية من الوصول العام.",
  "Public certificate verification should expose only public-safe transfer facts, not sensitive documents, contact details, or internal audit notes.": "يجب أن يعرض التحقق العام من الشهادة حقائق التحويل الآمنة للعامة فقط، وليس المستندات الحساسة أو بيانات الاتصال أو ملاحظات التدقيق الداخلية.",
  "Service role keys, private credentials, and sensitive environment variables must never be exposed in the browser or committed to the repository.": "يجب ألا تُكشف مفاتيح أدوار الخدمة أو بيانات الاعتماد الخاصة أو متغيرات البيئة الحساسة في المتصفح أو تُضاف إلى المستودع.",
  "Professional review required": "مراجعة مهنية مطلوبة",
  "UAE Personal Data Protection Law applicability.": "مدى انطباق قانون حماية البيانات الشخصية في الإمارات.",
  "Free zone or sector-specific data obligations.": "التزامات البيانات الخاصة بالمناطق الحرة أو القطاعات المحددة.",
  "Consent, notice, retention, deletion, and correction rights.": "حقوق الموافقة والإشعار والاحتفاظ والحذف والتصحيح.",
  "Cross-border processing disclosures for hosting, database, analytics, and support providers.": "إفصاحات المعالجة عبر الحدود لمزودي الاستضافة وقاعدة البيانات والتحليلات والدعم.",
  "Incident notification, audit log retention, and certificate evidence retention periods.": "الإبلاغ عن الحوادث وفترات الاحتفاظ بسجلات التدقيق وإثباتات الشهادات.",
  "Questions about data handling?": "هل لديك أسئلة حول التعامل مع البيانات؟",
  "Contact the founder before submitting sensitive information, requesting pilot access, or using ReDist evidence in external reporting.": "تواصل مع المؤسس قبل إرسال معلومات حساسة أو طلب وصول للتجربة أو استخدام إثبات ReDist في تقارير خارجية.",
  "Ask a privacy question": "اطرح سؤالا عن الخصوصية",
  "Inquiry could not be submitted.": "تعذر إرسال الاستفسار.",
  "Please review the form before submitting.": "يرجى مراجعة النموذج قبل الإرسال.",
  "Need guidance before contacting us? Open the": "هل تحتاج إلى إرشاد قبل التواصل معنا؟ افتح",
  "ReDist Help Center": "مركز مساعدة ReDist",
  "for quick-start, supplier, recipient, and FAQ guidance.": "للاطلاع على دليل البدء السريع وإرشادات المورد والمستفيد والأسئلة الشائعة.",
  "ReDist home": "الصفحة الرئيسية لـ ReDist",
  "Primary navigation": "التنقل الرئيسي",
  "Footer navigation": "تنقل التذييل",
  "Pilot status": "حالة التجربة",
  "Common redistribution questions": "أسئلة شائعة حول إعادة التوزيع",
  "Language": "اللغة",
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

  page.querySelectorAll<HTMLElement>("[aria-label]").forEach((element) => {
    const current = normalize(element.getAttribute("aria-label") ?? "");
    const reverseAria = new Map(Object.entries(ar).map(([english, arabic]) => [arabic, english]));
    if (locale === "ar" && ar[current]) {
      element.setAttribute("aria-label", ar[current]);
    } else if (locale === "en" && reverseAria.has(current)) {
      element.setAttribute("aria-label", reverseAria.get(current) ?? current);
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
