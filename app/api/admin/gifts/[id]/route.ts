import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Pool } from "@neondatabase/serverless";

const sql = (DATABASE_URL: string) => {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL não configurada");
  }
  return new Pool({ connectionString: DATABASE_URL });
};

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "authenticated";
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
    }

    const { id } = await params;
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
       WHERE g.id = $1
       GROUP BY g.id, g.name, g.description, g.price, g.link, g.quantity_needed, g.quantity_reserved, g.created_at, g.updated_at`,
      [id]
    );
    await pool.end();

    if (result.rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Presente não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error("Erro ao buscar presente:", error);
    return NextResponse.json({ ok: false, error: "Erro ao buscar presente." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, price, link, quantity_needed, quantity_reserved } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ ok: false, error: "Nome do presente é obrigatório." }, { status: 400 });
    }

    const needed = Number(quantity_needed);
    const reserved = Number(quantity_reserved) || 0;

    if (Number.isNaN(needed) || needed < 1) {
      return NextResponse.json({ ok: false, error: "Quantidade necessária deve ser pelo menos 1." }, { status: 400 });
    }

    if (reserved < 0 || reserved > needed) {
      return NextResponse.json({ ok: false, error: "Quantidade reservada inválida." }, { status: 400 });
    }

    const pool = sql(process.env.DATABASE_URL!);
    let priceValue: string | null = null;
    if (price !== "" && price !== null && price !== undefined) {
      const normalized = String(price).replace(",", ".");
      const num = Number(normalized);
      if (!Number.isNaN(num) && num >= 0 && num < 100000000) {
        priceValue = num.toFixed(2);
      }
    }

    const result = await pool.query(
      `UPDATE gifts
       SET name = $1, description = $2, price = $3, link = $4, quantity_needed = $5, quantity_reserved = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING id, name, description, price, link, quantity_needed, quantity_reserved, created_at, updated_at`,
      [
        name.trim(),
        description?.trim() || null,
        priceValue,
        link?.trim() || null,
        needed,
        reserved,
        id,
      ]
    );
    await pool.end();

    if (result.rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Presente não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error("Erro ao atualizar presente:", error);
    return NextResponse.json({ ok: false, error: "Erro ao atualizar presente." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
    }

    const { id } = await params;

    const pool = sql(process.env.DATABASE_URL!);
    const result = await pool.query("DELETE FROM gifts WHERE id = $1 RETURNING id", [id]);
    await pool.end();

    if (result.rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Presente não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao remover presente:", error);
    return NextResponse.json({ ok: false, error: "Erro ao remover presente." }, { status: 500 });
  }
}