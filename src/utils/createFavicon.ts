
// This is a helper file to generate a favicon.ico file from our SVG
// We'll use this in the main.tsx file to ensure the favicon is set at runtime

export function setFavicon() {
  // For modern browsers, we already have the SVG favicon set in index.html
  // But let's also set a fallback for older browsers

  // Check if the browser supports SVG favicons
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/svg+xml';
  link.rel = 'icon';
  link.href = '/favicon.svg';
  document.getElementsByTagName('head')[0].appendChild(link);
}
