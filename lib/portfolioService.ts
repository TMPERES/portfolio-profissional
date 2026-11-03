import { supabase, isSupabaseConfigured } from './supabase';
import { Project, Profile, ContactLink, Skill } from '@/types/portfolio';
import { INITIAL_PROFILE, INITIAL_PROJECTS, INITIAL_CONTACTS, INITIAL_SKILLS } from './constants';

const STORAGE_KEY_PROJECTS = 'tadeu_peres_projects';
const STORAGE_KEY_PROFILE = 'tadeu_peres_profile';
const STORAGE_KEY_CONTACTS = 'tadeu_peres_contacts';
const STORAGE_KEY_SKILLS = 'tadeu_peres_skills';

// Helper de armazenamento local para desenvolvimento/fallback
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Erro ao salvar no cache local:', err);
  }
}

// ==========================================
// PROJETOS
// ==========================================

export async function getPublishedProjects(): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) return data as Project[];
    } catch (err) {
      console.warn('Erro ao consultar Supabase, utilizando dados locais:', err);
    }
  }

  const local = getLocalItem<Project[]>(STORAGE_KEY_PROJECTS, INITIAL_PROJECTS);
  return local
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getProjectBySlug(slug: string, isAdmin = false): Promise<Project | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('projects').select('*').eq('slug', slug);
      if (!isAdmin) {
        query = query.eq('status', 'published');
      }
      const { data, error } = await query.single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) return data as Project;
    } catch (err) {
      console.warn('Erro ao consultar slug no Supabase:', err);
    }
  }

  const local = getLocalItem<Project[]>(STORAGE_KEY_PROJECTS, INITIAL_PROJECTS);
  const found = local.find((p) => p.slug === slug);
  if (!found) return null;
  if (!isAdmin && found.status !== 'published') return null;
  return found;
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) return data as Project[];
    } catch (err) {
      console.warn('Erro ao consultar projetos admin no Supabase:', err);
    }
  }

  return getLocalItem<Project[]>(STORAGE_KEY_PROJECTS, INITIAL_PROJECTS);
}

export async function saveProject(project: Partial<Project>): Promise<Project> {
  const now = new Date().toISOString();
  
  if (isSupabaseConfigured && supabase) {
    try {
      if (project.id && !project.id.startsWith('proj-')) {
        const { data, error } = await supabase
          .from('projects')
          .update({ ...project, updated_at: now })
          .eq('id', project.id)
          .select()
          .single();
        if (error) throw error;
        return data as Project;
      } else {
        const newProj = {
          ...project,
          created_at: now,
          updated_at: now,
        };
        const { data, error } = await supabase
          .from('projects')
          .insert(newProj)
          .select()
          .single();
        if (error) throw error;
        return data as Project;
      }
    } catch (err) {
      console.warn('Supabase não respondeu à gravação de projeto, salvando localmente:', err);
    }
  }

  // Fallback local
  const currentList = getLocalItem<Project[]>(STORAGE_KEY_PROJECTS, INITIAL_PROJECTS);
  let updatedList: Project[];
  let saved: Project;

  if (project.id) {
    const existingIndex = currentList.findIndex((p) => p.id === project.id);
    if (existingIndex >= 0) {
      saved = {
        ...currentList[existingIndex],
        ...project,
        updated_at: now,
      } as Project;
      updatedList = [...currentList];
      updatedList[existingIndex] = saved;
    } else {
      saved = {
        ...project,
        id: project.id,
        sort_order: project.sort_order ?? currentList.length + 1,
        status: project.status || 'draft',
        created_at: now,
        updated_at: now,
      } as Project;
      updatedList = [saved, ...currentList];
    }
  } else {
    saved = {
      ...project,
      id: `proj-${Date.now()}`,
      sort_order: project.sort_order ?? currentList.length + 1,
      status: project.status || 'draft',
      created_at: now,
      updated_at: now,
    } as Project;
    updatedList = [saved, ...currentList];
  }

  setLocalItem(STORAGE_KEY_PROJECTS, updatedList);
  return saved;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn('Erro ao excluir no Supabase:', err);
    }
  }

  const currentList = getLocalItem<Project[]>(STORAGE_KEY_PROJECTS, INITIAL_PROJECTS);
  const updatedList = currentList.filter((p) => p.id !== id);
  setLocalItem(STORAGE_KEY_PROJECTS, updatedList);
  return true;
}

// ==========================================
// PERFIL
// ==========================================

export async function getProfile(): Promise<Profile> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('profile').select('*').limit(1).maybeSingle();
      if (error) throw error;
      if (data) return data as Profile;
    } catch (err) {
      console.warn('Erro ao carregar perfil do Supabase:', err);
    }
  }

  return getLocalItem<Profile>(STORAGE_KEY_PROFILE, INITIAL_PROFILE);
}

export async function saveProfile(profileData: Partial<Profile>): Promise<Profile> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profile')
        .upsert({ ...profileData, updated_at: now })
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    } catch (err) {
      console.warn('Erro ao salvar perfil no Supabase:', err);
    }
  }

  const current = getLocalItem<Profile>(STORAGE_KEY_PROFILE, INITIAL_PROFILE);
  const updated = { ...current, ...profileData, updated_at: now };
  setLocalItem(STORAGE_KEY_PROFILE, updated);
  return updated;
}

// ==========================================
// CONTATOS & LINKS
// ==========================================

export async function getContactLinks(): Promise<ContactLink[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_links')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) return data as ContactLink[];
    } catch (err) {
      console.warn('Erro ao carregar contatos do Supabase:', err);
    }
  }

  const local = getLocalItem<ContactLink[]>(STORAGE_KEY_CONTACTS, INITIAL_CONTACTS);
  const sanitized = local.map((c) => {
    if (c.contact_type === 'whatsapp' && (c.value_url.includes('551198108024') || c.value_url.includes('551198108024'))) {
      return { ...c, value_url: 'https://wa.me/5511981088024' };
    }
    return c;
  });
  if (typeof window !== 'undefined' && JSON.stringify(sanitized) !== JSON.stringify(local)) {
    setLocalItem(STORAGE_KEY_CONTACTS, sanitized);
  }
  return sanitized;
}

export async function saveContactLinks(contacts: ContactLink[]): Promise<ContactLink[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('contact_links').upsert(contacts).select();
      if (error) throw error;
      if (data) return data as ContactLink[];
    } catch (err) {
      console.warn('Erro ao salvar contatos no Supabase:', err);
    }
  }

  setLocalItem(STORAGE_KEY_CONTACTS, contacts);
  return contacts;
}

// ==========================================
// SKILLS & FERRAMENTAS
// ==========================================

export async function getSkills(): Promise<Skill[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) return data as Skill[];
    } catch (err) {
      console.warn('Erro ao carregar skills do Supabase:', err);
    }
  }

  return getLocalItem<Skill[]>(STORAGE_KEY_SKILLS, INITIAL_SKILLS);
}

export async function saveSkills(skills: Skill[]): Promise<Skill[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('skills').upsert(skills).select();
      if (error) throw error;
      if (data) return data as Skill[];
    } catch (err) {
      console.warn('Erro ao salvar skills no Supabase:', err);
    }
  }

  setLocalItem(STORAGE_KEY_SKILLS, skills);
  return skills;
}

// ==========================================
// UPLOAD DE MÍDIA COM VALIDAÇÃO SEGURA (MAX 5MB, JPEG/PNG/WEBP)
// ==========================================

export async function uploadMediaFile(file: File): Promise<{ url: string; error?: string }> {
  // Validação de tipo de arquivo
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.type)) {
    return { url: '', error: 'Formato não suportado. Utilize apenas JPEG, PNG ou WebP.' };
  }

  // Validação de tamanho (máximo 5MB conforme documento)
  const MAX_SIZE_BYTES = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    return { url: '', error: 'O arquivo excede o limite máximo permitido de 5 MB.' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
      return { url: data.publicUrl };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha no upload';
      console.warn('Erro ao subir arquivo no Supabase Storage:', message);
    }
  }

  // Fallback local: conversão para Data URL para pré-visualização e armazenamento local
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ url: '', error: 'Falha ao processar o arquivo no navegador.' });
    };
    reader.readAsDataURL(file);
  });
}
