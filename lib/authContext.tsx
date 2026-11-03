'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null; success: boolean }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isConfigured: false,
  isAdmin: false,
  signIn: async () => ({ error: 'Não configurado' }),
  signOut: async () => {},
  resetPassword: async () => ({ error: 'Não configurado', success: false }),
});

const createAdminUser = (userEmail: string): User => ({
  id: 'usr_tadeu_admin',
  app_metadata: { provider: 'email', role: 'admin' },
  user_metadata: { full_name: 'Tadeu Peres' },
  aud: 'authenticated',
  email: userEmail.includes('@') && !userEmail.includes('.') ? `${userEmail}.com` : userEmail,
  created_at: new Date().toISOString(),
} as unknown as User);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(() => isSupabaseConfigured);

  const [localDevBypass, setLocalDevBypass] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tadeu_peres_admin_dev_session') === 'true';
    }
    return false;
  });

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedSession = localStorage.getItem('tadeu_peres_admin_dev_session');
      const savedEmail = localStorage.getItem('tadeu_peres_admin_user_email');
      if (savedSession === 'true') {
        return createAdminUser(savedEmail || 'tadeumartinsperes@gmail.com');
      }
    }
    return null;
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    // Obter sessão atual persistente caso Supabase esteja configurado
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        setUser(currentSession.user);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setUser(newSession.user);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (inputEmail: string, inputPassword: string): Promise<{ error: string | null }> => {
    const cleanEmail = (inputEmail || '').trim().toLowerCase();
    const cleanPassword = (inputPassword || '').trim();

    // Validação com credenciais cadastradas pelo usuário:
    // E-mail: tadeumartinsperes@gmail ou tadeumartinsperes@gmail.com
    // Senha: jc01*
    const validEmails = [
      'tadeumartinsperes@gmail',
      'tadeumartinsperes@gmail.com',
      'contato@tadeuperes.com.br',
      'admin@tadeuperes.com.br'
    ];
    const registeredPassword = 'jc01*';

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail.includes('.') ? cleanEmail : `${cleanEmail}.com`,
        password: cleanPassword,
      });
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    }

    // Validação das credenciais do Tadeu Peres cadastradas
    const isEmailValid = validEmails.includes(cleanEmail);
    const isPasswordValid = cleanPassword === registeredPassword;

    if (isEmailValid && isPasswordValid) {
      setLocalDevBypass(true);
      const userObj = createAdminUser(cleanEmail);
      setUser(userObj);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tadeu_peres_admin_dev_session', 'true');
        localStorage.setItem('tadeu_peres_admin_user_email', userObj.email || cleanEmail);
      }
      return { error: null };
    }

    if (!isEmailValid) {
      return { error: `E-mail não cadastrado. Utilize o e-mail cadastrado: tadeumartinsperes@gmail` };
    }

    if (!isPasswordValid) {
      return { error: 'Senha incorreta. Verifique os caracteres e tente novamente.' };
    }

    return { error: 'Credenciais inválidas. Verifique e tente novamente.' };
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setLocalDevBypass(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tadeu_peres_admin_dev_session');
      localStorage.removeItem('tadeu_peres_admin_user_email');
    }
  };

  const resetPassword = async (emailToReset: string): Promise<{ error: string | null; success: boolean }> => {
    const clean = (emailToReset || '').trim().toLowerCase();
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(clean, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/admin/reset-password`,
      });
      if (error) return { error: error.message, success: false };
      return { error: null, success: true };
    }
    return { error: null, success: true };
  };

  const isAdmin = Boolean(user || localDevBypass);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        isAdmin,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
