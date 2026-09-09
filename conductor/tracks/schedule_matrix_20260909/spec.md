# Especificación Técnica: Matriz de Agenda y Turnos Semanales Multi-Terapeuta con Código de Colores

## 1. Resumen Ejecutivo
Este track implementa el módulo central de **Gestión Operativa y Horarios Semanales Multi-Terapeuta** para **CEDO-REHAB EIRL** (Track 5). Permite al personal de recepción, médicos y terapeutas visualizar, programar y administrar los turnos de atención de Lunes a Sábado mediante una cuadrícula matricial interactiva organizada por código de colores según especialidad terapéutica. El módulo resuelve de raíz el cuello de botella del sistema legado particionando los datos en documentos independientes por semana en Cloud Firestore (`citas_agenda/{semanaId}`), eliminando cualquier riesgo de saturación del límite de 1MB por documento y permitiendo la duplicación ágil de semanas completas en tiempo real.

## 2. Objetivos Principales
1. **Navegación Temporal Multi-Año y Mensual (2026–2035):**
   - Selector intuitivo de Año (2026–2035), Mes (Enero a Diciembre) y Número de Semana (Semana 1 a 5).
   - Cálculo dinámico de fechas exactas y rango visual de la semana de Lunes a Sábado (ej. `Lunes 07/09/2026 - Sábado 12/09/2026`).
2. **Matriz Interactiva de Turnos (Lunes a Sábado):**
   - Franjas horarias configurables (horario habitual clínico de 08:00 AM a 07:00 PM / 08:00 PM).
   - Columnas por día hábil (Lunes, Martes, Miércoles, Jueves, Viernes, Sábado).
   - Marcación de días laborales (verde) y feriados/no laborables (rojo) por día, con capacidad de alternar el estado y avisar visualmente al usuario.
3. **Identificación por Código de Colores de Especialidad:**
   - *Fucsia (`color-fucsia`, fondo `#f3e8ff`, texto `#581c87`):* Magnetoterapia
   - *Melón (`color-melon`, fondo `#ffedd5`, texto `#9a3412`):* Niños / Pediatría
   - *Verde (`color-verde`, fondo `#dcfce7`, texto `#166534`):* Adultos / Electroterapia
   - *Amarillo (`color-amarillo`, fondo `#fef9c3`, texto `#854d0e`):* Adultos Mayores / Geriatría
   - *Azul (`color-azul`, fondo `#dbeafe`, texto `#1e40af`):* Masajes / Descontracturantes
   - *Anaranjado (`color-anaranjado`, fondo `#fed7aa`, texto `#c2410c`):* Consulta Médica / Doctor
   - Barra de leyenda visual e interactiva con accesos directos y guía de colores.
4. **Gestión Ágil de Citas / Slots:**
   - Clic en cualquier slot horario para abrir el editor modal ergonómico.
   - Búsqueda predictiva y selección rápida de pacientes registrados en el sistema (`/pacientes`).
   - Asignación de terapeuta responsable o evaluador.
   - Marcado directo de asistencia (`asistio: boolean`) con badge visual e indicador de estado.
   - Campo de notas u observaciones clínicas particulares para el turno.
   - Opción para limpiar/desocupar el slot con un solo clic.
5. **Herramientas de Alta Productividad y Duplicación:**
   - Función "Copiar a Semana Siguiente": Replica en un solo paso todos los bloques de turnos a la semana consecutiva en Firestore, preservando pacientes, colores y terapeutas, respetando los días feriados.
   - Inicialización automática de plantilla vacía con días laborales por defecto al consultar una semana nueva.
6. **Arquitectura de Datos Escalable y Tiempo Real:**
   - Persistencia en colección `citas_agenda` con identificador único por semana (ej. `2026_09_sem2`).
   - Suscripción reactiva `onSnapshot` que refleja de inmediato las modificaciones de turnos entre múltiples puestos de recepción y salas de terapia.

## 3. Arquitectura y Modelos

### 3.1. Modelo de Datos y Validación (`packages/shared`)
*   `WeekDay`: `'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado'`.
*   `DayWorkStatus`: `'laboral' | 'feriado'`.
*   `ScheduleSlot`:
    *   `id`: string identificador del slot (ej. `lunes_08:00`).
    *   `hora`: string con hora en formato HH:mm (ej. `"08:00"`).
    *   `dia`: `WeekDay`.
    *   `pacienteId`: string opcional / null.
    *   `nombrePaciente`: string opcional.
    *   `color`: `PatientColor` opcional.
    *   `asistio`: boolean (por defecto `false`).
    *   `nota`: string opcional.
    *   `terapeutaId`: string opcional / null.
*   `WeekSchedule`:
    *   `id`: string clave de la semana (ej. `"2026_09_sem2"`).
    *   `anio`: número entero (2026–2035).
    *   `mes`: string o número de mes (ej. `"09"` o `"septiembre"`).
    *   `numeroSemana`: número entero (1 a 5).
    *   `rangoFechas`: string representativo (ej. `"07/09/2026 - 12/09/2026"`).
    *   `estadoDias`: Record<WeekDay, DayWorkStatus>.
    *   `slots`: ScheduleSlot[].
    *   `updatedAt`: string timestamp ISO.
*   Esquemas Zod en `packages/shared/src/schemas/schedule.schema.ts` para validación de slots y agenda semanal completa.

### 3.2. Capa de Servicios (`apps/web/src/services/agenda.service.ts`)
*   `obtenerAgendaSemanal(semanaId: string)`: Obtiene la agenda de Firestore o genera la plantilla vacía por defecto.
*   `guardarAgendaSemanal(agenda: WeekSchedule)`: Persiste el documento de la semana validado.
*   `actualizarSlot(semanaId: string, slot: ScheduleSlot)`: Actualiza de forma atómica o puntual un turno específico.
*   `marcarEstadoDia(semanaId: string, dia: WeekDay, estado: DayWorkStatus)`: Alterna un día entre laboral y feriado.
*   `copiarSemanaSiguiente(origenSemanaId: string, destinoSemanaId: string, anioDestino: number, mesDestino: string, numeroSemanaDestino: number, rangoFechasDestino: string)`: Duplica los turnos no vacíos a la siguiente semana.
*   `suscribirAgendaSemanal(semanaId: string, onUpdate, onError)`: Suscripción en tiempo real con `onSnapshot`.

### 3.3. Interfaz de Usuario (`apps/web/src/components/agenda/`)
*   `SelectorPeriodoSemana.tsx`: Controles de selección de Año (2026-2035), Mes y Semana, con visualización de rango de fechas y botón de duplicación.
*   `LeyendaColores.tsx`: Barra visual con la codificación oficial de 6 especialidades de CEDO-REHAB.
*   `CeldaTurno.tsx`: Representación ergonómica del turno en la matriz con fondo temático, nombre de paciente, check de asistencia y clic para editar.
*   `ModalTurno.tsx`: Modal para asignar paciente (con búsqueda integrada), terapeuta, color de terapia, notas y alternancia de asistencia.
*   `MatrizAgenda.tsx`: Grilla semanal completa de Lunes a Sábado por horas, con cabeceras de días que permiten marcar feriados.
*   `ModuloAgenda.tsx`: Vista integral del módulo "Horario y Agenda Semanal" conectada a Firestore y lista para producción.

## 4. Criterios de Aceptación
1. El usuario puede seleccionar cualquier año entre 2026 y 2035, mes y semana, visualizando inmediatamente el rango de fechas de Lunes a Sábado.
2. La matriz muestra claramente las columnas de Lunes a Sábado y las filas horarias de atención clínica.
3. Los turnos asignados muestran su respectivo color temático de especialidad (Fucsia, Melón, Verde, Amarillo, Azul, Anaranjado) con contraste tipográfico accesible.
4. Las cabeceras de los días permiten alternar el estado entre "Laboral" (verde) y "Feriado" (rojo).
5. Al hacer clic en un slot, se abre el modal que permite asignar o desasignar paciente, cambiar color, registrar notas y marcar asistencia.
6. El botón "Copiar a Semana Siguiente" transfiere con éxito la programación de turnos a la semana consecutiva en Firestore.
7. El módulo está completamente integrado en `apps/web/src/App.tsx` en la opción "Horario y Agenda Semanal".
8. Cobertura de pruebas unitarias superior al 80% en esquemas, servicios y componentes de agenda.
