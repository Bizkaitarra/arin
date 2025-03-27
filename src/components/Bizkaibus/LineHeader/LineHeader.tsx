import React from 'react';
import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonText,
    IonButton,
    IonIcon,
    IonGrid, IonRow, IonCol
} from '@ionic/react';
import {documentOutline} from 'ionicons/icons';
import {useTranslation} from "react-i18next";

const LineHeader = ({line, lineName}) => {
    const {t} = useTranslation();
    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>{line}</IonCardTitle>
                {lineName && <IonCardSubtitle>{lineName}</IonCardSubtitle>}
            </IonCardHeader>

            <IonCardContent>
                <IonGrid>
                    <IonRow>
                        <IonCol size="4">
                            <IonText>{t('Descarga el itinerario')}:</IonText>
                        </IonCol>
                        <IonCol size="4">
                            <IonButton fill="clear" size="small"
                                       href={`http://apli.bizkaia.net/APPS/DANOK/TQ/DATOS_PARADAS/ITINERARIOS/${line}I.PDF`}
                                       target="_blank">
                                <IonIcon icon={documentOutline} style={{marginRight: "3px"}}/> {t('Ida')}
                            </IonButton>
                        </IonCol>
                        <IonCol size="4">
                            <IonButton fill="clear" size="small"
                                       href={`http://apli.bizkaia.net/APPS/DANOK/TQ/DATOS_PARADAS/ITINERARIOS/${line}V.PDF`}
                                       target="_blank">
                                <IonIcon icon={documentOutline} style={{marginRight: "3px"}}/> {t('Vuelta')}
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonCardContent>
        </IonCard>
    );
};

export default LineHeader;
