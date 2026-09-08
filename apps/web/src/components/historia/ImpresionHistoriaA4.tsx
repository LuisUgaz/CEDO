import React from 'react';
import { Printer, ArrowLeft, Activity, ShieldAlert } from 'lucide-react';
import type { Patient, ClinicalHistory } from '@cedo/shared';

interface ImpresionHistoriaA4Props {
  paciente: Patient;
  historia: ClinicalHistory;
  onCerrar: () => void;
}

export const ImpresionHistoriaA4: React.FC<ImpresionHistoriaA4Props> = ({
  paciente,
  historia,
  onCerrar
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center bg-slate-100 min-h-screen p-2 sm:p-6">
      {/* Barra de herramientas superior (oculta en impresión) */}
      <div className="w-full max-w-[210mm] flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 mb-4 shadow-xs no-print">
        <button
          onClick={onCerrar}
          className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Volver a la Ficha</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Formato: Estándar A4 Vertical (210 × 297 mm)
          </span>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition active:scale-95"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            <span>Imprimir Documento</span>
          </button>
        </div>
      </div>

      {/* Hoja A4 Vertical Formal */}
      <div className="w-full max-w-[210mm] bg-white text-slate-900 p-8 sm:p-12 shadow-md print-a4-vertical border border-slate-200 text-[11px] leading-relaxed font-sans">
        {/* Encabezado y Membrete Institucional Oficial */}
        <header className="border-b-2 border-emerald-600 pb-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-wide text-slate-900 uppercase">
                  CENTRO DE DIAGNÓSTICO Y REHABILITACIÓN FÍSICA
                </h1>
                <h2 className="text-xs font-black text-emerald-700 tracking-wider">
                  CEDO-REHAB E.I.R.L.
                </h2>
                <p className="text-[9px] text-slate-500">
                  RUC: 20601234567 • Chiclayo - Lambayeque, Perú
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block bg-slate-900 text-white font-extrabold text-[11px] px-3 py-1 rounded tracking-wider uppercase">
                HISTORIA CLÍNICA - EVALUACIÓN MÉDICA
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                Fecha: {historia.fechaEvaluacion}
              </p>
            </div>
          </div>
        </header>

        {/* Ficha de Identificación del Paciente */}
        <section className="mb-4 bg-slate-50/80 rounded border border-slate-300 p-2.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
            <div>
              <span className="font-bold text-slate-600 uppercase block">Paciente:</span>
              <span className="font-bold text-slate-900 text-xs">{paciente.nombre}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600 uppercase block">DNI:</span>
              <span className="font-semibold text-slate-800">{paciente.dni}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600 uppercase block">Edad:</span>
              <span className="font-semibold text-slate-800">{paciente.edad} años</span>
            </div>
            <div>
              <span className="font-bold text-slate-600 uppercase block">Teléfono:</span>
              <span className="font-semibold text-slate-800">{paciente.celular}</span>
            </div>

            {paciente.edad < 18 && paciente.nombreApoderado && (
              <div className="col-span-2 sm:col-span-4 pt-1 border-t border-slate-200 mt-1 flex items-center space-x-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-bold text-slate-700">Apoderado Legal:</span>
                <span className="text-slate-900 font-medium">
                  {paciente.nombreApoderado} {paciente.dniApoderado ? `(DNI: ${paciente.dniApoderado})` : ''}
                </span>
              </div>
            )}

            {historia.medicoEvaluador && (
              <div className="col-span-2 sm:col-span-4 pt-1 border-t border-slate-200 mt-1">
                <span className="font-bold text-slate-700">Médico Fisiatra / Evaluador: </span>
                <span className="text-slate-900 font-semibold">{historia.medicoEvaluador}</span>
              </div>
            )}
          </div>
        </section>

        {/* Cuerpo del Informe Clínico */}
        <div className="space-y-3">
          {/* 1. Motivo de Consulta */}
          <section className="border border-slate-200 rounded p-2.5">
            <h3 className="text-[10px] font-extrabold uppercase text-slate-700 tracking-wider mb-1 border-b border-slate-100 pb-0.5">
              1. Motivo de Consulta
            </h3>
            <p className="text-slate-800 whitespace-pre-line text-[11px]">
              {historia.motivoConsulta}
            </p>
          </section>

          {/* 2. Antecedentes Médicos y Quirúrgicos */}
          <section className="border border-slate-200 rounded p-2.5">
            <h3 className="text-[10px] font-extrabold uppercase text-slate-700 tracking-wider mb-1 border-b border-slate-100 pb-0.5">
              2. Antecedentes Médicos y Quirúrgicos
            </h3>
            <p className="text-slate-800 whitespace-pre-line text-[11px]">
              {historia.antecedentes || 'Sin antecedentes patológicos de relevancia reportados.'}
            </p>
          </section>

          {/* 3. Examen Físico y Evaluación Postural */}
          <section className="border border-slate-200 rounded p-2.5">
            <h3 className="text-[10px] font-extrabold uppercase text-slate-700 tracking-wider mb-1 border-b border-slate-100 pb-0.5">
              3. Examen Físico y Evaluación Postural
            </h3>
            <p className="text-slate-800 whitespace-pre-line text-[11px]">
              {historia.evaluacionFisica || 'Evaluación osteomuscular y articular dentro de límites funcionales.'}
            </p>
          </section>

          {/* 4. Parámetros Clínicos Específicos / Dinámicos */}
          {historia.camposDinamicos && historia.camposDinamicos.length > 0 && (
            <section className="border border-slate-200 rounded p-2.5">
              <h3 className="text-[10px] font-extrabold uppercase text-slate-700 tracking-wider mb-1.5 border-b border-slate-100 pb-0.5">
                4. Parámetros Clínicos Específicos (Evaluación Dinámica)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                {historia.camposDinamicos.map((campo) => (
                  <div key={campo.id} className="p-1.5 bg-slate-50 rounded border border-slate-200">
                    <span className="font-bold text-slate-700 block">{campo.nombre}:</span>
                    <span className="text-slate-900 whitespace-pre-line">{campo.valor || '—'}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. Diagnóstico Médico (DX) */}
          <section className="border-2 border-slate-800 rounded p-2.5 bg-slate-50/50">
            <h3 className="text-[10px] font-black uppercase text-slate-900 tracking-wider mb-1 flex items-center">
              <span className="bg-slate-900 text-white px-1.5 py-0.2 rounded mr-1.5 text-[9px]">
                DX
              </span>
              Diagnóstico Médico Principal (CIE-10 / Impresión Diagnóstica)
            </h3>
            <p className="text-slate-900 font-bold text-xs whitespace-pre-line">
              {historia.diagnostico}
            </p>
          </section>

          {/* 6. Plan de Tratamiento e Indicaciones Médicas */}
          <section className="border-2 border-emerald-600 rounded p-2.5 bg-emerald-50/30">
            <h3 className="text-[10px] font-black uppercase text-emerald-800 tracking-wider mb-1 flex items-center">
              <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded mr-1.5 text-[9px]">
                TX
              </span>
              Plan de Tratamiento Terapéutico e Indicaciones Médicas
            </h3>
            <p className="text-slate-800 font-medium text-[11px] whitespace-pre-line">
              {historia.planTratamiento}
            </p>
          </section>
        </div>

        {/* Pie de Página Formal y Firma Médica */}
        <footer className="mt-8 pt-4 border-t border-slate-300">
          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="text-[9px] text-slate-500 space-y-0.5">
              <p className="font-bold text-slate-700">CEDO-REHAB E.I.R.L. • Clínica de Rehabilitación Física</p>
              <p>Chiclayo - Lambayeque, Perú • Teléfono: (074) 234567</p>
              <p>Documento médico válido para trámite asistencial interno y prescripción.</p>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-48 border-b border-slate-800 mb-1" />
              <p className="font-bold text-[10px] text-slate-800 uppercase">
                Firma y Sello del Médico Evaluador
              </p>
              <p className="text-[9px] text-slate-500">C.M.P. / Fisiatra Responsable</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default ImpresionHistoriaA4;
