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

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
    }

    const pool = sql(process.env.DATABASE_URL!);
    const result = await pool.query(
      `SELECT id, name, description, price, link, quantity_needed, quantity_reserved, created_at, updated_at
       FROM gifts
       ORDER BY created_at ASC`
    );
    await pool.end();

    return NextResponse.json({ ok: true, data: result.rows });
  } catch (error) {
    console.error("Erro ao buscar presentes:", error);
    return NextResponse.json({ ok: false, error: "Erro ao buscar presentes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
    }

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
      `INSERT INTO gifts (name, description, price, link, quantity_needed, quantity_reserved)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, description, price, link, quantity_needed, quantity_reserved, created_at, updated_at`,
      [
        name.trim(),
        description?.trim() || null,
        priceValue,
        link?.trim() || null,
        needed,
        reserved,
      ]
    );
    await pool.end();

    return NextResponse.json({ ok: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar presente:", error);
    return NextResponse.json({ ok: false, error: "Erro ao criar presente." }, { status: 500 });
  }
}