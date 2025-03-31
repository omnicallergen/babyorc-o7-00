
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setFavicon } from './utils/createFavicon.ts'

// Set favicon
setFavicon();

createRoot(document.getElementById("root")!).render(<App />);
