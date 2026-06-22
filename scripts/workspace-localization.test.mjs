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
