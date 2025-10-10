import React, { useState } from 'react';
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonDatetime,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonSelect,
    IonSelectOption,
    useIonViewWillEnter
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from '../Page';
import { searchOutline } from 'ionicons/icons';
import metroStations from '../../data/paradas_metro.json';
import { planTrip } from '../../services/ApiMetroBilbao';
import './MetroBilbaoTripPlanner.css';

const timeSlots = [
    { value: '0-4', label: '00:00 - 04:00' },
    { value: '4-8', label: '04:00 - 08:00' },
    { value: '8-12', label: '08:00 - 12:00' },
    { value: '12-16', label: '12:00 - 16:00' },
    { value: '16-20', label: '16:00 - 20:00' },
    { value: '20-24', label: '20:00 - 23:59' },
];

const getCurrentTimeSlot = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 4) return '0-4';
    if (currentHour >= 4 && currentHour < 8) return '4-8';
    if (currentHour >= 8 && currentHour < 12) return '8-12';
    if (currentHour >= 12 && currentHour < 16) return '12-16';
    if (currentHour >= 16 && currentHour < 20) return '16-20';
    if (currentHour >= 20 && currentHour < 24) return '20-24';
    return ''; // Default
};

const MetroBilbaoTripPlanner: React.FC = () => {
    const { t } = useTranslation();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState(new Date().toISOString());
    const [timeSlot, setTimeSlot] = useState(getCurrentTimeSlot());
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useIonViewWillEnter(() => {
        setOrigin('');
        setDestination('');
        setDate(new Date().toISOString());
        setTimeSlot(getCurrentTimeSlot());
        setResults(null);
        setError(null);
    });

    const handleSearch = async () => {
        setError(null);
        setResults(null);

        if (!origin || !destination || !date || !timeSlot) {
            setError(t('Por favor, completa todos los campos'));
            return;
        }

        const [year, month, day] = date.split('T')[0].split('-');
        const formattedDate = `${day}-${month}-${year}`;

        const [startHour, endHour] = timeSlot.split('-').map(Number);

        const params = {
            origen: origin,
            destino: destination,
            fecha: formattedDate,
            hora_inicio: startHour,
            hora_fin: endHour
        };

        const tripResults = await planTrip(params);
        if (tripResults && tripResults.trips) {
            setResults(tripResults);
        } else {
            setError(t('Error al planificar el viaje'));
        }
    };

    return (
        <Page title={t('Planificar viaje')} icon={searchOutline} internalPage={true}>
            <IonItem>
                <IonLabel position="stacked">{t('Origen')}</IonLabel>
                <IonSelect value={origin} placeholder={t('Selecciona una estación')} onIonChange={e => setOrigin(e.detail.value)}>
                    {metroStations.map(station => (
                        <IonSelectOption key={station.Code} value={station.Code}>{station.Name}</IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
            <IonItem>
                <IonLabel position="stacked">{t('Destino')}</IonLabel>
                <IonSelect value={destination} placeholder={t('Selecciona una estación')} onIonChange={e => setDestination(e.detail.value)}>
                    {metroStations.map(station => (
                        <IonSelectOption key={station.Code} value={station.Code}>{station.Name}</IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
            <IonItem>
                <IonLabel position="stacked">{t('Fecha')}</IonLabel>
                <IonDatetime className="trip-planner-datetime" displayFormat="DD-MM-YYYY" value={date} onIonChange={e => setDate(e.detail.value!)} placeholder={t('Selecciona una fecha')} presentation="date"/>
            </IonItem>
            <IonItem>
                <IonLabel position="stacked">{t('Franja horaria')}</IonLabel>
                <IonSelect value={timeSlot} placeholder={t('Selecciona una franja horaria')} onIonChange={e => setTimeSlot(e.detail.value)}>
                    {timeSlots.map(slot => (
                        <IonSelectOption key={slot.value} value={slot.value}>{slot.label}</IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
            <IonButton expand="full" onClick={handleSearch} style={{ marginTop: '1rem' }} color="danger">
                {t('Buscar viaje')}
            </IonButton>

            {error && <p style={{ textAlign: 'center', color: 'red', marginTop: '1rem' }}>{error}</p>}

            {results && results.trips && (
                <IonCard className="trip-results-card" style={{ marginTop: '1rem' }}>
                    <IonCardHeader className="metro-station-card-header">
                        <IonCardTitle className="metro-station-card-title">{`${results.origin.name} -> ${results.destiny.name}`}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <div className="train-list-header">{t('Duración media del viaje')}: {results.time} {t('minutos')}</div>
                        <IonList>
                            {Object.values(results.trips).flat().map((trip: any, index: number) => (
                                <IonItem key={index}>
                                    <IonLabel>
                                        <p><strong>{t('Salida')}:</strong> {trip.originArrivalTimeRounder}</p>
                                        <p><strong>{t('Llegada')}:</strong> {trip.destinyArrivalTimeRounder}</p>
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonCardContent>
                </IonCard>
            )}
        </Page>
    );
};

export default MetroBilbaoTripPlanner;
