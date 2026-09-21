// ==============================================
// Archivo: src/main.jsx
// Qué hace: es el punto de entrada. Busca el <div id="root"> del index.html
// y le pide a React que dibuje ahí el componente <App />.
// ==============================================
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Buscamos el elemento del HTML donde va a vivir la app.
const elementoRaiz = document.getElementById('root');

// Creamos la "raíz" de React y renderizamos App dentro.
const raiz = createRoot(elementoRaiz);
raiz.render(<App />);
