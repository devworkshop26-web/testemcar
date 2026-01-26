import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import WhiteLogo from "@/components/WhiteLogo";

const Footer = () => {
  return (
    <footer className="bg-foreground text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <WhiteLogo size={110} />
            </Link>
            <p className="text-white/70 font-roboto text-sm mb-6">
              La plateforme de location de voitures de confiance à Madagascar.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Explorer */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Explorer</h3>
            <ul className="space-y-3 font-roboto text-sm">
              <li><a href="#" className="text-white/70 hover:text-secondary transition-colors">Louer une voiture</a></li>
              <li><a href="#" className="text-white/70 hover:text-secondary transition-colors">Aéroport Ivato</a></li>
              <li><a href="#" className="text-white/70 hover:text-secondary transition-colors">Location mensuelle</a></li>
              <li><a href="#" className="text-white/70 hover:text-secondary transition-colors">Avec livraison</a></li>
            </ul>
          </div>

          {/* Propriétaires */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Propriétaires</h3>
            <ul className="space-y-3 font-roboto text-sm">
              <li><a href="#" className="text-white/70 hover:text-secondary transition-colors">Devenir propriétaire</a></li>
              <li><a href="#" className="text-white/70 hover:text-secondary transition-colors">Ajouter un véhicule</a></li>
              <li><a href="#" className="text-white/70 hover:text-secondary transition-colors">Tableau de bord</a></li>
              <li><a href="#" className="text-white/70 hover:text-secondary transition-colors">Assurance & Protection</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3 font-roboto text-sm">
              <li><a href="#" className="text-white/70 hover:text-secondary transition-colors">Comment ça marche</a></li>
              <li><a href="#" className="text-white/70 hover:text-secondary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-white/70 hover:text-secondary transition-colors">Conditions d'utilisation</a></li>
              <li><a href="#" className="text-white/70 hover:text-secondary transition-colors">Politique de confidentialité</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Powered by */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/60 font-roboto text-sm text-center md:text-left">
            © 2025 MadagasyCar. Tous droits réservés.
          </p>

          {/* Logo Kinva Dynamique */}
          <a 
            href="https://www.kinva.tech/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-2 hover:opacity-80 transition-all"
          >
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold group-hover:text-white/60 transition-colors">
              Powered by
            </span>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 group-hover:bg-white/10 transition-colors">
              <span className="text-white font-bold text-lg tracking-tighter font-poppins">
                Kinva
              </span>
              <div className="flex gap-1 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#FF5F5F] shadow-[0_0_8px_rgba(255,95,95,0.4)]"></span>
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.4)]"></span>
                <span className="w-2 h-2 rounded-full bg-[#00D1B2] shadow-[0_0_8px_rgba(0,209,178,0.4)]"></span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;