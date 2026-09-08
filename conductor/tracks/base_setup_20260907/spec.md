# Especificación Técnica: Setup del Workspace Multi-plataforma, Tipos Compartidos y Autenticación con Firebase RBAC

## 1. Resumen Ejecutivo
Este track fundacional establece la infraestructura del proyecto multi-plataforma para **CEDO-REHAB Suite**, integrando la aplicación web (React + Vite + TypeScript) y la aplicación móvil (React Native + Expo + TypeScript). Implementa el paquete de tipos de datos compartidos (`shared/types`), la configuración del SDK Modular de Firebase v10 y la arquitectura de autenticación con control de acceso basado en roles (RBAC).

## 2. Objetivos Principales
1. Configurar la estructura de proyecto monorepo/multi-app con soporte para Web (`apps/web`), Móvil (`apps/mobile`) y módulo compartido de modelos TypeScript (`packages/shared`).
2. Definir los modelos de datos tipados en TypeScript (y esquemas de validación Zod) correspondientes a todas las entidades del sistema clínico:
   - `Paciente` (con validación de menores y apoderados).
   - `Paquete` y `SesionTratamiento` (agentes físicos, masoterapia, cinesiterapia).
   - `CitaAgenda` (semana, fecha, turno, color, asistencia, notas).
   - `ItemInventario` y `AuditoriaInventario` (conteo 4 sábados).
   - `TransaccionCaja` (pagos, boletas, abonos, método de pago).
   - `Usuario` y `RolUsuario` (`admin`, `recepcion`, `terapeuta`, `medico`).
3. Configurar Firebase SDK Modular v10 con soporte para Web y React Native, garantizando persistencia offline.
4. Implementar el módulo de Autenticación con Firebase Auth y guards de navegación por roles.

## 3. Alcance y Entregables

### 3.1. Estructura del Repositorio
*   `apps/web`: Aplicación React 19 con Vite, TypeScript y Tailwind CSS.
*   `apps/mobile`: Aplicación React Native con Expo Router y NativeWind.
*   `packages/shared`: Modelos de datos TypeScript, esquemas Zod y utilitarios comunes.
*   Configuración raíz de `package.json` (npm/pnpm workspaces), `.gitignore` y scripts unificados.

### 3.2. Modelos de Dominio Clínico (`packages/shared/src/types`)
*   `patient.types.ts`: Estructuras completas de datos de paciente y apoderado.
*   `clinical-history.types.ts`: Informes médicos, campos de evaluación y campos dinámicos.
*   `therapy.types.ts`: Catálogo estandarizado de agentes físicos y técnicas de rehabilitación de CEDO-REHAB.
*   `schedule.types.ts`: Citas semanales, turnos, terapeutas y código de colores.
*   `finance.types.ts`: Abonos a paquetes, pagos de consultas, boletas y transacciones.
*   `inventory.types.ts`: Insumos y auditoría de los 4 sábados.
*   `auth.types.ts`: Roles, permisos y perfil de usuario autenticado.

### 3.3. Configuración Firebase Modular
*   Inicialización centralizada en `packages/shared` o `apps/web/src/lib/firebase.ts` y `apps/mobile/src/lib/firebase.ts`.
*   Reglas de seguridad preliminares en `firestore.rules`.
*   Índices de Firestore en `firestore.indexes.json`.

### 3.4. Autenticación y RBAC
*   Servicio de Login con correo/contraseña en Firebase Auth.
*   Mecanismo de verificación de roles y permisos.
*   Contexto de Autenticación (`AuthContext`) y componentes de ruta protegida (`ProtectedRoute`).

## 4. Criterios de Aceptación
*   El comando `npm run build` o `npm run check` en el workspace compila exitosamente sin errores de TypeScript ni linter.
*   Los esquemas Zod validan correctamente pacientes válidos e invalidan pacientes menores de edad sin apoderado.
*   Pruebas unitarias de tipado, esquemas y lógica de permisos con cobertura superior al 80%.
*   Flujo de login funcional con redirección según el rol asignado.
