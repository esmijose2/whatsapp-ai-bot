# 🤖 Bot de WhatsApp con IA

Bot de WhatsApp 24/7 con inteligencia artificial completamente GRATIS.

## ✨ Características

- 🆓 100% Gratuito
- 🤖 Inteligencia artificial (Groq)
- 💬 Mantiene contexto de conversación
- 🌐 Funciona 24/7 en la nube
- ⚡ Respuestas rápidas

## 🚀 Cómo usar

Envía un mensaje a tu número de WhatsApp:
```
!bot ¿Qué es la inteligencia artificial?
```

El bot responderá:
```
@bot

La inteligencia artificial es...
```

## 🛠️ Tecnología

- Node.js
- whatsapp-web.js
- Groq AI
- Render (hosting)
- Express

## 📝 Comandos

- `!bot [pregunta]` - Hacer una pregunta al bot

## 🔧 Estado

✅ Funcionando en: [Render](https://render.com)
```

4. **Scroll abajo** → **"Commit changes"** → **"Commit changes"**

---

### ✅ CHECKPOINT 1

**Verifica que tienes estos 4 archivos en tu repositorio:**
- ✅ `package.json`
- ✅ `index.js`
- ✅ `.gitignore`
- ✅ `README.md`

**Si todo está ✅, continúa al Paso 3**

---

# PASO 3: OBTENER API KEY DE GROQ

## ¿Qué es Groq?
Es una empresa que ofrece IA **GRATIS** para que tu bot sea inteligente.

## 🔷 Instrucciones:

1. **Abre una nueva pestaña** y ve a: https://console.groq.com/

2. **Haz clic en "Sign Up"** (o "Start Building")

3. **Regístrate con:**
   - **Opción 1:** Email y contraseña
   - **Opción 2:** Cuenta de Google (más rápido)

4. **Completa la verificación** si te la pide

5. **Una vez dentro**, verás el dashboard de Groq

6. **En el menú lateral izquierdo**, haz clic en **"API Keys"**

7. **Haz clic en "Create API Key"** (botón azul)

8. **Dale un nombre:**
```
   whatsapp-bot
```

9. **Haz clic en "Submit"**

10. **¡IMPORTANTE! COPIA LA API KEY** 📋
    - Se ve así: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
    - **SOLO SE MUESTRA UNA VEZ**
    - Guárdala en un lugar seguro (Notepad, Notes, etc.)

11. **Si la perdiste:**
    - Elimina la key antigua
    - Crea una nueva

---

### ✅ CHECKPOINT 2

**Tienes tu API key guardada?**
- ✅ Sí, la tengo copiada → Continúa
- ❌ No → Vuelve al punto 7 y créala de nuevo

---

# PASO 4: DESPLEGAR EN RENDER

## ¿Qué es Render?
Un servicio que ejecuta tu bot 24/7 en la nube **GRATIS**.

## 🔷 Instrucciones:

### 4.1 Crear cuenta

1. **Ve a:** https://render.com/

2. **Haz clic en "Get Started"**

3. **Selecciona "Sign up with GitHub"**

4. **Autoriza Render** a acceder a tu cuenta de GitHub
   - Haz clic en "Authorize Render"

5. **¡Cuenta creada!** Verás el dashboard de Render

---

### 4.2 Crear Web Service

1. **En el dashboard**, haz clic en **"New +"** (botón azul arriba a la derecha)

2. **Selecciona "Web Service"**

3. **Haz clic en "Build and deploy from a Git repository"**

4. **Haz clic en "Next"**

5. **Conectar repositorio:**
   - Verás una lista de tus repositorios
   - Busca `whatsapp-bot-ia`
   - Haz clic en **"Connect"** al lado de ese repositorio

---

### 4.3 Configurar el servicio

**Ahora verás un formulario. Llénalo así:**

📝 **Name:** `whatsapp-bot` (o el nombre que quieras)

🌎 **Region:** Selecciona el más cercano a ti:
- Para México/Latinoamérica: `Oregon (US West)`
- Para España/Europa: `Frankfurt (EU Central)`

🔀 **Branch:** `main` (déjalo como está)

📁 **Root Directory:** (déjalo vacío)

⚙️ **Runtime:** `Node`

🔨 **Build Command:** 
```
npm install
```

▶️ **Start Command:**
```
npm start
```

💰 **Instance Type:** Selecciona **"Free"** ⭐
   - Dice: "Free - 750 hours/month"
   - **Importante:** Asegúrate que esté en FREE

---

### 4.4 Agregar variable de entorno (API KEY)

1. **Scroll hacia abajo** hasta ver **"Environment Variables"**

2. **Haz clic en "Add Environment Variable"**

3. **Llena así:**
   - **Key:** `GROQ_API_KEY`
   - **Value:** (pega tu API key de Groq que copiaste antes)
     - Debe empezar con `gsk_`

4. **NO hagas clic en Add otra vez** (solo necesitas una variable)

---

### 4.5 Desplegar

1. **Scroll hasta el final**

2. **Haz clic en "Create Web Service"** (botón azul grande)

3. **Espera mientras se despliega** 
   - Verás logs en tiempo real
   - Tomará 2-5 minutos
   - Verás texto desplazándose (es normal)

4. **Espera hasta ver estos mensajes:**
```
   🌐 Servidor web en puerto 10000
   🚀 Iniciando bot de WhatsApp...
   🔷 CÓDIGO QR PARA WHATSAPP:
```

5. **¡El bot está listo!** Ahora verás el código QR ✅

---

### ✅ CHECKPOINT 3

**¿Ves el código QR en los logs de Render?**
- ✅ Sí, veo el QR → Continúa al Paso 5
- ❌ No lo veo → Espera 1 minuto más y refresca la página

---

# PASO 5: CONECTAR WHATSAPP

## 🔷 Instrucciones:

### 5.1 Ver el código QR

1. **En Render**, deberías estar viendo los logs con el QR

2. **Si no ves el QR:**
   - Haz clic en la pestaña **"Logs"** (arriba)
   - Espera unos segundos
   - Scroll hacia abajo hasta ver el QR

3. **El QR se ve así (en texto ASCII):**
```
████ ▄▄▄▄▄ █▀█ █▄▀█▄▀▄█ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀█▀ ██ █   █ ████
████ █▄▄▄█ █▀ █▀▀ ▀▄ ██ █▄▄▄█ ████
```

---

### 5.2 Escanear con WhatsApp

**📱 EN TU TELÉFONO:**

1. **Abre WhatsApp**

2. **Android:**
   - Toca los 3 puntos (⋮) arriba a la derecha
   - Toca **"Dispositivos vinculados"**

   **iPhone:**
   - Ve a **"Ajustes"** (⚙️) abajo a la derecha
   - Toca **"Dispositivos vinculados"**

3. **Toca "Vincular dispositivo"**

4. **Si te pide usar Face ID / huella**, autentica

5. **Apunta tu cámara al código QR en la pantalla de tu computadora**
   - El QR está en los logs de Render
   - Puede que necesites hacer zoom out en tu navegador (Ctrl + Rueda del mouse)

6. **¡WhatsApp lo escaneará automáticamente!**

7. **Espera 5-10 segundos**

---

### 5.3 Confirmar conexión

1. **En los logs de Render** verás:
```
🔐 Autenticación exitosa
✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅
🎉 ¡BOT CONECTADO Y FUNCIONANDO 24/7!
📝 Comando: !bot [tu pregunta]
💚 Estado: ONLINE
✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅
```

2. **En tu WhatsApp** (teléfono):
   - Verás un nuevo dispositivo vinculado
   - Nombre algo como: "Chrome • Linux"

3. **¡LISTO! Tu bot está funcionando 24/7** 🎉

---

### ✅ CHECKPOINT 4

**El bot está conectado?**
- ✅ Sí, vi el mensaje de confirmación → Continúa al Paso 6
- ❌ No se conectó → Lee la sección de solución de problemas abajo

---

# PASO 6: MANTENER ACTIVO 24/7

## El problema del plan gratuito
Render duerme tu servicio después de 15 minutos sin actividad. Necesitamos "despertarlo" cada 5 minutos.

## 🔷 Solución: UptimeRobot (GRATIS)

### 6.1 Obtener URL de tu servicio

1. **En Render**, arriba del todo verás la URL de tu servicio
   - Se ve así: `https://whatsapp-bot-xxxx.onrender.com`
   - **COPIA ESTA URL** 📋

---

### 6.2 Crear monitor

1. **Ve a:** https://uptimerobot.com/

2. **Haz clic en "Register for FREE"**

3. **Completa:**
   - Email
   - Password
   - Marca "I'm not a robot"

4. **Haz clic en "Sign Up"**

5. **Verifica tu email** (revisa tu correo y haz clic en el enlace)

6. **Inicia sesión** en UptimeRobot

7. **Haz clic en "+ Add New Monitor"** (botón verde)

8. **Configura así:**

   **Monitor Type:** `HTTP(s)`
   
   **Friendly Name:** `WhatsApp Bot`
   
   **URL (or IP):** (pega la URL de Render que copiaste)
   - Ejemplo: `https://whatsapp-bot-xxxx.onrender.com`
   
   **Monitoring Interval:** `5 minutes`

9. **Scroll abajo** y haz clic en **"Create Monitor"** (botón verde)

10. **¡Listo!** Tu bot ahora se mantendrá activo 24/7 ✅

---

### ✅ CHECKPOINT 5

**Monitor creado?**
- ✅ Sí → Tu bot ya funciona 24/7
- ❌ No → Repite desde 6.2.7

---

# PASO 7: PROBAR EL BOT

## 🔷 Instrucciones:

### 7.1 Primera prueba

1. **Abre WhatsApp** en tu teléfono

2. **Envíate un mensaje a TI MISMO**
   - Opción 1: Guarda tu número en contactos y búscalo
   - Opción 2: Ve a un grupo donde estés y toca tu nombre

3. **Escribe:**
```
!bot hola
```

4. **Envía el mensaje**

5. **Espera 3-5 segundos**

6. **¡Deberías recibir una respuesta!**
```
@bot

¡Hola! ¿Cómo estás? ¿En qué puedo ayudarte hoy? 😊
```

---

### 7.2 Más pruebas

**Prueba estos comandos:**
```
!bot ¿Qué es la inteligencia artificial?
```
```
!bot Dame 5 tips para estudiar mejor
```
```
!bot Escribe un poema corto sobre el espacio
```
```
!bot ¿Cuál es la capital de Colombia?
```

---

### 7.3 Probar desde otro número

1. **Pide a un amigo** que te escriba por WhatsApp

2. **Que envíe:**
```
!bot cuéntame un chiste
