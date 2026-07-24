const REPO = 'https://github.com/CodeCube0/TinyDI/tree/main/examples';

export const meta = {
  title: 'Examples',
  description:
    'Seven runnable, self-contained TinyDI examples: from the smallest possible program to full framework integrations.',
};

export const blocks = [
  {
    type: 'p',
    html: `Every example below lives in <code>examples/</code> in the repository, is fully self-contained (its own <code>package.json</code>, its own README), and was verified to actually run — not just type-check.`,
  },
  {
    type: 'example-grid',
    items: [
      {
        title: 'Basic',
        description: 'registerInstance + resolve. The smallest possible TinyDI program.',
        href: `${REPO}/basic`,
        cta: 'View example',
      },
      {
        title: 'Service',
        description:
          'IMailService / GraphApiMailService, comparing registerInstance and registerFactory.',
        href: `${REPO}/service`,
        cta: 'View example',
      },
      {
        title: 'Repository Pattern',
        description:
          'IUserRepository / UserRepository / UserService — composing multiple dependencies.',
        href: `${REPO}/repository-pattern`,
        cta: 'View example',
      },
      {
        title: 'Node Backend',
        description:
          'Logger, repository and service layer composed through the container, served over plain Node HTTP.',
        href: `${REPO}/node-backend`,
        cta: 'View example',
      },
      {
        title: 'Vue',
        description: 'Using the container in Vue via provide/inject.',
        href: `${REPO}/vue`,
        cta: 'View example',
      },
      {
        title: 'Nuxt',
        description: 'A Nuxt plugin (plugins/di.ts) exposing the container as $container.',
        href: `${REPO}/nuxt`,
        cta: 'View example',
      },
      {
        title: 'React',
        description: 'A React Context Provider and a useService hook.',
        href: `${REPO}/react`,
        cta: 'View example',
      },
    ],
  },
];
