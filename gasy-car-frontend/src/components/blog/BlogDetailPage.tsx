import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar, Clock, ChevronRight, Quote } from "lucide-react";
import { BlogSection } from "@/types/blogTypes";
import { useBlogPost } from "@/useQuery/useBlogQueries";
import { cn } from "@/lib/utils";

const cdnUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_MEDIA_BASE_URL ?? ""}${url}`;
};

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useBlogPost(slug || "");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="space-y-4 pt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Article introuvable</h1>
        <p className="mt-4 text-muted-foreground max-w-md">
          L’article que vous recherchez n’existe pas ou a été déplacé.
        </p>
        <Button asChild className="mt-8" size="lg">
          <Link to="/blog">Retour au blog</Link>
        </Button>
      </div>
    );
  }

  const post = data;
  const readingTime = Math.max(
    3,
    Math.round(
      ((post.excerpt || "").length +
        post.sections.reduce((acc, s) => acc + (s.body?.length || 0), 0)) /
        800
    )
  );

  return (
    <article className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full bg-muted/30 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground truncate max-w-[200px]">
              {post.title}
            </span>
          </nav>

          <div className="space-y-6 text-center sm:text-left">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium">
              Blog Madagasycar
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {post.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4 justify-center sm:justify-start">
              {post.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min de lecture</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-10 pb-20">
        {/* Cover Image */}
        {post.cover_image ? (
          <div className="rounded-3xl overflow-hidden shadow-xl border bg-background aspect-[21/9] w-full">
            <img
              src={cdnUrl(post.cover_image)}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-12" /> /* Spacer if no image to pull content up slightly less */
        )}

        <div className="mt-12 lg:mt-16 space-y-16">
          {/* Intro / Excerpt */}
          {post.excerpt && (
            <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
              <p className="lead text-2xl font-medium text-foreground/80 leading-relaxed border-l-4 border-primary pl-6 italic">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Dynamic Sections */}
          <div className="space-y-20">
            {post.sections.map((section) => (
              <BlogSectionBlock key={section.id} section={section} />
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-20 rounded-3xl bg-primary/5 border border-primary/10 p-8 sm:p-12 text-center sm:text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <h2 className="text-2xl font-bold tracking-tight">
                  Envie de découvrir Madagascar ?
                </h2>
                <p className="text-muted-foreground text-lg">
                  Réservez votre véhicule idéal dès maintenant et partez à l'aventure en toute sérénité.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all">
                  <Link to="/allcars">
                    Réserver un véhicule
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-background/50 backdrop-blur-sm">
                  <Link to="/login">Devenir prestataire</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function BlogSectionBlock({ section }: { section: BlogSection }) {
  const hasImage = !!section.image;
  const hasList = !!section.list_items?.length;

  const Content = () => (
    <div className="space-y-6">
      {section.highlight_label && (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
          {section.highlight_label}
        </Badge>
      )}
      
      {section.title && (
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          {section.title}
        </h2>
      )}
      
      {section.body && (
        <div className="prose prose-lg prose-stone dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
          <p className="whitespace-pre-line">{section.body}</p>
        </div>
      )}

      {hasList && (
        <ul className="space-y-3 mt-4">
          {section.list_items!.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-muted-foreground">
              <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {section.cta_url && section.cta_label && (
        <div className="pt-4">
          <Button asChild variant="link" className="px-0 text-primary font-semibold text-lg h-auto hover:no-underline group">
            <a href={section.cta_url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              {section.cta_label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );

  const ImageBlock = () => (
    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-muted aspect-[4/3] w-full group">
      <img
        src={cdnUrl(section.image)}
        alt={section.title || "Illustration"}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>
  );

  if (section.layout === "QUOTE") {
    return (
      <section className="my-12 relative">
        <div className="absolute left-0 top-0 -translate-x-2 -translate-y-4 text-primary/10">
          <Quote className="h-24 w-24 rotate-180" />
        </div>
        <blockquote className="relative z-10 pl-8 sm:pl-12 border-l-4 border-primary py-4">
          {section.title && (
            <cite className="block mb-4 text-sm font-bold uppercase tracking-widest text-primary not-italic">
              {section.title}
            </cite>
          )}
          {section.body && (
            <p className="text-2xl sm:text-3xl font-medium leading-relaxed text-foreground italic">
              "{section.body}"
            </p>
          )}
        </blockquote>
      </section>
    );
  }

  if (section.layout === "FULL") {
    return (
      <section className="space-y-8">
        {hasImage && (
          <div className="rounded-3xl overflow-hidden shadow-lg bg-muted aspect-[21/9] w-full group">
            <img
              src={cdnUrl(section.image)}
              alt={section.title || ""}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
        <div className="max-w-3xl mx-auto">
          <Content />
        </div>
      </section>
    );
  }

  return (
    <section className={cn(
      "grid gap-8 lg:gap-12 items-center",
      hasImage ? "lg:grid-cols-2" : "max-w-3xl mx-auto"
    )}>
      {section.layout === "IMAGE_LEFT" && hasImage ? (
        <>
          <ImageBlock />
          <div><Content /></div>
        </>
      ) : section.layout === "IMAGE_RIGHT" && hasImage ? (
        <>
          <div className="order-2 lg:order-1"><Content /></div>
          <div className="order-1 lg:order-2"><ImageBlock /></div>
        </>
      ) : (
        <div className="col-span-full"><Content /></div>
      )}
    </section>
  );
}
