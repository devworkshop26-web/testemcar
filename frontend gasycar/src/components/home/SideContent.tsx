// src/components/home/SideContent.tsx

import { Link } from "react-router-dom";
import { Zap, MessageCircle, ArrowRight } from "lucide-react";
import { NewsletterBlock } from "./NewsletterBlock";
import { essentialContent } from "@/data/homeData";
import { useBlogPosts } from "@/useQuery/useBlogQueries";
import { Skeleton } from "@/components/ui/skeleton";

const cdnUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_MEDIA_BASE_URL ?? ""}${url}`;
};

/**
 * Sidebar fixe, minimaliste et cohérente avec PopularVehicles
 */
export const SideContent = () => {
  const { data: blogPosts, isLoading } = useBlogPosts();

  // Get only the latest 3 posts
  const recentPosts = blogPosts?.slice(0, 3);

  return (
    <div className="w-full lg:w-96 xl:w-1/4 lg:flex-shrink-0 lg:ml-8">
      <div className="hidden lg:block sticky top-24 space-y-8 mt-10">
        {/* Essentiel */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-border/50">
          <h3 className="text-lg font-poppins font-semibold text-foreground mb-4 flex items-center">
            <Zap className="w-4 h-4 text-primary mr-2" />
            Essentiel & Aide Rapide
          </h3>

          <ul className="space-y-1.5">
            {essentialContent?.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  className="flex items-center px-3 py-2 rounded-xl hover:bg-primary/5 
                           transition-colors group"
                >
                  <item.icon
                    className="w-4 h-4 text-muted-foreground 
                                       group-hover:text-primary mr-3 flex-shrink-0"
                  />
                  <span
                    className="font-medium text-sm text-foreground 
                                 group-hover:text-primary transition-colors"
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Blog */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-poppins font-semibold text-foreground flex items-center">
              <MessageCircle className="w-4 h-4 text-primary mr-2" />
              Derniers Articles
            </h3>
            <Link to="/blog" className="text-xs text-primary hover:underline font-medium">
              Voir tout
            </Link>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))
            ) : recentPosts && recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="flex gap-3 group items-start"
                >
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-border/50">
                    {post.cover_image ? (
                      <img
                        src={cdnUrl(post.cover_image)}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/5 text-primary">
                        <MessageCircle className="h-6 w-6 opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    {post.published_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(post.published_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun article pour le moment.
              </p>
            )}
          </div>
        </div>

        {/* Newsletter */}
        {/* <NewsletterBlock /> */}

        {/* CTA Chauffeur */}
        <div className="p-6 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors" />
          
          <h4 className="text-xl font-poppins font-semibold mb-3 relative z-10">
            Besoin d'un chauffeur ?
          </h4>

          <p className="text-xs mb-5 opacity-90 leading-relaxed relative z-10">
            Réservez nos chauffeurs certifiés pour une tranquillité d'esprit
            totale lors de vos déplacements.
          </p>

          <Link
            to="/allcars"
            className="inline-flex items-center justify-center bg-white text-primary hover:bg-white/90 
                     text-xs px-5 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl relative z-10 font-poppins"
          >
            Réserver maintenant
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
