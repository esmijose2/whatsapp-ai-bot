const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Groq = require('groq-sdk');
const express = require('express');
require('dotenv').config();

// ===== SERVIDOR EXPRESS PARA MANTENER ACTIVO =====
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🤖 Bot de WhatsApp activo y funcionando!');
});

app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor ejecutándose en puerto ${PORT}`);
});

// ===== CLIENTE DE WHATSAPP =====
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const conversationHistory = new Map();

client.on('qr', (qr) => {
    console.log('\n================================');
    console.log('🔷 CÓDIGO QR PARA WHATSAPP:');
    console.log('================================\n');
    qrcode.generate(qr, { small: true });
    console.log('\n================================');
    console.log('📱 PASOS:');
    console.log('1. Abre WhatsApp en tu teléfono');
    console.log('2. Ve a Ajustes > Dispositivos vinculados');
    console.log('3. Toca en "Vincular dispositivo"');
    console.log('4. Escanea el código QR de arriba');
    console.log('================================\n');
});

client.on('ready', () => {
    console.log('✅ ¡BOT CONECTADO Y FUNCIONANDO 24/7!');
    console.log('📝 Comando: !bot [tu pregunta]');
    console.log('💚 Estado: ONLINE\n');
});

client.on('message', async (message) => {
    try {
        const chatId = message.from;
        const messageText = message.body.trim();

        // Activar con !bot
        if (messageText.toLowerCase().startsWith('!bot')) {
            const query = messageText.substring(4).trim();

            if (!query) {
                await message.reply('@bot\n\n💡 Escribe tu pregunta después de !bot\n\nEjemplo:\n!bot ¿Qué es la inteligencia artificial?');
                return;
            }

            console.log(`📨 Nueva consulta: "${query.substring(0, 50)}..."`);

            const chat = await message.getChat();
            await chat.sendStateTyping();

            // Manejar historial
            if (!conversationHistory.has(chatId)) {
                conversationHistory.set(chatId, []);
            }
            const history = conversationHistory.get(chatId);

            history.push({
                role: 'user',
                content: query
            });

            // Mantener solo últimos 10 mensajes
            if (history.length > 10) {
                history.shift();
                history.shift();
            }

            // Llamar a Groq AI
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'Eres un asistente virtual útil, amigable y conciso. Respondes en español de manera clara y profesional. Mantienes respuestas breves pero completas.'
                    },
                    ...history
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 1024,
            });

            const aiResponse = chatCompletion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';

            history.push({
                role: 'assistant',
                content: aiResponse
            });

            await message.reply(`@bot\n\n${aiResponse}`);
            console.log(`✅ Respuesta enviada exitosamente`);
        }

    } catch (error) {
        console.error('❌ Error al procesar mensaje:', error.message);
        try {
            await message.reply('@bot\n\n⚠️ Ocurrió un error al procesar tu mensaje.\n\nPor favor intenta de nuevo en unos segundos.');
        } catch (replyError) {
            console.error('❌ Error al enviar mensaje de error:', replyError.message);
        }
    }
});

client.on('auth_failure', (msg) => {
    console.error('❌ Error de autenticación:', msg);
});

client.on('disconnected', (reason) => {
    console.log('⚠️ Bot desconectado:', reason);
    console.log('💡 Reiniciando conexión...');
});

client.initialize();

// Limpiar historial cada hora
setInterval(() => {
    conversationHistory.clear();
    console.log('🧹 Historial de conversaciones limpiado');
}, 60 * 60 * 1000);

// Log de estado cada 10 minutos
setInterval(() => {
    console.log(`💚 Bot activo - ${new Date().toLocaleString('es-ES')}`);
}, 10 * 60 * 1000);
```

#### 📄 Archivo: `.gitignore`
```
node_modules/
.env
.wwebjs_auth/
.wwebjs_cache/
*.log
```

---

### PASO 2: Obtener API Key de Groq (GRATIS - sin tarjeta)

1. Ve a https://console.groq.com/
2. Sign up con Google o Email (NO pide tarjeta)
3. Ve a **"API Keys"**
4. **Create API Key**
5. Copia la key (empieza con `gsk_...`)
6. Guárdala (la usarás en el siguiente paso)

---

### PASO 3: Desplegar en Render (100% GRATIS)

1. **Ve a https://render.com/**

2. **Haz clic en "Get Started"**

3. **Sign up con GitHub** (sin tarjeta de crédito)

4. **Autoriza Render** a acceder a tus repositorios

5. **Una vez dentro del Dashboard:**
   - Haz clic en **"New +"** (arriba a la derecha)
   - Selecciona **"Web Service"**

6. **Conectar repositorio:**
   - Haz clic en **"Connect a repository"**
   - Busca `whatsapp-ai-bot`
   - Haz clic en **"Connect"**

7. **Configuración del servicio:**

   **Name:** `whatsapp-bot` (o el nombre que quieras)
   
   **Region:** Elige el más cercano (Oregon para Latinoamérica)
   
   **Branch:** `main`
   
   **Root Directory:** (déjalo vacío)
   
   **Runtime:** `Node`
   
   **Build Command:** `npm install`
   
   **Start Command:** `npm start`
   
   **Instance Type:** Selecciona **"Free"** ⭐

8. **Variables de entorno:**
   - Scroll hacia abajo hasta **"Environment Variables"**
   - Haz clic en **"Add Environment Variable"**
   - **Key:** `GROQ_API_KEY`
   - **Value:** (pega tu API key de Groq)
   - Haz clic en **"Add"**

9. **Crear el servicio:**
   - Scroll hasta abajo
   - Haz clic en **"Create Web Service"** (botón azul)

10. **Espera el despliegue (2-5 minutos):**
    - Verás logs en tiempo real
    - Espera hasta ver: `🔷 CÓDIGO QR PARA WHATSAPP:`

---

### PASO 4: Ver el QR y conectar WhatsApp

1. **En los logs de Render** verás el código QR en formato ASCII

2. **OPCIÓN A - Escanear desde la pantalla:**
   - Abre WhatsApp en tu teléfono
   - Ajustes > Dispositivos vinculados > Vincular dispositivo
   - Escanea el QR directamente de la pantalla

3. **OPCIÓN B - Si el QR es difícil de leer:**
   - Toma screenshot de los logs
   - Aumenta el zoom
   - Escanea desde la imagen

4. **Espera el mensaje:**
```
   ✅ ¡BOT CONECTADO Y FUNCIONANDO 24/7!
```

---

### PASO 5: Probar el bot

Envía desde cualquier chat:
```
!bot hola
```

Respuesta:
```
@bot

¡Hola! ¿En qué puedo ayudarte hoy?
```

---

## 🎉 ¡LISTO! Bot funcionando 100% GRATIS

---

## ⚠️ IMPORTANTE: Mantener el bot activo 24/7

El plan gratuito de Render "duerme" después de 15 minutos sin actividad. Para evitarlo:

### Solución 1: UptimeRobot (GRATIS)

1. Ve a https://uptimerobot.com/
2. Sign up (gratis, sin tarjeta)
3. **Add New Monitor**
4. Configuración:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** WhatsApp Bot
   - **URL:** (copia la URL de tu servicio en Render, se ve como: `https://whatsapp-bot-xxxx.onrender.com`)
   - **Monitoring Interval:** 5 minutes
5. **Create Monitor**

**¿Qué hace?** Hace ping cada 5 minutos para que el servicio nunca se duerma.

### Solución 2: Cron-job.org (GRATIS)

1. Ve a https://cron-job.org/
2. Sign up
3. Create cronjob
4. URL: tu URL de Render
5. Interval: Every 5 minutes

---

## 💰 RESUMEN DE COSTOS

| Servicio | Costo | Límite |
|----------|-------|--------|
| **GitHub** | 🆓 GRATIS | Ilimitado |
| **Groq API** | 🆓 GRATIS | ~6000 requests/día |
| **Render** | 🆓 GRATIS | 750 horas/mes |
| **UptimeRobot** | 🆓 GRATIS | 50 monitores |
| **TOTAL** | **$0.00 USD** | **100% GRATIS** |

---

## 🔄 ALTERNATIVA 2: Glitch (también 100% gratis)

Si Render no te funciona:

1. Ve a https://glitch.com/
2. Sign up con GitHub
3. **New Project > Import from GitHub**
4. Pega la URL de tu repo
5. Agrega variable de entorno en `.env`:
```
   GROQ_API_KEY=tu_key_aqui
