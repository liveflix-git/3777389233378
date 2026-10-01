import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Key, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import { MatrixBackground } from '../components/MatrixBackground';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor, digite seu e-mail.');
      return;
    }

    if (!password.trim()) {
      setError('Por favor, digite sua senha.');
      return;
    }

    if (activeTab === 'register' && !name.trim()) {
      setError('Por favor, digite seu nome.');
      return;
    }

    setIsLoading(true);
    setError('');

    if (activeTab === 'login') {
      const res = await signIn(email.trim(), password.trim());
      setIsLoading(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      }
    } else {
      const res = await signUp(email.trim(), password.trim(), name.trim());
      setIsLoading(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || 'Erro ao criar conta no Supabase.');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#05090C] text-[#F5F7FA] font-sans selection:bg-[#2563EB]/30 overflow-x-hidden flex flex-col justify-center items-center p-4">
      <MatrixBackground opacity={0.35} speed={0.4} />

      <div className="relative z-10 w-full max-w-md bg-[#0C1114] border border-[#20282D] rounded-[24px] p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(37,99,235,0.15)] space-y-6 text-left select-none">
        {/* LOGO & TITLE */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/35 flex items-center justify-center text-[#3B82F6] shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Área de Acesso
          </h1>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Entre na sua conta ou crie um novo cadastro para acessar o painel.
          </p>
        </div>

        {/* TABS: LOGIN / REGISTRO */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#05090C] rounded-xl border border-[#20282D]">
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('register')}
            className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'register' && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                Nome Completo
              </label>
              <div className="relative flex items-center bg-[#05090C] border border-[#20282D] focus-within:border-[#3B82F6] rounded-xl px-3.5 py-3 transition-colors">
                <User className="w-4 h-4 text-[#6B7280] mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Seu nome"
                  className="w-full bg-transparent text-white placeholder-[#6B7280] font-medium text-sm outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
              E-mail
            </label>
            <div className="relative flex items-center bg-[#05090C] border border-[#20282D] focus-within:border-[#3B82F6] rounded-xl px-3.5 py-3 transition-colors">
              <Mail className="w-4 h-4 text-[#6B7280] mr-2.5 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-transparent text-white placeholder-[#6B7280] font-medium text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
              Senha
            </label>
            <div className="relative flex items-center bg-[#05090C] border border-[#20282D] focus-within:border-[#3B82F6] rounded-xl px-3.5 py-3 transition-colors">
              <Key className="w-4 h-4 text-[#6B7280] mr-2.5 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••••••"
                className="w-full bg-transparent text-white placeholder-[#6B7280] font-medium text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-[#6B7280] hover:text-white transition-colors cursor-pointer ml-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#1D4ED8] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>{activeTab === 'login' ? 'Entrar no Painel' : 'Criar minha Conta'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-[#6B7280] text-center pt-2 border-t border-[#20282D]">
          🔒 Conexão criptografada e autenticada com Supabase.
        </p>
      </div>
    </div>
  );
};
