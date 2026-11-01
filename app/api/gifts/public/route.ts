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
    await pool.query(
      `CREATE TABLE IF NOT EXISTS gift_reservations (
        id SERIAL PRIMARY KEY,
        gift_id INTEGER NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
        guest_name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
    );
    const result = await pool.query(
      `SELECT g.id, g.name, g.description, g.price, g.link, g.quantity_needed, g.quantity_reserved, g.created_at, g.updated_at,
              COALESCE(
                json_agg(
                  json_build_object('id', gr.id, 'guest_name', gr.guest_name, 'created_at', gr.created_at)
                  ORDER BY gr.created_at ASC
                ) FILTER (WHERE gr.id IS NOT NULL),
                '[]'
              ) AS reservations
       FROM gifts g
       LEFT JOIN gift_reservations gr ON gr.gift_id = g.id
       GROUP BY g.id, g.name, g.description, g.price, g.link, g.quantity_needed, g.quantity_reserved, g.created_at, g.updated_at
       ORDER BY g.created_at ASC`
    );
    await pool.end();

    return NextResponse.json({ ok: true, data: result.rows });
  } catch (error) {
    console.error("Erro ao buscar presentes públicos:", error);
    return NextResponse.json({ ok: false, error: "Erro ao buscar presentes." }, { status: 500 });
  }
}