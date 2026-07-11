/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Award, Briefcase, Check, CheckCircle, Cpu, ExternalLink, 
  FileText, Globe, Mail, MessageSquare, Phone, 
  Play, Send, Sparkles, Star, Tv, User, Video, X, Menu, ArrowRight, ShieldAlert, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import CesarChatbot from "./components/CesarChatbot";
import PortfolioShowcase from "./components/PortfolioShowcase";

import { translations, caseStudies, servicesEs, servicesEn, faqsEs, faqsEn, testimonialsEs, testimonialsEn } from "./data";
import { TranslationSet } from "./types";

export default function App() {
  // Determine language based on current URL path (English is primary, Spanish is alternative)
  const getLangFromPath = (): string => {
    const path = window.location.pathname;
    if (path.startsWith("/es")) return "es";
    return "en"; // Default English is primary
  };

  const [lang, setLang] = useState<string>(getLangFromPath());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("home");

  // Contact Form States
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Legal Modal States
  const [legalModalType, setLegalModalType] = useState<"privacy" | "terms" | null>(null);

  // Sync state with path on load & handle browser back/forward
  useEffect(() => {
    const handleLocationChange = () => {
      const currentLang = getLangFromPath();
      setLang(currentLang);

      // Handle direct portfolio routes
      const path = window.location.pathname;
      const caseMatch = path.match(/\/casos-de-exito\/([a-zA-Z0-9_-]+)/);
      if (caseMatch) {
        setSelectedProjectId(caseMatch[1]);
        setActiveSection("portfolio");
      } else if (path.includes("/preguntas-frecuentes")) {
        setActiveSection("faq");
        setSelectedProjectId(null);
      } else if (path.includes("/sobre-nosotros")) {
        setActiveSection("about");
        setSelectedProjectId(null);
      } else if (path.includes("/contacto")) {
        setActiveSection("contact");
        setSelectedProjectId(null);
      } else {
        setSelectedProjectId(null);
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    // Initial trigger
    handleLocationChange();

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  // Update browser URL path cleanly
  const navigateToPath = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("popstate"));
    setMobileMenuOpen(false);
  };

  const changeLanguage = (targetLang: string) => {
    let newPath = "/";
    if (targetLang === "es") {
      newPath = "/es";
    }
    navigateToPath(newPath);
  };

  const handleSelectProject = (id: string) => {
    let langPrefix = lang === "en" ? "" : "/es";
    navigateToPath(`${langPrefix}/casos-de-exito/${id}`);
  };

  const handleClearProject = () => {
    let langPrefix = lang === "en" ? "" : "/es";
    navigateToPath(langPrefix || "/");
  };

  const t: TranslationSet = translations[lang] || translations.en;

  // Real Formspree Contact submission
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formspree.io/f/mojzdvzq", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

		 if (response.ok) {
			setFormSubmitted(true);
			// Ocultar automáticamente el mensaje de éxito y restablecer el formulario después de 6 segundos
			setTimeout(() => {
				setFormSubmitted(false);
			}, 6000);
		} else {
			throw new Error("Submission failed");
		}
    } catch (err) {
      setFormError(
        lang === "es" 
          ? "Error al enviar el formulario. Por favor, inténtelo de nuevo." 
          : "Error sending form. Please try again."
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Localized collections
  const activeServices = lang === "es" ? servicesEs : servicesEn;
  const activeFaqs = lang === "es" ? faqsEs : faqsEn;
  const activeTestimonials = lang === "es" ? testimonialsEs : testimonialsEn;

  return (
    <div className="relative min-h-screen bg-[#050505] text-slate-100 overflow-hidden bg-glow-radial-1 bg-glow-radial-2">
      
      {/* BACKGROUND GLOW ACCENTS */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none animate-soft-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none animate-soft-pulse" style={{ animationDelay: "3s" }}></div>

      {/* FIXED NAVIGATION HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateToPath(lang === "en" ? "/" : "/es")}>
            <div className="h-10 w-10 bg-transparent flex items-center justify-center relative overflow-hidden">
              <img 
                src="/images/logo/logo.webp" 
                alt="Mora-Grafic's Logo" 
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fb = e.currentTarget.parentElement?.querySelector('.fallback-logo');
                  if (fb) fb.classList.remove('hidden');
                }}
              />
              <div className="fallback-logo hidden h-10 w-10 bg-white text-black flex items-center justify-center font-display font-extrabold text-lg border border-neutral-900/10 shadow-sm relative overflow-hidden">
                <span className="relative z-10">M</span>
                <div className="absolute inset-1.5 border border-black/10"></div>
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold font-display text-white tracking-tight">Mora-Grafic's</h1>
              <span className="text-[9px] text-blue-400 font-mono tracking-widest uppercase">Studio</span>
            </div>
          </div>

          {/* Desktop Nav menu */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono">
            <button 
              onClick={() => { setActiveSection("home"); handleClearProject(); }}
              className={`hover:text-blue-400 transition-colors ${activeSection === "home" ? "text-blue-400 font-semibold" : "text-neutral-300"}`}
            >
              {t.navHome}
            </button>
            <button 
              onClick={() => { setActiveSection("portfolio"); }}
              className={`hover:text-blue-400 transition-colors ${activeSection === "portfolio" ? "text-blue-400 font-semibold" : "text-neutral-300"}`}
            >
              {t.navPortfolio}
            </button>
            <button 
              onClick={() => { setActiveSection("about"); }}
              className={`hover:text-blue-400 transition-colors ${activeSection === "about" ? "text-blue-400 font-semibold" : "text-neutral-300"}`}
            >
              {t.navAbout}
            </button>
            <button 
              onClick={() => { setActiveSection("faq"); }}
              className={`hover:text-blue-400 transition-colors ${activeSection === "faq" ? "text-blue-400 font-semibold" : "text-neutral-300"}`}
            >
              {t.navFAQ}
            </button>
          </nav>

          {/* Language Selector & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Lang Dropdown (English & Spanish Only) */}
            <div className="flex bg-neutral-900 border border-white/10 p-0.5 rounded-lg text-[10px] font-mono">
              {(["en", "es"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => changeLanguage(l)}
                  className={`px-3 py-1 rounded-md uppercase font-semibold transition-all ${
                    lang === l ? "bg-blue-600 text-white" : "text-neutral-400 hover:text-white"
                  }`}
                  id={`lang-btn-${l}`}
                >
                  {l === "en" ? "English" : "Español"}
                </button>
              ))}
            </div>

            {/* Contact CTA */}
            <button
              onClick={() => {
                setActiveSection("home");
                setTimeout(() => {
                  const contactEl = document.getElementById("contact-section");
                  if (contactEl) contactEl.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="px-4 py-1.5 border border-white/20 hover:border-blue-400 text-neutral-300 hover:text-white text-[10px] uppercase tracking-wider rounded-full transition-all bg-transparent font-mono"
            >
              {t.navContact}
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Lang dropdown (English & Spanish Only) */}
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-neutral-900 text-white text-[10px] uppercase font-mono px-2 py-1 rounded border border-white/10"
              id="mobile-lang-select"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              id="mobile-menu-hamburger-btn"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-neutral-950 border-t border-white/5 px-4 py-4 space-y-3 font-mono text-xs text-neutral-300"
              id="mobile-nav-panel"
            >
              <button
                onClick={() => { setActiveSection("home"); handleClearProject(); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 hover:text-blue-400"
              >
                {t.navHome}
              </button>
              <button
                onClick={() => { setActiveSection("portfolio"); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 hover:text-blue-400"
              >
                {t.navPortfolio}
              </button>
              <button
                onClick={() => { setActiveSection("about"); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 hover:text-blue-400"
              >
                {t.navAbout}
              </button>
              <button
                onClick={() => { setActiveSection("faq"); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 hover:text-blue-400"
              >
                {t.navFAQ}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    const contactEl = document.getElementById("contact-section");
                    if (contactEl) contactEl.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }}
                className="block w-full text-center py-2.5 bg-blue-600 text-white rounded-lg font-semibold mt-2"
              >
                {t.navContact}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* CENTRAL VIEWS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-16">
        
        {/* VIEW 1: HOME (LANDING CINEMATOGRÁFICA) */}
        {activeSection === "home" && (
          <div className="space-y-20 animate-fade-in">
            
            {/* HERO SECTION */}
            <section className="relative rounded-3xl overflow-hidden liquid-glass border border-white/10 p-6 sm:p-12 md:p-16 text-center space-y-6 animate-fade-in" id="hero-panel">
              <div className="absolute inset-0 bg-neutral-950/60 mix-blend-multiply z-10"></div>
              
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  poster="/images/hero-poster.jpg" 
                  className="w-full h-full object-cover opacity-20"
                >
                  <source src="/images/video/v-bg.mp4" type="video/mp4" />
                </video>
                <img 
                  src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1200" 
                  alt="Hero poster background" 
                  className="w-full h-full object-cover opacity-15 absolute inset-0 z-[-1]"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Foreground content */}
              <div className="relative z-20 space-y-6 max-w-4xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono tracking-widest uppercase font-semibold mx-auto">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  {t.heroTag}
                </span>

                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display text-white tracking-tight leading-[1.1] text-gradient-blue blue-glow-text">
                  {t.heroTitle}
                </h2>

                <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-sans max-w-2xl mx-auto leading-relaxed">
                  {t.heroSub}
                </p>

                {/* Main Action CTAs */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 max-w-md mx-auto">
                  <button
                    onClick={() => setActiveSection("portfolio")}
                    className="w-full px-8 py-4 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{t.heroCtaPrimary}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      const contactEl = document.getElementById("contact-section");
                      if (contactEl) contactEl.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full px-8 py-4 bg-white/5 text-white hover:bg-white/10 text-xs font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-blue-400" />
                    <span>{t.heroCtaSec}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* METRICS / STATS SECTION */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center" id="metrics-panel">
              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-2">
                <span className="block text-4xl font-black font-display text-gradient-blue">
                  {t.resultsMetric1Val}
                </span>
                <span className="block text-xs font-mono text-neutral-400 uppercase tracking-widest">
                  {t.resultsMetric1Lbl}
                </span>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-2">
                <span className="block text-4xl font-black font-display text-gradient-silver">
                  {t.resultsMetric2Val}
                </span>
                <span className="block text-xs font-mono text-neutral-400 uppercase tracking-widest">
                  {t.resultsMetric2Lbl}
                </span>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-2">
                <span className="block text-4xl font-black font-display text-gradient-blue">
                  {t.resultsMetric3Val}
                </span>
                <span className="block text-xs font-mono text-neutral-400 uppercase tracking-widest">
                  {t.resultsMetric3Lbl}
                </span>
              </div>
            </section>

            {/* SERVICES SECTION */}
            <section className="space-y-8" id="services-section">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold font-display text-white">
                  {t.servicesTitle}
                </h3>
                <p className="text-xs text-neutral-400">
                  {t.servicesSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeServices.map((svc) => (
                  <div 
                    key={svc.id} 
                    className="p-6 rounded-2xl liquid-glass border border-white/5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        {svc.id === "diseno-web" && <Globe className="h-5 w-5" />}
                        {svc.id === "branding" && <Award className="h-5 w-5" />}
                        {svc.id === "publicidad-visual" && <FileText className="h-5 w-5" />}
                        {svc.id === "motion-graphics" && <Tv className="h-5 w-5" />}
                        {svc.id === "produccion-audiovisual" && <Video className="h-5 w-5" />}
                      </div>

                      <h4 className="text-base font-bold text-white font-display">{svc.title}</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">{svc.description}</p>
                    </div>

                    <ul className="text-[10px] font-mono text-neutral-400 space-y-1.5 pt-3 border-t border-white/5">
                      {svc.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-neutral-300">
                          <Check className="h-3 w-3 text-blue-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* TESTIMONIALS SLIDER SECTION */}
            <section className="space-y-8" id="testimonials-section">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold font-display text-white">
                  {t.testimonialsTitle}
                </h3>
                <p className="text-xs text-neutral-400">
                  {t.testimonialsSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {activeTestimonials.map((test, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-neutral-300 italic leading-relaxed">
                      "{test.quote}"
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs">
                        {test.logo}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{test.author}</h5>
                        <span className="text-[10px] text-neutral-500 font-mono">{test.role} — {test.company}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* MANUAL STRATEGIC CONTACT FORM */}
            <section className="rounded-2xl bg-neutral-950 border border-white/5 p-6 md:p-10" id="contact-section">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center space-y-1.5">
                  <h3 className="text-xl md:text-2xl font-bold font-display text-white">{t.contactTitle}</h3>
                  <p className="text-xs text-neutral-400">{t.contactSubtitle}</p>
                </div>

                {formSubmitted ? (
                  <div className="p-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center space-y-3">
                    <CheckCircle className="h-12 w-12 text-blue-400 mx-auto" />
                    <h4 className="text-base font-bold text-white">
                      {lang === "es" ? "¡Solicitud Recibida!" : "Strategy Request Received!"}
                    </h4>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                      {lang === "es" 
                        ? "Hemos recibido su mensaje con éxito. César Moradel y su equipo revisarán su información para formular su propuesta." 
                        : "We've received your request successfully. César Moradel and our strategy team will analyze your project details."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                    {formError && (
                      <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
                        {formError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]" htmlFor="form-name">
                          {t.contactNameLabel}
                        </label>
                        <input
                          type="text"
                          id="form-name"
                          name="name"
                          required
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500"
                          placeholder="E.g., José Hernández"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]" htmlFor="form-email">
                          {t.contactEmailLabel}
                        </label>
                        <input
                          type="email"
                          id="form-email"
                          name="email"
                          required
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500"
                          placeholder="jose@painting.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]" htmlFor="form-phone">
                          {t.contactPhoneLabel}
                        </label>
                        <input
                          type="text"
                          id="form-phone"
                          name="phone"
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500"
                          placeholder="+1 910-123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]" htmlFor="form-service">
                          {t.contactServiceLabel}
                        </label>
                        <select
                          id="form-service"
                          name="service"
                          required
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500 appearance-none"
                        >
                          {lang === "es" ? (
                            <>
                              <option value="web">Diseño Web</option>
                              <option value="branding">Branding</option>
                              <option value="flyers">Flyers y Publicidad</option>
                              <option value="videos">Videos y Motion Graphics</option>
                              <option value="marketing">Marketing</option>
                              <option value="paquete">Paquete Completo</option>
                            </>
                          ) : (
                            <>
                              <option value="web">Web Design</option>
                              <option value="branding">Branding</option>
                              <option value="flyers">Flyers & Advertising</option>
                              <option value="videos">Videos & Motion Graphics</option>
                              <option value="marketing">Marketing</option>
                              <option value="paquete">Complete Package</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]" htmlFor="form-budget">
                          {t.contactBudgetLabel}
                        </label>
                        <select
                          id="form-budget"
                          name="budget"
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="1200">$500 - $800 USD</option>
                          <option value="5000">$800 - $1,000 USD</option>
													<option value="5000">$1,000 - $1,200 USD</option>
													<option value="5000">$1,200 - $1,500 USD</option>
													<option value="5000">$1,500 - $2,000 USD</option>
													<option value="5000">$2,000 - $2,500 USD</option>
													<option value="5000">$2,500 - $3,000 USD</option>
													<option value="5000">$3,000 - $4,000 USD</option>
													<option value="5000">$4,400 - $5,000 USD</option>
                          <option value="10000">Not Sure</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]" htmlFor="form-message">
                        {t.contactMessageLabel}
                      </label>
                      <textarea
                        id="form-message"
                        name="message"
                        rows={4}
                        required
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500"
                        placeholder={lang === "es" ? "Cuéntanos sobre los objetivos comerciales y de diseño..." : "Tell us about your brand goals and aesthetic preferences..."}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full py-3.5 bg-blue-600 disabled:bg-neutral-800 text-white font-extrabold text-xs rounded-xl shadow-lg hover:bg-blue-700 transition-all uppercase tracking-wider font-mono shadow-blue-500/10 flex items-center justify-center gap-2"
                    >
                      {formSubmitting && (
                        <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span>{t.contactSubmitBtn}</span>
                    </button>
                  </form>
                )}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: PORTFOLIO SHOWCASE */}
        {activeSection === "portfolio" && (
          <div className="space-y-8 animate-fade-in" id="portfolio-section">
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-extrabold font-display text-white">{t.portfolioTitle}</h3>
              <p className="text-xs text-neutral-400">{t.portfolioSubtitle}</p>
            </div>

            <PortfolioShowcase
              onSelectProject={handleSelectProject}
              selectedProjectId={selectedProjectId}
              onClearProject={handleClearProject}
              lang={lang}
            />
          </div>
        )}

{/* VIEW 3: ABOUT US (SOBRE NOSOTROS, ESTRATEGIA Y VISIÓN) */}
        {activeSection === "about" && (
          <div className="space-y-10 animate-fade-in" id="about-section">
            <div className="space-y-2 text-center max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold font-display text-white">
                {lang === "es" ? "Mora-Grafic's Studio" : "Mora-Grafic's Studio"}
              </h3>
              <p className="text-xs text-blue-400 font-mono uppercase tracking-wider">
                {lang === "es" 
                  ? "Redefiniendo la presencia comercial de marcas con visión de crecimiento." 
                  : "Redefining the commercial presence of brands with a growth vision."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-neutral-950/40 p-6 md:p-10 rounded-2xl border border-white/5">
              
              {/* Text / Main Introduction column */}
              <div className="lg:col-span-7 space-y-6 select-text">
                <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                  <p className="font-medium text-white text-sm sm:text-base">
                    {lang === "es" 
                      ? "Liderado por César Aníbal Moradel Fonseca, Mora-Grafic's Studio es un estudio creativo y tecnológico de clase mundial especializado en construir marcas de alto impacto para mercados competitivos como Estados Unidos y Canadá." 
                      : "Led by César Aníbal Moradel Fonseca, Mora-Grafic's Studio is a world-class creative and technological studio specializing in building high-impact brands for competitive markets like the United States and Canada."}
                  </p>
                  <p>
                    {lang === "es"
                      ? "Nuestra misión es ayudar a empresas, emprendedores y organizaciones a desarrollar una presencia digital sólida, profesional y orientada a resultados. En un entorno donde la percepción de marca influye directamente en la confianza y las ventas, creamos activos digitales que fortalecen la reputación, generan autoridad y abren nuevas oportunidades de negocio."
                      : "Our mission is to help companies, entrepreneurs, and organizations develop a solid, professional, and results-oriented digital presence. In an environment where brand perception directly influences trust and sales, we create digital assets that strengthen reputation, generate authority, and unlock new business opportunities."}
                  </p>
                  <p>
                    {lang === "es"
                      ? "Combinamos estrategia, diseño y tecnología para desarrollar ecosistemas digitales de alto rendimiento. Desde identidad visual y branding corporativo hasta desarrollo web profesional, automatización inteligente y posicionamiento SEO, cada solución está diseñada para ofrecer una experiencia excepcional y contribuir directamente a los objetivos comerciales de nuestros clientes."
                      : "We combine strategy, design, and technology to develop high-performance digital ecosystems. From visual identity and corporate branding to professional web development, intelligent automation, and SEO positioning, each solution is designed to offer an exceptional experience and contribute directly to our clients' business goals."}
                  </p>
                  <p>
                    {lang === "es"
                      ? "En Mora-Grafic's Studio no trabajamos con plantillas genéricas. Fusionamos dirección creativa de primer nivel con desarrollo técnico de alta velocidad para crear logotipos con autoridad, flyers de alto impacto y sitios web optimizados para conversión, rendimiento y posicionamiento internacional."
                      : "At Mora-Grafic's Studio, we do not work with generic templates. We fuse top-tier creative direction with high-speed technical development to create logos with authority, high-impact flyers, and websites optimized for conversion, performance, and international positioning."}
                  </p>
                  <p className="font-semibold text-neutral-200">
                    {lang === "es"
                      ? "Porque una empresa que aspira a crecer no necesita únicamente un diseño atractivo: necesita una estrategia digital capaz de impulsar resultados reales."
                      : "Because a company aspiring to grow doesn't just need an attractive design: it needs a digital strategy capable of driving real results."}
                  </p>
                </div>
              </div>

              {/* Photo Column */}
              <div className="lg:col-span-5 lg:sticky lg:top-6">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] shadow-2xl group max-w-[450px] mx-auto lg:max-w-none">
                  <img
                    src="images/gallery/mora.webp"
                    alt="César Aníbal Moradel Fonseca"
                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-blue-900/10 mix-blend-color"></div>
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-950/80 backdrop-blur border border-white/10">
                    <span className="block text-[10px] font-mono text-blue-400 font-semibold uppercase tracking-widest">
                      {lang === "es" ? "Director Creativo & Desarrollador" : "Creative Director & Developer"}
                    </span>
                    <span className="block text-xs font-bold text-white mt-0.5">
                      César Aníbal Moradel Fonseca
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* SECTIONS: BRAND STRATEGY & TECHNICAL VISION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* BRAND STRATEGY BLOCK */}
              <div className="bg-neutral-950/40 p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white font-display uppercase tracking-wide">
                    {lang === "es" ? "ESTRATEGIA DE MARCA" : "BRAND STRATEGY"}
                  </h4>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mt-1">
                    {lang === "es" ? "Posicionamiento estratégico" : "Strategic positioning"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {lang === "es"
                    ? "Mora-Grafic's Studio se posiciona como un socio estratégico de crecimiento, no simplemente como un proveedor de diseño. Nuestra estrategia de marca se basa en tres pilares:"
                    : "Mora-Grafic's Studio positions itself as a strategic growth partner, not simply a design vendor. Our brand strategy is built on three core pillars:"}
                </p>

                {/* Pillars Grid */}
                <div className="space-y-4">
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      {lang === "es" ? "Autoridad Visual" : "Visual Authority"}
                    </h5>
                    <p className="text-xs text-neutral-400 mt-1">
                      {lang === "es" ? "Construimos identidades que proyectan profesionalismo, confianza y diferenciación competitiva." : "We build identities that project professionalism, trust, and competitive differentiation."}
                    </p>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      {lang === "es" ? "Crecimiento Comercial" : "Commercial Growth"}
                    </h5>
                    <p className="text-xs text-neutral-400 mt-1">
                      {lang === "es" ? "Cada proyecto está orientado a mejorar visibilidad, captación de clientes y oportunidades de conversión." : "Each project is oriented toward improving visibility, customer acquisition, and conversion opportunities."}
                    </p>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      {lang === "es" ? "Proyección Internacional" : "International Projection"}
                    </h5>
                    <p className="text-xs text-neutral-400 mt-1">
                      {lang === "es" ? "Diseñamos marcas preparadas para competir en mercados globales, especialmente en Norteamérica." : "We design brands prepared to compete in global markets, especially in North America."}
                    </p>
                  </div>
                </div>

                {/* Our Approach Focus */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <h5 className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    {lang === "es" ? "Nuestro enfoque" : "Our approach"}
                  </h5>
                  <ul className="space-y-1.5 text-xs text-neutral-300 list-disc pl-4 marker:text-blue-400">
                    <li>{lang === "es" ? "Transformar negocios locales en marcas con percepción internacional." : "Transform local businesses into brands with international perception."}</li>
                    <li>{lang === "es" ? "Crear experiencias visuales coherentes en todos los puntos de contacto digitales." : "Create consistent visual experiences across all digital touchpoints."}</li>
                    <li>{lang === "es" ? "Convertir el diseño en una herramienta de posicionamiento y ventas." : "Turn design into a tool for positioning and sales."}</li>
                    <li>{lang === "es" ? "Desarrollar una identidad de marca sostenible y escalable en el tiempo." : "Develop a sustainable and scalable brand identity over time."}</li>
                  </ul>
                </div>
              </div>

              {/* TECHNICAL VISION BLOCK */}
              <div className="bg-neutral-950/40 p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white font-display uppercase tracking-wide">
                    {lang === "es" ? "VISIÓN TÉCNICA" : "TECHNICAL VISION"}
                  </h4>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mt-1">
                    {lang === "es" ? "Arquitectura para rendimiento y escalabilidad" : "Architecture for performance and scalability"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {lang === "es"
                    ? "La nueva generación de Mora-Grafic's Studio se construye sobre una visión técnica enfocada en rendimiento, escalabilidad y posicionamiento avanzado en buscadores e inteligencia artificial."
                    : "The next generation of Mora-Grafic's Studio is built upon a technical vision focused on performance, scalability, and advanced positioning in search engines and artificial intelligence."}
                </p>

                {/* Technical Principles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-blue-400 font-bold block mb-0.5">01</span>
                    <h5 className="text-xs font-bold text-white">{lang === "es" ? "Arquitectura de alta velocidad" : "High-speed architecture"}</h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{lang === "es" ? "Sitios optimizados para tiempos de carga mínimos." : "Sites optimized for minimal loading times."}</p>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-blue-400 font-bold block mb-0.5">02</span>
                    <h5 className="text-xs font-bold text-white">{lang === "es" ? "SEO y AEO integrados" : "Integrated SEO & AEO"}</h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{lang === "es" ? "Preparado para buscadores y motores de respuesta IA." : "Prepared for search engines and AI answer engines."}</p>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-blue-400 font-bold block mb-0.5">03</span>
                    <h5 className="text-xs font-bold text-white">{lang === "es" ? "Diseño mobile-first" : "Mobile-first design"}</h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{lang === "es" ? "Experiencias optimizadas para móviles desde el inicio." : "Optimized mobile experiences right from the start."}</p>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-blue-400 font-bold block mb-0.5">04</span>
                    <h5 className="text-xs font-bold text-white">{lang === "es" ? "Automatización inteligente" : "Smart automation"}</h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{lang === "es" ? "Integración de formularios, CRM y procesos analíticos." : "Integration of forms, CRM, and analytics processes."}</p>
                  </div>
                </div>

                {/* Technical Objective & Summary */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div>
                    <h5 className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      {lang === "es" ? "Nuestro objetivo técnico" : "Our technical objective"}
                    </h5>
                    <p className="text-xs text-neutral-300">
                      {lang === "es"
                        ? "Desarrollar plataformas digitales capaces de ofrecer máximo rendimiento, seguridad, visibilidad internacional y capacidad de conversión, convirtiendo cada sitio web en un activo estratégico de crecimiento empresarial."
                        : "Develop digital platforms capable of offering maximum performance, security, international visibility, and conversion capacity, turning each website into a strategic asset for business growth."}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/[0.03] border border-blue-500/10 rounded-xl">
                    <p className="text-xs italic text-neutral-300">
                      {lang === "es"
                        ? "En resumen: Mora-Grafic's Studio combina branding de autoridad con ingeniería digital avanzada para crear marcas que no solo se ven profesionales, sino que también compiten, posicionan y convierten al más alto nivel."
                        : "In summary: Mora-Grafic's Studio combines authoritative branding with advanced digital engineering to create brands that not only look professional but also compete, position, and convert at the highest level."}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 4: FAQ SECTION */}
        {activeSection === "faq" && (
          <div className="space-y-8 max-w-4xl mx-auto animate-fade-in" id="faq-section">
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-extrabold font-display text-white">{t.navFAQ}</h3>
              <p className="text-xs text-neutral-400">
                {lang === "es" ? "Respuestas honestas y transparentes sobre nuestros flujos de diseño de marca." : "Honest and transparent answers regarding our brand design workflows."}
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {activeFaqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-2 select-text"
                >
                  <h4 className="text-sm font-bold text-white flex items-start gap-2">
                    <BookOpen className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FLOATING GENAI CHATBOT WIDGET */}
      <CesarChatbot lang={lang} />

      {/* FOOTER PREMIUM */}
      <footer className="bg-neutral-950 border-t border-white/5 py-12 text-xs text-neutral-500" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Studio Brand */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-transparent flex items-center justify-center relative overflow-hidden">
                <img 
                  src="/images/logo/logo.webp" 
                  alt="Mora-Grafic's Logo" 
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fb = e.currentTarget.parentElement?.querySelector('.fallback-logo');
                    if (fb) fb.classList.remove('hidden');
                  }}
                />
                <div className="fallback-logo hidden h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  M
                </div>
				 {/* ... Contenedor superior o cierre previo según tu estructura ... */}
							</div> 
						</div>
						
						<div className="flex flex-col gap-1 text-[11px] leading-relaxed max-w-xs">
							{/* Dirección */}
							<p>Meadowlark Ln SW, Shallotte, NC 28470</p>
							
							{/* Teléfono */}
							<div>
								<a 
									href="https://wa.me/50498658519" 
									target="_blank" 
									rel="noopener noreferrer" 
									className="hover:underline text-blue-400"
								>
									+504 9865-8519
								</a>
							</div>
							
							{/* Correo Electrónico */}
							<div>
								<a 
									href="mailto:moragrafics@gmail.com" 
									className="hover:underline text-blue-400"
								>
									moragrafics@gmail.com
								</a>
							</div>
						</div>
					</div>

          {/* Quick Sitemap Links */}
          <div className="md:col-span-4 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-wider">
            <button onClick={() => navigateToPath(lang === "en" ? "/" : "/es")} className="hover:text-white transition-colors">{t.navHome}</button>
            <button onClick={() => setActiveSection("portfolio")} className="hover:text-white transition-colors">{t.navPortfolio}</button>
            <button onClick={() => setActiveSection("faq")} className="hover:text-white transition-colors">{t.navFAQ}</button>
            <button onClick={() => setActiveSection("about")} className="hover:text-white transition-colors">{t.navAbout}</button>
          </div>

          {/* Legal / Policy links */}
          <div className="md:col-span-4 text-left md:text-right space-y-1.5 font-mono text-[10px]">
            <p className="text-neutral-400">
              © 2026 Mora-Grafic's Studio. All rights reserved.
            </p>
            <div className="flex flex-wrap md:justify-end gap-3 text-neutral-600">
              <button 
                onClick={() => setLegalModalType("privacy")} 
                className="hover:text-blue-400 transition-colors underline"
              >
                {lang === "es" ? "Política de Privacidad" : "Privacy Policy"}
              </button>
              <span>·</span>
              <button 
                onClick={() => setLegalModalType("terms")} 
                className="hover:text-blue-400 transition-colors underline"
              >
                {lang === "es" ? "Términos de Uso" : "Terms of Use"}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* POPUP MODAL FOR PRIVACY & TERMS (ITEM 8) */}
      <AnimatePresence>
        {legalModalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 max-h-[85vh] overflow-y-auto select-text"
            >
              <button
                onClick={() => setLegalModalType(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-white/5 p-1.5 rounded-lg border border-white/5 transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              {legalModalType === "privacy" ? (
                <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                  <h3 className="text-lg font-bold font-display text-white">
                    {lang === "es" ? "Política de Privacidad" : "Privacy Policy"}
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-500">
                    {lang === "es" ? "Última actualización: Julio 10, 2026" : "Last Updated: July 10, 2026"}
                  </p>
                  <p>
                    {lang === "es" 
                      ? "En Mora-Grafic's Studio valoramos y respetamos su privacidad. Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos la información personal que proporciona a través de nuestro formulario de contacto o interacciones directas."
                      : "At Mora-Grafic's Studio, we value and respect your privacy. This privacy policy describes how we collect, use, and protect the personal information you provide via our contact form or direct interactions."}
                  </p>
                  <h4 className="font-bold text-white">
                    {lang === "es" ? "1. Información Recopilada" : "1. Information Collected"}
                  </h4>
                  <p>
                    {lang === "es"
                      ? "Recopilamos información identificable como su nombre completo, dirección de correo electrónico, número de teléfono, presupuesto de proyecto e información comercial específica suministrada de forma voluntaria al enviar solicitudes."
                      : "We collect identifiable information such as your full name, email address, phone number, project budget, and specific business information voluntarily provided when submitting requests."}
                  </p>
                  <h4 className="font-bold text-white">
                    {lang === "es" ? "2. Uso de los Datos" : "2. How We Use Data"}
                  </h4>
                  <p>
                    {lang === "es"
                      ? "Utilizamos su información exclusivamente para procesar cotizaciones, programar consultas de estrategia visual y comunicarnos con usted directamente acerca de sus proyectos y necesidades de branding."
                      : "We use your information exclusively to process quotations, schedule visual strategy consultations, and directly communicate with you about your projects and branding requirements."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                  <h3 className="text-lg font-bold font-display text-white">
                    {lang === "es" ? "Términos de Uso" : "Terms of Use"}
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-500">
                    {lang === "es" ? "Última actualización: Julio 10, 2026" : "Last Updated: July 10, 2026"}
                  </p>
                  <p>
                    {lang === "es"
                      ? "Bienvenido a Mora-Grafic's Studio. Al acceder a este portal web, usted acepta cumplir con estos términos de uso y todas las leyes aplicables."
                      : "Welcome to Mora-Grafic's Studio. By accessing this web portal, you agree to comply with these terms of use and all applicable laws."}
                  </p>
                  <h4 className="font-bold text-white">
                    {lang === "es" ? "1. Propiedad Intelectual" : "1. Intellectual Property"}
                  </h4>
                  <p>
                    {lang === "es"
                      ? "Todo el material visual, logotipos de muestra, flyers promocionales y código de portafolio expuesto en este sitio pertenece a Mora-Grafic's Studio y sus respectivos clientes. Queda prohibida la reproducción sin autorización."
                      : "All visual assets, sample logos, promotional flyers, and portfolio code presented on this site belong to Mora-Grafic's Studio and its respective clients. Unauthorized reproduction is strictly prohibited."}
                  </p>
                  <h4 className="font-bold text-white">
                    {lang === "es" ? "2. Limitación de Responsabilidad" : "2. Limitation of Liability"}
                  </h4>
                  <p>
                    {lang === "es"
                      ? "Mora-Grafic's Studio no se hace responsable de daños derivados del uso o imposibilidad de uso del sitio web, ni de inexactitudes en la información de terceros expuesta."
                      : "Mora-Grafic's Studio is not liable for damages arising from the use or inability to use this website, nor for inaccuracies in any presented third-party information."}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
