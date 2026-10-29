import { NextResponse } from "next/server";
import { Pool } from "@neondatabase/serverless";

const sql = (DATABASE_URL: string) => {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL não configurada");
  }
  return new Pool({ connectionString: DATABASE_URL });
};

export async function GET() {
  try {
    const pool = sql(process.env.DATABASE_URL!);
    const result = await pool.query(
      `SELECT id, name, description, price, link, quantity_needed, quantity_reserved, created_at, updated_at
       FROM gifts
       ORDER BY created_at ASC`
    );
    await pool.end();

    return NextResponse.json({ ok: true, data: result.rows });
  } catch (error) {
    console.error("Erro ao buscar presentes públicos:", error);
    return NextResponse.json({ ok: false, error: "Erro ao buscar presentes." }, { status: 500 });
  }
}