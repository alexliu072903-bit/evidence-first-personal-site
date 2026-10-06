export function fieldTranslations(
  translations: Record<string, Record<string, unknown>> | undefined,
  field: string,
) {
  return Object.fromEntries(
    Object.entries(translations ?? {}).map(([language, value]) => [language, value[field]]),
  ) as Record<string, string | undefined>;
}

export function getPrimaryCopy(site: any) {
  return site.copy[site.primaryLanguage];
}

export function siteCopyTranslations(site: any, field: string) {
  return Object.fromEntries(
    site.languages
      .filter((language: string) => language !== site.primaryLanguage)
      .map((language: string) => [language, site.copy[language]?.[field]]),
  ) as Record<string, string | undefined>;
}

export function labelTranslations(site: any, key: string) {
  return Object.fromEntries(
    site.languages
      .filter((language: string) => language !== site.primaryLanguage)
      .map((language: string) => [language, site.copy[language]?.labels?.[key]]),
  ) as Record<string, string | undefined>;
}
