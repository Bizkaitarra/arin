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
    IonSelect, // Re-added
    IonSelectOption, // Re-added
    useIonViewWillEnter
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from '../Page';
import { searchOutline } from 'ionicons/icons';
import metroStations from '../../data/paradas_metro.json';
import { planTrip } from '../../services/ApiMetroBilbao';
import './MetroBilbaoTripPlanner.css';
import ErrorDisplay from '../../components/ErrorDisplay/ErrorDisplay';
import StationSelectorModal from '../../components/MetroBilbao/StationSelectorModal'; // Correctly placed import

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
    const { t, i18n } = useTranslation();
    const [origin, setOrigin] = useState('');
    const [originName, setOriginName] = useState('');
    const [destination, setDestination] = useState('');
    const [destinationName, setDestinationName] = useState('');
    const [date, setDate] = useState(new Date().toISOString());
    const [timeSlot, setTimeSlot] = useState(getCurrentTimeSlot());
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [showOriginModal, setShowOriginModal] = useState(false);
    const [showDestinationModal, setShowDestinationModal] = useState(false);

    useIonViewWillEnter(() => {
        setOrigin('');
        setOriginName('');
        setDestination('');
        setDestinationName('');
        setDate(new Date().toISOString());
        setTimeSlot(getCurrentTimeSlot());
        setResults(null);
        setError(null);
    });

    const handleSearch = async () => {
        if (!navigator.onLine) {
            setError(t('No tienes conexión a internet'));
            return;
        }

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

        try {
            const tripResults = await planTrip(params);
            if (tripResults && tripResults.trips) {
                setResults(tripResults);
            } else {
                setError(t('Error al planificar el viaje'));
            }
        } catch (e) {
            setError(t('Error al conectar con Metro Bilbao'));
        }
    };

    const locale = i18n.language === 'eu' ? 'eu-ES' : 'es-ES';

    const filteredMetroStations = metroStations.filter(station => !station.Lines.includes('L3'));

    return (
        <Page title={t('Planificar viaje')} icon={searchOutline} internalPage={true}>
            <IonItem button onClick={() => setShowOriginModal(true)}>
                <IonLabel position="stacked">{t('Origen')}</IonLabel>
                <IonInput
                    value={originName}
                    placeholder={t('Selecciona una estación')}
                    readonly
                />
            </IonItem>
            <StationSelectorModal
                isOpen={showOriginModal}
                onClose={() => setShowOriginModal(false)}
                onSelectStation={(code, name) => {
                    setOrigin(code);
                    setOriginName(name);
                }}
                stations={filteredMetroStations}
                title={t('Selecciona estación de origen')}
                allLines={['L1', 'L2']} // Changed prop name
            />

            <IonItem button onClick={() => setShowDestinationModal(true)}>
                <IonLabel position="stacked">{t('Destino')}</IonLabel>
                <IonInput
                    value={destinationName}
                    placeholder={t('Selecciona una estación')}
                    readonly
                />
            </IonItem>
            <StationSelectorModal
                isOpen={showDestinationModal}
                onClose={() => setShowDestinationModal(false)}
                onSelectStation={(code, name) => {
                    setDestination(code);
                    setDestinationName(name);
                }}
                stations={filteredMetroStations}
                title={t('Selecciona estación de destino')}
                allLines={['L1', 'L2']} // Changed prop name
            />
            <IonItem>
                <IonLabel position="stacked">{t('Fecha')}</IonLabel>
                <IonDatetime className="trip-planner-datetime" value={date} onIonChange={e => setDate(e.detail.value! as string)} presentation="date" locale={locale} firstDayOfWeek={1}/>
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

            {error && <ErrorDisplay message={error} />}

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
