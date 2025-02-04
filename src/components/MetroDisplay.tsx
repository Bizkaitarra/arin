import React, { useEffect, useState } from 'react';
import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    IonText, IonList, IonItem, IonLabel
} from '@ionic/react';
import { fetchStopsData } from '../services/ApiMetroBilbao'; // Asegúrate de importar la función de tu servicio
import './MetroDisplay.css';

interface MetroDisplayProps {
    stops: string[]; // Array de identificadores de estaciones de metro
}

const MetroDisplay: React.FC<MetroDisplayProps> = ({ stops }) => {
    const [metroData, setMetroData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener los datos de las estaciones de metro
    const fetchData = async () => {
        try {
            const data = await fetchStopsData(stops); // Llamada a la API del Metro
            setMetroData(data);
            setLoading(false);
            setError(null); // Limpiar error si la solicitud tiene éxito
        } catch (err) {
            setError('Error fetching metro data');
            setLoading(false);
        }
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        // Llamar a la API al montar el componente
        fetchData();

        // Configurar el intervalo para llamar a la API cada 30 segundos
        intervalId = setInterval(() => {
            fetchData();
        }, 30000);

        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(intervalId);
    }, [stops]);

    // Manejar el refresco manual
    const handleRefresh = async (event: CustomEvent) => {
        await fetchData();
        event.detail.complete(); // Finalizar la animación de refresco
    };

    // Generar las tarjetas de los trenes
    const generateTrainCards = (stationData: any) => {
        const platforms = stationData.platforms?.Platforms;
        if (!Array.isArray(platforms) || platforms.length === 0) {
            console.error('No se encontraron plataformas en la estación:', stationData);
            return null;
        }

        return platforms.map((platform, platformIndex) => {
            // Si la plataforma no tiene trenes, no la mostramos
            if (platform.length === 0) {
                return null;
            }

            // Determinar el título de la plataforma
            const platformTitle = platform.find((train) => isNaN(train.Direction))
                ? platform.find((train) => isNaN(train.Direction)).Direction
                : platform.some((train) => train.Direction === 1)
                    ? 'Kabiezes/Plentzia'
                    : 'Etxebarri/Basauri';

            return (
                <IonCard key={platformIndex} className="platform-section">
                    <IonCardHeader>
                        <IonCardTitle>{platformTitle}</IonCardTitle>
                    </IonCardHeader>
                    <IonList>
                        {platform.map((train, trainIndex) => {
                            const destination = train.Destination || 'N/A';
                            const line = train.line || 'N/A';
                            const minutes = parseInt(train.Minutes, 10);
                            const nextArrival = train.Time || 'N/A';

                            // Determinar si "Próximo" debe parpadear
                            const e1Class = minutes < 1 ? 'blink' : 'd-none';
                            return (
                                <IonItem key={`${platformIndex}-${trainIndex}`} className="train-card">
                                    <IonLabel>
                                        <h2>{`${destination} Línea ${line}`}</h2>
                                        <p>
                                            <IonBadge color={minutes < 1 ? 'danger' : 'success'}>
                                                Próximo: {minutes} min ({new Date(nextArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                                            </IonBadge>
                                            <IonBadge className="ml-1">
                                                Número de vagones: {train.Length}
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
            {/* IonRefresher para el gesto de refrescar */}
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent pullingText="Desliza hacia abajo para refrescar" />
            </IonRefresher>

            {loading && (
                <div className="loading-container">
                    <IonSpinner name="crescent" />
                </div>
            )}
            {error && (
                <div className="error-container">
                    <IonText color="danger">
                        <h4>{error}</h4>
                    </IonText>
                </div>
            )}
            {!loading && !error && metroData.length > 0 && metroData.map((data, index) => (
                <React.Fragment key={index}>{appendStation(data)}</React.Fragment>
            ))}
        </div>
    );
};

export default MetroDisplay;
