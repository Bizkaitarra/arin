import React, {useState} from 'react';
import {
    IonBadge,
    IonButton,
    IonContent,
    IonModal
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import {TrainSchedule} from "../../../services/Renfe/ApiRenfe";
import './RenfePlatform.css';

const RenfePlatform: React.FC<{ platform: TrainSchedule[], platformIndex: number, title: string, destiny: string, duration: string | undefined }> = ({
                                                                                                       platform,
                                                                                                       platformIndex,
                                                                                                       title,
                                                                                                       destiny,
                                                                                                       duration
                                                                                                   }) => {
    const {t} = useTranslation();
    const [selectedTrain, setSelectedTrain] = useState(null);

    const getMinutesStatusClass = (mins: number) => {
        if (mins <= 3) return 'status-critical';
        if (mins <= 10) return 'status-warning';
        return 'status-normal';
    };

    if (platform.length === 0) return null;

    return (
        <>
            <div className="train-list">
                <div className="train-list-header">
                    {title}
                    {duration && <div className="duration">{t('Duración estimada')}: {duration}</div>}
                </div>
                {platform.map((train, trainIndex) => {
                    const arrivalInMinutes = train.timeToGo < 0 ? 0 : train.timeToGo;
                    const statusClass = getMinutesStatusClass(arrivalInMinutes);
                    return (
                        <div key={trainIndex} className="train-item">
                            <div className="train-destination" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="line-badge renfe-badge">{train.line}</span>
                                <span style={{ color: 'var(--arin-text-color)' }}>
                                    {train.transData ? t('Transbordo') : destiny}
                                    {train.transData && (
                                        <div className="train-details">
                                            <IonButton size="small" color="warning" onClick={() => setSelectedTrain(train)}>{t('Más info')}</IonButton>
                                        </div>
                                    )}
                                </span>
                            </div>
                            <div className="train-time-info">
                                <div className={`train-time ${statusClass}`} title={`Llegada: ${train.departure}`}>
                                    {arrivalInMinutes} {t('min')}
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
                            <p><strong>{t('Tiempo de espera')}: </strong>{selectedTrain.transData.timeToGo} {t('min')} ({selectedTrain.transData.departure})</p>
                            <p><strong>{t('Línea')}: </strong>{selectedTrain.transData.line}</p>
                            <IonButton expand="block" onClick={() => setSelectedTrain(null)}>{t('Cerrar')}</IonButton>
                        </>
                    )}
                </IonContent>
            </IonModal>        </>

    );
};

export default RenfePlatform;
