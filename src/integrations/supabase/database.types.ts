export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type Role = 'owner' | 'admin' | 'editor' | 'viewer'

export type TablesMap = {
  site_settings: {
    key: string
    value: Json
    updated_at: string
  }
  hero_content: {
    id: string
    name: string
    role: string
    left_intro: Json
    expertise: string
    right_intro: Json
    right_secondary: Json
    cta_label: string
    cta_href: string
    start_project_label: string
    start_project_href: string
    tags: Json
    ticker: Json
    navigation: Json
    subject_image_url: string | null
    subject_alt: string | null
    badge_text: string | null
    published: boolean
    updated_at: string
  }
  projects: {
    id: string
    slug: string
    title: string
    summary: string
    description: string
    year: string
    role: string
    stack: Json
    tags: Json
    outcomes: Json
    href: string | null
    cover_image_url: string | null
    featured_image_url: string | null
    thumbnail_urls: Json
    seo_description: string
    featured: boolean
    published: boolean
    sort_order: number
    created_at: string
    updated_at: string
  }
  experience_items: {
    id: string
    slug: string | null
    company: string
    role: string
    period: string
    location: string
    employment_type: string
    work_mode: string
    summary: string
    detail_intro: string
    highlights: Json
    responsibilities: Json
    technologies: Json
    seo_description: string
    is_current: boolean
    preview_limit: number
    featured_on_home: boolean
    published: boolean
    sort_order: number
    created_at: string
    updated_at: string
  }
  skill_groups: {
    id: string
    title: string
    sort_order: number
    published: boolean
    created_at: string
    updated_at: string
  }
  skill_items: {
    id: string
    group_id: string
    label: string
    sort_order: number
    created_at: string
  }
  marketing_pages: {
    id: string
    slug: string
    title: string
    eyebrow: string | null
    description: string
    body_html: string
    sections: Json
    meta: Json
    published: boolean
    sort_order: number
    updated_at: string
  }
  certification_items: {
    id: string
    title: string
    issuer: string
    issued_label: string
    credential_url: string | null
    published: boolean
    sort_order: number
    created_at: string
    updated_at: string
  }
  education_items: {
    id: string
    degree: string
    institution: string
    issued_label: string
    summary: string
    published: boolean
    sort_order: number
    created_at: string
    updated_at: string
  }
  cms_media: {
    id: string
    public_url: string
    storage_path: string
    folder: string
    kind: string
    alt_text: string | null
    file_name: string | null
    byte_size: number | null
    created_at: string
  }
  form_submissions: {
    id: string
    name: string
    email: string
    company: string | null
    message: string
    status: string
    created_at: string
  }
  admin_users: {
    id: string
    auth_user_id: string | null
    email: string
    role: Role
    is_active: boolean
    created_at: string
    updated_at: string
  }
}

export type Tables<T extends keyof TablesMap> = TablesMap[T]

export type Database = any

