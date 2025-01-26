import React from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonText
} from '@ionic/react';
import StopsDisplay from '../components/StopsDisplay';
import {busOutline} from "ionicons/icons";
import {Link} from "react-router-dom";

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
            <IonContent className="ion-padding">
                {stops.length > 0 ? (
                    <StopsDisplay stops={stops} />
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <IonText>
                            <h2>No tienes paradas favoritas configuradas</h2>
                            <p>
                                Para poder ver tus paradas favoritas, debes configurarlas en la página de configuración.
                            </p>
                        </IonText>
                        <Link to="/configure-bizkaibus" style={{ textDecoration: 'none' }}>
                            <IonText color="primary" style={{ fontWeight: 'bold' }}>
                                Configurar Paradas
                            </IonText>
                        </Link>
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default BizkaibusViewers;
