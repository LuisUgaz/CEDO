# Especificación Técnica: Historia Clínica y Evaluación Médica Dinámica (Formato A4 Vertical)

## 1. Resumen Ejecutivo
Este track implementa el módulo central de **Evaluación Médica e Historia Clínica General** para **CEDO-REHAB EIRL** (Track 3). Permite a los médicos fisiatras y evaluadores clínicos redactar informes médicos estructurados de pacientes derivados desde la cola de triage o buscados por DNI/nombre, incorporar campos dinámicos ad-hoc según la patología particular del paciente, contar con autoguardado reactivo para evitar pérdidas de información, y generar la impresión física institucional estandarizada en formato **A4 Vertical** con membrete oficial y pie de página institucional.

## 2. Objetivos Principales
1. **Selección y Vinculación Clínica:**
   - Selección ágil de pacientes en sala de espera derivados de triage (`en_espera`, `en_evaluacion`).
   - Búsqueda alternativa de pacientes por nombre o DNI.
   - Resumen visual inmediato con datos personales consolidados (Nombre, DNI, Edad, Celular, Fecha de ingreso, Apoderado si es menor de edad, Tipo de Consulta).
2. **Evaluación Médica Estructurada:**
   - Registro de campos clínicos base: Motivo de Consulta, Antecedentes Clínicos, Examen Físico / Evaluación Postural, Diagnóstico Médico (DX) y Plan Terapéutico / Indicaciones.
3. **Campos Dinámicos Ad-Hoc:**
   - Capacidad de añadir campos clínicos personalizados en caliente mediante "+ Agregar Campo" (ej. "Evaluación Postural Dinámica", "Rango Articular de Hombro", "Test Específico", etc.).
   - Soporte para edición, reordenamiento o eliminación de campos dinámicos sin recargar la página.
4. **Autoguardado Reactivo y Triage:**
   - Persistencia automática de los cambios en Cloud Firestore tras inactividad (*debounce* de 500 ms) o al desenfocar (`blur`), con indicador visual de estado (*"Guardando..."*, *"Sincronizado"*).
   - Capacidad de marcar la evaluación como finalizada, actualizando el estado de triage del paciente a `atendido`.
5. **Formato de Impresión Institucional A4 Vertical:**
   - Hoja de estilo adaptada con precisión milimétrica al estándar A4 Vertical (210 × 297 mm, márgenes de 12 mm).
   - Membrete oficial formal con la identidad corporativa de CEDO-REHAB EIRL (logo/cruz médica, razón social, RUC, ciudad Chiclayo).
   - Ocultamiento estricto de elementos de interfaz (barras laterales, botones, navegación, modales) durante la impresión (`@media print`).
   - Pie de página formal institucional con dirección de la clínica y zona para firma y sello del médico evaluador.

## 3. Arquitectura y Modelos

### 3.1. Modelo de Datos y Validación (`packages/shared`)
*   `CustomClinicalField`:
    *   `id`: string único (UUID o timestamp).
    *   `nombre`: string no vacío (ej. "Evaluación Postural Dinámica").
    *   `tipo`: `'texto' | 'texto_largo' | 'numero'`.
    *   `valor`: string con el contenido del campo.
*   `ClinicalHistory` / `ClinicalHistorySchema`:
    *   `id`: string opcional (ID de documento en Firestore).
    *   `pacienteId`: string obligatorio (referencia al paciente evaluado).
    *   `fechaEvaluacion`: string ISO o formato fecha (YYYY-MM-DD).
    *   `medicoEvaluador`: string opcional / nombre o identificador del evaluador.
    *   `motivoConsulta`: string.
    *   `antecedentes`: string opcional.
    *   `evaluacionFisica`: string opcional.
    *   `diagnostico`: string con el diagnóstico médico / DX.
    *   `planTratamiento`: string con las indicaciones terapéuticas recomendadas.
    *   `camposDinamicos`: array de `CustomClinicalField` (opcional o por defecto vacío).
    *   `createdAt`: string ISO timestamp.
    *   `updatedAt`: string ISO timestamp.

### 3.2. Capa de Servicios (`apps/web/src/services/historiaClinica.service.ts`)
*   `guardarHistoriaClinica(datos: ClinicalHistoryInput)`: Valida con Zod y persiste en Firestore (colección `historias_clinicas`).
*   `obtenerHistoriaClinicaPorPaciente(pacienteId: string)`: Obtiene la última historia clínica activa del paciente.
*   `suscribirHistoriaClinica(pacienteId: string, onUpdate, onError)`: Suscripción en tiempo real a los cambios de la ficha clínica.
*   `finalizarEvaluacionMedica(pacienteId: string, historiaId?: string)`: Actualiza el estado de triage del paciente a `atendido`.

### 3.3. Interfaz de Usuario (`apps/web/src/components/historia/`)
*   `SelectorPacienteHistoria.tsx`: Lista de pacientes en espera derivados de triage y barra de búsqueda por DNI o nombre.
*   `FormularioHistoriaClinica.tsx`: Formulario médico reactivo con los bloques clínicos principales, generador de campos dinámicos y debounce de autoguardado.
*   `ImpresionHistoriaA4.tsx`: Componente especializado para la vista de impresión en formato A4 Vertical institucional.
*   `ModuloHistoriaClinica.tsx`: Vista principal que unifica la selección de paciente, el formulario médico y las opciones de guardado e impresión.

## 4. Criterios de Aceptación
1. Al acceder al módulo "Historia Clínica (A4)", el profesional puede visualizar los pacientes en espera derivados desde triage o buscarlos por nombre/DNI.
2. Al seleccionar un paciente, sus datos consolidados (Nombre, DNI, Edad, Celular, Apoderado si aplica) se cargan inmediatamente en el encabezado de la ficha médica.
3. El médico puede agregar nuevos campos dinámicos ad-hoc haciendo clic en "+ Agregar Campo", especificando el nombre y tipo, pudiendo escribir observaciones de inmediato sin recargar la pantalla.
4. Los cambios realizados en el informe médico se guardan automáticamente en Cloud Firestore tras 500 ms de inactividad, mostrando el estado de sincronización visual.
5. Al hacer clic en "Imprimir Ficha (A4 Vertical)", se activa la impresión del navegador con el formato formal de hoja A4 Vertical, membrete y pie de página institucional de CEDO-REHAB EIRL, ocultando menús, botones y barras laterales.
6. Cobertura de pruebas unitarias superior al 80% en esquemas compartidos, servicios Firestore y componentes visuales.
