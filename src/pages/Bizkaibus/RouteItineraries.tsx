import React, { useEffect, useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { listOutline, mapOutline, swapHorizontalOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Page from '../Page';
import Map from '../../components/Bizkaibus/Map/Map';
import { Parada } from '../../services/BizkaibusStorage';
import { getItinerary, Itinerary } from '../../services/Bizkaibus/Itinerary';
import LineHeader from '../../components/Bizkaibus/LineHeader/LineHeader';

const RouteItineraries: React.FC = () => {
    const { t } = useTranslation();
    const { line, route } = useParams<{ line: string; route: string }>();
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [isMapView, setIsMapView] = useState<boolean>(true);
    const [direction, setDirection] = useState<'I' | 'V'>('I');

    useEffect(() => {
        const fetchItinerary = async () => {
            if (line && route) {
                const fetchedItinerary = await getItinerary(line, route, direction);
                if (fetchedItinerary) {
                    setItinerary(fetchedItinerary);
                }
            }
        };
        fetchItinerary();
    }, [line, route, direction]);

    const handleToggleStop = (stop: Parada) => {
        // Aquí puedes manejar el cambio de estado de las paradas favoritas
    };

    return (
        <Page title={t('Itinerario de la ruta')} icon={mapOutline} internalPage={true}>
            {itinerary ? (
                <>
                    <LineHeader line={itinerary.Line} lineName={itinerary.Name} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <IonButton color="primary" onClick={() => setIsMapView(!isMapView)}>
                            <IonIcon icon={isMapView ? listOutline : mapOutline} slot="start" />
                            {isMapView ? t('Ver como lista') : t('Ver como mapa')}
                        </IonButton>
                        <IonButton color="secondary" onClick={() => setDirection(direction === 'I' ? 'V' : 'I')}>
                            <IonIcon icon={swapHorizontalOutline} slot="start" />
                            {direction === 'I' ? t('Cambiar a vuelta') : t('Cambiar a ida')}
                        </IonButton>
                    </div>

                    {isMapView ? (
                        <div>
                            <h1>{t('Mapa de Paradas')}</h1>
                            <Map paradas={itinerary.Stops} onToggleFavorite={handleToggleStop} />
                        </div>
                    ) : (
                        <>
                            <h1>{t('Listado de Paradas')}</h1>
                            {itinerary.Stops.map((stop, index) => (
                                <IonItem key={index}>
                                    <IonLabel>
                                        <h3>{stop.PARADA} - {stop.DENOMINACION}</h3>
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </>
                    )}
                </>
            ) : (
                <p>{t('Cargando itinerario...')}</p>
            )}
        </Page>
    );
};

export default RouteItineraries;
