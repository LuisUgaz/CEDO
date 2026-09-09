import React, { useState } from 'react';
import { Printer, ArrowLeft, Activity, Check } from 'lucide-react';
import type { Patient, TherapySheet, PrintFormat } from '@cedo/shared';
import { CATALOGO_PRESCRIPCION_COMPLETO } from '@cedo/shared';

export interface ImpresionTarjetonProps {
  paciente: Patient;
  tarjeton: TherapySheet;
  onCerrar: () => void;
}

export const ImpresionTarjeton: React.FC<ImpresionTarjetonProps> = ({
  paciente,
  tarjeton,
  onCerrar
}) => {
  const [formato, setFormato] = useState<PrintFormat>(tarjeton.formatoImpresion || 'a6');

  const handlePrint = () => {
    window.print();
  };

  const agentesFisicos = CATALOGO_PRESCRIPCION_COMPLETO.filter(
    (item) => item.categoria === 'AGENTES_FISICOS'
  );
  const tecnicasManuales = CATALOGO_PRESCRIPCION_COMPLETO.filter(
    (item) => item.categoria === 'TECNICAS_MANUALES'
  );
  const cinesiterapia = CATALOGO_PRESCRIPCION_COMPLETO.filter(
    (item) => item.categoria === 'CINESITERAPIA'
  );

  const tecnicasMarcadas = (tarjeton.tecnicasSeleccionadas as string[]) || [];

  // Configuración de clases según el formato físico seleccionado
  const contenedorClases =
    formato === 'a6'
      ? 'w-full max-w-[148mm] print-a6-tarjeton text-[9px] p-4'
      : formato === 'a5'
      ? 'w-full max-w-[210mm] print-a5-tarjeton text-[10px] p-6'
      : 'w-full max-w-[210mm] print-a4-terapia text-[11px] p-8';

  return (
    <div className="flex flex-col items-center bg-slate-100 min-h-screen p-2 sm:p-6">
      {/* Barra de herramientas superior (Oculta al imprimir) */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between bg-white border border-slate-200 rounded-xl p-3 mb-4 shadow-xs no-print gap-3">
        <button
          type="button"
          onClick={onCerrar}
          className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Volver al Editor</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">Formato Físico:</span>
            <select
              value={formato}
              onChange={(e) => setFormato(e.target.value as PrintFormat)}
              className="text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-1 bg-slate-50 outline-none"
            >
              <option value="a6">A6 (Tarjetón 148 × 105 mm)</option>
              <option value="a5">A5 (Media Hoja 210 × 148 mm)</option>
              <option value="a4-terapia">A4 (Hoja Completa 210 × 297 mm)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition active:scale-95"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            <span>Imprimir Documento</span>
          </button>
        </div>
      </div>

      {/* Contenedor del Tarjetón Físico */}
      <div className={`bg-white text-slate-900 shadow-md border border-slate-300 rounded-sm leading-tight font-sans ${contenedorClases}`}>
        {/* Encabezado y Membrete Oficial */}
        <header className="border-b-2 border-slate-900 pb-2 mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-blue-700 text-white flex items-center justify-center font-black text-sm shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[11px] font-black tracking-tight text-slate-900 uppercase">
                CENTRO DE DIAGNÓSTICO Y REHABILITACIÓN FÍSICA
              </h1>
              <h2 className="text-[10px] font-extrabold text-blue-800 tracking-wider">
                CEDO-REHAB E.I.R.L.
              </h2>
              <p className="text-[8px] text-slate-500">
                RUC: 20601234567 • Chiclayo - Lambayeque, Perú
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded">
              TARJETÓN DE TRATAMIENTO
            </div>
            <div className="mt-1 flex items-center justify-end gap-1.5 text-[9px] font-bold">
              <span className="text-slate-600">MODALIDAD:</span>
              <span
                className={`px-2 py-0.5 rounded text-[8px] font-black border ${
                  tarjeton.tipoAtencion === 'ASEGURADO'
                    ? 'bg-blue-100 text-blue-900 border-blue-400'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                }`}
              >
                {tarjeton.tipoAtencion}
              </span>
            </div>
          </div>
        </header>

        {/* Ficha de Identificación del Paciente y DX */}
        <section className="bg-slate-50 border border-slate-300 rounded p-2 mb-2">
          <div className="grid grid-cols-12 gap-1 text-[9px]">
            <div className="col-span-6 font-semibold">
              <span className="text-slate-500 uppercase">Paciente:</span>{' '}
              <strong className="text-slate-900 font-bold">{paciente.nombre}</strong>
            </div>
            <div className="col-span-3">
              <span className="text-slate-500 uppercase">DNI:</span>{' '}
              <strong className="text-slate-900 font-semibold">{paciente.dni}</strong>
            </div>
            <div className="col-span-3 text-right">
              <span className="text-slate-500 uppercase">Edad:</span>{' '}
              <strong className="text-slate-900 font-semibold">{paciente.edad} años</strong>
            </div>

            <div className="col-span-4 mt-1">
              <span className="text-slate-500 uppercase">Paquete N°:</span>{' '}
              <strong className="text-blue-900 font-bold">#{tarjeton.numeroPaquete}</strong>
            </div>
            <div className="col-span-4 mt-1">
              <span className="text-slate-500 uppercase">Fecha:</span>{' '}
              <strong className="text-slate-900">{tarjeton.fecha}</strong>
            </div>
            <div className="col-span-4 mt-1 text-right">
              <span className="text-slate-500 uppercase">Teléfono:</span>{' '}
              <strong className="text-slate-900">{paciente.celular || 'S/N'}</strong>
            </div>

            <div className="col-span-12 mt-1 border-t border-slate-200 pt-1">
              <span className="text-slate-500 font-bold uppercase">Diagnóstico (DX):</span>{' '}
              <span className="text-slate-900 font-bold uppercase underline">
                {tarjeton.diagnostico || 'Evaluación funcional de fisioterapia'}
              </span>
            </div>
          </div>
        </section>

        {/* Grilla de Prescripción Fisioterapéutica con Casillas [ X ] */}
        <section className="mb-2">
          <div className="grid grid-cols-3 gap-2">
            {/* Columna 1: Agentes Físicos */}
            <div className="border border-slate-300 rounded p-1.5">
              <h3 className="text-[8px] font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-1">
                Agentes Físicos
              </h3>
              <div className="space-y-0.5">
                {agentesFisicos.map((item) => {
                  const marcado = tecnicasMarcadas.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-[8px] py-0.5"
                    >
                      <span className="text-slate-700 font-medium truncate pr-1">
                        {item.id}
                      </span>
                      <div
                        data-testid={`impresion-casilla-${item.id}`}
                        className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-black text-[9px] ${
                          marcado ? 'bg-slate-900 text-white font-extrabold' : 'bg-white'
                        }`}
                      >
                        {marcado ? 'X' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Columna 2: Técnicas Manuales y Mecanoterapia */}
            <div className="border border-slate-300 rounded p-1.5">
              <h3 className="text-[8px] font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-1">
                Técnicas Manuales
              </h3>
              <div className="space-y-0.5">
                {tecnicasManuales.map((item) => {
                  const marcado = tecnicasMarcadas.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-[8px] py-0.5"
                    >
                      <span className="text-slate-700 font-medium truncate pr-1">
                        {item.id}
                      </span>
                      <div
                        data-testid={`impresion-casilla-${item.id}`}
                        className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-black text-[9px] ${
                          marcado ? 'bg-slate-900 text-white font-extrabold' : 'bg-white'
                        }`}
                      >
                        {marcado ? 'X' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Columna 3: Cinesiterapia e Indicaciones */}
            <div className="flex flex-col space-y-2">
              <div className="border border-slate-300 rounded p-1.5">
                <h3 className="text-[8px] font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-1">
                  Cinesiterapia
                </h3>
                <div className="space-y-0.5">
                  {cinesiterapia.map((item) => {
                    const marcado = tecnicasMarcadas.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-[8px] py-0.5"
                      >
                        <span className="text-slate-700 font-medium truncate pr-1">
                          {item.id}
                        </span>
                        <div
                          data-testid={`impresion-casilla-${item.id}`}
                          className={`w-3.5 h-3.5 border border-slate-800 flex items-center justify-center font-black text-[9px] ${
                            marcado ? 'bg-slate-900 text-white font-extrabold' : 'bg-white'
                          }`}
                        >
                          {marcado ? 'X' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Indicaciones Médicas / Terapéuticas */}
              <div className="border border-slate-300 rounded p-1.5 flex-1 flex flex-col">
                <h3 className="text-[8px] font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                  Indicaciones Adicionales
                </h3>
                {tarjeton.indicacionesAdicionales && tarjeton.indicacionesAdicionales.length > 0 ? (
                  <ul className="list-disc pl-3 text-[8px] space-y-0.5 text-slate-800">
                    {tarjeton.indicacionesAdicionales.map((ind, idx) => (
                      <li key={idx} className="leading-tight">
                        {ind}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    <div className="border-b border-slate-300 h-2"></div>
                    <div className="border-b border-slate-300 h-2"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Cuadrícula de Control de Asistencia de Sesiones (1 a 10 sesiones) */}
        <section className="mb-2">
          <div className="border border-slate-900 rounded overflow-hidden">
            <div className="bg-slate-900 text-white text-[8px] font-bold py-0.5 text-center uppercase tracking-wider">
              Control de Asistencia a Sesiones Terapéuticas (Firma del Terapeuta)
            </div>
            <div className="grid grid-cols-10 divide-x divide-slate-300 text-center text-[8px]">
              {Array.from({ length: 10 }).map((_, idx) => {
                const sesionNum = idx + 1;
                return (
                  <div
                    key={sesionNum}
                    data-testid={`asistencia-sesion-${sesionNum}`}
                    className="flex flex-col"
                  >
                    <div className="bg-slate-100 font-black py-0.5 border-b border-slate-300 text-slate-800">
                      S-{sesionNum}
                    </div>
                    <div className="h-4 border-b border-dashed border-slate-200 text-[7px] text-slate-400 flex items-center justify-center">
                      Fecha
                    </div>
                    <div className="h-6 flex items-center justify-center text-[7px] text-slate-400">
                      Firma
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pie con Firma y Responsabilidad Médica */}
        <footer className="pt-2 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-500">
          <div>
            <span>* Documento oficial de prescripción terapéutica de CEDO-REHAB EIRL.</span>
          </div>
          <div className="text-center w-36">
            <div className="border-b border-slate-800 h-4 mb-0.5"></div>
            <span className="font-bold text-slate-800 uppercase">Firma / Sello Médico</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
