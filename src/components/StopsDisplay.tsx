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
} from '@ionic/react';
import { fetchStopsData } from '../services/ApiBizkaibus';
import './StopsDisplay.css';

interface StopsDisplayProps {
    stops: string[]; // Array de identificadores de paradas
}

const StopsDisplay: React.FC<StopsDisplayProps> = ({ stops }) => {
    const [stopData, setStopData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const data = await fetchStopsData(stops);
            setStopData(data);
            setLoading(false);
            setError(null); // Limpiamos errores si la solicitud tiene éxito
        } catch (err) {
            setError('Error fetching stop data');
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

    const generateBusCards = (xmlDoc: Document) => {
        const pasosParada = xmlDoc.getElementsByTagName('PasoParada');
        return Array.from(pasosParada).map((paso, index) => {
            const linea = paso.getElementsByTagName('linea')[0]?.textContent || 'N/A';
            const ruta = paso.getElementsByTagName('ruta')[0]?.textContent || 'N/A';
            const e1Minutos = parseInt(paso.getElementsByTagName('e1')[0]?.getElementsByTagName('minutos')[0]?.textContent || 'N/A', 10);
            const e2Element = paso.getElementsByTagName('e2')[0]?.getElementsByTagName('minutos')[0];
            const e2Minutos = parseInt(e2Element?.textContent || '', 10);

            return (
                <div key={index} className="bus-card">
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>{`Línea ${linea} - ${ruta}`}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <p>
                                <IonBadge color={e1Minutos < 3 ? 'danger' : 'success'}>
                                    Próximo: {e1Minutos} min
                                </IonBadge>
                                {!isNaN(e2Minutos) && (
                                    <IonBadge color="secondary" className="ml-1">
                                        Siguiente: {e2Minutos} min
                                    </IonBadge>
                                )}
                            </p>
                        </IonCardContent>
                    </IonCard>
                </div>
            );
        });
    };

    const appendStops = (xmlData: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
        const denominacionParada = xmlDoc.getElementsByTagName('DenominacionParada')[0]?.textContent || 'Parada desconocida';

        return (
            <IonCard className="stop-card">
                <IonCardHeader className="stop-card-header">
                    <IonCardTitle>{denominacionParada}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <div className="bus-cards-container">{generateBusCards(xmlDoc)}</div>
                </IonCardContent>
            </IonCard>
        );
    };

    return (
        <div className="stops-display">
            {/* IonRefresher para el gesto de refrescar */}
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent pullingText="Desliza hacia abajo para refrescar" />
            </IonRefresher>

            {loading && <IonSpinner name="crescent" />}
            {error && <p className="error-text">{error}</p>}
            {!loading && !error && stopData.length > 0 && stopData.map((data, index) => (
                <React.Fragment key={index}>{appendStops(data)}</React.Fragment>
            ))}
        </div>
    );
};

export default StopsDisplay;
