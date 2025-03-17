import React, {useState} from 'react';
import {IonRefresher, IonRefresherContent, IonText, useIonViewWillEnter,} from '@ionic/react';
import {getMetroDisplaysTrains} from '../../services/ApiMetroBilbao';
import './MetroDisplay.css';
import {setIntervalMetroBilbao} from '../../services/IntervalServices';
import Loader from '../Loader';
import {getSavedDisplays, MetroStopTrains} from "../../services/MetroBilbaoStorage";
import {useTranslation} from "react-i18next";
import {useConfiguration} from "../../context/ConfigurationContext";
import MetroStationCard from "./MetroStationCard";


const MetroDisplay: React.FC = () => {
    const {t} = useTranslation();
    const [metroData, setMetroData] = useState<MetroStopTrains[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloading, setReloading] = useState<boolean>(true);
    const { settings } = useConfiguration(); // Accede a los valores del contexto

    const fetchData = async () => {
        try {
            setLoading(true);
            const displays = getSavedDisplays();
            const data = await getMetroDisplaysTrains(displays, settings.maxTrenes);
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
                    <MetroStationCard key={index} stationData={data} />
                ))}
        </div>
    );
};

export default MetroDisplay;
