import React from 'react';
import Page from "../Page";
import { useTranslation } from "react-i18next";
import { homeOutline, settingsOutline } from "ionicons/icons";
import { useConfiguration } from '../../context/ConfigurationContext';
import { getSelectedVisores } from "../../services/Atajos";
import { IonText, IonButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';

import BizkaibusDisplays from "../Bizkaibus/BizkaibusDisplays";
import MetroBilbaoDisplays from "../MetroBilbao/MetroBilbaoDisplays";
import KBusDisplays from "../KBus/KBusDisplays";
import RenfeDisplays from "../Renfe/RenfeDisplays";
import EuskotrenDisplays from "../Euskotren/EuskotrenDisplays";
import MetroIncidents from "../../components/MetroBilbao/MetroIncidents";

const Home: React.FC = () => {
    const { t } = useTranslation();
    const { settings } = useConfiguration();
    const history = useHistory();
    const selectedVisores = getSelectedVisores(settings);

    const renderDisplay = (service: string) => {
        let Component;
        let title;
        let managePath;
        
        switch (service) {
            case 'bizkaibus': 
                Component = BizkaibusDisplays; 
                title = 'Bizkaibus';
                managePath = '/bizkaibus-my-displays';
                break;
            case 'metro': 
                Component = MetroBilbaoDisplays; 
                title = 'Metro Bilbao';
                managePath = '/metro-bilbao-my-displays';
                break;
            case 'kbus': 
                Component = KBusDisplays; 
                title = 'KBus';
                managePath = '/k-bus-my-displays';
                break;
            case 'renfe': 
                Component = RenfeDisplays; 
                title = 'Renfe Cercanías';
                managePath = '/renfe-my-displays';
                break;
            case 'euskotren': 
                Component = EuskotrenDisplays; 
                title = 'Euskotren';
                managePath = '/euskotren-my-displays';
                break;
            default: return null;
        }

        return (
            <div key={service} className="home-transport-block" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', marginBottom: '8px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{t(title)}</h2>
                    <IonButton fill="clear" size="small" onClick={() => history.push(managePath)}>
                        <IonIcon icon={settingsOutline} slot="start" />
                        {t('Gestionar')}
                    </IonButton>
                </div>
                <Component />
            </div>
        );
    };

    return (
        <Page title={t("Inicio")} icon={homeOutline}>
            {selectedVisores.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '3rem', padding: '0 20px' }}>
                    <IonText color="medium">
                        <h2>{t('Bienvenido a Arin')}</h2>
                        <p>{t('No tienes ningún servicio configurado todavía. Ve a Ajustes para activar los servicios de transporte que utilices.')}</p>
                    </IonText>
                    <IonButton expand="block" onClick={() => history.push('/configuration')} style={{ marginTop: '20px' }}>
                        {t('Ir a Ajustes')}
                    </IonButton>
                </div>
            ) : (
                <div style={{ paddingBottom: '20px', paddingTop: '10px' }}>
                    {/* Incidencias de Metro siempre arriba si Metro está activo */}
                    {selectedVisores.includes('metro') && <MetroIncidents />}
                    
                    {/* Renderizamos los visores en el orden definido por el usuario */}
                    {selectedVisores.map(service => renderDisplay(service))}
                </div>
            )}
        </Page>
    );
};

export default Home;
