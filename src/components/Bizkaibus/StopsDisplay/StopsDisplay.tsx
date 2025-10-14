import React, {useState} from 'react';
import {
    IonRefresher,
    IonRefresherContent,
    IonText,
    useIonViewWillEnter,
} from '@ionic/react';
import {BusArrivalResponse, fetchStopsData} from '../../../services/ApiBizkaibus';
import {getStations} from '../../../services/BizkaibusStorage';
import {setIntervalBizkaibus} from '../../../services/IntervalServices';
import Loader from '../../Loader';
import {useTranslation} from "react-i18next";
import BusStopCard from "../BusStopCard/BusStopCard";
import ErrorDisplay from "../../ErrorDisplay/ErrorDisplay";

const StopsDisplay: React.FC = () => {
    const { t } = useTranslation();
    const [stopData, setStopData] = useState<BusArrivalResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloading, setReloading] = useState<boolean>(true);

    const fetchData = async () => {
        if (!navigator.onLine) {
            setError(t('No tienes conexión a internet'));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await fetchStopsData(getStations(true).filter(station => station.IS_FAVORITE));
            setStopData(data);
            setLoading(false);
            setError(null);
        } catch (err) {
            setError(t('Error al conectar con Bizkaibus'));
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

            {loading && <Loader serviceName="Bizkaibus" reloading={reloading} />}
            {error && <ErrorDisplay message={error} />}
            {!loading &&
                !error &&
                stopData.length > 0 &&
                stopData.map((data, index) => (
                    <BusStopCard key={index} response={data} />
                ))}
        </div>
    );
};

export default StopsDisplay;
