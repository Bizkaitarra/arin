import React, {useEffect, useState} from 'react';
import {IonGrid, IonItem, IonLabel, IonSearchbar, IonSegment, IonSegmentButton, useIonViewWillEnter,} from '@ionic/react';
import {settingsOutline} from 'ionicons/icons';
import Page from "../Page";
import {addDisplay, getMetroStops, MetroStop, removeDisplay, saveMetroStops} from "../../services/MetroBilbaoStorage";
import {Star, StarOff} from "lucide-react";
import {useTranslation} from "react-i18next";


const MetroBilbaoAddStop: React.FC = () => {
    const [stopName, setStopName] = useState<string>('');
    const [stations, setStations] = useState<MetroStop[]>([]);
    const [selectedLines, setSelectedLines] = useState<string[]>([]);
    const [filteredStations, setFilteredStations] = useState<MetroStop[]>([]);
    const { t } = useTranslation();

    useIonViewWillEnter(() => {
         fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            setStations(getMetroStops());
        } catch (error) {
            console.error(t("stationSelector.errorLoadingStations"), error);
        }
    };

    useEffect(() => {
        let results = stations.filter(station =>
            (station.Name.toLowerCase().includes(stopName.toLowerCase())) &&
            (selectedLines.length === 0 || station.Lines.some(line => selectedLines.includes(line)))
        );
        setFilteredStations(results);
    }, [stopName, stations, selectedLines]);

    const handleLineSegmentChange = (e: CustomEvent) => {
        const segmentValue = e.detail.value;
        if (segmentValue === 'all') {
            setSelectedLines([]);
        } else {
            setSelectedLines([segmentValue]);
        }
    };



    const handleAddStop = (stop: MetroStop) => {
        addDisplay({
            origin: stop
        })
        fetchStations();
    };


    const handleRemoveStop = (stop: MetroStop) => {
        removeDisplay({
            origin: stop
        })
        fetchStations();
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

    const allLines = ['L1', 'L2', 'L3'];

    return (
        <Page title={`${t('Añadir paradas')}`} icon={settingsOutline} internalPage={true}>
            <p>{t('Añade o elimina las paradas favoritas usando la estrella')}</p>
            <IonSearchbar
                value={stopName}
                placeholder={t('stationSelector.searchStation')}
                onIonInput={(e) => setStopName(e.detail.value!)}
            />

            <IonSegment value={selectedLines.length === 0 ? 'all' : selectedLines[0]} onIonChange={handleLineSegmentChange}>
                <IonSegmentButton value="all">
                    <IonLabel>{t('stationSelector.allLines')}</IonLabel>
                </IonSegmentButton>
                {allLines.map(line => (
                    <IonSegmentButton key={line} value={line}>
                        <IonLabel>{line}</IonLabel>
                    </IonSegmentButton>
                ))}
            </IonSegment>

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

export default MetroBilbaoAddStop;
