import React, { useEffect, useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, useIonToast, useIonViewWillEnter } from '@ionic/react';
import { addCircleOutline, mapOutline, listOutline, settingsOutline } from 'ionicons/icons';
import { loadStops } from "../../services/ApiBizkaibus";
import {getSavedStations, Municipio, Parada, saveStationIds} from "../../services/BizkaibusStorage";
import Page from "../Page";
import MapComponent from "../../components/Bizkaibus/MapComponent";
import AcordeonDeParadas from "../../components/Bizkaibus/AcordeonDeParadas";

const BizkaibusConfiguration: React.FC = () => {
    const [town, setTown] = useState<Municipio | null>(null);
    const [stations, setStations] = useState<Parada[]>([]);
    const [filteredStations, setFilteredStations] = useState<Parada[]>([]);
    const [selectedStops, setSelectedStops] = useState<Parada[]>([]);
    const [isMapView, setIsMapView] = useState<boolean>(true);
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
    }, [town, stations, selectedStops]);

    const loadFilteredStations = () => {
        let results = stations.filter(station =>
            (!town ||
                (station.MUNICIPIO === town.MUNICIPIO && station.PROVINCIA === town.PROVINCIA))
        );
        setFilteredStations(results);
    };


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

    const handleTownSelect = (selectedTown: Municipio) => {
        setTown(selectedTown);
    };

    const clearTownSelection = () => {
        setTown(null);
    };

    return (
        <Page title="Configurar Bizkaibus" icon={settingsOutline}>
            <div>
                {!town ? (
                    <AcordeonDeParadas paradas={stations} onMunicipioClick={handleTownSelect} />
                ) : (
                    <p>
                        <strong>Pueblo seleccionado:</strong> {town.DESCRIPCION_PROVINCIA}{' '}{town.DESCRIPCION_MUNICIPIO}
                        <IonButton fill="clear" color="danger" onClick={clearTownSelection}>
                            Deseleccionar
                        </IonButton>
                    </p>
                )}
            </div>

            {town && (
                <>
                    <IonButton
                        expand="full"
                        color="primary"
                        onClick={() => setIsMapView(!isMapView)}
                    >
                        <IonIcon icon={isMapView ? listOutline : mapOutline} slot="start" />
                        {isMapView ? 'Ver como lista' : 'Ver como mapa'}
                    </IonButton>

                    {isMapView ? (
                        <div>
                            <h1>Mapa de Paradas</h1>
                            <MapComponent paradas={filteredStations} />
                        </div>
                    ) : (
                        <>
                            <p><strong>Paradas filtradas</strong></p>
                            {filteredStations.map(station => (
                                <IonItem key={station.PARADA}>
                                    <IonLabel>
                                        <h3>{station.PARADA} - {station.DENOMINACION}</h3>
                                        <p>{station.DESCRIPCION_MUNICIPIO}, {station.DESCRIPCION_PROVINCIA}</p>
                                    </IonLabel>
                                    <IonButton
                                        className="stop-add"
                                        size="large"
                                        fill="clear"
                                        slot="end"
                                        color="tertiary"
                                        onClick={() => handleAddStop(station)}
                                    >
                                        <IonIcon icon={addCircleOutline} />
                                    </IonButton>
                                </IonItem>
                            ))}
                        </>
                    )}
                </>
            )}
        </Page>
    );
};

export default BizkaibusConfiguration;
