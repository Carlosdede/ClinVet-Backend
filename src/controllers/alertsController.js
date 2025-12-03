import pool from "../config/db.js";
import { io } from "../server.js";
import { sendExpoPushNotification } from "../util/sendPush.js";

export const createAlert = async (req, res) => {
  try {
    const { tipo, confianca, id_baia } = req.body;

    if (!tipo || !confianca || !id_baia) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    // Insere alerta
    const result = await pool.query(
      `
      INSERT INTO alerta (tipo, confianca, id_baia, data_hora)
      VALUES ($1, $2, $3, NOW())
      RETURNING id_alerta, tipo, confianca, id_baia, data_hora
      `,
      [tipo, parseFloat(confianca), id_baia]
    );

    const novoAlerta = result.rows[0];

    // Busca baia + cachorro
    const baiaResult = await pool.query(
      `
      SELECT 
        b.nome_baia,
        c.nome AS nome_cachorro
      FROM baia b
      LEFT JOIN baia_cachorro bc ON b.id_baia = bc.id_baia
      LEFT JOIN cachorro c ON bc.id_cachorro = c.id_cachorro
      WHERE b.id_baia = $1
      `,
      [novoAlerta.id_baia]
    );

    const nome_baia = baiaResult.rows[0]?.nome_baia || "Baia desconhecida";
    const nome_cachorro =
      baiaResult.rows[0]?.nome_cachorro || "Cachorro não identificado";

    const alertaEmitido = {
      id_alerta: novoAlerta.id_alerta,
      tipo: novoAlerta.tipo,
      confianca: parseFloat(novoAlerta.confianca).toFixed(2),
      nome_baia,
      nome_cachorro,
      data_hora: new Date(novoAlerta.data_hora).toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }),
    };

    io.emit("new_alert", alertaEmitido);
    console.log("Novo alerta emitido:", alertaEmitido);

    const users = await pool.query(`
      SELECT expo_token 
      FROM usuario 
      WHERE expo_token IS NOT NULL AND expo_token <> ''
    `);

    for (const row of users.rows) {
      await sendExpoPushNotification(
        row.expo_token,
        " ClinVet Security",
        `${nome_cachorro} — ${nome_baia}`,
        alertaEmitido
      );
    }

    console.log(`Push enviado para ${users.rows.length} usuário(s)`);

    return res.status(201).json(alertaEmitido);
  } catch (err) {
    console.error(" Erro ao criar alerta:", err);
    return res.status(500).json({ error: "Erro ao criar alerta" });
  }
};

export const listAlerts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id_alerta,
        a.tipo,
        a.confianca,
        a.data_hora,
        b.nome_baia,
        c.nome AS nome_cachorro
      FROM alerta a
      LEFT JOIN baia b ON a.id_baia = b.id_baia
      LEFT JOIN baia_cachorro bc ON b.id_baia = bc.id_baia
      LEFT JOIN cachorro c ON bc.id_cachorro = c.id_cachorro
      ORDER BY a.data_hora DESC
    `);

    const alertas = result.rows.map((a) => ({
      ...a,
      confianca: parseFloat(a.confianca).toFixed(2),
      data_hora: a.data_hora,
    }));

    return res.status(200).json(alertas);
  } catch (err) {
    console.error("Erro ao listar alertas:", err);
    return res.status(500).json({ error: "Erro ao listar alertas" });
  }
};
