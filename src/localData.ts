export interface LinkData {
  name: string;
  url: string;
  icon: string;
}

export interface ServiceData {
  name: string;
  tagline: string;
  description: string;
  story: string;
  logoUrl?: string;
  website?: string;
  links: LinkData[];
}

export interface ClientData {
  name: string;
  logoUrl: string;
}

export interface ContentData {
  hero: {
    title: string;
    subtitle: string;
    contactText: string;
    profilePicUrl?: string;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
  };
  services: ServiceData[];
  clients?: ClientData[];
  footer: {
    bio: string;
    tagline: string;
  };
  socials: {
    whatsapp: string;
    email: string;
    linkedin: string;
  };
}

export interface AppData {
  en: ContentData;
  fr: ContentData;
}

export interface BookingData {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  topic: string;
  createdAt: string;
}

const CONTENT_KEY = 'lucrabe_content';
const BOOKINGS_KEY = 'lucrabe_bookings';
const ADMIN_PASSWORD_KEY = 'lucrabe_admin_password';

const defaultServices: ServiceData[] = [
  {
    name: 'Workshop Idea Center',
    tagline: 'Innovation Lab',
    description: 'Innovation lab transforming business ideas into validated, scalable ventures.',
    story: 'The birthplace of structured ventures; converts concepts into execution-ready companies.',
    links: [
      { name: 'Website', url: '#', icon: 'ExternalLink' },
      { name: 'LinkedIn', url: '#', icon: 'Linkedin' },
      { name: 'Facebook', url: '#', icon: 'Facebook' },
      { name: 'Instagram', url: '#', icon: 'Instagram' }
    ]
  }
];

export const defaultAppData: AppData = {
  en: {
    hero: {
      profilePicUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Luc&backgroundColor=0f172a',
      title: "Let's build\nsomething great.",
      subtitle: 'You tell me what you’re trying to do, I dive into the situation, zoom out, zoom in, then design a solution.',
      contactText: 'Initialize connection'
    },
    about: {
      title: 'Operator First.',
      p1: "I don't just advise; I build.",
      p2: 'No fluff, just scalable results.'
    },
    services: defaultServices,
    clients: [],
    footer: {
      bio: 'Founder, Operator & Builder.',
      tagline: '> Simple. Efficient. Zero drama.'
    },
    socials: {
      whatsapp: '+261 34 05 320 50',
      email: 'luc.rabe@widea.center',
      linkedin: 'linkedin.com/in/luc'
    }
  },
  fr: {
    hero: {
      profilePicUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Luc&backgroundColor=0f172a',
      title: 'Construisons\nquelque chose de grand.',
      subtitle: 'Vous me dites ce que vous essayez de faire, puis je conçois une solution adaptée.',
      contactText: 'Initialiser la connexion'
    },
    about: {
      title: 'Opérateur Avant Tout.',
      p1: 'Je ne me contente pas de conseiller ; je construis.',
      p2: 'Pas de bla-bla, juste des résultats.'
    },
    services: defaultServices.map((service) => ({
      ...service,
      tagline: `${service.tagline} (FR)`,
      description: `${service.description} (FR)`,
      story: `${service.story} (FR)`
    })),
    clients: [],
    footer: {
      bio: 'Fondateur, Opérateur & Bâtisseur.',
      tagline: '> Simple. Efficace. Zéro drame.'
    },
    socials: {
      whatsapp: '+261 34 05 320 50',
      email: 'luc.rabe@widea.center',
      linkedin: 'linkedin.com/in/luc'
    }
  }
};

export const loadContent = (): AppData => {
  const raw = localStorage.getItem(CONTENT_KEY);
  if (!raw) {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(defaultAppData));
    return defaultAppData;
  }

  try {
    return JSON.parse(raw) as AppData;
  } catch {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(defaultAppData));
    return defaultAppData;
  }
};

export const saveContent = (content: AppData) => {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
};

export const loadBookings = (): BookingData[] => {
  const raw = localStorage.getItem(BOOKINGS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as BookingData[];
  } catch {
    return [];
  }
};

export const saveBooking = (booking: Omit<BookingData, 'id' | 'createdAt'>) => {
  const bookings = loadBookings();
  bookings.unshift({
    ...booking,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  });
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};

export const clearBookings = () => {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
};

export const getAdminPassword = () => {
  const password = localStorage.getItem(ADMIN_PASSWORD_KEY);
  if (!password) {
    localStorage.setItem(ADMIN_PASSWORD_KEY, 'admin123');
    return 'admin123';
  }

  return password;
};

export const setAdminPassword = (password: string) => {
  localStorage.setItem(ADMIN_PASSWORD_KEY, password);
};
