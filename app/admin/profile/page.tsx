'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  getProfile,
  saveProfile,
  getContactLinks,
  saveContactLinks,
  getSkills,
  saveSkills,
  uploadMediaFile,
} from '@/lib/portfolioService';
import { Profile, ContactLink, Skill } from '@/types/portfolio';
import {
  UserCog,
  CheckCircle,
  AlertCircle,
  Save,
  Plus,
  Trash2,
  FileText,
  MessageSquare,
  Mail,
  Linkedin,
  Github,
  Wrench,
  Upload,
} from 'lucide-react';

export default function AdminProfilePage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [contacts, setContacts] = useState<ContactLink[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [uploadHeroLoading, setUploadHeroLoading] = useState(false);
  const [uploadHeroError, setUploadHeroError] = useState<string | null>(null);

  // Nova habilidade
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploadHeroLoading(true);
    setUploadHeroError(null);
    const res = await uploadMediaFile(file);
    if (res.error) {
      setUploadHeroError(res.error);
    } else if (res.url) {
      setProfile({ ...profile, hero_image_url: res.url });
    }
    setUploadHeroLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin/login');
      return;
    }

    async function loadData() {
      try {
        const [p, c, s] = await Promise.all([getProfile(), getContactLinks(), getSkills()]);
        setProfile(p);
        setContacts(c);
        setSkills(s);
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, authLoading, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    setFeedbackMsg(null);

    try {
      const updatedProfile = await saveProfile(profile);
      await saveContactLinks(contacts);
      await saveSkills(skills);
      setProfile(updatedProfile);
      setFeedbackMsg({ type: 'success', text: 'Perfil e configurações atualizados com sucesso!' });
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar';
      setFeedbackMsg({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleContactChange = (index: number, field: keyof ContactLink, value: unknown) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      description: newSkillDesc.trim(),
      category: 'dev_web',
      sort_order: skills.length + 1,
      is_visible: true,
      created_at: new Date().toISOString(),
    };
    setSkills([...skills, newSkill]);
    setNewSkillName('');
    setNewSkillDesc('');
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  if (authLoading || loading || !profile) {
    return (
      <div className="py-20 text-center text-xs text-[#777777] font-mono">
        Carregando dados do perfil...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E3DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202020]">
            Gerenciar Perfil & Contatos
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1">
            Atualize biografia, textos institucionais, redes sociais e ferramentas
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#202020] hover:bg-black text-[#FFFFFF] text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-10">
        
        {/* Bloco 1: Informações Pessoais & Apresentação */}
        <div className="bg-[#FFFFFF] border border-[#E5E3DE] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E5E3DE] pb-4">
            <h2 className="text-sm font-bold text-[#202020]">Identidade Profissional</h2>
            <p className="text-xs text-[#777777]">Dados exibidos no cabeçalho, introdução e rodapé</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-2">
                Nome Profissional
              </label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-2">
                Título Profissional / Áreas
              </label>
              <input
                type="text"
                value={profile.professional_title}
                onChange={(e) => setProfile({ ...profile, professional_title: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-2">
              Título da Apresentação Principal (Hero Title)
            </label>
            <input
              type="text"
              value={profile.hero_title}
              onChange={(e) => setProfile({ ...profile, hero_title: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-2">
              Subtítulo da Apresentação Principal (Hero Subtitle)
            </label>
            <textarea
              rows={2}
              value={profile.hero_subtitle}
              onChange={(e) => setProfile({ ...profile, hero_subtitle: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-2">
              Biografia Completa (Seção Sobre)
            </label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-2">
              Abordagem de Trabalho
            </label>
            <textarea
              rows={3}
              value={profile.approach || ''}
              onChange={(e) => setProfile({ ...profile, approach: e.target.value })}
              placeholder="Descreva sua filosofia de trabalho e resolução de problemas..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-2">
              Link do Currículo em PDF (Google Drive / DropBox / URL pública)
            </label>
            <input
              type="url"
              value={profile.resume_url || ''}
              onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
              placeholder="https://drive.google.com/..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020]"
            />
            <p className="text-[11px] text-[#777777] mt-1">
              Se deixado em branco, o botão de download de currículo fica elegantemente oculto no site.
            </p>
          </div>

          {/* Imagem de Destaque da Home (Escultura / Arte em Galeria) */}
          <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E5E3DE] space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020]">
              Imagem de Destaque da Home (Escultura Clássica com Óculos / Arte)
            </label>
            <p className="text-xs text-[#777777]">
              Faça upload do arquivo da escultura ou informe o caminho do arquivo (ex: /images/busto-base.jpg).
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFFFFF] border border-[#E5E3DE] text-xs font-semibold text-[#202020] hover:bg-[#E5E3DE] transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadHeroLoading ? 'Enviando...' : 'Fazer Upload (Max 5MB)'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleHeroUpload}
                  className="hidden"
                  disabled={uploadHeroLoading}
                />
              </label>

              <span className="text-xs text-[#777777]">ou URL / Caminho local:</span>

              <input
                type="text"
                value={profile.hero_image_url || ''}
                onChange={(e) => setProfile({ ...profile, hero_image_url: e.target.value })}
                placeholder="/images/hero-busto.svg ou https://..."
                className="flex-1 px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#E5E3DE] text-xs text-[#202020]"
              />
            </div>

            {uploadHeroError && (
              <p className="text-xs text-red-600">{uploadHeroError}</p>
            )}

            {profile.hero_image_url && (
              <div className="mt-2 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.hero_image_url}
                  alt="Pré-visualização do destaque"
                  className="w-24 h-16 object-cover rounded-md border border-[#E5E3DE]"
                />
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, hero_image_url: '' })}
                  className="text-xs text-red-600 hover:underline"
                >
                  Restaurar padrão da galeria
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bloco 2: Canais de Contato & Redes */}
        <div className="bg-[#FFFFFF] border border-[#E5E3DE] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E5E3DE] pb-4">
            <h2 className="text-sm font-bold text-[#202020]">Canais de Contato</h2>
            <p className="text-xs text-[#777777]">Configuração do WhatsApp, e-mail e perfis profissionais</p>
          </div>

          <div className="space-y-4">
            {contacts.map((contact, idx) => (
              <div
                key={contact.id}
                className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E5E3DE] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#202020]">
                    {contact.label} ({contact.contact_type})
                  </span>
                  <label className="flex items-center gap-2 text-xs text-[#777777]">
                    <input
                      type="checkbox"
                      checked={contact.is_active}
                      onChange={(e) => handleContactChange(idx, 'is_active', e.target.checked)}
                      className="rounded"
                    />
                    <span>Ativo</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#777777] mb-1">
                      {contact.contact_type === 'whatsapp'
                        ? 'Número de WhatsApp (ex: 5511999999999)'
                        : 'URL ou Endereço de e-mail'}
                    </label>
                    <input
                      type="text"
                      value={contact.value_url}
                      onChange={(e) => handleContactChange(idx, 'value_url', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#E5E3DE] text-xs text-[#202020]"
                    />
                  </div>

                  {contact.contact_type === 'whatsapp' && (
                    <div>
                      <label className="block text-[11px] text-[#777777] mb-1">
                        Mensagem Pré-configurada do WhatsApp
                      </label>
                      <input
                        type="text"
                        value={contact.whatsapp_message || ''}
                        onChange={(e) =>
                          handleContactChange(idx, 'whatsapp_message', e.target.value)
                        }
                        placeholder="Olá, Tadeu! Gostaria de conversar..."
                        className="w-full px-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#E5E3DE] text-xs text-[#202020]"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco 3: Ferramentas e Tecnologias */}
        <div className="bg-[#FFFFFF] border border-[#E5E3DE] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E5E3DE] pb-4">
            <h2 className="text-sm font-bold text-[#202020]">Ferramentas & Tecnologias</h2>
            <p className="text-xs text-[#777777]">Gerencie os softwares e tecnologias listados no portfólio</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-3 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] flex items-center justify-between gap-2"
              >
                <div>
                  <span className="text-xs font-bold text-[#202020] block">{skill.name}</span>
                  {skill.description && (
                    <span className="text-[11px] text-[#777777] block truncate max-w-[180px]">
                      {skill.description}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  title="Remover ferramenta"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Adicionar nova ferramenta */}
          <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E5E3DE] flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-[11px] text-[#777777] mb-1">Nome da Ferramenta</label>
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Ex: Figma, Premiere Pro..."
                className="w-full px-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#E5E3DE] text-xs text-[#202020]"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-[11px] text-[#777777] mb-1">Descrição Breve</label>
              <input
                type="text"
                value={newSkillDesc}
                onChange={(e) => setNewSkillDesc(e.target.value)}
                placeholder="Ex: Prototipação e fluxos de navegação"
                className="w-full px-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#E5E3DE] text-xs text-[#202020]"
              />
            </div>
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-md bg-[#202020] text-white text-xs font-semibold hover:bg-black transition-colors shrink-0"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#E5E3DE]">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#202020] hover:bg-black text-[#FFFFFF] text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Gravando alterações...' : 'Salvar Todas as Alterações'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
