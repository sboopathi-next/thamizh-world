import { NextResponse } from "next/server";
import { verifyCredentials, signSession, SESSION_COOKIE, SESSION_DURATION_DAYS } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!verifyCredentials(username, password)) {
    return NextResponse.json(
      { success: false, error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const token = await signSession(username);
  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60, // 30 days in seconds
    path: "/",
  });

  return response;
}
