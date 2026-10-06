import site from '../site.config.mjs';
import type { Language, Text } from './site-types';

export interface Pair {
  primary: string;
  secondary?: string;
}

export const primary = site.languages[0] as Language;
export const secondary = site.languages[1] as Language | undefined;

export function tx(text: Text | undefined, where = 'text'): Pair {
  if (text === undefined) return { primary: '' };
  if (typeof text === 'string') return { primary: text };
  const first = text[primary];
  if (!first) throw new Error(`Missing ${primary} for ${where}: ${JSON.stringify(text)}`);
  if (!secondary) return { primary: first };
  const second = text[secondary];
  if (!second) throw new Error(`Missing ${secondary} translation for ${where}: "${first}"`);
  return { primary: first, secondary: second };
}

export function attr(name: string, pair: Pair) {
  if (!pair.secondary) return {};
  return { [`data-t-${name}`]: pair.secondary };
}

export const ui = {
  projects: { 'zh-CN': '项目', en: 'Projects' },
  writing: { 'zh-CN': '文章', en: 'Writing' },
  about: { 'zh-CN': '关于', en: 'About' },
  selectedProjects: { 'zh-CN': '精选项目', en: 'Selected projects' },
  latestWriting: { 'zh-CN': '最近文章', en: 'Latest writing' },
  viewAll: { 'zh-CN': '查看全部', en: 'View all' },
  situation: { 'zh-CN': '情境', en: 'Situation' },
  current: { 'zh-CN': '当前状态', en: 'Current state' },
  notFound: { 'zh-CN': '页面不存在', en: 'Not found' },
  skip: { 'zh-CN': '跳到正文', en: 'Skip to content' },
  switchLanguage: { 'zh-CN': '切换语言', en: 'Switch language' },
} satisfies Record<string, Record<Language, string>>;

export const statusLabels = {
  live: { 'zh-CN': '公开运行', en: 'Live' },
  available: { 'zh-CN': '可使用', en: 'Available' },
  experimental: { 'zh-CN': '实验中', en: 'Experimental' },
  'in-progress': { 'zh-CN': '进行中', en: 'In progress' },
  historical: { 'zh-CN': '历史项目', en: 'Historical' },
  discontinued: { 'zh-CN': '已停止', en: 'Discontinued' },
} satisfies Record<string, Record<Language, string>>;

export const sourceLabels = {
  open: { 'zh-CN': '源码公开', en: 'Open source' },
  private: { 'zh-CN': '源码不公开', en: 'Private source' },
  mixed: { 'zh-CN': '部分公开', en: 'Mixed visibility' },
  'not-applicable': { 'zh-CN': '不涉及源码', en: 'Source not applicable' },
} satisfies Record<string, Record<Language, string>>;
