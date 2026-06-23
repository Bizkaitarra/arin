import React, {useState} from 'react';
import {IonRefresher, IonRefresherContent, IonText, useIonViewWillEnter,} from '@ionic/react';
import {getEuskotrenDisplaysTrains} from '../../services/Euskotren/ApiEuskotren';
import './EuskotrenDisplay.css';
import {setIntervalEuskotren} from '../../services/IntervalServices';
import Loader from '../Loader';
import {getSavedDisplays, EuskotrenStopTrains} from "../../services/Euskotren/EuskotrenStorage";
import {useTranslation} from "react-i18next";
import {useConfiguration} from "../../context/ConfigurationContext";
import EuskotrenStationCard from "./EuskotrenStationCard";
import ErrorDisplay from "../ErrorDisplay/ErrorDisplay";
import paradasEuskotren from "../../data/paradas_euskotren.json";
import {Display} from "../../services/Euskotren/Display";

const EuskotrenDisplay: React.FC = () => {
    const {t} = useTranslation();
    const [euskotrenData, setEuskotrenData] = useState<EuskotrenStopTrains[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloading, setReloading] = useState<boolean>(true);
    const { settings } = useConfiguration(); // Accede a los valores del contexto

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
            const displays = getSavedDisplays();
            console.log('Euskotren displays from storage', displays);
            const data = await getEuskotrenDisplaysTrains(displays, settings.maxTrenes);
            console.log('Euskotren data from API', data);
            setEuskotrenData(data);
            setLoading(false);
            setError(null);
        } catch (err) {
            console.error('Error fetching Euskotren data', err);
            setError(t('Error al conectar con Euskotren'));
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
        // Utilizamos el intervalo específico para Euskotren
        setIntervalEuskotren(reloadData, settings.refreshRate);
    });

    const handleRefresh = async (event: CustomEvent) => {
        await reloadData();
        event.detail.complete();
    };

    return (
        <div className="euskotren-display">
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent pullingText={t("Desliza hacia abajo para refrescar")}/>
            </IonRefresher>

            {loading && (
                <Loader serviceName={"Euskotren"} reloading={reloading}/>
            )}
            {error && <ErrorDisplay message={error} />}
            {!loading &&
                !error &&
                euskotrenData.length > 0 &&
                euskotrenData.map((data, index) => (
                    <EuskotrenStationCard key={data.Display.destination ? `${data.Display.origin.Code}-${data.Display.destination.Code}` : data.Display.origin.Code} stationData={data} />
                ))}
        </div>
    );
};

export default EuskotrenDisplay;
