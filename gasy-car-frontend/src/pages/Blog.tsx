import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, Sparkles, BookOpen, MapPinned } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useBlogPosts } from "@/useQuery/useBlogQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { SideContent } from "@/components/home/SideContent";

const Blog = () => {
  const ref1 = useScrollAnimation();
  const { data: blogPosts, isLoading } = useBlogPosts();

  const cdnUrl = (url?: string | null) => {
    if (!url) return "/placeholder.svg";
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_MEDIA_BASE_URL ?? ""}${url}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/60 to-white">
      {/* HERO */}
      <section className="relative min-h-[72vh] sm:min-h-[78vh] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1920"
          alt="Blog voyage Madagascar"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A]/90 via-[#0D1B2A]/70 to-[#082F49]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute -top-20 -left-16 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl animate-pulse" />

        <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 w-full py-20">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-4 py-2 mb-6 shadow-lg">
              {/* <Sparkles className="w-4 h-4 text-emerald-300" /> */}
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white/95">
                Guides, conseils & inspiration
              </span>
            </div>

            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
              Blog{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-sky-300 to-blue-400">
                Madagasycar
              </span>
            </h1>

            <p className="text-white/80 text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed mb-8">
              Conseils pratiques, idées de road trips, astuces location et actualités
              pour explorer Madagascar avec plus de confiance et de sérénité.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl">
              <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md px-4 py-4 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-emerald-300" />
                  <span className="text-sm font-semibold">Guides utiles</span>
                </div>
                <p className="text-xs sm:text-sm text-white/75">
                  Préparer votre location et vos trajets facilement.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md px-4 py-4 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MapPinned className="w-4 h-4 text-emerald-300" />
                  <span className="text-sm font-semibold">Destinations</span>
                </div>
                <p className="text-xs sm:text-sm text-white/75">
                  Découvrir les meilleures idées de voyage à Madagascar.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md px-4 py-4 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span className="text-sm font-semibold">Astuces</span>
                </div>
                <p className="text-xs sm:text-sm text-white/75">
                  Voyager plus malin avec des conseils clairs et concrets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT + SIDEBAR */}
      <div className="px-4 sm:px-6 lg:px-10 xl:px-12 max-w-[1380px] mx-auto py-10 sm:py-12 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
          {/* MAIN CONTENT */}
          <div className="w-full lg:w-[79%] xl:w-[80%] min-w-0" ref={ref1}>
            <div className="mb-8 sm:mb-10">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Nos articles
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-2 mb-3">
                Inspiration & conseils pour vos trajets
              </h2>
              <p className="text-slate-500 text-base md:text-lg max-w-2xl">
                Retrouvez des contenus utiles pour mieux louer, mieux voyager et mieux profiter de Madagascar.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="rounded-[1.75rem] overflow-hidden border border-slate-200 bg-white shadow-sm"
                  >
                    <Skeleton className="h-52 w-full" />
                    <div className="p-5 space-y-4">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-6 w-5/6" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-28 mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                {blogPosts?.map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group block animate-in fade-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <Card className="h-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                      <CardContent className="p-0 h-full flex flex-col">
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={cdnUrl(post.cover_image)}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/90 text-[#0D1B2A] hover:bg-white font-medium shadow">
                              Blog
                            </Badge>
                          </div>

                          {post.published_at && (
                            <div className="absolute bottom-4 left-4">
                              <div className="inline-flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur-md px-3 py-1.5 text-white text-xs border border-white/10">
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="capitalize">{formatDate(post.published_at)}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>

                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-5">
                            {post.excerpt}
                          </p>

                          <div className="mt-auto pt-4 border-t border-slate-100">
                            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                              <span>Lire l’article</span>
                              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {!isLoading && blogPosts?.length === 0 && (
              <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm text-center py-16 px-6">
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                  Aucun article disponible
                </h3>
                <p className="text-slate-500 text-base">
                  Les prochains contenus du blog seront bientôt publiés.
                </p>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <SideContent />
        </div>
      </div>
    </div>
  );
};

export default Blog;