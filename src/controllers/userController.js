import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { nome, username, senha, cargo } = req.body;

    // Criptografa a senha antes de salvar
    const hash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      "INSERT INTO usuario (nome, username, senha, cargo) VALUES ($1, $2, $3, $4) RETURNING id_usuario, nome, username, cargo, criado_em",
      [nome, username, hash, cargo]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};
