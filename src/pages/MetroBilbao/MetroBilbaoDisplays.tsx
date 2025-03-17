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
    IonText
} from "@ionic/react";
import MetroDisplay from "../../components/MetroBilbao/MetroDisplay";
import {trainOutline, warningOutline} from "ionicons/icons";
import {useHistory} from "react-router-dom";
import Page from "../Page";
import {useTranslation} from "react-i18next";
import {fetchMetroBilbaoIncidents} from "../../services/ApiMetroBilbao";
import MetroBilbaoAddTripButton from "../../components/MetroBilbao/MetroBilbaoAddVisorButton";

const STORAGE_KEY = 'metro_bilbao_selected_stops';

const MetroBilbaoDisplays: React.FC = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const [installationIssues, setInstallationIssues] = useState([]);
    let stops = [];
    const savedStops = localStorage.getItem(STORAGE_KEY);
    if (savedStops) {
        try {
            stops = JSON.parse(savedStops);
        } catch (error) {
            console.error('Error al cargar paradas', error);
        }
    }

    useEffect(() => {
        fetchMetroBilbaoIncidents()
            .then(data => setInstallationIssues(data.installationIssues))
            .catch(error => console.error("Error fetching incidents", error));
    }, []);

    return (
        <Page title={t("Visores")} icon={trainOutline}>
            {installationIssues.length > 0 && (
                <IonAccordionGroup>
                    <IonAccordion value="installationIssues">
                        <IonItem slot="header" color="light">
                            <IonIcon icon={warningOutline} slot="start" />
                            <IonText>{t("Incidencias en instalaciones")}</IonText>
                        </IonItem>
                        <div slot="content" style={{ padding: '1rem', background: '#f8f9fa', borderTop: '1px solid #ddd' }}>
                            {installationIssues.map((issue, index) => {
                                const title = issue.title.trim();
                                const resume = issue.resume.trim();

                                return (
                                    <IonCard key={index} color="light">
                                        <IonCardHeader>
                                            <IonCardTitle style={{ fontSize: '1rem' }}>{title}</IonCardTitle>
                                        </IonCardHeader>
                                        {title !== resume && (
                                            <IonCardContent style={{ fontSize: '0.9rem', color: '#666' }}>
                                                {resume}
                                            </IonCardContent>
                                        )}
                                    </IonCard>
                                );
                            })}
                        </div>
                    </IonAccordion>
                </IonAccordionGroup>
            )}



            {stops.length > 0 ? (
                <div>
                    <MetroDisplay/>
                </div>
            ) : (
                <div style={{textAlign: 'center', marginTop: '2rem'}}>
                    <IonText>
                        <h2>{t('No tienes visores favoritos configurados')}</h2>
                        <p>
                            {t('Para poder ver tus visores favoritos, debes configurarlos en la página de configuración')}.
                        </p>
                    </IonText>
                    <MetroBilbaoAddTripButton/>
                </div>
            )}
        </Page>
    );

};

export default MetroBilbaoDisplays;
