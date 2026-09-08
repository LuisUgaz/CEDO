# Especificación Técnica: Admisión, Registro y Triage de Pacientes con Regla de Minoridad

## 1. Resumen Ejecutivo
Este track implementa el flujo inicial de atención en recepción para **CEDO-REHAB EIRL**: la admisión formal de pacientes, validación de documentos de identidad (DNI), aplicación estricta de la regla de minoridad con requerimiento legal de apoderado, pre-clasificación de consulta y derivación a la cola de espera de triage para evaluación médica o fisioterapéutica.

## 2. Objetivos Principales
1. Proveer un formulario de admisión ágil, ergonómico y validado mediante esquemas Zod (`@cedo/shared`).
2. Implementar la **Regla de Minoridad**:
   - Detección automática en tiempo real cuando la edad del paciente es menor a 18 años.
   - Despliegue visual reactivo con llamada de atención visual para los campos del apoderado (DNI, nombres, parentesco, teléfono).
   - Bloqueo estricto del botón de registro si no se ingresa un apoderado con DNI de 8 dígitos válido.
3. Clasificación del motivo y tipo de consulta inicial:
   - `PRE-CONSULTA` (S/. 50.00)
   - `CONSULTA_MEDICA` (S/. 50.00)
   - `EVALUACION_FISIOTERAPEUTICA` (S/. 50.00)
   - `TERAPIA_DIRECTA` (derivado con orden externa)
4. Persistencia en Cloud Firestore en la colección `pacientes` con el estado inicial `en_espera_triage`.
5. Tablero o cola de pacientes en espera en recepción con indicador de tiempo de espera y estado de derivación.

## 3. Arquitectura y Modelos

### 3.1. Modelo de Datos (`packages/shared/src/schemas/patient.schema.ts`)
*   `nombres`: string no vacío.
*   `apellidos`: string no vacío.
*   `dni`: string de exactamente 8 dígitos numéricos.
*   `edad`: número entero positivo.
*   `fechaNacimiento`: string ISO o fecha opcional.
*   `telefono`: string de 9 dígitos.
*   `direccion`: string opcional.
*   `ocupacion`: string opcional.
*   `esMenorDeEdad`: booleano calculado (`edad < 18`).
*   `apoderado`: obligatorio si `esMenorDeEdad` es `true`.
*   `tipoConsulta`: enum `'PRE_CONSULTA' | 'CONSULTA_MEDICA' | 'EVALUACION_FISIOTERAPEUTICA' | 'TERAPIA_DIRECTA'`.
*   `costoConsulta`: número (ej. 50.00).
*   `estadoTriage`: enum `'en_espera' | 'en_evaluacion' | 'atendido'`.

### 3.2. Capa de Servicios (`apps/web/src/services/pacientes.service.ts`)
*   `crearPaciente(data)`: Valida con Zod y guarda en Firestore `/pacientes`.
*   `obtenerPacientesEnEspera()`: Consulta en tiempo real los pacientes con `estadoTriage == 'en_espera'`.
*   `actualizarEstadoTriage(pacienteId, nuevoEstado)`: Modifica el estado del paciente.

### 3.3. Interfaz de Usuario (`apps/web/src/components/admision/`)
*   `FormularioAdmision.tsx`: Formulario reactivo con campos de paciente y sección condicional de apoderado.
*   `ColaTriage.tsx`: Lista de pacientes en sala de espera con código de colores según tipo de consulta y tiempo transcurrido.
*   `ModuloAdmision.tsx`: Vista principal del módulo "Registro de Paciente".

## 4. Criterios de Aceptación
1. Si se ingresa una edad < 18, la sección de apoderado se muestra inmediatamente con estilo visual de advertencia.
2. Si el DNI de apoderado no tiene 8 dígitos o está vacío, el formulario no se puede enviar.
3. Si el paciente es mayor de edad (>= 18), la sección de apoderado no es obligatoria.
4. Al enviar el formulario, el paciente se almacena en Firestore y aparece de inmediato en la cola de triage.
5. Cobertura de pruebas unitarias superior al 80% en componentes y servicios.
