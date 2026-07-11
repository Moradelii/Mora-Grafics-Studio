# Guía Técnica de Edición — Mora-Grafic's Studio

¡Bienvenido! Este documento te explica de forma clara y directa dónde está guardado cada elemento del código de tu sitio web y cómo realizar futuras modificaciones sin alterar el rendimiento impecable ni la dirección de arte premium del proyecto.

---

## 1. Estructura del Código Fuente

El proyecto sigue una arquitectura React limpia, moderna y ultra-rápida. Los archivos principales son:

*   `/src/data.ts`: **El archivo más importante para edición de textos.** Aquí se encuentran todas las traducciones en inglés y español, las tarjetas de servicios, las preguntas frecuentes (FAQs), los testimonios de clientes satisfechos y los listados de imágenes para los portafolios de logotipos, flyers y videos.
*   `/src/App.tsx`: Contiene la maquetación principal de la landing page, el ruteo de idiomas y el formulario de contacto conectado a Formspree.
*   `/src/components/PortfolioShowcase.tsx`: Controla la lógica de filtrado del portafolio. Administra la vista de detalles del Caso de Éxito y renderiza los grids dinámicos (Páginas Web, Logos 4x4, Flyers 3x3 y Videos 2x3).
*   `/src/components/CesarChatbot.tsx`: Contiene el widget flotante del chatbot de inteligencia artificial y su sistema de selección de roles bilingüe.

---

## 2. Cómo Modificar Textos y Traducciones

Para cambiar cualquier texto del sitio (títulos de botones, slogans, descripciones, testimonios, etc.), abre el archivo `/src/data.ts`.

Verás un objeto llamado `translations` estructurado de la siguiente manera:

```typescript
export const translations: Record<string, TranslationSet> = {
  en: {
    heroTitle: "Web Design, Branding & Advertising that Converts",
    heroSub: "We scale businesses with premium immersive interfaces...",
    // ... otros campos en inglés
  },
  es: {
    heroTitle: "Diseño Web, Branding & Publicidad que convierten",
    heroSub: "Transformamos negocios mediante interfaces de impacto inmersivo...",
    // ... otros campos en español
  }
};
```

*   **Para cambiar un texto:** Simplemente edita el valor de la propiedad correspondiente dentro de las secciones `en` (Inglés, principal) o `es` (Español). El sitio web se actualizará automáticamente reflejando el idioma seleccionado por el usuario.

---

## 3. Cómo Agregar o Cambiar Logos, Flyers y Videos

Para que puedas gestionar tu portafolio de manera ordenada, hemos creado arreglos de datos dedicados en `/src/data.ts`:

### A. Para Logotipos (Cuadrícula de 16 elementos — 4x4)
Busca la constante `logosPortfolio`. Cada elemento tiene esta estructura:
```typescript
{ 
  id: "l1", 
  name: "Nombre del Cliente", 
  industry: "Industria", 
  image: "Ruta de la imagen o URL" 
}
```

### B. Para Flyers (Cuadrícula de 9 elementos — 3x3)
Busca la constante `flyersPortfolio`. Cada elemento tiene esta estructura:
```typescript
{ 
  id: "f1", 
  title: "Título del Flyer", 
  client: "Cliente", 
  image: "Ruta de la imagen o URL" 
}
```

### C. Para Videos (Cuadrícula de 6 elementos — 2x3)
Busca la constante `videosPortfolio`. Cada elemento tiene esta estructura:
```typescript
{ 
  id: "v1", 
  title: "Título del Video", 
  duration: "0:30", 
  type: "Categoría/Tipo", 
  image: "Imagen de portada o miniatura" 
}
```

---

## 4. Configuración del Formulario de Contacto (Formspree)

El formulario de contacto de tu sitio web ya está completamente funcional y configurado para enviar correos directos utilizando tu endpoint seguro de Formspree:

*   **Endpoint actual:** `https://formspree.io/f/mojzdvzq`
*   Si en el futuro necesitas cambiar la cuenta de correo que recibe los mensajes, solo debes registrar un nuevo formulario en [Formspree](https://formspree.io/), copiar el nuevo ID de formulario y reemplazar el enlace dentro del método `handleContactSubmit` en el archivo `/src/App.tsx`:

```typescript
const response = await fetch("https://formspree.io/f/TU_NUEVO_ID", {
  method: "POST",
  // ...
});
```

---

## 5. Gestión de Imágenes y Archivos Multimedia

De acuerdo con la guía técnica del proyecto, todas las imágenes estáticas y videos optimizados del estudio se guardan en la carpeta `/images/`:

*   **Logotipo de la empresa:** Guardado en `/images/logo/logo.webp`
*   **Portada del video Hero:** Guardada en `/images/hero-poster.jpg`
*   **Video de fondo del Hero:** Guardado en `/images/video/v-bg.mp4`

Cuando agregues imágenes nuevas para tus portafolios, te recomendamos cargarlas en formato `.webp` de bajo peso para garantizar un tiempo de carga inmediato y mantener una calificación de rendimiento de 95+ en Google Lighthouse.
