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
import {BusArrivalResponse, fetchStopsData} from '../../../services/ApiBizkaibus';
import './StopsDisplay.css';
import {getStations} from '../../../services/BizkaibusStorage';
import {setIntervalBizkaibus} from '../../../services/IntervalServices';
import Loader from '../../Loader';
import BusCard from "../BusCard/BusCard";
import {useTranslation} from "react-i18next";

const StopsDisplay: React.FC = () => {
    const { t } = useTranslation();
    const [stopData, setStopData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloading, setReloading] = useState<boolean>(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await fetchStopsData(getStations(true).filter(station => station.IS_FAVORITE));
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


    const renderStopCard = (response: BusArrivalResponse) => {
        if (response.status === "ERROR") {
            return (
                <IonCard>
                    <IonCardContent>
                        {t("error_bizkaibus", { parada: response.parada.PARADA, denominacion: response.parada.DENOMINACION })}
                    </IonCardContent>
                </IonCard>
            );
        }
        if (response.status === "NOINFO") {
            return (
                <IonCard>
                    <IonCardContent>
                        {t("no_info_bizkaibus", { parada: response.parada.PARADA, denominacion: response.parada.DENOMINACION })}
                    </IonCardContent>
                </IonCard>
            );
        }


        if (!response.data) return null;

        const stopData = response.data;


        return (
            <IonCard className="stop-card">
                <IonCardHeader className="stop-card-header">
                    <IonCardTitle>{stopData.parada.PARADA}-{stopData.parada.DENOMINACION}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <div className="bus-cards-container">
                        {stopData.arrivals && stopData.arrivals.length > 0 ? (
                            stopData.arrivals.map((arrival, index) => (
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
