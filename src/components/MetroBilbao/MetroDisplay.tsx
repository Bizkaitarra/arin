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
import ErrorDisplay from "../ErrorDisplay/ErrorDisplay";
import paradasMetro from "../../data/paradas_metro.json";
import {Display} from "../../services/MetroBilbao/Display";

function isL3Station(stationCode: string): boolean {
    const station = paradasMetro.find(p => p.Code === stationCode);
    return station?.Lines.includes("L3") || false;
}

function isMixedL3Display(display: Display): boolean {
    const originIsL3 = isL3Station(display.origin.Code);
    const destinationIsL3 = display.destination ? isL3Station(display.destination.Code) : false;

    if (!display.destination) { // Single stop
        return originIsL3; // Ignore if it's a single L3 stop
    } else { // Route
        // Ignore if one is L3 and the other is not
        return (originIsL3 && !destinationIsL3) || (!originIsL3 && destinationIsL3);
    }
}

const MetroDisplay: React.FC = () => {
    const {t} = useTranslation();
    const [metroData, setMetroData] = useState<MetroStopTrains[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloading, setReloading] = useState<boolean>(true);
    const { settings } = useConfiguration(); // Accede a los valores del contexto

    const fetchData = async () => {
        if (!navigator.onLine) {
            setError(t('No tienes conexión a internet'));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const displays = getSavedDisplays();
            const data = await getMetroDisplaysTrains(displays, settings.maxTrenes);
            setMetroData(data);
            setLoading(false);
            setError(null);
        } catch (err) {
            setError(t('Error al conectar con Metro Bilbao'));
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
        setIntervalMetroBilbao(reloadData, settings.refreshRate);
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
            {error && <ErrorDisplay message={error} />}
            {!loading &&
                !error &&
                metroData.length > 0 &&
                metroData.map((data, index) => (
                    <MetroStationCard key={data.Display.destination ? `${data.Display.origin.Code}-${data.Display.destination.Code}` : data.Display.origin.Code} stationData={data} />
                ))}
        </div>
    );
};

export default MetroDisplay;
