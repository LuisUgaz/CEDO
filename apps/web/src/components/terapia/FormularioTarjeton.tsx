import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  ShieldAlert,
  UserCheck,
  Layers,
  Sparkles
} from 'lucide-react';
import type {
  Patient,
  TherapySheet,
  TherapySheetInput,
  AttentionType,
  PrintFormat
} from '@cedo/shared';
import { CatalogoPrescripcion } from './CatalogoPrescripcion';
import { guardarTarjetonTratamiento } from '../../services/tarjeton.service';

export interface FormularioTarjetonProps {
  paciente: Patient;
  tarjetonInicial?: TherapySheet | null;
  onImprimir?: (tarjeton: TherapySheet) => void;
  onGuardadoExitoso?: (tarjeton: TherapySheet) => void;
}

type SyncStatus = 'sin_cambios' | 'guardando' | 'sincronizado' | 'error';

export const FormularioTarjeton: React.FC<FormularioTarjetonProps> = ({
  paciente,
  tarjetonInicial,
  onImprimir,
  onGuardadoExitoso
}) => {
  const [tarjetonId, setTarjetonId] = useState<string | undefined>(tarjetonInicial?.id);
  const [numeroPaquete, setNumeroPaquete] = useState<number>(
    tarjetonInicial?.numeroPaquete || paciente.paqueteActivo || 1
  );
  const [fecha, setFecha] = useState<string>(
    tarjetonInicial?.fecha || new Date().toISOString().split('T')[0]
  );
  const [tipoAtencion, setTipoAtencion] = useState<AttentionType>(
    tarjetonInicial?.tipoAtencion || 'PARTICULAR'
  );
  const [diagnostico, setDiagnostico] = useState<string>(
    tarjetonInicial?.diagnostico || ''
  );
  const [sesionNumero, setSesionNumero] = useState<string>(
    tarjetonInicial?.sesionNumero || '1'
  );
  const [tecnicasSeleccionadas, setTecnicasSeleccionadas] = useState<string[]>(
    (tarjetonInicial?.tecnicasSeleccionadas as string[]) || []
  );
  const [indicacionesAdicionales, setIndicacionesAdicionales] = useState<string[]>(
    tarjetonInicial?.indicacionesAdicionales || []
  );
  const [formatoImpresion, setFormatoImpresion] = useState<PrintFormat>(
    tarjetonInicial?.formatoImpresion || 'a6'
  );

  const [estadoSincronizacion, setEstadoSincronizacion] = useState<SyncStatus>('sin_cambios');
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const esMontajeInicial = useRef(true);
  const timerDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Alternar selección de una técnica o agente en el catálogo
  const handleToggleTecnica = useCallback((id: string) => {
    setTecnicasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // Agregar un nuevo renglón de indicación adicional
  const handleAgregarIndicacion = () => {
    setIndicacionesAdicionales((prev) => [...prev, '']);
  };

  // Modificar un renglón de indicación
  const handleCambiarIndicacion = (index: number, valor: string) => {
    setIndicacionesAdicionales((prev) => {
      const nuevas = [...prev];
      nuevas[index] = valor;
      return nuevas;
    });
  };

  // Eliminar un renglón de indicación
  const handleEliminarIndicacion = (index: number) => {
    setIndicacionesAdicionales((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Función ejecutora de guardado en Firestore
  const ejecutarGuardado = useCallback(async () => {
    try {
      setEstadoSincronizacion('guardando');
      setMensajeError(null);

      const payload: TherapySheetInput = {
        ...(tarjetonId ? { id: tarjetonId } : {}),
        pacienteId: paciente.id,
        numeroPaquete,
        fecha,
        tipoAtencion,
        diagnostico,
        sesionNumero,
        tecnicasSeleccionadas,
        indicacionesAdicionales: indicacionesAdicionales.filter((ind) => ind.trim().length > 0),
        formatoImpresion
      };

      const tarjetonGuardado = await guardarTarjetonTratamiento(payload);
      if (!tarjetonId && tarjetonGuardado.id) {
        setTarjetonId(tarjetonGuardado.id);
      }

      setEstadoSincronizacion('sincronizado');
      if (onGuardadoExitoso) {
        onGuardadoExitoso(tarjetonGuardado);
      }

      setTimeout(() => {
        setEstadoSincronizacion('sin_cambios');
      }, 2500);
    } catch (err: any) {
      console.error('Error al autoguardar tarjetón de tratamiento:', err);
      setEstadoSincronizacion('error');
      setMensajeError(err.message || 'Error al persistir tarjetón');
    }
  }, [
    tarjetonId,
    paciente.id,
    numeroPaquete,
    fecha,
    tipoAtencion,
    diagnostico,
    sesionNumero,
    tecnicasSeleccionadas,
    indicacionesAdicionales,
    formatoImpresion,
    onGuardadoExitoso
  ]);

  // Efecto de autoguardado con Debounce (500 ms)
  useEffect(() => {
    if (esMontajeInicial.current) {
      esMontajeInicial.current = false;
      return;
    }

    if (timerDebounceRef.current) {
      clearTimeout(timerDebounceRef.current);
    }

    timerDebounceRef.current = setTimeout(() => {
      ejecutarGuardado();
    }, 500);

    return () => {
      if (timerDebounceRef.current) {
        clearTimeout(timerDebounceRef.current);
      }
    };
  }, [
    numeroPaquete,
    fecha,
    tipoAtencion,
    diagnostico,
    sesionNumero,
    tecnicasSeleccionadas,
    indicacionesAdicionales,
    formatoImpresion,
    ejecutarGuardado
  ]);

  // Objeto con el tarjetón actual para emitir a impresión
  const tarjetonActualParaImpresion: TherapySheet = {
    id: tarjetonId || 'temp-id',
    pacienteId: paciente.id,
    numeroPaquete,
    fecha,
    tipoAtencion,
    diagnostico,
    sesionNumero,
    tecnicasSeleccionadas: tecnicasSeleccionadas as any,
    indicacionesAdicionales,
    formatoImpresion,
    updatedAt: new Date().toISOString()
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Barra de Encabezado Superior: Datos del Paciente e Indicador de Autoguardado */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <FileCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {paciente.nombre}
              </h2>
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-md font-semibold">
                DNI: {paciente.dni}
              </span>
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-md font-semibold">
                {paciente.edad} años
              </span>
              {paciente.celular && (
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-md font-semibold">
                  Telf: {paciente.celular}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Tarjetón de Fisioterapia y Prescripción Clínica</span>
              <span>•</span>
              <span>Paquete #{numeroPaquete}</span>
            </p>
          </div>
        </div>

        {/* Indicador de Estado Reactivo y Acciones Principales */}
        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg border">
            {estadoSincronizacion === 'guardando' && (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Clock className="w-4 h-4 animate-spin" />
                Guardando cambios...
              </span>
            )}
            {estadoSincronizacion === 'sincronizado' && (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Guardado en la nube
              </span>
            )}
            {estadoSincronizacion === 'sin_cambios' && (
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Sincronizado
              </span>
            )}
            {estadoSincronizacion === 'error' && (
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1" title={mensajeError || ''}>
                <AlertCircle className="w-4 h-4" />
                Error de sincronización
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={ejecutarGuardado}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>

          {onImprimir && (
            <button
              type="button"
              onClick={() => onImprimir(tarjetonActualParaImpresion)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              Imprimir Tarjetón
            </button>
          )}
        </div>
      </div>

      {/* Controles de Configuración del Tarjetón: Modalidad, Paquete, Fecha y Formato */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Selector de Tipo de Atención */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Tipo de Atención
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <button
                type="button"
                data-active={tipoAtencion === 'PARTICULAR'}
                onClick={() => setTipoAtencion('PARTICULAR')}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all text-center ${
                  tipoAtencion === 'PARTICULAR'
                    ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Particular
              </button>
              <button
                type="button"
                data-active={tipoAtencion === 'ASEGURADO'}
                onClick={() => setTipoAtencion('ASEGURADO')}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all text-center ${
                  tipoAtencion === 'ASEGURADO'
                    ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Asegurado
              </button>
            </div>
          </div>

          {/* Número de Paquete */}
          <div>
            <label htmlFor="numero-paquete" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Número de Paquete
            </label>
            <input
              id="numero-paquete"
              type="number"
              min="1"
              value={numeroPaquete}
              onChange={(e) => setNumeroPaquete(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Fecha de Emisión */}
          <div>
            <label htmlFor="fecha-tarjeton" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Fecha de Emisión
            </label>
            <input
              id="fecha-tarjeton"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Formato de Impresión */}
          <div>
            <label htmlFor="formato-impresion" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Formato de Impresión
            </label>
            <select
              id="formato-impresion"
              aria-label="Formato de Impresión"
              value={formatoImpresion}
              onChange={(e) => setFormatoImpresion(e.target.value as PrintFormat)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="a6">Tarjetón A6 (105 × 148 mm - Bolsillo)</option>
              <option value="a5">Media Hoja A5 (148 × 210 mm)</option>
              <option value="a4-terapia">Hoja Completa A4 (210 × 297 mm)</option>
            </select>
          </div>
        </div>

        {/* Diagnóstico Clínico */}
        <div>
          <label htmlFor="diagnostico-clinico" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Diagnóstico Médico / Fisioterapéutico (DX)
          </label>
          <input
            id="diagnostico-clinico"
            type="text"
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            placeholder="Ejemplo: Lumbalgia mecánica aguda / Tendinopatía de hombro"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Catálogo de Prescripción Interactiva con Casillas Tipo "X" */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <CatalogoPrescripcion
          seleccionados={tecnicasSeleccionadas}
          onToggle={handleToggleTecnica}
        />
      </div>

      {/* Renglones Dinámicos de Indicaciones Adicionales */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Indicaciones y Pautas Terapéuticas Particulares
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Renglones de prescripción para pautas domiciliares, restricciones de carga o recomendaciones posturales
            </p>
          </div>

          <button
            type="button"
            onClick={handleAgregarIndicacion}
            className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-blue-200 dark:border-blue-800"
          >
            <Plus className="w-4 h-4" />
            + Agregar Indicación
          </button>
        </div>

        {indicacionesAdicionales.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500">
            No hay indicaciones adicionales registradas para este tarjetón. Haga clic en "+ Agregar Indicación" para añadir pautas específicas.
          </div>
        ) : (
          <div className="space-y-2.5">
            {indicacionesAdicionales.map((indicacion, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 w-6 text-center">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={indicacion}
                  onChange={(e) => handleCambiarIndicacion(idx, e.target.value)}
                  placeholder="Escriba una indicación médica o terapéutica..."
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  data-testid="boton-eliminar-indicacion"
                  onClick={() => handleEliminarIndicacion(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                  title="Eliminar indicación"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
