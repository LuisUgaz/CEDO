import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Stethoscope,
  Activity,
  Check,
  Loader2
} from 'lucide-react';
import type {
  Patient,
  ClinicalHistory,
  CustomClinicalField,
  ClinicalFieldType
} from '@cedo/shared';
import {
  guardarHistoriaClinica,
  finalizarEvaluacionMedica
} from '../../services/historiaClinica.service';

interface FormularioHistoriaClinicaProps {
  paciente: Patient;
  historiaInicial?: ClinicalHistory | null;
  onEvaluacionCompletada?: () => void;
  onImprimir?: (historia: ClinicalHistory) => void;
}

type SyncStatus = 'sin_cambios' | 'guardando' | 'sincronizado' | 'error';

export const FormularioHistoriaClinica: React.FC<FormularioHistoriaClinicaProps> = ({
  paciente,
  historiaInicial,
  onEvaluacionCompletada,
  onImprimir
}) => {
  const [historiaId, setHistoriaId] = useState<string | undefined>(historiaInicial?.id);
  const [fechaEvaluacion, setFechaEvaluacion] = useState(
    historiaInicial?.fechaEvaluacion || new Date().toISOString().split('T')[0]
  );
  const [medicoEvaluador, setMedicoEvaluador] = useState(
    historiaInicial?.medicoEvaluador || ''
  );
  const [motivoConsulta, setMotivoConsulta] = useState(
    historiaInicial?.motivoConsulta || ''
  );
  const [antecedentes, setAntecedentes] = useState(
    historiaInicial?.antecedentes || ''
  );
  const [evaluacionFisica, setEvaluacionFisica] = useState(
    historiaInicial?.evaluacionFisica || ''
  );
  const [diagnostico, setDiagnostico] = useState(
    historiaInicial?.diagnostico || ''
  );
  const [planTratamiento, setPlanTratamiento] = useState(
    historiaInicial?.planTratamiento || ''
  );
  const [camposDinamicos, setCamposDinamicos] = useState<CustomClinicalField[]>(
    historiaInicial?.camposDinamicos || []
  );

  // Estado del creador interactivo de campos dinámicos
  const [mostrandoCreadorCampo, setMostrandoCreadorCampo] = useState(false);
  const [nuevoNombreCampo, setNuevoNombreCampo] = useState('');
  const [nuevoTipoCampo, setNuevoTipoCampo] = useState<ClinicalFieldType>('texto_largo');

  // Estado del autoguardado reactivo
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('sin_cambios');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const esPrimerRender = useRef(true);

  // Función constructora del objeto ClinicalHistory actual
  const construirHistoriaActual = useCallback((): Omit<ClinicalHistory, 'id'> & { id?: string } => {
    return {
      ...(historiaId ? { id: historiaId } : {}),
      pacienteId: paciente.id,
      fechaEvaluacion,
      medicoEvaluador: medicoEvaluador || null,
      motivoConsulta: motivoConsulta || 'Evaluación médica inicial',
      antecedentes,
      evaluacionFisica,
      diagnostico: diagnostico || 'Evaluación en proceso',
      planTratamiento: planTratamiento || 'Indicaciones médicas en proceso',
      camposDinamicos
    };
  }, [
    historiaId,
    paciente.id,
    fechaEvaluacion,
    medicoEvaluador,
    motivoConsulta,
    antecedentes,
    evaluacionFisica,
    diagnostico,
    planTratamiento,
    camposDinamicos
  ]);

  // Ejecución de autoguardado
  const ejecutarAutoguardado = useCallback(async () => {
    try {
      setSyncStatus('guardando');
      const data = construirHistoriaActual();
      const resultado = await guardarHistoriaClinica(data);
      if (!historiaId && resultado.id) {
        setHistoriaId(resultado.id);
      }
      setSyncStatus('sincronizado');
    } catch (err: any) {
      setSyncStatus('error');
      setErrorMsg(err.message || 'Error al sincronizar');
    }
  }, [construirHistoriaActual, historiaId]);

  // Efecto de autoguardado reactivo con debounce de 500ms ante cualquier cambio
  useEffect(() => {
    if (esPrimerRender.current) {
      esPrimerRender.current = false;
      return;
    }

    setSyncStatus('guardando');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      ejecutarAutoguardado();
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    fechaEvaluacion,
    medicoEvaluador,
    motivoConsulta,
    antecedentes,
    evaluacionFisica,
    diagnostico,
    planTratamiento,
    camposDinamicos,
    ejecutarAutoguardado
  ]);

  // Agregar un campo dinámico ad-hoc
  const handleAgregarCampo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombreCampo.trim()) return;

    const nuevoCampo: CustomClinicalField = {
      id: `campo-${Date.now()}`,
      nombre: nuevoNombreCampo.trim(),
      tipo: nuevoTipoCampo,
      valor: ''
    };

    setCamposDinamicos((prev) => [...prev, nuevoCampo]);
    setNuevoNombreCampo('');
    setNuevoTipoCampo('texto_largo');
    setMostrandoCreadorCampo(false);
  };

  // Actualizar el valor de un campo dinámico
  const handleModificarValorCampo = (id: string, valor: string) => {
    setCamposDinamicos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, valor } : c))
    );
  };

  // Eliminar un campo dinámico
  const handleEliminarCampo = (id: string) => {
    setCamposDinamicos((prev) => prev.filter((c) => c.id !== id));
  };

  // Finalizar evaluación médica y actualizar estado de triage a atendido
  const handleFinalizar = async () => {
    try {
      setSyncStatus('guardando');
      const data = construirHistoriaActual();
      const resultado = await guardarHistoriaClinica(data);
      if (!historiaId && resultado.id) {
        setHistoriaId(resultado.id);
      }
      await finalizarEvaluacionMedica(paciente.id);
      setSyncStatus('sincronizado');
      onEvaluacionCompletada?.();
    } catch (err: any) {
      setSyncStatus('error');
      setErrorMsg(err.message || 'No se pudo finalizar la evaluación');
    }
  };

  const historiaActualParaImpresion: ClinicalHistory = {
    ...construirHistoriaActual(),
    id: historiaId || 'historia-temp'
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
      {/* Barra superior de herramientas y sincronización */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <Stethoscope className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-800">
            Historia Clínica y Evaluación Médica
          </h3>
        </div>

        <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
          {/* Indicador de Autoguardado */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-50 border border-slate-200">
            {syncStatus === 'guardando' && (
              <>
                <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />
                <span className="text-amber-700">Guardando...</span>
              </>
            )}
            {syncStatus === 'sincronizado' && (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Guardado en tiempo real</span>
              </>
            )}
            {syncStatus === 'sin_cambios' && (
              <>
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-slate-500">Sin cambios</span>
              </>
            )}
            {syncStatus === 'error' && (
              <>
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-red-700">{errorMsg || 'Error'}</span>
              </>
            )}
          </div>

          {/* Botón Imprimir A4 */}
          {onImprimir && (
            <button
              onClick={() => onImprimir(historiaActualParaImpresion)}
              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span>Imprimir Ficha (A4)</span>
            </button>
          )}

          {/* Botón Finalizar */}
          <button
            onClick={handleFinalizar}
            className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition active:scale-98"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            <span>Finalizar Evaluación</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Fila 1: Metadatos de la evaluación */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="fechaEvaluacion" className="block text-xs font-bold text-slate-700 mb-1">
              Fecha de Evaluación
            </label>
            <input
              id="fechaEvaluacion"
              type="date"
              value={fechaEvaluacion}
              onChange={(e) => setFechaEvaluacion(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="medicoEvaluador" className="block text-xs font-bold text-slate-700 mb-1">
              Médico Fisiatra / Evaluador
            </label>
            <input
              id="medicoEvaluador"
              type="text"
              value={medicoEvaluador}
              onChange={(e) => setMedicoEvaluador(e.target.value)}
              placeholder="Ej. Dr. Fernando Salazar (CMP 45892)"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Fila 2: Motivo de Consulta */}
        <div>
          <label htmlFor="motivoConsulta" className="block text-xs font-bold text-slate-700 mb-1">
            Motivo de Consulta <span className="text-red-500">*</span>
          </label>
          <textarea
            id="motivoConsulta"
            rows={2}
            value={motivoConsulta}
            onChange={(e) => setMotivoConsulta(e.target.value)}
            placeholder="Describa la dolencia o motivo principal por el que acude el paciente..."
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Fila 3: Antecedentes Médicos */}
        <div>
          <label htmlFor="antecedentes" className="block text-xs font-bold text-slate-700 mb-1">
            Antecedentes Médicos y Quirúrgicos
          </label>
          <textarea
            id="antecedentes"
            rows={2}
            value={antecedentes}
            onChange={(e) => setAntecedentes(e.target.value)}
            placeholder="Patologías previas, cirugías, traumatismos, alergias o tratamientos actuales..."
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Fila 4: Examen Físico y Evaluación Postural */}
        <div>
          <label htmlFor="evaluacionFisica" className="block text-xs font-bold text-slate-700 mb-1">
            Examen Físico y Evaluación Postural
          </label>
          <textarea
            id="evaluacionFisica"
            rows={3}
            value={evaluacionFisica}
            onChange={(e) => setEvaluacionFisica(e.target.value)}
            placeholder="Inspección, palpación, arcos de movilidad articular, fuerza muscular, pruebas ortopédicas específicas..."
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Sección de Campos Dinámicos Ad-Hoc */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center">
                <Activity className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Campos de Evaluación Específica (Dinámicos)
              </span>
              <span className="text-[11px] text-slate-400">
                Agregue parámetros clínicos personalizados ad-hoc según la necesidad médica.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setMostrandoCreadorCampo(!mostrandoCreadorCampo)}
              className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition border border-emerald-200"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>+ Agregar Campo</span>
            </button>
          </div>

          {/* Formulario desplegable para nuevo campo */}
          {mostrandoCreadorCampo && (
            <form
              onSubmit={handleAgregarCampo}
              className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 mb-3 space-y-2.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-emerald-900 mb-0.5">
                    Nombre del Campo Clínico
                  </label>
                  <input
                    type="text"
                    value={nuevoNombreCampo}
                    onChange={(e) => setNuevoNombreCampo(e.target.value)}
                    placeholder="Nombre del campo, ej. Escala EVA, Test de Thomas..."
                    className="w-full px-2.5 py-1 text-xs rounded border border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-900 mb-0.5">
                    Tipo de Parámetro
                  </label>
                  <select
                    value={nuevoTipoCampo}
                    onChange={(e) => setNuevoTipoCampo(e.target.value as ClinicalFieldType)}
                    className="w-full px-2 py-1 text-xs rounded border border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  >
                    <option value="texto_largo">Texto Extenso (Párrafo)</option>
                    <option value="texto">Texto Corto (Renglón)</option>
                    <option value="numero">Numérico / Escala</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setMostrandoCreadorCampo(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold shadow-xs"
                >
                  Insertar Campo
                </button>
              </div>
            </form>
          )}

          {/* Listado de campos dinámicos insertados */}
          {camposDinamicos.length > 0 && (
            <div className="space-y-3">
              {camposDinamicos.map((campo) => (
                <div
                  key={campo.id}
                  className="p-3 bg-slate-50/70 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">
                      {campo.nombre}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEliminarCampo(campo.id)}
                      title={`Eliminar campo ${campo.nombre}`}
                      aria-label={`Eliminar campo ${campo.nombre}`}
                      className="text-slate-400 hover:text-red-600 p-1 transition rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {campo.tipo === 'texto_largo' && (
                    <textarea
                      rows={2}
                      value={campo.valor}
                      onChange={(e) => handleModificarValorCampo(campo.id, e.target.value)}
                      placeholder={`Ingrese detalles para ${campo.nombre}...`}
                      className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  )}

                  {campo.tipo === 'texto' && (
                    <input
                      type="text"
                      value={campo.valor}
                      onChange={(e) => handleModificarValorCampo(campo.id, e.target.value)}
                      placeholder={`Valor para ${campo.nombre}...`}
                      className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  )}

                  {campo.tipo === 'numero' && (
                    <input
                      type="number"
                      value={campo.valor}
                      onChange={(e) => handleModificarValorCampo(campo.id, e.target.value)}
                      placeholder="0"
                      className="w-32 px-2.5 py-1 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fila 5: Diagnóstico Médico (DX) */}
        <div>
          <label htmlFor="diagnostico" className="block text-xs font-bold text-slate-800 mb-1 flex items-center">
            <span className="px-1.5 py-0.5 bg-slate-800 text-white rounded text-[10px] font-extrabold mr-1.5">
              DX
            </span>
            <span>Diagnóstico Médico (DX)</span>
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            id="diagnostico"
            rows={2}
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            placeholder="Diagnóstico clínico principal y secundario (con código CIE-10 si aplica)..."
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-900"
          />
        </div>

        {/* Fila 6: Plan de Tratamiento e Indicaciones Médicas */}
        <div>
          <label htmlFor="planTratamiento" className="block text-xs font-bold text-slate-800 mb-1 flex items-center">
            <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-extrabold mr-1.5">
              TX
            </span>
            <span>Plan de Tratamiento e Indicaciones</span>
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            id="planTratamiento"
            rows={3}
            value={planTratamiento}
            onChange={(e) => setPlanTratamiento(e.target.value)}
            placeholder="Prescripción médica de agentes físicos, número de sesiones recomendadas, ejercicios específicos y precauciones..."
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
          />
        </div>
      </div>
    </div>
  );
};
export default FormularioHistoriaClinica;
