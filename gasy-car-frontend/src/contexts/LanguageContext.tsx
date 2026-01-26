import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    'nav.rent': 'Accueil',
    'nav.become_owner': 'Devenir propriétaire',
    'nav.how_it_works': 'Comment ça marche',
    'nav.blog': 'Blog',
    'nav.faq': 'FAQ',
    'nav.login': 'Connexion',
    'nav.signup': 'Inscription',
    'hero.title': 'Évitez les agences de location traditionnelles',
    'hero.subtitle': 'Louez à peu près n\'importe quelle voiture, à peu près n\'importe où, à Madagascar',
    'search.where': 'Où',
    'search.from': 'De',
    'search.until': 'Jusqu\'à',
    'search.button': 'Rechercher',
  },
  en: {
    'nav.rent': 'Home',
    'nav.become_owner': 'Become an owner',
    'nav.how_it_works': 'How it works',
    'nav.blog': 'Blog',
    'nav.faq': 'FAQ',
    'nav.login': 'Login',
    'nav.signup': 'Sign up',
    'hero.title': 'Avoid traditional rental agencies',
    'hero.subtitle': 'Rent almost any car, almost anywhere, in Madagascar',
    'search.where': 'Where',
    'search.from': 'From',
    'search.until': 'Until',
    'search.button': 'Search',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
