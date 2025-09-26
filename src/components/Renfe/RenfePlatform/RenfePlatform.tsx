import React, {useState} from 'react';
import {
    IonBadge,
    IonButton,
    IonContent, IonIcon,
    IonModal
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import {TrainSchedule} from "../../../services/Renfe/ApiRenfe";
import './RenfePlatform.css';

const RenfePlatform: React.FC<{ platform: TrainSchedule[], platformIndex: number, title: string, destiny: string }> = ({
                                                                                                       platform,
                                                                                                       platformIndex,
                                                                                                       title,
                                                                                                        destiny
                                                                                                   }) => {
    const {t} = useTranslation();
    const [selectedTrain, setSelectedTrain] = useState(null);


    if (platform.length === 0) return null;

    return (
        <>
            <div className="train-list">
                <div className="train-list-header">{title}</div>
                {platform.map((train, trainIndex) => {
                    const isCritical = train.timeToGo < 2;
                    return (
                        <div key={trainIndex} className="train-item">
                            <div className="train-destination">
                                {train.transData ? t('Transbordo') : destiny}
                                {train.transData && (
                                    <div className="train-details">
                                        <IonButton size="small" color="warning" onClick={() => setSelectedTrain(train)}>Más info</IonButton>
                                    </div>
                                )}
                            </div>
                            <div className="train-time-info">
                                <div className={`train-time ${isCritical ? 'is-critical' : ''}`}>
                                    {train.timeToGo < 0 ? 0 : train.timeToGo} min
                                </div>
                                <div className="train-details">
                                    {train.departure}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <IonModal isOpen={!!selectedTrain} onDidDismiss={() => setSelectedTrain(null)}>
                <IonContent className="ion-padding">
                    {selectedTrain && selectedTrain.transData && (
                        <>
                            <h2>{t('Detalles del transbordo')}</h2>
                            <p><strong>{t('Estación')}: </strong>{selectedTrain.transData.transStation.name}</p>
                            <p><strong>{t('Tiempo de espera')}: </strong>{selectedTrain.transData.timeToGo} min ({selectedTrain.transData.departure})</p>
                            <p><strong>{t('Línea')}: </strong>{selectedTrain.transData.line}</p>
                            <IonButton expand="block" onClick={() => setSelectedTrain(null)}>{t('Cerrar')}</IonButton>
                        </>
                    )}
                </IonContent>
            </IonModal>
        </>

    );
};

export default RenfePlatform;
