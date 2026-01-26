import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
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

  // --- MODIFICATION : Fonction pour formater la date (ex: 03 oct. 2025) ---
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Brouillon";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">

      {/* HERO */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-bold mb-4 sm:mb-6">
            Blog Madagasycar
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
            Conseils, guides et actualités pour vos voyages à Madagascar
          </p>
        </div>
      </section>

      {/* CONTENT + SIDEBAR */}
      <div className="px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto py-12 sm:py-16 md:py-20">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* MAIN CONTENT */}
          <div className="w-full lg:w-3/4" ref={ref1}>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {blogPosts?.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`}>
                    <Card className="card-lift h-full border-none shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="h-48 overflow-hidden rounded-t-xl relative">
                          <img
                            src={cdnUrl(post.cover_image)}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/90 text-primary hover:bg-white font-medium font-poppins">
                              Blog
                            </Badge>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {/* --- MODIFICATION ICI : Utilisation de formatDate --- */}
                              <span className="capitalize">
                                {formatDate(post.published_at)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>
                                {Math.max(
                                  3,
                                  Math.round(
                                    ((post.excerpt?.length || 0) +
                                      post.sections.reduce(
                                        (acc, s) => acc + (s.body?.length || 0),
                                        0
                                      )) /
                                      800
                                  )
                                )}{" "}
                                min
                              </span>
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
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  Aucun article disponible pour le moment.
                </p>
              </div>
            )}
          </div>

          {/* ---- SIDEBAR RIGHT ---- */}
          <SideContent />
        </div>
      </div>

    </div>
  );
};

export default Blog;