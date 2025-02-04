import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import {
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonReorder,
    IonReorderGroup,
} from '@ionic/react';
import { reorderThreeOutline, trashBinOutline } from 'ionicons/icons';
import { ItemReorderEventDetail } from '@ionic/core';
import {getSavedStations, Parada, saveStationIds} from "../services/BizkaibusStorage";



interface BizkaibusSelectedStopsListProps {
    stations: Parada[]; // Todas las estaciones disponibles
}

const BizkaibusSelectedStopsList = forwardRef(
    ({ stations }: BizkaibusSelectedStopsListProps, ref) => {
        const [selectedStops, setSelectedStops] = useState<Parada[]>([]);

        // Cargar paradas seleccionadas desde localStorage al iniciar
        useEffect(() => {
            setSelectedStops(getSavedStations(stations));
        }, [stations]);  // Dependencia en `stations` para recargar las estaciones si cambian

        // Guardar las paradas seleccionadas en localStorage cada vez que cambien
        useEffect(() => {
            if (selectedStops.length > 0) {
                // Guardamos solo las IDs de las paradas, pero en el orden actual
                const stopIds = selectedStops.map((stop) => stop.PARADA);
                saveStationIds(stopIds);
            }
        }, [selectedStops]);  // Cada vez que se actualiza la lista de paradas seleccionadas

        const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
            const fromIndex = event.detail.from;
            const toIndex = event.detail.to;

            const reorderedList = Array.from(selectedStops);
            const [movedItem] = reorderedList.splice(fromIndex, 1);
            reorderedList.splice(toIndex, 0, movedItem);

            setSelectedStops(reorderedList);
            event.detail.complete();
        };

        const handleRemoveStop = (id: string) => {
            setSelectedStops(selectedStops.filter((stop) => stop.PARADA !== id));
        };

        // Permitir agregar una parada desde el componente padre
        useImperativeHandle(ref, () => ({
            addStop(newStop: Parada) {
                if (selectedStops.some((stop) => stop.PARADA === newStop.PARADA)) {
                    console.warn('La parada ya está en la lista seleccionada.');
                    return;
                }
                setSelectedStops([...selectedStops, newStop]);
            },
        }));

        return (
            <div>
                <h2>Paradas Seleccionadas</h2>
                <IonList>
                    <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
                        {selectedStops.map((stop) => (
                            <IonItem key={stop.PARADA}>
                                <IonLabel>
                                    <h3>{stop.PARADA} - {stop.DENOMINACION}</h3>
                                    <p>
                                        {stop.DESCRIPCION_MUNICIPIO}, {stop.DESCRIPCION_PROVINCIA}
                                    </p>
                                </IonLabel>
                                <IonButton
                                    fill="clear"
                                    slot="end"
                                    color="danger"
                                    onClick={() => handleRemoveStop(stop.PARADA)}
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
            </div>
        );
    }
);

export default BizkaibusSelectedStopsList;
