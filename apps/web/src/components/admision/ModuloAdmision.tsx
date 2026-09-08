import { useState, useEffect } from 'react';
import { UserPlus, Users, Stethoscope } from 'lucide-react';
import FormularioAdmision from './FormularioAdmision';
import ColaTriage from './ColaTriage';
import { suscribirPacientesEnEspera } from '../../services/pacientes.service';
import type { Patient } from '@cedo/shared';

type TabAdmision = 'registro' | 'espera';

interface ModuloAdmisionProps {
  onDerivarAEvaluacion?: (paciente: Patient) => void;
}

export default function ModuloAdmision({ onDerivarAEvaluacion }: ModuloAdmisionProps = {}) {
  const [tabActiva, setTabActiva] = useState<TabAdmision>('registro');
  const [totalEnEspera, setTotalEnEspera] = useState(0);

  useEffect(() => {
    const unsubscribe = suscribirPacientesEnEspera((pacientes) => {
      setTotalEnEspera(pacientes.length);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      {/* Barra de Encabezado y Navegación de Pestañas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-100 text-teal-800">
            <Stethoscope className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Módulo de Admisión y Triage
            </h1>
            <p className="text-xs text-slate-500">
              Gestión de ingresos, validación de identidad y cola de atención médica
            </p>
          </div>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setTabActiva('registro')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tabActiva === 'registro'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Registro</span>
          </button>

          <button
            onClick={() => setTabActiva('espera')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tabActiva === 'espera'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Fichas en Espera</span>
            {totalEnEspera > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-teal-700 text-white rounded-full text-[10px] font-black">
                {totalEnEspera}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Contenido según la pestaña activa */}
      {tabActiva === 'registro' ? (
        <FormularioAdmision onPacienteCreado={() => setTabActiva('espera')} />
      ) : (
        <ColaTriage onSeleccionarPaciente={onDerivarAEvaluacion} />
      )}
    </div>
  );
}
