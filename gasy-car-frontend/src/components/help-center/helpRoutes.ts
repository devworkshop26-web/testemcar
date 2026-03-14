export const staticArticleRoutes: Record<string, string> = {
  "Messagerie avec votre hôte": "/faq/messagerie-avec-votre-hote",
  "Annuler un voyage avec votre hôte": "/faq/annuler-voyage-avec-votre-hote",
  Remboursements: "/faq/article/remboursements",
  "Prise en charge et retour": "/faq/article/prise-en-charge-et-retour",
  "Méthodes de paiement acceptées": "/faq/article/methodes-de-paiement-acceptees",
  "Admissibilité du conducteur": "/faq/article/admissibilite-du-conducteur",
  "Coût d'un voyage": "/faq/article/cout-d-un-voyage",
  "Prolonger un voyage": "/faq/article/prolonger-un-voyage",
  "Numéros d'assistance routière": "/faq/article/numeros-d-assistance-routiere",
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
