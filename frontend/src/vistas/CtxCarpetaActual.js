import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const CtxCarpetaActual = createContext();

// Proveedor del contexto
const ProveedorCtxCarpetaActual = ({ children }) => {
    const [carpetaActual, cambiarEstadoCarpetaActual] = useState(0); // Sin proyecto configurado

    const asignarCarpetaActual = (idCarpeta) => cambiarEstadoCarpetaActual(idCarpeta);

    return (
        <CtxCarpetaActual.Provider value={{ carpetaActual, asignarCarpetaActual }}>
            {children}
        </CtxCarpetaActual.Provider>
    );
};

// Hook personalizado para usar el contexto de proyecto actual
const UsarCtxCarpetaActual = () => {
    return useContext(CtxCarpetaActual);
};

export default UsarCtxCarpetaActual;

export { ProveedorCtxCarpetaActual, CtxCarpetaActual };
