import React, { useState, useEffect, useMemo } from 'react';
import {
  UserPlus,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  User,
  HeartPulse
} from 'lucide-react';
import {
  type ConsultationType,
  type PatientColor,
  type Patient
} from '@cedo/shared';
import { crearPaciente } from '../../services/pacientes.service';

interface FormularioAdmisionProps {
  onPacienteCreado?: (paciente: Patient) => void;
}

const COSTOS_POR_DEFECTO: Record<ConsultationType, number> = {
  PRE_CONSULTA: 50,
  CONSULTA_MEDICA: 50,
  EVALUACION_FISIOTERAPEUTICA: 50,
  TERAPIA_DIRECTA: 0,
  'pre-consulta': 50,
  'post-consulta': 35,
  no: 0
};

export default function FormularioAdmision({ onPacienteCreado }: FormularioAdmisionProps) {
  const hoy = new Date().toISOString().split('T')[0];

  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [edad, setEdad] = useState<number | ''>('');
  const [celular, setCelular] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState(hoy);
  const [ocupacion, setOcupacion] = useState('');
  const [direccion, setDireccion] = useState('');

  // Sección Apoderado
  const [dniApoderado, setDniApoderado] = useState('');
  const [nombreApoderado, setNombreApoderado] = useState('');

  // Consulta y Terapia
  const [tipoConsulta, setTipoConsulta] = useState<ConsultationType>('PRE_CONSULTA');
  const [costoConsulta, setCostoConsulta] = useState<number>(50);
  const [color, setColor] = useState<PatientColor>('color-verde');

  // Estados de interfaz
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  const esMenorDeEdad = typeof edad === 'number' && edad < 18;

  // Actualizar costo sugerido automáticamente al cambiar el tipo de consulta
  const handleCambioTipoConsulta = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoTipo = e.target.value as ConsultationType;
    setTipoConsulta(nuevoTipo);
    setCostoConsulta(COSTOS_POR_DEFECTO[nuevoTipo] ?? 50);
  };

  // Sugerir categoría de color según edad
  useEffect(() => {
    if (typeof edad === 'number') {
      if (edad < 18) {
        setColor('color-melon'); // Pediatría
      } else if (edad >= 65) {
        setColor('color-amarillo'); // Geriatría
      } else {
        setColor('color-verde'); // Adultos
      }
    }
  }, [edad]);

  // Validación reactiva para el botón de envío
  const formularioValido = useMemo(() => {
    if (guardando) return false;
    if (!nombre.trim() || nombre.trim().length < 3) return false;
    if (!/^\d{8}$/.test(dni.trim())) return false;
    if (typeof edad !== 'number' || edad < 0 || edad > 125) return false;
    if (!celular.trim() || celular.trim().length < 9) return false;

    if (esMenorDeEdad) {
      if (!/^\d{8}$/.test(dniApoderado.trim())) return false;
      if (!nombreApoderado.trim() || nombreApoderado.trim().length < 3) return false;
    }

    return true;
  }, [guardando, nombre, dni, edad, celular, esMenorDeEdad, dniApoderado, nombreApoderado]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formularioValido) return;

    setGuardando(true);
    setErrorValidacion(null);
    setMensajeExito(null);

    try {
      const nuevoPaciente = await crearPaciente({
        nombre: nombre.trim(),
        dni: dni.trim(),
        edad: Number(edad),
        celular: celular.trim(),
        fechaIngreso,
        ocupacion: ocupacion.trim() || null,
        direccion: direccion.trim() || null,
        dniApoderado: esMenorDeEdad ? dniApoderado.trim() : null,
        nombreApoderado: esMenorDeEdad ? nombreApoderado.trim() : null,
        tipoConsulta,
        costoConsulta: Number(costoConsulta),
        estadoTriage: 'en_espera',
        color,
        costoTerapia: 35,
        paqueteActivo: 1
      });

      setMensajeExito(`Paciente ${nuevoPaciente.nombre} registrado y derivado a Triage con éxito.`);

      // Resetear campos
      setNombre('');
      setDni('');
      setEdad('');
      setCelular('');
      setOcupacion('');
      setDireccion('');
      setDniApoderado('');
      setNombreApoderado('');
      setTipoConsulta('PRE_CONSULTA');
      setCostoConsulta(50);
      setColor('color-verde');

      if (onPacienteCreado) {
        onPacienteCreado(nuevoPaciente);
      }
    } catch (err: any) {
      setErrorValidacion(err.message || 'Ocurrió un error al registrar el paciente.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Encabezado del Formulario */}
      <div className="px-6 py-5 bg-gradient-to-r from-teal-700 to-teal-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-600/50 rounded-lg backdrop-blur-sm border border-teal-500/30">
            <UserPlus className="w-6 h-6 text-teal-100" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Admisión y Registro de Paciente</h2>
            <p className="text-xs text-teal-200 mt-0.5">
              Ingreso formal a recepción, validación de identidad y derivación a cola de triage
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Mensajes de Estado */}
        {mensajeExito && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{mensajeExito}</span>
          </div>
        )}

        {errorValidacion && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-3 text-rose-800 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{errorValidacion}</span>
          </div>
        )}

        {/* Sección: Datos Personales */}
        <div>
          <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
            <User className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Datos Personales del Paciente
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Nombre Completo */}
            <div className="lg:col-span-2">
              <label htmlFor="nombre" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombre Completo <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Juan Pérez Quispe"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* DNI */}
            <div>
              <label htmlFor="dni" className="block text-xs font-semibold text-slate-700 mb-1.5">
                DNI del Paciente <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="dni"
                  type="text"
                  required
                  maxLength={8}
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  placeholder="8 dígitos"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors tracking-widest font-mono"
                />
              </div>
            </div>

            {/* Edad */}
            <div>
              <label htmlFor="edad" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Edad <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="edad"
                  type="number"
                  required
                  min={0}
                  max={125}
                  value={edad}
                  onChange={(e) => setEdad(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Años"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Celular */}
            <div>
              <label htmlFor="celular" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Celular / Teléfono <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="celular"
                  type="tel"
                  required
                  maxLength={9}
                  value={celular}
                  onChange={(e) => setCelular(e.target.value.replace(/\D/g, ''))}
                  placeholder="9 dígitos"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Fecha de Ingreso */}
            <div>
              <label htmlFor="fechaIngreso" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Fecha de Ingreso
              </label>
              <div className="relative">
                <input
                  id="fechaIngreso"
                  type="date"
                  value={fechaIngreso}
                  onChange={(e) => setFechaIngreso(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Ocupación */}
            <div>
              <label htmlFor="ocupacion" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ocupación
              </label>
              <input
                id="ocupacion"
                type="text"
                value={ocupacion}
                onChange={(e) => setOcupacion(e.target.value)}
                placeholder="Ej. Docente, Estudiante..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="direccion" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Dirección Domiciliaria
              </label>
              <input
                id="direccion"
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Distrito, Calle, N°"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Sección Reactiva de Regla de Minoridad */}
        {esMenorDeEdad && (
          <div className="p-5 bg-amber-50/80 border-2 border-amber-300 rounded-xl space-y-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg border border-amber-300 text-amber-800">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                  Paciente Menor de Edad ({edad} años) — Requiere Datos de Apoderado Legal
                </h4>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  Por normativa sanitaria y legal, los menores de 18 años deben estar acompañados de un apoderado con DNI de 8 dígitos obligatorio para autorizar la atención y el plan fisioterapéutico.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label htmlFor="dniApoderado" className="block text-xs font-bold text-amber-900 mb-1.5">
                  DNI de Apoderado <span className="text-rose-600">* (8 dígitos)</span>
                </label>
                <input
                  id="dniApoderado"
                  type="text"
                  required
                  maxLength={8}
                  value={dniApoderado}
                  onChange={(e) => setDniApoderado(e.target.value.replace(/\D/g, ''))}
                  placeholder="DNI del padre, madre o tutor"
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors tracking-widest font-mono"
                />
              </div>

              <div>
                <label htmlFor="nombreApoderado" className="block text-xs font-bold text-amber-900 mb-1.5">
                  Nombre del Apoderado <span className="text-rose-600">* (Nombre y Parentesco)</span>
                </label>
                <input
                  id="nombreApoderado"
                  type="text"
                  required
                  value={nombreApoderado}
                  onChange={(e) => setNombreApoderado(e.target.value)}
                  placeholder="Ej. Rosa Gómez Mendoza (Madre)"
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Sección: Tipo de Consulta y Derivación */}
        <div>
          <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
            <HeartPulse className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Tipo de Consulta y Derivación de Triage
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tipo de Consulta */}
            <div>
              <label htmlFor="tipoConsulta" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tipo de Consulta <span className="text-rose-500">*</span>
              </label>
              <select
                id="tipoConsulta"
                value={tipoConsulta}
                onChange={handleCambioTipoConsulta}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors font-medium"
              >
                <option value="PRE_CONSULTA">PRE-CONSULTA (Médica / Fisioterapéutica)</option>
                <option value="CONSULTA_MEDICA">CONSULTA MÉDICA (Doctor Evaluador)</option>
                <option value="EVALUACION_FISIOTERAPEUTICA">EVALUACIÓN FISIOTERAPÉUTICA</option>
                <option value="TERAPIA_DIRECTA">TERAPIA DIRECTA (Derivado con Orden Externa)</option>
              </select>
            </div>

            {/* Costo de Consulta */}
            <div>
              <label htmlFor="costoConsulta" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Costo de la Consulta (S/.)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-semibold text-sm">S/.</span>
                <input
                  id="costoConsulta"
                  type="number"
                  min={0}
                  step={0.5}
                  value={costoConsulta}
                  onChange={(e) => setCostoConsulta(Number(e.target.value))}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Categoría / Color Clínico */}
            <div>
              <label htmlFor="color" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Categoría Clínica / Color de Especialidad
              </label>
              <select
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value as PatientColor)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors font-medium"
              >
                <option value="color-verde">Verde - Adultos / Electroterapia</option>
                <option value="color-melon">Melón - Niños / Pediatría</option>
                <option value="color-amarillo">Amarillo - Adultos Mayores / Geriatría</option>
                <option value="color-fucsia">Fucsia - Magnetoterapia</option>
                <option value="color-azul">Azul - Masajes / Descontracturantes</option>
                <option value="color-anaranjado">Anaranjado - Doctor / Consulta Médica</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botón de Envío */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {esMenorDeEdad && (!dniApoderado || dniApoderado.length !== 8 || !nombreApoderado.trim()) ? (
              <span className="text-amber-700 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Complete el DNI de 8 dígitos y nombre del apoderado para habilitar el registro.
              </span>
            ) : (
              <span className="text-slate-400">
                Al registrar, el paciente ingresará automáticamente a la cola de triage en tiempo real.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!formularioValido}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
              formularioValido
                ? 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer shadow-teal-700/20 active:scale-[0.99]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {guardando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registrando y Derivando...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Registrar y Derivar</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
