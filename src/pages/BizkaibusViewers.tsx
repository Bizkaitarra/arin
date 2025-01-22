import React from 'react';
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonIcon} from '@ionic/react';
import StopsDisplay from '../components/StopsDisplay';
import {busOutline} from "ionicons/icons";

const STORAGE_KEY = 'bizkaibus_selected_stops';

const BizkaibusViewers: React.FC = () => {
    let stops = [];
    const savedStops = localStorage.getItem(STORAGE_KEY);
    if (savedStops) {
        try {
            stops = JSON.parse(savedStops);
        } catch (error) {
            console.error('Error al cargar paradas desde localStorage:', error);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle><IonIcon icon={busOutline}></IonIcon>  Visores Bizkaibus</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <StopsDisplay stops={stops}/>
            </IonContent>
        </IonPage>
    );
};

export default BizkaibusViewers;
