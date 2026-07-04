// Renders a schema.org JSON-LD <script> for rich results (Google can show
// star ratings, price, etc. in search). Server Component — drop it anywhere in
// a page's tree. The `<` escaping prevents a stray "</script>" in any
// user-generated field (hotel/review text) from breaking out of the script.

export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
