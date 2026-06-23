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
import { warningOutline } from "ionicons/icons";
import {useTranslation} from "react-i18next";
import {ApiMetroBilbao} from "../../services/MetroBilbao/ApiMetroBilbao";
import {IncidentsResult} from "../../services/MetroBilbao/Incidences";

const MetroIncidents: React.FC = () => {
    const {t} = useTranslation();
    const [installationIssues, setInstallationIssues] = useState<any[]>([]);
    const [serviceIssues, setServiceIssues] = useState<any[]>([]);
    
    const stripHtml = (html: string) => html.replace(/<\/?[^>]+(>|$)/g, "");

    const updateIssues = (data: IncidentsResult) => {
        setServiceIssues(data.serviceIssues);
        setInstallationIssues(data.installationIssues);
    }

    useEffect(() => {
        new ApiMetroBilbao().fetchMetroBilbaoIncidents()
            .then(data => updateIssues(data))
            .catch(error => console.error("Error fetching incidents", error));
    }, []);

    if (serviceIssues.length === 0 && installationIssues.length === 0) {
        return null;
    }

    return (
        <div style={{ padding: '0 16px', marginBottom: '16px' }}>
            {serviceIssues.length > 0 && (
                <IonAccordionGroup>
                    <IonAccordion value="generalIssues">
                        <IonItem slot="header" color="light">
                            <IonIcon icon={warningOutline} slot="start" color="warning"/>
                            <IonText>{t("Incidencias Metro Bilbao")}</IonText>
                        </IonItem>
                        <div slot="content"
                             style={{padding: '1rem', background: '#f8f9fa', borderTop: '1px solid #ddd'}}>
                            {serviceIssues.map((issue, index) => {
                                const title = issue?.title?.trim() || '';
                                return (
                                    <IonCard key={index} color="light" style={{ margin: '0 0 10px 0' }}>
                                        <IonCardHeader>
                                            <IonCardTitle style={{fontSize: '1rem'}}>{title}</IonCardTitle>
                                        </IonCardHeader>
                                        <IonCardContent style={{fontSize: '0.9rem', color: '#666'}}>
                                            {stripHtml(issue?.description?.trim() || '')}
                                        </IonCardContent>
                                    </IonCard>
                                );
                            })}
                        </div>
                    </IonAccordion>
                </IonAccordionGroup>
            )}
            {installationIssues.length > 0 && (
                <IonAccordionGroup style={{ marginTop: serviceIssues.length > 0 ? '10px' : '0' }}>
                    <IonAccordion value="installationIssues">
                        <IonItem slot="header" color="light">
                            <IonIcon icon={warningOutline} slot="start" color="warning"/>
                            <IonText>{t("Incidencias en instalaciones (Metro)")}</IonText>
                        </IonItem>
                        <div slot="content"
                             style={{padding: '1rem', background: '#f8f9fa', borderTop: '1px solid #ddd'}}>
                            {installationIssues.map((issue, index) => {
                                const title = issue?.title?.trim() || '';
                                return (
                                    <IonCard key={index} color="light" style={{ margin: '0 0 10px 0' }}>
                                        <IonCardHeader>
                                            <IonCardTitle style={{fontSize: '1rem'}}>{title}</IonCardTitle>
                                        </IonCardHeader>
                                        <IonCardContent style={{fontSize: '0.9rem', color: '#666'}}>
                                            {stripHtml(issue?.description?.trim() || '')}
                                        </IonCardContent>
                                    </IonCard>
                                );
                            })}
                        </div>
                    </IonAccordion>
                </IonAccordionGroup>
            )}
        </div>
    );
};

export default MetroIncidents;
