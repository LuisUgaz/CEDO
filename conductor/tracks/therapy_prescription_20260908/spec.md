# Especificación Técnica: Prescripción Terapéutica y Tarjetón de Tratamiento (Formato A6 / A5 / A4)

## 1. Resumen Ejecutivo
Este track implementa el módulo operativo de **Prescripción Terapéutica y Emisión del Tarjetón de Fisioterapia** para **CEDO-REHAB EIRL** (Track 4). Permite a los médicos fisiatras y licenciados en fisioterapia prescribir agentes físicos, técnicas manuales, mecanoterapia y ejercicios terapéuticos mediante una interfaz reactiva con marcado de casillas de alto contraste tipo "X", autoguardado en tiempo real con *debounce* (500 ms) en Cloud Firestore, y emisión física del tarjetón institucional en formatos estandarizados: **A6 (Tarjetón de bolsillo 105 × 148 mm para cartulina de paciente)**, **A5 (Media hoja)** y **A4 (Hoja completa)**.

## 2. Objetivos Principales
1. **Catálogo Estructurado de Prescripción Fisioterapéutica:**
   - *Agentes Físicos:* CHC (Compresas Húmedo Calientes), CHF (Compresas Frías), IR (Infrarrojo), US 1 MHz, US 3 MHz, TENS, Interferencial, Magnetoterapia, Rayos Láser, Alto Voltaje, Terapia Combinada, Contraste.
   - *Técnicas Manuales y Mecanoterapia:* Masoterapia Suave, Masoterapia Profunda, Colchoneta, Rueda de Hombro, Barras Paralelas, Bicicleta Estática, Escalera Rusa.
   - *Cinesiterapia y Ejercicios:* Ejercicios Williams, Ejercicios Wilson, Otro Método.
2. **Interacción con Casillas Tipo "X" de Alto Contraste:**
   - Marcado ágil mediante clics donde la selección se representa visualmente con una "X" nítida de alto contraste, emulando la ficha física tradicional de fisioterapia.
3. **Autoguardado Reactivo con Debounce:**
   - Persistencia automática de los cambios en Cloud Firestore tras 500 ms de inactividad o pérdida de foco (`blur`), mostrando indicadores visuales (*"Guardando..."*, *"Guardado en la nube"*).
4. **Distinción de Modalidad y Número de Paquete:**
   - Encabezado oficial con distinción clara entre paciente `PARTICULAR` y `ASEGURADO`.
   - Control del número de paquete activo (Paquete 1, Paquete 2, etc.) y fecha de emisión.
   - Renglones de indicaciones médicas y terapéuticas dinámicamente expandibles.
5. **Soporte de Impresión Física Multi-Formato (@media print):**
   - **Formato A6 Tarjetón (105 × 148 mm):** Formato principal optimizado para cartulinas de mano que el paciente lleva a cada sesión.
   - **Formato A5 (148 × 210 mm):** Media hoja estándar.
   - **Formato A4 (210 × 297 mm):** Hoja completa para legajo de archivo clínico.
   - Encabezado institucional de CEDO-REHAB EIRL, datos del paciente, diagnóstico (DX), casillas [ X ] nítidas para cada agente, renglones de indicaciones y cuadrícula de control de sesiones asistidas (1 a 10/12 sesiones).

## 3. Arquitectura y Modelos

### 3.1. Modelo de Datos y Validación (`packages/shared`)
*   `TherapySheet` / `TherapySheetSchema`:
    *   `id`: string opcional (ID de documento en Firestore).
    *   `pacienteId`: string obligatorio.
    *   `numeroPaquete`: número entero positivo (por defecto 1).
    *   `fecha`: string con formato de fecha (YYYY-MM-DD).
    *   `tipoAtencion`: `'ASEGURADO' | 'PARTICULAR'`.
    *   `diagnostico`: string con el diagnóstico médico o motivo de tratamiento.
    *   `sesionNumero`: string opcional.
    *   `tecnicasSeleccionadas`: array de strings con los códigos o nombres de agentes y técnicas prescritas.
    *   `indicacionesAdicionales`: array de strings con las pautas terapéuticas particulares.
    *   `formatoImpresion`: `'a6' | 'a5' | 'a4-terapia'`.
    *   `updatedAt`: string timestamp ISO.

### 3.2. Capa de Servicios (`apps/web/src/services/tarjeton.service.ts`)
*   `guardarTarjetonTratamiento(datos: TherapySheetInput)`: Valida y persiste en Firestore en la colección `tarjetones_tratamiento`.
*   `obtenerTarjetonPorPaciente(pacienteId: string, numeroPaquete?: number)`: Recupera la ficha de tratamiento activa del paciente.
*   `suscribirTarjetonPorPaciente(pacienteId: string, onUpdate, onError)`: Suscripción en tiempo real a las prescripciones activas.

### 3.3. Interfaz de Usuario (`apps/web/src/components/terapia/`)
*   `CatalogoPrescripcion.tsx`: Grilla interactiva organizada por categorías clínicas con checkboxes tipo "X" de alto contraste.
*   `FormularioTarjeton.tsx`: Ficha interactiva de tratamiento con datos del paciente, selector de atención Asegurado/Particular, indicaciones expandibles y autoguardado reactivo con debounce.
*   `ImpresionTarjeton.tsx`: Componente de impresión multi-formato con soporte para dimensiones A6 (tarjetón), A5 y A4.
*   `ModuloTarjeton.tsx`: Vista principal integrada que permite seleccionar paciente, prescribir tratamientos e imprimir el tarjetón.

## 4. Criterios de Aceptación
1. Al seleccionar un paciente, el sistema carga de inmediato su tarjetón de tratamiento o inicializa uno nuevo con su diagnóstico.
2. Al hacer clic en cualquier casilla de agente físico o técnica manual, esta se marca instantáneamente con una "X" visible de alto contraste.
3. Tras 500 ms de inactividad, los cambios se sincronizan en Cloud Firestore mostrando el estado de guardado reactivo.
4. El usuario puede agregar renglones de indicaciones terapéuticas adicionales.
5. El sistema permite seleccionar el formato de impresión (A6, A5 o A4) y al pulsar "Imprimir Ficha de Terapia", el navegador abre la vista previa respetando las dimensiones milimétricas exactas de la cartulina/hoja seleccionada.
6. Cobertura de pruebas unitarias superior al 80% en componentes, esquemas y servicios.
