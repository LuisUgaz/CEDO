import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar, ModuloId } from './Sidebar';

interface LayoutProps {
  children?: React.ReactNode;
  moduloActivo: ModuloId;
  onCambiarModulo: (modulo: ModuloId) => void;
  tituloModulo: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  moduloActivo,
  onCambiarModulo,
  tituloModulo
}) => {
  const [menuMobileAbierto, setMenuMobileAbierto] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden font-sans text-xs bg-slate-100">
      <Sidebar
        moduloActivo={moduloActivo}
        onCambiarModulo={onCambiarModulo}
        menuMobileAbierto={menuMobileAbierto}
        onCerrarMenuMobile={() => setMenuMobileAbierto(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          tituloModulo={tituloModulo}
          onToggleMenuMobile={() => setMenuMobileAbierto(!menuMobileAbierto)}
          isOnline={true}
        />

        <main className="flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
