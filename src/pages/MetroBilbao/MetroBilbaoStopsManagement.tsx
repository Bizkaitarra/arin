import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonGrid,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonReorder,
    IonReorderGroup, IonText, useIonToast, useIonViewWillEnter,
} from '@ionic/react';
import {addCircleOutline, reorderThreeOutline, settingsOutline, trashBinOutline} from 'ionicons/icons';
import {loadStops} from '../../services/ApiMetroBilbao';
import {ItemReorderEventDetail} from '@ionic/core';
import Page from "../Page";
import {useHistory} from "react-router-dom";

interface Parada {
    Code: string;
    Name: string;
    Lines: string;
}

const STORAGE_KEY = 'metro_bilbao_selected_stops';

const MetroBilbaoStopsManagement: React.FC = () => {
    const [stations, setStations] = useState<Parada[]>([]);
    const [selectedStops, setSelectedStops] = useState<Parada[]>([]);
    const history = useHistory();
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
        getSavedStations();
    }, [stations]);

    const getSavedStations = () => {
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
    }

    useEffect(() => {
        if (selectedStops.length > 0) {
            const stopIds = selectedStops.map((stop) => stop.Code);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stopIds));
        }
    }, [selectedStops]);


    const handleRemoveStop = (id: string) => {
        const stops = selectedStops.filter((stop) => stop.Code !== id);
        if (stops.length === 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        }
        setSelectedStops(stops);
        presentToast({
            message: `Parada eliminada`,
            duration: 2000,
            color: 'success'
        });
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
        <Page title="Gestionar mis paradas Metro Bilbao" icon={settingsOutline}>
            {selectedStops.length > 0 ? (
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
                                        size="large"
                                        fill="clear"
                                        slot="end"
                                        color="danger"
                                        onClick={() => handleRemoveStop(stop.Code)}
                                    >
                                        <IonIcon icon={trashBinOutline}/>
                                    </IonButton>
                                    <IonReorder  slot="start">
                                        <IonIcon size="large" icon={reorderThreeOutline}/>
                                    </IonReorder>
                                </IonItem>
                            ))}
                        </IonReorderGroup>
                    </IonList>
                </>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <IonText>
                        <h2>No tienes paradas favoritas configuradas</h2>
                        <p>Para poder ver tus paradas favoritas, debes configurarlas en la página de configuración.</p>
                    </IonText>
                    <IonButton color="secondary" onClick={() => history.push(`/configure-metro-bilbao`)}>
                        <IonIcon icon={settingsOutline} /> Configurar paradas
                    </IonButton>
                </div>
            )}
        </Page>
    );
};

export default MetroBilbaoStopsManagement;
