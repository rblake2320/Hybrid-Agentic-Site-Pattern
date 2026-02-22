import { NextRequest, NextResponse } from "next/server";
import { enforcePolicy } from "@/lib/policy";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

export function middleware(req: NextRequest) {
  const { ok, response, auditEvent } = enforcePolicy(req);

  if (!ok && response) return response;

  const res = NextResponse.next();
  if (auditEvent) {
    res.headers.set("X-HASP-Audit", Buffer.from(JSON.stringify(auditEvent)).toString("base64url"));
  }
  if (response?.headers?.get("X-HASP-Agent-Warning")) {
    res.headers.set("X-HASP-Agent-Warning", response.headers.get("X-HASP-Agent-Warning")!);
  }
  return res;
}
