import pool from "../config/db.js";

export const getConvulsoesPorCachorro = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.nome AS nome_cachorro,
        COUNT(a.id_alerta) AS total_convulsoes
      FROM alerta a
      JOIN baia_cachorro bc ON a.id_baia = bc.id_baia
      JOIN cachorro c ON bc.id_cachorro = c.id_cachorro
      WHERE a.tipo = 'convulsao'
        AND a.data_hora >= NOW() - INTERVAL '1 month'
      GROUP BY c.nome
      ORDER BY total_convulsoes DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar convulsões por cachorro:", error);
    res.status(500).json({ error: "Erro ao buscar métricas" });
  }
};
