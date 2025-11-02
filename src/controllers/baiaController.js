import pool from "../config/db.js";

export const listarBaias = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id_baia,
        b.nome_baia,
        COALESCE(c.nome, 'Livre') AS nome_cachorro
      FROM baia b
      LEFT JOIN baia_cachorro bc ON b.id_baia = bc.id_baia
      LEFT JOIN cachorro c ON bc.id_cachorro = c.id_cachorro
      ORDER BY b.id_baia
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar baias:", error);
    res.status(500).json({ error: "Erro ao listar baias" });
  }
};

export const criarBaia = async (req, res) => {
  try {
    const { nome_baia } = req.body;

    if (!nome_baia) {
      return res.status(400).json({ error: "Nome da baia é obrigatório" });
    }

    const result = await pool.query(
      "INSERT INTO baia (nome_baia) VALUES ($1) RETURNING *",
      [nome_baia]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar baia:", error);
    res.status(500).json({ error: "Erro ao criar baia" });
  }
};
