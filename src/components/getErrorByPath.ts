export const getErrorByPath = (
  obj: unknown,
  path: string
): string | undefined => {
  if (obj == null) return undefined;
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  if (cur == null || typeof cur !== "object") return undefined;
  const msg = (cur as Record<string, unknown>)["message"];
  return typeof msg === "string" ? msg : undefined;
};
