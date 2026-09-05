import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

/** Converts a Markdown body (as written in Decap CMS) into sanitized-ish HTML for rendering. */
export async function renderMarkdown(source: string): Promise<string> {
  const result = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(source);
  return result.toString();
}
