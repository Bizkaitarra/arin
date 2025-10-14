import React, {useState} from 'react';
import {
    IonRefresher,
    IonRefresherContent,
    IonText,
    useIonViewWillEnter,
} from '@ionic/react';
import {setIntervalBizkaibus} from '../../../services/IntervalServices';
import Loader from '../../Loader';
import {useTranslation} from "react-i18next";
import {fetchStopsData} from "../../../services/KBus/ApiKBus";
import {KBusStorage} from "../../../services/KBus/KBusStorage";
import {KBusStop} from "../../../services/KBus/KbusStop";
import {KBusArrivalResponse} from "../../../services/KBus/KBusArrivalResponse";
import KBusStopCard from "../KBusStopCard/KBusStopCard";
import ErrorDisplay from "../../ErrorDisplay/ErrorDisplay";

const StopsDisplay: React.FC = () => {
    const { t } = useTranslation();
    const [stopData, setStopData] = useState<KBusArrivalResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloading, setReloading] = useState<boolean>(true);
    const storageService = new KBusStorage();

    const fetchData = async () => {
        if (!navigator.onLine) {
            setError(t('No tienes conexión a internet'));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const stops: KBusStop[] = storageService.getStations(true).filter(station => station.isFavorite) as KBusStop[]
            const data = await fetchStopsData(stops);
            setStopData(data);
            setLoading(false);
            setError(null);
        } catch (err) {
            console.log(err);
            setError(t('Error al conectar con KBus'));
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

    return (
        <div className="stops-display">
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent pullingText="{t('Desliza para refrescar')}" />
            </IonRefresher>

            {loading && <Loader serviceName="KBus" reloading={reloading} />}
            {error && <ErrorDisplay message={error} />}
            {!loading &&
                !error &&
                stopData.length > 0 &&
                stopData.map((data, index) => (
                    <KBusStopCard key={index} response={data} />
                ))}
        </div>
    );
};

export default StopsDisplay;
