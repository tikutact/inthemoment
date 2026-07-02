import { jsonLd } from "@/lib/structured-data";

// <script type="application/ld+json"> だけを描画する（見た目・DOMに影響しない）
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}
