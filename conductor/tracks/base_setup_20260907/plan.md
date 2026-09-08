# Plan de Implementación: Setup del Workspace Multi-plataforma, Tipos Compartidos y Autenticación con Firebase RBAC

Este plan detalla las tareas secuenciales para inicializar la arquitectura monorepo de CEDO-REHAB Suite, el paquete de tipos de datos compartidos, la configuración de las aplicaciones Web y Móvil, y el sistema de autenticación con roles.

---

## Fase 1: Andamiaje del Monorepo y Modelos Clínicos Compartidos

- [x] Task: Configuración del Workspace y Herramientas Base
    - [x] Escribir pruebas de validación de estructura de workspace y scripts en `package.json`
    - [x] Crear el `package.json` raíz con workspaces para `apps/web`, `apps/mobile` y `packages/shared`
    - [x] Configurar `tsconfig.base.json`, `.editorconfig` y `.gitignore`

- [x] Task: Definición de Modelos Clínicos y Esquemas Zod en `packages/shared`
    - [x] Escribir pruebas unitarias con Vitest/Jest para esquemas Zod (validación de DNI, edad menor con apoderado, paquetes y citas)
    - [x] Implementar tipos TypeScript y esquemas Zod para Pacientes, Historias Clínicas y Fichas de Tratamiento
    - [x] Implementar tipos TypeScript y esquemas Zod para Agenda, Finanzas, Inventario y Roles de Usuario
    - [x] Configurar build y exportación de `packages/shared`

- [ ] Task: Conductor - User Manual Verification 'Fase 1: Andamiaje del Monorepo y Modelos Clínicos Compartidos' (Protocol in workflow.md)

---

## Fase 2: Inicialización de la Aplicación Web (React + Vite + Tailwind)

- [x] Task: Scaffolding de la Aplicación Web en `apps/web`
    - [x] Escribir pruebas de renderizado inicial y configuración de entorno para la app web
    - [x] Inicializar proyecto React + TypeScript con Vite en `apps/web`
    - [x] Configurar Tailwind CSS con la paleta de colores institucional de CEDO-REHAB (`clinica.melon`, `clinica.verde`, etc.)
    - [x] Configurar Lucide React y vincular dependencia local a `@cedo/shared`

- [x] Task: Maqueta Base y Layout Clínico Web
    - [x] Escribir pruebas para el componente de Sidebar y Header responsivo
    - [x] Implementar Sidebar de navegación con los 8 módulos clínicos (Agenda, Registro, Historias, Terapias, Asistencia, Inventario, Rencuentro, Finanzas)
    - [x] Implementar indicador de estado de conexión Firebase (Online/Offline) en el header

- [ ] Task: Conductor - User Manual Verification 'Fase 2: Inicialización de la Aplicación Web (React + Vite + Tailwind)' (Protocol in workflow.md)

---

## Fase 3: Unificación de la Experiencia Móvil a Web Responsiva (PWA para Terapeutas)

- [x] 3ba0099 Task: Integración de la Vista Móvil / PWA de Fisioterapeutas en `apps/web` (ADR-001)
    - [x] Registrar ADR-001 en `tech-stack.md` para unificar la plataforma a Web Responsiva / PWA
    - [x] Diseñar e implementar `VistaTerapeuta` con navegación por pestañas adaptativas (Turnos de Hoy, Mis Pacientes, Asistencia a Pie de Camilla)
    - [x] Conectar la experiencia móvil en `App.tsx` bajo el módulo de Ficha de Tratamiento
    - [x] Escribir pruebas unitarias con Vitest y Testing Library alcanzando >80% de cobertura
    - [x] Retirar subproyecto nativo `apps/mobile` y limpiar dependencias del monorepo

- [x] Task: Conductor - User Manual Verification 'Fase 3: Unificación de la Experiencia Móvil a Web Responsiva (PWA para Terapeutas)' (Protocol in workflow.md)

---

## Fase 4: Configuración Firebase Modular y Autenticación con Roles (RBAC)

- [x] 46cc180 Task: Configuración Centralizada de Firebase SDK Modular v10
    - [x] Escribir pruebas unitarias con mocks para el servicio de inicialización de Firebase
    - [x] Implementar módulo de inicialización de Firebase con persistencia offline habilitada (IndexedDB)
    - [x] Crear archivo `firestore.rules` con estructura básica de seguridad basada en tokens y roles

- [x] db3e5a1 Task: Sistema de Autenticación y Guards de Navegación por Roles
    - [x] Escribir pruebas unitarias para `AuthContext`, hook `useAuth` y protección de rutas
    - [x] Implementar `AuthContext` con soporte de login, logout y extracción de Custom Claims (`role`)
    - [x] Implementar componente de formulario de inicio de sesión estilizado para Web
    - [x] Implementar `ProtectedRoute` que restrinja acceso según rol (`admin`, `recepcion`, `terapeuta`, `medico`)

- [x] Task: Conductor - User Manual Verification 'Fase 4: Configuración Firebase Modular y Autenticación con Roles (RBAC)' (Protocol in workflow.md)
