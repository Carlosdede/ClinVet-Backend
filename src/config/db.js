import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then(() => console.log("Conectado ao PostgreSQL com sucesso!"))
  .catch((err) => console.error("Erro na conexão com PostgreSQL:", err));

export default pool;
