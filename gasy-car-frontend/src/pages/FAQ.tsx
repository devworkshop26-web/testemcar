import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Ajout de CardHeader/Title
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
// import ChatBubble from "@/components/ChatBubble";
import { Search, Phone, Mail, MessageCircle, Car, Shield, FileText, CreditCard, ChevronRight } from "lucide-react"; // Ajout de ChevronRight
import { useState } from "react";

// (Les données faqs, contactMethods restent inchangées)
// ... (faqs data) ...

// ** Définition des données pour la lisibilité **
const faqs = [
    // ... (Vos données faqs) ...
    {
        category: "Réservation & Location",
        icon: <Car className="w-6 h-6" />,
        questions: [
            {
                q: "Comment réserver une voiture sur Madagasycar ?",
                a: "Recherchez le véhicule qui vous convient selon vos dates et préférences, sélectionnez vos options, puis cliquez sur 'Réserver maintenant'. Suivez les étapes simples pour finaliser votre réservation en quelques minutes."
            },
            {
                q: "Puis-je modifier ou annuler ma réservation ?",
                a: "Oui, vous pouvez modifier ou annuler votre réservation jusqu'à 24h avant la prise en charge sans frais. Passé ce délai, des frais d'annulation peuvent s'appliquer selon la politique du propriétaire."
            },
            {
                q: "Quelle est la durée minimale de location ?",
                a: "La durée minimale est de 24 heures. Nous proposons des tarifs dégressifs pour les locations longue durée (7+ jours)."
            },
            {
                q: "Puis-je prolonger ma location ?",
                a: "Oui, contactez le propriétaire et notre service client au moins 24h avant la fin de votre location pour une prolongation."
            }
        ]
    },
    {
        category: "Assurance & Sécurité",
        icon: <Shield className="w-6 h-6" />,
        questions: [
            {
                q: "Quelle assurance est incluse dans la location ?",
                a: "Tous nos véhicules bénéficient d'une assurance tous risques complète incluant la responsabilité civile, le vol et les dommages collision. Une franchise standard s'applique selon le véhicule."
            },
            {
                q: "Que faire en cas d'accident ou de panne ?",
                a: "1. Sécurisez les personnes 2. Appelez les secours si nécessaire 3. Contactez immédiatement notre assistance 24h/24 au +261 34 00 000 00 4. Prenez des photos des dégâts"
            },
            {
                q: "La caution est-elle obligatoire ?",
                a: "Oui, une caution de garantie est requise pour chaque location. Elle est bloquée sur votre carte et libérée dans les 7 jours après restitution du véhicule sans dommage."
            }
        ]
    },
    {
        category: "Documents Requis",
        icon: <FileText className="w-6 h-6" />,
        questions: [
            {
                q: "Quels documents dois-je présenter ?",
                a: "• Carte d'identité nationale valide ou passeport\n• Permis de conduire en cours de validité (minimum 2 ans)\n• Carte de crédit au nom du conducteur principal\n• Justificatif de domicile récent"
            },
            {
                q: "Puis-je louer avec un permis de conduire étranger ?",
                a: "Oui, les permis internationaux sont acceptés. Un permis européen ou un permis avec traduction officielle est requis pour les conducteurs non-malgaches."
            },
            {
                q: "Y a-t-il une limite d'âge pour louer ?",
                a: "L'âge minimum est de 21 ans. Les conducteurs de 21 à 24 ans peuvent être soumis à un supplément jeune conducteur."
            }
        ]
    },
    {
        category: "Paiement & Tarifs",
        icon: <CreditCard className="w-6 h-6" />,
        questions: [
            {
                q: "Quels moyens de paiement sont acceptés ?",
                a: "• Cartes bancaires (Visa, Mastercard)\n• Mobile Money (MVola, Orange Money, Airtel Money)\n• Virement bancaire\n• Espèces (uniquement pour la caution dans certains cas)"
            },
            {
                q: "Que comprend le prix de la location ?",
                a: "Le prix inclut : l'assurance tous risques, l'assistance routière 24h/24, les kilomètres illimités, et la TVA. Le carburant et les péages sont à votre charge."
            },
            {
                q: "Y a-t-il des frais supplémentaires ?",
                a: "Des suppléments peuvent s'appliquer pour : conducteur supplémentaire, siège bébé, GPS, retour dans une autre agence, ou nettoyage spécial si nécessaire."
            }
        ]
    },
    {
        category: "Livraison & Retour",
        icon: <Car className="w-6 h-6" />,
        questions: [
            {
                q: "Puis-je me faire livrer le véhicule ?",
                a: "Oui, nous proposons la livraison à domicile ou à votre hôtel dans Antananarivo, Tamatave et Diego. Des frais de livraison peuvent s'appliquer selon la distance."
            },
            {
                q: "Quelles sont les heures de prise et retour ?",
                a: "Flexibles ! Prise de véhicule à partir de 14h et retour avant 11h. Des arrangements sont possibles selon disponibilité."
            },
            {
                q: "Que se passe-t-il si je rends le véhicule en retard ?",
                a: "Des frais de retard équivalents à une journée supplémentaire sont appliqués. Contactez-nous à l'avance pour toute modification."
            }
        ]
    }
];

const contactMethods = [
    {
        icon: <Phone className="w-6 h-6" />,
        title: "Appelez-nous",
        description: "Lun - Dim, 6h - 22h",
        contact: "+261 34 00 000 00",
        action: "tel:+261340000000"
    },
    {
        icon: <Mail className="w-6 h-6" />,
        title: "Envoyez un email",
        description: "Réponse sous 24h",
        contact: "support@gasycar.mg",
        action: "mailto:support@gasycar.mg"
    },
    {
        icon: <MessageCircle className="w-6 h-6" />,
        title: "Chat en direct",
        description: "Assistance immédiate",
        contact: "Ouvrir le chat",
        action: "#chat"
    }
];
// ** Fin Définition des données **


const FAQ = () => {
  const ref1 = useScrollAnimation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(faqs[0].category); // Set first category as default active

  const filteredFaqs = faqs
    .map(category => ({
      ...category,
      questions: category.questions.filter(faq =>
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => category.questions.length > 0);

  const activeFaqCategory = activeCategory === "all" ? filteredFaqs.flatMap(cat => cat.questions) : filteredFaqs.find(c => c.category === activeCategory)?.questions || [];
  
  // Utilise la première catégorie trouvée ou la première si "all" n'est pas utilisé
  const displayCategory = activeFaqCategory.length > 0 ? filteredFaqs.find(c => c.category === activeCategory) || filteredFaqs[0] : null;


  return (
    <div className="min-h-screen bg-white">
      <div>
        
        {/* 1. Hero Section avec Barre de Recherche intégrée */}
        <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-primary to-blue-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-extrabold mb-3 sm:mb-4 leading-tight px-4">
                Centre d'Aide
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 px-4">
                Trouvez rapidement les réponses à vos questions.
              </p>

              {/* Barre de recherche améliorée */}
              <div className="relative max-w-2xl mx-auto px-4">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher 'assurance', 'annulation' ou 'paiement'..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 h-12 sm:h-14 rounded-xl bg-white text-sm sm:text-base text-gray-800 placeholder-gray-500 border-2 border-primary focus:border-blue-500 focus:ring-0 shadow-lg transition-all duration-300"
                />
              </div>

            </div>
          </div>
        </section>

        {/* 2. Contenu FAQ avec mise en page à deux colonnes */}
        <section className="py-12 sm:py-16 md:py-20 bg-slate-50" ref={ref1}>
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12">

                {/* Colonne de gauche: Navigation Catégories (Sticky) */}
                <div className="lg:col-span-4 mb-8 sm:mb-10 lg:mb-0">
                    <Card className="p-3 sm:p-4 rounded-xl shadow-xl lg:sticky lg:top-24 border-2 border-primary/10">
                        <CardHeader className="p-3 sm:p-4 pb-2">
                            <CardTitle className="text-lg sm:text-xl font-poppins font-bold text-gray-800">Parcourir les thèmes</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 space-y-1">
                            {faqs.map((category) => (
                                <button
                                    key={category.category}
                                    onClick={() => setActiveCategory(category.category)}
                                    className={`w-full text-left flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
                                        activeCategory === category.category
                                            ? "bg-primary text-white shadow-md font-bold"
                                            : "bg-transparent text-gray-700 hover:bg-gray-100 font-medium"
                                    }`}
                                >
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${activeCategory === category.category ? "bg-white/20" : "text-primary bg-primary/10"}`}>
                                        {category.icon}
                                    </div>
                                    <span className="flex-1">{category.category}</span>
                                    <ChevronRight className={`w-3 h-3 sm:w-4 sm:h-4 ml-auto transition-transform ${activeCategory === category.category ? "" : "text-gray-400"}`} />
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Colonne de droite: Questions/Réponses (Accordion) */}
                <div className="lg:col-span-8">
                    {activeFaqCategory.length === 0 ? (
                        <div className="text-center py-12 sm:py-16 md:py-20 bg-white rounded-xl shadow-lg border border-gray-100 px-4">
                            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                            <h3 className="text-lg sm:text-xl md:text-2xl font-poppins font-bold text-gray-600 mb-2">
                                {searchTerm ? "Aucun résultat trouvé pour votre recherche." : `La catégorie '${activeCategory}' est vide.`}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500">
                                Essayez d'autres termes de recherche ou sélectionnez une autre catégorie.
                            </p>
                        </div>
                    ) : (
                        <div className="mb-12 sm:mb-16">
                            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 p-3 sm:p-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                    {displayCategory?.icon}
                                </div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-poppins font-bold text-gray-900">
                                    {displayCategory?.category}
                                </h2>
                            </div>
                            
                            <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
                                <CardContent className="p-0">
                                    <Accordion type="single" collapsible className="w-full">
                                        {activeFaqCategory.map((faq, qIdx) => (
                                            <AccordionItem 
                                                key={qIdx} 
                                                value={`item-${qIdx}`}
                                                className="border-b border-gray-100 last:border-b-0"
                                            >
                                                <AccordionTrigger className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 hover:bg-gray-50 transition-colors text-left group">
                                                    <span className="text-sm sm:text-base md:text-lg font-poppins font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                                        {faq.q}
                                                    </span>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-5 pt-1 bg-blue-50/20">
                                                    <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                                                        {faq.a}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

            </div>
          </div>
        </section>

        {/* 3. Contact Section (Améliorée) */}
        {/* <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-poppins font-extrabold mb-4">
                Besoin d'aide personnalisée ?
              </h2>
              <p className="text-xl text-blue-200">
                Notre équipe est à votre écoute. Choisissez votre méthode de contact préférée.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {contactMethods.map((method, index) => (
                <a href={method.action} key={index} className="block group">
                    <Card className="bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                        <CardContent className="p-8">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300">
                                <div className="text-white transform group-hover:scale-110 transition-transform">
                                    {method.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-poppins font-bold mb-1">{method.title}</h3>
                            <p className="text-blue-200 text-sm mb-4">{method.description}</p>
                            <span className="text-lg font-bold border-b border-primary/50 group-hover:text-primary transition-colors">
                                {method.contact}
                            </span>
                        </CardContent>
                    </Card>
                </a>
              ))}
            </div>

            <div className="text-center mt-16">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg">
                📞 Demander un Rappel
              </Button>
              <p className="text-blue-200 mt-4 text-sm">
                Laissez votre numéro, nous vous rappelons sous 30 minutes.
              </p>
            </div>
          </div>
        </section> */}
      </div>
      
      {/* <ChatBubble /> */}
    </div>
  );
};

export default FAQ;