import React, { useState } from 'react';
import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    useIonViewWillEnter
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import Page from '../Page';
import { searchOutline } from 'ionicons/icons';
import renfeStations from '../../data/paradas_renfe.json';
import { ApiRenfe } from '../../services/Renfe/ApiRenfe';
import './RenfeTripPlanner.css';
import ErrorDisplay from '../../components/ErrorDisplay/ErrorDisplay';
import RenfeStationSelectorModal from '../../components/Renfe/RenfeStationSelectorModal';
import '../../components/Renfe/RenfeStationCard/RenfeStationCard.css';
import '../../components/Renfe/RenfePlatform/RenfePlatform.css';
import RenfeTripResultCard from '../../components/Renfe/RenfeTripResultCard';

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

const RenfeTripPlanner: React.FC = () => {
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
            const api = new ApiRenfe();
            const tripResults = await api.planTrip(params);
            if (tripResults && tripResults.horario) {
                setResults({
                    origin: originName,
                    destination: destinationName,
                    trains: tripResults.horario
                });
            } else {
                setError(t('No se encontraron trenes o ocurrió un error.'));
                // If API returns success but empty list handled in component, 
                // but if result is null it is error.
                if (tripResults) {
                    setResults({
                        origin: originName,
                        destination: destinationName,
                        trains: []
                    });
                }
            }
        } catch (e) {
            setError(t('Error al conectar con Renfe'));
        }
    };

    const locale = i18n.language === 'eu' ? 'eu-ES' : 'es-ES';

    // Type casting/mapping for stations if needed
    const stations: any[] = renfeStations.map(s => ({ ...s, id: s.id, name: s.name, Lines: s.Lines || [] }));

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
            <RenfeStationSelectorModal
                isOpen={showOriginModal}
                onClose={() => setShowOriginModal(false)}
                onCancel={() => setShowOriginModal(false)}
                onSelectStation={(code, name) => {
                    setOrigin(code);
                    setOriginName(name);
                    setShowOriginModal(false);
                }}
                stations={stations}
                title={t('Selecciona estación de origen')}
                allLines={['C1', 'C2', 'C3', 'C4']}
            />

            <IonItem button onClick={() => setShowDestinationModal(true)}>
                <IonLabel position="stacked">{t('Destino')}</IonLabel>
                <IonInput
                    value={destinationName}
                    placeholder={t('Selecciona una estación')}
                    readonly
                />
            </IonItem>
            <RenfeStationSelectorModal
                isOpen={showDestinationModal}
                onClose={() => setShowDestinationModal(false)}
                onCancel={() => setShowDestinationModal(false)}
                onSelectStation={(code, name) => {
                    setDestination(code);
                    setDestinationName(name);
                    setShowDestinationModal(false);
                }}
                stations={stations}
                title={t('Selecciona estación de destino')}
                allLines={['C1', 'C2', 'C3', 'C4']}
            />
            <IonItem>
                <IonLabel position="stacked">{t('Fecha')}</IonLabel>
                <IonDatetime className="trip-planner-datetime" value={date} onIonChange={e => setDate(e.detail.value! as string)} presentation="date" locale={locale} firstDayOfWeek={1} />
            </IonItem>
            <IonItem>
                <IonLabel position="stacked">{t('Franja horaria')}</IonLabel>
                <IonSelect value={timeSlot} placeholder={t('Selecciona una franja horaria')} onIonChange={e => setTimeSlot(e.detail.value)}>
                    {timeSlots.map(slot => (
                        <IonSelectOption key={slot.value} value={slot.value}>{slot.label}</IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
            <IonButton expand="full" onClick={handleSearch} style={{ marginTop: '1rem' }} color="tertiary">
                {t('Buscar viaje')}
            </IonButton>

            {error && <ErrorDisplay message={error} />}

            {results && (
                <div className="trip-results-card">
                    <RenfeTripResultCard results={results} />
                </div>
            )}
        </Page>
    );
};

export default RenfeTripPlanner;
