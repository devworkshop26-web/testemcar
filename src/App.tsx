import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { ArrowRight, MessageCircle, Mail, Calendar, Linkedin, X, Terminal, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

import { AppData, ServiceData } from './localData';
import { fetchContent, submitBooking } from './api';

// Helper to dynamically render Lucide icons
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = (Icons as any)[name] || Icons.ExternalLink;
  return <IconComponent className={className} />;
};

// Helper to format links
const formatLink = (url: string | undefined) => {
  if (!url) return '#';
  
  // Check if it's an email address
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)) {
    return `mailto:${url}`;
  }
  
  // Check if it's a phone number (simple check for numbers and common phone characters)
  if (/^[\d\s\+\-\(\)]+$/.test(url) && url.length > 5) {
    return `tel:${url.replace(/[\s\-\(\)]/g, '')}`;
  }

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:')) {
    return url;
  }
  return `https://${url}`;
};

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', date: '', time: '', topic: '' });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    const load = async () => {
      try {
        const remoteContent = await fetchContent();
        setData(remoteContent);
      } finally {
        setIsLoading(false);
      }
    };

    load();

    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'clients'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set data-lang attribute on body
  useEffect(() => {
    document.body.setAttribute('data-lang', lang);
  }, [lang]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedService || showBooking) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService, showBooking]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'fr' : 'en');
  };

  const handleBookMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('submitting');
    try {
      await submitBooking(bookingForm);
      setBookingStatus('success');
      setTimeout(() => {
        setShowBooking(false);
        setBookingStatus('idle');
        setBookingForm({ name: '', email: '', date: '', time: '', topic: '' });
      }, 2000);
    } catch (err) {
      console.error(err);
      setBookingStatus('idle');
    }
  };

  if (isLoading || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-cyan-500 font-mono">Initializing...</div>;
  }

  const content = data[lang];

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 relative">
      
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold tracking-tight text-xl text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            Luc_
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-mono text-slate-500">
            {['About', 'Services', 'Clients'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className={`transition-colors hover:text-cyan-400 uppercase tracking-wider ${activeSection === item.toLowerCase() ? 'text-cyan-400 font-semibold' : ''}`}
              >
                {lang === 'fr' && item === 'About' ? 'À propos' : item}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {lang.toUpperCase()}
            </button>
            <button 
              onClick={() => scrollTo('footer')}
              className="md:hidden text-sm font-mono uppercase tracking-wider font-semibold text-cyan-400"
            >
              Contact
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>
        
        {/* Hero Section */}
        <section id="home" className="pt-20 pb-12 md:pt-24 md:pb-20 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-7 lg:col-span-8 order-2 md:order-1"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-4 text-white whitespace-pre-line">
                {content.hero.title.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {i === 1 ? <span className="text-cyan-400">{line}</span> : line}
                    {i === 0 && <br className="hidden md:block" />}
                  </React.Fragment>
                ))}
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 mb-6 leading-relaxed font-medium max-w-2xl">
                {content.hero.subtitle}
              </p>
              
              <div className="flex flex-col gap-6 mt-6">
                <p className="text-sm font-mono text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-500 inline-block animate-pulse"></span>
                  {content.hero.contactText}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a 
                    href={content.socials.whatsapp ? (content.socials.whatsapp.startsWith('http') ? content.socials.whatsapp : `https://wa.me/${content.socials.whatsapp.replace(/[^\d+]/g, '')}`) : '#'} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-900 text-slate-300 border border-slate-700 px-6 py-3 hover:border-cyan-400 hover:text-cyan-400 transition-all text-sm font-mono uppercase tracking-wider"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <a 
                    href={formatLink(content.socials.email)} 
                    className="inline-flex items-center gap-2 bg-slate-900 text-slate-300 border border-slate-700 px-6 py-3 hover:border-cyan-400 hover:text-cyan-400 transition-all text-sm font-mono uppercase tracking-wider"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                  <a 
                    href={formatLink(content.socials.linkedin)} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-900 text-slate-300 border border-slate-700 px-6 py-3 hover:border-cyan-400 hover:text-cyan-400 transition-all text-sm font-mono uppercase tracking-wider"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <button 
                    onClick={() => setShowBooking(true)}
                    className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 px-6 py-3 hover:bg-cyan-500 hover:text-slate-950 transition-all text-sm font-mono uppercase tracking-wider"
                  >
                    <Calendar className="w-4 h-4" />
                    {lang === 'fr' ? 'Prendre RDV' : 'Book a Meeting'}
                  </button>
                </div>
              </div>
            </motion.div>

            {content.hero.profilePicUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="md:col-span-5 lg:col-span-4 order-1 md:order-2 flex justify-center md:justify-end mb-10 md:mb-0"
              >
                <div className="relative inline-block group w-full max-w-[400px] aspect-square flex items-center justify-center">
                  <img 
                    src={content.hero.profilePicUrl} 
                    alt="Profile" 
                    className="w-[85%] h-[85%] object-contain [mask-image:radial-gradient(circle_at_center,black_30%,transparent_70%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_30%,transparent_70%)] transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6 bg-slate-900 border-y border-slate-800">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-12 gap-12 items-start"
            >
              <div className="md:col-span-4">
                <h2 className="text-sm font-mono uppercase tracking-widest text-cyan-400 mb-2">// {lang === 'fr' ? "L'Approche" : "The Approach"}</h2>
                <h3 className="text-3xl font-bold tracking-tight text-white">{content.about.title}</h3>
              </div>
              <div className="md:col-span-8 space-y-4 text-lg text-slate-400 leading-relaxed">
                <p>{content.about.p1}</p>
                <p>{content.about.p2}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services & Ventures Grid Section */}
        <section id="services" className="py-24 px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-sm font-mono uppercase tracking-widest text-cyan-400 mb-2">// {lang === 'fr' ? "L'Écosystème" : "The Ecosystem"}</h2>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{lang === 'fr' ? "Services & Entreprises." : "Services & Ventures."}</h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setSelectedService(service)}
                className="group relative bg-slate-900/40 backdrop-blur-sm border border-slate-800 hover:border-cyan-500/50 cursor-pointer overflow-hidden flex flex-col justify-between p-6 transition-all duration-300 min-h-[160px]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={service.logoUrl || `https://api.dicebear.com/9.x/shapes/svg?seed=${service.name}&backgroundColor=0f172a&shape1Color=06b6d4`} 
                      alt={`${service.name} logo`} 
                      className="w-10 h-10 rounded bg-slate-950 border border-slate-800 object-cover p-1"
                      referrerPolicy="no-referrer"
                    />
                    <h4 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {service.name}
                    </h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all shrink-0">
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transform group-hover:-rotate-45 transition-all" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 line-clamp-2 font-medium">{service.tagline}</p>
                  <div className="h-0 overflow-hidden group-hover:h-6 transition-all duration-300 opacity-0 group-hover:opacity-100 mt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1">
                      {lang === 'fr' ? 'Explorer' : 'Explore'} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Clients / Trusted By Section */}
        {content.clients && content.clients.length > 0 && (
          <section id="clients" className="py-24 px-6 bg-slate-900/30 border-b border-slate-800">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="mb-16 text-center"
              >
                <h2 className="text-sm font-mono uppercase tracking-widest text-cyan-400 mb-2">// {lang === 'fr' ? "Ils m'ont fait confiance" : "Trusted By"}</h2>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{lang === 'fr' ? "Collaborateurs & Clients" : "Collaborators & Clients"}</h3>
              </motion.div>
              
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                {content.clients.map((client, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group flex items-center justify-center"
                  >
                    {client.logoUrl ? (
                      <img 
                        src={client.logoUrl} 
                        alt={client.name} 
                        className="h-12 md:h-16 max-w-[160px] object-contain filter brightness-0 invert opacity-50 hover:opacity-100 transition-opacity duration-300"
                        referrerPolicy="no-referrer"
                        title={client.name}
                      />
                    ) : (
                      <div className="text-xl font-bold text-slate-500 uppercase tracking-widest opacity-50 group-hover:opacity-100 group-hover:text-cyan-400 transition-all duration-300">
                        {client.name}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Rich Footer */}
      <footer id="footer" className="bg-slate-950 text-slate-500 pt-20 pb-10 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Terminal className="w-6 h-6 text-cyan-400" />
                Luc Rabenatoandro
              </h3>
              <p className="text-slate-400 max-w-md text-lg leading-relaxed">
                {content.footer.bio}
              </p>
            </div>
            <div className="flex flex-col md:items-end gap-6">
              <p className="text-sm font-mono uppercase tracking-widest text-cyan-400">// {lang === 'fr' ? 'Contactez-nous' : "Let's Connect"}</p>
              <div className="flex gap-4">
                <a href={content.socials.whatsapp.startsWith('http') ? content.socials.whatsapp : `https://wa.me/${content.socials.whatsapp.replace(/[^\d+]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 border border-slate-800 hover:border-cyan-400 hover:text-cyan-400 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href={formatLink(content.socials.email)} className="p-3 bg-slate-900 border border-slate-800 hover:border-cyan-400 hover:text-cyan-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
                <a href={formatLink(content.socials.linkedin)} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 border border-slate-800 hover:border-cyan-400 hover:text-cyan-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <button onClick={() => setShowBooking(true)} className="p-3 bg-slate-900 border border-slate-800 hover:border-cyan-400 hover:text-cyan-400 transition-colors">
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <p>© {new Date().getFullYear()} Luc Rabenatoandro. All rights reserved.</p>
              <Link to="/admin" className="text-slate-700 hover:text-cyan-400 transition-colors" title="Admin Access">
                <Lock className="w-4 h-4" />
              </Link>
            </div>
            <p className="font-mono text-cyan-400 bg-slate-900 border border-slate-800 px-4 py-2">
              &gt; {content.footer.tagline}
            </p>
          </div>
        </div>
      </footer>

      {/* Popup Modal for Services */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              onClick={() => setSelectedService(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-slate-900 w-full max-w-2xl border border-slate-700 p-8 md:p-12 shadow-2xl shadow-cyan-900/20 overflow-y-auto max-h-[90vh] z-10"
            >
              <button 
                onClick={() => setSelectedService(null)} 
                className="absolute top-6 right-6 p-2 bg-slate-800 border border-slate-700 hover:border-cyan-400 hover:text-cyan-400 transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-start gap-4 mb-3 pr-10">
                <img 
                  src={selectedService.logoUrl || `https://api.dicebear.com/9.x/shapes/svg?seed=${selectedService.name}&backgroundColor=0f172a&shape1Color=06b6d4`} 
                  alt={`${selectedService.name} logo`} 
                  className="w-16 h-16 rounded bg-slate-950 border border-slate-800 object-cover p-1.5 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white">{selectedService.name}</h3>
                  <p className="text-lg font-mono text-cyan-400 mt-2">{selectedService.tagline}</p>
                  {selectedService.website && (
                    <a 
                      href={formatLink(selectedService.website)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-slate-800 text-white border border-slate-700 text-xs font-mono hover:border-cyan-400 hover:text-cyan-400 transition-colors uppercase tracking-wider"
                    >
                      <Globe className="w-3 h-3" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
              
              <div className="space-y-6 mb-8 mt-6">
                <p className="text-slate-300 text-lg leading-relaxed">
                  {selectedService.description}
                </p>
                <div className="bg-slate-950 p-6 text-slate-400 font-mono text-sm border-l-2 border-cyan-500">
                  &gt; {selectedService.story}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-800">
                {selectedService.links.map(link => (
                  <a 
                    key={link.name} 
                    href={formatLink(link.url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white border border-slate-700 text-sm font-mono hover:border-cyan-400 hover:text-cyan-400 transition-colors uppercase tracking-wider"
                  >
                    <DynamicIcon name={link.icon} className="w-4 h-4" /> 
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              onClick={() => setShowBooking(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-slate-900 w-full max-w-lg border border-slate-700 p-8 shadow-2xl shadow-cyan-900/20 overflow-y-auto max-h-[90vh] z-10"
            >
              <button 
                onClick={() => setShowBooking(false)} 
                className="absolute top-6 right-6 p-2 bg-slate-800 border border-slate-700 hover:border-cyan-400 hover:text-cyan-400 transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-3xl font-bold mb-2 text-white">{lang === 'fr' ? 'Prendre un rendez-vous' : 'Book a Meeting'}</h3>
              <p className="text-sm font-mono text-cyan-400 mb-8">{lang === 'fr' ? '// Remplissez les détails ci-dessous' : '// Fill out the details below'}</p>
              
              {bookingStatus === 'success' ? (
                <div className="bg-cyan-500/10 border border-cyan-500/50 p-6 text-center text-cyan-400 font-mono">
                  {lang === 'fr' ? 'Demande envoyée avec succès !' : 'Request sent successfully!'}
                </div>
              ) : (
                <form onSubmit={handleBookMeeting} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 uppercase tracking-wider">{lang === 'fr' ? 'Nom' : 'Name'}</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-slate-950 border border-slate-700 rounded-none p-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                      value={bookingForm.name}
                      onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 uppercase tracking-wider">Email</label>
                    <input 
                      required
                      type="email"
                      className="w-full bg-slate-950 border border-slate-700 rounded-none p-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                      value={bookingForm.email}
                      onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase tracking-wider">{lang === 'fr' ? 'Date' : 'Date'}</label>
                      <input 
                        required
                        type="date"
                        className="w-full bg-slate-950 border border-slate-700 rounded-none p-3 text-white focus:border-cyan-400 focus:outline-none transition-colors [color-scheme:dark]"
                        value={bookingForm.date}
                        onChange={e => setBookingForm({...bookingForm, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase tracking-wider">{lang === 'fr' ? 'Heure' : 'Time'}</label>
                      <input 
                        required
                        type="time"
                        className="w-full bg-slate-950 border border-slate-700 rounded-none p-3 text-white focus:border-cyan-400 focus:outline-none transition-colors [color-scheme:dark]"
                        value={bookingForm.time}
                        onChange={e => setBookingForm({...bookingForm, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 uppercase tracking-wider">{lang === 'fr' ? 'Sujet' : 'Topic'}</label>
                    <textarea 
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-none p-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                      rows={3}
                      value={bookingForm.topic}
                      onChange={e => setBookingForm({...bookingForm, topic: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={bookingStatus === 'submitting'}
                    className="w-full bg-cyan-500 text-slate-950 font-bold py-3 uppercase tracking-wider hover:bg-cyan-400 transition-colors disabled:opacity-50 mt-4"
                  >
                    {bookingStatus === 'submitting' ? (lang === 'fr' ? 'Envoi...' : 'Sending...') : (lang === 'fr' ? 'Confirmer' : 'Confirm')}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

