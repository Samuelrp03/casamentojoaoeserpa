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
    const result = await pool.query(
      `SELECT id, name, response, message, created_at 
       FROM rsvps 
       ORDER BY created_at DESC`
    );
    await pool.end();

    return NextResponse.json({ ok: true, data: result.rows });
  } catch (error) {
    console.error("Erro ao buscar RSVPs:", error);
    return NextResponse.json({ ok: false, error: "Erro ao buscar confirmações." }, { status: 500 });
  }
}
