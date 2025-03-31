
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setFavicon } from './utils/createFavicon.ts'
import OgImageTemplate from './components/OgImageTemplate.tsx'

// Set favicon
setFavicon();

// Export OgImageTemplate for thumbnail generation
export { OgImageTemplate };

createRoot(document.getElementById("root")!).render(<App />);
