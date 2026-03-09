import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export type HelpArticleAnchor = {
  id: string;
  label: string;
};

type HelpArticleLayoutProps = {
  breadcrumbs: string[];
  title: string;
  intro?: string;
  anchors: HelpArticleAnchor[];
  children: React.ReactNode;
};

export function HelpArticleLayout({
  breadcrumbs,
  title,
  intro,
  anchors,
  children,
}: HelpArticleLayoutProps) {
  return (
    <main className="bg-white pb-20 text-[#121214]">
      <section className="mx-auto grid w-full max-w-6xl gap-16 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
        <article>
          <nav className="mb-10 text-sm text-gray-500">
            {breadcrumbs.map((item, index) => (
              <span key={item}>
                {index > 0 && <span className="mx-2">•</span>}
                {index === 0 ? (
                  <Link to="/faq" className="hover:text-indigo-600">
                    {item}
                  </Link>
                ) : (
                  item
                )}
              </span>
            ))}
          </nav>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
          {intro ? <p className="mt-4 text-base leading-7 text-gray-700">{intro}</p> : null}
          <Separator className="my-8" />

          <div className="space-y-8 [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:text-2xl [&_h3]:font-semibold [&_p]:leading-7 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
            {children}
          </div>
        </article>

        <aside className="sticky top-24 hidden self-start rounded-lg border border-gray-200 bg-[#fafafa] p-5 lg:block">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
            Dans cet article
          </h2>
          <ul className="mt-4 space-y-3">
            {anchors.map((anchor) => (
              <li key={anchor.id}>
                <a
                  href={`#${anchor.id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {anchor.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
