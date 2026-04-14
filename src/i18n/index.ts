import zh from './locales/zh.json';
import en from './locales/en.json';
import de from './locales/de.json';

const translations = { zh, en, de } as const;

export type Language = keyof typeof translations;
export type I18n = (typeof translations)['en'];

export function getSkillLevel(lang: Language, level: string): string {
  const t = translations[lang];
  return (t as any).skillLevels?.[level] || level;
}

export { translations };
