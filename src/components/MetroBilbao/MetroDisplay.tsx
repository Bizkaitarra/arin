import React, {useEffect, useState} from 'react';
import {
    IonBadge, IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle, IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonText,
    useIonViewWillEnter,
} from '@ionic/react';
import {getMetroStopsTrains} from '../../services/ApiMetroBilbao';
import './MetroDisplay.css';
import {setIntervalMetroBilbao} from '../../services/IntervalServices';
import Loader from '../Loader';
import {ellipsisVertical} from "ionicons/icons";
import {getMetroStops, MetroStopTrains, MetroTrain} from "../../services/MetroBilbaoStorage";
import {useTranslation} from "react-i18next";
import {useConfiguration} from "../../context/ConfigurationContext";


const MetroDisplay: React.FC = () => {
    const {t} = useTranslation();
    const [metroData, setMetroData] = useState<MetroStopTrains[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloading, setReloading] = useState<boolean>(true);
    const { settings } = useConfiguration(); // Accede a los valores del contexto



    // Función para obtener los datos de las estaciones de metro
    const fetchData = async () => {
        try {
            setLoading(true);
            const favoriteStops = getMetroStops(true).filter(parada => parada.IsFavorite);
            const data = await getMetroStopsTrains(favoriteStops, settings.maxTrenes); // Llamada a la API del Metro
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

    function getPlatformTitle(stationData: MetroStopTrains, platform: MetroTrain[]): string {
        const hasTrainToEtxebarriOrBasauri = platform.some(
            (train) => train.Direction === 'Etxebarri' || train.Direction === 'Basauri'
        );
        const hasL1 = stationData.Station.Lines.includes('L1');
        const hasL2 = stationData.Station.Lines.includes('L2');

        if (hasTrainToEtxebarriOrBasauri) {
            if (hasL1 && hasL2) {
                return 'Etxebarri/Basauri';
            } else if (hasL1) {
                return 'Etxebarri';
            } else if (hasL2) {
                return 'Basauri';
            }
        } else {
            if (hasL1 && hasL2) {
                return 'Kabiezes/Plentzia';
            } else if (hasL1) {
                return 'Plentzia';
            } else if (hasL2) {
                return 'Kabiezes';
            }
        }

        return ''; // En caso de que no haya líneas (caso extremo)
    }


    // Generar las tarjetas de los trenes para cada plataforma
    const generateTrainCards = (stationData: MetroStopTrains) => {
        if (stationData.Platform1.length === 0 && stationData.Platform2.length === 0) {
            return (
                <div className="no-data">
                    <p>{t('No hay trenes en la estación en este momento')}</p>
                </div>
            );
        }
        const plataforms = [stationData.Platform1, stationData.Platform2];

        return plataforms.map((platform: any, platformIndex: number) => {
            if (platform.length === 0) {
                return null;
            }
            const platformTitle = getPlatformTitle(stationData, platform);


            return (
                <IonCard key={platformIndex} className="bus-card">
                    <IonCardHeader>
                        <div className="ion-justify-content-between ion-align-items-center" style={{display: 'flex'}}>
                            <IonCardTitle>
                                {platformTitle}
                            </IonCardTitle>

                        </div>
                    </IonCardHeader>
                    <IonList>
                        {platform.map((train: MetroTrain, trainIndex: number) => {
                            const destination = train.Direction || 'N/A';

                            const minutes = train.Estimated;
                            const nextArrival = train.Time || 'N/A';

                            return (
                                <IonItem key={`${platformIndex}-${trainIndex}`} className="train-card">
                                    <IonLabel>{`${destination}`}</IonLabel>
                                    <IonBadge color={minutes < 1 ? 'danger' : 'success'}>
                                        {minutes < 0 ? 0 : minutes} min ({new Date(nextArrival).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })})
                                        {settings.verNumeroVagones && (
                                            train.Wagons === 4 || train.Wagons === 5
                                                ? ` ${train.Wagons} ` + t('vagones')
                                                : '4 ' + t('vagones')
                                        )}
                                    </IonBadge>
                                </IonItem>
                            );
                        })}
                    </IonList>
                </IonCard>
            );
        });
    };

    // Crear la tarjeta de la estación de metro
    const appendStation = (stationData: MetroStopTrains) => {
        const denominacionEstacion = stationData.Station.Name;

        return (
            <IonCard className="stop-card">
                <IonCardHeader className="station-card-header">
                    <IonCardTitle>{denominacionEstacion} - {stationData.Station.Lines.join(',')}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <div className="bus-cards-container">
                        {generateTrainCards(stationData)}
                    </div>
                </IonCardContent>
            </IonCard>
        );
    };

    return (
        <div className="metro-display">
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent pullingText={t("Desliza hacia abajo para refrescar")}/>
            </IonRefresher>

            {loading && (
                <Loader serviceName={"Metro Bilbao"} reloading={reloading}/>
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
