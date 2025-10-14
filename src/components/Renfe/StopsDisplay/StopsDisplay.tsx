import React, {useState} from 'react';
import {IonRefresher, IonRefresherContent, IonText, useIonViewWillEnter,} from '@ionic/react';
import {useTranslation} from "react-i18next";
import {RenfeStorage} from "../../../services/Renfe/RenfeStorage";
import {getPlatformsForDisplays, Platforms} from "../../../services/Renfe/ApiRenfe";
import {setIntervalRenfe} from "../../../services/IntervalServices";
import Loader from "../../Loader";
import RenfeStationCard from "../RenfeStationCard/RenfeStationCard";
import './RenfeDisplay.css';
import ErrorDisplay from "../../ErrorDisplay/ErrorDisplay";
import {useConfiguration} from "../../../context/ConfigurationContext";


const StopDisplay: React.FC = () => {
    const {t} = useTranslation();
    const { settings } = useConfiguration();
    const [renfeData, setRenfeData] = useState<Platforms[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloading, setReloading] = useState<boolean>(true);
    const storageService = new RenfeStorage();

    const fetchData = async () => {
        if (!navigator.onLine) {
            setError(t('No tienes conexión a internet'));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const displays = await storageService.getSavedDisplays();
            const data = await getPlatformsForDisplays(displays);
            console.log(data);
            setRenfeData(data);
            setLoading(false);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(t('Error al conectar con Renfe'));
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
        setIntervalRenfe(reloadData, settings.refreshRate);
    });

    const handleRefresh = async (event: CustomEvent) => {
        await reloadData();
        event.detail.complete();
    };

    return (
        <div className="renfe-display">
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent pullingText={t("Desliza hacia abajo para refrescar")}/>
            </IonRefresher>

            {loading && (
                <Loader serviceName={"Renfe"} reloading={reloading}/>
            )}
            {error && <ErrorDisplay message={error} />}
            {!loading &&
                !error &&
                renfeData.length > 0 &&
                renfeData.map((data, index) => (
                    <RenfeStationCard key={`${data.origin.id}-${data.destiny.id}`} stationData={data} />
                ))}
        </div>
    );
};

export default StopDisplay;
