export type EducationItem = {
  degree: string
  institution: string
  issuedLabel: string
  summary: string
}

export type CertificationItem = {
  title: string
  issuer: string
  issuedLabel: string
  credentialUrl?: string
}

export const education: EducationItem[] = [
  {
    degree: 'Bachelor of Science in Information Technology',
    institution: 'Jomo Kenyatta University of Agriculture and Technology',
    issuedLabel: 'Nov 2019',
    summary: '',
  },
]

export const certifications: CertificationItem[] = [
  {
    title: 'Foundations of Project Management',
    issuer: 'Google',
    issuedLabel: 'Jun 2023',
  },
  {
    title: 'Google SEO Fundamentals',
    issuer: 'University of California, Davis',
    issuedLabel: 'Jun 2022',
  },
  {
    title: 'Optimizing a Website for Google Search',
    issuer: 'University of California, Davis',
    issuedLabel: 'May 2022',
  },
  {
    title: 'Increase SEO Traffic with WordPress',
    issuer: 'Coursera',
    issuedLabel: 'Jul 2019',
  },
  {
    title: 'Build a Full Website using WordPress',
    issuer: 'Coursera',
    issuedLabel: 'Jun 2019',
  },
]
