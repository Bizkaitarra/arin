import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonReorder,
    IonReorderGroup,
    IonSelect,
    IonSelectOption,
    useIonToast, useIonViewWillEnter
} from '@ionic/react';
import {addCircleOutline, reorderThreeOutline, settingsOutline, trashBinOutline} from 'ionicons/icons';
import {loadStops} from "../../services/ApiBizkaibus";
import {getSavedStations, Parada, saveStationIds} from "../../services/BizkaibusStorage";
import Page from "../Page";

const BizkaibusConfiguration: React.FC = () => {
    const [province, setProvince] = useState<string>('48');
    const [town, setTown] = useState<string>('');
    const [stopName, setStopName] = useState<string>('');
    const [stations, setStations] = useState<Parada[]>([]);
    const [filteredStations, setFilteredStations] = useState<Parada[]>([]);
    const [selectedStops, setSelectedStops] = useState<Parada[]>([]);
    const [presentToast] = useIonToast();

    useIonViewWillEnter(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            const estaciones = await loadStops();
            setStations(estaciones);
        } catch (error) {
            console.error("Error al cargar las estaciones:", error);
        }
    };

    useEffect(() => {
        setSelectedStops(getSavedStations(stations));
    }, [stations]);

    useEffect(() => {
        if (selectedStops.length > 0) {
            const stopIds = selectedStops.map((stop) => stop.PARADA);
            saveStationIds(stopIds);
        }
    }, [selectedStops]);

    useEffect(() => {
        loadFilteredStations();
    }, [province, town, stopName, stations, selectedStops]);

    const loadFilteredStations = () => {
        let results = stations.filter(station =>
            (!province || station.PROVINCIA === province) &&
            (!town || station.DESCRIPCION_MUNICIPIO === town) &&
            (!stopName || station.DENOMINACION.toLowerCase().includes(stopName.toLowerCase())) &&
            (!selectedStops.some(selected => selected.PARADA === station.PARADA))
        );
        setFilteredStations(results);
    }

    const handleAddStop = (stop: Parada) => {
        if (!selectedStops.some(s => s.PARADA === stop.PARADA)) {
            setSelectedStops([...selectedStops, stop]);
            presentToast({
                message: `Parada "${stop.PARADA} - ${stop.DENOMINACION}" añadida`,
                duration: 2000,
                color: 'success'
            });
        } else {
            presentToast({
                message: `La parada "${stop.PARADA} - ${stop.DENOMINACION}" ya está seleccionada`,
                duration: 2000,
                color: 'warning'
            });
        }
    };


    return (
        <Page title="Configurar Bizkaibus" icon={settingsOutline}>
            <h2>Buscador de Paradas</h2>
            <p>Añade las paradas deseadas con el botón +</p>
            <IonItem>
                <IonLabel position="stacked">Provincia</IonLabel>
                <IonSelect interface="popover" value={province} onIonChange={(e) => setProvince(e.detail.value)}>
                    {[...new Set(stations.map(s => s.PROVINCIA))].map(prov => (
                        <IonSelectOption key={prov}
                                         value={prov}>{stations.find(s => s.PROVINCIA === prov)?.DESCRIPCION_PROVINCIA}</IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
            <IonItem>
                <IonLabel position="stacked">Municipio</IonLabel>
                <IonSelect interface="popover" value={town} onIonChange={(e) => setTown(e.detail.value)}>
                    {[...new Set(stations.filter(s => s.PROVINCIA === province).map(s => s.DESCRIPCION_MUNICIPIO))].map(mun => (
                        <IonSelectOption key={mun} value={mun}>{mun}</IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
            <IonItem>
                <IonLabel position="stacked">Nombre de la parada</IonLabel>
                <IonInput value={stopName} onIonInput={(e: any) => setStopName(e.target.value)}/>
            </IonItem>
            <p><strong>Paradas filtradas</strong></p>

            {filteredStations.map(station => (
                <IonItem key={station.PARADA}>
                    <IonLabel>
                        <h3>{station.PARADA} - {station.DENOMINACION}</h3>
                        <p>{station.DESCRIPCION_MUNICIPIO}, {station.DESCRIPCION_PROVINCIA}</p>
                    </IonLabel>
                    <IonButton className="stop-add" size="large" fill="clear" slot="end" color="tertiary" onClick={() => handleAddStop(station)}>
                        <IonIcon icon={addCircleOutline}/>
                    </IonButton>
                </IonItem>

            ))}
        </Page>
    );
};

export default BizkaibusConfiguration;
