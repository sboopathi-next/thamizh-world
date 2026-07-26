import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "tw_session";
const SESSION_DURATION_DAYS = 30;

function getSecret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET || "fallback-secret-change-me"
  );
}

export async function signSession(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.username as string;
  } catch {
    return null;
  }
}

export function verifyCredentials(username: string, password: string): boolean {
  return (
    username === process.env.AUTH_USERNAME &&
    password === process.env.AUTH_PASSWORD
  );
}

export { SESSION_COOKIE, SESSION_DURATION_DAYS };
