import React, {useState} from 'react';
import {IonRefresher, IonRefresherContent, IonText, useIonViewWillEnter,} from '@ionic/react';
import {useTranslation} from "react-i18next";
import {RenfeStorage} from "../../../services/Renfe/RenfeStorage";
import {ApiRenfe} from "../../../services/Renfe/ApiRenfe";
import {Platforms} from "../../../services/Renfe/Platforms";
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

    const fetchData = async (isBackground = false) => {
        if (!navigator.onLine) {
            setError(t('No tienes conexión a internet'));
            setLoading(false);
            return;
        }

        try {
            if (!isBackground) {
                setLoading(true);
            }
            const displays = await storageService.getSavedDisplays();
            const api = new ApiRenfe();
            const data = await api.getPlatformsForDisplays(displays);
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
        await fetchData(true);
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
