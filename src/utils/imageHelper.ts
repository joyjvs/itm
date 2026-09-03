// src/utils/imageHelper.js

export const getValidImageUrl = (url: string) => {
  // Si no hay URL, devuelve un placeholder
  if (!url) return "/placeholder-product.png";

  let cleanUrl = url;

  // Reemplaza URLs de localhost por la IP real
  cleanUrl = cleanUrl.replace(
    "http://localhost:3000",
    "https://92.205.106.246",
  );

  // Elimina la ruta de preview de Plesk si existe
  cleanUrl = cleanUrl.replace(
    /\/plesk-site-preview\/[^/]+\/https?:\/\/[^/]+/g,
    "",
  );

  // Fuerza HTTPS para evitar "Mixed Content"
  cleanUrl = cleanUrl.replace("http://", "https://");

  return cleanUrl;
};;
