import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const existing = await db.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { error: "Vous êtes déjà inscrit à la newsletter" },
          { status: 409 }
        );
      }
      // Réactiver
      await db.newsletterSubscription.update({
        where: { email },
        data: { active: true },
      });
      return NextResponse.json({ message: "Inscription réactivée avec succès" });
    }

    await db.newsletterSubscription.create({
      data: { email },
    });

    return NextResponse.json({ message: "Inscription réussie !" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    await db.newsletterSubscription.update({
      where: { email },
      data: { active: false },
    });

    return NextResponse.json({ message: "Désinscription effectuée" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
