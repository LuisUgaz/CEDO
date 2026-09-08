# Pautas de Diseño y Experiencia de Usuario: CEDO-REHAB Suite

## 1. Principios de Experiencia de Usuario (UX)
*   **Eficiencia en Consultorio:** Interfaces diseñadas para mínima fricción. Cada segundo que el fisioterapeuta o recepcionista pasa registrando datos es tiempo restado a la atención del paciente. Formularios directos, autoenfoque y soporte para navegación con teclado.
*   **Alta Densidad de Información:** Visualización compacta (escalas de texto entre 10px y 14px) que permite consultar semanas de agenda, historiales de tratamientos y asistencias sin scroll vertical excesivo.
*   **Feedback Visual Inmediato y No Invasivo:** Indicadores de estado de sincronización reactiva (*"Guardando..."*, *"Sincronizado"*, *"Sin conexión"*), toasts discretos para confirmaciones y badges de conteo dinámicos.
*   **Autoguardado Reactivo con Debounce:** En fichas de tratamiento, historias clínicas y notas de agenda, los cambios se persisten automáticamente (500ms tras dejar de escribir o en evento `blur`) previniendo pérdida de datos por cierres imprevistos.

## 2. Identidad Visual y Paleta Cromática
*   **Colores Base Institucionales:**
    *   *Primario / Acento:* Esmeralda (`#059669` / `#10b981`) representando salud, rehabilitación y calma.
    *   *Fondo y Superficies:* Slate (`#f8fafc`, `#f1f5f9`) para fondos y `#ffffff` para tarjetas elevadas con sombras sutiles.
    *   *Navegación y Estructura:* Slate Oscuro (`#0f172a`, `#1e293b`) para sidebar y barras de navegación, brindando alto contraste y elegancia profesional.
*   **Código de Colores Clínico de CEDO-REHAB (Consistente con la operación actual):**
    *   *Fucsia (`#f3e8ff` fondo / `#581c87` texto):* Pacientes de Magnetoterapia.
    *   *Melón (`#fde2e4` fondo / `#6e4450` texto):* Fisioterapia Pediátrica / Niños.
    *   *Verde (`#d8f3dc` fondo / `#1b4332` texto):* Adultos / Electroterapia.
    *   *Amarillo (`#fef9c3` fondo / `#713f12` texto):* Geriatría / Adultos Mayores.
    *   *Azul (`#e0f2fe` fondo / `#0369a1` texto):* Masoterapia y Fisioterapia Descontracturante.
    *   *Anaranjado (`#ffedd5` fondo / `#9a3412` texto):* Evaluación y Consulta Médica.
    *   *Rojo Alerta (`#f87171` fondo / `#ffffff` texto):* Feriados no laborables.
    *   *Verde Operativo (`#10b981`):* Boleta emitida / Asistencia confirmada.

## 3. Tipografía y Jerarquía
*   **Tipografía Primaria:** Inter o Geist Sans (fuente de alta legibilidad en pantallas de baja y alta densidad).
*   **Pesos y Tamaños:**
    *   Títulos de módulos: Bold / Extrabold (16px a 18px).
    *   Subtítulos y nombres de paciente: Semibold (12px a 14px).
    *   Datos tabulares y celdas de agenda: Medium (11px a 12px).
    *   Metadatos, timestamps y badges: Bold (9px a 10px en mayúsculas sostenidas).

## 4. Estándares de Impresión Física (@media print)
*   **Historia Clínica / Informe Médico (A4 Vertical):**
    *   Dimensiones exactas de hoja A4 (210 × 297 mm) con márgenes limpios de 12mm.
    *   Ocultamiento automático de sidebars, barras de navegación y controles interactivos.
    *   Membrete formal de CEDO-REHAB EIRL y pie de página institucional con la dirección clínica oficial.
*   **Tarjetón de Tratamiento Fisioterapéutico (A6 / A5 / A4):**
    *   Formato primario: A6 Horizontal/Vertical (105 × 148 mm), optimizado para fichas de mano o tarjetones de cartulina de los pacientes.
    *   Soporte alternativo seleccionable en 1 clic para A5 (media hoja) o A4 completo.
    *   Cajas de checkbox marcadas con "X" nítidas en negro para trazabilidad médica.

## 5. Prevención de Errores y Seguridad Clínica
*   Modales de confirmación con doble validación para eliminación de pacientes, anulación de pagos o reseteo de paquetes.
*   Validación estricta de formularios: advertencia en tiempo real si se intenta registrar a un menor de 18 años sin datos de apoderado.
*   Persistencia offline con IndexedDB para evitar interrupciones de trabajo ante caídas momentáneas de internet.
