import React, {useEffect, useState} from 'react';
import {
    IonAccordion,
    IonAccordionGroup,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonItem,
    IonText,
} from "@ionic/react";
import EuskotrenDisplay from "../../components/Euskotren/EuskotrenDisplay";
import {
    trainOutline,
    warningOutline
} from "ionicons/icons";
import Page from "../Page";
import {useTranslation} from "react-i18next";
import EuskotrenAddTripButton from "../../components/Euskotren/EuskotrenAddVisorButton";

const EUSKOTREN_STORAGE_KEY = 'euskotren_selected_stops';

const EuskotrenDisplays: React.FC = () => {
    const {t} = useTranslation();

    let stops = [];
    const savedStops = localStorage.getItem(EUSKOTREN_STORAGE_KEY);
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
                    <EuskotrenDisplay/>
                </div>
            ) : (
                <div style={{textAlign: 'center', marginTop: '2rem'}}>
                    <IonText>
                        <h2>{t('No tienes visores favoritos configurados')}</h2>
                        <p>
                            {t('Para poder ver tus visores favoritos, debes configurarlos en la página de configuración')}.
                        </p>
                    </IonText>
                    <EuskotrenAddTripButton/>
                </div>
            )}
        </Page>
    );
};

export default EuskotrenDisplays;
