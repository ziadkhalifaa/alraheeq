/**
 * Safely extracts a string value from a potential translation object or a raw string.
 * Used by the Live Editor and components to ensure no raw objects are rendered as React children.
 * 
 * Handles ALL known data shapes:
 *  - null / undefined → ""
 *  - plain string → returned as-is
 *  - JSON-stringified object like '{"ar":"...","en":"..."}' → parsed then extracted
 *  - translation object {ar, en} → extracted by lang
 *  - nested/malformed objects → ""
 *  - primitives (number, boolean) → String()
 */
export function getSafeValue(value: any, lang: 'ar' | 'en' | string): string {
  if (value === null || value === undefined) return "";

  // If it's a string, check if it's a JSON-stringified translation object
  if (typeof value === "string") {
    // Quick check: does it look like JSON? (starts with { and ends with })
    const trimmed = value.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === "object" && parsed !== null) {
          const val = parsed[lang] || parsed.en || parsed.ar || "";
          return typeof val === "string" ? val : "";
        }
      } catch {
        // Not valid JSON — just return the string as-is
      }
    }
    return value;
  }

  // If it's an object, try to extract the language-specific value
  if (typeof value === "object") {
    const val = value[lang] || value.en || value.ar || "";
    
    // Recursive safety: if the extracted value is STILL an object, return ""
    if (typeof val === "object" && val !== null) {
      return "";
    }
    
    return String(val);
  }

  // Primitive values (number, boolean) are safely converted to string
  return String(value);
}
