# Initial Concept

Creación del nuevo sistema "CEDO-REHAB Suite", una versión profesional, modular y escalable del sistema clínico que actualmente funciona en un único archivo index.html conectado a Firestore. El archivo index.html existente servirá como referencia para todas las reglas de negocio, modelos clínicos, flujos operativos y formatos de impresión.

### Contexto del Negocio y Dominio:
El sistema pertenece a la clínica de rehabilitación física CEDO-REHAB EIRL (Chiclayo, Perú). Maneja el ciclo completo del paciente: admisión, agendamiento de turnos, evaluación médica, prescripción de agentes físicos/terapias, control de sesiones/asistencia, cobros y boletas por paquete, inventario con auditorías semanales y caja diaria/mensual.

### Módulos Obligatorios:
1. Autenticación y Roles: Firebase Authentication con roles (Administrador, Recepción, Terapeuta y Médico).
2. Gestión de Pacientes: Registro con validación de edad (DNI de apoderado si < 18 años), historial de atenciones y derivaciones.
3. Agenda y Horarios: Matriz semanal (Lunes a Sábado) con slots de turnos, colores por especialidad/terapeuta, notas, feriados y capacidad de duplicar semanas sin superar los límites de tamaño de Firestore (subcolecciones por semana o mes).
4. Historia Clínica (A4 Vertical): Ficha médica con campos dinámicos personalizables e impresión estilizada A4.
5. Ficha de Tratamiento / Tarjetón (A6 / A5 / A4): Prescripción de agentes físicos (CHC, CHF, IR, US 1/3MHz, TENS, Láser, Magnetoterapia, etc.), ejercicios y técnicas de masoterapia, con guardado reactivo e impresión en formato A6 (tarjetón) y A4.
6. Asistencia y Paquetes: Manejo de múltiples paquetes por paciente (10-12 sesiones), checks de asistencia por sesión, control de boletas emitidas, pagos parciales/abonos y balance de saldos.
7. Inventario y Auditoría de Sábados: Control de stock físico y matriz de auditoría de los 4 sábados del mes.
8. Finanzas y Arqueo de Caja: Caja diaria en tiempo real, acumulado mensual y gráficas de ingresos.
9. Respaldos: Exportación multi-hoja a Excel (.xlsx) y backup/restore en JSON.

### Stack Tecnológico:
- Framework: Next.js (App Router) o React + Vite con TypeScript.
- Estilos y Componentes: Tailwind CSS + Lucide Icons + componentes modulares.
- Base de Datos: Firebase Firestore (v10 modular) con reglas de seguridad estrictas y modelo de datos normalizado.
- Autenticación: Firebase Auth.
- Gráficos y Reportes: Chart.js o Recharts, SheetJS (xlsx) para exportaciones.

---

# Guía del Producto: CEDO-REHAB Suite

## 1. Visión General del Producto
CEDO-REHAB Suite es una plataforma web integral de gestión clínica y administrativa diseñada a la medida de la clínica de rehabilitación física y fisioterapia **CEDO-REHAB EIRL** (Chiclayo, Perú). Su objetivo es modernizar y reemplazar el prototipo monolítico anterior, garantizando alta disponibilidad, seguridad de datos de pacientes, agilidad en la atención y cumplimiento de los flujos clínicos específicos del centro.

## 2. Usuarios Objetivo y Roles del Sistema (RBAC)
*   **Administrador / Dirección Médica:** Acceso total a reportes financieros, auditorías de inventario, gestión de usuarios/roles, respaldos generales y configuración tarifaria.
*   **Recepción / Admisión:** Registro de nuevos pacientes, agendamiento de turnos, control de caja diaria, cobro de paquetes/consultas y emisión de boletas.
*   **Médico Fisiatra / Evaluador:** Elaboración y firma de Historia Clínica (Informe Médico A4), diagnóstico (DX), determinación de pre/post-consulta y prescripción de tratamientos.
*   **Licenciado(a) en Fisioterapia:** Visualización de agenda diaria, llenado reactivo del Tarjetón de Tratamiento (A6/A4), aplicación de agentes físicos, masoterapia y marcado de asistencia de sesiones.

## 3. Módulos Funcionales y Reglas de Negocio Clave

### 3.1. Admisión y Gestión de Pacientes
*   Registro con campos obligatorios: Nombre completo, Edad, DNI, Celular y Fecha de Ingreso.
*   **Regla de Minoridad:** Si el paciente es menor de 18 años, el sistema exige obligatoriamente los datos del Apoderado (Nombre y DNI del responsable).
*   **Gestión de Consultas:** Marcación de Pre-consulta, Post-consulta o Sin Consulta, con registro de costo tarifario asociado (por defecto S/. 50.00).
*   Búsqueda predictiva ultrarrápida por Nombre o DNI.

### 3.2. Agenda y Horarios Semanales Multi-Terapeuta
*   Matriz interactiva de turnos de Lunes a Sábado, configurable por años (2026–2035) y meses.
*   Identificación visual por código de colores:
    *   *Fucsia:* Magnetoterapia
    *   *Melón:* Pediatría / Niños
    *   *Verde:* Adultos / Electroterapia
    *   *Amarillo:* Adultos Mayores
    *   *Azul:* Masoterapia / Descontracturantes
    *   *Anaranjado:* Consulta Médica
*   Herramientas de productividad: Copia de semana a la siguiente, duplicación hacia el mes siguiente, inserción dinámica de turnos y marcado de días feriados (rojo) o laborales (verde).
*   **Arquitectura de Datos Escalable:** Particionamiento de la agenda en subcolecciones independientes por semana para erradicar el límite de 1MB de Firestore del sistema anterior.

### 3.3. Historia Clínica e Informes Médicos (A4 Vertical)
*   Campos estructurados de evaluación: Motivo de consulta, Síntomas, Examen Físico, Diagnóstico y Plan de Tratamiento.
*   Constructor de campos personalizados dinámicos para agregar parámetros de evaluación ad-hoc.
*   Plantilla de impresión adaptada milimétricamente al estándar A4 Vertical institucional.

### 3.4. Ficha de Tratamiento / Tarjetón Terapéutico (A6 / A5 / A4)
*   Encabezado oficial CEDO-REHAB EIRL con distinción entre Asegurado y Particular.
*   Catálogo de prescripción con marcado rápido (checkbox tipo X):
    *   *Agentes Físicos:* CHC, CHF, IR, US 1 MHz, US 3 MHz, TENS, Interferencial, Magnetoterapia, Láser, Alto Voltaje, Terapia Combinada, Contraste.
    *   *Técnicas Manuales y Mecanoterapia:* Masoterapia Suave/Profunda, Colchoneta, Rueda de Hombro, Barras Paralelas, Bicicleta Estática, Escalera Rusa.
    *   *Cinesiterapia:* Ejercicios Williams, Wilson y métodos especializados.
*   Indicaciones médicas dinámicas en renglones expandibles.
*   Guardado reactivo con *debounce* y soporte de impresión en formato A6 (Tarjetón de fisioterapia), A5 y A4.

### 3.5. Control de Asistencia, Paquetes Terapéuticos y Cobranza
*   Gestión multi-paquete por paciente (Paquete 1, Paquete 2, etc.) típicamente de 10 a 12 sesiones.
*   Registro visual de asistencia sesión por sesión.
*   Control de boletas emitidas por terapia individual y por consulta médica.
*   Gestión de pagos y abonos fraccionados: costo total del paquete, suma de abonos, saldo restante en tiempo real y métodos de pago.

### 3.6. Inventario y Auditoría de 4 Sábados
*   Catálogo de insumos médicos con alertas de stock mínimo e imágenes de referencia.
*   Matriz de cuadre mensual estructurada en 4 sábados para auditorías físicas rutinarias.

### 3.7. Módulo Financiero y Caja en Tiempo Real
*   Arqueo de caja del día en tiempo real (consultas, sesiones, abonos a paquetes e ingresos manuales).
*   Consolidado mensual con gráficos analíticos de tendencia y comportamiento de ventas.

### 3.8. Respaldos y Migración
*   Exportación integral a Excel (.xlsx) con hojas dedicadas para Pacientes, Agenda, Asistencias, Finanzas e Inventario.
*   Generación y restauración de copias de seguridad en JSON.
*   Script de migración para importar de forma transparente la base de datos Firestore existente.
