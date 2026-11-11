import { NextResponse, type NextRequest } from "next/server";
import { saveEnquiry } from "@/lib/enquiries/repository";
import { enquirySchema } from "@/lib/enquiries/schema";

export const runtime = "nodejs";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_SUBMISSIONS = 5;
const submissions = new Map<string, number[]>();
const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return NextResponse.json({ status: "error", message: "This request could not be accepted." }, { status: 403 });
    } catch {
      return NextResponse.json({ status: "error", message: "This request could not be accepted." }, { status: 403 });
    }
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) return tooLarge();
  const bodyText = await request.text();
  if (new TextEncoder().encode(bodyText).byteLength > MAX_BODY_BYTES) return tooLarge();
  let body: unknown;
  try {
    body = JSON.parse(bodyText) as unknown;
  } catch {
    return NextResponse.json({ status: "error", message: "The request format was not valid." }, { status: 400 });
  }

  const key = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (submissions.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_SUBMISSIONS) return NextResponse.json({ status: "error", message: "Too many requests. Please try again later." }, { status: 429 });
  recent.push(now);
  submissions.set(key, recent);
  if (submissions.size > 1000) {
    for (const [ip, timestamps] of submissions) if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) submissions.delete(ip);
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".");
      if (field && !fields[field]) fields[field] = issue.message;
    }
    return NextResponse.json({ status: "invalid", message: "Please check the highlighted fields and try again.", fields }, { status: 422 });
  }
  if ("website" in parsed.data && parsed.data.website) {
    return NextResponse.json({ status: "not_saved", message: "This enquiry was not saved." }, { status: 503 });
  }

  const result = await saveEnquiry(parsed.data);
  if (!result.saved) {
    if (result.reason === "property-not-found") {
      return NextResponse.json({ status: "invalid", message: "This property reference is not recognized. Refresh the page and try again." }, { status: 422 });
    }
    const message = result.reason === "database-unavailable"
      ? "Your details are valid, but the database is not configured or reachable. This enquiry was not saved."
      : "Your details are valid, but the database could not save this enquiry. It was not saved; please try again later.";
    return NextResponse.json({ status: "not_saved", message }, { status: 503 });
  }
  return NextResponse.json({ status: "saved", message: "Your enquiry has been saved.", reference: result.reference }, { status: 201 });
}

function tooLarge() {
  return NextResponse.json({ status: "error", message: "This request is too large." }, { status: 413 });
}
