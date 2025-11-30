import express from "express";
import bodyParser from "body-parser";
import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";

const TOKEN = process.env.BOT_TOKEN;
const CANAL_ID = process.env.CANAL_ID;

if (!TOKEN) {
    console.error("❌ ERRO: BOT_TOKEN não foi encontrado nas variáveis do Railway.");
    process.exit(1);
}

if (!CANAL_ID) {
    console.error("❌ ERRO: CANAL_ID não foi encontrado nas variáveis do Railway.");
    process.exit(1);
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`🤖 Bot online como ${client.user.tag}`);
});

app.post("/enviar", async (req, res) => {
    try {
        const d = req.body;

        const msg = `
📋 **RELATÓRIO DIÁRIO DE PATRULHA**
━━━━━━━━━━━━━━━━━━━━━━

👤 **Enviado por:** ${d.nome_enviou} - ${d.patente_enviou}
🚓 **Prefixo da Viatura:** ${d.prefixo}

🧑‍✈️ **Chefe de Barca:** ${d.chefe_nome} - ${d.chefe_patente}
👨‍✈️ **Motorista:** ${d.motorista_nome} - ${d.motorista_patente}
👮‍♂️ **Terceiro Homem:** ${d.t3_nome} - ${d.t3_patente}
👮‍♂️ **Quarto Homem:** ${d.t4_nome} - ${d.t4_patente}
👮‍♂️ **Quinto Homem:** ${d.t5_nome} - ${d.t5_patente}

⏱️ **Início da Patrulha:** ${d.inicio}
⏱️ **Fim da Patrulha:** ${d.fim}

📦 **APREENSÕES / RESULTADOS**
• 📟 Total de Ocorrências Atendidas: ${d.total_ocorrencias}
• 💊 Drogas Apreendidas: ${d.drogas_apreendidas}
• 💵 Dinheiro Sujo Apreendido: ${d.dinheiro_sujo_apreendido}
• 🔫 Armamento Apreendido: ${d.armamento_apreendido}
• 🧨 Bombas Apreendidas: ${d.bombas_apreendidas}
• 🔫 Munição Apreendida: ${d.municao_apreendida}
• 🛠️ Lockpicks Apreendidas: ${d.lockpicks_apreendidas}

📑 **PROCEDIMENTOS**
• 👮‍♂️ Relação de Detidos / B.O:  
${d.relacao_detidos_bo}

⚡ **Ações Realizadas pela Equipe:**  
${d.acoes_realizadas}

📝 **Observações Gerais:**  
${d.observacoes}

━━━━━━━━━━━━━━━━━━━━━━
📅 Enviado em: ${new Date().toLocaleString("pt-BR")}
        `;

        const canal = await client.channels.fetch(CANAL_ID);
        await canal.send(msg);

        res.json({ status: "ok", message: "Relatório enviado ao Discord." });

    } catch (err) {
        console.error("❌ ERRO AO ENVIAR RELATÓRIO:", err);
        res.status(500).json({ error: "Erro ao enviar relatório" });
    }
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log("🚀 API rodando na porta:", PORTA);
});

client.login(TOKEN);
