import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonGrid,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    useIonToast,
    useIonViewWillEnter,
} from '@ionic/react';
import {addCircleOutline, settingsOutline} from 'ionicons/icons';
import {loadStops} from '../../services/ApiMetroBilbao';
import Page from "../Page";

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
        if (stations.length > 0) {
            getSavedStations();
        }
    }, [stations]);

    useEffect(() => {
        console.log('filtrando estaciones');
        if (stations.length > 0) {
            filterStations();
        }
    }, [selectedStops, stopName, stations]);

    const filterStations = () => {
        let results = stations.filter(station =>
            (station.Name.toLowerCase().includes(stopName.toLowerCase())) &&
            (!selectedStops.some(selected => selected.Code === station.Code))
        );
        setFilteredStations(results);
        if (selectedStops.length > 0) {
            const stopIds = selectedStops.map((stop) => stop.Code);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stopIds));
        }
    }

    const handleAddStop = (newStop: Parada) => {
        if (selectedStops.some((stop) => stop.Code === newStop.Code)) {
            console.warn('La parada ya está en la lista seleccionada.');
            return;
        }
        setSelectedStops([...selectedStops, newStop]);
        presentToast({
            message: `Parada "${newStop.Name}" añadida`,
            duration: 2000,
            color: 'success'
        });
    };

    return (
        <Page title="Añadir paradas de Metro Bilbao" icon={settingsOutline}>
            <h2>Añadir Paradas</h2>
            <p>Añade las paradas deseadas con el botón +</p>
            <IonItem>
                <IonLabel position="stacked">Nombre de la parada</IonLabel>
                <IonInput
                    value={stopName}
                    placeholder="Escribe para filtrar"
                    onIonInput={(e) => setStopName(e.detail.value!)}
                />
            </IonItem>

            <IonGrid>
                {filteredStations.map((stop) => (
                    <IonItem key={stop.Code}>
                        <IonLabel>
                            <h3>{stop.Code} - {stop.Name}</h3>
                            <p>{stop.Lines}</p>
                        </IonLabel>
                        <IonButton fill="clear" size="large" slot="end" color="tertiary" onClick={() => handleAddStop(stop)}>
                            <IonIcon icon={addCircleOutline}/>
                        </IonButton>
                    </IonItem>
                ))}
            </IonGrid>
        </Page>
    );
};

export default MetroBilbaoConfiguration;
