import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit faire au moins 8 caractères" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    await db.user.create({
      data: {
        email: normalizedEmail,
        name: name || null,
        password: hashed,
        role: "user",
      },
    });

    return NextResponse.json({ message: "Compte créé avec succès" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
