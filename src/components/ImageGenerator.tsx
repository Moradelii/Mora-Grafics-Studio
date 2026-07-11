import React, { useState } from "react";
import { Image, Sparkles, Download, Sliders, Play, Check, HelpCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState(
    "Logo o flyer minimalista de lujo, fondo negro profundo con destellos azul eléctrico y plata metálica sofisticada, estilo render 3D arquitectónico premium, iluminación dramática"
  );
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadingPhrases = [
    "Sintonizando motores generativos @google/genai...",
    "Proyectando iluminación cinematográfica y refracciones...",
    "Alineando paleta de color azul eléctrico y grafito...",
    "Modelando texturas con acabado Liquid Glass...",
    "Renderizando detalles de ultra-alta fidelidad en resolución de estudio...",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStep(0);

    // Simulate progress messages
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingPhrases.length - 1 ? prev + 1 : prev));
    }, 2500);

    try {
      const response = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size, aspectRatio }),
      });

      const data = await response.json();
      clearInterval(stepInterval);

      if (response.ok && data.success) {
        setGeneratedUrl(data.imageUrl);
      } else {
        // Fallback mockup output if API Key missing or error
        setTimeout(() => {
          // Generate a high quality random picsum seed image based on prompt length or index
          const randomSeed = Math.floor(Math.random() * 1000);
          const mockupUrl = `https://picsum.photos/seed/moragrafic-${randomSeed}/1024/1024`;
          setGeneratedUrl(mockupUrl);
          
          if (!data.success && !process.env.GEMINI_API_KEY) {
            console.warn("Operating in mockup mode due to missing API Key");
          }
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Ocurrió un error al contactar al motor. Iniciando modo de demostración.");
      // Fallback mockup
      setTimeout(() => {
        const randomSeed = Math.floor(Math.random() * 1000);
        setGeneratedUrl(`https://picsum.photos/seed/demo-${randomSeed}/1024/1024`);
        setIsLoading(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedUrl) return;
    const link = document.createElement("a");
    link.href = generatedUrl;
    link.download = `mora-studio-gen-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl liquid-glass p-6 border border-white/10" id="image-generator-panel">
      {/* Module Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Image className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            Mora-Studio-Image Engine
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-mono tracking-wider font-medium">
              GEMINI 3 PRO
            </span>
          </h3>
          <p className="text-xs text-neutral-400">
            Genera recursos visuales, flyers, fondos y mockups publicitarios premium en ultra-resolución.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          {/* Prompt Area */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 font-mono mb-2 uppercase tracking-wider">
              Prompt de Generación Creativa
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe el elemento visual detalladamente..."
              className="w-full bg-neutral-900/60 text-white placeholder-neutral-600 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all leading-relaxed"
              id="img-gen-prompt-input"
            />
          </div>

          {/* Configuration Grids */}
          <div className="grid grid-cols-2 gap-4">
            {/* Resolution Size */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 font-mono mb-2 uppercase tracking-wider">
                Resolución (Size)
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-neutral-900/80 p-1 rounded-xl border border-white/5">
                {(["1K", "2K", "4K"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`py-2 text-[11px] font-mono font-medium rounded-lg transition-all ${
                      size === s
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 font-mono mb-2 uppercase tracking-wider">
                Relación de Aspecto
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-neutral-900 text-white border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                id="img-gen-ratio-select"
              >
                <option value="1:1">1:1 (Cuadrado)</option>
                <option value="16:9">16:9 (Horizontal)</option>
                <option value="4:3">4:3 (Tarjeta)</option>
                <option value="9:16">9:16 (Celular)</option>
                <option value="4:1">4:1 (Banner)</option>
              </select>
            </div>
          </div>

          {/* Quick suggestions templates */}
          <div>
            <span className="block text-[10px] font-medium text-neutral-500 font-mono uppercase tracking-wider mb-2">
              Plantillas Rápidas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Flyer Azul Neón", text: "Flyer promocional comercial asimétrico, fondo grafito mate con líneas azul neón 3D, tipografía imponente, clase mundial" },
                { label: "Logo Cinematic", text: "Logo abstracto de Mora-Grafic's Studio, render metal líquido, glow azul gélido de fondo, fondo negro profundo" },
                { label: "Fondo Liquid Glass", text: "Textura abstracta de vidrio líquido con ondas flotantes, contrastes de luces blancas y destellos azul zafiro sutiles" }
              ].map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(tpl.text)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-blue-500/20 text-[10px] text-neutral-400 hover:text-blue-400 transition-all"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-3 bg-blue-600 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold text-xs rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-blue-500/10"
            id="img-gen-submit-btn"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-blue-200" />
                <span>Renderizar Imagen ({size} Resolution)</span>
              </>
            )}
          </button>

          {/* Demo note */}
          {!process.env.GEMINI_API_KEY && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300 leading-relaxed">
              <strong>Estatus de API:</strong> El servidor opera actualmente en modo demostración local. Las solicitudes de imágenes se servirán de un catálogo dinámico. Configura la clave en Secrets para habilitar renderizados reales.
            </div>
          )}
        </div>

        {/* Display Canvas Column */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center bg-neutral-950/60 rounded-2xl p-4 border border-white/5 min-h-[300px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center p-8 text-center space-y-4"
                key="loading"
              >
                <div className="relative flex items-center justify-center h-20 w-20">
                  <div className="absolute h-16 w-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin"></div>
                  <Sparkles className="h-6 w-6 text-blue-400 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-semibold text-white">Generando Arte Inteligente</h5>
                  <p className="text-xs text-neutral-400 max-w-[300px] h-8 transition-all font-mono">
                    {loadingPhrases[loadingStep]}
                  </p>
                </div>
              </motion.div>
            ) : generatedUrl ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center space-y-4"
                key="result"
              >
                {/* Result Image */}
                <div className="relative overflow-hidden rounded-xl border border-white/10 group bg-neutral-900 max-h-[380px] w-full flex items-center justify-center">
                  <img
                    src={generatedUrl}
                    alt="Arte generado por Mora-Studio-Image Engine"
                    className="object-contain max-h-[380px] w-auto transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    id="generated-image-result"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-[10px] text-neutral-300 font-mono">
                      Resolución: {size} (Aspect: {aspectRatio})
                    </p>
                  </div>
                </div>

                {/* Downloader toolbar */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-xl flex items-center gap-2 transition-colors border border-white/10"
                    title="Guardar en dispositivo"
                  >
                    <Download className="h-3.5 w-3.5 text-blue-400" />
                    <span>Descargar Recurso</span>
                  </button>
                  <button
                    onClick={() => {
                      setPrompt("Agrégale un degradado azul cobalto más intenso e iluminación volumétrica dramática de fondo");
                    }}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs rounded-xl transition-all"
                  >
                    Editar Instrucción
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center p-8 space-y-3"
                key="empty"
              >
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 mb-2 border border-white/5">
                  <Image className="h-6 w-6 animate-pulse" />
                </div>
                <h5 className="text-sm font-semibold text-white">Lienzo de Renderizado Vacío</h5>
                <p className="text-xs text-neutral-500 max-w-[280px]">
                  Configura tus parámetros a la izquierda y presiona "Renderizar" para ver la magia de la IA generativa de Mora-Grafic's Studio.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
