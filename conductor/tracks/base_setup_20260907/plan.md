# Plan de Implementación: Setup del Workspace Multi-plataforma, Tipos Compartidos y Autenticación con Firebase RBAC

Este plan detalla las tareas secuenciales para inicializar la arquitectura monorepo de CEDO-REHAB Suite, el paquete de tipos de datos compartidos, la configuración de las aplicaciones Web y Móvil, y el sistema de autenticación con roles.

---

## Fase 1: Andamiaje del Monorepo y Modelos Clínicos Compartidos

- [ ] Task: Configuración del Workspace y Herramientas Base
    - [ ] Escribir pruebas de validación de estructura de workspace y scripts en `package.json`
    - [ ] Crear el `package.json` raíz con workspaces para `apps/web`, `apps/mobile` y `packages/shared`
    - [ ] Configurar `tsconfig.base.json`, `.editorconfig` y `.gitignore`

- [ ] Task: Definición de Modelos Clínicos y Esquemas Zod en `packages/shared`
    - [ ] Escribir pruebas unitarias con Vitest/Jest para esquemas Zod (validación de DNI, edad menor con apoderado, paquetes y citas)
    - [ ] Implementar tipos TypeScript y esquemas Zod para Pacientes, Historias Clínicas y Fichas de Tratamiento
    - [ ] Implementar tipos TypeScript y esquemas Zod para Agenda, Finanzas, Inventario y Roles de Usuario
    - [ ] Configurar build y exportación de `packages/shared`

- [ ] Task: Conductor - User Manual Verification 'Fase 1: Andamiaje del Monorepo y Modelos Clínicos Compartidos' (Protocol in workflow.md)

---

## Fase 2: Inicialización de la Aplicación Web (React + Vite + Tailwind)

- [ ] Task: Scaffolding de la Aplicación Web en `apps/web`
    - [ ] Escribir pruebas de renderizado inicial y configuración de entorno para la app web
    - [ ] Inicializar proyecto React 19 + TypeScript con Vite en `apps/web`
    - [ ] Configurar Tailwind CSS v3/v4 con la paleta de colores institucional de CEDO-REHAB (`color-melon`, `color-verde`, etc.)
    - [ ] Configurar Lucide React y vincular dependencia local a `@cedo/shared`

- [ ] Task: Maqueta Base y Layout Clínico Web
    - [ ] Escribir pruebas para el componente de Sidebar y Header responsivo
    - [ ] Implementar Sidebar de navegación con los 7 módulos clínicos (Agenda, Registro, Historias, Terapias, Asistencia, Inventario, Finanzas)
    - [ ] Implementar indicador de estado de conexión Firebase (Online/Offline) en el header

- [ ] Task: Conductor - User Manual Verification 'Fase 2: Inicialización de la Aplicación Web (React + Vite + Tailwind)' (Protocol in workflow.md)

---

## Fase 3: Inicialización de la Aplicación Móvil (React Native + Expo)

- [ ] Task: Scaffolding de la Aplicación Móvil en `apps/mobile`
    - [ ] Escribir pruebas de configuración y smoke test del punto de entrada de la app móvil
    - [ ] Inicializar proyecto React Native con Expo Router y TypeScript en `apps/mobile`
    - [ ] Configurar NativeWind (Tailwind CSS para móvil) con la paleta clínica
    - [ ] Configurar navegación por pestañas (Tabs) para Terapeutas (Turnos de Hoy, Mis Pacientes, Asistencia Rápida)

- [ ] Task: Conductor - User Manual Verification 'Fase 3: Inicialización de la Aplicación Móvil (React Native + Expo)' (Protocol in workflow.md)

---

## Fase 4: Configuración Firebase Modular y Autenticación con Roles (RBAC)

- [ ] Task: Configuración Centralizada de Firebase SDK Modular v10
    - [ ] Escribir pruebas unitarias con mocks para el servicio de inicialización de Firebase
    - [ ] Implementar módulo de inicialización de Firebase con persistencia offline habilitada (IndexedDB)
    - [ ] Crear archivo `firestore.rules` con estructura básica de seguridad basada en tokens y roles

- [ ] Task: Sistema de Autenticación y Guards de Navegación por Roles
    - [ ] Escribir pruebas unitarias para `AuthContext`, hook `useAuth` y protección de rutas
    - [ ] Implementar `AuthContext` con soporte de login, logout y extracción de Custom Claims (`role`)
    - [ ] Implementar componente de formulario de inicio de sesión estilizado para Web
    - [ ] Implementar `ProtectedRoute` que restrinja acceso según rol (`admin`, `recepcion`, `terapeuta`, `medico`)

- [ ] Task: Conductor - User Manual Verification 'Fase 4: Configuración Firebase Modular y Autenticación con Roles (RBAC)' (Protocol in workflow.md)
