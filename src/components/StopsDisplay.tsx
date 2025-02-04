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
    IonText, IonIcon, IonButton,
} from '@ionic/react';
import { fetchStopsData } from '../services/ApiBizkaibus';
import './StopsDisplay.css';
import {timerOutline, trashBinOutline} from "ionicons/icons";
import { useHistory } from 'react-router-dom';

interface StopsDisplayProps {
    stops: string[];
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
            setError(null);
        } catch (err) {
            setError('Error fetching stop data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 30000);
        return () => clearInterval(intervalId);
    }, [stops]);

    const handleRefresh = async (event: CustomEvent) => {
        await fetchData();
        event.detail.complete();
    };

    const generateBusCards = (xmlDoc: Document) => {
        const pasosParada = xmlDoc.getElementsByTagName('PasoParada');
        return Array.from(pasosParada).map((paso, index) => {
            const linea = paso.getElementsByTagName('linea')[0]?.textContent || 'N/A';
            const ruta = paso.getElementsByTagName('ruta')[0]?.textContent || 'N/A';
            const e1Minutos = parseInt(paso.getElementsByTagName('e1')[0]?.getElementsByTagName('minutos')[0]?.textContent || '0', 10);
            const e2Element = paso.getElementsByTagName('e2')[0]?.getElementsByTagName('minutos')[0];
            const e2Minutos = parseInt(e2Element?.textContent || '0', 10);
            const history = useHistory();

            return (
                <div key={index} className="bus-card">
                    <IonCard>
                        <IonCardContent>
                            <div className="bus-info">
                                <IonCardTitle>{`Línea ${linea} - ${ruta}`}</IonCardTitle>
                                <div className="badges">
                                    <IonBadge color={e1Minutos < 3 ? 'danger' : 'success'}>
                                        {e1Minutos} min ({calcularHora(e1Minutos)})
                                    </IonBadge>
                                    {!isNaN(e2Minutos) && (
                                        <IonBadge color="secondary" className="ml-1">
                                            {e2Minutos} min ({calcularHora(e2Minutos)})
                                        </IonBadge>
                                    )}
                                </div>
                                <IonButton color="secondary" onClick={() => history.push(`/horarios/${linea}`)}>
                                    Ver horarios <IonIcon icon={timerOutline} />
                                </IonButton>
                            </div>
                        </IonCardContent>
                    </IonCard>
                </div>
            );
        });
    };

    const calcularHora = (minutos: number): string => {
        const ahora = new Date(); // Hora actual
        const horaLlegada = new Date(ahora.getTime() + minutos * 60000); // Suma los minutos
        return horaLlegada.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }); // Formatea la hora
    };


    const appendStop = (xmlData: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
        const denominacionParada = xmlDoc.getElementsByTagName('DenominacionParada')[0]?.textContent || 'Parada desconocida';

        return (
            <IonCard className="stop-card">
                <IonCardHeader>
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
            {!loading && !error && stopData.length > 0 && stopData.map((data, index) => (
                <React.Fragment key={index}>{appendStop(data)}</React.Fragment>
            ))}
        </div>
    );
};

export default StopsDisplay;
