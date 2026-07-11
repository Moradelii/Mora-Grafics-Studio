import React, { useState } from "react";
import { ExternalLink, ArrowRight, ArrowLeft, Play, LayoutGrid, Layers, FileImage, Video, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CaseStudy } from "../types";
import { caseStudies, logosPortfolio, flyersPortfolio, videosPortfolio, VideoItem } from "../data";

// Helper function to normalize asset paths for deep client-side routes (e.g. /casos-de-exito/*)
const getAbsoluteSrc = (src: string) => {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  return src.startsWith("/") ? src : `/${src}`;
};

interface ShowcaseProps {
  onSelectProject: (id: string) => void;
  selectedProjectId: string | null;
  onClearProject: () => void;
  lang: string;
}

export default function PortfolioShowcase({ onSelectProject, selectedProjectId, onClearProject, lang }: ShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"Web" | "Logos" | "Flyers" | "Videos">("Web");
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string; subtitle?: string } | null>(null);

  const tabLabels = {
    en: {
      Web: "Websites",
      Logos: "Logos",
      Flyers: "Flyers",
      Videos: "Videos",
      back: "Back to Portfolio",
      visitSite: "Visit Designed Website",
      duration: "Duration:",
      client: "Client:",
      challenge: "The Challenge",
      transformation: "The Transformation",
      impact: "Commercial Impact",
      challengeTitle: "Initial Bottlenecks & Weaknesses",
      transformationTitle: "Mora-Grafic's Strategic Solution",
      impactTitle: "Results & Value Secured",
      websiteText: "Website:",
      yearText: "Year:"
    },
    es: {
      Web: "Páginas Web",
      Logos: "Logos",
      Flyers: "Flyers",
      Videos: "Videos",
      back: "Volver al Portafolio",
      visitSite: "Visitar Sitio Web Diseñado",
      duration: "Duración:",
      client: "Cliente:",
      challenge: "El Desafío",
      transformation: "La Transformación",
      impact: "Impacto Comercial",
      challengeTitle: "Brechas y Debilidades Iniciales",
      transformationTitle: "Solución Estratégica Mora-Grafic's",
      impactTitle: "Resultados e Incrementos",
      websiteText: "Sitio Web:",
      yearText: "Año:"
    }
  };

  const l = lang === "es" ? tabLabels.es : tabLabels.en;

  // Find currently selected project details for full-page presentation
  const selectedProject = caseStudies.find((p) => p.id === selectedProjectId);

  return (
    <div className="space-y-8" id="portfolio-showcase-module">
      
      {/* Dynamic Render: Full Page Case Study Detail */}
      <AnimatePresence mode="wait">
        {selectedProject ? (
          <motion.div
            key="case-study-detail"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="rounded-2xl liquid-glass border border-white/10 p-6 md:p-8 space-y-6 select-text"
            id="case-study-full-view"
          >
            {/* Back Button */}
            <button
              onClick={onClearProject}
              className="flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-xl"
              id="case-study-back-btn"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{l.back}</span>
            </button>

            {/* Title / Hero Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-white/5 pb-8">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/25 rounded-full text-[10px] font-mono uppercase tracking-wider">
                    {selectedProject.industry}
                  </span>
                  <span className="px-3 py-0.5 bg-white/5 text-neutral-400 border border-white/10 rounded-full text-[10px] font-mono">
                    {l.yearText} {selectedProject.year}
                  </span>
                </div>
                <h3 className="text-2xl md:text-4xl font-extrabold font-display text-white text-gradient-blue">
                  {selectedProject.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-mono">
                  {l.websiteText} <a href={`https://${selectedProject.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline inline-flex items-center gap-1">
                    {selectedProject.url}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </p>
              </div>

              {/* Cover Mockup */}
              <div className="lg:col-span-5">
                <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video shadow-2xl">
                  <img
                    src={getAbsoluteSrc(selectedProject.image)}
                    alt={selectedProject.title}
                    className="object-cover w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-neutral-950/20 mix-blend-multiply"></div>
                </div>
              </div>
            </div>

            {/* Problem, Solution, Results Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {/* Problem */}
              <div className="p-5 rounded-xl bg-neutral-900/40 border border-white/5 space-y-3">
                <div className="text-xs font-mono font-medium text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                  <span>{l.challenge}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-display">{l.challengeTitle}</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{selectedProject.problem}</p>
              </div>

              {/* Solution */}
              <div className="p-5 rounded-xl bg-neutral-900/40 border border-white/5 space-y-3">
                <div className="text-xs font-mono font-medium text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  <span>{l.transformation}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-display">{l.transformationTitle}</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{selectedProject.solution}</p>
              </div>

              {/* Results */}
              <div className="p-5 rounded-xl bg-neutral-900/40 border border-white/5 space-y-3">
                <div className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>{l.impact}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-display">{l.impactTitle}</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{selectedProject.results}</p>
              </div>
            </div>

            {/* Visit Button (Note: The technologies text list is removed as requested) */}
            <div className="pt-6 border-t border-white/5 flex justify-end">
              <a
                href={`https://${selectedProject.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2 shadow-blue-500/10"
              >
                <span>{l.visitSite}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div key="catalog" className="space-y-6">
            
            {/* Category selection bar */}
            <div className="flex flex-wrap gap-2 items-center border-b border-white/5 pb-4">
              <button
                onClick={() => setActiveTab("Web")}
                className={`px-4 py-2.5 text-xs font-medium rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === "Web"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/15 border border-blue-500/30"
                    : "bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/5"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>{l.Web}</span>
              </button>

              <button
                onClick={() => setActiveTab("Logos")}
                className={`px-4 py-2.5 text-xs font-medium rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === "Logos"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/15 border border-blue-500/30"
                    : "bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/5"
                }`}
              >
                <FileImage className="h-3.5 w-3.5" />
                <span>{l.Logos}</span>
              </button>

              <button
                onClick={() => setActiveTab("Flyers")}
                className={`px-4 py-2.5 text-xs font-medium rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === "Flyers"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/15 border border-blue-500/30"
                    : "bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/5"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>{l.Flyers}</span>
              </button>

              <button
                onClick={() => setActiveTab("Videos")}
                className={`px-4 py-2.5 text-xs font-medium rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === "Videos"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/15 border border-blue-500/30"
                    : "bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/5"
                }`}
              >
                <Video className="h-3.5 w-3.5" />
                <span>{l.Videos}</span>
              </button>
            </div>

            {/* RENDER CATEGORY: WEBSITES */}
            {activeTab === "Web" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="portfolio-grid-web">
                {caseStudies.map((project) => (
                  <motion.div
                    key={project.id}
                    layoutId={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className="rounded-xl overflow-hidden liquid-glass border border-white/5 hover:border-blue-500/30 cursor-pointer flex flex-col group relative"
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="aspect-video relative overflow-hidden bg-neutral-900">
                      <img
                        src={getAbsoluteSrc(project.image)}
                        alt={project.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-neutral-950/80 text-blue-400 border border-blue-500/20 rounded-full text-[9px] font-mono uppercase tracking-wider">
                        {project.industry.split(" ")[0]}
                      </span>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors font-display text-sm">
                          {project.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-mono mt-1">{project.url}</p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider font-mono flex items-center gap-1">
                          {lang === "es" ? "Estudiar Caso" : "Study Case"}
                          <ArrowRight className="h-3 w-3" />
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {project.year}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* RENDER CATEGORY: LOGOS (4 Rows x 4 Columns = 16 Items) */}
            {activeTab === "Logos" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="portfolio-grid-logos">
                {logosPortfolio.map((logo) => (
                  <motion.div
                    key={logo.id}
                    onClick={() => setSelectedImage({ url: logo.image, title: logo.name, subtitle: logo.industry })}
                    className="p-5 rounded-xl liquid-glass border border-white/5 flex flex-col items-center justify-center text-center space-y-4 hover:border-blue-500/30 transition-all duration-300 cursor-pointer group"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="h-28 w-28 rounded-lg overflow-hidden border border-white/10 bg-neutral-900 flex items-center justify-center relative">
                      <img
                        src={getAbsoluteSrc(logo.image)}
                        alt={logo.name}
                        className="object-cover w-full h-full filter grayscale hover:grayscale-0 transition-all duration-300"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-display group-hover:text-blue-400 transition-colors">{logo.name}</h4>
                      <p className="text-[9px] text-neutral-500 font-mono mt-0.5">{logo.industry}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* RENDER CATEGORY: FLYERS (3 Rows x 3 Columns = 9 Items) */}
            {activeTab === "Flyers" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="portfolio-grid-flyers">
                {flyersPortfolio.map((flyer) => (
                  <motion.div
                    key={flyer.id}
                    onClick={() => setSelectedImage({ url: flyer.image, title: flyer.title, subtitle: flyer.client })}
                    className="rounded-xl overflow-hidden liquid-glass border border-white/5 flex flex-col hover:border-blue-500/30 transition-all duration-300 group cursor-pointer"
                    whileHover={{ y: -4 }}
                  >
                    <div className="aspect-[2/3] relative overflow-hidden bg-neutral-900">
                      <img
                        src={getAbsoluteSrc(flyer.image)}
                        alt={flyer.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-103"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    </div>
                    <div className="p-4 space-y-1">
                      <span className="text-[9px] text-blue-400 font-mono uppercase tracking-wider">{flyer.client}</span>
                      <h4 className="text-xs font-bold text-white font-display leading-snug group-hover:text-blue-400 transition-colors">{flyer.title}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* RENDER CATEGORY: VIDEOS (2 Rows x 3 Columns = 6 Items) */}
            {activeTab === "Videos" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="portfolio-grid-videos">
                {videosPortfolio.map((vid) => (
                  <motion.div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className="rounded-xl overflow-hidden liquid-glass border border-white/5 flex flex-col hover:border-blue-500/30 transition-all duration-300 group cursor-pointer"
                    whileHover={{ y: -4 }}
                  >
                    <div className="aspect-video relative overflow-hidden bg-neutral-900">
                      <img
                        src={getAbsoluteSrc(vid.image)}
                        alt={vid.title}
                        className="object-cover w-full h-full"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all duration-300">
                        <div className="h-12 w-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border border-blue-400/30">
                          <Play className="h-5 w-5 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-neutral-950/80 text-white border border-white/10 rounded font-mono text-[9px]">
                        {vid.duration}
                      </span>
                    </div>
                    <div className="p-4 space-y-1">
                      <span className="text-[9px] text-blue-400 font-mono uppercase tracking-wider">{vid.type}</span>
                      <h4 className="text-xs font-bold text-white font-display leading-snug">{vid.title}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Playback Lightbox Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
            onClick={() => setSelectedVideo(null)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 p-2 rounded-full transition-all duration-300 shadow-md"
                aria-label="Cerrar video"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Video Element Wrapper */}
              <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                <video
                  src={`/${selectedVideo.id.startsWith('images') ? selectedVideo.id : `images/video/${selectedVideo.id}`}`}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Video Info Footer */}
              <div className="p-5 bg-neutral-900/90 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider font-semibold">
                    {selectedVideo.type}
                  </span>
                  <h3 className="text-base font-bold text-white font-display mt-0.5">
                    {selectedVideo.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    {lang === "es" ? "Duración" : "Duration"}: {selectedVideo.duration}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox Modal for Logos and Flyers */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative max-w-xl w-full max-h-[90vh] rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 p-2 rounded-full transition-all duration-300 shadow-md"
                aria-label="Cerrar imagen"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Image Element Wrapper */}
              <div className="flex-1 w-full bg-black relative flex items-center justify-center p-2 overflow-auto min-h-[300px]">
                <img
                  src={getAbsoluteSrc(selectedImage.url)}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Image Info Footer */}
              <div className="p-5 bg-neutral-900/90 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  {selectedImage.subtitle && (
                    <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider font-semibold">
                      {selectedImage.subtitle}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-white font-display mt-0.5">
                    {selectedImage.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    Mora-Grafic's Studio
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
