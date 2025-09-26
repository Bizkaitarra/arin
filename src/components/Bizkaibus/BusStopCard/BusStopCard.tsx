import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { BusArrivalResponse } from '../../../services/ApiBizkaibus';
import './BusStopCard.css';

interface BusStopCardProps {
    response: BusArrivalResponse;
}

const BusStopCard: React.FC<BusStopCardProps> = ({ response }) => {
    const { t } = useTranslation();

    if (!response || !response.data) {
        return null;
    }

    const { parada, arrivals } = response.data;

    return (
        <IonCard className="bus-stop-card">
            <IonCardHeader className="bus-stop-card-header">
                <IonCardTitle>{parada.CUSTOM_NAME || parada.PARADA}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="bus-stop-card-content">
                {arrivals && arrivals.length > 0 ? (
                    arrivals.map((arrival, index) => {
                        const isCritical = arrival.e1Minutos < 5;

                        return (
                            <div className="bus-item" key={index}>
                                <div className="bus-line-info">
                                    <div>{`${arrival.linea} - ${arrival.ruta}`}</div>
                                </div>
                                <div className="bus-time-info">
                                    <div className={`bus-time ${isCritical ? 'is-critical' : ''}`}>
                                        {arrival.e1Minutos} min
                                    </div>
                                    {arrival.e2Minutos && (
                                        <div className="next-arrival">
                                            {t('Siguiente')}: {arrival.e2Minutos} min
                                        </div>
                                    )}
                                    {arrival.e1Minutos && arrival.e2Minutos && (
                                        <div className="frequency">
                                            {t('Frecuencia')}: {arrival.e2Minutos - arrival.e1Minutos} min
                                        </div>
                                    )}
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

export default BusStopCard;
