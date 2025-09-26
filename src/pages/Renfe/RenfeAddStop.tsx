import React, {useEffect, useState} from 'react';
import {IonGrid, IonInput, IonItem, IonLabel, useIonViewWillEnter,} from '@ionic/react';
import {settingsOutline} from 'ionicons/icons';
import Page from "../Page";
import {Star, StarOff} from "lucide-react";
import {useTranslation} from "react-i18next";
import {RenfeStop} from "../../services/Renfe/RenfeStop";
import {RenfeStorage} from "../../services/Renfe/RenfeStorage";


const RenfeAddStop: React.FC = () => {
    const [stopName, setStopName] = useState<string>('');
    const [stations, setStations] = useState<RenfeStop[]>([]);
    const [filteredStations, setFilteredStations] = useState<RenfeStop[]>([]);
    const { t } = useTranslation();
    const storageService = new RenfeStorage();

    useIonViewWillEnter(() => {
         fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            let savedStations = storageService.getStations() as RenfeStop[];
            savedStations.sort((a, b) => a.name.localeCompare(b.name));
            setStations(savedStations);
        } catch (error) {
            console.error(t("Error al cargar las estaciones:"), error);
        }
    };

    useEffect(() => {
        console.log(stations.length);
        if (stations.length > 0) {
            filterStations();
        }
    }, [stopName, stations]);

    const filterStations = () => {
        let results = stations.filter(station =>
            (station.name.toLowerCase().includes(stopName.toLowerCase()))
        );
        setFilteredStations(results);
    }



    const handleAddStop = (stop: RenfeStop) => {
        storageService.addStop(stop);
        fetchStations();
    };


    const handleRemoveStop = (stop: RenfeStop) => {
        storageService.removeStop(stop);
        fetchStations();
    };

    return (
        <Page title={`${t('Añadir paradas')}`} icon={settingsOutline} internalPage={true}>
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
                    <IonItem key={stop.id}>
                        <IonLabel>
                            <h3>{stop.name}</h3>
                        </IonLabel>
                        {stop.isFavorite ?
                            <Star color="red" onClick={() => handleRemoveStop(stop)}/> :
                            <StarOff color="gray" onClick={() => handleAddStop(stop)}/>}
                    </IonItem>
                ))}
            </IonGrid>
        </Page>
    );
};

export default RenfeAddStop;
