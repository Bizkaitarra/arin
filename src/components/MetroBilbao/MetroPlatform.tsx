import React from 'react';
import {IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList} from '@ionic/react';
import './MetroDisplay.css';
import {MetroTrain} from "../../services/MetroBilbaoStorage";
import {useTranslation} from "react-i18next";
import {useConfiguration} from "../../context/ConfigurationContext";

const MetroPlatform: React.FC<{ platform: MetroTrain[], platformIndex: number, title: string }> = ({
                                                                                                       platform,
                                                                                                       platformIndex,
                                                                                                       title
                                                                                                   }) => {
    const {t} = useTranslation();
    const {settings} = useConfiguration();

    if (platform.length === 0) return null;

    return (
        <IonCard className="bus-card">
            <IonCardHeader>
                <IonCardTitle>{title}</IonCardTitle>
            </IonCardHeader>
            <IonList>

                {platform.map((train, trainIndex) => (
                    <>
                    {trainIndex === 0 && train.Transfer && (
                        <IonItem key={`${platformIndex}-${trainIndex}T`} className="train-transfer">
                            <IonLabel><strong>{t('Transbordo en')}:</strong></IonLabel>
                            <IonBadge>San Ignazio</IonBadge>
                        </IonItem>
                    )}
                    {trainIndex === 0 && (
                        <IonItem key={`${platformIndex}-${trainIndex}D`} className="train-duration">
                            <IonLabel>{t('Duración del viaje')}:</IonLabel>
                            <IonBadge>{train.Duration} min</IonBadge>
                        </IonItem>
                    )}
                        <IonItem key={`${platformIndex}-${trainIndex}`} className="train-card">
                            <IonLabel>{train.Direction || 'N/A'}</IonLabel>
                            <IonBadge color={train.Estimated < 1 ? 'danger' : 'success'}>
                                {train.Estimated < 0 ? 0 : train.Estimated} min
                                ({new Date(train.Time).toLocaleTimeString([], {
                                hour: '2-digit', minute: '2-digit'
                            })})
                                {settings.verNumeroVagones && ` ${train.Wagons || 4} ` + t('vagones')}
                            </IonBadge>
                        </IonItem>
                    </>
                ))}
            </IonList>
        </IonCard>
    );
};

export default MetroPlatform;
