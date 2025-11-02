import pool from "../config/db.js";

export const listarCachorros = async (req, res) => {
  try {
    const { page = 1, search = "" } = req.query;
    const limit = 5;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM cachorro
      WHERE nome ILIKE $1
      ORDER BY id_cachorro DESC
      LIMIT $2 OFFSET $3
    `;
    const { rows } = await pool.query(query, [`%${search}%`, limit, offset]);

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM cachorro WHERE nome ILIKE $1`,
      [`%${search}%`]
    );
    const totalPaginas = Math.ceil(countResult.rows[0].count / limit);

    res.json({ pacientes: rows, totalPaginas });
  } catch (error) {
    console.error("Erro ao listar cachorros:", error);
    res.status(500).json({ error: "Erro ao listar cachorros" });
  }
};

export const cadastrarCachorro = async (req, res) => {
  try {
    const { nome, raca, idade } = req.body;

    if (!nome || !raca || !idade) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const insertQuery = `
      INSERT INTO cachorro (nome, raca, idade)
      VALUES ($1, $2, $3)
      RETURNING id_cachorro, nome, raca, idade
    `;
    const result = await pool.query(insertQuery, [nome, raca, idade]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao cadastrar cachorro:", error);
    res.status(500).json({ error: "Erro ao cadastrar cachorro" });
  }
};
