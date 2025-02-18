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
import Page from "../Page";
import {getMetroStops, MetroStop, saveMetroStops} from "../../services/MetroBilbaoStorage";
import {Star, StarOff} from "lucide-react";


const MetroBilbaoConfiguration: React.FC = () => {
    const [stopName, setStopName] = useState<string>('');
    const [stations, setStations] = useState<MetroStop[]>([]);
    const [filteredStations, setFilteredStations] = useState<MetroStop[]>([]);
    const [presentToast] = useIonToast();

    useIonViewWillEnter(() => {
         fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            setStations(getMetroStops());
        } catch (error) {
            console.error("Error al cargar las estaciones:", error);
        }
    };

    useEffect(() => {
        if (stations.length > 0) {
            saveMetroStops(stations);
        }
    }, [stations]);

    useEffect(() => {
        if (stations.length > 0) {
            filterStations();
        }
    }, [stopName, stations]);

    const filterStations = () => {
        let results = stations.filter(station =>
            (station.Name.toLowerCase().includes(stopName.toLowerCase()))
        );
        setFilteredStations(results);
    }



    const handleAddStop = (stop: MetroStop) => {
        const station = stations.find(s => s.Code === stop.Code);

        if (!station) return; // Evita errores si la estación no se encuentra

        const wasFavorite = station.IsFavorite; // Guardamos el estado actual

        setStations(prevStations =>
            prevStations.map(s =>
                s.Code === stop.Code ? {...s, IsFavorite: !s.IsFavorite} : s
            )
        );

        presentToast({
            message: wasFavorite
                ? `La parada "${stop.Code} - ${stop.Name}" ha sido eliminada de favoritos`
                : `Parada "${stop.Code} - ${stop.Name}" añadida a favoritos`,
            duration: 2000,
            color: wasFavorite ? 'warning' : 'success'
        });
    };


    const handleRemoveStop = (stop: MetroStop) => {
        const station = stations.find(s => s.Code === stop.Code);

        if (!station || !station.IsFavorite) return; // Solo eliminamos si es favorito

        setStations(prevStations =>
            prevStations.map(s =>
                s.Code === stop.Code ? {...s, IsFavorite: false} : s
            )
        );

        presentToast({
            message: `La parada "${stop.Code} - ${stop.Name}" ha sido eliminada de favoritos`,
            duration: 2000,
            color: 'warning'
        });
    };

    const handleToggleStop = (stop: MetroStop) => {
        const station = stations.find(s => s.Code === stop.Code);

        if (!station) return; // Evita errores si la estación no se encuentra

        const newFavoriteStatus = !station.IsFavorite;

        setStations(prevStations =>
            prevStations.map(s =>
                s.Code === stop.Code ? {...s, IsFavorite: newFavoriteStatus} : s
            )
        );

        presentToast({
            message: newFavoriteStatus
                ? `Parada "${stop.Code} - ${stop.Name}" añadida a favoritos`
                : `La parada "${stop.Code} - ${stop.Name}" ha sido eliminada de favoritos`,
            duration: 2000,
            color: newFavoriteStatus ? 'success' : 'warning'
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
                            <p>{stop.Lines.join(',')}</p>
                        </IonLabel>
                        {stop.IsFavorite ?
                            <Star color="red" onClick={() => handleRemoveStop(stop)}/> :
                            <StarOff color="gray" onClick={() => handleAddStop(stop)}/>}
                    </IonItem>
                ))}
            </IonGrid>
        </Page>
    );
};

export default MetroBilbaoConfiguration;
