# Plan de Implementación: Admisión, Registro y Triage de Pacientes con Regla de Minoridad

Este plan detalla las tareas secuenciales con desarrollo guiado por pruebas (TDD) para implementar el módulo de Admisión, validaciones de minoridad y cola de triage en `apps/web`.

---

## Fase 1: Esquemas de Admisión y Servicio Firestore de Pacientes

- [ ] Task: Ampliación de Esquemas de Admisión y Servicio de Pacientes
    - [ ] Escribir pruebas unitarias con mocks para el servicio `pacientes.service.ts`
    - [ ] Actualizar esquema Zod en `@cedo/shared` con tipos de consulta y estado de triage
    - [ ] Implementar `pacientes.service.ts` con métodos `crearPaciente`, `obtenerPacientesEnEspera` y `actualizarEstadoTriage`

- [ ] Task: Conductor - User Manual Verification 'Fase 1: Esquemas de Admisión y Servicio Firestore de Pacientes' (Protocol in workflow.md)

---

## Fase 2: Formulario de Admisión con Regla Reactiva de Minoridad

- [ ] Task: Componente Formulario de Admisión con Regla de Minoridad
    - [ ] Escribir pruebas unitarias para `FormularioAdmision.tsx` (cálculo de minoridad, bloqueo de botón por falta de DNI de apoderado, costo de consulta)
    - [ ] Implementar `FormularioAdmision.tsx` con campos de paciente, sección reactiva de apoderado y selector de tipo de consulta
    - [ ] Integrar feedback de validación Zod en tiempo real y paleta clínica institucional

- [ ] Task: Conductor - User Manual Verification 'Fase 2: Formulario de Admisión con Regla Reactiva de Minoridad' (Protocol in workflow.md)

---

## Fase 3: Cola de Triage en Recepción e Integración en App Web

- [ ] Task: Tablero de Pacientes en Espera e Integración con Módulo de Registro
    - [ ] Escribir pruebas unitarias para `ColaTriage.tsx` y `ModuloAdmision.tsx`
    - [ ] Implementar componente `ColaTriage.tsx` con tarjetas de pacientes, badge de consulta, hora de ingreso y acciones de derivación
    - [ ] Implementar vista unificada `ModuloAdmision.tsx` con pestañas para "Nuevo Registro" y "Fichas en Espera"
    - [ ] Conectar el módulo en `apps/web/src/App.tsx` bajo la opción "Registro de Paciente"

- [ ] Task: Conductor - User Manual Verification 'Fase 3: Cola de Triage en Recepción e Integración en App Web' (Protocol in workflow.md)
