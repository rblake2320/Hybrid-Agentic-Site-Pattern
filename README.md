# Hybrid Agentic Site Pattern (HASP) – Prototype (Next.js App Router)

This repo is a production-grade prototype of **HASP**: serve humans and AI agents from the **same URLs** using **real HTTP content negotiation**, with:

- `Accept`-driven representation selection (q-values, wildcards)
- `Vary: Accept` and representation-safe caching
- Enforced AI policy (purpose headers, training-block, path denies)
- Auth-gated actions (OAuth2/JWT Bearer)
- Integrity hashing per response + drift check endpoint
- `.well-known` discovery endpoints (manifest, policy, agent card)
- Action/tool contract (HASP JSON + MCP tools manifest)
- Structured machine-readable errors for policy violations

## Quick start

**Requirements:** Node.js **20+** (recommended: Node 24 LTS).

```bash
npm install
cp .env.example .env.local
# edit .env.local and set HASP_JWT_SECRET
npm run dev
```

Open:
- UI demo: http://localhost:3000/hasp-demo
- Example content:
  - /products/quantum-x1
  - /docs/getting-started
  - /support/tickets

## Tests

```bash
npm test
```

## Example curl (content negotiation)

HTML:
```bash
curl -i http://localhost:3000/products/quantum-x1 -H 'Accept: text/html'
```

Markdown:
```bash
curl -i http://localhost:3000/products/quantum-x1 -H 'Accept: text/markdown' -H 'User-Agent: agent/1.0' -H 'X-Agent-Purpose: browsing'
```

HASP JSON:
```bash
curl -i http://localhost:3000/products/quantum-x1 -H 'Accept: application/vnd.hasp+json' -H 'User-Agent: agent/1.0' -H 'X-Agent-Purpose: browsing'
```

Mixed q-values (best match):
```bash
curl -i http://localhost:3000/products/quantum-x1 \
  -H 'Accept: text/markdown;q=0.9, text/html;q=0.1' \
  -H 'User-Agent: agent/1.0' -H 'X-Agent-Purpose: browsing'
```

406 Not Acceptable demo:
```bash
curl -i http://localhost:3000/products/quantum-x1 -H 'Accept: application/xml'
```

## Actions: POST /api/orders

### Generate a dev token (HS256)

```bash
node -e "import { SignJWT } from 'jose'; const secret=new TextEncoder().encode(process.env.HASP_JWT_SECRET||'change-me'); const jwt=await new SignJWT({scope:'orders:write orders:read support:read audit:read'}).setProtectedHeader({alg:'HS256'}).setSubject('demo-user').setIssuedAt().setExpirationTime('2h').sign(secret); console.log(jwt);"
```

