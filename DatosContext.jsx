import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const DatosContext = createContext();

// Componente proveedor para envolver la aplicación
export const DatosProvider = ({ children }) => {
  const [datos, setDatos] = useState(null);

  return (
    <DatosContext.Provider value={{ datos, setDatos }}>
      {children}
    </DatosContext.Provider>
  );
};

// Función de utilidad para acceder al contexto
export const useDatos = () => {
  return useContext(DatosContext);
};
