import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const avatarOptions: readonly string[] = ["🤖", "🦊", "🐼", "🦄", "🐸", "🐻"];

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    username?: unknown;
    avatar?: unknown;
  } | null;

  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const avatar = typeof body?.avatar === "string" && avatarOptions.includes(body.avatar) ? body.avatar : "🤖";

  if (username.length < 2 || username.length > 24) {
    return NextResponse.json(
      { error: "Bitte wähle einen Namen mit 2 bis 24 Zeichen." },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: {
      username,
      avatar,
      streak: 1,
      lastActiveAt: new Date(),
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      xp: true,
      streak: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
