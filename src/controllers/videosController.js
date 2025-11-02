// controllers/eventoController.js
import pool from "../config/db.js";

export const createClip = async (req, res) => {
  try {
    const { id_alerta, video_url, duracao_segundos } = req.body;

    if (!id_alerta || !video_url || !duracao_segundos) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const result = await pool.query(
      `
      INSERT INTO evento (id_alerta, video_url, duracao_segundos, data_criacao)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
      `,
      [id_alerta, video_url, duracao_segundos]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao salvar clip:", error);
    res.status(500).json({ error: "Erro ao salvar clip" });
  }
};

export const listClips = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT e.*, a.tipo, a.data_hora, c.nome AS nome_cachorro, b.nome_baia
      FROM evento e
      LEFT JOIN alerta a ON e.id_alerta = a.id_alerta
      LEFT JOIN baia b ON a.id_baia = b.id_baia
      LEFT JOIN baia_cachorro bc ON b.id_baia = bc.id_baia
      LEFT JOIN cachorro c ON bc.id_cachorro = c.id_cachorro
      ORDER BY e.data_criacao DESC
      `
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar clips:", error);
    res.status(500).json({ error: "Erro ao listar clips" });
  }
};
