import { NextResponse } from "next/server";
import { Pool } from "@neondatabase/serverless";

const sql = (DATABASE_URL: string) => {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL não configurada");
  }
  return new Pool({ connectionString: DATABASE_URL });
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const response = body.response === "accept" || body.response === "decline" ? body.response : null;
    const message = String(body.message || "").trim();

    if (!name) {
      return NextResponse.json({ ok: false, error: "Informe seu nome." }, { status: 400 });
    }
    if (!response) {
      return NextResponse.json({ ok: false, error: "Escolha uma resposta ao convite." }, { status: 400 });
    }

    const pool = sql(process.env.DATABASE_URL!);
    await pool.query(
      `CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        response TEXT NOT NULL CHECK (response IN ('accept','decline')),
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
    );

    const result = await pool.query(
      `INSERT INTO rsvps (name, response, message) VALUES ($1, $2, $3) RETURNING id, name, response, message, created_at`,
      [name, response, message || null]
    );

    await pool.end();

    return NextResponse.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error("Erro ao salvar RSVP:", error);
    return NextResponse.json({ ok: false, error: "Erro ao salvar confirmação." }, { status: 500 });
  }
}