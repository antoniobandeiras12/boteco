import express from "express";
import bodyParser from "body-parser";
import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";

const TOKEN = process.env.BOT_TOKEN;
const CANAL_ID = process.env.CANAL_ID;

if (!TOKEN || !CANAL_ID) {
    console.error("❌ BOT_TOKEN ou CANAL_ID faltando.");
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

        // 📌 EMBED OFICIAL (resumo, profissional, militar)
        const embed = {
            color: 0x2b2d31,
            title: "📘 RELATÓRIO DIÁRIO DE PATRULHA",
            description: "3º Batalhão de Policiamento de Choque – Humaitá",
            fields: [
                {
                    name: "👤 Enviado por",
                    value: `${d.nome_enviou} — ${d.patente_enviou}`
                },
                {
                    name: "🚓 Prefixo da Viatura",
                    value: d.prefixo
                },
                {
                    name: "👥 Efetivo da Guarnição",
                    value:
                        `• **Chefe:** ${d.chefe_nome} — ${d.chefe_patente}\n` +
                        `• **Motorista:** ${d.motorista_nome} — ${d.motorista_patente}\n` +
                        `• **3º Homem:** ${d.t3_nome} — ${d.t3_patente}\n` +
                        `• **4º Homem:** ${d.t4_nome} — ${d.t4_patente}\n` +
                        `• **5º Homem:** ${d.t5_nome} — ${d.t5_patente}`
                },
                {
                    name: "⏱ Horários",
                    value: `**Início:** ${d.inicio}\n**Fim:** ${d.fim}`
                },
                {
                    name: "📦 Ocorrências e Apreensões",
                    value:
                        `• Ocorrências Atendidas: **${d.total_ocorrencias}**\n` +
                        `• Drogas: **${d.drogas_apreendidas}**\n` +
                        `• Dinheiro Sujo: **${d.dinheiro_sujo_apreendido}**\n` +
                        `• Armamentos: **${d.armamento_apreendido}**\n` +
                        `• Munição: **${d.municao_apreendida}**\n` +
                        `• Bombas: **${d.bombas_apreendidas}**\n` +
                        `• Lockpicks: **${d.lockpicks_apreendidas}**`
                }
            ],
            footer: {
                text: "Relatório de Guarnição • BPChoque Humaitá",
                icon_url: "https://i.imgur.com/PEsQ9z4.png"
            },
            timestamp: new Date()
        };

        // 📌 BLOCO DE TEXTO DETALHADO
        const textoDetalhado = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 **DETALHAMENTO DO RELATÓRIO**
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 **Relação de Detidos e B.O**
${d.relacao_detidos_bo || "Nenhuma informação"}

🛡 **Ações Realizadas pela Equipe**
${d.acoes_realizadas || "Nenhuma ação registrada"}

🗒 **Observações**
${d.observacoes || "Sem observações registradas"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 **Enviado em:** ${new Date().toLocaleString("pt-BR")}
        `;

        const canal = await client.channels.fetch(CANAL_ID);
        await canal.send({ embeds: [embed] });
        await canal.send(textoDetalhado);

        res.json({ status: "ok", message: "Relatório enviado ao Discord." });

    } catch (err) {
        console.error("❌ ERRO AO ENVIAR RELATÓRIO:", err);
        res.status(500).json({ error: "Erro ao enviar relatório" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 API rodando na porta:", PORT);
});

client.login(TOKEN);
