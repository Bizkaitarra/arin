import React from 'react';
import './AppLoader.css';
import { useTranslation } from 'react-i18next';

interface AppLoaderProps {
    serviceName: string;
    reloading: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ serviceName, reloading }) => {
    const { t } = useTranslation();
    return (
        <div className="app-loader-container">
            <img src="/icon_round.png" alt="Arin Logo" className="app-loader-logo" />
            <p className="app-loader-text">
                {reloading ? t('Recargando datos de {{serviceName}}', { serviceName }) : t('Cargando datos de {{serviceName}}', { serviceName })}
            </p>
        </div>
    );
};

export default AppLoader;