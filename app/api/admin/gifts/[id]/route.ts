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