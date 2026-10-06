export type Language = 'zh-CN' | 'en';
export type Text = string | Partial<Record<Language, string>>;

export interface Capability {
  title: Text;
  text: Text;
  evidence: string;
}

export interface AboutSection {
  title: Text;
  text: Text;
}

export interface SiteConfig {
  name: string;
  description: Text;
  languages: [Language] | [Language, Language];
  modules: {
    projects: boolean;
    writing: boolean;
    about: boolean;
  };
  capabilities: Capability[];
  resume?: { href: string; label: Text };
  contact?: { href: string; label: Text };
  photo?: { src: string; alt: Text };
  about: {
    summary: Text;
    sections: AboutSection[];
  };
  deployment: {
    site: string;
    base: string;
  };
  style?: {
    hazeLight?: string;
    hazeDark?: string;
  };
}
