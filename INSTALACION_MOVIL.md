# 📱 ControlMiles - Guía de Instalación Móvil

## 🚀 Inicio Rápido: Instala en Tu Teléfono (Listo para Producción)

ControlMiles es una **Progressive Web App (PWA)** que funciona como una app nativa en tu teléfono. Sigue estos pasos para instalarla en Android o iOS.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener:
- ✅ Un smartphone (Android 5.0+ o iOS 11.4+)
- ✅ Conexión a internet (solo necesaria para la instalación inicial)
- ✅ Un navegador moderno (Chrome, Safari, Firefox, o Edge)

---

## 🌐 Opción 1: Desplegar en Netlify (Recomendado - GRATIS)

### **Paso 1: Despliega Tu App**

1. **Ve a Netlify:**
   - Visita: https://app.netlify.com/
   - Haz clic en "Add new site" → "Deploy manually"

2. **Prepara Tu App:**
   ```bash
   # Construye la app para producción
   npm run build
   ```

3. **Arrastra y Suelta:**
   - Arrastra la carpeta completa `dist` a la zona de Netlify
   - Espera 30-60 segundos para el despliegue
   - Copia la URL (ej: `https://tu-app.netlify.app`)

### **Paso 2: Instalar en Android**

1. **Abre en Chrome:**
   - Abre Chrome en tu teléfono Android
   - Pega la URL de Netlify
   - Espera a que cargue la app

2. **Instala la App:**
   - Toca el **menú de 3 puntos** (⋮) arriba a la derecha
   - Selecciona **"Agregar a pantalla de inicio"** o **"Instalar app"**
   - Toca **"Instalar"** o **"Agregar"**
   - El ícono de la app aparecerá en tu pantalla de inicio

3. **Otorga Permisos:**
   - Abre la app desde tu pantalla de inicio
   - Cuando se solicite, permite:
     - ✅ **Ubicación** - para rastreo GPS
     - ✅ **Cámara** - para fotos del odómetro
     - ✅ **Movimiento y Actividad** - para rastreo automático

### **Paso 3: Instalar en iOS/iPhone**

1. **Abre en Safari:**
   - Abre Safari en tu iPhone
   - Pega la URL de Netlify
   - Espera a que cargue la app

2. **Instala la App:**
   - Toca el **botón Compartir** (□↑) en la parte inferior
   - Desplázate hacia abajo y toca **"Añadir a pantalla de inicio"**
   - Toca **"Añadir"** arriba a la derecha
   - El ícono de la app aparecerá en tu pantalla de inicio

3. **Otorga Permisos:**
   - Abre la app desde tu pantalla de inicio
   - Cuando se solicite, permite:
     - ✅ **Ubicación** - para rastreo GPS
     - ✅ **Cámara** - para fotos del odómetro
     - ✅ **Movimiento y Actividad** - para rastreo automático

---

## 🔥 Opción 2: Desplegar en Vercel (Alternativa - GRATIS)

### **Paso 1: Desplegar en Vercel**

1. **Instala Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Despliega:**
   ```bash
   # Desde la raíz de tu proyecto
   vercel --prod
   ```

3. **Copia la URL** (ej: `https://tu-app.vercel.app`)

### **Paso 2: Instalar en el Teléfono**
- Sigue los mismos pasos de instalación que Netlify (Android o iOS arriba)

---

## 🏠 Opción 3: Prueba Local (Sin Internet Requerido)

Si quieres probar la app localmente en tu teléfono sin desplegar:

### **Paso 1: Inicia el Servidor de Desarrollo**

```bash
# En tu computadora
npm run dev
```

### **Paso 2: Encuentra Tu Dirección IP Local**

**En Windows:**
```bash
ipconfig
# Busca "Dirección IPv4" (ej: 192.168.1.100)
```

**En Mac/Linux:**
```bash
ifconfig | grep "inet "
# Busca tu IP local (ej: 192.168.1.100)
```

### **Paso 3: Accede Desde el Teléfono**

1. **Asegúrate de que tu teléfono y computadora estén en la misma red WiFi**
2. **Abre el navegador en tu teléfono:**
   - Ve a: `http://TU_IP:5173`
   - Ejemplo: `http://192.168.1.100:5173`
3. **Sigue los pasos de instalación** (Agregar a pantalla de inicio)

---

## 🔧 Solución de Problemas

### **Opción "Agregar a pantalla de inicio" no aparece (Android)**

**Solución:**
- Asegúrate de usar el navegador **Chrome**
- Verifica que la app haya cargado completamente
- Intenta refrescar la página (desliza hacia abajo)
- Limpia caché del navegador: Configuración → Privacidad → Borrar datos de navegación

### **Opción "Añadir a pantalla de inicio" no aparece (iOS)**

**Solución:**
- Asegúrate de usar el navegador **Safari** (NO Chrome)
- iOS requiere Safari para instalación de PWA
- Asegúrate de tocar el botón Compartir (□↑) en la **parte inferior** de la pantalla

### **App no funciona sin conexión**

**Solución:**
- Abre la app al menos una vez con conexión a internet
- El service worker necesita cachear archivos en la primera carga
- Después de la primera carga, la app funcionará 100% sin conexión

### **Permiso de ubicación denegado**

**Android:**
- Configuración → Apps → ControlMiles → Permisos → Ubicación → Permitir
- Para rastreo en segundo plano: Selecciona "Permitir todo el tiempo"

**iOS:**
- Configuración → Privacidad → Servicios de ubicación → ControlMiles → "Mientras se usa" o "Siempre"

### **Cámara no funciona**

**Android:**
- Configuración → Apps → ControlMiles → Permisos → Cámara → Permitir

**iOS:**
- Configuración → Privacidad → Cámara → Habilitar para Safari (o tu navegador)

---

## ✅ Lista de Verificación para Producción

### **La App Está Lista Para:**

- ✅ **Uso Sin Conexión** - Funciona 100% sin internet
- ✅ **Rastreo GPS Real** - Usa GPS del dispositivo para millaje preciso
- ✅ **Integración con Cámara** - Captura fotos del odómetro
- ✅ **Almacenamiento Local** - Todos los datos guardados de forma segura en el dispositivo
- ✅ **Multiidioma** - 7 idiomas soportados
- ✅ **Cumplimiento IRS** - Registros audit-ready con hash SHA-256
- ✅ **Registros Inmutables** - Millas originales nunca cambiadas, solo corregidas

### **Sin Datos Ficticios:**

- ❌ Sin datos de prueba
- ❌ Sin coordenadas GPS falsas
- ❌ Sin llamadas API ficticias
- ❌ Sin datos de ejemplo
- ✅ Listo para producción desde el día uno

---

## 📊 Uso en el Mundo Real

### **Inicia Tu Primer Turno:**

1. **Abre la app** desde tu pantalla de inicio
2. **Captura foto inicial del odómetro**
   - Toca el botón "Capture"
   - Toma foto clara de tu odómetro
   - Ingresa la lectura de millaje actual
3. **Selecciona tu app gig**
   - Elige: Uber, Lyft, DoorDash, etc.
4. **Otorga permisos** (Ubicación, Cámara, Movimiento)
5. **Inicia rastreo**
   - Toca "Start Tracking"
   - Guarda el teléfono en el bolsillo/soporte
   - Conduce tu turno
6. **Detén rastreo** cuando termines
7. **Ve tus ganancias y millas** en el Dashboard

### **Ver Historial:**

- Toca "View History" para ver todos los turnos pasados
- Cada día muestra: millas conducidas, ingreso ganado, deducción IRS
- Todos los registros están firmados criptográficamente (SHA-256)

### **Exportar para Impuestos:**

- Ve a la pantalla Export
- Selecciona rango de fechas
- Descarga PDF, CSV, o JSON
- Envía a tu contador o al IRS

---

## 🔐 Privacidad y Seguridad

### **100% Local:**
- ✅ Todos los datos almacenados SOLO en TU dispositivo
- ✅ Sin datos enviados a servidores externos
- ✅ No se requiere cuenta
- ✅ No se necesita inicio de sesión
- ✅ Totalmente sin conexión después de la primera carga

### **Cifrado:**
- ✅ Hash SHA-256 para integridad de datos
- ✅ Registros a prueba de manipulación
- ✅ Rastro de auditoría para todas las correcciones

### **Cumplimiento IRS:**
- ✅ Logs GPS con marcas de tiempo
- ✅ Evidencia fotográfica del odómetro
- ✅ Registros originales inmutables
- ✅ Correcciones documentadas

---

## 📱 Dispositivos Compatibles

### **Android:**
- ✅ Android 5.0 (Lollipop) y más reciente
- ✅ Chrome 45+
- ✅ Firefox 44+
- ✅ Edge 79+

### **iOS:**
- ✅ iOS 11.4 y más reciente
- ✅ Safari 11.1+
- ✅ iPhone 5S y más reciente
- ✅ iPad Air y más reciente

---

## 🚗 Apps Gig Soportadas

La app soporta rastreo para **11 plataformas gig:**

1. 🚗 **Uber** - Transporte compartido
2. 🚙 **Lyft** - Transporte compartido
3. 🍔 **DoorDash** - Entrega de comida
4. 🍕 **UberEats** - Entrega de comida
5. 🥡 **Grubhub** - Entrega de comida
6. 🛒 **Instacart** - Entrega de comestibles
7. 📦 **Postmates** - Entrega general
8. 💪 **Empower** - Plataforma gig
9. 📦 **Amazon Flex** - Entrega de paquetes
10. 🚕 **Taxi** - Taxi tradicional (con app)
11. 🚶‍♂️ **Personal Commute** - Viaje de trabajo

---

## 💡 Consejos para Mejores Resultados

### **Precisión GPS:**
- ✅ Activa modo "Alta precisión" en configuración de Ubicación
- ✅ Mantén el teléfono cerca de ventana o parabrisas
- ✅ Espera 30 segundos después de iniciar para bloqueo GPS
- ✅ Evita fundas de teléfono de metal grueso (bloquean GPS)

### **Optimización de Batería:**
- ⚠️ Desactiva optimización de batería para ControlMiles
- **Android:** Configuración → Apps → ControlMiles → Batería → Sin restricciones
- **iOS:** El Modo de Bajo Consumo puede pausar rastreo en segundo plano

### **Consejos de Cámara:**
- ✅ Toma fotos del odómetro con buena iluminación
- ✅ Captura todo el tablero para contexto
- ✅ Asegúrate de que los números sean claramente visibles
- ✅ Toma fotos desde el mismo ángulo cada vez

### **Respaldo de Datos:**
- ✅ Exporta datos regularmente (semanal recomendado)
- ✅ Guarda exportaciones en la nube (Google Drive, iCloud, Dropbox)
- ✅ Mantén 3 copias: Teléfono, Nube, Computadora
- ⚠️ Borrar datos del navegador ELIMINA todos los registros

---

## 🎯 Próximos Pasos

### **Después de la Instalación:**

1. ✅ Prueba la app durante un viaje corto (5-10 minutos)
2. ✅ Verifica que el rastreo GPS esté funcionando
3. ✅ Captura foto de prueba del odómetro
4. ✅ Revisa Configuración y configura el idioma si es necesario
5. ✅ Establece tu tarifa de millaje preferida
6. ✅ ¡Comienza a rastrear tu primer turno real!

### **Para Uso en Producción:**

1. ✅ Usa diariamente para todo trabajo gig
2. ✅ Captura fotos del odómetro al inicio/fin de cada turno
3. ✅ Revisa y reconcilia datos semanalmente
4. ✅ Exporta mensualmente para mantener registros
5. ✅ Mantén exportaciones respaldadas en la nube

---

## 🎉 ¡Estás Listo!

ControlMiles ahora está instalado en tu teléfono y listo para uso en producción. La app es:

- ✅ 100% funcional (sin datos ficticios)
- ✅ Lista para producción
- ✅ Primero sin conexión
- ✅ Cumple con IRS
- ✅ Enfocada en privacidad
- ✅ Totalmente cifrada

**¡Comienza a rastrear tu primer turno y maximiza tus deducciones fiscales!** 🚗💰

---

**Construido para conductores gig, por desarrolladores que se preocupan por tu privacidad** 🔒
