import { useIonToast } from '@ionic/react';
import React from 'react';
import arinLogo from '../../resources/icon.png';

// Definimos una interfaz para las opciones del toast para mayor claridad
interface ArinToastOptions {
    message: string;
    color: string;
    duration?: number;
    position?: 'top' | 'bottom' | 'middle';
}

// Hook personalizado para mostrar el toast con el logo de Arin
export const useCustomToast = () => {
    const [present] = useIonToast();

    const presentArinToast = (options: ArinToastOptions) => {
        present({
            ...options,
            message: options.message,
        });
    };

    return { presentArinToast };
};
