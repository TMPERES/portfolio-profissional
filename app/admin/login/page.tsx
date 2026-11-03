'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Lock, Mail, KeyRound, AlertCircle, CheckCircle, ArrowLeft, Shield, Eye, EyeOff, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdmin, signIn, resetPassword, isConfigured, loading } = useAuth();

  const [email, setEmail] = useState('tadeumartinsperes@gmail');
  const [password, setPassword] = useState('jc01*');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('tadeumartinsperes@gmail.com');

  // Se já autenticado, redireciona para a raiz do painel
  useEffect(() => {
    if (!loading && isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error);
      } else {
        router.push('/admin');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na autenticação';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setErrorMsg('Informe o e-mail cadastrado para recuperação.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await resetPassword(resetEmail);
      if (error) {
        setErrorMsg(error);
      } else {
        setSuccessMsg('Instruções de redefinição enviadas para o e-mail informado.');
        setShowResetModal(false);
      }
    } catch {
      setErrorMsg('Não foi possível enviar o e-mail de recuperação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777777] hover:text-[#202020] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao site público</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#FFFFFF] border border-[#E5E3DE] rounded-2xl p-8 sm:p-10 shadow-xs">
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#202020] text-[#FFFFFF] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Lock className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#202020]">
              Acesso Administrativo
            </h1>
            <p className="text-xs text-[#777777] mt-1">
              Gerencie projetos, mídias e conteúdos do portfólio Tadeu Peres
            </p>
          </div>

          {/* Destaque das Credenciais Cadastradas */}
          <div className="mb-6 p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#166534]">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-[#14532D]">Credenciais de Administrador Ativas:</span>
            </div>
            <div className="text-[11px] font-mono text-[#15803D] pl-6 space-y-0.5">
              <div><span className="text-[#14532D] font-semibold">E-mail:</span> tadeumartinsperes@gmail</div>
              <div><span className="text-[#14532D] font-semibold">Senha:</span> jc01*</div>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020] mb-2">
                E-mail ou Usuário
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tadeumartinsperes@gmail"
                  required
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-[#F7F6F2] border border-[#E5E3DE] text-sm text-[#202020] placeholder-[#777777]/60 focus:outline-hidden focus:border-[#202020] transition-colors"
                />
                <Mail className="w-4 h-4 text-[#777777] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#202020]">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-xs text-[#777777] hover:text-[#202020] hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 py-3 pl-10 pr-10 rounded-xl bg-[#F7F6F2] border border-[#E5E3DE] text-sm text-[#202020] placeholder-[#777777]/60 focus:outline-hidden focus:border-[#202020] transition-colors"
                />
                <KeyRound className="w-4 h-4 text-[#777777] absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#777777] hover:text-[#202020] transition-colors"
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#202020] hover:bg-black text-[#FFFFFF] text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Verificando credenciais...' : 'Entrar no Painel'}
            </button>
          </form>

          {/* Secure Instruction Note */}
          <div className="mt-8 pt-6 border-t border-[#E5E3DE] text-xs text-[#777777] leading-relaxed">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-[#202020] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#202020]">Acesso Administrativo:</p>
                <p className="mt-0.5">
                  Autenticação protegida para o portfólio oficial de Tadeu Peres.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202020]/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#FFFFFF] border border-[#E5E3DE] rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-base font-bold text-[#202020] mb-2">Recuperar Senha</h3>
            <p className="text-xs text-[#777777] mb-6 leading-relaxed">
              Informe seu e-mail cadastrado no Supabase para receber o link seguro de redefinição de acesso.
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="seu-email@dominio.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#F7F6F2] border border-[#E5E3DE] text-xs text-[#202020] focus:outline-hidden focus:border-[#202020]"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#777777] hover:text-[#202020]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#202020] text-[#FFFFFF] text-xs font-semibold hover:bg-black transition-colors disabled:opacity-50"
                >
                  Enviar Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
