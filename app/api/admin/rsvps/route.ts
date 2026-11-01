import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Pool } from "@neondatabase/serverless";

const sql = (DATABASE_URL: string) => {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL não configurada");
  }
  return new Pool({ connectionString: DATABASE_URL });
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session || session.value !== "authenticated") {
      return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
    }

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
      `SELECT r.id, r.name, r.response, r.message, r.created_at,
              g.name AS gift_name
       FROM rsvps r
       LEFT JOIN gift_reservations gr ON LOWER(TRIM(gr.guest_name)) = LOWER(TRIM(r.name))
       LEFT JOIN gifts g ON g.id = gr.gift_id
       ORDER BY r.created_at DESC`
    );
    await pool.end();

    const data = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      response: row.response,
      message: row.message,
      created_at: row.created_at,
      gift_name: row.gift_name,
    }));

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("Erro ao buscar RSVPs:", error);
    return NextResponse.json({ ok: false, error: "Erro ao buscar confirmações." }, { status: 500 });
  }
}
