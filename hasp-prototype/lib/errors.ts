import { NextResponse } from \"next/server\";

export function policyViolation(rule: string, status = 403) {
  return NextResponse.json({
    error: \"hasp:policy_violation\",
    rule,
    policy_ref: `/.well-known/ai-policy.txt#${rule}`,
    status
  }, { status });
}

export function notAcceptable() {
  return NextResponse.json({ error: \"hasp:not_acceptable\", status: 406, supported: [\"text/html\",\"text/markdown\",\"application/vnd.hasp+json\"] }, { status: 406 });
}

export function notFound() {
  return NextResponse.json({ error: \"hasp:not_found\", status: 404 }, { status: 404 });
}
