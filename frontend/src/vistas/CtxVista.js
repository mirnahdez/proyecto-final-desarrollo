import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const NavigationContext = createContext();

// Proveedor del contexto
const NavigationProvider = ({ children }) => {
    const [currentView, setCurrentView] = useState('menuPrincipal'); // Vista inicial

    const navigateTo = (view) => setCurrentView(view);

    return (
        <NavigationContext.Provider value={{ currentView, navigateTo }}>
            {children}
        </NavigationContext.Provider>
    );
};

// Hook personalizado para usar el contexto de navegación
const useNavigation = () => {
    return useContext(NavigationContext);
};

export default useNavigation;

export { NavigationProvider, NavigationContext };
