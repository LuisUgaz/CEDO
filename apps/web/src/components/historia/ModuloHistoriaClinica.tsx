import React, { useState, useEffect } from 'react';
import { FileText, Activity } from 'lucide-react';
import type { Patient, ClinicalHistory } from '@cedo/shared';
import { SelectorPacienteHistoria } from './SelectorPacienteHistoria';
import { FormularioHistoriaClinica } from './FormularioHistoriaClinica';
import { ImpresionHistoriaA4 } from './ImpresionHistoriaA4';
import { suscribirHistoriaClinica } from '../../services/historiaClinica.service';

interface ModuloHistoriaClinicaProps {
  pacienteInicial?: Patient | null;
}

export const ModuloHistoriaClinica: React.FC<ModuloHistoriaClinicaProps> = ({
  pacienteInicial = null
}) => {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Patient | null>(
    pacienteInicial
  );
  const [historiaClinica, setHistoriaClinica] = useState<ClinicalHistory | null>(null);
  const [modoImpresion, setModoImpresion] = useState(false);
  const [historiaParaImpresion, setHistoriaParaImpresion] = useState<ClinicalHistory | null>(
    null
  );

  useEffect(() => {
    if (pacienteInicial) {
      setPacienteSeleccionado(pacienteInicial);
    }
  }, [pacienteInicial]);

  useEffect(() => {
    if (!pacienteSeleccionado) {
      setHistoriaClinica(null);
      return;
    }

    const desuscribir = suscribirHistoriaClinica(
      pacienteSeleccionado.id,
      (historia) => {
        setHistoriaClinica(historia);
      }
    );

    return () => desuscribir();
  }, [pacienteSeleccionado]);

  // Si el usuario solicitó la vista de impresión formal
  if (modoImpresion && historiaParaImpresion && pacienteSeleccionado) {
    return (
      <ImpresionHistoriaA4
        paciente={pacienteSeleccionado}
        historia={historiaParaImpresion}
        onCerrar={() => setModoImpresion(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Encabezado General del Módulo */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex items-center justify-between no-print">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center">
              <span>Historia Clínica e Informe Médico</span>
              <span className="ml-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                A4 Vertical
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Evaluación médica inicial, examen postural, diagnóstico y prescripción terapéutica de CEDO-REHAB EIRL
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Pacientes procedentes de Triage */}
      <SelectorPacienteHistoria
        pacienteSeleccionado={pacienteSeleccionado}
        onSeleccionarPaciente={(p) => setPacienteSeleccionado(p)}
        onLimpiarSeleccion={() => setPacienteSeleccionado(null)}
      />

      {/* Formulario Médico si hay un paciente seleccionado */}
      {pacienteSeleccionado && (
        <FormularioHistoriaClinica
          paciente={pacienteSeleccionado}
          historiaInicial={historiaClinica}
          onEvaluacionCompletada={() => {
            // Se mantiene el paciente o se deselecciona según flujo
          }}
          onImprimir={(historia) => {
            setHistoriaParaImpresion(historia);
            setModoImpresion(true);
          }}
        />
      )}
    </div>
  );
};
export default ModuloHistoriaClinica;
