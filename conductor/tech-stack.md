# Stack Tecnológico: CEDO-REHAB Suite

## 1. Arquitectura General del Sistema
*   **Modelo de Desarrollo:** Estructura Multi-plataforma con capa de negocio y tipos TypeScript compartidos.
*   **Plataforma Web (Recepción, Consultorios, Administración):** React + Vite (SPA de alto rendimiento).
*   **Plataforma Móvil (Terapeutas en sala, Seguimiento rápido):** React Native con Expo.
*   **Backend as a Service (BaaS):** Firebase (Auth + Firestore + Storage) con SDK Modular v10.

---

## 2. Aplicación Web (Web Admin & Clínica)
*   **Core:** React 19 + TypeScript (configuración estricta `strict: true`).
*   **Build Tool & Dev Server:** Vite (arranque instantáneo, HMR ultrarrápido).
*   **Estilos y Sistema de Diseño:** Tailwind CSS + Lucide React Icons.
*   **Manejo de Estado & Cache Reactivo:** TanStack Query (React Query) + Context API / Zustand para estado de sesión y UI.
*   **Formularios & Validación:** React Hook Form + Zod (validación de esquemas clínicos y DNI).
*   **Reportes y Gráficos:** SheetJS (`xlsx`) para exportaciones multi-hoja a Excel y Recharts / Chart.js para analítica financiera.
*   **Impresión Médica:** Componentes dedicados con CSS `@media print` para formatos A4 Vertical e informe A6/A5.

---

## 3. Aplicación Móvil (App Móvil para Terapeutas)
*   **Framework:** React Native con Expo SDK (soporte multiplataforma iOS y Android).
*   **Lenguaje:** TypeScript (`strict: true`).
*   **Motor de Estilos:** NativeWind (Tailwind CSS adaptado nativamente para componentes de React Native).
*   **Navegación:** Expo Router / React Navigation (Tabs nativos y Stack).
*   **Funcionalidades Clave:** Visualización de turnos asignados del día, marcado rápido de asistencia de pacientes, registro de tratamientos en camilla y notificaciones.

---

## 4. Backend, Base de Datos y Seguridad (Firebase)
*   **SDK:** Firebase SDK v10 (Arquitectura Modular y Tree-shakeable).
*   **Autenticación:** Firebase Authentication con Custom Claims para Roles (Admin, Recepción, Terapeuta, Médico).
*   **Base de Datos NoSQL:** Cloud Firestore normalizado:
    *   `pacientes`: Documento base por paciente.
    *   `pacientes/{id}/paquetes`: Subcolección de paquetes y planes terapéuticos.
    *   `citas_agenda/{semanaId}/citas`: Subcolección semanal para evitar el límite de 1MB por documento.
    *   `transacciones`: Registro inmutable de pagos, abonos y caja diaria.
    *   `inventario`: Insumos y stock actual.
    *   `auditorias_inventario`: Conteos semanales de los 4 sábados.
*   **Persistencia Offline:** Firebase Firestore Offline Persistence habilitado (IndexedDB en Web, SQLite en Móvil).
*   **Reglas de Seguridad:** Firestore Security Rules estrictas por rol.

---

## 5. Herramientas de Desarrollo y Calidad
*   **Control de Versiones:** Git con ramas por módulo/track.
*   **Linter & Formatter:** ESLint + Prettier configurados para TypeScript y Tailwind.
*   **Tipos Compartidos:** Directorio o paquete compartido (`shared/types`) con definiciones TypeScript para modelos clínicos.
