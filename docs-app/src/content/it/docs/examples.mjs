const REPO = 'https://github.com/CodeCube0/TinyDI/tree/main/examples';

export const meta = {
  title: 'Esempi',
  description:
    'Sette esempi TinyDI eseguibili e autoconsistenti: dal programma più piccolo possibile alle integrazioni complete con i framework.',
};

export const blocks = [
  {
    type: 'p',
    html: `Ogni esempio qui sotto vive in <code>examples/</code> nel repository, è completamente autoconsistente (proprio <code>package.json</code>, proprio README), ed è stato verificato per essere eseguito davvero — non solo type-checkato.`,
  },
  {
    type: 'example-grid',
    items: [
      {
        title: 'Basic',
        description: 'registerInstance + resolve. Il programma TinyDI più piccolo possibile.',
        href: `${REPO}/basic`,
        cta: 'Vedi esempio',
      },
      {
        title: 'Service',
        description:
          'IMailService / GraphApiMailService, a confronto registerInstance e registerFactory.',
        href: `${REPO}/service`,
        cta: 'Vedi esempio',
      },
      {
        title: 'Repository Pattern',
        description: 'IUserRepository / UserRepository / UserService — componendo più dipendenze.',
        href: `${REPO}/repository-pattern`,
        cta: 'Vedi esempio',
      },
      {
        title: 'Node Backend',
        description:
          'Logger, repository e service layer composti tramite il container, esposti su un server HTTP Node nativo.',
        href: `${REPO}/node-backend`,
        cta: 'Vedi esempio',
      },
      {
        title: 'Vue',
        description: 'Utilizzo del container in Vue tramite provide/inject.',
        href: `${REPO}/vue`,
        cta: 'Vedi esempio',
      },
      {
        title: 'Nuxt',
        description: 'Un plugin Nuxt (plugins/di.ts) che espone il container come $container.',
        href: `${REPO}/nuxt`,
        cta: 'Vedi esempio',
      },
      {
        title: 'React',
        description: 'Un Context Provider React e un hook useService.',
        href: `${REPO}/react`,
        cta: 'Vedi esempio',
      },
    ],
  },
];
