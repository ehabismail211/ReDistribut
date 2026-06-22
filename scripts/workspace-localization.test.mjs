import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workspace = readFileSync("apps/web/src/app/app/workspace.tsx", "utf8");

test("workspace initializes language from storage before writing locale preferences", () => {
  assert.ok(
    workspace.includes('const [locale, setLocaleState] = useState<Locale>(() => {'),
    "locale state should use lazy initialization",
  );
  assert.ok(
    workspace.includes('window.localStorage.getItem(languageStorageKey)'),
    "workspace should read the stored language preference during initialization",
  );
  assert.equal(
    workspace.includes('useEffect(() => {\n    const stored = window.localStorage.getItem(languageStorageKey);'),
    false,
    "workspace should not read stored language in an effect that can race with the write effect",
  );
  assert.ok(
    workspace.includes('document.documentElement.lang = locale'),
    "workspace should apply the selected language to the document",
  );
  assert.ok(
    workspace.includes('document.documentElement.dir = dir'),
    "workspace should apply RTL direction to the document",
  );
});

test("workspace Arabic dictionary covers Sprint 1 operational workspace labels", () => {
  for (const token of [
    '"Dashboard action center": "مركز إجراءات لوحة التحكم"',
    '"What should move today?": "ما الذي يجب تحريكه اليوم؟"',
    '"Create a listing": "إنشاء عرض"',
    '"Discover resources": "اكتشاف الموارد"',
    '"Review requests": "مراجعة الطلبات"',
    '"View transfers": "عرض التحويلات"',
    '"Needs attention": "يحتاج إلى اهتمام"',
    '"Recent listings": "أحدث العروض"',
    '"Recent requests": "أحدث الطلبات"',
    '"Operational request queue": "قائمة الطلبات التشغيلية"',
    '"Handover and verification workspace": "مساحة التسليم والتحقق"',
    '"Resource discovery": "اكتشاف الموارد"',
    '"Prepared chicken meals": "وجبات دجاج جاهزة"',
    '"Double-wall cardboard boxes": "كراتين شحن مزدوجة الجدار"',
    '"Protected staging": "بيئة تجريبية محمية"',
    '"ReDist workspace": "مساحة عمل ReDist"',
    '"Trade License": "الرخصة التجارية"',
    '"Pending Review": "قيد المراجعة"',
    '"Publish local listing": "نشر عرض محلي"',
    '"Reset UAE list": "إعادة ضبط قائمة الإمارات"',
    '"Verification review": "مراجعة التحقق"',
    '"Trust score monitoring": "متابعة درجة الثقة"',
    '"Company access": "وصول المؤسسة"',
    '"Save verification profile": "حفظ ملف التحقق"',
  ]) {
    assert.ok(workspace.includes(token), `missing workspace Arabic coverage for ${token}`);
  }

  assert.ok(
    workspace.includes("const dayMatch = value.match"),
    "workspace translator should handle dynamic expiry labels such as 3 days left",
  );
  assert.ok(
    workspace.includes("documentRecordMatch"),
    "workspace translator should handle dynamic document record labels",
  );
  assert.ok(
    workspace.includes("linkedListingsMatch"),
    "workspace translator should handle dynamic group listing counts",
  );
});
