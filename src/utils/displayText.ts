const EMPTY_PLACEHOLDERS = new Set([
  "-",
  "—",
  "–",
  "â€”",
  "â€“",
  "â€",
  "â€\"",
]);

export const formatOptionalText = (
  value?: string | null,
  fallback = "Sin informacion",
) => {
  const text = value?.trim();

  if (!text || EMPTY_PLACEHOLDERS.has(text) || text.startsWith("â€")) {
    return fallback;
  }

  return text;
};
