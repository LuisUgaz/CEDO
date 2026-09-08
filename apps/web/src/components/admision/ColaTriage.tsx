import { useState, useEffect } from 'react';
import {
  Search,
  Clock,
  UserCheck,
  CheckCircle,
  ShieldAlert,
  Calendar,
  Phone,
  DollarSign
} from 'lucide-react';
import {
  type Patient,
  type TriageStatus
} from '@cedo/shared';
import {
  suscribirPacientesEnEspera,
  actualizarEstadoTriage
} from '../../services/pacientes.service';

interface ColaTriageProps {
  onSeleccionarPaciente?: (paciente: Patient) => void;
}

const BADGES_CONSULTA: Record<string, { label: string; bg: string; text: string }> = {
  PRE_CONSULTA: { label: 'PRE-CONSULTA', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  CONSULTA_MEDICA: { label: 'CONSULTA MÉDICA', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
  EVALUACION_FISIOTERAPEUTICA: { label: 'EVAL. FISIOTERAPÉUTICA', bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700' },
  TERAPIA_DIRECTA: { label: 'TERAPIA DIRECTA', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  'pre-consulta': { label: 'PRE-CONSULTA', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  'post-consulta': { label: 'POST-CONSULTA', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
  no: { label: 'SIN CONSULTA', bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600' }
};

const COLORES_CATEGORIA: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  'color-verde': { label: 'Adultos / Electroterapia', dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-800' },
  'color-melon': { label: 'Niños / Pediatría', dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-800' },
  'color-amarillo': { label: 'Adultos Mayores / Geriatría', dot: 'bg-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-800' },
  'color-fucsia': { label: 'Magnetoterapia', dot: 'bg-pink-500', bg: 'bg-pink-50', text: 'text-pink-800' },
  'color-azul': { label: 'Masajes / Descontracturantes', dot: 'bg-sky-500', bg: 'bg-sky-50', text: 'text-sky-800' },
  'color-anaranjado': { label: 'Doctor / Consulta', dot: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-800' }
};

export default function ColaTriage({ onSeleccionarPaciente }: ColaTriageProps) {
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = suscribirPacientesEnEspera(
      (nuevosPacientes) => {
        setPacientes(nuevosPacientes);
        setCargando(false);
      },
      (err) => {
        setError(err.message || 'Error al sincronizar cola de triage');
        setCargando(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCambiarEstado = async (paciente: Patient, nuevoEstado: TriageStatus) => {
    try {
      await actualizarEstadoTriage(paciente.id, nuevoEstado);
      if (onSeleccionarPaciente && nuevoEstado === 'en_evaluacion') {
        onSeleccionarPaciente(paciente);
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado de triage');
    }
  };

  const pacientesFiltrados = pacientes.filter((p) => {
    const termino = busqueda.toLowerCase().trim();
    if (!termino) return true;
    return (
      p.nombre.toLowerCase().includes(termino) ||
      p.dni.includes(termino) ||
      (p.nombreApoderado && p.nombreApoderado.toLowerCase().includes(termino))
    );
  });

  return (
    <div className="space-y-4">
      {/* Barra de Búsqueda y Estadísticas Rápidas */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar paciente por nombre o DNI..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto text-xs text-slate-600">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg font-bold">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            {pacientes.length} {pacientes.length === 1 ? 'paciente en espera' : 'pacientes en espera'}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Lista de Fichas en Espera */}
      {cargando ? (
        <div className="p-12 text-center text-slate-400">
          <Clock className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
          <p className="text-sm">Cargando sala de espera en tiempo real...</p>
        </div>
      ) : pacientesFiltrados.length === 0 ? (
        <div className="p-12 bg-white rounded-xl border border-dashed border-slate-300 text-center text-slate-500">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">Sala de Espera Vacía</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            {busqueda
              ? `No se encontraron pacientes coincidentes con "${busqueda}".`
              : 'Actualmente no hay pacientes en espera de atención o evaluación.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pacientesFiltrados.map((paciente) => {
            const badgeConsulta =
              BADGES_CONSULTA[paciente.tipoConsulta || 'PRE_CONSULTA'] || BADGES_CONSULTA.PRE_CONSULTA;
            const categoria =
              COLORES_CATEGORIA[paciente.color] || COLORES_CATEGORIA['color-verde'];
            const esMenor = paciente.edad < 18;

            return (
              <div
                key={paciente.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-teal-400 p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Encabezado Tarjeta */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 tracking-tight">
                          {paciente.nombre}
                        </h4>
                        {esMenor && (
                          <span className="px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-amber-700" />
                            Menor de Edad
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        DNI: <span className="font-mono font-medium text-slate-700">{paciente.dni}</span> • Edad:{' '}
                        <span className="font-semibold text-slate-800">{paciente.edad} años</span>
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${badgeConsulta.bg} ${badgeConsulta.text}`}
                    >
                      {badgeConsulta.label}
                    </span>
                  </div>

                  {/* Datos de Contacto y Apoderado */}
                  <div className="space-y-1.5 py-2 text-xs border-y border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Celular: <strong className="font-mono text-slate-800">{paciente.celular}</strong></span>
                    </div>

                    {esMenor && (
                      <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900">
                        <span className="font-bold block">Apoderado Responsable:</span>
                        <span>{paciente.nombreApoderado || 'No registrado'}</span>
                        {paciente.dniApoderado && (
                          <span className="block font-mono text-[11px] text-amber-800">
                            DNI Apoderado: {paciente.dniApoderado}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${categoria.bg} ${categoria.text}`}>
                        <span className={`w-2 h-2 rounded-full ${categoria.dot}`} />
                        {categoria.label}
                      </span>

                      <div className="flex items-center gap-1 text-slate-700 font-bold text-xs">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>S/. {Number(paciente.costoConsulta || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hora de Ingreso */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>Fecha: {paciente.fechaIngreso}</span>
                  </div>
                </div>

                {/* Acciones de Derivación */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleCambiarEstado(paciente, 'en_evaluacion')}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Pasar a Evaluación</span>
                  </button>

                  <button
                    onClick={() => handleCambiarEstado(paciente, 'atendido')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Finalizar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
