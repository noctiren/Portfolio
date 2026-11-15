// Single source for names, links and routes. Facts come from docs/content/cv.md (HR-FACTS).

export const person = {
  name: 'Luke Petzer',
  role: 'DevOps / Platform Engineer',
  location: 'Cape Town, South Africa',
  email: 'lukepetzerint2@gmail.com',
  linkedin: 'https://www.linkedin.com/in/lukepetzer-3a81a316b',
  linkedinLabel: 'in/lukepetzer-3a81a316b',
  github: 'https://github.com/LukePetzer-ixo',
  githubLabel: 'LukePetzer-ixo',
  pitch:
    "Running Kubernetes clusters, wiring up Terraform, and keeping ArgoCD deployments and CI/CD pipelines honest. A backend engineer by background, so I still think like a developer when I'm building infrastructure.",
};

export interface NavItem {
  href: string;
  label: string;
}

export const nav: NavItem[] = [
  { href: '/work', label: 'Work' },
  { href: '/experience', label: 'Experience' },
  { href: '/ai', label: 'AI' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export interface PaletteItem { href: string; label: string; hint: string }

/** Pages the Ctrl/Cmd+K palette can jump to (case studies are added from the content collection). */
export const palettePages: PaletteItem[] = [
  { href: '/', label: 'Home', hint: 'Page' },
  ...nav.map((n) => ({ href: n.href, label: n.label, hint: 'Page' })),
  { href: '/built', label: 'How this site is built', hint: 'Page' },
  { href: 'https://github.com/LukePetzer-ixo', label: 'GitHub', hint: 'Link' },
];

/** Case studies live in src/content/work (see src/data/work.ts). */
