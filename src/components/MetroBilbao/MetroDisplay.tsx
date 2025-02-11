import React, { useState } from 'react';
import {
    IonBadge,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonText,
    useIonViewWillEnter,
} from '@ionic/react';
import { fetchStopsData } from '../../services/ApiMetroBilbao';
import './MetroDisplay.css';
import { setIntervalMetroBilbao } from '../../services/IntervalServices';
import Loader from '../Loader';

const STORAGE_KEY = 'metro_bilbao_selected_stops';

const MetroDisplay: React.FC = () => {
    const [metroData, setMetroData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloading, setReloading] = useState<boolean>(true);

    // Función para obtener los datos de las estaciones de metro
    const fetchData = async () => {
        try {
            setLoading(true);
            let stops = [];
            const savedStops = localStorage.getItem(STORAGE_KEY);
            if (savedStops) {
                try {
                    stops = JSON.parse(savedStops);
                } catch (error) {
                    console.error('Error al cargar paradas desde localStorage:', error);
                }
            }
            const data = await fetchStopsData(stops); // Llamada a la API del Metro
            setMetroData(data);
            setLoading(false);
            setError(null);
        } catch (err) {
            setError('Error fetching metro data');
            setLoading(false);
        }
    };

    const reloadData = async () => {
        setReloading(true);
        await fetchData();
    };

    useIonViewWillEnter(() => {
        setReloading(false);
        fetchData();
        // Utilizamos el intervalo específico para Metro Bilbao
        setIntervalMetroBilbao(reloadData, 60000);
    });

    const handleRefresh = async (event: CustomEvent) => {
        await reloadData();
        event.detail.complete();
    };

    // Generar las tarjetas de los trenes para cada plataforma
    const generateTrainCards = (stationData: any) => {
        const platforms = stationData.platforms?.Platforms;
        if (!Array.isArray(platforms) || platforms.length === 0) {
            return (
                <div className="no-data">
                    <p>No hay datos de la estación en este momento</p>
                </div>
            );
        }

        return platforms.map((platform: any, platformIndex: number) => {
            // Si la plataforma no tiene trenes, no la mostramos
            if (platform.length === 0) {
                return null;
            }

            // Determinar el título de la plataforma
            const platformTitle = platform.find((train: any) => isNaN(train.Direction))
                ? platform.find((train: any) => isNaN(train.Direction)).Direction
                : platform.some((train: any) => train.Direction === 1)
                    ? 'Kabiezes/Plentzia'
                    : 'Etxebarri/Basauri';

            return (
                <IonCard key={platformIndex} className="platform-section">
                    <IonCardHeader>
                        <IonCardTitle>{platformTitle}</IonCardTitle>
                    </IonCardHeader>
                    <IonList>
                        {platform.map((train: any, trainIndex: number) => {
                            const destination = train.Destination || 'N/A';
                            const line = train.line || 'N/A';
                            const minutes = parseInt(train.Minutes, 10);
                            const nextArrival = train.Time || 'N/A';

                            return (
                                <IonItem key={`${platformIndex}-${trainIndex}`} className="train-card">
                                    <IonLabel>
                                        <h2>{`${destination} - Línea ${line}`}</h2>
                                        <p>
                                            <IonBadge color={minutes < 1 ? 'danger' : 'success'}>
                                                {minutes} min ({new Date(nextArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}) {train.Length} vagones
                                            </IonBadge>

                                        </p>
                                    </IonLabel>
                                </IonItem>
                            );
                        })}
                    </IonList>
                </IonCard>
            );
        });
    };

    // Crear la tarjeta de la estación de metro
    const appendStation = (stationData: any) => {
        const denominacionEstacion = stationData.name || 'Estación desconocida';

        return (
            <IonCard className="station-card">
                <IonCardHeader className="station-card-header">
                    <IonCardTitle>{denominacionEstacion}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <div className="train-cards-container">
                        {generateTrainCards(stationData)}
                    </div>
                </IonCardContent>
            </IonCard>
        );
    };

    return (
        <div className="metro-display">
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent pullingText="Desliza hacia abajo para refrescar" />
            </IonRefresher>

            {loading && (
                <Loader serviceName={"Metro Bilbao"} reloading={reloading} />
            )}
            {error && (
                <div className="error-container">
                    <IonText color="danger">
                        <h4>{error}</h4>
                    </IonText>
                </div>
            )}
            {!loading &&
                !error &&
                metroData.length > 0 &&
                metroData.map((data, index) => (
                    <React.Fragment key={index}>{appendStation(data)}</React.Fragment>
                ))}
        </div>
    );
};

export default MetroDisplay;
