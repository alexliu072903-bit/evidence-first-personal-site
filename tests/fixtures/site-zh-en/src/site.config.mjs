/** @type {import('../../../../assets/site-template/src/lib/site-types').SiteConfig} */
export default {
  name: '林安 Lan Lin',
  description: {
    'zh-CN': '把无障碍研究整理成团队能直接使用的产品判断。',
    en: 'Turn accessibility research into product decisions a team can use.',
  },
  languages: ['zh-CN', 'en'],
  modules: { projects: true, writing: true, about: true },
  capabilities: [
    {
      title: { 'zh-CN': '让路线可理解', en: 'Make routes understandable' },
      text: { 'zh-CN': '把复杂空间拆成读屏和低视力用户都能确认的下一步。', en: 'Break complex spaces into a next step that screen-reader and low-vision users can confirm.' },
      evidence: 'access-map',
    },
    {
      title: { 'zh-CN': '让控制可操作', en: 'Make controls operable' },
      text: { 'zh-CN': '用键盘路径和焦点状态检验设计，而不是只检查静态稿。', en: 'Test keyboard paths and focus states instead of reviewing only static screens.' },
      evidence: 'reading-controls',
    },
    {
      title: { 'zh-CN': '让内容可跟随', en: 'Make content easier to follow' },
      text: { 'zh-CN': '把字幕、节奏和内容层级放在同一个观看路径里判断。', en: 'Judge captions, pacing, and hierarchy as one viewing path.' },
      evidence: 'caption-lab',
    },
  ],
  resume: { href: 'resume.pdf', label: { 'zh-CN': '简历', en: 'Resume' } },
  contact: { href: 'mailto:lan.lin@example.com', label: 'lan.lin@example.com' },
  about: {
    summary: { 'zh-CN': '林安是一名虚构的无障碍设计研究者。这份材料只用于 v1 模板验收。', en: 'Lan Lin is a fictional accessibility design researcher. This material exists only to validate the v1 template.' },
    sections: [
      { title: { 'zh-CN': '关注', en: 'Focus' }, text: { 'zh-CN': '无障碍研究、交互原型与设计验证', en: 'Accessibility research, interaction prototypes, and design validation' } },
      { title: { 'zh-CN': '方法', en: 'Method' }, text: { 'zh-CN': '观察真实任务，再把发现写成可以检查的设计条件。', en: 'Observe real tasks, then turn findings into design conditions that can be checked.' } },
    ],
  },
  deployment: { site: 'http://localhost:4321', base: '/' },
  style: { hazeLight: 'style/hero.light.svg', hazeDark: 'style/hero.dark.svg' },
};
