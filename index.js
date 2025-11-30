const express = require("express");
const bodyParser = require("body-parser");
const { Client, GatewayIntentBits } = require("discord.js");

const TOKEN = process.env.BOT_TOKEN;
const CANAL_ID = process.env.CANAL_ID;

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
    console.log(`Bot online como ${client.user.tag}`);
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

📦 **APREENSÕES**
• 💊 Drogas: ${d.drogas}
• 🔫 Armamentos: ${d.armas}
• 🛠️ Lockpicks: ${d.lockpicks}
• 💵 Dinheiro sujo: ${d.dinheiro}

📑 **PROCEDIMENTOS**
• 📄 B.O’s Realizados: ${d.bos}
• 🔗 Prisões Realizadas: ${d.prisoes}

📝 **Observações Gerais:**  
${d.obs}

━━━━━━━━━━━━━━━━━━━━━━
📅 Enviado em: ${new Date().toLocaleString()}
        `;

        const canal = await client.channels.fetch(CANAL_ID);
        await canal.send(msg);

        res.json({ status: "ok", message: "Relatório enviado ao Discord." });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao enviar relatório" });
    }
});

app.listen(process.env.PORT || 3000, () =>
    console.log("API rodando na porta:", process.env.PORT || 3000)
);

client.login(TOKEN);
