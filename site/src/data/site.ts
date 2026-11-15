// Single source for names, links and routes. Facts come from docs/content/cv.md (HR-FACTS).

export const person = {
  name: 'Luke Petzer',
  role: 'DevOps / Platform Engineer',
  location: 'Cape Town, South Africa',
  email: 'lukepetzerint2@gmail.com',
  linkedin: 'https://www.linkedin.com/in/lukepetzer-3a81a316b',
  linkedinLabel: 'in/lukepetzer-3a81a316b',
  github: null as string | null, // TODO(Luke): GitHub username
  // TODO(Luke): replace with phone-free CV before hosting (HR-PRIVACY)
  cv: "/Luke_Petzer_CV.pdf",
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

export interface CaseStudy {
  slug: string;
  title: string;
  company: string;
  summary: string;
  tags: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'multi-cloud-terraform',
    title: 'Multi-cloud Terraform platform',
    company: 'ixo · Platform',
    summary:
      'A config-driven Terraform platform across Vultr, AWS and GCP that any team can plug their own environments into, with onboarding docs to match.',
    tags: ['Terraform', 'Kubernetes', 'EKS / GKE / VKE', 'ArgoCD'],
  },
  {
    slug: 'gitops-secrets',
    title: 'GitOps + secrets overhaul',
    company: 'ixo · Platform & security',
    summary:
      'GitOps with ArgoCD and an image-updater, secrets moved to External Secrets Operator + Vault with Dex for OIDC, and locked-down Cloudflare tunnels with no public exposure.',
    tags: ['ArgoCD', 'External Secrets Operator', 'Vault', 'Dex / OIDC', 'Cloudflare Tunnels'],
  },
  {
    slug: 'identity-verification',
    title: 'Identity verification platform',
    company: 'BMTX · Backend',
    summary:
      'A partner-facing KYC/IDV platform built from scratch: a gRPC public gateway plus domain engine, a Spring Batch pipeline for PGP-encrypted cohort files, and a decision layer over Socure.',
    tags: ['gRPC', 'Spring Batch', 'Azure AKS', 'Service Bus', 'Redis'],
  },
  {
    slug: 'zero-downtime-migration',
    title: 'Zero-downtime migration',
    company: 'envel · Backend',
    summary:
      "A zero-downtime migration restructuring every live user's envelope data for a new budgeting model, alongside the backend move between core banking providers.",
    tags: ['Kotlin', 'Spring', 'Event-driven workers', 'Core banking'],
  },
];

/** Everything the Ctrl/Cmd+K palette can jump to. */
export const paletteItems: { href: string; label: string; hint: string }[] = [
  { href: '/', label: 'Home', hint: 'Page' },
  ...nav.map((n) => ({ href: n.href, label: n.label, hint: 'Page' })),
  ...caseStudies.map((c) => ({ href: `/work/${c.slug}`, label: c.title, hint: 'Case study' })),
  { href: '/built', label: 'How this site is built', hint: 'Page' },
];
