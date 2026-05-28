// Schema-only breadcrumbs — emits BreadcrumbList JSON-LD for SEO.
// We don't render visual breadcrumbs on the site; the design uses the nav.
type Crumb = { name: string; url: string };

export function BreadcrumbsLd({ trail }: { trail: Crumb[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
