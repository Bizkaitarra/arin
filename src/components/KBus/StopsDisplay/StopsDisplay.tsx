import React, {useState} from 'react';
import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonRefresher,
    IonRefresherContent,
    IonText,
    useIonViewWillEnter,
} from '@ionic/react';
import './StopsDisplay.css';
import {setIntervalBizkaibus} from '../../../services/IntervalServices';
import Loader from '../../Loader';
import {useTranslation} from "react-i18next";
import {fetchStopsData} from "../../../services/KBus/ApiKBus";
import {KBusStorage} from "../../../services/KBus/KBusStorage";
import {KBusStop} from "../../../services/KBus/KbusStop";
import {KBusArrivalResponse} from "../../../services/KBus/KBusArrivalResponse";
import BusCard from "../BusCard/BusCard";

const StopsDisplay: React.FC = () => {
    const { t } = useTranslation();
    const [stopData, setStopData] = useState<KBusArrivalResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloading, setReloading] = useState<boolean>(true);
    const storageService = new KBusStorage();

    const fetchData = async () => {
        try {
            setLoading(true);
            const stops: KBusStop[] = storageService.getStations(true).filter(station => station.isFavorite) as KBusStop[]
            const data = await fetchStopsData(stops);
            setStopData(data);
            setLoading(false);
            setError(null);
        } catch (err) {
            console.log(err);
            setError(
                err.message
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


    const renderStopCard = (response: KBusArrivalResponse) => {

        return (
            <IonCard className="stop-card">
                <IonCardHeader className="stop-card-header">
                    <IonCardTitle>{response.stop.customName}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <div className="bus-cards-container">
                        {response.arrivals && response.arrivals.length > 0 ? (
                            response.arrivals.map((arrival, index) => (
                                <BusCard arrival={arrival} index={index} />
                            ))
                        ) : (
                            <p>{t('No hay ningún autobús')}</p>
                        )}
                    </div>
                </IonCardContent>
            </IonCard>
        );

    };


    return (
        <div className="stops-display">
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent pullingText="{t('Desliza para refrescar')}" />
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
                    <React.Fragment key={index}>{renderStopCard(data)}</React.Fragment>
                ))}
        </div>
    );
};

export default StopsDisplay;
