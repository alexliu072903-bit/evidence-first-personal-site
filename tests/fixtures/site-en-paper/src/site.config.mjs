/** @type {import('../../../../assets/site-template/src/lib/site-types').SiteConfig} */
export default {
  name: 'Avery Stone',
  description: 'Turn field research into practical improvements for public services.',
  languages: ['en'],
  modules: { projects: true, writing: false, about: true },
  capabilities: [
    {
      title: 'Find the decision point',
      text: 'Observe where a public-service journey becomes difficult to understand.',
      evidence: 'service-signals',
    },
    {
      title: 'Make the next step testable',
      text: 'Translate findings into a small intervention that can be checked in context.',
      evidence: 'queue-notes',
    },
  ],
  contact: { href: 'mailto:avery@example.com', label: 'avery@example.com' },
  about: {
    summary: 'Avery Stone is a fictional public-service researcher created to validate the v1 infrastructure.',
    sections: [
      { title: 'Focus', text: 'Field research, service journeys, and accessible public information.' },
      { title: 'Method', text: 'Observe the task, identify the decision point, and test the smallest useful change.' },
    ],
  },
  deployment: { site: 'http://localhost:4321', base: '/' },
  style: {},
};
