import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { ModuloId } from './components/layout/Sidebar';
import {
  CalendarDays,
  UserPlus,
  FileText,
  ListChecks,
  Boxes,
  CalendarCheck,
  Wallet
} from 'lucide-react';

import { VistaTerapeuta } from './components/terapia/VistaTerapeuta';

const TITULOS_MODULOS: Record<ModuloId, string> = {
  agenda: 'Horario y Agenda Semanal',
  registro: 'Registro y Admisión de Pacientes',
  historias: 'Historia Clínica General (Informe A4)',
  terapias: 'Ficha de Tratamiento (Tarjetón A6)',
  asistencia: 'Control de Asistencia y Boletas',
  inventario: 'Gestión de Inventario Clínico',
  rencuentro: 'Rencuentro de Inventario (4 Sábados)',
  finanzas: 'Finanzas, Caja Diaria y Métricas'
};

export const App: React.FC = () => {
  const [moduloActivo, setModuloActivo] = useState<ModuloId>('agenda');

  return (
    <Layout
      moduloActivo={moduloActivo}
      onCambiarModulo={setModuloActivo}
      tituloModulo={TITULOS_MODULOS[moduloActivo]}
    >
      {moduloActivo === 'terapias' ? (
        <VistaTerapeuta />
      ) : (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex-1 flex flex-col justify-center items-center text-center">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full mb-3">
            {moduloActivo === 'agenda' && <CalendarDays className="w-8 h-8" />}
            {moduloActivo === 'registro' && <UserPlus className="w-8 h-8" />}
            {moduloActivo === 'historias' && <FileText className="w-8 h-8" />}
            {moduloActivo === 'asistencia' && <ListChecks className="w-8 h-8" />}
            {moduloActivo === 'inventario' && <Boxes className="w-8 h-8" />}
            {moduloActivo === 'rencuentro' && <CalendarCheck className="w-8 h-8" />}
            {moduloActivo === 'finanzas' && <Wallet className="w-8 h-8" />}
          </div>
          <h2 className="text-lg font-extrabold text-slate-800 mb-1">
            {TITULOS_MODULOS[moduloActivo]}
          </h2>
          <p className="text-slate-500 text-xs max-w-md">
            Módulo de CEDO-REHAB Suite listo para conectar con Firebase Modular y la capa de tipos de <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono">@cedo/shared</code>.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default App;
