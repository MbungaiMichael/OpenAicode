import { db } from "@/lib/db";

export async function notify(userId: string, kind: string, message: string) {
  try {
    await db.notificationLog.create({ data: { userId, kind, message } });
  } catch {
    // notifications must never break core flow
  }
}
