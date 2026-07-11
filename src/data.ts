import { TranslationSet, CaseStudy } from "./types";

export const translations: Record<string, TranslationSet> = {
  en: {
    navHome: "Home",
    navServices: "Services",
    navPortfolio: "Portfolio",
    navFAQ: "FAQ",
    navAbout: "About Us",
    navContact: "Contact",
    navCRM: "Workspace", // Not shown but kept for type compliance

    heroTag: "MORA-GRAFIC'S STUDIO — WORLD CLASS CREATIVE",
    heroTitle: "Web Design, Branding & Advertising that Converts",
    heroSub: "We transform businesses through immersive, impactful interfaces and authoritative positioning. Premium web design for leading brands.",
    heroCtaPrimary: "Explore Portfolios",
    heroCtaSec: "Contact Us Now",
    heroStaticFallbackNote: "", // Left empty as requested

    servicesTitle: "Authority Services",
    servicesSubtitle: "Expertises engineered to project luxury and capture global business sectors",

    portfolioTitle: "Portfolio",
    portfolioSubtitle: "Explore our real, indexable success stories in web design, branding, advertising, and videos",
    portfolioAll: "Websites",
    portfolioFilterWeb: "Websites",
    portfolioFilterBranding: "Logos",
    portfolioFilterFlyers: "Flyers",
    portfolioFilterVideos: "Videos",

    resultsTitle: "Growth in Numbers",
    resultsSubtitle: "Real metrics backed by direct client growth and branding audits",
    resultsMetric1Val: "25+",
    resultsMetric1Lbl: "High-End Sites Launched",
    resultsMetric2Val: "95+",
    resultsMetric2Lbl: "Guaranteed Lighthouse Score",
    resultsMetric3Val: "3x",
    resultsMetric3Lbl: "Average Conversion Uplift",

    aboutTitle: "About US",
    aboutText1: "Mora-Grafic's Studio, founded and led by César Aníbal Moradel Fonseca, is a world-class boutique creative studio dedicated to redefining visual brand authority for ambitious businesses in the USA, Canada, and Honduras.",
    aboutText2: "We bypass generic layouts. Our strategy blends cinematic art direction with ultra-fast modern code to build unforgettable brands, high-converting printed materials, and fast web portfolios that turn traffic into loyal clients.",
    aboutFounderTitle: "Creative Director & Tech Founder",

    testimonialsTitle: "Satisfied Clients",
    testimonialsSubtitle: "Verifiable reviews from business owners who leveled up their brand authority",

    contactTitle: "Book a Strategy Session",
    contactSubtitle: "Let's align your branding with your true business potential and sales objectives",
    contactNameLabel: "Company or Contact Name",
    contactEmailLabel: "Email Address",
    contactPhoneLabel: "Phone Number",
    contactBudgetLabel: "Estimated Budget",
    contactServiceLabel: "Service of Interest",
    contactMessageLabel: "Describe your project and core goals",
    contactSubmitBtn: "Send Strategy Request"
  },
  es: {
    navHome: "Inicio",
    navServices: "Servicios",
    navPortfolio: "Portafolio",
    navFAQ: "Preguntas Frecuentes",
    navAbout: "Nosotros",
    navContact: "Contacto",
    navCRM: "Workspace", // No se muestra pero se mantiene por compatibilidad

    heroTag: "MORA-GRAFIC'S STUDIO — CLASE INTERNACIONAL",
    heroTitle: "Diseño Web, Branding & Publicidad que convierten",
    heroSub: "Transformamos negocios mediante interfaces de impacto inmersivo y posicionamiento de autoridad. Diseño web premium para marcas líderes.",
    heroCtaPrimary: "Ver Portafolios",
    heroCtaSec: "Contactar Ahora",
    heroStaticFallbackNote: "", // Se quita según solicitud

    servicesTitle: "Servicios de Autoridad",
    servicesSubtitle: "Especialidades diseñadas para proyectar sofisticación y capturar mercados globales",

    portfolioTitle: "Portafolio",
    portfolioSubtitle: "Explora nuestros casos de éxito en desarrollo web, branding, flyers publicitarios y videos",
    portfolioAll: "Páginas Web",
    portfolioFilterWeb: "Páginas Web",
    portfolioFilterBranding: "Logos (4x4)",
    portfolioFilterFlyers: "Flyers (3x3)",
    portfolioFilterVideos: "Videos (2x3)",

    resultsTitle: "Transformación en Números",
    resultsSubtitle: "Métricas de crecimiento y posicionamiento real respaldadas por auditorías",
    resultsMetric1Val: "25+",
    resultsMetric1Lbl: "Sitios Premium Diseñados",
    resultsMetric2Val: "95+",
    resultsMetric2Lbl: "Puntaje Lighthouse Garantizado",
    resultsMetric3Val: "3x",
    resultsMetric3Lbl: "Aumento en Tasa de Conversión",

    aboutTitle: "Sobre Nosotros",
    aboutText1: "Mora-Grafic's Studio, fundado y liderado por César Aníbal Moradel Fonseca, es un estudio boutique de clase mundial enfocado en redefinir la presencia comercial y visual de marcas ambiciosas en Estados Unidos, Canadá y Honduras.",
    aboutText2: "No somos una agencia genérica de plantillas. Fusionamos la dirección de arte cinematográfica de primer nivel con desarrollos técnicos de alta velocidad para que tu marca destaque mediante logotipos de autoridad, flyers de alto impacto y páginas web ultra-rápidas.",
    aboutFounderTitle: "Director Creativo",

    testimonialsTitle: "Clientes Satisfechos",
    testimonialsSubtitle: "Testimonios verificables de empresarios que dieron el salto al nivel premium",

    contactTitle: "Agendar Sesión de Estrategia",
    contactSubtitle: "Hablemos de cómo llevar tu marca al siguiente nivel de autoridad y ventas",
    contactNameLabel: "Nombre Completo o Empresa",
    contactEmailLabel: "Correo Electrónico",
    contactPhoneLabel: "Teléfono de Contacto",
    contactBudgetLabel: "Presupuesto Estimado",
    contactServiceLabel: "Servicio de Interés",
    contactMessageLabel: "Cuéntanos sobre tu proyecto y objetivos comerciales",
    contactSubmitBtn: "Enviar Solicitud de Estrategia"
  }
};

// Localized Services (Exact texts requested by the user, completely free of tech-larp or instructions)
export const servicesEs = [
  {
    id: "diseno-web",
    title: "Desarrollo Web",
    description: "Sitios y portafolios multi-página de alta velocidad estructurados para posicionamiento y conversiones de autoridad.",
    features: [
      "Animaciones Liquid Glass y carga inmediata",
      "Estructuras multiidioma indexables reales",
      "Páginas de Caso de Estudio individuales",
      "Puntaje Lighthouse 95+ garantizado",
      "Formularios inteligentes optimizados con spam-block"
    ],
    icon: "Globe"
  },
  {
    id: "branding",
    title: "Branding",
    description: "Manuales de marca, pautas tipográficas, logotipos emblemáticos y mockups que proyectan estatus premium.",
    features: [
      "Diseño de logotipos vectoriales escalables",
      "Esquemas cromáticos de lujo y guías de uso",
      "Mockups de papelería, vehículos y uniformes",
      "Consultoría de posicionamiento de mercado",
      "Registros de marca e identidad digital"
    ],
    icon: "Award"
  },
  {
    id: "publicidad-visual",
    title: "Publicidad y Flyers Premium",
    description: "Diseño colateral de altísima fidelidad y layouts de impacto listos para impresión o redes sociales.",
    features: [
      "Flyers con diseño de rejilla asimétrica premium",
      "Gráficos comerciales listos para imprenta",
      "Tarjetas de presentación de alto gramaje",
      "Banners publicitarios de conversión digital",
      "Contenido promocional cohesivo"
    ],
    icon: "FileText"
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics 3D",
    description: "Animaciones y modelados dinámicos que capturan la atención en segundos y explican servicios complejos.",
    features: [
      "Intros de marca con iluminación cinematográfica",
      "Explicativos animados de productos y servicios",
      "Gráficos en movimiento para redes sociales",
      "Animación de logotipos y transiciones de interfaz",
      "Renders fluidos de alta tasa de frames"
    ],
    icon: "Tv"
  },
  {
    id: "produccion-audiovisual",
    title: "Producción Audio Visual",
    description: "Edición cinematográfica de reels, videos de marca y cortos de alto impacto listos para YouTube y redes sociales.",
    features: [
      "Reels corporativos y videos promocionales",
      "Corrección de color cinematográfica (LUTs premium)",
      "Edición de sonido de impacto y música integrada",
      "Optimización de compresión sin pérdida para streaming",
      "Video SEO estructurado (VideoObject Schema)"
    ],
    icon: "Video"
  }
];

export const servicesEn = [
  {
    id: "diseno-web",
    title: "Web Development",
    description: "High-speed multi-page websites and portfolios built for global visibility and top-tier client acquisition.",
    features: [
      "Liquid Glass animations and instant loading speed",
      "Real search-engine indexable multilingual structures",
      "Individual detailed Case Study pages",
      "Guaranteed Google Lighthouse score of 95+",
      "Smart contact forms optimized with spam-blocking"
    ],
    icon: "Globe"
  },
  {
    id: "branding",
    title: "Branding",
    description: "Luxurious typography sheets, emblem logos, visual manuals, and corporate mockups that project ultimate status.",
    features: [
      "Scalable professional vector logo design",
      "Luxurious color schemes and complete usage guidelines",
      "High-end stationery, vehicle wraps, and uniform mockups",
      "Market positioning and premium authority consulting",
      "Trademark registries and unified digital identity"
    ],
    icon: "Award"
  },
  {
    id: "publicidad-visual",
    title: "Advertising & Premium Flyers",
    description: "High-fidelity layouts and advertising collaterals optimized for direct print or digital channels.",
    features: [
      "Flyers engineered with premium asymmetric grids",
      "Print-ready high-fidelity commercial graphics",
      "Premium heavyweight professional business cards",
      "High-converting visual advertising web banners",
      "Cohesive promo assets for multiple channels"
    ],
    icon: "FileText"
  },
  {
    id: "motion-graphics",
    title: "3D Motion Graphics",
    description: "Captivating animations and 3D mockups designed to explain complex services and stand out in seconds.",
    features: [
      "Brand intros styled with cinematic lighting and focus",
      "Animated explainer reels for products and services",
      "Stunning custom motion templates for social media",
      "Logo animations and fluid user interface transitions",
      "Smooth visual renders outputted at high frame rates"
    ],
    icon: "Tv"
  },
  {
    id: "produccion-audiovisual",
    title: "Audiovisual Production",
    description: "Cinematic reel editing, brand videos, and corporate commercials optimized for streaming platforms.",
    features: [
      "Polished corporate reels and promotional footage",
      "Cinematic color correction with custom premium LUTs",
      "Impactful sound design and integrated licensed audio",
      "Lossless video compression for flawless fast streaming",
      "Structured video SEO using VideoObject schemas"
    ],
    icon: "Video"
  }
];

// Localized FAQs (Clean, professional, bilingual)
export const faqsEs = [
  {
    q: "¿Por qué Mora-Grafic's Studio se diferencia de una agencia de diseño web común?",
    a: "No creamos simples plantillas estáticas. Integramos una dirección de arte cinematográfica premium (estilo Apple) con tecnología de carga ultrarrápida (Lighthouse 95+), arquitectura SEO real y diseño adaptativo de alto impacto que proyecta máxima confiabilidad."
  },
  {
    q: "¿Cómo funciona la arquitectura de posicionamiento internacional y multiidioma?",
    a: "Nuestra plataforma implementa rutas independientes por idioma (con subdirectorios limpios), lo que asegura la indexación completa por parte de Google para cada mercado objetivo, a diferencia de los traductores automáticos de Javascript."
  },
  {
    q: "¿Qué garantías ofrecen sobre el rendimiento y velocidad de carga LCP?",
    a: "Garantizamos un puntaje mínimo de 95 en la suite de auditoría de Lighthouse de Google. Implementamos carga perezosa (lazy-loading) de recursos, formatos de imagen WebP de última generación altamente comprimidos sin pérdida, y código limpio modular."
  }
];

export const faqsEn = [
  {
    q: "How does Mora-Grafic's Studio differ from a standard web design agency?",
    a: "We do not build simple static templates. We combine premium cinematic art direction (Apple-style) with ultra-fast loading speeds (Lighthouse 95+), authentic search engine optimization, and high-impact custom layouts that project ultimate brand authority."
  },
  {
    q: "How does the international and multi-language positioning architecture work?",
    a: "Our platform implements independent language routing paths with clean subdirectories, ensuring complete Google search engine indexation for each target country and market, instead of poor automatic Javascript translations."
  },
  {
    q: "What guarantees do you offer regarding performance and LCP load speeds?",
    a: "We guarantee a minimum score of 95 on Google's Lighthouse audit suite. We achieve this through strict asset lazy-loading, highly-compressed next-gen WebP images, and clean, modular code with zero bloat."
  }
];

// Localized Testimonials (Bilingual & properly named "Clientes Satisfechos" / "Satisfied Clients")
export const testimonialsEs = [
  {
    quote: "Mora-Grafic's Studio transformó por completo nuestra imagen de marca. El diseño web azul celeste y nuestra galería de videos nos permitió cotizar proyectos residenciales de pintura por el doble del valor que solíamos cobrar. Absolutamente recomendados.",
    author: "Armando Erazo",
    role: "Prpietario",
    company: "Erazo's Painting LLC, NC",
    rating: 5,
    logo: "AE"
  },
  {
    quote: "Buscábamos un sitio que se sintiera como una obra de arte. La galería de nuestros trabajos dejó sin palabras a los contratistas generales más exigentes de Carolina del Norte. Su SEO local nos tiene en primer lugar.",
    author: "Erlin Gabriel Izcano",
    role: "Propietario",
    company: "Woodpecker Carpentry LLC, NC",
    rating: 5,
    logo: "EGI"
  },
  {
    quote: "La velocidad de carga y la claridad de la propuesta visual nos adjudicó cuatro contratos de paisajismo muy codiciados. Más que un portafolio, nos construyeron una máquina comercial.",
    author: "Emerson Serrano",
    role: "Propietario",
    company: "GDS Pro Service NY",
    rating: 5,
    logo: "ES"
  }
];

export const testimonialsEn = [
  {
    quote: "Mora-Grafic's Studio completely transformed our brand image. Their light blue website design and video gallery allowed us to quote residential painting projects at double the price we used to charge. Absolutely recommended.",
    author: "Armando Erazo",
    role: "Owner",
    company: "Erazo's Painting LLC, NC",
    rating: 5,
    logo: "AE"
  },
  {
    quote: "We were looking for a place that felt like a work of art. Our portfolio left even the most demanding general contractors in North Carolina speechless. Their local SEO ranks us number one.",
    author: "Erlin Gabriel Izcano",
    role: "Owner",
    company: "Woodpecker Carpentry LLC, NC",
    rating: 5,
    logo: "EGI"
  },
  {
    quote: "The speed of loading and the clarity of the visual proposal won us four highly sought-after landscaping contracts. More than just a portfolio, they built us a commercial machine.",
    author: "Emerson Serrano",
    role: "Owner",
    company: "GDS Pro Service, NY",
    rating: 5,
    logo: "ES"
  }
];

// Case Studies (Websites category)
export const caseStudies: CaseStudy[] = [
  {
    id: "woodpecker-carpentry",
    title: "Woodpecker Carpentry LLC",
    client: "Woodpecker Carpentry LLC",
    url: "www.woodpeckerc.com/",
    industry: "Luxury Carpentry & Cabinetry",
    year: "2026",
    tags: ["Web Design", "Branding", "Interactive Gallery"],
    problem: "An outdated, non-responsive website that failed to showcase the craftsmanship required to secure high-value luxury residential contracts.",
    solution: "A modern, minimalist portfolio featuring seamless transitions, WebP image optimizations, and high-impact showcases highlighting fine wood details.",
    results: "A 140% increase in kitchen remodel and premium cabinetry inquiries within the first 90 days of launch.",
    technologies: [],
    image: "images/gallery/p-012.webp"
  },
  {
    id: "infinite-iron-works",
    title: "Infinite Iron Works",
    client: "Infinite Iron Works",
    url: "www.infinite-ironw.com/",
    industry: "Ornamental Steel & Iron Works",
    year: "2026",
    tags: ["Web Design", "Local SEO", "3D Showcase"],
    problem: "No digital search footprint or professional presentation materials to present to general contractors and architects.",
    solution: "A high-converting landing page optimized with localized geo-targeted SEO keywords, clean photography alt-tags, and a high-fidelity gallery.",
    results: "Top 3 local search rankings in Shallotte, NC, establishing a steady stream of contract calls from regional developers.",
    technologies: [],
    image: "images/gallery/p-001.webp"
  },
  {
    id: "lawn-irrigation-corp",
    title: "Lawn Irrigation Corp",
    client: "Lawn Irrigation Corp",
    url: "www.lawnirrigationcorp.com/",
    industry: "Commercial & Residential Irrigation",
    year: "2026",
    tags: ["Web Design", "Sales Funnel"],
    problem: "Exorbitant cost-per-click ad campaign bills due to a slow, outdated website that converted less than 2% of visitors.",
    solution: "A lightning-fast, highly optimized landing page (100/100 Lighthouse score) coupled with an intuitive budget estimation guide.",
    results: "A 45% reduction in lead acquisition costs and a boost in overall web conversion rates up to 8.5%.",
    technologies: [],
    image: "images/gallery/p-002.webp"
  },
  {
    id: "gdl-pro-service",
    title: "GDL Pro Service",
    client: "GDL Pro Service",
    url: "www.gdlproservice.com/",
    industry: "Post-Construction Commercial Cleaning",
    year: "2024",
    tags: ["Web Design", "B2B Lead Gen"],
    problem: "Lack of corporate credibility when pitching post-construction cleaning proposals to major general contractors and builders.",
    solution: "A premium corporate portal containing high-resolution before/after sliders, digital download sheets, and streamlined proposal request forms.",
    results: "Successfully awarded 4 major condominium post-construction contracts immediately following the launch.",
    technologies: [],
    image: "images/gallery/p-003.webp"
  },
  {
    id: "erazos-painting",
    title: "Erazo's Painting LLC",
    client: "Erazo's Painting LLC",
    url: "www.erazospaintingllc.com/",
    industry: "Residential & Commercial Painting",
    year: "2026",
    tags: ["Branding", "Web Design"],
    problem: "A generic visual presence that forced them to compete on low-pricing against uncertified independent painters.",
    solution: "Complete premium rebranding (gold and black aesthetic), high-fidelity typography scales, and a cinematic project portfolio.",
    results: "A 60% increase in average proposal size accepted. The brand successfully shifted from price-competition to luxury value.",
    technologies: [],
    image: "images/gallery/p-004.webp"
  },
  {
    id: "green-design-services",
    title: "Green Design Services",
    client: "Green Design Services",
    url: "www.greendservices.com/",
    industry: "Landscape Architecture",
    year: "2024",
    tags: ["Web Design", "3D Gallery"],
    problem: "The client's landscape render files were slow and heavy, causing extreme delays and high bounce rates.",
    solution: "Implementation of responsive design grids and deferred loading protocols for high-fidelity portfolio images.",
    results: "Organic search traffic boosted by 200% with average sessions exceeding three minutes.",
    technologies: [],
    image: "images/gallery/p-005.webp"
  },
  {
    id: "velasquez-builders",
    title: "Velasquez Builders",
    client: "Velasquez Builders",
    url: "velasquezbuilders.com/",
    industry: "General Contracting & Remodeling",
    year: "2026",
    tags: ["Web Design", "Branding", "Local SEO"],
    problem: "An invisible local map presence and unorganized photo catalogs of completed works.",
    solution: "A custom modular layout engineered around a robust 12-column grid, showcasing individual landing pages for core projects.",
    results: "Organic contract calls increased from 2 to 15 weekly within Shallotte NC and surrounding areas.",
    technologies: [],
    image: "images/gallery/p-006.webp"
  },
  {
    id: "aak-interior-design",
    title: "AAK Interior Design",
    client: "AAK Interior Design",
    url: "sites.google.com/view/aak-interior-design",
    industry: "Luxury Interior Architecture",
    year: "2023",
    tags: ["Branding", "Consultation"],
    problem: "An outdated layout that failed to attract premium residential remodeling prospects.",
    solution: "Complete visual rebranding guideline, bespoke serif typography pairing, and an elegant corporate catalog.",
    results: "Aligned their visual identity with high-end developers and luxury property managers.",
    technologies: [],
    image: "images/gallery/p-007.webp"
  },
  {
    id: "storm-group-contractor",
    title: "Storm Group Contractor",
    client: "Storm Group Contractor",
    url: "sites.google.com/view/storm-group-contractor",
    industry: "Commercial Remodeling & Roofing",
    year: "2023",
    tags: ["Logo Design", "Stationery"],
    problem: "A dated visual mark that weakened corporate bids on school district and commercial roof repair contracts.",
    solution: "A modern, bold structural logo mark alongside cohesive professional proposal layout sheets.",
    results: "Successfully pre-qualified and won municipal roofing reconstruction bids.",
    technologies: [],
    image: "images/gallery/p-008.webp"
  },
  {
    id: "rzm-auto-repair",
    title: "RZM Auto Repair",
    client: "RZM Auto Repair",
    url: "sites.google.com/view/rzm-auto-repair",
    industry: "Automotive Diagnostics & Repairs",
    year: "2023",
    tags: ["Branding", "Local Marketing"],
    problem: "Low brand recall among local drivers facing unexpected vehicle service needs.",
    solution: "Modernized high-contrast brand mark alongside cohesive flyer designs optimized for direct-mail and local distribution.",
    results: "A 35% growth in local shop drop-offs and quote requests via WhatsApp Business.",
    technologies: [],
    image: "images/gallery/p-010.webp"
  }
];

// Logos Portfolio - 16 Items (4 Rows x 4 Columns)
export interface LogoItem {
  id: string;
  name: string;
  industry: string;
  image: string;
}

export const logosPortfolio: LogoItem[] = [
  { id: "l1", name: "Woodpecker", industry: "Residential Handyman", image: "images/branding/016.webp" },
  { id: "l2", name: "Erazo's Painting", industry: "Residential and Commercial Painting", image: "images/branding/005.webp" },
  { id: "l3", name: "GDS Pro Service", industry: "Residential and Commercial Landscaping", image: "images/branding/002.webp" },
  { id: "l4", name: "Infinite Iron", industry: "Premium Metallurgy", image: "images/branding/007.webp" },
  { id: "l5", name: "Velasquez Builders", industry: "Construction and Remodeling", image: "images/branding/012.webp" },
  { id: "l6", name: "Storm Group", industry: "Reconstruction and Roofing", image: "images/branding/010.webp" },
  { id: "l7", name: "RZM Diagnostics", industry: "Automotive Workshop", image: "images/branding/013.webp" },
  { id: "l8", name: "Lawn Irrigation", industry: "Automatic Irrigation Systems", image: "images/branding/008.webp" },
  { id: "l9", name: "AAK Design", industry: "Interior Architecture", image: "images/branding/001.webp" },
  { id: "l10", name: "SL Construções e Investimentos", industry: "Construction Company in Mozambique", image: "images/branding/018.webp" },
  { id: "l11", name: "JSM Motor Works", industry: "Mechanical Services", image: "images/branding/011.webp" },
  { id: "l12", name: "Mercancia Americana", industry: "American Goods Store", image: "images/branding/014.webp" },
  { id: "l13", name: "The Fuve Brothers Village", industry: "Corporate Identity Tourism", image: "images/branding/004.webp" },
  { id: "l14", name: "Angie's Shoe Store", industry: "Shoe store", image: "images/branding/006.webp" },
  { id: "l15", name: "EUCORD SA", industry: "Corporate Identity", image: "images/branding/009.webp" },
  { id: "l16", name: "Mora Grafic's Studio", industry: "Corporate Identity", image: "images/branding/017.webp" }
];

// Flyers Portfolio - 9 Items (3 Rows x 3 Columns)
export interface FlyerItem {
  id: string;
  title: string;
  client: string;
  image: string;
}

export const flyersPortfolio: FlyerItem[] = [
  { id: "f1", title: "Residential Painting Promotional Flyer", client: "Erazo's Painting", image: "images/flyers/f-002.webp" },
  { id: "f2", title: "Blacksmithing Services Brochure", client: "Infinite Iron Works", image: "images/flyers/f-004.webp" },
  { id: "f3", title: "Post-Construction Promotional Campaign", client: "GDS Pro Service", image: "images/flyers/f-001.webp" },
  { id: "f4", title: "Handyman Services", client: "Woodpecker Carpentry", image: "images/flyers/f-005.webp" },
  { id: "f5", title: "Car diagnostics and repair", client: "RZM Auto Repair", image: "images/flyers/f-009.webp" },
  { id: "f6", title: "Lawn Sprinkler Design", client: "Lawn Irrigation Corp", image: "images/flyers/f-003.webp" },
  { id: "f7", title: "Interior Design Flyer", client: "AAK Interior Design", image: "images/flyers/f-008.webp" },
  { id: "f8", title: "From Plans to Perfection", client: "Velasquez Builders", image: "images/flyers/f-006.webp" },
  { id: "f9", title: "Promotional Campaign Flyer", client: "Jugos Celes", image: "images/flyers/f-007.webp" }
];

// Videos Portfolio - 6 Items (2 Rows x 3 Columns)
export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  type: string;
  image: string;
}

export const videosPortfolio: VideoItem[] = [
  { id: "v-001.mp4", title: "Residential Painting Reel", duration: "0:30", type: "28462, Holden Beach, NC", image: "images/video/m-v001.webp" },
  { id: "v-002.mp4", title: "Local SEO Promo Video", duration: "0:50", type: "11727, Long Island, NY", image: "images/video/m-v002.webp" },
  { id: "v-003.mp4", title: "Local SEO Promo Video", duration: "0:30", type: "46268, Indianápolis, IN", image: "images/video/m-v003.webp" },
  { id: "v-004.mp4", title: "Local SEO Promo Video", duration: "0:40", type: "46268, Indianápolis, IN", image: "images/video/m-v004.webp" },
  { id: "v-005.mp4", title: "Local SEO Promo Video", duration: "0:37", type: "28465, Oak Island, NC", image: "images/video/m-v005.webp" },
  { id: "v-006.mp4", title: "Local SEO Promo Video", duration: "1:19", type: "28469, Holden Beach NC", image: "images/video/m-v006.webp" }
];
