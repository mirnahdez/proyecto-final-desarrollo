import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { NavigationProvider } from './vistas/CtxVista.js';
import { ProveedorCtxProyectoActual } from './vistas/CtxProyectoActual.js';
import { ProveedorCtxCarpetaActual } from './vistas/CtxCarpetaActual.js';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ProveedorCtxProyectoActual>
      <ProveedorCtxCarpetaActual>
        <NavigationProvider>
          <App />
        </NavigationProvider>
      </ProveedorCtxCarpetaActual>
    </ProveedorCtxProyectoActual>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
