/** @type {import('./lib/site-types').SiteConfig} */
export default {
  name: 'Your Name',
  description: 'Your public archive.',
  languages: ['en'],
  modules: { projects: false, writing: false, about: true },
  capabilities: [],
  about: {
    summary: 'Add a factual summary.',
    sections: [],
  },
  deployment: {
    site: 'http://localhost:4321',
    base: '/',
  },
};
