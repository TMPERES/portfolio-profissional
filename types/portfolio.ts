export type ProjectCategory = 
  | 'design_grafico' 
  | 'webdesign' 
  | 'audiovisual' 
  | 'dev_web';

export type ProjectStatus = 'draft' | 'published';

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  short_description: string;
  description?: string;
  context_objective?: string;
  solution_process?: string;
  cover_image_path?: string;
  alt_text?: string;
  gallery_images?: string[];
  video_url?: string;
  external_url?: string;
  tools?: string[];
  project_year?: number;
  sort_order: number;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  professional_title: string;
  hero_title: string;
  hero_subtitle: string;
  bio: string;
  approach: string;
  avatar_url?: string;
  hero_image_url?: string;
  resume_url?: string;
  updated_at: string;
}

export type ContactType = 'whatsapp' | 'email' | 'linkedin' | 'github' | 'other';

export interface ContactLink {
  id: string;
  contact_type: ContactType;
  label: string;
  value_url: string;
  whatsapp_message?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: ProjectCategory | 'outros';
  description?: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface CategoryInfo {
  id: ProjectCategory;
  label: string;
  description: string;
  tagline: string;
}
