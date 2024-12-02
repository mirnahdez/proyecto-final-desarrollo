import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const CtxProyectoActual = createContext();

// Proveedor del contexto
const ProveedorCtxProyectoActual = ({ children }) => {
    const [proyectoActual, cambiarEstadoProyectoActual] = useState(0); // Sin proyecto configurado

    const asignarProyectoActual = (idProyecto) => cambiarEstadoProyectoActual(idProyecto);

    return (
        <CtxProyectoActual.Provider value={{ proyectoActual, asignarProyectoActual }}>
            {children}
        </CtxProyectoActual.Provider>
    );
};

// Hook personalizado para usar el contexto de proyecto actual
const UsarCtxProyectoActual = () => {
    return useContext(CtxProyectoActual);
};

export default UsarCtxProyectoActual;

export { ProveedorCtxProyectoActual, CtxProyectoActual };
