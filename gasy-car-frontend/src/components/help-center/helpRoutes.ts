export const staticArticleRoutes: Record<string, string> = {
  "Messagerie avec votre hôte": "/faq/messagerie-avec-votre-hote",
  "Annuler un voyage avec votre hôte": "/faq/annuler-voyage-avec-votre-hote",
};

export function slugifyHelpLabel(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildHelpArticleRoute(title: string): string {
  const knownRoute = staticArticleRoutes[title];
  if (knownRoute) {
    return knownRoute;
  }

  const slug = slugifyHelpLabel(title);
  return `/faq/article/${slug}?title=${encodeURIComponent(title)}`;
}

export function buildHelpCategoryRoute(label: string): string {
  const slug = slugifyHelpLabel(label);
  return `/faq/categorie/${slug}?title=${encodeURIComponent(label)}`;
}
