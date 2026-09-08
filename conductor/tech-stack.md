# Stack Tecnológico: CEDO-REHAB Suite

## 1. Arquitectura General del Sistema
*   **Modelo de Desarrollo:** Arquitectura Web Unificada con capa de modelos TypeScript y esquemas Zod compartidos (`packages/shared`).
*   **Plataforma de Aplicación (Recepción, Consultorios, Sala y Móvil):** React 19 + Vite (SPA de alto rendimiento con diseño totalmente responsivo y capacidades PWA para uso en teléfonos y tablets a pie de camilla).
*   **Backend as a Service (BaaS):** Firebase (Auth + Firestore + Storage) con SDK Modular v10.

---

## 2. Aplicación Web y Móvil Responsiva (`apps/web`)
*   **Core:** React 19 + TypeScript (configuración estricta `strict: true`).
*   **Build Tool & Dev Server:** Vite (arranque instantáneo, HMR ultrarrápido).
*   **Estilos y Sistema de Diseño:** Tailwind CSS + Lucide React Icons (diseño adaptativo para monitores de escritorio, tablets y smartphones en sala).
*   **Experiencia Móvil / PWA:** Acceso directo desde navegadores móviles (Chrome/Safari) con soporte de instalación en pantalla de inicio (PWA) para fisioterapeutas a pie de camilla.
*   **Manejo de Estado & Cache Reactivo:** TanStack Query (React Query) + Context API / Zustand para estado de sesión y UI.
*   **Formularios & Validación:** React Hook Form + Zod (validación de esquemas clínicos y DNI).
*   **Reportes y Gráficos:** SheetJS (`xlsx`) para exportaciones multi-hoja a Excel y Recharts / Chart.js para analítica financiera.
*   **Impresión Médica:** Componentes dedicados con CSS `@media print` para formatos A4 Vertical e informe A6/A5.

---

## 3. Backend, Base de Datos y Seguridad (Firebase)
*   **SDK:** Firebase SDK v10 (Arquitectura Modular y Tree-shakeable).
*   **Autenticación:** Firebase Authentication con Custom Claims para Roles (Admin, Recepción, Terapeuta, Médico).
*   **Base de Datos NoSQL:** Cloud Firestore normalizado:
    *   `pacientes`: Documento base por paciente.
    *   `pacientes/{id}/paquetes`: Subcolección de paquetes y planes terapéuticos.
    *   `citas_agenda/{semanaId}/citas`: Subcolección semanal para evitar el límite de 1MB por documento.
    *   `transacciones`: Registro inmutable de pagos, abonos y caja diaria.
    *   `inventario`: Insumos y stock actual.
    *   `auditorias_inventario`: Conteos semanales de los 4 sábados.
*   **Persistencia Offline:** Firebase Firestore Offline Persistence habilitado con `IndexedDB`.
*   **Reglas de Seguridad:** Firestore Security Rules estrictas por rol.

---

## 4. Herramientas de Desarrollo y Calidad
*   **Control de Versiones:** Git con ramas por módulo/track.
*   **Testing:** Vitest + React Testing Library con cobertura de código >80%.
*   **Linter & Formatter:** ESLint + Prettier configurados para TypeScript y Tailwind.
*   **Tipos Compartidos:** Paquete compartido (`packages/shared`) con definiciones TypeScript y esquemas Zod clínicos.

---

## 5. Registro de Decisiones de Arquitectura (ADR)

### ADR-001 (2026-09-08): Unificación de Plataforma a Web Responsiva / PWA
* **Contexto:** Inicialmente se proyectó una aplicación móvil nativa independiente con React Native y Expo (`apps/mobile`) para fisioterapeutas. En la práctica clínica y de desarrollo, el mantenimiento de dos runtimes distintos (Vite para Web y Metro/Expo para Móvil) introduce desalineaciones de dependencias (versiones de Expo SDK en tiendas/Expo Go vs entorno local) y fricción operativa innecesaria para el personal médico.
* **Decisión:** Retirar el subproyecto nativo `apps/mobile` y unificar toda la suite en `apps/web` con diseño Web Responsivo Mobile-First y PWA. 
* **Consecuencias:** 
  - Despliegues inmediatos sin intermediación de tiendas ni Expo Go.
  - Los terapeutas acceden desde el navegador de su teléfono o tablet agregando la app a la pantalla de inicio.
  - Reducción drástica del tamaño y complejidad del monorepo, optimizando tiempos de build y pruebas.
