import React, {useEffect, useState} from 'react';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList} from '@ionic/react';
import {useTranslation} from 'react-i18next';
import {
    addDisplay,
    getEuskotrenStops,
    EuskotrenStop,
    removeDisplay,
} from '../../services/Euskotren/EuskotrenStorage';
import EuskotrenStopCard from "../../components/Euskotren/EuskotrenStopCard";
import {Display} from "../../services/Euskotren/Display";

const AddStop: React.FC = () => {
    const {t} = useTranslation();
    const [stops, setStops] = useState<EuskotrenStop[]>([]);

    useEffect(() => {
        const loadedStops = getEuskotrenStops(true);
        setStops(loadedStops);
    }, []);

    const handleFavoriteToggle = (stop: EuskotrenStop) => {
        const display: Display = {
            origin: stop
        }
        if (stop.IsFavorite) {
            removeDisplay(display);
        } else {
            addDisplay(display);
        }
        const loadedStops = getEuskotrenStops(true);
        setStops(loadedStops);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/"/>
                    </IonButtons>
                    <IonTitle>{t('Seleccionar parada de Euskotren')}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {stops.map((stop) => (
                        <EuskotrenStopCard
                            key={stop.Code}
                            station={stop}
                            onFavoriteToggle={() => handleFavoriteToggle(stop)}
                        />
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default AddStop;
