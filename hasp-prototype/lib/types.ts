export type SupportedMediaType = \"text/html\" | \"text/markdown\" | \"application/vnd.hasp+json\" | \"application/json\";

export type ActionSpec = {
  name: string;
  method: \"GET\" | \"POST\" | \"PUT\" | \"PATCH\" | \"DELETE\";
  endpoint: string;
  auth: \"none\" | \"bearer\";
  scopes?: string[];
  idempotency?: { required: boolean; header: string; ttl_seconds: number };
  dry_run?: { supported: boolean; header: string };
  params?: Array<{ name: string; in: \"header\" | \"query\" | \"body\"; required: boolean; schema: unknown }>;
};

export type ResourceKind = \"product\" | \"doc\" | \"support\" | \"api\";

export type Resource = {
  id: string;
  kind: ResourceKind;
  path: string;
  title: string;
  summary: string;
  lastModified: string;
  schemaOrg: Record<string, unknown>;
  content: { sections: Array<{ heading: string; body: string; bullets?: string[] }> };
  facts?: Record<string, string | number | boolean>;
  actions: ActionSpec[];
};

export type JsonSchemaLite = {
  type: \"object\";
  required?: string[];
  properties: Record<string, { type: \"string\" | \"number\" | \"boolean\"; minLength?: number; min?: number }>;
};

export function validateJson(value: unknown, schema: JsonSchemaLite):
  | { ok: true; value: unknown }
  | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (schema.type !== \"object\" || typeof value !== \"object\" || value === null || Array.isArray(value)) {
    return { ok: false, errors: [\"Body must be a JSON object\"] };
  }
  const obj = value as Record<string, unknown>;
  for (const req of schema.required ?? []) if (!(req in obj)) errors.push(`Missing required field: ${req}`);
  for (const [k, rules] of Object.entries(schema.properties)) {
    if (!(k in obj)) continue;
    const v = obj[k];
    if (rules.type === \"string\") {
      if (typeof v !== \"string\") errors.push(`${k} must be string`);
      if (typeof v === \"string\" && rules.minLength && v.length < rules.minLength) errors.push(`${k} too short`);
    }
    if (rules.type === \"number\") {
      if (typeof v !== \"number\" || Number.isNaN(v)) errors.push(`${k} must be number`);
      if (typeof v === \"number\" && rules.min !== undefined && v < rules.min) errors.push(`${k} must be >= ${rules.min}`);
    }
    if (rules.type === \"boolean\") {
      if (typeof v !== \"boolean\") errors.push(`${k} must be boolean`);
    }
  }
  return errors.length ? { ok: false, errors } : { ok: true, value };
}
