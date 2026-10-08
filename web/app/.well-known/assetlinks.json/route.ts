import { NextResponse } from "next/server";

/**
 * Digital Asset Links for Trusted Web Activity (TWA → APK).
 * The SHA-256 fingerprints come from YOUR release keystore and MUST stay
 * in env vars — never commit fingerprints of a private keystore to GitHub
 * unless you intend that keystore to be the public app identity.
 * Set TWA_SHA256_FINGERPRINTS="AA:BB:CC:..." (comma-separated for multiple).
 */
export async function GET() {
  const raw = process.env.TWA_SHA256_FINGERPRINTS ?? "";
  const fingerprints = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const packageName = process.env.TWA_PACKAGE_NAME ?? "app.patientassist.twa";
  return NextResponse.json(
    fingerprints.map((fp) => ({
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: packageName,
        sha256_cert_fingerprints: [fp],
      },
    }))
  );
}
