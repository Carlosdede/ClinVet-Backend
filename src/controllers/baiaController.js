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
export const atualizarBaia = async (req, res) => {
  const { id_baia } = req.params;
  const { nome_baia, id_cachorro } = req.body;

  try {
    // Atualiza o nome da baia
    await pool.query("UPDATE baia SET nome_baia = $1 WHERE id_baia = $2", [
      nome_baia,
      id_baia,
    ]);

    // Se veio id_cachorro, atualiza associação
    if (id_cachorro) {
      await pool.query("DELETE FROM baia_cachorro WHERE id_baia = $1", [
        id_baia,
      ]);

      await pool.query(
        "INSERT INTO baia_cachorro (id_baia, id_cachorro) VALUES ($1, $2)",
        [id_baia, id_cachorro]
      );
    }

    res.status(200).json({ message: "Baia atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar baia:", error);
    res.status(500).json({ error: "Falha ao atualizar baia." });
  }
};

export const deletarBaia = async (req, res) => {
  const { id_baia } = req.params;

  try {
    await pool.query("DELETE FROM baia_cachorro WHERE id_baia = $1", [id_baia]);

    const result = await pool.query("DELETE FROM baia WHERE id_baia = $1", [
      id_baia,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Baia não encontrada." });
    }

    res.status(200).json({ message: "Baia excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir baia:", error);
    res.status(500).json({ error: "Falha ao excluir baia." });
  }
};
