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

interface Parada {
    Code: string;
    Name: string;
    Lines: string;
}

interface MetroBilbaoSelectedStopsListProps {
    stations: Parada[]; // Todas las estaciones disponibles
}

const STORAGE_KEY = 'metro_bilbao_selected_stops';

const MetroBilbaoSelectedStopsList = forwardRef(
    ({ stations }: MetroBilbaoSelectedStopsListProps, ref) => {
        const [selectedStops, setSelectedStops] = useState<Parada[]>([]);

        // Cargar paradas seleccionadas desde localStorage al iniciar
        useEffect(() => {
            const savedStops = localStorage.getItem(STORAGE_KEY);
            if (savedStops) {
                try {
                    const stopIds: string[] = JSON.parse(savedStops);
                    // Cargar las paradas en el mismo orden que estaban en localStorage
                    const stops = stopIds
                        .map((stopId) => stations.find((station) => station.Code === stopId))
                        .filter(Boolean) as Parada[];
                    setSelectedStops(stops);
                } catch (error) {
                    console.error('Error al cargar paradas desde localStorage:', error);
                }
            }
        }, [stations]);  // Dependencia en `stations` para recargar las estaciones si cambian

        // Guardar las paradas seleccionadas en localStorage cada vez que cambien
        useEffect(() => {
            if (selectedStops.length > 0) {
                // Guardamos solo las IDs de las paradas, pero en el orden actual
                const stopIds = selectedStops.map((stop) => stop.Code);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(stopIds));
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
            setSelectedStops(selectedStops.filter((stop) => stop.Code !== id));
        };

        // Permitir agregar una parada desde el componente padre
        useImperativeHandle(ref, () => ({
            addStop(newStop: Parada) {
                if (selectedStops.some((stop) => stop.Code === newStop.Code)) {
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
                            <IonItem key={stop.Code}>
                                <IonLabel>
                                    <h3>{stop.Code} - {stop.Name}</h3>
                                    <p>
                                        {stop.Lines}
                                    </p>
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
            </div>
        );
    }
);

export default MetroBilbaoSelectedStopsList;
