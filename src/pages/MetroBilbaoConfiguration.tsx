import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonPage,
    IonReorder,
    IonReorderGroup,
    IonRow,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import {reorderThreeOutline, trashBinOutline, settingsOutline, addCircleOutline} from 'ionicons/icons';
import { loadStops } from '../services/ApiMetroBilbao';
import { ItemReorderEventDetail } from '@ionic/core';
import {saveStationIds} from "../services/BizkaibusStorage";

interface Parada {
    Code: string;
    Name: string;
    Lines: string;
}

const STORAGE_KEY = 'metro_bilbao_selected_stops';

const MetroBilbaoConfiguration: React.FC = () => {
    const [stopName, setStopName] = useState<string>('');
    const [stations, setStations] = useState<Parada[]>([]);
    const [filteredStations, setFilteredStations] = useState<Parada[]>([]);
    const [selectedStops, setSelectedStops] = useState<Parada[]>([]);

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
        const savedStops = localStorage.getItem(STORAGE_KEY);
        if (savedStops) {
            try {
                const stopIds: string[] = JSON.parse(savedStops);
                const stops = stopIds
                    .map((stopId) => stations.find((station) => station.Code === stopId))
                    .filter(Boolean) as Parada[];
                setSelectedStops(stops);
            } catch (error) {
                console.error('Error al cargar paradas desde localStorage:', error);
            }
        }
    }, [stations]);

    useEffect(() => {
        if (selectedStops.length > 0) {
            const stopIds = selectedStops.map((stop) => stop.Code);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stopIds));
        }
    }, [selectedStops]);

    useEffect(() => {
        let results = stations.filter(station =>
            (station.Name.toLowerCase().includes(stopName.toLowerCase())) &&
            (!selectedStops.some(selected => selected.Code === station.Code))
        );
        setFilteredStations(results);
    }, [stopName, stations, selectedStops]);

    const handleAddStop = (newStop: Parada) => {
        if (selectedStops.some((stop) => stop.Code === newStop.Code)) {
            console.warn('La parada ya está en la lista seleccionada.');
            return;
        }
        setSelectedStops([...selectedStops, newStop]);
    };

    const handleRemoveStop = (id: string) => {
        const stops = selectedStops.filter((stop) => stop.Code !== id);
        if (stops.length === 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        }
        setSelectedStops(stops);
    };

    const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
        const fromIndex = event.detail.from;
        const toIndex = event.detail.to;

        const reorderedList = Array.from(selectedStops);
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
                    <IonTitle><IonIcon icon={settingsOutline} /> Configurar Metro Bilbao</IonTitle>
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
                            <IonItem key={stop.Code}>
                                <IonLabel>
                                    <h3>{stop.Code} - {stop.Name}</h3>
                                    <p>{stop.Lines}</p>
                                </IonLabel>
                                <IonButton
                                    fill="clear"
                                    slot="end"
                                    color="danger"
                                    onClick={() => handleRemoveStop(stop.Code)}
                                >
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
                    <IonLabel position="stacked">Nombre de la parada</IonLabel>
                    <IonInput
                        value={stopName}
                        placeholder="Escribe el nombre de la parada"
                        onIonInput={(e) => setStopName(e.detail.value!)}
                    />
                </IonItem>
                <h3>Paradas filtradas</h3>
                <p>Añade las paradas deseadas con el botón +</p>
                <IonGrid>
                    {filteredStations.map((stop) => (
                        <IonItem key={stop.Code}>
                            <IonLabel>
                                <h3>{stop.Code} - {stop.Name}</h3>
                                <p>{stop.Lines}</p>
                            </IonLabel>
                            <IonButton fill="clear" slot="end" color="tertiary" onClick={() => handleAddStop(stop)}>
                                <IonIcon icon={addCircleOutline} />
                            </IonButton>
                        </IonItem>
                    ))}
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default MetroBilbaoConfiguration;
