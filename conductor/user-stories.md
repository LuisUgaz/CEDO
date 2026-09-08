# Especificación de Historias de Usuario (Formato Gherkin): CEDO-REHAB Suite

Este documento contiene la especificación formal de todas las historias de usuario del sistema en formato Gherkin (Dado que / Cuando / Entonces), estructuradas de forma secuencial donde cada módulo habilita e interactúa con el siguiente.

---

## Módulo 1: Autenticación, Seguridad y Roles (RBAC)

### Historia 1.1: Inicio de Sesión y Asignación de Roles
* **Como** miembro del personal de CEDO-REHAB (Recepcionista, Fisioterapeuta, Médico o Administrador).
* **Quiero** iniciar sesión con mi correo electrónico institucional y contraseña segura.
* **Para** acceder a las herramientas y datos clínicos autorizados según mis responsabilidades.

```gherkin
Característica: Inicio de Sesión y Roles de Usuario
  Escenario: Inicio de sesión exitoso de recepcionista
    Dado que el usuario se encuentra en la pantalla de inicio de sesión de CEDO-REHAB
    Y existe una cuenta activa con correo "recepcion@cedorehab.pe" y rol "recepcion"
    Cuando introduce su correo y su contraseña correcta
    Y hace clic en "Ingresar al Sistema"
    Entonces el sistema valida las credenciales en Firebase Authentication
    Y redirige al usuario al panel de "Registro y Agenda de Pacientes"
    Y bloquea el acceso a las funciones exclusivas de "Dirección / Finanzas Avanzadas".

  Escenario: Acceso restringido por credenciales inválidas
    Dado que el usuario ingresa un correo o contraseña incorrecta
    Cuando hace clic en "Ingresar al Sistema"
    Entonces el sistema no concede acceso
    Y muestra un mensaje visible: "Credenciales incorrectas. Intente nuevamente".
```

---

## Módulo 2: Admisión, Registro y Triage de Pacientes

### Historia 2.1: Registro de Paciente Menor de Edad con Apoderado Obligatorio
* **Como** personal de recepción.
* **Quiero** registrar a un paciente menor de 18 años exigiendo los datos de su apoderado.
* **Para** cumplir con la legislación sanitaria y asegurar la autorización legal del tratamiento.

```gherkin
Característica: Registro de Paciente con Regla de Minoridad
  Escenario: Detección automática y obligatoriedad de datos de apoderado
    Dado que el recepcionista está en el formulario de "Registro de Paciente"
    Cuando ingresa un paciente con "Edad" menor a 18 años (ej. 12 años)
    Entonces el sistema despliega automáticamente y en color de advertencia el campo "DNI de Apoderado"
    Y deshabilita el botón "Registrar y Derivar" si el campo "DNI de Apoderado" se encuentra vacío.

  Escenario: Registro exitoso de paciente menor de edad
    Dado que el campo "DNI de Apoderado" contiene un DNI válido de 8 dígitos
    Y se completaron los datos del menor (Nombre, DNI, Celular de contacto)
    Cuando el recepcionista selecciona la opción de consulta "PRE-CONSULTA" con costo "S/. 50.00"
    Y pulsa "Registrar y Derivar"
    Entonces el sistema guarda el nuevo paciente en la colección "pacientes" de Firestore
    Y lo coloca en la lista de "Pacientes / Fichas en Espera" para evaluación médica.
```

---

## Módulo 3: Historia Clínica y Evaluación Médica (A4 Vertical)

### Historia 3.1: Elaboración de Historia Clínica e Inserción de Campos Dinámicos
* **Como** Médico Fisiatra o Evaluador de CEDO-REHAB.
* **Quiero** redactar el informe médico inicial y añadir campos de evaluación específicos.
* **Para** documentar la patología del paciente y prescribir con precisión el plan rehabilitador.

```gherkin
Característica: Ficha e Historia Clínica General (A4 Vertical)
  Escenario: Creación de campos clínicos dinámicos ad-hoc
    Dado que el médico selecciona al paciente derivado desde la lista de "Fichas en Espera"
    Y la ficha muestra los datos personales consolidados (Nombre, DNI, Edad, Celular)
    Cuando el médico hace clic en "+ Agregar Campo"
    Y define el nombre de campo "Evaluación Postural Dinámica" con tipo "Texto Extenso"
    Entonces el formulario genera inmediatamente el nuevo recuadro clínico
    Y permite escribir las observaciones médicas sin recargar la página.

  Escenario: Impresión médica formal en hoja A4
    Dado que el médico ha completado el Diagnóstico (DX) y las indicaciones
    Cuando hace clic en "Imprimir Ficha (A4 Vertical)"
    Entonces el sistema aplica la hoja de estilo de impresión A4
    Y oculta los paneles de navegación, menús laterales e indicadores interactivos
    Y muestra el membrete oficial y pie de página institucional de CEDO-REHAB EIRL.
```

---

## Módulo 4: Prescripción Terapéutica y Tarjetón de Tratamiento (A6 / A5 / A4)

### Historia 4.1: Prescripción de Agentes Físicos y Autoguardado Reactivo
* **Como** Médico Evaluador o Fisioterapeuta.
* **Quiero** seleccionar los agentes físicos y técnicas de ejercicios en la ficha de tratamiento.
* **Para** emitir el tarjetón de fisioterapia con guardado en tiempo real sin riesgo de pérdida de datos.

```gherkin
Característica: Tarjetón de Fisioterapia y Prescripción
  Escenario: Marcación de agentes físicos con guardado reactivo
    Dado que el profesional visualiza la ficha de tratamiento del paciente
    Cuando hace clic sobre las casillas de "CHC", "TENS", "LÁSER" y "MASOTERAPIA PROFUNDA"
    Entonces las casillas se marcan con una "X" visible de alto contraste
    Y tras 500 ms de inactividad (debounce) el sistema sincroniza los cambios en Firestore
    Y el indicador de estado muestra "Guardado en la nube".

  Escenario: Emisión de Tarjetón de Tratamiento en Formato A6
    Dado que la ficha de tratamiento tiene el diagnóstico y los agentes asignados
    Y se ha seleccionado el formato de impresión "A6 (105 × 148 mm - Tarjetón)"
    Cuando el usuario pulsa "Imprimir Ficha de Terapia"
    Entonces el navegador abre la vista previa dimensionada en proporción A6 para cartulina de paciente.
```

---

## Módulo 5: Matriz de Agenda y Turnos Semanales

### Historia 5.1: Agendamiento por Colores de Especialidad y Duplicación de Semanas
* **Como** Recepcionista o Terapeuta en sala.
* **Quiero** ubicar al paciente en un turno semanal asociándolo a su color de especialidad.
* **Para** organizar los horarios de los consultorios y duplicar semanas estándar con rapidez.

```gherkin
Característica: Agenda Semanal Multi-Terapeuta y Código de Colores
  Escenario: Asignación de turno con color distintivo de rehabilitación
    Dado que el usuario está en la vista "Horario y Agenda" para la semana seleccionada
    Cuando selecciona una celda horaria (ej. Miércoles 10:00 AM)
    Y asigna al paciente asociando la categoría "Fucsia (Magnetoterapia)"
    Entonces la celda se pinta con el fondo `#f3e8ff` y texto `#581c87`
    Y el turno se guarda en la subcolección semanal correspondiente en Firestore evitando saturar documentos.

  Escenario: Duplicación de semana completa hacia la siguiente
    Dado que una semana contiene todos los turnos y terapias habituales programados
    Cuando el recepcionista pulsa "Copiar a Semana Siguiente" y confirma la acción
    Entonces el sistema replica los bloques de horarios y pacientes a la semana consecutiva
    Y mantiene los feriados o días no laborables claramente diferenciados en color rojo.
```

---

## Módulo 6: Control de Asistencia, Paquetes de Sesiones y Boletas

### Historia 6.1: Marcado de Sesiones, Emisión de Boletas y Control de Saldos
* **Como** Recepcionista o Administrador.
* **Quiero** marcar la asistencia de cada sesión (1 a 10/12) y registrar los abonos de pago.
* **Para** emitir boletas de venta y controlar el saldo pendiente de cada paquete terapéutico.

```gherkin
Característica: Control de Asistencia, Boletas y Liquidación de Paquetes
  Escenario: Marcado de asistencia individual y actualización del paquete
    Dado que el paciente tiene activo el "Paquete 1" con costo de S/. 350.00
    Cuando el paciente asiste a su sesión número 3 y el recepcionista pulsa el círculo "3"
    Entonces el botón de asistencia cambia a color azul (#2563eb) con estado "Asistió"
    Y el contador de sesiones completadas avanza a "3 / 10".

  Escenario: Registro de abono parcial y emisión de boleta
    Dado que el costo del paquete es S/. 350.00 y los abonos previos suman S/. 150.00
    Cuando el recepcionista registra un abono de S/. 100.00 en efectivo
    Y marca el botón de "Boleta Emitida"
    Entonces el total pagado se actualiza a S/. 250.00 y el saldo pendiente a S/. 100.00
    Y el abono genera una transacción automática hacia la Caja Diaria en tiempo real.
```

---

## Módulo 7: Módulo Web Móvil / PWA para Fisioterapeutas a Pie de Camilla

### Historia 7.1: Consulta a Pie de Camilla y Marcado Rápido de Sesión
* **Como** Fisioterapeuta en la sala de rehabilitación desde un dispositivo móvil o tablet (PWA).
* **Quiero** ver mi lista de pacientes del día y marcar la asistencia directamente en camilla.
* **Para** no desplazarme hasta recepción y asegurar trazabilidad médica inmediata.

```gherkin
Característica: Módulo Web Móvil / PWA de Fisioterapia
  Escenario: Visualización de pacientes del turno y prescripción en sala
    Dado que el terapeuta inicia sesión en la aplicación web responsiva (PWA)
    Cuando abre la vista móvil "Mis Pacientes de Hoy"
    Entonces observa la tarjeta de cada paciente con su diagnóstico y agentes físicos prescritos
    Y al tocar sobre "Marcar Asistencia", la sesión se actualiza instantáneamente en la base de datos clínica.
```

---

## Módulo 8: Finanzas, Arqueo de Caja y Gráficos en Tiempo Real

### Historia 8.1: Arqueo de Caja del Día y Acumulado Mensual
* **Como** Administrador o Encargado de Caja.
* **Quiero** visualizar el flujo de ingresos en tiempo real clasificados por consulta médica y terapias.
* **Para** cerrar la caja diaria sin descuadres y monitorear el comportamiento mensual.

```gherkin
Característica: Finanzas y Arqueo de Caja
  Escenario: Cuadre automático de caja en tiempo real
    Dado que se han cobrado S/. 50.00 de una consulta y S/. 250.00 en abonos de paquetes durante el día
    Cuando el usuario ingresa al módulo de "Finanzas"
    Entonces el recuadro "Caja de Hoy" totaliza de forma inmediata "S/. 300.00"
    Y desglosa cada movimiento con hora, nombre del paciente y método de pago.

  Escenario: Representación gráfica de tendencias de ingresos
    Dado que se selecciona el mes en curso en el módulo financiero
    Cuando se carga la vista de analítica
    Entonces el gráfico interactivo renderiza las barras de recaudación diaria
    Y calcula el "Total Acumulado del Mes" para toma de decisiones directivas.
```

---

## Módulo 9: Inventario Clínico y Auditoría de los 4 Sábados

### Historia 9.1: Auditoría Semanal de Cuadre de Existencias
* **Como** Administrador o Jefe de Terapia.
* **Quiero** registrar el conteo físico de insumos en los 4 sábados de cada mes.
* **Para** prevenir pérdidas de materiales médicos y planificar compras oportunamente.

```gherkin
Característica: Inventario y Rencuentro de 4 Sábados
  Escenario: Registro de auditoría del segundo sábado del mes
    Dado que el auditor revisa la matriz de "Rencuentro de Inventario" para el mes activo
    Cuando realiza el conteo físico del artículo "Gel conductor 1L" y anota "8 unidades" en la columna "Sábado 2"
    Entonces el valor queda registrado en la matriz mensual de Firestore
    Y calcula la discrepancia respecto al stock teórico del catálogo.
```

---

## Módulo 10: Respaldos, Exportación Multi-Hoja y Migración

### Historia 10.1: Exportación Integral a Excel y Respaldo JSON
* **Como** Administrador de CEDO-REHAB.
* **Quiero** exportar la base de datos a un libro Excel (.xlsx) con pestañas independientes y respaldos JSON.
* **Para** disponer de copias de seguridad portátiles y cumplir auditorías administrativas.

```gherkin
Característica: Respaldos y Exportación de Datos
  Escenario: Generación de Excel multi-pestaña con SheetJS
    Dado que el sistema cuenta con registros en pacientes, agenda, asistencias y finanzas
    Cuando el administrador hace clic en "Exportar a Excel (.xlsx)"
    Entonces el sistema genera y descarga un archivo `.xlsx` con hojas tituladas:
      | Pacientes | Asistencias | Agenda | Finanzas | Inventario |
    Y cada hoja contiene sus encabezados estilizados y datos formateados.
```
