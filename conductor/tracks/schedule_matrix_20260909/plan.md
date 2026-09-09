# Plan de Implementación: Matriz de Agenda y Turnos Semanales Multi-Terapeuta con Código de Colores

Este plan detalla las tareas secuenciales siguiendo desarrollo guiado por pruebas (TDD) para implementar la matriz interactiva de horarios semanales de Lunes a Sábado, el selector multi-año y mensual (2026–2035), el código de colores de especialidades, la marcación de feriados, la duplicación rápida de semanas y la persistencia particionada en Firestore para CEDO-REHAB Suite.

---

## Fase 1: Esquemas de Validación Zod, Utilidades de Calendario y Servicio Firestore de Agenda Semanal

- [ ] Task: Esquemas Zod y Funciones de Utilidad de Calendario en `@cedo/shared`
    - [ ] Escribir pruebas unitarias en `schedule.schema.test.ts` para validación de slots, estados de día, semanas completas y utilidades de rangos de fechas (2026-2035)
    - [ ] Implementar esquemas Zod en `packages/shared/src/schemas/schedule.schema.ts` y funciones de generación de plantilla semanal
    - [ ] Exportar y verificar compilación de `@cedo/shared`

- [ ] Task: Servicio Firestore `agenda.service.ts` y Operaciones de Particionamiento
    - [ ] Escribir pruebas unitarias con mocks para el servicio en `agenda.service.test.ts`
    - [ ] Implementar métodos `obtenerAgendaSemanal`, `guardarAgendaSemanal`, `actualizarSlot`, `marcarEstadoDia`, `copiarSemanaSiguiente` y `suscribirAgendaSemanal`
    - [ ] Verificar compatibilidad con reglas de seguridad en `firestore.rules`

- [ ] Task: Conductor - User Manual Verification 'Fase 1: Esquemas de Validación Zod, Utilidades de Calendario y Servicio Firestore de Agenda Semanal' (Protocol in workflow.md)

---

## Fase 2: Componentes de Visualización Matricial, Códigos de Colores y Gestión de Slots

- [ ] Task: Selector de Período, Leyenda de Colores y Celda Interactiva (`SelectorPeriodoSemana.tsx`, `LeyendaColores.tsx`, `CeldaTurno.tsx`)
    - [ ] Escribir pruebas unitarias para componentes de navegación temporal, leyenda de 6 especialidades y renderizado de celdas con colores temáticos
    - [ ] Implementar `SelectorPeriodoSemana.tsx`, `LeyendaColores.tsx` y `CeldaTurno.tsx` con estilos Tailwind accesibles y badges de asistencia

- [ ] Task: Modal de Edición de Turno (`ModalTurno.tsx`) con Búsqueda de Paciente y Asistencia
    - [ ] Escribir pruebas unitarias para `ModalTurno.tsx` (asignación de paciente, selección de especialidad, notas clínicas, toggle de asistencia y desocupación de slot)
    - [ ] Implementar componente `ModalTurno.tsx` ergonómico y reactivo

- [ ] Task: Conductor - User Manual Verification 'Fase 2: Componentes de Visualización Matricial, Códigos de Colores y Gestión de Slots' (Protocol in workflow.md)

---

## Fase 3: Matriz Semanal Completa, Productividad (Copiar Semana) e Integración en App

- [ ] Task: Componente de Grilla Semanal (`MatrizAgenda.tsx`) con Días Feriados/Laborales
    - [ ] Escribir pruebas unitarias para `MatrizAgenda.tsx` (estructura L-S, franjas horarias, alternancia de feriados y activación de modal)
    - [ ] Implementar `MatrizAgenda.tsx` con renderizado matricial de alto rendimiento y contraste visual

- [ ] Task: Módulo Unificado `ModuloAgenda.tsx`, Acción "Copiar Semana Siguiente" e Integración en `App.tsx`
    - [ ] Escribir pruebas unitarias para `ModuloAgenda.tsx` y su integración en `App.tsx`
    - [ ] Implementar vista unificada `ModuloAgenda.tsx` con reactividad en tiempo real y duplicación de semanas hacia la siguiente
    - [ ] Conectar el módulo en `apps/web/src/App.tsx` bajo la opción "Horario y Agenda Semanal"

- [ ] Task: Conductor - User Manual Verification 'Fase 3: Matriz Semanal Completa, Productividad (Copiar Semana) e Integración en App' (Protocol in workflow.md)
