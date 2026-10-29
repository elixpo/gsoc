/**
 * A deliberately small frontmatter parser for the YAML subset used in
 * content/: scalars (strings, numbers, null, booleans), inline empty lists
 * (`[]`) and block lists (`- item`). It throws on anything else so that a
 * content mistake fails the build instead of rendering silently.
 */
export type FrontmatterValue = string | number | boolean | null | string[];
export type Frontmatter = Record<string, FrontmatterValue>;

function scalar(raw: string): string | number | boolean | null {
  const value = raw.trim();
  if (value === "null" || value === "~" || value === "") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

export function parseFrontmatter(source: string, file: string): { data: Frontmatter; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`${file}: missing frontmatter block`);
  const [, head, body] = match;
  const data: Frontmatter = {};
  let listKey: string | null = null;

  for (const line of head.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const item = /^\s+-\s+(.*)$/.exec(line);
    if (item) {
      if (!listKey) throw new Error(`${file}: list item without a key: ${line}`);
      (data[listKey] as string[]).push(String(scalar(item[1])));
      continue;
    }
    const pair = /^([A-Za-z_][\w-]*):(?:\s(.*))?$/.exec(line);
    if (!pair) throw new Error(`${file}: unsupported frontmatter line: ${line}`);
    const [, key, rawValue = ""] = pair;
    if (key in data) throw new Error(`${file}: duplicate key ${key}`);
    if (rawValue.trim() === "") {
      data[key] = [];
      listKey = key;
    } else if (rawValue.trim() === "[]") {
      data[key] = [];
      listKey = null;
    } else {
      data[key] = scalar(rawValue);
      listKey = null;
    }
  }
  return { data, body };
}
