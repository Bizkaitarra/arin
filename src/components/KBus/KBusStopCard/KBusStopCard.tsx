import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { KBusArrivalResponse } from '../../../services/KBus/KBusArrivalResponse';
import './KBusStopCard.css';

interface KBusStopCardProps {
    response: KBusArrivalResponse;
}

const KBusStopCard: React.FC<KBusStopCardProps> = ({ response }) => {
    const { t } = useTranslation();

    const getArrivalTime = (minutes: number) => {
        const arrivalTime = new Date(Date.now() + minutes * 60000);
        return arrivalTime.toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!response) {
        return null;
    }

    return (
        <IonCard className="kbus-stop-card">
            <IonCardHeader className="kbus-stop-card-header">
                <IonCardTitle>{response.stop.customName || response.stop.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="kbus-stop-card-content">
                {response.arrivals && response.arrivals.length > 0 ? (
                    response.arrivals.map((arrival, index) => {
                        const arrivalInMinutes = Math.floor(arrival.secondsToArrival / 60);
                        const isCritical = arrival.secondsToArrival < 120;

                        return (
                            <div className="bus-item" key={index}>
                                <div className="bus-line-info">
                                    <div>{arrival.line}</div>
                                </div>
                                <div className="bus-time-info">
                                    <div className={`bus-time ${isCritical ? 'is-critical' : ''}`} title={`Llegada: ${getArrivalTime(arrivalInMinutes)}`}>
                                        {arrivalInMinutes} {t('min')}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-buses">{t('No hay ningún autobús')}</div>
                )}
            </IonCardContent>
        </IonCard>
    );
};

export default KBusStopCard;
