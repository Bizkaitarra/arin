import React from 'react';
import {
    IonText,
} from "@ionic/react";
import MetroDisplay from "../../components/MetroBilbao/MetroDisplay";
import {useTranslation} from "react-i18next";
import MetroBilbaoAddTripButton from "../../components/MetroBilbao/MetroBilbaoAddVisorButton";

const STORAGE_KEY = 'metro_bilbao_selected_stops';

const MetroBilbaoDisplays: React.FC = () => {
    const {t} = useTranslation();

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
        <div className="transport-section" style={{ marginBottom: "24px" }}>
            {stops.length > 0 ? (
                <div>
                    <MetroDisplay/>
                </div>
            ) : (
                <div style={{textAlign: 'center', marginTop: '1rem'}}>
                    <IonText>
                        <h2>{t('No tienes visores configurados para Metro Bilbao')}</h2>
                    </IonText>
                    <MetroBilbaoAddTripButton/>
                </div>
            )}
        </div>
    );
};

export default MetroBilbaoDisplays;
