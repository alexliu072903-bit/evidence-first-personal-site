import { primary, secondary } from './i18n';
import type { Text } from './site-types';

export function contentText(primaryValue: string, secondaryValue: string | undefined, where: string): Text {
  if (!secondary) return primaryValue;
  if (!secondaryValue) throw new Error(`Missing ${secondary} translation for ${where}: "${primaryValue}"`);
  return { [primary]: primaryValue, [secondary]: secondaryValue };
}

export function translatedList<T extends Record<string, string>>(
  primaryItems: T[] | undefined,
  secondaryItems: T[] | undefined,
  where: string,
) {
  if (!primaryItems) return [];
  if (!secondary) return primaryItems.map((item) => Object.fromEntries(Object.entries(item).map(([key, value]) => [key, value])));
  if (!secondaryItems || secondaryItems.length !== primaryItems.length) {
    throw new Error(`Missing or mismatched ${secondary} translation list for ${where}`);
  }
  return primaryItems.map((item, index) => Object.fromEntries(
    Object.entries(item).map(([key, value]) => [key, contentText(value, secondaryItems[index]?.[key], `${where}[${index}].${key}`)]),
  ));
}
