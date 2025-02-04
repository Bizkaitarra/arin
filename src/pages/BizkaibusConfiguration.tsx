import React, { useState, useEffect, useRef } from 'react';
import {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonReorder,
    IonReorderGroup,
    useIonToast,
    IonIcon
} from '@ionic/react';
import {addCircle, settingsOutline, trashBinOutline, reorderThreeOutline, addCircleOutline} from 'ionicons/icons';
import { loadStops } from "../services/ApiBizkaibus";
import {getSavedStations, Parada, saveStationIds} from "../services/BizkaibusStorage";

const BizkaibusConfiguration: React.FC = () => {
    const [province, setProvince] = useState<string>('48');
    const [town, setTown] = useState<string>('');
    const [stopName, setStopName] = useState<string>('');
    const [stations, setStations] = useState<Parada[]>([]);
    const [filteredStations, setFilteredStations] = useState<Parada[]>([]);
    const [selectedStops, setSelectedStops] = useState<Parada[]>([]);
    const [presentToast] = useIonToast();

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const estaciones = await loadStops();
                setStations(estaciones);
            } catch (error) {
                console.error("Error al cargar las estaciones:", error);
            }
        };

        fetchStations();
    }, []);

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
        let results = stations.filter(station =>
            (!province || station.PROVINCIA === province) &&
            (!town || station.DESCRIPCION_MUNICIPIO === town) &&
            (!stopName || station.DENOMINACION.toLowerCase().includes(stopName.toLowerCase())) &&
            (!selectedStops.some(selected => selected.PARADA === station.PARADA))
        );
        setFilteredStations(results);
    }, [province, town, stopName, stations, selectedStops]);

    const handleAddStop = (stop: Parada) => {
        if (!selectedStops.some(s => s.PARADA === stop.PARADA)) {
            setSelectedStops([...selectedStops, stop]);
        } else {
            presentToast({ message: 'La parada ya está seleccionada', duration: 2000 });
        }
    };

    const handleRemoveStop = (id: string) => {
        const stops = selectedStops.filter(stop => stop.PARADA !== id);
        if (stops.length === 0) {
            saveStationIds([]);
        }
        setSelectedStops(stops);
    };

    const handleReorder = (event: CustomEvent) => {
        const fromIndex = event.detail.from;
        const toIndex = event.detail.to;
        const reorderedList = [...selectedStops];
        const [movedItem] = reorderedList.splice(fromIndex, 1);
        reorderedList.splice(toIndex, 0, movedItem);
        setSelectedStops(reorderedList);
        event.detail.complete();
    };



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle><IonIcon icon={settingsOutline} /> Configurar Bizkaibus</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {selectedStops.length > 0 && (
                    <>
                    <h2>Paradas Seleccionadas</h2>
                <p>Ordena las paradas seleccionadas y elimina las que no desees seguir viendo</p>
                <IonList>
                    <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
                        {selectedStops.map((stop) => (
                            <IonItem key={stop.PARADA}>
                                <IonLabel>
                                    <h3>{stop.PARADA} - {stop.DENOMINACION}</h3>
                                    <p>{stop.DESCRIPCION_MUNICIPIO}, {stop.DESCRIPCION_PROVINCIA}</p>
                                </IonLabel>
                                <IonButton fill="clear" slot="end" color="danger" onClick={() => handleRemoveStop(stop.PARADA)}>
                                    <IonIcon icon={trashBinOutline} />
                                </IonButton>
                                <IonReorder slot="end">
                                    <IonIcon icon={reorderThreeOutline} />
                                </IonReorder>
                            </IonItem>
                        ))}
                    </IonReorderGroup>
                </IonList>
                    </>
                )}
                <h2>Buscador de Paradas</h2>
                <p>Filtra las paradas para poder encontrar las paradas que quieras añadir</p>
                <IonItem>
                    <IonLabel position="stacked">Provincia</IonLabel>
                    <IonSelect value={province} onIonChange={(e) => setProvince(e.detail.value)}>
                        {[...new Set(stations.map(s => s.PROVINCIA))].map(prov => (
                            <IonSelectOption key={prov} value={prov}>{stations.find(s => s.PROVINCIA === prov)?.DESCRIPCION_PROVINCIA}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Municipio</IonLabel>
                    <IonSelect value={town} onIonChange={(e) => setTown(e.detail.value)}>
                        {[...new Set(stations.filter(s => s.PROVINCIA === province).map(s => s.DESCRIPCION_MUNICIPIO))].map(mun => (
                            <IonSelectOption key={mun} value={mun}>{mun}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Nombre de la parada</IonLabel>
                    <IonInput value={stopName} onIonInput={(e: any) => setStopName(e.target.value)} />
                </IonItem>
                <h3>Paradas filtradas</h3>
                <p>Añade las paradas deseadas con el botón +</p>
                    {filteredStations.map(station => (
                        <IonItem key={station.PARADA}>
                            <IonLabel>
                                <h3>{station.PARADA} - {station.DENOMINACION}</h3>
                                <p>{station.DESCRIPCION_MUNICIPIO}, {station.DESCRIPCION_PROVINCIA}</p>
                            </IonLabel>
                            <IonButton fill="clear" slot="end" color="tertiary" onClick={() => handleAddStop(station)}>
                                <IonIcon icon={addCircleOutline} />
                            </IonButton>
                        </IonItem>

                    ))}
            </IonContent>
        </IonPage>
    );
};

export default BizkaibusConfiguration;
