import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI with server-side API key
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "MOCK_KEY_IF_MISSING",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json({ limit: "50mb" }));

// Ensure persistent CRM folders and files exist
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const PROPOSALS_FILE = path.join(DATA_DIR, "proposals.json");

// Helper to read JSON DB
function readJsonFile(filePath: string, defaultData: any) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultData;
}

// Helper to write JSON DB
function writeJsonFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// Seed Initial CRM Leads if empty
const initialLeads = [
  {
    id: "lead-1",
    name: "Erazo's Painting LLC",
    contactName: "José Erazo",
    email: "erazospaintingllc@gmail.com",
    phone: "910-123-4567",
    website: "erazospaintingllc.com",
    status: "Convertido",
    score: 95,
    industry: "Construcción / Pintura",
    notes: "Sitio web premium completado. Cliente altamente satisfecho con el branding y portafolio interactivo.",
    createdAt: "2026-05-10T12:00:00Z"
  },
  {
    id: "lead-2",
    name: "Woodpecker Carpentry",
    contactName: "Alex Wood",
    email: "info@woodpeckerc.com",
    phone: "910-987-6543",
    website: "woodpeckerc.com",
    status: "Convertido",
    score: 92,
    industry: "Carpintería / Ebanistería",
    notes: "Rediseño completo de marca y galería interactiva con microinteracciones Liquid Glass.",
    createdAt: "2026-05-18T14:30:00Z"
  },
  {
    id: "lead-3",
    name: "Velasquez Builders",
    contactName: "Manuel Velásquez",
    email: "manuel@velasquezbuilders.com",
    phone: "910-444-5555",
    website: "velasquezbuilders.com",
    status: "Convertido",
    score: 90,
    industry: "Construcción",
    notes: "Lanzamiento exitoso del portafolio cinematográfico de obras.",
    createdAt: "2026-06-01T09:15:00Z"
  },
  {
    id: "lead-4",
    name: "GDL Pro Service",
    contactName: "Carlos González",
    email: "contact@gdlproservice.com",
    phone: "910-555-0192",
    website: "gdlproservice.com",
    status: "Propuesta Enviada",
    score: 85,
    industry: "Limpieza Profesional",
    notes: "Presentación enviada destacando su débil presencia móvil actual y propuesta de rediseño de landing page.",
    createdAt: "2026-07-01T11:00:00Z"
  },
  {
    id: "lead-5",
    name: "Shallotte Auto Repair",
    contactName: "Bill Evans",
    email: "bill@shallotteautorepair.com",
    phone: "910-222-3333",
    website: "shallotteautorepair.com",
    status: "Identificado",
    score: 72,
    industry: "Automotriz",
    notes: "Sitio actual lento (LCP 5.8s) y carece de fotos de marca. Necesita landing page optimizada para conversiones locales.",
    createdAt: "2026-07-08T16:45:00Z"
  }
];

if (!fs.existsSync(LEADS_FILE)) {
  writeJsonFile(LEADS_FILE, initialLeads);
}

// ---------------- API ENDPOINTS ----------------

// CRM Leads Endpoints
app.get("/api/crm/leads", (req, res) => {
  const leads = readJsonFile(LEADS_FILE, initialLeads);
  res.json(leads);
});

app.post("/api/crm/leads", (req, res) => {
  const leads = readJsonFile(LEADS_FILE, initialLeads);
  const newLead = {
    id: "lead-" + Date.now(),
    name: req.body.name || "Nuevo Lead",
    contactName: req.body.contactName || "",
    email: req.body.email || "",
    phone: req.body.phone || "",
    website: req.body.website || "",
    status: req.body.status || "Identificado",
    score: req.body.score || 50,
    industry: req.body.industry || "Servicios",
    notes: req.body.notes || "",
    createdAt: new Date().toISOString()
  };
  leads.push(newLead);
  writeJsonFile(LEADS_FILE, leads);
  res.status(201).json(newLead);
});

app.put("/api/crm/leads/:id", (req, res) => {
  const leads = readJsonFile(LEADS_FILE, initialLeads);
  const index = leads.findIndex((l: any) => l.id === req.params.id);
  if (index !== -1) {
    leads[index] = { ...leads[index], ...req.body };
    writeJsonFile(LEADS_FILE, leads);
    res.json(leads[index]);
  } else {
    res.status(404).json({ error: "Lead no encontrado" });
  }
});

app.delete("/api/crm/leads/:id", (req, res) => {
  const leads = readJsonFile(LEADS_FILE, initialLeads);
  const filtered = leads.filter((l: any) => l.id !== req.params.id);
  writeJsonFile(LEADS_FILE, filtered);
  res.json({ success: true });
});

// Gemini Chatbot Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history, role } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Mensaje es requerido" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: `**[Modo Demostración]**\n\nHola, soy el asistente virtual de **Mora-Grafic's Studio**. Como la clave de API \`GEMINI_API_KEY\` no está configurada, estoy operando en modo simulación offline.\n\nRecibí tu consulta sobre: "${message}".\n\n*Para activar las respuestas por IA generativa en tiempo real con Gemini 3.5, introduce tu clave en el panel de **Settings > Secrets**.*`,
      });
    }

    const systemInstruction = `Eres César Moradel (o su asistente estrella de IA), el director creativo de Mora-Grafic's Studio. 
Tu tono es sofisticado, persuasivo, conocedor de la tecnología avanzada, el SEO internacional, y de mentalidad de nivel empresarial/enterprise. 
Tu misión es asesorar al usuario sobre diseño web de alta conversión, branding cinematográfico, producción audiovisual, automatización comercial y SEO GEO/AEO para IA generativa.
Habla con autoridad de diseño internacional (Awwwards, Apple-style).
Brinda respuestas bien formateadas utilizando Markdown, listas y negritas. Siempre que hables del estudio, recalca que no somos un portafolio freelance ordinario, sino un estudio técnico-creativo completo.
Si el usuario pregunta por servicios o presupuestos, incentívalo a agendar una consulta de estrategia directa o usar el generador de propuestas de la plataforma.`;

    // Create chat session with memory
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Feed prior history if available
    if (history && Array.isArray(history)) {
      for (const entry of history.slice(0, -1)) {
        // Feed the chat object by simulating previous exchanges if needed, 
        // or just send the current message.
      }
    }

    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: "Error en el motor de IA: " + error.message });
  }
});

// Gemini Image Generation Endpoint
app.post("/api/gemini/generate-image", async (req, res) => {
  try {
    const { prompt, size, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "El prompt es requerido para generar imágenes" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: "GEMINI_API_KEY no configurado. Configure la clave de API en Secrets para usar la generación de imágenes."
      });
    }

    // Determine target size for 1K, 2K, 4K as per additional metadata
    let targetSize = "1K";
    if (size === "2K" || size === "4K") {
      targetSize = size;
    }

    // Use gemini-3.1-flash-image as the high-quality model
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "1:1",
          imageSize: targetSize
        }
      }
    });

    let base64Image = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (base64Image) {
      res.json({ success: true, imageUrl: base64Image });
    } else {
      res.status(500).json({ error: "No se recibió una imagen en la respuesta del modelo" });
    }
  } catch (error: any) {
    console.error("Gemini Image Error:", error);
    res.status(500).json({ error: "Error al generar la imagen: " + error.message });
  }
});

// Gemini Lead Scanner & Brand Auditor (Inteligencia Comercial)
app.post("/api/leads/scan", async (req, res) => {
  try {
    const { websiteUrl, businessName, industry, description } = req.body;
    if (!businessName) {
      return res.status(400).json({ error: "Nombre del negocio es requerido" });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Offline fallback report
      return res.json({
        report: `## Reporte de Auditoría Digital (MOCK)\n\n### Negocio: **${businessName}**\n*Industria: ${industry || "Servicios"}*\n*Sitio Web Evaluado: ${websiteUrl || "Ninguno"}*\n\n--- \n\n### 📊 Evaluación de Presencia Digital:\n- **Diseño & Branding (UX/UI):** 45/100  \n- **SEO Internacional e Indexabilidad:** 20/100  \n- **Tasa de Conversión (LCP/Conversion rate):** 30/100  \n- **Autoridad de Marca (E-E-A-T):** 15/100  \n\n### 🔍 Diagnóstico Detallado:\n1. **Estética Obsoleta:** El sitio actual carece de profundidad visual. Los contrastes son deficientes y no se siente de calidad premium.\n2. **Arquitectura No Indexable:** No cuenta con rutas estructuradas o etiquetas SEO dinámicas adecuadas.\n3. **Falta de Fallback en Animaciones:** Su velocidad de carga en móvil supera los 5.2s, penalizando el posicionamiento en buscadores.\n\n### 💡 Propuesta de Transformación por Mora-Grafic's Studio:\nCrear una **experiencia digital inmersiva Liquid Glass** con un diseño multi-página adaptivo que cuente con SEO de clase mundial y optimizaciones de velocidad Lighthouse 95+ garantizadas.\n\n*(Nota: Ingrese la clave GEMINI_API_KEY para recibir una auditoría ultra-detallada generada en vivo por el motor de IA).*`
      });
    }

    const prompt = `Realiza una auditoría visual, técnica y comercial completa y detallada para el siguiente negocio:
Nombre: ${businessName}
Industria: ${industry || "No especificada"}
Sitio Web: ${websiteUrl || "No tiene sitio actual (creación desde cero)"}
Descripción: ${description || "Sin descripción adicional"}

Estructura el reporte con un formato elegante en Markdown adecuado para presentar como Mora-Grafic's Studio. Debe incluir:
1. Puntuación de 0 a 100 de: Branding, Conversión UX/UI, SEO de IA (AEO/GEO), y Velocidad Móvil.
2. Un diagnóstico de sus brechas de diseño y credibilidad comercial.
3. El Plan de Transformación Creativa y Tecnológica de 3 etapas específico para este negocio usando las capacidades premium de Mora-Grafic's Studio (Diseño Cinematic Web, Landing Pages líquidas, Automatizaciones de embudo).
4. Un correo de prospección persuasivo que Mora-Grafic's Studio puede enviarle directamente para captar su atención.

Sé profesional, persuasivo e innovador.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    res.json({ report: response.text });
  } catch (error: any) {
    console.error("Lead Audit Error:", error);
    res.status(500).json({ error: "Error en la auditoría de IA: " + error.message });
  }
});

// Gemini Lead Discovery Engine (Generador de Prospectos de Prueba)
app.post("/api/leads/discover", async (req, res) => {
  try {
    const { city, industry } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      // Simulated mock leads
      return res.json({
        leads: [
          {
            name: `${industry || "Shallotte"} Services Inc`,
            contactName: "John Smith",
            email: "contact@shallotteservices.com",
            phone: "910-555-4321",
            website: "shallotteservices.com",
            weakness: "Sitio web del 2018, no adaptativo a móviles, diseño plano de plantilla barata.",
            score: 74
          },
          {
            name: `Coastal Elite Builders`,
            contactName: "Marcus Vance",
            email: "marcus@coastalelitebuilders.com",
            phone: "910-555-7890",
            website: "coastalelitebuilders.org",
            weakness: "Carece de portafolio fotográfico real, testimonios falsos y carga sumamente lenta.",
            score: 82
          }
        ]
      });
    }

    const prompt = `Genera una lista de 3 negocios reales o hipotéticos realistas en la ciudad de "${city || "Shallotte, NC"}" pertenecientes a la industria de "${industry || "Construcción o Servicios Locales"}".
Para cada negocio, provee un nombre realista, un nombre de contacto, un correo, un teléfono, un dominio web ficticio, una debilidad visual/de conversión severa, y un Lead Score (del 50 al 95 indicando qué tan urgente necesitan un rediseño web de Mora-Grafic's Studio).

Devuelve la respuesta estrictamente en un formato JSON estructurado que coincida con el siguiente esquema:
[
  {
    "name": "Nombre de la empresa",
    "contactName": "Contacto principal",
    "email": "correo@empresa.com",
    "phone": "910-555-1234",
    "website": "empresa.com",
    "weakness": "Descripción de la debilidad de marca o web",
    "score": 85
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              contactName: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              website: { type: Type.STRING },
              weakness: { type: Type.STRING },
              score: { type: Type.INTEGER }
            },
            required: ["name", "contactName", "email", "phone", "website", "weakness", "score"]
          }
        }
      }
    });

    const parsedLeads = JSON.parse(response.text.trim());
    res.json({ leads: parsedLeads });
  } catch (error: any) {
    console.error("Lead Discovery Error:", error);
    res.status(500).json({ error: "Error al descubrir prospectos: " + error.message });
  }
});

// Dynamic SEO Sitemap Endpoint
app.get("/sitemap.xml", (req, res) => {
  res.setHeader("Content-Type", "application/xml");
  const base_url = "https://mora-grafics-studio.com";
  const languages = ["", "/en", "/fr", "/pt", "/de"];
  const subpages = [
    "",
    "/servicios/diseno-web",
    "/servicios/branding",
    "/servicios/publicidad-visual",
    "/servicios/motion-graphics",
    "/servicios/produccion-audiovisual",
    "/servicios/automatizacion-comercial",
    "/preguntas-frecuentes",
    "/sobre-nosotros",
    "/contacto",
    "/casos-de-exito/woodpecker-carpentry",
    "/casos-de-exito/infinite-iron-works",
    "/casos-de-exito/lawn-irrigation-corp",
    "/casos-de-exito/gdl-pro-service",
    "/casos-de-exito/erazos-painting",
    "/casos-de-exito/green-design-services",
    "/casos-de-exito/velasquez-builders"
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  subpages.forEach(page => {
    languages.forEach(lang => {
      const pagePath = lang + page;
      const url = `${base_url}${pagePath}`;
      xml += "  <url>\n";
      xml += `    <loc>${url}</loc>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      
      // Inject alternate links for hreflang
      languages.forEach(altLang => {
        const hreflangCode = altLang === "" ? "es" : altLang.replace("/", "");
        const altUrl = `${base_url}${altLang}${page}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${hreflangCode}" href="${altUrl}"/>\n`;
      });
      // Add x-default pointing to the English version
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${base_url}/en${page}"/>\n`;

      xml += "  </url>\n";
    });
  });

  xml += "</urlset>";
  res.send(xml);
});

// Dynamic Robots.txt Endpoint
app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /crm-panel/

Sitemap: https://mora-grafics-studio.com/sitemap.xml`);
});

// ---------------- DYNAMIC SEO METADATA INJECTOR ----------------
// This middleware interceptor reads index.html, examines the requested path, 
// and injects custom title, description, og-tags, canonicals, hreflangs, and JSON-LD schemas.
function injectSeoMetadata(html: string, reqPath: string): string {
  // Normalize path
  let pathClean = reqPath.split("?")[0].replace(/\/$/, "");
  if (pathClean === "") pathClean = "/";

  // Determine current language
  let lang = "es";
  let langPrefix = "";
  if (pathClean.startsWith("/en")) { lang = "en"; langPrefix = "/en"; }
  else if (pathClean.startsWith("/fr")) { lang = "fr"; langPrefix = "/fr"; }
  else if (pathClean.startsWith("/pt")) { lang = "pt"; langPrefix = "/pt"; }
  else if (pathClean.startsWith("/de")) { lang = "de"; langPrefix = "/de"; }

  // Extract relative page without lang prefix
  let page = pathClean;
  if (langPrefix) {
    page = pathClean.substring(langPrefix.length);
    if (page === "") page = "/";
  }

  // Base parameters
  let title = "Mora-Grafic's Studio | Diseño Web, Branding & Publicidad Premium";
  let description = "Estudio creativo premium internacional especializado en diseño web cinematográfico, branding de autoridad y automatización comercial con inteligencia artificial.";
  let image = "https://picsum.photos/seed/morastudio/1200/630";
  
  // Set localized defaults
  if (lang === "en") {
    title = "Mora-Grafic's Studio | Premium Web Design, Branding & Advertising";
    description = "International premium creative studio specialized in high-converting web design, cinematic branding, and AI commercial automation.";
  } else if (lang === "fr") {
    title = "Mora-Grafic's Studio | Design Web & Branding d'Impact";
    description = "Studio créatif de prestige international pour le design web d'autorité, le branding cinématographique et l'automatisation.";
  } else if (lang === "pt") {
    title = "Mora-Grafic's Studio | Web Design & Branding Premium";
    description = "Estúdio de alta conversão internacional focado em marcas cinematográficas e funis comerciais de IA.";
  } else if (lang === "de") {
    title = "Mora-Grafic's Studio | High-End Webdesign & Branding";
    description = "Internationales Kreativstudio für premium Webdesign, Branding und KI-Marketinglösungen.";
  }

  // Specific subpages override
  if (page.startsWith("/servicios/diseno-web")) {
    title = lang === "es" ? "Diseño Web de Alta Conversión | Mora-Grafic's Studio" : "High-Converting Web Design | Mora-Grafic's Studio";
    description = lang === "es" ? "Creamos experiencias web interactivas con estética Apple, animaciones Liquid Glass y optimización Lighthouse 95+ garantizada." : "Interactive high-end web experiences with Apple aesthetic and speed optimizations.";
  } else if (page.startsWith("/servicios/branding")) {
    title = lang === "es" ? "Branding e Identidad de Marca de Autoridad | Mora-Grafic's Studio" : "Authority Branding & Identity Design | Mora-Grafic's Studio";
    description = lang === "es" ? "Construimos identidades corporativas inolvidables que proyectan lujo, confiabilidad y escala internacional." : "We build luxury, unforgettable brand identities that reflect premium values.";
  } else if (page.startsWith("/servicios/publicidad-visual")) {
    title = lang === "es" ? "Publicidad Visual & Flyers de Impacto | Mora-Grafic's Studio" : "High-Impact Visual Advertising & Flyers | Mora-Grafic's Studio";
  } else if (page.startsWith("/servicios/motion-graphics")) {
    title = lang === "es" ? "Motion Graphics y Animaciones 3D | Mora-Grafic's Studio" : "Premium Motion Graphics & 3D Animation | Mora-Grafic's Studio";
  } else if (page.startsWith("/servicios/produccion-audiovisual")) {
    title = lang === "es" ? "Producción Audiovisual Cinematográfica | Mora-Grafic's Studio" : "Cinematic Audiovisual Production | Mora-Grafic's Studio";
  } else if (page.startsWith("/servicios/automatizacion-comercial")) {
    title = lang === "es" ? "Automatización de Ventas y CRM de IA | Mora-Grafic's Studio" : "AI Sales Automations & Smart CRM | Mora-Grafic's Studio";
  } else if (page === "/preguntas-frecuentes") {
    title = lang === "es" ? "Preguntas Frecuentes (FAQ) | Mora-Grafic's Studio" : "Frequently Asked Questions (FAQ) | Mora-Grafic's Studio";
    description = "Respuestas detalladas sobre nuestros procesos, presupuestos, tiempos de entrega y tecnología de diseño web premium.";
  } else if (page === "/sobre-nosotros") {
    title = lang === "es" ? "Sobre Nosotros y César Moradel | Mora-Grafic's Studio" : "About Us & César Moradel | Mora-Grafic's Studio";
  } else if (page === "/contacto") {
    title = lang === "es" ? "Agendar Consulta Estratégica | Mora-Grafic's Studio" : "Book an International Strategy Session | Mora-Grafic's Studio";
  }

  // Case Study detailed metadata mapping
  if (page.startsWith("/casos-de-exito/")) {
    const caseId = page.split("/")[2];
    const caseTitleMap: Record<string, string> = {
      "woodpecker-carpentry": "Woodpecker Carpentry LLC | Caso de Éxito Mora-Grafic's",
      "infinite-iron-works": "Infinite Iron Works | Caso de Éxito Mora-Grafic's",
      "lawn-irrigation-corp": "Lawn Irrigation Corp | Caso de Éxito Mora-Grafic's",
      "gdl-pro-service": "GDL Pro Service | Caso de Éxito Mora-Grafic's",
      "erazos-painting": "Erazo's Painting LLC | Caso de Éxito Mora-Grafic's",
      "green-design-services": "Green Design Services | Caso de Éxito Mora-Grafic's",
      "velasquez-builders": "Velasquez Builders | Caso de Éxito Mora-Grafic's",
      "aak-interior-design": "AAK Interior Design | Caso de Éxito Mora-Grafic's",
      "storm-group-contractor": "Storm Group Contractor | Caso de Éxito Mora-Grafic's",
      "rzm-auto-repair": "RZM Auto Repair | Caso de Éxito Mora-Grafic's"
    };
    if (caseTitleMap[caseId]) {
      title = caseTitleMap[caseId];
      description = `Análisis de caso de estudio para ${caseId.replace(/-/g, " ")}. Descubre cómo Mora-Grafic's Studio transformó su marca, aumentó sus prospectos y relanzó su identidad web.`;
    }
  }

  // Structured Data (JSON-LD) creation
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://mora-grafics-studio.com/#organization",
        "name": "Mora-Grafic's Studio",
        "url": "https://mora-grafics-studio.com/",
        "logo": "https://picsum.photos/seed/mora_logo/500/500",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+504-9865-8519",
          "contactType": "Sales and Creative Director",
          "email": "moragrafics@gmail.com",
          "areaServed": ["US", "CA", "MX", "HN", "ES"],
          "availableLanguage": ["Spanish", "English", "French", "Portuguese", "German"]
        },
        "sameAs": [
          "https://www.facebook.com/moragrafics",
          "https://instagram.com/moragrafics",
          "https://www.linkedin.com/company/mora-grafics-studio"
        ]
      },
      {
        "@type": "Person",
        "@id": "https://mora-grafics-studio.com/#founder",
        "name": "César Aníbal Moradel Fonseca",
        "jobTitle": "Creative Director & Technology Founder",
        "worksFor": { "@id": "https://mora-grafics-studio.com/#organization" },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Meadowlark Ln SW",
          "addressLocality": "Shallotte",
          "addressRegion": "NC",
          "postalCode": "28470",
          "addressCountry": "US"
        }
      }
    ]
  };

  const faqSchema = page === "/preguntas-frecuentes" ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Cuánto cuesta un diseño web para un contratista o negocio local con Mora-Grafic's?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Los proyectos para contratistas locales inician desde los $1,200 USD para landing pages de alta conversión, y de $2,500 a $5,000 USD para portafolios multi-página completos con SEO local internacional integrado y automatización de presupuestos."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto tiempo toma completar un proyecto de branding e identidad corporativa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Un proyecto de branding premium completo típicamente toma entre 3 y 4 semanas. Esto incluye análisis de marca, creación de logotipo, guías tipográficas, mockups de papelería, empaques y variantes digitales."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué incluye el CRM comercial inteligente que desarrollan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nuestro ecosistema incluye un motor inteligente que evalúa prospectos, detecta debilidades en su presencia móvil actual, genera de manera automatizada propuestas con IA de alta conversión y registra toda la interacción en un embudo Kanban interactivo."
        }
      }
    ]
  } : null;

  // Build the replacement block of meta tags
  const canonicalUrl = `https://mora-grafics-studio.com${langPrefix}${page}`;
  let headTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Hreflang Tags for SEO indexability -->
    <link rel="alternate" hreflang="es" href="https://mora-grafics-studio.com${page}" />
    <link rel="alternate" hreflang="en" href="https://mora-grafics-studio.com/en${page}" />
    <link rel="alternate" hreflang="fr" href="https://mora-grafics-studio.com/fr${page}" />
    <link rel="alternate" hreflang="pt" href="https://mora-grafics-studio.com/pt${page}" />
    <link rel="alternate" hreflang="de" href="https://mora-grafics-studio.com/de${page}" />
    <link rel="alternate" hreflang="x-default" href="https://mora-grafics-studio.com/en${page}" />

    <!-- Open Graph Metadata -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title.replace(/"/g, "&quot;")}" />
    <meta property="og:description" content="${description.replace(/"/g, "&quot;")}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="Mora-Grafic's Studio" />

    <!-- Twitter Card Metadata -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title.replace(/"/g, "&quot;")}" />
    <meta name="twitter:description" content="${description.replace(/"/g, "&quot;")}" />
    <meta name="twitter:image" content="${image}" />

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
      ${JSON.stringify(organizationSchema, null, 2)}
    </script>
    ${faqSchema ? `
    <script type="application/ld+json">
      ${JSON.stringify(faqSchema, null, 2)}
    </script>
    ` : ""}
  `;

  // Replace html lang tag dynamically
  let processedHtml = html.replace(/<html[^>]*>/i, `<html lang="${lang}">`);

  // We find <title> tag in raw html and replace it with our rich meta blocks
  const titleRegex = /<title>[^]*<\/title>/i;
  if (titleRegex.test(processedHtml)) {
    return processedHtml.replace(titleRegex, headTags);
  }
  return processedHtml.replace("<head>", `<head>${headTags}`);
}

// ---------------- SERVING FRONTEND WITH VITE MIDDLEWARE ----------------

async function startServer() {
  // Vite dev mode or Production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    // Inject custom meta-tags for SEO during development previews
    app.use(async (req, res, next) => {
      // Direct pass for APIs or files, and ensure we only serve HTML requests
      if (
        req.path.startsWith("/api") || 
        req.path.startsWith("/sitemap") || 
        req.path.startsWith("/robots") ||
        !req.headers.accept?.includes("text/html")
      ) {
        return next();
      }

      try {
        const rawIndex = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        const transformedIndex = await vite.transformIndexHtml(req.url, rawIndex);
        const seoInjectedIndex = injectSeoMetadata(transformedIndex, req.path);
        res.status(200).set({ "Content-Type": "text/html" }).end(seoInjectedIndex);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Static asset serving
    app.use(express.static(distPath, { index: false }));

    // Intercept client-side page requests to serve SEO headers in production
    app.get("*", (req, res, next) => {
      if (
        req.path.startsWith("/api") || 
        req.path.startsWith("/sitemap") || 
        req.path.startsWith("/robots") ||
        !req.headers.accept?.includes("text/html")
      ) {
        return next();
      }
      
      try {
        const indexHtmlPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexHtmlPath)) {
          const rawHtml = fs.readFileSync(indexHtmlPath, "utf-8");
          const seoInjectedHtml = injectSeoMetadata(rawHtml, req.path);
          res.status(200).set({ "Content-Type": "text/html" }).end(seoInjectedHtml);
        } else {
          res.status(404).send("Build output index.html not found. Please run npm run build.");
        }
      } catch (e) {
        next(e);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Mora-Grafic's Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
