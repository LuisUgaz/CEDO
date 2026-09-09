import React, { useState, useEffect } from 'react';
import { FileCheck, Sparkles, Printer } from 'lucide-react';
import type { Patient, TherapySheet } from '@cedo/shared';
import { SelectorPacienteHistoria } from '../historia/SelectorPacienteHistoria';
import { FormularioTarjeton } from './FormularioTarjeton';
import { ImpresionTarjeton } from './ImpresionTarjeton';
import { VistaTerapeuta } from './VistaTerapeuta';
import { suscribirTarjetonPorPaciente } from '../../services/tarjeton.service';

export interface ModuloTarjetonProps {
  pacienteInicial?: Patient | null;
  vistaInicial?: 'tarjeton' | 'turnos';
}

export const ModuloTarjeton: React.FC<ModuloTarjetonProps> = ({
  pacienteInicial = null,
  vistaInicial = 'tarjeton'
}) => {
  const [subVista, setSubVista] = useState<'tarjeton' | 'turnos'>(vistaInicial);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Patient | null>(
    pacienteInicial
  );
  const [tarjeton, setTarjeton] = useState<TherapySheet | null>(null);
  const [modoImpresion, setModoImpresion] = useState(false);
  const [tarjetonParaImpresion, setTarjetonParaImpresion] = useState<TherapySheet | null>(
    null
  );

  useEffect(() => {
    if (pacienteInicial) {
      setPacienteSeleccionado(pacienteInicial);
    }
  }, [pacienteInicial]);

  useEffect(() => {
    if (!pacienteSeleccionado) {
      setTarjeton(null);
      return;
    }

    const desuscribir = suscribirTarjetonPorPaciente(
      pacienteSeleccionado.id,
      (datosTarjeton) => {
        setTarjeton(datosTarjeton);
      }
    );

    return () => desuscribir();
  }, [pacienteSeleccionado]);

  // Si se encuentra en modo impresión física
  if (modoImpresion && tarjetonParaImpresion && pacienteSeleccionado) {
    return (
      <ImpresionTarjeton
        paciente={pacienteSeleccionado}
        tarjeton={tarjetonParaImpresion}
        onCerrar={() => setModoImpresion(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Encabezado General del Módulo y Selector de Sub-Vistas */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between no-print gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
              <span>Prescripción Terapéutica y Tarjetón</span>
              <span className="ml-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                A6 / A5 / A4
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prescripción de agentes físicos, técnicas manuales, pautas de ejercicio y emisión física de tarjetones
            </p>
          </div>
        </div>

        {/* Pestañas de Alternancia: Prescripción Tarjetón vs PWA Sala de Terapia */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setSubVista('tarjeton')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              subVista === 'tarjeton'
                ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Prescripción y Tarjetón
          </button>
          <button
            type="button"
            onClick={() => setSubVista('turnos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              subVista === 'turnos'
                ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Turnos de Hoy (Sala)
          </button>
        </div>
      </div>

      {/* Contenido según la sub-vista seleccionada */}
      {subVista === 'turnos' ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-4">
          <VistaTerapeuta />
        </div>
      ) : (
        <>
          {/* Selector de Pacientes procedentes de Triage */}
          <SelectorPacienteHistoria
            pacienteSeleccionado={pacienteSeleccionado}
            onSeleccionarPaciente={(p) => setPacienteSeleccionado(p)}
            onLimpiarSeleccion={() => setPacienteSeleccionado(null)}
          />

          {/* Formulario y Catálogo de Prescripción cuando hay un paciente seleccionado */}
          {pacienteSeleccionado && (
            <FormularioTarjeton
              key={pacienteSeleccionado.id}
              paciente={pacienteSeleccionado}
              tarjetonInicial={tarjeton}
              onImprimir={(tarjetonEmitido) => {
                setTarjetonParaImpresion(tarjetonEmitido);
                setModoImpresion(true);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
