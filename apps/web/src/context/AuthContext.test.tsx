import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LoginForm } from '../components/auth/LoginForm';

// Mock Component to consume useAuth
const TestConsumer: React.FC = () => {
  const { user, loading, error, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{loading ? 'Cargando...' : 'Listo'}</span>
      <span data-testid="error">{error || 'Sin errores'}</span>
      <span data-testid="user-email">{user?.email || 'No autenticado'}</span>
      <span data-testid="user-role">{user?.role || 'Sin rol'}</span>
      <button onClick={() => login('admin@cedo.pe', 'password123')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('Sistema de Autenticación y Guards de Navegación por Roles (RBAC)', () => {
  it('useAuth debe lanzar error si se utiliza fuera de AuthProvider', () => {
    // Suppress expected React console error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrowError(
      'useAuth debe ser utilizado dentro de un AuthProvider'
    );
    spy.mockRestore();
  });

  it('debe proporcionar estado inicial con AuthProvider', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('Listo');
    });
    expect(screen.getByTestId('user-email').textContent).toBe('No autenticado');
    expect(screen.getByTestId('user-role').textContent).toBe('Sin rol');
  });

  it('LoginForm debe renderizar campos de correo, contraseña y procesar inicio de sesión', async () => {
    const fnLogin = vi.fn().mockResolvedValue(undefined);

    render(<LoginForm onLoginSubmit={fnLogin} />);

    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeDefined();
    expect(screen.getByLabelText(/Contraseña/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeDefined();

    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), {
      target: { value: 'terapeuta@cedo.pe' }
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: 'clave123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(fnLogin).toHaveBeenCalledWith('terapeuta@cedo.pe', 'clave123');
    });
  });

  it('ProtectedRoute debe bloquear acceso si el usuario no tiene el rol requerido', () => {
    render(
      <ProtectedRoute
        currentUser={{
          id: 'u1',
          email: 'terapeuta@cedo.pe',
          displayName: 'Lic. Morales',
          role: 'terapeuta',
          active: true,
          createdAt: new Date().toISOString()
        }}
        allowedRoles={['admin', 'recepcion']}
        loading={false}
      >
        <div data-testid="contenido-protegido">Módulo de Finanzas</div>
      </ProtectedRoute>
    );

    expect(screen.queryByTestId('contenido-protegido')).toBeNull();
    expect(screen.getByText(/Acceso Restringido/i)).toBeDefined();
    expect(screen.getByText(/No tienes permisos para acceder a este módulo clínico/i)).toBeDefined();
  });

  it('ProtectedRoute debe permitir acceso si el rol del usuario está autorizado', () => {
    render(
      <ProtectedRoute
        currentUser={{
          id: 'u1',
          email: 'admin@cedo.pe',
          displayName: 'Dr. Ugaz',
          role: 'admin',
          active: true,
          createdAt: new Date().toISOString()
        }}
        allowedRoles={['admin', 'recepcion']}
        loading={false}
      >
        <div data-testid="contenido-protegido">Módulo de Finanzas</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('contenido-protegido')).toBeDefined();
    expect(screen.getByText('Módulo de Finanzas')).toBeDefined();
  });

  it('ProtectedRoute debe mostrar indicador de carga cuando loading es true', () => {
    render(
      <ProtectedRoute loading={true}>
        <div>Contenido</div>
      </ProtectedRoute>
    );

    expect(screen.getByText(/Verificando credenciales clínicas.../i)).toBeDefined();
  });

  it('ProtectedRoute debe requerir sesión si no hay usuario autenticado', () => {
    render(
      <ProtectedRoute currentUser={null} loading={false}>
        <div>Contenido</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Sesión Requerida')).toBeDefined();
    expect(
      screen.getByText(/Debe iniciar sesión con una cuenta autorizada/i)
    ).toBeDefined();
  });

  it('LoginForm debe validar campos vacíos y mostrar mensaje de error', () => {
    const { container } = render(<LoginForm />);
    const form = container.querySelector('form')!;

    fireEvent.submit(form);
    expect(
      screen.getByText('Por favor complete todos los campos requeridos')
    ).toBeDefined();
  });

  it('LoginForm debe mostrar mensaje de error proporcionado por prop', () => {
    render(<LoginForm errorMessage="Error de credenciales Firebase" />);
    expect(screen.getByText('Error de credenciales Firebase')).toBeDefined();
  });
});
