import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { BusArrivalResponse } from '../../../services/ApiBizkaibus';
import './BusStopCard.css';
import { Link } from 'react-router-dom';

interface BusStopCardProps {
    response: BusArrivalResponse;
}

const BusStopCard: React.FC<BusStopCardProps> = ({ response }) => {
    const { t } = useTranslation();

    const getArrivalTime = (minutes: number) => {
        const arrivalTime = new Date(Date.now() + minutes * 60000);
        return arrivalTime.toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getMinutesStatusClass = (mins: number) => {
        if (mins <= 3) return 'status-critical';
        if (mins <= 10) return 'status-warning';
        return 'status-normal';
    };

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
                        const statusClass = getMinutesStatusClass(arrival.e1Minutos);

                        return (
                            <div className="bus-item" key={index}>
                                <div className="bus-line-info" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="line-badge bizkaibus-badge">{arrival.linea}</span>
                                        <span style={{ fontSize: '0.95em', color: 'var(--arin-text-color)' }}>{arrival.ruta}</span>
                                    </div>
                                    <Link to={`/bizkaibus/routes/${arrival.linea}`} style={{ marginLeft: '40px' }}>{t('Ver línea')}</Link>
                                </div>
                                <div className="bus-time-info">
                                    <div className="bus-arrival-primary">
                                        <div className={`bus-time ${statusClass}`}>
                                            {arrival.e1Minutos} {t('min')}
                                        </div>
                                        <div className="arrival-time-display">({getArrivalTime(arrival.e1Minutos)})</div>
                                    </div>
                                    {arrival.e2Minutos && (
                                        <div className="next-arrival" title={`Llegada: ${getArrivalTime(arrival.e2Minutos)}`}>
                                            {t('Siguiente')}: {arrival.e2Minutos} {t('min')}
                                        </div>
                                    )}
                                    {arrival.e1Minutos > 0 && arrival.e2Minutos && (
                                        <div className="frequency">
                                            {t('Frecuencia')}: {arrival.e2Minutos - arrival.e1Minutos} {t('min')}
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
