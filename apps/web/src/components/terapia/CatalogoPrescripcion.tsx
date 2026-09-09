import React from 'react';
import { CATALOGO_PRESCRIPCION_COMPLETO, type ItemCatalogoPrescripcion } from '@cedo/shared';

export interface CatalogoPrescripcionProps {
  seleccionados: string[];
  onToggle: (id: string) => void;
  deshabilitado?: boolean;
}

const CATEGORIAS_CONFIG: {
  categoria: ItemCatalogoPrescripcion['categoria'];
  titulo: string;
  colorBadge: string;
}[] = [
  {
    categoria: 'AGENTES_FISICOS',
    titulo: 'Agentes Físicos',
    colorBadge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
  },
  {
    categoria: 'TECNICAS_MANUALES',
    titulo: 'Técnicas Manuales y Mecanoterapia',
    colorBadge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
  },
  {
    categoria: 'CINESITERAPIA',
    titulo: 'Cinesiterapia y Ejercicios',
    colorBadge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
  }
];

export const CatalogoPrescripcion: React.FC<CatalogoPrescripcionProps> = ({
  seleccionados,
  onToggle,
  deshabilitado = false
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            Prescripción de Agentes y Técnicas Terapéuticas
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Haga clic sobre cualquier casilla para marcar o desmarcar con la tradicional [ X ] de alto contraste
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800">
          {seleccionados.length} seleccionada{seleccionados.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIAS_CONFIG.map(({ categoria, titulo, colorBadge }) => {
          const items = CATALOGO_PRESCRIPCION_COMPLETO.filter((it) => it.categoria === categoria);

          return (
            <div
              key={categoria}
              className="bg-slate-50/70 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {titulo}
                </h4>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${colorBadge}`}>
                  {items.length}
                </span>
              </div>

              <div className="space-y-1.5 flex-1">
                {items.map((item) => {
                  const estaSeleccionado = seleccionados.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      role="checkbox"
                      aria-checked={estaSeleccionado}
                      tabIndex={deshabilitado ? -1 : 0}
                      data-testid={`casilla-${item.id}`}
                      onClick={() => {
                        if (!deshabilitado) {
                          onToggle(item.id);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (!deshabilitado && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          onToggle(item.id);
                        }
                      }}
                      className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer select-none transition-all duration-150 border ${
                        estaSeleccionado
                          ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      } ${deshabilitado ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`text-xs font-medium tracking-tight pr-2 ${
                          estaSeleccionado
                            ? 'text-blue-900 dark:text-blue-200 font-semibold'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.nombre}
                      </span>

                      {/* Casilla tipo "X" de alto contraste */}
                      <div
                        className={`w-6 h-6 shrink-0 rounded border-2 flex items-center justify-center font-black text-sm transition-colors ${
                          estaSeleccionado
                            ? 'bg-blue-600 border-blue-700 text-white dark:bg-blue-500 dark:border-blue-400'
                            : 'border-slate-400 bg-slate-50 dark:border-slate-600 dark:bg-slate-700/50 group-hover:border-slate-500 text-transparent'
                        }`}
                      >
                        {estaSeleccionado ? 'X' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
