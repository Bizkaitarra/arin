import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadSettings, saveSettings } from '../services/ConfigurationStorage';

// Crear el contexto para la configuración
const ConfigurationContext = createContext<any>(null);

// Definir el tipo de las props del ConfigurationProvider
interface ConfigurationProviderProps {
    children: ReactNode;
}

export const useConfiguration = () => {
    return useContext(ConfigurationContext); // Custom hook para consumir el contexto
};

export const ConfigurationProvider: React.FC<ConfigurationProviderProps> = ({ children }) => {
    const [settings, setSettings] = useState<any>(null); // Inicializa el estado como null o undefined

    // Cargar configuraciones al inicio
    useEffect(() => {
        const fetchSettings = async () => {
            const storedSettings = await loadSettings();
            if (storedSettings) {
                setSettings(storedSettings); // Cargar los ajustes persistidos
            } else {
                // Si no hay configuración almacenada, usa los valores por defecto
                setSettings({
                    language: 'es',
                    visores: 'bizkaibus_metro',
                    verNumeroVagones: true,
                    maxTrenes: 60,
                    verFrecuencia: true,
                    metroDisplayFolding: 'disabled',
                });
            }
        };
        console.log('cargamos los ajustes');
        fetchSettings();
    }, []);

    // Guardar configuraciones cuando cambian
    useEffect(() => {
        if (settings) {
            console.log('Se han modificado los ajustes, guardando...');
            saveSettings(settings);
        }
    }, [settings]);

    const updateSettings = (newSettings: any) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    const deleteSetting = (key: string) => {
        setSettings((prev: any) => {
            if (!prev || !(key in prev)) {
                return prev; // No hacer nada si no existe la clave
            }
            const { [key]: _, ...rest } = prev; // Usamos desestructuración para eliminar la clave
            return rest;
        });
    };


    // Si aún estamos cargando la configuración, no mostramos el provider
    if (settings === null) {
        return null; // O puedes mostrar un "loading..." mientras cargas
    }

    return (
        <ConfigurationContext.Provider value={{ settings, updateSettings, deleteSetting }}>
            {children}
        </ConfigurationContext.Provider>
    );
};
