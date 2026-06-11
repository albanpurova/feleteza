import "server-only";
import { getSession } from "@/lib/auth";

/** Hidh gabim nëse përdoruesi s'është i loguar — për përdorim brenda server actions. */
export async function assertAdmin() {
  const session = await getSession();
  if (!session) throw new Error("I paautorizuar. Ju lutemi kyçuni sërish.");
  return session;
}
