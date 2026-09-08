import React, { ReactNode } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { UserProfile, UserRole } from '@cedo/shared';

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  currentUser?: UserProfile | null;
  loading?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  currentUser,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
        <p className="text-sm font-medium">Verificando credenciales clínicas...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-slate-200 text-center max-w-md mx-auto my-8">
        <ShieldAlert className="w-12 h-12 text-amber-500 mb-3" />
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Sesión Requerida
        </h3>
        <p className="text-xs text-slate-500">
          Debe iniciar sesión con una cuenta autorizada para acceder a este módulo.
        </p>
      </div>
    );
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-red-50/50 rounded-xl border border-red-200 text-center max-w-md mx-auto my-8">
        <div className="p-3 bg-red-100 text-red-600 rounded-full mb-3">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-red-900 mb-1">
          Acceso Restringido
        </h3>
        <p className="text-xs text-red-700">
          No tienes permisos para acceder a este módulo clínico. Tu rol actual es{' '}
          <strong className="uppercase">{currentUser.role}</strong> y se requiere{' '}
          {allowedRoles.map((r) => r.toUpperCase()).join(' o ')}.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
