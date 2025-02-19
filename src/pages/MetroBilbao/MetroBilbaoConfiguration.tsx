import React, {useEffect, useState} from 'react';
import {IonGrid, IonInput, IonItem, IonLabel, useIonViewWillEnter,} from '@ionic/react';
import {settingsOutline} from 'ionicons/icons';
import Page from "../Page";
import {getMetroStops, MetroStop, saveMetroStops} from "../../services/MetroBilbaoStorage";
import {Star, StarOff} from "lucide-react";
import {useTranslation} from "react-i18next";


const MetroBilbaoConfiguration: React.FC = () => {
    const [stopName, setStopName] = useState<string>('');
    const [stations, setStations] = useState<MetroStop[]>([]);
    const [filteredStations, setFilteredStations] = useState<MetroStop[]>([]);
    const { t } = useTranslation();

    useIonViewWillEnter(() => {
         fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            setStations(getMetroStops());
        } catch (error) {
            console.error(t("Error al cargar las estaciones:"), error);
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

        if (!station) return;

        setStations(prevStations =>
            prevStations.map(s =>
                s.Code === stop.Code ? {...s, IsFavorite: !s.IsFavorite} : s
            )
        );
    };


    const handleRemoveStop = (stop: MetroStop) => {
        const station = stations.find(s => s.Code === stop.Code);

        if (!station || !station.IsFavorite) return; // Solo eliminamos si es favorito

        setStations(prevStations =>
            prevStations.map(s =>
                s.Code === stop.Code ? {...s, IsFavorite: false} : s
            )
        );
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
    };

    return (
        <Page title={`${t('Añadir paradas')} Metro Bilbao`} icon={settingsOutline}>
            <h2>{t('Añadir paradas')}</h2>
            <p>{t('Añade o elimina las paradas favoritas usando la estrella')}</p>
            <IonItem>
                <IonLabel position="stacked">{t('Nombre de la parada')}</IonLabel>
                <IonInput
                    value={stopName}
                    placeholder={t('Escribe para filtrar')}
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
