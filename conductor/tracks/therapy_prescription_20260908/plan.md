# Plan de Implementación: Prescripción Terapéutica y Tarjetón de Tratamiento (Formato A6 / A5 / A4)

Este plan detalla las tareas secuenciales con desarrollo guiado por pruebas (TDD) para implementar el catálogo de agentes físicos, editor reactivo con casillas tipo "X", autoguardado en Firestore y la plantilla multi-formato de impresión física (A6 / A5 / A4) para el Tarjetón de Fisioterapia de CEDO-REHAB Suite.

---

## Fase 1: Esquemas de Prescripción y Servicio Firestore de Tarjetones

- [x] Task: Esquemas Zod y Tipos de Tarjetón de Tratamiento en `@cedo/shared` (77119c9)
    - [x] Escribir pruebas unitarias en `therapy.schema.test.ts` para validación de fichas de tratamiento, catálogo de agentes y formatos A6/A5/A4
    - [x] Perfeccionar tipos TypeScript y esquemas Zod en `packages/shared/src/schemas/therapy.schema.ts` permitiendo inputs opcionales y valores por defecto
    - [x] Exportar y verificar compilación de `@cedo/shared`

- [x] Task: Servicio Firestore `tarjeton.service.ts` y Reglas de Seguridad (4a074aa)
    - [x] Escribir pruebas unitarias con mocks para el servicio en `tarjeton.service.test.ts`
    - [x] Implementar métodos `guardarTarjetonTratamiento`, `obtenerTarjetonPorPaciente` y `suscribirTarjetonPorPaciente`
    - [x] Actualizar reglas de seguridad en `firestore.rules` para la colección `tarjetones_tratamiento`

- [x] Task: Conductor - User Manual Verification 'Fase 1: Esquemas de Prescripción y Servicio Firestore de Tarjetones' (Protocol in workflow.md)

---

## Fase 2: Editor Interactivo de Prescripción con Checkboxes 'X' y Autoguardado Reactivo

- [x] Task: Componente de Selección de Agentes Físicos y Técnicas (`CatalogoPrescripcion.tsx`) (2b84d8f)
    - [x] Escribir pruebas unitarias para `CatalogoPrescripcion.tsx` (marcado reactivo de casillas tipo "X", agrupación por categorías: Agentes Físicos, Técnicas Manuales y Cinesiterapia)
    - [x] Implementar componente `CatalogoPrescripcion.tsx` con diseño ergonómico de alta densidad y marcado rápido con 'X' de alto contraste

- [x] Task: Formulario del Tarjetón con Autoguardado Debounce (`FormularioTarjeton.tsx`) (e41088c)
    - [x] Escribir pruebas unitarias para `FormularioTarjeton.tsx` (distinción Asegurado/Particular, número de paquete, indicaciones médicas expandibles, selector de formato y debounce de 500ms)
    - [x] Implementar `FormularioTarjeton.tsx` integrando el catálogo, renglones dinámicos de indicaciones y persistencia reactiva en Firestore

- [x] Task: Conductor - User Manual Verification 'Fase 2: Editor Interactivo de Prescripción con Checkboxes 'X' y Autoguardado Reactivo' (Protocol in workflow.md)

---

## Fase 3: Plantilla de Impresión Multi-Formato (A6 / A5 / A4) e Integración en App Web

- [x] Task: Plantilla de Impresión Institucional (`ImpresionTarjeton.tsx`) (d33eb22)
    - [x] Escribir pruebas unitarias para el renderizado del tarjetón físico en formatos A6 (105 × 148 mm), A5 y A4
    - [x] Implementar `ImpresionTarjeton.tsx` con membrete institucional oficial de CEDO-REHAB EIRL, distintivo Asegurado/Particular, grilla de casillas [ X ] nítidas, renglones de indicaciones y cuadrícula de control de asistencia de sesiones (1 a 10/12)
    - [x] Configurar clases de impresión `@media print` (`.print-a6-tarjeton`, etc.) y ocultamiento de controles

- [x] Task: Módulo Unificado `ModuloTarjeton.tsx` e Integración en `App.tsx` (cb17c8b)
    - [x] Escribir pruebas unitarias para `ModuloTarjeton.tsx` y su integración en `App.tsx`
    - [x] Implementar vista unificada `ModuloTarjeton.tsx` con selector de pacientes y alternancia a vista de impresión
    - [x] Conectar el módulo en `apps/web/src/App.tsx` bajo la opción "Ficha de Tratamiento (Tarjetón A6)"

- [x] Task: Conductor - User Manual Verification 'Fase 3: Plantilla de Impresión Multi-Formato (A6 / A5 / A4) e Integración en App Web' (Protocol in workflow.md)
