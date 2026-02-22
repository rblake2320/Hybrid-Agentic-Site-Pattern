import type { SupportedMediaType } from \"@/lib/types\";

export type MediaRange = { type: string; subtype: string; q: number; raw: string };

const SUPPORTED: SupportedMediaType[] = [
  \"text/html\",
  \"text/markdown\",
  \"application/vnd.hasp+json\",
  \"application/json\"
];

export function supportedTypes(): SupportedMediaType[] { return [...SUPPORTED]; }

export function parseAcceptHeader(accept: string | null): MediaRange[] {
  const s = (accept ?? \"\").trim();
  if (!s) return [{ type: \"*\", subtype: \"*\", q: 1, raw: \"*/*\" }];
  const parts = s.split(\",\").map(p=>p.trim()).filter(Boolean);
  const ranges: MediaRange[] = [];
  for (const part of parts) {
    const [media, ...params] = part.split(\";\").map(x=>x.trim());
    const [type=\"*\", subtype=\"*\"] = media.split(\"/\");
    let q = 1;
    for (const param of params) {
      const [k,v] = param.split(\"=\").map(x=>x.trim());
      if (k?.toLowerCase()===\"q\" && v) {
        const n = Number(v);
        if (!Number.isNaN(n)) q = Math.max(0, Math.min(1, n));
      }
    }
    ranges.push({ type: type.toLowerCase(), subtype: subtype.toLowerCase(), q, raw: part });
  }
  ranges.sort((a,b)=>{
    if (b.q!==a.q) return b.q-a.q;
    const aSpec = (a.type===\"*\"?0:1)+(a.subtype===\"*\"?0:1);
    const bSpec = (b.type===\"*\"?0:1)+(b.subtype===\"*\"?0:1);
    return bSpec-aSpec;
  });
  return ranges;
}

export function bestMatch(accept: string | null, offered: SupportedMediaType[] = SUPPORTED): SupportedMediaType | null {
  const ranges = parseAcceptHeader(accept);
  let hasWildcard = false;
  for (const r of ranges) if (r.type===\"*\" || r.subtype===\"*\") hasWildcard = true;

  let best: { type: SupportedMediaType; score: number } | null = null;
  for (const offeredType of offered) {
    const [ot, os] = offeredType.split(\"/\").map(x=>x.toLowerCase());
    for (const r of ranges) {
      if (r.q===0) continue;
      const typeMatch = r.type===\"*\" || r.type===ot;
      const subMatch = r.subtype===\"*\" || r.subtype===os;
      if (!typeMatch || !subMatch) continue;
      const specificity = (r.type===\"*\"?0:1)+(r.subtype===\"*\"?0:1);
      const score = r.q*10 + specificity;
      if (!best || score>best.score) best = { type: offeredType, score };
    }
  }
  if (!best) {
    if (!accept || hasWildcard) return \"text/html\";
    return null;
  }
  return best.type;
}
