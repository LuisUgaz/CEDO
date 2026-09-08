import React from 'react';
import { Menu, Activity, Shield } from 'lucide-react';

interface HeaderProps {
  tituloModulo: string;
  onToggleMenuMobile: () => void;
  isOnline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  tituloModulo,
  onToggleMenuMobile,
  isOnline = true
}) => {
  return (
    <header className="bg-slate-900 text-white flex items-center justify-between px-4 py-2.5 border-b border-slate-700 shadow-sm shrink-0 z-30 no-print">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMenuMobile}
          className="md:hidden p-1.5 rounded-lg bg-slate-800 text-emerald-400 hover:bg-slate-700 focus:outline-none transition active:scale-95"
          title="Abrir Menú"
          aria-label="Abrir Menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span className="font-extrabold text-sm tracking-wider text-white">CEDO-REHAB</span>
          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded font-bold uppercase">
            Suite
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-semibold">
          {tituloModulo}
        </span>

        {/* Indicador de Estado de Conexión */}
        <div
          className="flex items-center space-x-1.5 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700 text-[11px] font-medium"
          title={isOnline ? "Conectado a Firebase en la nube" : "Modo Offline / Local"}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className={isOnline ? 'text-emerald-400' : 'text-amber-400'}>
            {isOnline ? 'En línea' : 'Offline'}
          </span>
        </div>

        {/* Rol activo de usuario */}
        <div className="hidden md:flex items-center space-x-1 text-[11px] text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-700">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold">Recepción</span>
        </div>
      </div>
    </header>
  );
};
