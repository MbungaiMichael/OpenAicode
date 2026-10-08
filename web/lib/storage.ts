import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const BUCKET = process.env.STORAGE_BUCKET ?? "medical-docs";
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? "";

export function storageConfigured() {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

function adminClient() {
  return createClient(SUPABASE_URL, SERVICE_KEY);
}

/** Allowed upload types: images + PDF. 10 MB max. */
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
export const MAX_BYTES = 10 * 1024 * 1024;

export function sanitizeFilename(name: string) {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.slice(0, 120) || "file";
}

/** Store a file. Returns a storable reference:
 *  - Supabase configured → `storage:<bucket>/<path>`
 *  - local dev fallback → `/uploads/<file>` (dev only, gitignored)
 */
export async function storeFile(
  userId: string,
  filename: string,
  mime: string,
  bytes: Buffer
): Promise<string> {
  if (!ALLOWED.has(mime)) throw new Error("File type not allowed (images + PDF only)");
  if (bytes.length > MAX_BYTES) throw new Error("File too large (max 10 MB)");
  const safe = `${userId}/${Date.now()}-${sanitizeFilename(filename)}`;

  if (storageConfigured()) {
    const { error } = await adminClient().storage.from(BUCKET).upload(safe, bytes, {
      contentType: mime,
      upsert: false,
    });
    if (error) throw new Error(`Storage upload failed: ${error.message}`);
    return `storage:${BUCKET}/${safe}`;
  }

  const dir = path.join(process.cwd(), "public", "uploads", userId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, path.basename(safe)), bytes);
  return `/uploads/${userId}/${path.basename(safe)}`;
}

/** Resolve a stored reference to a viewable URL.
 *  Supabase paths get a 1-hour signed URL; local/absolute URLs pass through.
 */
export async function resolveUrl(ref: string): Promise<string> {
  if (!ref.startsWith("storage:")) return ref;
  if (!storageConfigured()) return ref; // bucket path, no backend in dev
  const withoutPrefix = ref.slice("storage:".length);
  const slash = withoutPrefix.indexOf("/");
  const bucket = withoutPrefix.slice(0, slash);
  const objectPath = withoutPrefix.slice(slash + 1);
  const { data, error } = await adminClient()
    .storage.from(bucket)
    .createSignedUrl(objectPath, 3600);
  if (error || !data) throw new Error("Could not sign document URL");
  return data.signedUrl;
}
