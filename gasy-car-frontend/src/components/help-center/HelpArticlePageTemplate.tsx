import {
  HelpArticleLayout,
  type HelpArticleAnchor,
} from "@/components/help-center/HelpArticleLayout";

export type HelpArticleSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type HelpArticlePageTemplateProps = {
  title: string;
  intro: string;
  breadcrumbs?: string[];
  sections: HelpArticleSection[];
};

export function HelpArticlePageTemplate({
  title,
  intro,
  breadcrumbs = ["Centre d'aide", "Article"],
  sections,
}: HelpArticlePageTemplateProps) {
  const anchors: HelpArticleAnchor[] = sections.map((section) => ({
    id: section.id,
    label: section.title,
  }));

  return (
    <HelpArticleLayout
      breadcrumbs={breadcrumbs}
      title={title}
      intro={intro}
      anchors={anchors}
    >
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="space-y-4">
          <h2>{section.title}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.bullets?.length ? (
            <ul>
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </HelpArticleLayout>
  );
}
