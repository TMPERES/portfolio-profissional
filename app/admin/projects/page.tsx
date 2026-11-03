'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  getAllProjectsAdmin,
  saveProject,
  deleteProject,
  uploadMediaFile,
} from '@/lib/portfolioService';
import { Project, ProjectCategory, ProjectStatus } from '@/types/portfolio';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  Search,
  X,
  ExternalLink,
  Film,
} from 'lucide-react';

const CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: 'design_grafico', label: 'Design Gráfico' },
  { id: 'webdesign', label: 'Webdesign' },
  { id: 'audiovisual', label: 'Audiovisual & Vídeo' },
  { id: 'dev_web', label: 'Programador Jr.' },
];

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function AdminProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAdmin, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Estado do formulário modal/drawer
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [toolsInput, setToolsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Exclusão com confirmação
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Upload feedback
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Carrega projetos
  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjectsAdmin();
      setProjects(data);
    } catch (err) {
      console.error('Erro ao listar projetos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin/login');
      return;
    }

    let isSubscribed = true;
    async function fetchList() {
      try {
        const data = await getAllProjectsAdmin();
        if (isSubscribed) {
          setProjects(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro ao listar projetos:', err);
        if (isSubscribed) setLoading(false);
      }
    }

    if (isAdmin) {
      fetchList();
    }
    return () => {
      isSubscribed = false;
    };
  }, [isAdmin, authLoading, router]);

  const openNewProjectForm = React.useCallback(() => {
    setFormError(null);
    setFormSuccess(null);
    setUploadError(null);
    setToolsInput('');
    setEditingProject({
      title: '',
      slug: '',
      category: 'design_grafico',
      short_description: '',
      description: '',
      context_objective: '',
      solution_process: '',
      cover_image_path: '',
      alt_text: '',
      video_url: '',
      external_url: '',
      tools: [],
      project_year: new Date().getFullYear(),
      sort_order: projects.length + 1,
      status: 'published',
    });
  }, [projects.length]);

  const openEditProjectForm = React.useCallback((project: Project) => {
    setFormError(null);
    setFormSuccess(null);
    setUploadError(null);
    setEditingProject({ ...project });
    setToolsInput(project.tools?.join(', ') || '');
  }, []);

  // Se a URL tiver ?action=new ou ?edit=id, abre o formulário
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('edit');
    if (!action && !editId) return;

    const timer = setTimeout(() => {
      if (action === 'new') {
        openNewProjectForm();
      } else if (editId && projects.length > 0) {
        const found = projects.find((p) => p.id === editId);
        if (found) openEditProjectForm(found);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams, projects, openNewProjectForm, openEditProjectForm]);

  const handleTitleChange = (newTitle: string) => {
    if (!editingProject) return;
    const isNew = !editingProject.id || editingProject.id.startsWith('proj-');
    // Atualiza título e sugere slug se novo
    setEditingProject({
      ...editingProject,
      title: newTitle,
      slug: isNew && !editingProject.slug ? generateSlug(newTitle) : editingProject.slug,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setUploadLoading(true);
    setUploadError(null);

    const res = await uploadMediaFile(file);
    if (res.error) {
      setUploadError(res.error);
    } else if (res.url) {
      setEditingProject({
        ...editingProject,
        cover_image_path: res.url,
      });
    }
    setUploadLoading(false);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setFormError(null);
    setFormSuccess(null);

    if (!editingProject.title?.trim()) {
      setFormError('O título do projeto é obrigatório.');
      return;
    }

    const finalSlug = editingProject.slug?.trim() || generateSlug(editingProject.title);

    // Converte tools de string para array
    const toolsArray = toolsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      await saveProject({
        ...editingProject,
        title: editingProject.title.trim(),
        slug: finalSlug,
        tools: toolsArray,
      });

      setFormSuccess('Projeto salvo com sucesso!');
      await loadProjects();
      setTimeout(() => {
        setEditingProject(null);
        setFormSuccess(null);
      }, 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar projeto';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (project: Project) => {
    const newStatus: ProjectStatus = project.status === 'published' ? 'draft' : 'published';
    await saveProject({ ...project, status: newStatus });
    await loadProjects();
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id);
      setProjectToDelete(null);
      await loadProjects();
    } catch (err) {
      console.error('Erro ao excluir projeto:', err);
    }
  };

  // Filtragem e busca
  const filtered = projects.filter((p) => {
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch =
      searchTerm === '' ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.short_description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (authLoading) return null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202020]">
            Gerenciar Projetos
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1">
            Cadastre, edite, publique ou altere a visibilidade dos trabalhos
          </p>
        </div>

        <button
          type="button"
          onClick={openNewProjectForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#202020] hover:bg-black text-[#FFFFFF] text-xs font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#FFFFFF] border border-[#E5E3DE] text-xs text-[#202020] placeholder-[#777777]/60 focus:outline-hidden focus:border-[#202020]"
          />
          <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              filterCategory === 'all'
                ? 'bg-[#202020] text-[#FFFFFF]'
                : 'bg-[#FFFFFF] border border-[#E5E3DE] text-[#777777] hover:text-[#202020]'
            }`}
          >
            Todos
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                filterCategory === c.id
                  ? 'bg-[#202020] text-[#FFFFFF]'
                  : 'bg-[#FFFFFF] border border-[#E5E3DE] text-[#777777] hover:text-[#202020]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-[#FFFFFF] border border-[#E5E3DE] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#777777] font-mono">
            Carregando lista de projetos...
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#E5E3DE] text-[#777777] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Projeto</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Ano</th>
                  <th className="px-6 py-4">Ordem</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E3DE]">
                {filtered.map((proj) => (
                  <tr key={proj.id} className="hover:bg-[#F7F6F2]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#202020] text-sm">{proj.title}</div>
                      <div className="text-[#777777] text-xs font-mono mt-0.5 truncate max-w-xs">
                        /projeto/{proj.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#777777]">
                      {CATEGORIES.find((c) => c.id === proj.category)?.label || proj.category}
                    </td>
                    <td className="px-6 py-4 text-[#777777] font-mono tabular-nums">
                      {proj.project_year || '—'}
                    </td>
                    <td className="px-6 py-4 text-[#777777] font-mono tabular-nums">
                      {proj.sort_order}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(proj)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                          proj.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Clique para alternar entre publicado e rascunho"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{proj.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {proj.status === 'published' && (
                          <a
                            href={`/projeto/${proj.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#777777] hover:text-[#202020] hover:bg-[#F7F6F2] rounded-md transition-colors"
                            title="Ver página pública"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => openEditProjectForm(proj)}
                          className="p-1.5 text-[#777777] hover:text-[#202020] hover:bg-[#F7F6F2] rounded-md transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(proj)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#777777]">
            Nenhum projeto corresponde ao filtro ou busca selecionados.
          </div>
        )}
      </div>

      {/* Drawer / Modal do Formulário de Edição/Criação */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202020]/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#FFFFFF] border border-[#E5E3DE] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#F7F6F2] border-b border-[#E5E3DE]">
              <h2 className="text-sm font-bold text-[#202020]">
                {editingProject.id && !editingProject.id.startsWith('proj-')
                  ? 'Editar Projeto'
                  : 'Novo Projeto'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1.5 text-[#777777] hover:text-[#202020] rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProject} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* Title & Slug */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                    Título do Projeto *
                  </label>
                  <input
                    type="text"
                    value={editingProject.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ex: Identidade Visual para Estúdio de Design"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020] focus:outline-hidden focus:border-[#202020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                    Identificador Amigável (Slug)
                  </label>
                  <input
                    type="text"
                    value={editingProject.slug || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, slug: generateSlug(e.target.value) })
                    }
                    placeholder="identidade-visual-estudio"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs font-mono text-[#202020] focus:outline-hidden focus:border-[#202020]"
                  />
                  <p className="text-[11px] text-[#777777] mt-1">
                    Será acessível em: /projeto/{editingProject.slug || 'slug-do-projeto'}
                  </p>
                </div>
              </div>

              {/* Category & Status & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                    Categoria *
                  </label>
                  <select
                    value={editingProject.category || 'design_grafico'}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value as ProjectCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                    Status de Publicação
                  </label>
                  <select
                    value={editingProject.status || 'published'}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        status: e.target.value as ProjectStatus,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
                  >
                    <option value="published">Publicado (Visível no site)</option>
                    <option value="draft">Rascunho (Privado)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={editingProject.sort_order ?? 0}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        sort_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
                  />
                </div>
              </div>

              {/* Ano & Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                    Ano do Projeto
                  </label>
                  <input
                    type="number"
                    value={editingProject.project_year || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        project_year: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="Ex: 2025"
                    className="w-full px-3 py-2 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                    Vídeo (URL YouTube/Vimeo)
                  </label>
                  <input
                    type="url"
                    value={editingProject.video_url || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, video_url: e.target.value })
                    }
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-3 py-2 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                    Link Externo (Demo / Repositório)
                  </label>
                  <input
                    type="url"
                    value={editingProject.external_url || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, external_url: e.target.value })
                    }
                    placeholder="https://meuprojeto.com"
                    className="w-full px-3 py-2 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
                  />
                </div>
              </div>

              {/* Upload e Imagem de Capa */}
              <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E5E3DE] space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020]">
                  Imagem de Capa (Upload ou URL)
                </label>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFFFFF] border border-[#E5E3DE] text-xs font-semibold text-[#202020] hover:bg-[#E5E3DE] transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadLoading ? 'Enviando...' : 'Fazer Upload (Max 5MB)'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadLoading}
                    />
                  </label>

                  <span className="text-xs text-[#777777]">ou informe a URL direta:</span>

                  <input
                    type="text"
                    value={editingProject.cover_image_path || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, cover_image_path: e.target.value })
                    }
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#E5E3DE] text-xs text-[#202020]"
                  />
                </div>

                {uploadError && (
                  <p className="text-xs text-red-600">{uploadError}</p>
                )}

                {editingProject.cover_image_path && (
                  <div className="mt-2 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editingProject.cover_image_path}
                      alt="Pré-visualização"
                      className="w-20 h-14 object-cover rounded-md border border-[#E5E3DE]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditingProject({ ...editingProject, cover_image_path: '' })
                      }
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remover imagem
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] text-[#777777] mb-1">
                    Texto alternativo para acessibilidade (Alt text)
                  </label>
                  <input
                    type="text"
                    value={editingProject.alt_text || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, alt_text: e.target.value })
                    }
                    placeholder="Ex: Cartazes gráficos impressos em exposição editorial"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5E3DE] text-xs text-[#202020]"
                  />
                </div>
              </div>

              {/* Descrições */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                  Descrição Curta (exibida no card do portfólio) *
                </label>
                <textarea
                  rows={2}
                  value={editingProject.short_description || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, short_description: e.target.value })
                  }
                  placeholder="Resumo em 1-2 frases do trabalho realizado..."
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020] focus:outline-hidden focus:border-[#202020]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                    Contexto & Objetivo
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.context_objective || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, context_objective: e.target.value })
                    }
                    placeholder="Qual era o desafio do cliente ou meta do projeto?"
                    className="w-full px-3 py-2 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                    Processo & Solução Adotada
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.solution_process || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, solution_process: e.target.value })
                    }
                    placeholder="Como você desenvolveu a solução técnica e estética?"
                    className="w-full px-3 py-2 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
                  />
                </div>
              </div>

              {/* Ferramentas */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-1.5">
                  Ferramentas Utilizadas (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={toolsInput}
                  onChange={(e) => setToolsInput(e.target.value)}
                  placeholder="Ex: Adobe Photoshop, CorelDRAW, React, TypeScript"
                  className="w-full px-3 py-2 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3DE]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 text-xs font-medium text-[#777777] hover:text-[#202020]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-lg bg-[#202020] hover:bg-black text-[#FFFFFF] text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Projeto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal de Exclusão */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202020]/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#FFFFFF] border border-[#E5E3DE] rounded-2xl p-6 shadow-xl text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#202020] mb-2">Excluir Projeto?</h3>
            <p className="text-xs text-[#777777] mb-6 leading-relaxed">
              Tem certeza de que deseja excluir permanentemente o projeto{' '}
              <strong>&quot;{projectToDelete.title}&quot;</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-[#777777] hover:text-[#202020]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-[#FFFFFF] text-xs font-semibold transition-colors"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-[#777777] font-mono">
          Carregando painel de projetos...
        </div>
      }
    >
      <AdminProjectsContent />
    </Suspense>
  );
}
