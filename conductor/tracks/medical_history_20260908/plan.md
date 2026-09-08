# Plan de Implementación: Historia Clínica y Evaluación Médica Dinámica (Formato A4 Vertical)

Este plan detalla las tareas secuenciales con desarrollo guiado por pruebas (TDD) para implementar el módulo de Historia Clínica, generador de campos dinámicos, persistencia en Firestore con autoguardado reactivo y la plantilla institucional de impresión A4 Vertical en CEDO-REHAB Suite.

---

## Fase 1: Esquemas de Historia Clínica y Servicio Firestore de Evaluaciones

- [x] Task: Esquemas Zod y Tipos de Historia Clínica en `@cedo/shared` e2e4668
    - [x] Escribir pruebas unitarias en `clinical-history.schema.test.ts` para validación de historia clínica y campos dinámicos
    - [x] Implementar tipos TypeScript y esquemas Zod `ClinicalHistorySchema` y `CustomClinicalFieldSchema`
    - [x] Exportar nuevos esquemas y tipos en `packages/shared/src/index.ts` y validar build

- [x] Task: Servicio Firestore `historiaClinica.service.ts` y Reglas de Seguridad 12eb44b
    - [x] Escribir pruebas unitarias con mocks para el servicio en `historiaClinica.service.test.ts`
    - [x] Implementar métodos `guardarHistoriaClinica`, `obtenerHistoriaClinicaPorPaciente`, `suscribirHistoriaClinica` y `finalizarEvaluacionMedica`
    - [x] Actualizar reglas de seguridad en `firestore.rules` para la colección `historias_clinicas`

- [ ] Task: Conductor - User Manual Verification 'Fase 1: Esquemas de Historia Clínica y Servicio Firestore de Evaluaciones' (Protocol in workflow.md)

---

## Fase 2: Formulario de Evaluación Médica Dinámica y Autoguardado Reactivo

- [ ] Task: Selector de Paciente en Espera y Cabecera de Ficha Médica
    - [ ] Escribir pruebas unitarias para `SelectorPacienteHistoria.tsx` (lista de espera, búsqueda por DNI/nombre y visualización consolidada)
    - [ ] Implementar componente `SelectorPacienteHistoria.tsx` con pacientes derivados de triage y ficha consolidada de datos personales
    - [ ] Permitir selección reactiva de paciente para apertura de historia clínica

- [ ] Task: Componente `FormularioHistoriaClinica.tsx` con Campos Dinámicos y Debounce
    - [ ] Escribir pruebas unitarias para `FormularioHistoriaClinica.tsx` (campos base, adición/eliminación de campos dinámicos, debounce de autoguardado)
    - [ ] Implementar formulario médico estructurado con campos base (Motivo, Antecedentes, Examen Físico, DX, Plan)
    - [ ] Implementar funcionalidad interactiva "+ Agregar Campo" para insertar parámetros de evaluación ad-hoc en caliente
    - [ ] Integrar autoguardado reactivo (debounce 500ms) con feedback visual (*"Guardando..."*, *"Sincronizado"*) y botón "Completar Evaluación"

- [ ] Task: Conductor - User Manual Verification 'Fase 2: Formulario de Evaluación Médica Dinámica y Autoguardado Reactivo' (Protocol in workflow.md)

---

## Fase 3: Formato de Impresión A4 Vertical e Integración en App Web

- [ ] Task: Plantilla de Impresión Institucional A4 Vertical (`ImpresionHistoriaA4.tsx`)
    - [ ] Escribir pruebas unitarias para la plantilla de impresión A4 institucional y membrete oficial
    - [ ] Implementar componente `ImpresionHistoriaA4.tsx` con membrete formal de CEDO-REHAB EIRL, datos clínicos tabulados, campos dinámicos y pie institucional con zona de firma y sello
    - [ ] Configurar y verificar clases de impresión `@media print` (`.print-a4-vertical`, ocultamiento de sidebars y navegación)

- [ ] Task: Módulo Unificado `ModuloHistoriaClinica.tsx` e Integración en `App.tsx`
    - [ ] Escribir pruebas unitarias para `ModuloHistoriaClinica.tsx` y su integración en `App.tsx`
    - [ ] Implementar vista unificada `ModuloHistoriaClinica.tsx` que integre el selector, formulario reactivo y modal de impresión
    - [ ] Conectar el módulo en `apps/web/src/App.tsx` bajo la opción "Historia Clínica General (Informe A4)"
    - [ ] Vincular la acción "Evaluar" de `ColaTriage.tsx` para abrir directamente la historia clínica del paciente seleccionado

- [ ] Task: Conductor - User Manual Verification 'Fase 3: Formato de Impresión A4 Vertical e Integración en App Web' (Protocol in workflow.md)
