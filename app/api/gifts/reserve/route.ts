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
    const giftId = Number(body.giftId);
    const guestName = typeof body.guestName === "string" ? body.guestName.trim() : "";

    if (!Number.isInteger(giftId) || giftId <= 0) {
      return NextResponse.json({ ok: false, error: "Presente inválido." }, { status: 400 });
    }

    if (!guestName) {
      return NextResponse.json({ ok: false, error: "Informe seu nome." }, { status: 400 });
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

    // A condição no UPDATE garante, de forma atômica, que a reserva nunca
    // ultrapasse a quantidade necessária, mesmo com pedidos simultâneos.
    const result = await pool.query(
      `UPDATE gifts
       SET quantity_reserved = quantity_reserved + 1,
           updated_at = NOW()
       WHERE id = $1
         AND quantity_reserved < quantity_needed
       RETURNING id, name, quantity_needed, quantity_reserved, description, price, link`,
      [giftId]
    );

    if (result.rows.length === 0) {
      const existing = await pool.query(
        `SELECT quantity_needed, quantity_reserved FROM gifts WHERE id = $1`,
        [giftId]
      );
      await pool.end();

      if (existing.rows.length === 0) {
        return NextResponse.json({ ok: false, error: "Presente não encontrado." }, { status: 404 });
      }

      return NextResponse.json(
        { ok: false, error: "Este presente acabou de ser reservado por outra pessoa." },
        { status: 409 }
      );
    }

    try {
      await pool.query(
        `INSERT INTO gift_reservations (gift_id, guest_name) VALUES ($1, $2)`,
        [giftId, guestName]
      );
    } catch (insertError) {
      console.error("Erro ao registrar reserva:", insertError);
    }

    await pool.end();

    return NextResponse.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error("Erro ao reservar presente:", error);
    return NextResponse.json({ ok: false, error: "Erro ao reservar presente." }, { status: 500 });
  }
}
