import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
  const { username, senha } = req.body;

  try {
    // Busca usuário no banco
    const result = await pool.query(
      "SELECT * FROM usuario WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Usuário não encontrado" });

    const user = result.rows[0];

    // Verifica senha
    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword)
      return res.status(401).json({ error: "Senha incorreta" });

    //Gera token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ message: "Login realizado com sucesso", token });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
