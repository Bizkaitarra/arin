import React, { useState } from 'react';
import {
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonText,
    useIonViewWillEnter,
} from '@ionic/react';
import { fetchStopsData } from '../../services/ApiBizkaibus';
import './StopsDisplay.css';
import { timerOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { getSavedStationIds } from '../../services/BizkaibusStorage';
import { setIntervalBizkaibus } from '../../services/IntervalServices';
import Loader from '../Loader';

const StopsDisplay: React.FC = () => {
    const [stopData, setStopData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const history = useHistory();
    const [reloading, setReloading] = useState<boolean>(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const stops = getSavedStationIds();
            const data = await fetchStopsData(stops);
            setStopData(data);
            setLoading(false);
            setError(null);
        } catch (err) {
            setError(
                'No se han podido obtener las paradas. Si tienes conexión a internet, el problema es Bizkaibus'
            );
            setLoading(false);
        }
    };

    useIonViewWillEnter(() => {
        setReloading(false);
        fetchData();
        setIntervalBizkaibus(reloadData, 60000);
    });

    const reloadData = async () => {
        setReloading(true);
        await fetchData();
    };

    const handleRefresh = async (event: CustomEvent) => {
        await reloadData();
        event.detail.complete();
    };

    // Función para generar las tarjetas de autobús a partir del XML
    const generateBusCards = (xmlDoc: Document) => {
        const pasosParada = xmlDoc.getElementsByTagName('PasoParada');
        return Array.from(pasosParada).map((paso, index) => {
            const linea = paso.getElementsByTagName('linea')[0]?.textContent || 'N/A';
            const ruta = paso.getElementsByTagName('ruta')[0]?.textContent || 'N/A';
            const e1Minutos = parseInt(
                paso.getElementsByTagName('e1')[0]?.getElementsByTagName('minutos')[0]?.textContent || '0',
                10
            );
            const e2Element = paso.getElementsByTagName('e2')[0]?.getElementsByTagName('minutos')[0];
            const e2Minutos = parseInt(e2Element?.textContent || '0', 10);

            return (
                <IonCard key={index} className="bus-card">
                    <IonCardContent>
                        <IonCardTitle>{`${linea} - ${toTitleCase(ruta)}`}</IonCardTitle>
                        <div className="badges">
                            <IonBadge color={e1Minutos < 3 ? 'danger' : 'success'}>
                                {e1Minutos} min ({calcularHora(e1Minutos)})
                            </IonBadge>
                            {!isNaN(e2Minutos) && e2Minutos > 0 && (
                                <IonBadge color="secondary" className="ml-1">
                                    {e2Minutos} min ({calcularHora(e2Minutos)})
                                </IonBadge>
                            )}
                        </div>
                        <IonButton
                            color="secondary"

                            onClick={() => history.push(`/horarios/${linea}`)}
                        >
                            <IonIcon icon={timerOutline} /> Ver horarios
                        </IonButton>
                    </IonCardContent>
                </IonCard>
            );
        });
    };

    const toTitleCase = (str) => {
        return str
            .toLowerCase()
            .split(/[\s\-.]+/) // Divide por espacios, guiones o puntos
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    // Función para calcular la hora de llegada a partir de los minutos
    const calcularHora = (minutos: number): string => {
        const ahora = new Date();
        const horaLlegada = new Date(ahora.getTime() + minutos * 60000);
        return horaLlegada.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    // Función para transformar el XML en la tarjeta de parada
    const appendStop = (xmlData: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
        const denominacionParada =
            xmlDoc.getElementsByTagName('DenominacionParada')[0]?.textContent || '';

        if (denominacionParada === '') {
            return null;
        }

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
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent pullingText="Desliza para refrescar" />
            </IonRefresher>

            {loading && <Loader serviceName="Bizkaibus" reloading={reloading} />}
            {error && (
                <div className="error-container">
                    <IonText color="danger">
                        <h4>{error}</h4>
                    </IonText>
                </div>
            )}
            {!loading &&
                !error &&
                stopData.length > 0 &&
                stopData.map((data, index) => (
                    <React.Fragment key={index}>{appendStop(data)}</React.Fragment>
                ))}
        </div>
    );
};

export default StopsDisplay;
