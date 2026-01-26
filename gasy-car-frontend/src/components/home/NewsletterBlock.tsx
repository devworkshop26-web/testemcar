import { Mail, ArrowRight } from "lucide-react";

/**
 * Newsletter minimaliste et cohérente avec les tailles de textes du design global
 */
export const NewsletterBlock = () => (
  <div className="bg-white p-6 rounded-2xl shadow-xl border border-border/50">

    {/* Header */}
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Mail className="w-5 h-5 text-primary" />
      </div>

      <h3 className="text-base sm:text-lg font-poppins font-semibold text-foreground">
        Newsletter
      </h3>
    </div>

    {/* Email input */}
    <form className="space-y-3">
      <input
        type="email"
        placeholder="Votre email"
        className="w-full px-4 py-3 text-sm bg-muted/40 border border-border rounded-xl 
                   focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all"
        required
      />

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white 
                   hover:bg-primary/90 text-sm font-medium px-4 py-3 rounded-xl transition-all"
      >
        S'inscrire
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>

  </div>
);
