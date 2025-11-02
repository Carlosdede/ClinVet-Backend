import pool from "../config/db.js";

// Associar cachorro a uma baia
export const vincularCachorro = async (req, res) => {
  try {
    const { id_baia, id_cachorro } = req.body;

    const result = await pool.query(
      "INSERT INTO baia_cachorro (id_baia, id_cachorro) VALUES ($1, $2) RETURNING *",
      [id_baia, id_cachorro]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao vincular cachorro à baia:", err);
    res.status(500).json({ error: "Erro ao vincular cachorro à baia" });
  }
};

// Listar cachorros de uma baia
export const listarCachorrosPorBaia = async (req, res) => {
  try {
    const { id_baia } = req.params;

    const result = await pool.query(
      `
      SELECT c.*
      FROM cachorro c
      INNER JOIN baia_cachorro bc ON c.id_cachorro = bc.id_cachorro
      WHERE bc.id_baia = $1
    `,
      [id_baia]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar cachorros da baia:", err);
    res.status(500).json({ error: "Erro ao listar cachorros da baia" });
  }
};
