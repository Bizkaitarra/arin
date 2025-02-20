import React from 'react';
import {IonButton, IonIcon, IonText} from "@ionic/react";
import MetroDisplay from "../../components/MetroBilbao/MetroDisplay";
import {settingsOutline, trainOutline} from "ionicons/icons";
import {useHistory} from "react-router-dom";
import Page from "../Page";
import {useTranslation} from "react-i18next";

const STORAGE_KEY = 'metro_bilbao_selected_stops';

const MetroBilbaoViewers: React.FC = () => {
    const {t} = useTranslation();
    const history = useHistory();
    let stops = [];
    const savedStops = localStorage.getItem(STORAGE_KEY);
    if (savedStops) {
        try {
            stops = JSON.parse(savedStops);
        } catch (error) {
            console.error('Error al cargar paradas', error);
        }
    }
    return (
        <Page title={t("Visores")} icon={trainOutline}>
            {stops.length > 0 ? (
                <div>
                    <MetroDisplay/>
                </div>
            ) : (
                <div style={{textAlign: 'center', marginTop: '2rem'}}>
                    <IonText>
                        <h2>{t('No tienes paradas favoritas configuradas')}</h2>
                        <p>
                            {t('Para poder ver tus paradas favoritas, debes configurarlas en la página de configuración')}.
                        </p>
                    </IonText>
                    <IonButton color="secondary" onClick={() => history.push(`/configure-metro-bilbao`)}>
                        <IonIcon icon={settingsOutline}/> {t('Configurar paradas')}
                    </IonButton>
                </div>
            )}
        </Page>
    );
};

export default MetroBilbaoViewers;
