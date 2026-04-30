
import React, { useEffect, useState } from 'react';
import { IonGrid, IonInput, IonItem, IonLabel, useIonViewWillEnter, IonButton } from '@ionic/react';
import { settingsOutline } from 'ionicons/icons';
import Page from "../Page";
import { addDisplay, getMetroStops, MetroStop, removeDisplay, saveMetroStops } from "../../services/MetroBilbaoStorage";
import { Star, StarOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { KBusStorage } from "../../services/KBus/KBusStorage";
import { Stop } from "../../services/Stop";
import SafeAreaBottom from '../../components/SafeAreaBottom';
import { KBusStop } from "../../services/KBus/KbusStop";


interface KBusAddStopProps {
    onComplete?: () => void;
}

const KBusAddStop: React.FC<KBusAddStopProps> = ({ onComplete }) => {
    const [stopName, setStopName] = useState<string>('');
    const [stations, setStations] = useState<KBusStop[]>([]);
    const [filteredStations, setFilteredStations] = useState<KBusStop[]>([]);
    const { t } = useTranslation();
    const storageService = new KBusStorage();

    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            let savedStations = storageService.getStations() as KBusStop[];
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



    const handleAddStop = (stop: KBusStop) => {
        storageService.addStop(stop);
        fetchStations();
    };


    const handleRemoveStop = (stop: KBusStop) => {
        storageService.removeStop(stop);
        fetchStations();
    };

    const content = (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flexShrink: 0 }}>
                <p>{t('Añade o elimina las paradas favoritas usando la estrella')}</p>
                <IonItem>
                    <IonLabel position="stacked">{t('Nombre de la parada')}</IonLabel>
                    <IonInput
                        value={stopName}
                        placeholder={t('Escribe para filtrar')}
                        onIonInput={(e) => setStopName(e.detail.value!)}
                    />
                </IonItem>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <IonGrid>
                    {filteredStations.map((stop) => (
                        <IonItem key={stop.id}>
                            <IonLabel>
                                <h3>{stop.name}</h3>
                            </IonLabel>
                            {stop.isFavorite ?
                                <Star color="red" onClick={() => handleRemoveStop(stop)} /> :
                                <StarOff color="gray" onClick={() => handleAddStop(stop)} />}
                        </IonItem>
                    ))}
                </IonGrid>
            </div>
            {/* Wizard handles navigation via "Volver" button */}
            {!onComplete && (
                <SafeAreaBottom>
                    <div style={{ flexShrink: 0 }}>
                        <IonButton onClick={onComplete}>{t('Siguiente')}</IonButton>
                    </div>
                </SafeAreaBottom>
            )}
        </div>
    );

    return onComplete ? content : <Page title={`${t('Añadir paradas')} `} icon={settingsOutline} internalPage={true}>{content}</Page>;
};

export default KBusAddStop;
