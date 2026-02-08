const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Groq = require('groq-sdk');
const express = require('express');
require('dotenv').config();

// ========================================
// SERVIDOR EXPRESS (mantiene bot activo)
// ========================================
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bot WhatsApp</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .container {
                    text-align: center;
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }
                h1 { color: #25D366; margin: 0 0 10px 0; }
                p { color: #666; font-size: 18px; }
                .status { 
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    background: #25D366;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🤖 Bot de WhatsApp</h1>
                <p><span class="status"></span> ONLINE</p>
                <p>Envía: <strong>!bot [tu pregunta]</strong></p>
            </div>
        </body>
        </html>
    `);
});

app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memoryUsage: process.memoryUsage()
    });
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor web en puerto ${PORT}`);
});

// ========================================
// CLIENTE DE WHATSAPP
// ========================================
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: '.wwebjs_auth'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// ========================================
// GROQ AI
// ========================================
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Historial de conversaciones
const conversationHistory = new Map();

// ========================================
// EVENTOS DE WHATSAPP
// ========================================

client.on('qr', (qr) => {
    console.log('\n' + '='.repeat(50));
    console.log('🔷 CÓDIGO QR PARA WHATSAPP:');
    console.log('='.repeat(50) + '\n');
    qrcode.generate(qr, { small: true });
    console.log('\n' + '='.repeat(50));
    console.log('📱 PASOS PARA CONECTAR:');
    console.log('1. Abre WhatsApp en tu teléfono');
    console.log('2. Ve a Ajustes (⚙️) > Dispositivos vinculados');
    console.log('3. Toca "Vincular dispositivo"');
    console.log('4. Escanea el código QR de arriba ☝️');
    console.log('='.repeat(50) + '\n');
});

client.on('ready', () => {
    console.log('\n' + '✅'.repeat(25));
    console.log('🎉 ¡BOT CONECTADO Y FUNCIONANDO 24/7!');
    console.log('📝 Comando: !bot [tu pregunta]');
    console.log('💚 Estado: ONLINE');
    console.log('✅'.repeat(25) + '\n');
});

client.on('authenticated', () => {
    console.log('🔐 Autenticación exitosa');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Error de autenticación:', msg);
    console.log('💡 Solución: Elimina la carpeta .wwebjs_auth y escanea el QR nuevamente');
});

client.on('disconnected', (reason) => {
    console.log('⚠️ Bot desconectado:', reason);
    console.log('🔄 Intentando reconectar...');
});

// ========================================
// PROCESAR MENSAJES
// ========================================
client.on('message', async (message) => {
    try {
        const chatId = message.from;
        const messageText = message.body.trim();
        
        // Ignorar mensajes de grupos (opcional)
        const chat = await message.getChat();
        if (chat.isGroup) {
            // Si quieres que funcione en grupos, comenta estas 2 líneas
            return;
        }

        // Verificar comando !bot
        if (messageText.toLowerCase().startsWith('!bot')) {
            const query = messageText.substring(4).trim();

            // Validar que haya una pregunta
            if (!query) {
                await message.reply(
                    '@bot\n\n' +
                    '💡 *Cómo usar el bot:*\n\n' +
                    'Escribe: !bot seguido de tu pregunta\n\n' +
                    '*Ejemplos:*\n' +
                    '• !bot ¿Qué es la inteligencia artificial?\n' +
                    '• !bot Escribe un poema sobre el mar\n' +
                    '• !bot Dame 5 tips para estudiar mejor'
                );
                return;
            }

            console.log(`\n📨 Nueva consulta de ${chatId.split('@')[0]}`);
            console.log(`❓ Pregunta: "${query.substring(0, 60)}${query.length > 60 ? '...' : ''}"`);

            // Mostrar "escribiendo..."
            await chat.sendStateTyping();

            // Obtener o crear historial
            if (!conversationHistory.has(chatId)) {
                conversationHistory.set(chatId, []);
            }
            const history = conversationHistory.get(chatId);

            // Agregar mensaje del usuario
            history.push({
                role: 'user',
                content: query
            });

            // Limitar historial (mantener últimos 6 mensajes = 3 intercambios)
            if (history.length > 6) {
                history.splice(0, 2); // Eliminar los 2 más antiguos
            }

            // Llamar a Groq AI
            try {
                const chatCompletion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: 'system',
                            content: 'Eres un asistente virtual útil, amigable y conciso. Respondes en español de manera clara y profesional. Tus respuestas son informativas pero no demasiado largas. Usas emojis ocasionalmente para hacer la conversación más amena.'
                        },
                        ...history
                    ],
                    model: 'llama-3.3-70b-versatile',
                    temperature: 0.7,
                    max_tokens: 800,
                    top_p: 1,
                    stream: false
                });

                const aiResponse = chatCompletion.choices[0]?.message?.content;

                if (!aiResponse) {
                    throw new Error('Respuesta vacía de la IA');
                }

                // Agregar respuesta al historial
                history.push({
                    role: 'assistant',
                    content: aiResponse
                });

                // Enviar respuesta
                await message.reply(`@bot\n\n${aiResponse}`);

                console.log(`✅ Respuesta enviada (${aiResponse.length} caracteres)`);

            } catch (aiError) {
                console.error('❌ Error de IA:', aiError.message);
                
                // Mensajes de error específicos
                let errorMessage = '@bot\n\n';
                if (aiError.message.includes('rate_limit')) {
                    errorMessage += '⚠️ He alcanzado el límite de consultas.\n\nPor favor intenta de nuevo en unos minutos.';
                } else if (aiError.message.includes('invalid_api_key')) {
                    errorMessage += '❌ Error de configuración.\n\nContacta al administrador del bot.';
                } else {
                    errorMessage += '⚠️ Ocurrió un error al procesar tu mensaje.\n\nIntenta de nuevo en unos segundos.';
                }
                
                await message.reply(errorMessage);
            }
        }

    } catch (error) {
        console.error('❌ Error general:', error);
        try {
            await message.reply('@bot\n\n⚠️ Error inesperado. Por favor intenta de nuevo.');
        } catch (e) {
            console.error('❌ No se pudo enviar mensaje de error:', e);
        }
    }
});

// ========================================
// INICIAR BOT
// ========================================
console.log('🚀 Iniciando bot de WhatsApp...\n');
client.initialize();

// ========================================
// MANTENIMIENTO
// ========================================

// Limpiar historial cada 2 horas
setInterval(() => {
    const size = conversationHistory.size;
    conversationHistory.clear();
    console.log(`🧹 Historial limpiado (${size} conversaciones eliminadas)`);
}, 2 * 60 * 60 * 1000);

// Log de estado cada 15 minutos
setInterval(() => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    console.log(`💚 Bot activo - Uptime: ${hours}h ${minutes}m - ${new Date().toLocaleString('es-ES')}`);
}, 15 * 60 * 1000);

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
    console.error('❌ Error no manejado:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Excepción no capturada:', error);
});
