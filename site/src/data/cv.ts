// Experience, skills, education and certification. Copied from docs/content/cv.md (HR-FACTS):
// change the CV doc first, then this file.

export interface Job {
  org: string;
  role: string;
  period: string;
  where: string;
  current?: boolean;
  note: string;
  points: string[];
}

export const jobs: Job[] = [
  {
    org: 'ixo',
    role: 'DevOps Engineer',
    period: 'Feb 2024 – present',
    where: 'Cape Town',
    current: true,
    note: 'Half-time for over a year while full-time at BM Technologies; full-time at ixo since March 2025.',
    points: [
      'Built a config-driven, multi-cloud Terraform platform (Vultr / AWS / GCP) that any team can plug their own environments into, and wrote the onboarding docs.',
      'Set up GitOps with ArgoCD, including an image-updater for automated image tracking and rollout.',
      'Cut backup storage costs 60–80% with GCS lifecycle policies; ran cost comparisons showing 28–36% savings going multi-cloud vs. AWS-only.',
      'Moved secrets management to External Secrets Operator + Vault, with Dex handling OIDC auth.',
      'Built and locked down Cloudflare tunnels for secure DB/service access, with no public exposure needed.',
      'Runs infra for Web3 workloads: cross-chain validator nodes (Hyperlane), RPC/IPFS endpoints.',
      'Owns uptime and monitoring (Uptime Kuma, Grafana alerting) and leads incident response for the platform.',
    ],
  },
  {
    org: 'BM Technologies (BMTX)',
    role: 'Software Engineer',
    period: 'Jun 2023 – Mar 2025',
    where: 'Pennsylvania, US · Remote',
    note: 'Formerly BankMobile. Full-time, running alongside the first year at ixo.',
    points: [
      'Designed and built a partner-facing identity verification platform from scratch: a gRPC service pair (public gateway + domain engine) productising KYC/IDV for university partners. Dominant contributor on both from day one.',
      'Built a bulk verification pipeline processing PGP-encrypted student cohort files from Azure Blob Storage with Spring Batch: per-school routing, result generation, failure quarantine.',
      'Implemented the decision layer over Socure: reason-code retrieval and translation, score-based filtering producing accept/review/reject outcomes.',
      'Integrated end-to-end into Azure (App Configuration, Key Vault, Service Bus, Functions, AKS) and hardened it for production: Redis caching, rate limiting, health checks.',
    ],
  },
  {
    org: 'envel',
    role: 'Software Engineer',
    period: 'Feb 2020 – Jun 2023',
    where: 'Cape Town',
    note: "As costs ramped up, taught himself Terraform and infra work from scratch and built out the company's entire cloud infrastructure. That self-taught DevOps skill set led to becoming ixo's sole platform hire.",
    points: [
      'Primary engineer on the core banking API: a Kotlin/Spring GraphQL monolith covering accounts, envelopes, transactions, cards, transfers and onboarding.',
      'Led the backend migration between core banking providers (Q2 → Helix/CorePro): new client library, shared processor framework, and the event-driven workers that moved deposits, withdrawals and statements onto the new core.',
      'Built the identity, fraud and AML stack (Jumio, Socure, Castle, Unit21) and delivered the fractional-share investing integration (DriveWealth) end to end.',
      "Wrote a zero-downtime migration restructuring every live user's envelope data for a new budgeting model: no lost funds, per-user failure isolation, safe re-runs.",
    ],
  },
  {
    org: 'Absa Group',
    role: 'Java Developer (internship)',
    period: 'Feb 2019 – Feb 2020',
    where: 'Cape Town',
    note: 'Shadow-style internship on an enterprise Java codebase: unit tests, small bug fixes, and a first look at how a large bank ships code. Offered a permanent seat; chose envel for the steeper learning curve.',
    points: [],
  },
  {
    org: 'Younglings',
    role: 'Learnership',
    period: 'Aug 2018 – Feb 2020',
    where: 'Cape Town',
    note: 'Stipend-funded, self-study learnership in Spring Framework, RESTful services, SQL/NoSQL and reactive programming. Led to the Absa internship, and from there the offer at envel.',
    points: [],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Infra & cloud', items: ['Terraform', 'Kubernetes (EKS/GKE/VKE)', 'Multi-cloud (AWS/GCP/Vultr)', 'ArgoCD/GitOps'] },
  { group: 'Platform & security', items: ['External Secrets Operator', 'HashiCorp Vault', 'Dex/OIDC', 'Cloudflare Tunnels'] },
  { group: 'Reliability', items: ['Grafana', 'Uptime Kuma', 'Incident response', 'CI/CD'] },
  {
    group: 'Backend',
    items: ['Java', 'Kotlin', 'Spring Framework', 'PostgreSQL', 'MongoDB', 'gRPC/REST', 'RabbitMQ', '.NET Core (familiar)'],
  },
  { group: 'Web3', items: ['Hyperlane validator nodes', 'RPC/IPFS infra'] },
];

export const education = { school: 'Cape Academy of Maths, Science and Technology', years: '2015–2017' };
export const certification = 'Oracle Certified Associate, Java SE 8 Programmer';
