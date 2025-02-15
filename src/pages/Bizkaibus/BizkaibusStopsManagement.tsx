import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonReorder,
    IonReorderGroup, IonText, useIonToast,
    useIonViewWillEnter
} from '@ionic/react';
import {reorderThreeOutline, settingsOutline, trashBinOutline} from 'ionicons/icons';
import {loadStops} from "../../services/ApiBizkaibus";
import {getSavedStations, Parada, saveStationIds} from "../../services/BizkaibusStorage";
import Page from "../Page";
import {useHistory} from "react-router-dom";

const BizkaibusStopsManager: React.FC = () => {
    const [selectedStops, setSelectedStops] = useState<Parada[]>([]);
    const history = useHistory();
    const [presentToast] = useIonToast();

    useIonViewWillEnter(() => {
        console.log('vamos a cargar');
        const fetchStations = async () => {
            try {
                const estaciones = await loadStops();
                // Cargar paradas guardadas solo después de cargar estaciones
                const savedStations = getSavedStations(estaciones);
                setSelectedStops(savedStations);
            } catch (error) {
                console.error("Error al cargar las estaciones:", error);
            }
        };

        fetchStations();
    }, []);

    useEffect(() => {
        if (selectedStops.length > 0) {
            const stopIds = selectedStops.map((stop) => stop.PARADA);
            saveStationIds(stopIds);
        }
    }, [selectedStops]);

    const handleRemoveStop = (id: string) => {
        const stops = selectedStops.filter(stop => stop.PARADA !== id);
        saveStationIds(stops.map(stop => stop.PARADA));
        setSelectedStops(stops);
        presentToast({
            message: `Parada eliminada`,
            duration: 2000,
            color: 'success'
        });
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
        <Page title="Gestionar mis paradas Bizkaibus" icon={settingsOutline}>
            {selectedStops.length > 0 ? (
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
                                    <IonButton fill="clear" slot="end" color="danger" size="large"
                                               onClick={() => handleRemoveStop(stop.PARADA)}>
                                        <IonIcon icon={trashBinOutline}/>
                                    </IonButton>
                                    <IonReorder slot="start">
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
                    <IonButton color="secondary" onClick={() => history.push(`/configure-bizkaibus`)}>
                        <IonIcon icon={settingsOutline} /> Configurar paradas
                    </IonButton>
                </div>
            )}
        </Page>
    );
};

export default BizkaibusStopsManager;
