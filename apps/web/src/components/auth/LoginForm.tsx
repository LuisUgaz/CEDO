import React, { useState } from 'react';
import { Activity, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export interface LoginFormProps {
  onLoginSubmit?: (email: string, pass: string) => Promise<void>;
  errorMessage?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSubmit,
  errorMessage
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError('Por favor complete todos los campos requeridos');
      return;
    }

    if (onLoginSubmit) {
      setLoading(true);
      try {
        await onLoginSubmit(email, password);
      } catch (err: any) {
        setLocalError(err.message || 'Error al iniciar sesión');
      } finally {
        setLoading(false);
      }
    }
  };

  const activeError = errorMessage || localError;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header Institucional */}
      <div className="bg-slate-900 p-6 text-center text-white">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl mb-3">
          <Activity className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-black tracking-wide text-white">
          CEDO-REHAB EIRL
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Centro Especializado en Fisioterapia y Rehabilitación
        </p>
      </div>

      {/* Formulario de Inicio de Sesión */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
        {activeError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{activeError}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
          >
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@cedo.pe"
              required
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
          >
            Contraseña
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3 px-4 rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Iniciando Sesión...</span>
            </>
          ) : (
            <span>Iniciar Sesión</span>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 mt-4">
          Acceso exclusivo para personal médico y administrativo autorizado.
        </p>
      </form>
    </div>
  );
};
