import React from 'react';
import {
  CalendarDays,
  UserPlus,
  FileText,
  HeartPulse,
  ListChecks,
  Boxes,
  CalendarCheck,
  Wallet,
  FileSpreadsheet,
  CloudDownload,
  CloudUpload,
  X,
  Activity
} from 'lucide-react';

export type ModuloId =
  | 'agenda'
  | 'registro'
  | 'historias'
  | 'terapias'
  | 'asistencia'
  | 'inventario'
  | 'rencuentro'
  | 'finanzas';

interface SidebarProps {
  moduloActivo: ModuloId;
  onCambiarModulo: (modulo: ModuloId) => void;
  menuMobileAbierto: boolean;
  onCerrarMenuMobile: () => void;
}

const ITEMS_MENU: { id: ModuloId; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'agenda', label: 'Horario y Agenda', icon: CalendarDays },
  { id: 'registro', label: 'Registro de Paciente', icon: UserPlus },
  { id: 'historias', label: 'Historia Clínica (A4)', icon: FileText },
  { id: 'terapias', label: 'Ficha de Terapias (A6)', icon: HeartPulse },
  { id: 'asistencia', label: 'Asistencia y Boletas', icon: ListChecks },
  { id: 'inventario', label: 'Inventario Clínico', icon: Boxes },
  { id: 'rencuentro', label: 'Rencuentro Sábados', icon: CalendarCheck },
  { id: 'finanzas', label: 'Finanzas y Caja', icon: Wallet },
];

export const Sidebar: React.FC<SidebarProps> = ({
  moduloActivo,
  onCambiarModulo,
  menuMobileAbierto,
  onCerrarMenuMobile
}) => {
  return (
    <>
      {/* Backdrop para cerrar menú en móvil */}
      {menuMobileAbierto && (
        <div
          onClick={onCerrarMenuMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white flex flex-col justify-between p-4 shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 md:static shrink-0 overflow-y-auto no-print ${
          menuMobileAbierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
            <h1 className="text-base font-bold text-emerald-400 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              <span>CEDO-REHAB</span>
            </h1>
            <button
              onClick={onCerrarMenuMobile}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 md:hidden"
              title="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5 text-xs">
            {ITEMS_MENU.map((item) => {
              const Icon = item.icon;
              const isActivo = moduloActivo === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onCambiarModulo(item.id);
                    onCerrarMenuMobile();
                  }}
                  className={`w-full flex items-center p-2.5 rounded-lg transition font-medium text-left ${
                    isActivo
                      ? 'bg-slate-700 text-emerald-400 shadow-xs'
                      : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2.5 ${isActivo ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sección inferior de Respaldos y Exportación */}
        <div className="mt-4 pt-3 border-t border-slate-700 space-y-2 shrink-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Respaldos y Datos
            </span>
          </div>

          <button
            onClick={() => alert('Función de exportación a Excel en desarrollo.')}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition font-bold text-white shadow text-xs"
            title="Exporta todos los datos en un archivo de Excel con múltiples pestañas"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5" />
            <span>Exportar a Excel</span>
          </button>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => alert('Backup JSON en desarrollo.')}
              className="flex items-center justify-center p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition font-medium text-slate-200 text-[11px]"
              title="Descarga una copia completa en formato JSON"
            >
              <CloudDownload className="w-3.5 h-3.5 mr-1 text-blue-400" />
              <span>Backup</span>
            </button>
            <button
              onClick={() => alert('Restauración JSON en desarrollo.')}
              className="flex items-center justify-center p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition font-medium text-slate-200 text-[11px]"
              title="Restaura la base de datos desde un archivo JSON"
            >
              <CloudUpload className="w-3.5 h-3.5 mr-1 text-amber-400" />
              <span>Restaurar</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
